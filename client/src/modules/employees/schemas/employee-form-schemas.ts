import { z } from 'zod'

/**
 * Client form schemas, mirroring the API's validation so errors surface before
 * the request. Inputs are strings, so numbers are coerced.
 */

const name = z.string().trim().min(1, 'Required').max(100)
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')
const currency = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, 'Use a 3-letter currency code')
const amount = z.coerce.number({ message: 'Enter an amount' }).positive('Must be greater than 0')

export const createEmployeeFormSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.string().trim().email('Enter a valid email').max(254),
  country: z.string().trim().min(1, 'Required'),
  department: z.string().trim().min(1, 'Required'),
  jobTitle: z.string().trim().min(1, 'Required').max(150),
  currency,
  hireDate: isoDate,
  amount,
})

export type CreateEmployeeFormInput = z.input<typeof createEmployeeFormSchema>
export type CreateEmployeeForm = z.output<typeof createEmployeeFormSchema>

/** Profile edit — currency and salary are intentionally not editable here. */
export const editEmployeeFormSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.string().trim().email('Enter a valid email').max(254),
  country: z.string().trim().min(1, 'Required'),
  department: z.string().trim().min(1, 'Required'),
  jobTitle: z.string().trim().min(1, 'Required').max(150),
  status: z.enum(['active', 'inactive']),
})

export type EditEmployeeForm = z.infer<typeof editEmployeeFormSchema>

export const salaryChangeFormSchema = z.object({
  amount,
  effectiveDate: isoDate,
  reason: z.string().trim().min(1, 'Required').max(100),
})

export type SalaryChangeFormInput = z.input<typeof salaryChangeFormSchema>
export type SalaryChangeForm = z.output<typeof salaryChangeFormSchema>
