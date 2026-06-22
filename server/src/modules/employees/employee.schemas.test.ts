import { describe, expect, it } from 'vitest'

import { employeeListQuerySchema } from './employee.schemas.js'

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
