import { z } from 'zod'

/**
 * Boundary validation for the employee directory. Query params arrive as
 * strings, so numbers are coerced here; the service receives clean, typed input.
 */

/** Columns the directory may sort by. `-` prefix means descending. */
export const SORT_FIELDS = [
  'lastName',
  'firstName',
  'hireDate',
  'country',
  'department',
  'status',
] as const

export type SortField = (typeof SORT_FIELDS)[number]

const sortToken = z
  .string()
  .refine(
    (value) => SORT_FIELDS.includes((value.startsWith('-') ? value.slice(1) : value) as SortField),
    { message: `sort must be one of: ${SORT_FIELDS.join(', ')} (optionally '-' prefixed)` },
  )

/** Path param for any single-employee route. */
export const employeeIdParamSchema = z.object({
  id: z.uuid(),
})

/** A `YYYY-MM-DD` calendar date, parsed to a UTC-midnight Date for DATE columns. */
const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'date is not a valid calendar date')
  .transform((value) => new Date(`${value}T00:00:00.000Z`))

const currencyCode = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, 'currency must be a 3-letter ISO 4217 code')
  .transform((value) => value.toUpperCase())

/** Max amount that fits the salary column (numeric(14,2)). */
const MAX_SALARY = 999_999_999_999.99

export const createEmployeeSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.email().max(254).transform((value) => value.toLowerCase()),
    country: z.string().trim().min(1).max(100),
    department: z.string().trim().min(1).max(100),
    jobTitle: z.string().trim().min(1).max(150),
    currency: currencyCode,
    status: z.enum(['active', 'inactive']).default('active'),
    hireDate: isoDateString,
    salary: z.object({
      amount: z.number().positive().max(MAX_SALARY),
      effectiveDate: isoDateString.optional(),
      reason: z.string().trim().min(1).max(100).default('hire'),
    }),
  })
  .refine(
    (data) => !data.salary.effectiveDate || data.salary.effectiveDate >= data.hireDate,
    { message: 'salary effectiveDate cannot be before hireDate', path: ['salary', 'effectiveDate'] },
  )

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

/**
 * Profile edit — all fields optional, but at least one required. Salary is
 * never edited here (it is append-only via POST /:id/salary), and currency is
 * intentionally excluded: changing pay currency implies a salary change, so it
 * would desync an employee from their current salary record's snapshot.
 */
export const updateEmployeeSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.email().max(254).transform((value) => value.toLowerCase()),
    country: z.string().trim().min(1).max(100),
    department: z.string().trim().min(1).max(100),
    jobTitle: z.string().trim().min(1).max(150),
    status: z.enum(['active', 'inactive']),
    hireDate: isoDateString,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'provide at least one field to update',
  })

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>

/**
 * A salary change. Appends a new record to history; currency is not supplied —
 * the record snapshots the employee's current pay currency.
 */
export const salaryChangeSchema = z.object({
  amount: z.number().positive().max(MAX_SALARY),
  effectiveDate: isoDateString,
  reason: z.string().trim().min(1).max(100),
})

export type SalaryChangeInput = z.infer<typeof salaryChangeSchema>

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  q: z.string().trim().min(1).max(100).optional(),
  country: z.string().trim().min(1).optional(),
  department: z.string().trim().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sort: sortToken.optional(),
})

export type EmployeeListQuery = z.infer<typeof employeeListQuerySchema>
