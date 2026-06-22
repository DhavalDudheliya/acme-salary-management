import request from 'supertest'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

const app = createApp()

const TEST_NEW_CURRENCY = 'ZAR'
let gbpOriginal: string

// Snapshot the rate we edit and remove any test-only currency, so the seed FX
// table is left exactly as it was.
beforeEach(async () => {
  const gbp = await prisma.fxRate.findUnique({ where: { currency: 'GBP' } })
  gbpOriginal = gbp!.rateToBase.toString()
  await prisma.fxRate.deleteMany({ where: { currency: TEST_NEW_CURRENCY } })
})

afterEach(async () => {
  await prisma.fxRate.update({ where: { currency: 'GBP' }, data: { rateToBase: gbpOriginal } })
  await prisma.fxRate.deleteMany({ where: { currency: TEST_NEW_CURRENCY } })
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET /api/fx-rates', () => {
  it('returns the base currency and the rate table including the base at 1', async () => {
    const res = await request(app).get('/api/fx-rates')

    expect(res.status).toBe(200)
    expect(res.body.base).toBe('USD')
    expect(Array.isArray(res.body.rates)).toBe(true)

    const usd = res.body.rates.find((r: { currency: string }) => r.currency === 'USD')
    expect(usd.rateToBase).toBe('1')
  })

  it('sorts rates by currency code', async () => {
    const res = await request(app).get('/api/fx-rates')
    const codes: string[] = res.body.rates.map((r: { currency: string }) => r.currency)
    expect(codes).toEqual([...codes].sort())
  })
})

describe('PUT /api/fx-rates', () => {
  it('updates an existing rate and returns the full table', async () => {
    const res = await request(app)
      .put('/api/fx-rates')
      .send({ rates: [{ currency: 'gbp', rateToBase: 1.3 }] })

    expect(res.status).toBe(200)
    const gbp = res.body.rates.find((r: { currency: string }) => r.currency === 'GBP')
    expect(gbp.rateToBase).toBe('1.3')
  })

  it('inserts a new currency (upsert create path)', async () => {
    const res = await request(app)
      .put('/api/fx-rates')
      .send({ rates: [{ currency: TEST_NEW_CURRENCY, rateToBase: 0.054 }] })

    expect(res.status).toBe(200)
    const added = res.body.rates.find((r: { currency: string }) => r.currency === TEST_NEW_CURRENCY)
    expect(added.rateToBase).toBe('0.054')
  })

  it('rejects changing the base currency away from 1 with 400', async () => {
    const res = await request(app)
      .put('/api/fx-rates')
      .send({ rates: [{ currency: 'USD', rateToBase: 1.05 }] })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('rejects duplicate currencies with 400', async () => {
    const res = await request(app)
      .put('/api/fx-rates')
      .send({ rates: [{ currency: 'EUR', rateToBase: 1.1 }, { currency: 'eur', rateToBase: 1.2 }] })

    expect(res.status).toBe(400)
  })

  it('rejects an empty rates array with 400', async () => {
    const res = await request(app).put('/api/fx-rates').send({ rates: [] })
    expect(res.status).toBe(400)
  })
})
