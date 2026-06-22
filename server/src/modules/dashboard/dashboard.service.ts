import { Prisma } from '../../generated/prisma/client.js'
import { ValidationError } from '../../lib/errors.js'
import { prisma } from '../../lib/prisma.js'
import type { DashboardQuery } from './dashboard.schemas.js'

/**
 * Org dashboard analytics — the "how do we pay people?" surface. Every figure is
 * computed in Postgres over active employees' current salary, normalized to the
 * chosen reporting currency via the fx_rates join. Money is rounded and returned
 * as text from SQL so there's no Decimal/float handling in Node.
 *
 * Normalization: amount(local) * rate_to_base = base(USD); dividing by the
 * reporting currency's own rate_to_base converts base -> reporting.
 */

/** Distribution bucket edges, in the base currency (USD). */
const BUCKET_EDGES = [50_000, 75_000, 100_000, 125_000, 150_000, 200_000]

/** Active employees joined to their current salary and its FX rate. */
const ACTIVE_CURRENT_SALARY = Prisma.sql`
  FROM employees e
  JOIN salary_records sr ON sr.id = e.current_salary_id
  JOIN fx_rates f ON f.currency = sr.currency
  WHERE e.status = 'active'
`

interface SummaryRow {
  headcount: number
  total_payroll: string
  average_salary: string
  median_salary: string
}

interface GroupRow {
  group: string
  headcount: number
  total_payroll: string
  average_salary: string
}

interface BucketRow {
  bucket: number
  count: number
}

interface RecentChangeRow {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  amount: string
  currency: string
  amount_reporting: string
  effective_date: Date
  reason: string
  created_at: Date
}

export interface DashboardResult {
  reportingCurrency: string
  headcount: number
  totalPayroll: string
  averageSalary: string
  medianSalary: string
  distribution: Array<{ min: string; max: string | null; count: number }>
  byCountry: Array<{ country: string; headcount: number; totalPayroll: string; averageSalary: string }>
  byDepartment: Array<{ department: string; headcount: number; totalPayroll: string; averageSalary: string }>
  recentChanges: Array<{
    id: string
    employeeId: string
    name: string
    amount: string
    currency: string
    amountReporting: string
    effectiveDate: Date
    reason: string
    createdAt: Date
  }>
}

/** Resolve the reporting currency's rate to base, or 400 if it isn't a known code. */
async function reportingRate(currency: string): Promise<string> {
  const fx = await prisma.fxRate.findUnique({ where: { currency } })
  if (!fx) {
    throw new ValidationError(`Unknown reporting currency: ${currency}`)
  }
  return fx.rateToBase.toString()
}

function groupQuery(column: Prisma.Sql, rate: string) {
  return prisma.$queryRaw<GroupRow[]>`
    SELECT ${column} AS "group",
      count(*)::int AS headcount,
      round(sum(sr.amount * f.rate_to_base) / ${rate}::numeric, 2)::text AS total_payroll,
      round(avg(sr.amount * f.rate_to_base) / ${rate}::numeric, 2)::text AS average_salary
    ${ACTIVE_CURRENT_SALARY}
    GROUP BY ${column}
    ORDER BY sum(sr.amount * f.rate_to_base) DESC
  `
}

export async function getDashboard(query: DashboardQuery): Promise<DashboardResult> {
  const rate = await reportingRate(query.currency)

  const [summary, distributionRows, byCountry, byDepartment, recentChanges] = await Promise.all([
    prisma.$queryRaw<SummaryRow[]>`
      SELECT count(*)::int AS headcount,
        COALESCE(round(sum(sr.amount * f.rate_to_base) / ${rate}::numeric, 2), 0)::text AS total_payroll,
        COALESCE(round(avg(sr.amount * f.rate_to_base) / ${rate}::numeric, 2), 0)::text AS average_salary,
        COALESCE(round(
          (percentile_cont(0.5) WITHIN GROUP (ORDER BY sr.amount * f.rate_to_base))::numeric / ${rate}::numeric,
          2), 0)::text AS median_salary
      ${ACTIVE_CURRENT_SALARY}
    `,
    prisma.$queryRaw<BucketRow[]>`
      SELECT width_bucket(sr.amount * f.rate_to_base, ${BUCKET_EDGES}::numeric[]) AS bucket,
        count(*)::int AS count
      ${ACTIVE_CURRENT_SALARY}
      GROUP BY bucket
      ORDER BY bucket
    `,
    groupQuery(Prisma.sql`e.country`, rate),
    groupQuery(Prisma.sql`e.department`, rate),
    prisma.$queryRaw<RecentChangeRow[]>`
      SELECT sr.id, sr.employee_id, e.first_name, e.last_name,
        sr.amount::text AS amount, sr.currency,
        round(sr.amount * f.rate_to_base / ${rate}::numeric, 2)::text AS amount_reporting,
        sr.effective_date, sr.reason, sr.created_at
      FROM salary_records sr
      JOIN employees e ON e.id = sr.employee_id
      JOIN fx_rates f ON f.currency = sr.currency
      ORDER BY sr.created_at DESC, sr.effective_date DESC
      LIMIT 10
    `,
  ])

  return {
    reportingCurrency: query.currency,
    headcount: summary[0].headcount,
    totalPayroll: summary[0].total_payroll,
    averageSalary: summary[0].average_salary,
    medianSalary: summary[0].median_salary,
    distribution: buildDistribution(distributionRows, rate),
    byCountry: byCountry.map((row) => ({
      country: row.group,
      headcount: row.headcount,
      totalPayroll: row.total_payroll,
      averageSalary: row.average_salary,
    })),
    byDepartment: byDepartment.map((row) => ({
      department: row.group,
      headcount: row.headcount,
      totalPayroll: row.total_payroll,
      averageSalary: row.average_salary,
    })),
    recentChanges: recentChanges.map((row) => ({
      id: row.id,
      employeeId: row.employee_id,
      name: `${row.first_name} ${row.last_name}`,
      amount: row.amount,
      currency: row.currency,
      amountReporting: row.amount_reporting,
      effectiveDate: row.effective_date,
      reason: row.reason,
      createdAt: row.created_at,
    })),
  }
}

/** Bucket boundaries are anchored in USD; labels are converted to the reporting currency. */
function buildDistribution(rows: BucketRow[], rate: string) {
  const counts = new Map(rows.map((row) => [row.bucket, row.count]))
  const rateNum = Number(rate)
  const toReporting = (usd: number) => (usd / rateNum).toFixed(2)

  // width_bucket returns 0..N: 0 is below the first edge, N is at/above the last.
  return Array.from({ length: BUCKET_EDGES.length + 1 }, (_, bucket) => {
    const lowerUsd = bucket === 0 ? 0 : BUCKET_EDGES[bucket - 1]
    const upperUsd = bucket < BUCKET_EDGES.length ? BUCKET_EDGES[bucket] : null
    return {
      min: toReporting(lowerUsd),
      max: upperUsd === null ? null : toReporting(upperUsd),
      count: counts.get(bucket) ?? 0,
    }
  })
}
