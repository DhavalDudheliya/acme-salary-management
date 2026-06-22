import { describe, expect, it } from 'vitest'

import { dashboardQuerySchema } from './dashboard.schemas.js'

describe('dashboardQuerySchema', () => {
  it('defaults the reporting currency to USD', () => {
    expect(dashboardQuerySchema.parse({}).currency).toBe('USD')
  })

  it('uppercases a provided currency', () => {
    expect(dashboardQuerySchema.parse({ currency: 'eur' }).currency).toBe('EUR')
  })

  it('rejects a malformed currency code', () => {
    expect(dashboardQuerySchema.safeParse({ currency: 'US' }).success).toBe(false)
  })
})
