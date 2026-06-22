import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

/**
 * Read-only integration tests against the seeded Postgres. Assertions favor
 * internal invariants (counts that must reconcile, normalization ratios) over
 * hard-coded seed totals, so they stay robust while still checking real values.
 */
const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET /api/dashboard', () => {
  it('returns a compact summary in the base currency by default', async () => {
    const res = await request(app).get('/api/dashboard')

    expect(res.status).toBe(200)
    expect(res.body.reportingCurrency).toBe('USD')
    expect(res.body.headcount).toBeGreaterThan(0)
    expect(Number(res.body.totalPayroll)).toBeGreaterThan(0)
    expect(Number(res.body.averageSalary)).toBeGreaterThan(0)
    expect(Number(res.body.medianSalary)).toBeGreaterThan(0)
  })

  it('distribution bucket counts reconcile to the headcount', async () => {
    const res = await request(app).get('/api/dashboard')

    expect(res.body.distribution).toHaveLength(7)
    const total = res.body.distribution.reduce((sum: number, b: { count: number }) => sum + b.count, 0)
    expect(total).toBe(res.body.headcount)
  })

  it('by-country headcounts reconcile to the total headcount', async () => {
    const res = await request(app).get('/api/dashboard')

    const total = res.body.byCountry.reduce((sum: number, c: { headcount: number }) => sum + c.headcount, 0)
    expect(total).toBe(res.body.headcount)
    expect(res.body.byCountry[0]).toMatchObject({
      country: expect.any(String),
      headcount: expect.any(Number),
      totalPayroll: expect.any(String),
    })
  })

  it('orders by-country breakdown by total payroll descending', async () => {
    const res = await request(app).get('/api/dashboard')
    const totals = res.body.byCountry.map((c: { totalPayroll: string }) => Number(c.totalPayroll))
    for (let i = 1; i < totals.length; i += 1) {
      expect(totals[i]).toBeLessThanOrEqual(totals[i - 1])
    }
  })

  it('returns up to 10 recent changes, newest first', async () => {
    const res = await request(app).get('/api/dashboard')

    expect(res.body.recentChanges.length).toBeLessThanOrEqual(10)
    const times = res.body.recentChanges.map((c: { createdAt: string }) => c.createdAt)
    for (let i = 1; i < times.length; i += 1) {
      expect(times[i] <= times[i - 1]).toBe(true)
    }
  })

  it('normalizes totals to the requested reporting currency', async () => {
    const usd = await request(app).get('/api/dashboard')
    const eur = await request(app).get('/api/dashboard?currency=eur')

    expect(eur.body.reportingCurrency).toBe('EUR')
    // EUR rate_to_base is 1.08, so the EUR total is the USD total divided by 1.08.
    const ratio = Number(usd.body.totalPayroll) / Number(eur.body.totalPayroll)
    expect(ratio).toBeCloseTo(1.08, 2)
  })

  it('rejects an unknown reporting currency with 400', async () => {
    const res = await request(app).get('/api/dashboard?currency=XYZ')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('rejects a malformed currency code with 400', async () => {
    const res = await request(app).get('/api/dashboard?currency=US')
    expect(res.status).toBe(400)
  })
})
