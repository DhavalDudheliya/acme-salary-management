import request from 'supertest'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

/**
 * Integration tests for the directory endpoint against the seeded Postgres.
 * Read-only, so they are deterministic without per-test fixtures; assertions
 * hold for any non-empty seed.
 */
const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

/**
 * Remove a test employee (and its FK-linked salary record) so write tests stay
 * idempotent and leave the seed at exactly 10k.
 */
async function deleteEmployeeByEmail(email: string) {
  const existing = await prisma.employee.findUnique({ where: { email } })
  if (!existing) return
  await prisma.employee.update({ where: { id: existing.id }, data: { currentSalaryId: null } })
  await prisma.salaryRecord.deleteMany({ where: { employeeId: existing.id } })
  await prisma.employee.delete({ where: { id: existing.id } })
}

describe('GET /api/employees', () => {
  it('returns a paginated envelope honoring the requested page size', async () => {
    const res = await request(app).get('/api/employees?pageSize=10')

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(10)
    expect(res.body.rows).toHaveLength(10)
    expect(res.body.total).toBeGreaterThanOrEqual(res.body.rows.length)
  })

  it('includes the denormalized current salary on each row', async () => {
    const res = await request(app).get('/api/employees?pageSize=1')
    const row = res.body.rows[0]

    expect(row).toMatchObject({ id: expect.any(String), email: expect.any(String) })
    expect(row.currentSalary).toMatchObject({
      amount: expect.any(String),
      currency: expect.any(String),
      effectiveDate: expect.any(String),
    })
  })

  it('filters by status, returning only matching rows', async () => {
    const res = await request(app).get('/api/employees?status=inactive&pageSize=15')

    expect(res.status).toBe(200)
    expect(res.body.rows.length).toBeGreaterThan(0)
    for (const row of res.body.rows) {
      expect(row.status).toBe('inactive')
    }
  })

  it('sorts by hire date descending when requested', async () => {
    const res = await request(app).get('/api/employees?sort=-hireDate&pageSize=20')
    const dates: string[] = res.body.rows.map((row: { hireDate: string }) => row.hireDate)

    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i] <= dates[i - 1]).toBe(true)
    }
  })

  it('narrows the total when a country filter is applied', async () => {
    const all = await request(app).get('/api/employees?pageSize=1')
    const japan = await request(app).get('/api/employees?country=Japan&pageSize=1')

    expect(japan.body.total).toBeGreaterThan(0)
    expect(japan.body.total).toBeLessThan(all.body.total)
  })

  it('rejects an out-of-range pageSize with 400 and validation details', async () => {
    const res = await request(app).get('/api/employees?pageSize=999')

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.details[0].path).toContain('pageSize')
  })

  it('rejects an unknown sort field with 400', async () => {
    const res = await request(app).get('/api/employees?sort=salary')
    expect(res.status).toBe(400)
  })
})

