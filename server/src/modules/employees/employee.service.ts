import { Prisma } from '../../generated/prisma/client.js'
import { ConflictError, NotFoundError } from '../../lib/errors.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateEmployeeInput, EmployeeListQuery } from './employee.schemas.js'

/**
 * Employee directory service. Query construction is split into pure helpers
 * (`buildWhere`, `buildOrderBy`, `toSkipTake`) so the filter/sort/pagination
 * logic is unit-testable without a database; `listEmployees` is the thin data
 * access layer on top.
 */

export type EmployeeFilters = Pick<
  EmployeeListQuery,
  'q' | 'country' | 'department' | 'status'
>

/** Build a Prisma `where` from validated directory filters. */
export function buildWhere(filters: EmployeeFilters): Prisma.EmployeeWhereInput {
  const where: Prisma.EmployeeWhereInput = {}

  if (filters.status) {
    where.status = filters.status
  }
  if (filters.country) {
    where.country = filters.country
  }
  if (filters.department) {
    where.department = filters.department
  }
  if (filters.q) {
    where.OR = [
      { firstName: { contains: filters.q, mode: 'insensitive' } },
      { lastName: { contains: filters.q, mode: 'insensitive' } },
      { email: { contains: filters.q, mode: 'insensitive' } },
    ]
  }

  return where
}

/**
 * Build a Prisma `orderBy` from a sort token (e.g. `-hireDate`). Always appends
 * name + id tiebreakers so offset pagination is stable and deterministic.
 */
export function buildOrderBy(sort?: string): Prisma.EmployeeOrderByWithRelationInput[] {
  const field = sort ? (sort.startsWith('-') ? sort.slice(1) : sort) : 'lastName'
  const direction: Prisma.SortOrder = sort?.startsWith('-') ? 'desc' : 'asc'

  const primary: Prisma.EmployeeOrderByWithRelationInput = { [field]: direction }

  // Stable tiebreakers; skip whichever the primary already sorts by.
  const tiebreakers: Prisma.EmployeeOrderByWithRelationInput[] = (
    [
      { lastName: 'asc' },
      { firstName: 'asc' },
      { id: 'asc' },
    ] as Prisma.EmployeeOrderByWithRelationInput[]
  ).filter((entry) => !(field in entry))

  return [primary, ...tiebreakers]
}

/** Convert 1-based page + size into Prisma `skip`/`take`. */
export function toSkipTake(page: number, pageSize: number): { skip: number; take: number } {
  return { skip: (page - 1) * pageSize, take: pageSize }
}

/** Fields returned for each directory row, including the denormalized current salary. */
const directorySelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  country: true,
  department: true,
  jobTitle: true,
  currency: true,
  status: true,
  hireDate: true,
  currentSalary: {
    select: { amount: true, currency: true, effectiveDate: true },
  },
} satisfies Prisma.EmployeeSelect

export interface EmployeeListResult {
  rows: Prisma.EmployeeGetPayload<{ select: typeof directorySelect }>[]
  total: number
  page: number
  pageSize: number
}

/** Full profile plus the complete, newest-first salary history for the detail view. */
const detailSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  country: true,
  department: true,
  jobTitle: true,
  currency: true,
  status: true,
  hireDate: true,
  currentSalaryId: true,
  createdAt: true,
  updatedAt: true,
  salaryRecords: {
    select: {
      id: true,
      amount: true,
      currency: true,
      effectiveDate: true,
      reason: true,
      createdAt: true,
    },
    orderBy: [{ effectiveDate: 'desc' }, { createdAt: 'desc' }],
  },
} satisfies Prisma.EmployeeSelect

export type EmployeeDetail = Prisma.EmployeeGetPayload<{ select: typeof detailSelect }>

/**
 * The columns a Prisma unique-constraint (P2002) violation was on, or null if
 * the error isn't one. Handles both the classic `meta.target` shape and the
 * driver-adapter shape (`meta.driverAdapterError.cause.constraint.fields`) used
 * by Prisma 7 + pg.
 */
function uniqueViolationFields(error: unknown): string[] | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return null
  }

  const meta = error.meta as
    | {
        target?: string[] | string
        driverAdapterError?: { cause?: { constraint?: { fields?: string[] } } }
      }
    | undefined

  const driverFields = meta?.driverAdapterError?.cause?.constraint?.fields
  if (Array.isArray(driverFields)) {
    return driverFields
  }
  if (Array.isArray(meta?.target)) {
    return meta.target
  }
  return typeof meta?.target === 'string' ? [meta.target] : []
}

/**
 * Create an employee together with their first salary record, atomically:
 * insert the employee, insert the hire salary record, then point
 * current_salary_id at it — all in one transaction so the pointer is never
 * left dangling. Duplicate email surfaces as a 409.
 */
export async function createEmployee(input: CreateEmployeeInput): Promise<EmployeeDetail> {
  const { salary, ...profile } = input
  const effectiveDate = salary.effectiveDate ?? profile.hireDate

  try {
    return await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({ data: profile })
      const record = await tx.salaryRecord.create({
        data: {
          employeeId: employee.id,
          amount: salary.amount.toFixed(2),
          currency: profile.currency,
          effectiveDate,
          reason: salary.reason,
        },
      })
      return tx.employee.update({
        where: { id: employee.id },
        data: { currentSalaryId: record.id },
        select: detailSelect,
      })
    })
  } catch (error) {
    // Email is the only user-facing unique column, so any P2002 here is a
    // duplicate email (current_salary_id is set to a fresh id and never clashes).
    const fields = uniqueViolationFields(error)
    if (fields && (fields.length === 0 || fields.includes('email'))) {
      throw new ConflictError(`An employee with email "${profile.email}" already exists`)
    }
    throw error
  }
}

/** Fetch one employee with their append-only salary history. Throws if absent. */
export async function getEmployeeById(id: string): Promise<EmployeeDetail> {
  const employee = await prisma.employee.findUnique({ where: { id }, select: detailSelect })

  if (!employee) {
    throw new NotFoundError(`Employee ${id} not found`)
  }

  return employee
}

export async function listEmployees(query: EmployeeListQuery): Promise<EmployeeListResult> {
  const { page, pageSize, sort, ...filters } = query
  const where = buildWhere(filters)
  const { skip, take } = toSkipTake(page, pageSize)

  // One paged query + one count, both in the database, in a single round trip.
  const [rows, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip,
      take,
      select: directorySelect,
    }),
    prisma.employee.count({ where }),
  ])

  return { rows, total, page, pageSize }
}
