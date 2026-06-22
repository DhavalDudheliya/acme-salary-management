import { describe, expect, it } from 'vitest'

import { fxRatesUpdateSchema } from './fx.schemas.js'

describe('fxRatesUpdateSchema', () => {
  it('uppercases currency codes', () => {
    const parsed = fxRatesUpdateSchema.parse({ rates: [{ currency: 'gbp', rateToBase: 1.3 }] })
    expect(parsed.rates[0].currency).toBe('GBP')
  })

  it('accepts the base currency at exactly 1', () => {
    expect(fxRatesUpdateSchema.safeParse({ rates: [{ currency: 'USD', rateToBase: 1 }] }).success).toBe(true)
  })

  it('rejects the base currency at a rate other than 1', () => {
    expect(fxRatesUpdateSchema.safeParse({ rates: [{ currency: 'USD', rateToBase: 1.05 }] }).success).toBe(false)
  })

  it('rejects duplicate currencies', () => {
    const input = { rates: [{ currency: 'EUR', rateToBase: 1.1 }, { currency: 'eur', rateToBase: 1.2 }] }
    expect(fxRatesUpdateSchema.safeParse(input).success).toBe(false)
  })

  it('rejects an empty rates array', () => {
    expect(fxRatesUpdateSchema.safeParse({ rates: [] }).success).toBe(false)
  })

  it('rejects a non-positive rate', () => {
    expect(fxRatesUpdateSchema.safeParse({ rates: [{ currency: 'EUR', rateToBase: 0 }] }).success).toBe(false)
  })

  it('rejects a malformed currency code', () => {
    expect(fxRatesUpdateSchema.safeParse({ rates: [{ currency: 'EU', rateToBase: 1.1 }] }).success).toBe(false)
  })
})