describe('GET /api/employees/:id', () => {
  /** Pick a real id from the directory so the detail test needs no fixtures. */
  async function anyEmployeeId(): Promise<string> {
    const res = await request(app).get('/api/employees?pageSize=1')
    return res.body.rows[0].id
  }

  it('returns the full profile and newest-first salary history', async () => {
    const id = await anyEmployeeId()
    const res = await request(app).get(`/api/employees/${id}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id, email: expect.any(String), country: expect.any(String) })
    expect(Array.isArray(res.body.salaryHistory)).toBe(true)
    expect(res.body.salaryHistory.length).toBeGreaterThanOrEqual(1)

    const dates: string[] = res.body.salaryHistory.map((r: { effectiveDate: string }) => r.effectiveDate)
    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i] <= dates[i - 1]).toBe(true)
    }
  })

  it('points current_salary_id at the latest history record', async () => {
    const id = await anyEmployeeId()
    const res = await request(app).get(`/api/employees/${id}`)

    expect(res.body.currentSalaryId).toBe(res.body.salaryHistory[0].id)
  })

  it('returns 404 with a not_found code for a valid but absent id', async () => {
    const res = await request(app).get('/api/employees/00000000-0000-4000-8000-000000000000')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })

  it('rejects a malformed id with 400', async () => {
    const res = await request(app).get('/api/employees/not-a-uuid')
    expect(res.status).toBe(400)
  })
})

describe('POST /api/employees', () => {
  const TEST_EMAIL = 'integration.create@acme.example'

  const newEmployee = {
    firstName: 'Integration',
    lastName: 'Create',
    email: 'Integration.Create@acme.example',
    country: 'Spain',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    currency: 'eur',
    hireDate: '2024-02-15',
    salary: { amount: 72000 },
  }

  // Keep the seed deterministic before and after each case.
  beforeEach(() => deleteEmployeeByEmail(TEST_EMAIL))
  afterEach(() => deleteEmployeeByEmail(TEST_EMAIL))

  it('creates an employee with the hire salary record and pointer set', async () => {
    const res = await request(app).post('/api/employees').send(newEmployee)

    expect(res.status).toBe(201)
    expect(res.body.email).toBe(TEST_EMAIL) // normalized to lowercase
    expect(res.body.currency).toBe('EUR')
    expect(res.body.status).toBe('active')
    expect(res.body.salaryHistory).toHaveLength(1)
    expect(res.body.salaryHistory[0]).toMatchObject({
      amount: '72000',
      reason: 'hire',
      effectiveDate: '2024-02-15',
    })
    expect(res.body.currentSalaryId).toBe(res.body.salaryHistory[0].id)
  })

  it('rejects a duplicate email with 409', async () => {
    const first = await request(app).post('/api/employees').send(newEmployee)
    expect(first.status).toBe(201)

    const second = await request(app).post('/api/employees').send(newEmployee)
    expect(second.status).toBe(409)
    expect(second.body.error.code).toBe('conflict')
  })

  it('rejects an invalid body with 400', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...newEmployee, currency: 'EU', salary: { amount: -5 } })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })
})

describe('PATCH /api/employees/:id', () => {
  const TEST_EMAIL = 'integration.update@acme.example'

  const fixture = {
    firstName: 'Integration',
    lastName: 'Update',
    email: TEST_EMAIL,
    country: 'Spain',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    currency: 'eur',
    hireDate: '2024-02-15',
    salary: { amount: 80000 },
  }

  let id: string

  // Patch a freshly created fixture (not a seed row) so nothing in the seed is mutated.
  beforeEach(async () => {
    await deleteEmployeeByEmail(TEST_EMAIL)
    const created = await request(app).post('/api/employees').send(fixture)
    id = created.body.id
  })
  afterEach(() => deleteEmployeeByEmail(TEST_EMAIL))

  it('updates only the given profile fields and preserves salary history', async () => {
    const res = await request(app)
      .patch(`/api/employees/${id}`)
      .send({ jobTitle: 'Principal Engineer', department: 'Product', status: 'inactive' })

    expect(res.status).toBe(200)
    expect(res.body.jobTitle).toBe('Principal Engineer')
    expect(res.body.department).toBe('Product')
    expect(res.body.status).toBe('inactive')
    expect(res.body.email).toBe(TEST_EMAIL) // untouched
    expect(res.body.salaryHistory).toHaveLength(1)
  })

  it('rejects an empty body with 400', async () => {
    const res = await request(app).patch(`/api/employees/${id}`).send({})
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('ignores salary and rejects a salary-only patch with 400', async () => {
    const res = await request(app).patch(`/api/employees/${id}`).send({ salary: { amount: 999 } })
    expect(res.status).toBe(400)
  })

  it('returns 409 when changing email to one already in use', async () => {
    const existing = await request(app).get('/api/employees?pageSize=1')
    const takenEmail = existing.body.rows[0].email

    const res = await request(app).patch(`/api/employees/${id}`).send({ email: takenEmail })
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('conflict')
  })

  it('returns 404 for a valid but absent id', async () => {
    const res = await request(app)
      .patch('/api/employees/00000000-0000-4000-8000-000000000000')
      .send({ jobTitle: 'X' })

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })

  it('rejects a malformed id with 400', async () => {
    const res = await request(app).patch('/api/employees/not-a-uuid').send({ jobTitle: 'X' })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/employees/:id', () => {
  const TEST_EMAIL = 'integration.delete@acme.example'

  const fixture = {
    firstName: 'Integration',
    lastName: 'Delete',
    email: TEST_EMAIL,
    country: 'Spain',
    department: 'Engineering',
    jobTitle: 'Engineer',
    currency: 'eur',
    hireDate: '2024-02-15',
    salary: { amount: 60000 },
  }

  let id: string

  beforeEach(async () => {
    await deleteEmployeeByEmail(TEST_EMAIL)
    const created = await request(app).post('/api/employees').send(fixture)
    id = created.body.id
  })
  afterEach(() => deleteEmployeeByEmail(TEST_EMAIL))

  it('soft-deletes by setting status to inactive and keeps the record', async () => {
    const res = await request(app).delete(`/api/employees/${id}`)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('inactive')
    expect(res.body.salaryHistory).toHaveLength(1)

    // Still retrievable — not hard-deleted.
    const fetched = await request(app).get(`/api/employees/${id}`)
    expect(fetched.status).toBe(200)
    expect(fetched.body.status).toBe('inactive')
  })

  it('is idempotent for an already-inactive employee', async () => {
    await request(app).delete(`/api/employees/${id}`)
    const again = await request(app).delete(`/api/employees/${id}`)

    expect(again.status).toBe(200)
    expect(again.body.status).toBe('inactive')
  })

  it('returns 404 for a valid but absent id', async () => {
    const res = await request(app).delete('/api/employees/00000000-0000-4000-8000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })

  it('rejects a malformed id with 400', async () => {
    const res = await request(app).delete('/api/employees/not-a-uuid')
    expect(res.status).toBe(400)
  })
})

describe('GET /api/employees/export', () => {
  const HEADER =
    'id,firstName,lastName,email,country,department,jobTitle,currency,status,hireDate,' +
    'currentSalaryAmount,currentSalaryCurrency,currentSalaryEffectiveDate'

  function parseCsv(text: string) {
    const lines = text.trim().split('\n')
    const header = lines[0]
    const columns = header.split(',')
    // Seed fields contain no commas, so a naive split is safe here.
    const rows = lines.slice(1).map((line) => {
      const cells = line.split(',')
      return Object.fromEntries(columns.map((c, i) => [c, cells[i]])) as Record<string, string>
    })
    return { header, rows }
  }

  it('streams a CSV download with the expected header and attachment disposition', async () => {
    const res = await request(app).get('/api/employees/export')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/csv')
    expect(res.headers['content-disposition']).toContain('attachment')

    const { header, rows } = parseCsv(res.text)
    expect(header).toBe(HEADER)
    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0].currentSalaryAmount).not.toBe('')
  })

  it('applies the same filters as the directory', async () => {
    const res = await request(app).get('/api/employees/export?country=Japan&status=active')
    const { rows } = parseCsv(res.text)

    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      expect(row.country).toBe('Japan')
      expect(row.status).toBe('active')
    }
  })

  it('rejects an invalid sort with 400 before streaming', async () => {
    const res = await request(app).get('/api/employees/export?sort=salary')
    expect(res.status).toBe(400)
  })
})

describe('POST /api/employees/:id/salary', () => {
  const TEST_EMAIL = 'integration.salary@acme.example'

  const fixture = {
    firstName: 'Integration',
    lastName: 'Salary',
    email: TEST_EMAIL,
    country: 'Spain',
    department: 'Engineering',
    jobTitle: 'Engineer',
    currency: 'eur',
    hireDate: '2024-02-15',
    salary: { amount: 80000 },
  }

  let id: string

  beforeEach(async () => {
    await deleteEmployeeByEmail(TEST_EMAIL)
    const created = await request(app).post('/api/employees').send(fixture)
    id = created.body.id
  })
  afterEach(() => deleteEmployeeByEmail(TEST_EMAIL))

  it('appends a raise, makes it current, and snapshots the pay currency', async () => {
    const res = await request(app)
      .post(`/api/employees/${id}/salary`)
      .send({ amount: 90000, effectiveDate: '2025-06-01', reason: 'merit increase' })

    expect(res.status).toBe(201)
    expect(res.body.salaryHistory).toHaveLength(2)

    const current = res.body.salaryHistory[0]
    expect(current).toMatchObject({ amount: '90000', effectiveDate: '2025-06-01', currency: 'EUR' })
    expect(res.body.currentSalaryId).toBe(current.id)

    // Append-only: the original hire record is still present and unchanged.
    expect(res.body.salaryHistory.some((r: { amount: string }) => r.amount === '80000')).toBe(true)
  })

  it('keeps a back-dated change in history without making it current', async () => {
    await request(app)
      .post(`/api/employees/${id}/salary`)
      .send({ amount: 90000, effectiveDate: '2025-06-01', reason: 'merit increase' })

    const res = await request(app)
      .post(`/api/employees/${id}/salary`)
      .send({ amount: 70000, effectiveDate: '2024-08-01', reason: 'adjustment' })

    expect(res.status).toBe(201)
    expect(res.body.salaryHistory).toHaveLength(3)

    // Current remains the latest-effective record, not the back-dated one.
    const current = res.body.salaryHistory[0]
    expect(current).toMatchObject({ amount: '90000', effectiveDate: '2025-06-01' })
    expect(res.body.currentSalaryId).toBe(current.id)
  })

  it('returns 404 for a valid but absent employee', async () => {
    const res = await request(app)
      .post('/api/employees/00000000-0000-4000-8000-000000000000/salary')
      .send({ amount: 90000, effectiveDate: '2025-06-01', reason: 'raise' })

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })

  it('rejects a body missing the effective date with 400', async () => {
    const res = await request(app)
      .post(`/api/employees/${id}/salary`)
      .send({ amount: 90000, reason: 'raise' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('rejects a malformed id with 400', async () => {
    const res = await request(app)
      .post('/api/employees/not-a-uuid/salary')
      .send({ amount: 90000, effectiveDate: '2025-06-01', reason: 'raise' })

    expect(res.status).toBe(400)
  })
})
