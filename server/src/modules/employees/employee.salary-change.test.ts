import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '../../lib/prisma.js'
import type { CreateEmployeeInput } from './employee.schemas.js'
import { createEmployee, createSalaryChange, getEmployeeById } from './employee.service.js'

/**
 * Atomicity tests for a salary change against the real Postgres. A change is an
 * INSERT into salary_records plus a repoint of employees.current_salary_id, in
 * one transaction. These verify the pair is all-or-nothing: a success commits
 * both effects, a failure commits neither, and concurrent changes never lose a
 * record or leave the pointer dangling.
 */

const TEST_EMAIL = 'atomicity.salary@acme.example'

const fixture: CreateEmployeeInput = {
  firstName: 'Atomic',
  lastName: 'Salary',
  email: TEST_EMAIL,
  country: 'Spain',
  department: 'Engineering',
  jobTitle: 'Engineer',
  currency: 'EUR',
  status: 'active',
  hireDate: new Date('2024-01-01T00:00:00.000Z'),
  salary: { amount: 80_000, reason: 'hire' },
}

function date(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`)
}

/** Remove the test employee (and its records) so the seed stays at exactly 10k. */
async function deleteByEmail(email: string) {
  const existing = await prisma.employee.findUnique({ where: { email } })
  if (!existing) return
  await prisma.employee.update({ where: { id: existing.id }, data: { currentSalaryId: null } })
  await prisma.salaryRecord.deleteMany({ where: { employeeId: existing.id } })
  await prisma.employee.delete({ where: { id: existing.id } })
}

let id: string

beforeEach(async () => {
  await deleteByEmail(TEST_EMAIL)
  const created = await createEmployee(fixture)
  id = created.id
})

afterEach(() => deleteByEmail(TEST_EMAIL))

afterAll(async () => {
  await prisma.$disconnect()
})

describe('createSalaryChange atomicity', () => {
  it('commits the new record and the pointer move together', async () => {
    const before = await getEmployeeById(id)
    expect(before.salaryRecords).toHaveLength(1)

    const after = await createSalaryChange(id, {
      amount: 90_000,
      effectiveDate: date('2025-06-01'),
      reason: 'merit increase',
    })

    // Both effects are visible: the record exists in history AND the pointer is on it.
    expect(after.salaryRecords).toHaveLength(2)
    const current = after.salaryRecords.find((r) => r.id === after.currentSalaryId)
    expect(current).toBeDefined()
    expect(current?.amount.toString()).toBe('90000')
    expect(current?.effectiveDate.toISOString().slice(0, 10)).toBe('2025-06-01')

    // Append-only: the original hire record is untouched.
    expect(after.salaryRecords.some((r) => r.amount.toString() === '80000')).toBe(true)
  })

  it('rolls back entirely when the insert fails — no record, pointer unchanged', async () => {
    const before = await getEmployeeById(id)
    const originalPointer = before.currentSalaryId

    // 10^13 overflows the numeric(14,2) amount column, so the INSERT throws
    // inside the transaction and the whole change must roll back.
    await expect(
      createSalaryChange(id, {
        amount: 10_000_000_000_000,
        effectiveDate: date('2025-09-01'),
        reason: 'overflow',
      }),
    ).rejects.toThrow()

    const after = await getEmployeeById(id)
    expect(after.salaryRecords).toHaveLength(1) // nothing was inserted
    expect(after.currentSalaryId).toBe(originalPointer) // pointer never moved
    expect(after.salaryRecords[0].id).toBe(originalPointer) // and still references a real record
  })

  it('serializes concurrent changes: every record lands and the pointer ends on the latest', async () => {
    // Fire all five at once. They must not deadlock (the employee row is locked
    // FOR UPDATE), and the outcome must match a serial application.
    const dates = ['2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01', '2025-05-01']

    await Promise.all(
      dates.map((d, i) =>
        createSalaryChange(id, {
          amount: 81_000 + i * 1_000,
          effectiveDate: date(d),
          reason: 'concurrent',
        }),
      ),
    )

    const after = await getEmployeeById(id)

    // Each change is its own INSERT, so all of them land — none overwrite another.
    expect(after.salaryRecords).toHaveLength(1 + dates.length)

    // The pointer is on the latest-effective record (2025-05-01, amount 85000),
    // regardless of the order the concurrent transactions committed in.
    const current = after.salaryRecords.find((r) => r.id === after.currentSalaryId)
    expect(current).toBeDefined()
    expect(current?.effectiveDate.toISOString().slice(0, 10)).toBe('2025-05-01')
    expect(current?.amount.toString()).toBe('85000')
  })
})
