import { describe, expect, it } from 'vitest'

import {
  createEmployeeSchema,
  employeeIdParamSchema,
  employeeListQuerySchema,
  salaryChangeSchema,
  updateEmployeeSchema,
} from './employee.schemas.js'

const validCreateInput = {
  firstName: 'Test',
  lastName: 'Person',
  email: 'Test.Person@acme.example',
  country: 'Spain',
  department: 'Engineering',
  jobTitle: 'Senior Software Engineer',
  currency: 'eur',
  hireDate: '2024-02-15',
  salary: { amount: 72000 },
}

describe('createEmployeeSchema', () => {
  it('normalizes email to lowercase and currency to uppercase', () => {
    const parsed = createEmployeeSchema.parse(validCreateInput)
    expect(parsed.email).toBe('test.person@acme.example')
    expect(parsed.currency).toBe('EUR')
  })

  it('defaults status to active and the salary reason to hire', () => {
    const parsed = createEmployeeSchema.parse(validCreateInput)
    expect(parsed.status).toBe('active')
    expect(parsed.salary.reason).toBe('hire')
  })

  it('parses hireDate into a UTC-midnight Date', () => {
    const parsed = createEmployeeSchema.parse(validCreateInput)
    expect(parsed.hireDate).toBeInstanceOf(Date)
    expect(parsed.hireDate.toISOString()).toBe('2024-02-15T00:00:00.000Z')
  })

  it('rejects a non-ISO currency code', () => {
    expect(createEmployeeSchema.safeParse({ ...validCreateInput, currency: 'EU' }).success).toBe(false)
  })

  it('rejects a non-positive salary amount', () => {
    const input = { ...validCreateInput, salary: { amount: -5 } }
    expect(createEmployeeSchema.safeParse(input).success).toBe(false)
  })

  it('rejects a salary effectiveDate before the hire date', () => {
    const input = { ...validCreateInput, salary: { amount: 50000, effectiveDate: '2020-01-01' } }
    const result = createEmployeeSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['salary', 'effectiveDate'])
  })

  it('rejects a malformed hire date', () => {
    expect(createEmployeeSchema.safeParse({ ...validCreateInput, hireDate: '15-02-2024' }).success).toBe(false)
  })
})

describe('updateEmployeeSchema', () => {
  it('accepts a partial update and normalizes email', () => {
    const parsed = updateEmployeeSchema.parse({ department: 'Product', email: 'New.Email@acme.example' })
    expect(parsed).toEqual({ department: 'Product', email: 'new.email@acme.example' })
  })

  it('rejects an empty update', () => {
    expect(updateEmployeeSchema.safeParse({}).success).toBe(false)
  })

  it('strips salary, leaving nothing to update -> invalid', () => {
    expect(updateEmployeeSchema.safeParse({ salary: { amount: 1 } }).success).toBe(false)
  })

  it('rejects an invalid status', () => {
    expect(updateEmployeeSchema.safeParse({ status: 'archived' }).success).toBe(false)
  })
})

describe('salaryChangeSchema', () => {
  it('parses amount, effectiveDate, and reason', () => {
    const parsed = salaryChangeSchema.parse({
      amount: 90000,
      effectiveDate: '2025-06-01',
      reason: 'merit increase',
    })
    expect(parsed.amount).toBe(90000)
    expect(parsed.effectiveDate.toISOString()).toBe('2025-06-01T00:00:00.000Z')
    expect(parsed.reason).toBe('merit increase')
  })

  it('requires an effective date', () => {
    expect(salaryChangeSchema.safeParse({ amount: 90000, reason: 'raise' }).success).toBe(false)
  })

  it('requires a non-empty reason', () => {
    const input = { amount: 90000, effectiveDate: '2025-06-01', reason: '' }
    expect(salaryChangeSchema.safeParse(input).success).toBe(false)
  })

  it('rejects a non-positive amount', () => {
    const input = { amount: 0, effectiveDate: '2025-06-01', reason: 'raise' }
    expect(salaryChangeSchema.safeParse(input).success).toBe(false)
  })
})

describe('employeeIdParamSchema', () => {
  it('accepts a valid uuid', () => {
    const id = '04b57c99-2638-4cb4-b309-f35d3abd79e4'
    expect(employeeIdParamSchema.parse({ id }).id).toBe(id)
  })

  it('rejects a non-uuid id', () => {
    expect(employeeIdParamSchema.safeParse({ id: 'not-a-uuid' }).success).toBe(false)
  })
})

describe('employeeListQuerySchema', () => {
  it('applies pagination defaults when omitted', () => {
    expect(employeeListQuerySchema.parse({})).toMatchObject({ page: 1, pageSize: 25 })
  })

  it('coerces numeric query strings', () => {
    const parsed = employeeListQuerySchema.parse({ page: '3', pageSize: '50' })
    expect(parsed.page).toBe(3)
    expect(parsed.pageSize).toBe(50)
  })

  it('rejects a page below 1', () => {
    expect(employeeListQuerySchema.safeParse({ page: '0' }).success).toBe(false)
  })

  it('rejects a pageSize above the 100 cap', () => {
    expect(employeeListQuerySchema.safeParse({ pageSize: '101' }).success).toBe(false)
  })

  it('accepts a valid descending sort token', () => {
    expect(employeeListQuerySchema.parse({ sort: '-hireDate' }).sort).toBe('-hireDate')
  })

  it('rejects an unknown sort field', () => {
    expect(employeeListQuerySchema.safeParse({ sort: 'salary' }).success).toBe(false)
  })

  it('rejects a status outside the enum', () => {
    expect(employeeListQuerySchema.safeParse({ status: 'archived' }).success).toBe(false)
  })
})
