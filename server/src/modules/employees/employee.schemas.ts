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
