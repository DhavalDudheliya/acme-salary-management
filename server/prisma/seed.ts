import 'dotenv/config'

import { prisma } from '../src/lib/prisma.js'
import { Rng } from './seed/rng.js'
import {
  BASE_CURRENCY,
  COUNTRIES,
  DEPARTMENTS,
  FIRST_NAMES,
  LAST_NAMES,
  SALARY_CHANGE_REASONS,
  SENIORITIES,
} from './seed/reference-data.js'

/**
 * Deterministic seed: ~10,000 employees across a realistic multi-country
 * spread, each with 1–4 append-only salary records and a denormalized pointer
 * to their latest one. Reproducible by construction (fixed RNG seed, no clock).
 *
 * Run: `npm run seed`
 */

const RNG_SEED = 20260622
const EMPLOYEE_COUNT = 10_000

/** Fixed "today" so generated dates never depend on the system clock. */
const REFERENCE_DATE = new Date(Date.UTC(2026, 5, 1))
const EARLIEST_HIRE_YEAR = 2015
const LATEST_HIRE_YEAR = 2025

const INACTIVE_PROBABILITY = 0.07

const rng = new Rng(RNG_SEED)

// --- generation helpers ----------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

function makeDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day))
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime())
  next.setUTCMonth(next.getUTCMonth() + months)
  return next
}

function money(value: number): string {
  return value.toFixed(2)
}

// --- record shapes (kept loose; Prisma validates on insert) ----------------

interface EmployeeRow {
  id: string
  firstName: string
  lastName: string
  email: string
  country: string
  department: string
  jobTitle: string
  currency: string
  status: 'active' | 'inactive'
  hireDate: Date
}

interface SalaryRow {
  id: string
  employeeId: string
  amount: string
  currency: string
  effectiveDate: Date
  reason: string
}

interface Generated {
  employees: EmployeeRow[]
  salaries: SalaryRow[]
  /** [employeeId, latestSalaryId] used to backfill current_salary_id */
  pointers: Array<[string, string]>
}

function generate(): Generated {
  const employees: EmployeeRow[] = []
  const salaries: SalaryRow[] = []
  const pointers: Array<[string, string]> = []

  for (let i = 0; i < EMPLOYEE_COUNT; i += 1) {
    const country = rng.pick(COUNTRIES)
    const department = rng.pick(DEPARTMENTS)
    const seniority = rng.pick(SENIORITIES)
    const role = rng.pick(department.roles)
    const firstName = rng.pick(FIRST_NAMES)
    const lastName = rng.pick(LAST_NAMES)

    const id = rng.uuid()
    const jobTitle = `${seniority.prefix} ${role}`.trim()
    // Index keeps emails unique despite a small name pool.
    const email = `${firstName}.${lastName}.${i}@acme.example`.toLowerCase()

    const hireDate = makeDate(
      rng.int(EARLIEST_HIRE_YEAR, LATEST_HIRE_YEAR),
      rng.int(0, 11),
      rng.int(1, 28),
    )

    // Position within the country's hire-salary band: seniority drives it,
    // department nudges it, plus a little noise. Clamped to stay in-band.
    const bandPosition = clamp(
      seniority.bandPosition + (department.payFactor - 1) * 0.4 + (rng.float() - 0.5) * 0.16,
      0.05,
      0.99,
    )
    const roundStep = country.band[1] > 1_000_000 ? 10_000 : 500
    const hireAmount = roundTo(lerp(country.band[0], country.band[1], bandPosition), roundStep)

    employees.push({
      id,
      firstName,
      lastName,
      email,
      country: country.name,
      department: department.name,
      jobTitle,
      currency: country.currency,
      status: rng.chance(INACTIVE_PROBABILITY) ? 'inactive' : 'active',
      hireDate,
    })

    // Append-only salary history: hire record, then 0–3 raises over time.
    let currentDate = hireDate
    let currentAmount = hireAmount
    let latestId = rng.uuid()
    salaries.push({
      id: latestId,
      employeeId: id,
      amount: money(currentAmount),
      currency: country.currency,
      effectiveDate: currentDate,
      reason: 'hire',
    })

    const raises = rng.int(0, 3)
    for (let r = 0; r < raises; r += 1) {
      const nextDate = addMonths(currentDate, rng.int(10, 26))
      if (nextDate >= REFERENCE_DATE) {
        break
      }
      currentDate = nextDate
      currentAmount = roundTo(currentAmount * (1 + (0.03 + rng.float() * 0.1)), roundStep)
      latestId = rng.uuid()
      salaries.push({
        id: latestId,
        employeeId: id,
        amount: money(currentAmount),
        currency: country.currency,
        effectiveDate: currentDate,
        reason: rng.pick(SALARY_CHANGE_REASONS),
      })
    }

    pointers.push([id, latestId])
  }

  return { employees, salaries, pointers }
}

// --- persistence -----------------------------------------------------------

function* chunk<T>(items: readonly T[], size: number): Generator<T[]> {
  for (let i = 0; i < items.length; i += size) {
    yield items.slice(i, i + size)
  }
}

function fxRates() {
  const seen = new Map<string, number>()
  for (const country of COUNTRIES) {
    if (!seen.has(country.currency)) {
      seen.set(country.currency, country.rateToBase)
    }
  }
  seen.set(BASE_CURRENCY, 1)
  return [...seen].map(([currency, rateToBase]) => ({ currency, rateToBase: rateToBase.toFixed(8) }))
}

async function main() {
  console.time('seed')
  console.log(`Generating ${EMPLOYEE_COUNT.toLocaleString()} employees (seed=${RNG_SEED})...`)
  const { employees, salaries, pointers } = generate()
  console.log(`Generated ${salaries.length.toLocaleString()} salary records.`)

  // Reset for a reproducible, re-runnable seed. CASCADE clears the circular
  // employees <-> salary_records FKs together.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "salary_records", "employees", "fx_rates" RESTART IDENTITY CASCADE',
  )

  await prisma.fxRate.createMany({ data: fxRates() })

  // Insert employees first with current_salary_id left null (records don't
  // exist yet), then the records, then backfill the pointer.
  for (const rows of chunk(employees, 1000)) {
    await prisma.employee.createMany({ data: rows })
  }
  for (const rows of chunk(salaries, 2000)) {
    await prisma.salaryRecord.createMany({ data: rows })
  }

  for (const pairs of chunk(pointers, 500)) {
    const values = pairs.map((_, i) => `($${i * 2 + 1}::uuid, $${i * 2 + 2}::uuid)`).join(', ')
    const params = pairs.flat()
    await prisma.$executeRawUnsafe(
      `UPDATE "employees" AS e SET "current_salary_id" = v.salary_id
       FROM (VALUES ${values}) AS v(emp_id, salary_id)
       WHERE e.id = v.emp_id`,
      ...params,
    )
  }

  const active = employees.filter((e) => e.status === 'active').length
  console.log(
    `Inserted ${employees.length.toLocaleString()} employees ` +
      `(${active.toLocaleString()} active, ${(employees.length - active).toLocaleString()} inactive), ` +
      `${salaries.length.toLocaleString()} salary records, ${fxRates().length} FX rates.`,
  )
  console.timeEnd('seed')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
