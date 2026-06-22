import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

/**
 * Integration tests for the directory endpoint against the seeded Postgres.
 * Read-only, so they are deterministic without per-test fixtures; assertions
 * hold for any non-empty seed.
 */
const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET /api/employees', () => {
  it('returns a paginated envelope honoring the requested page size', async () => {
    const res = await request(app).get('/api/employees?pageSize=10')

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(10)
    expect(res.body.rows).toHaveLength(10)
    expect(res.body.total).toBeGreaterThanOrEqual(res.body.rows.length)
  })

  it('includes the denormalized current salary on each row', async () => {
    const res = await request(app).get('/api/employees?pageSize=1')
    const row = res.body.rows[0]

    expect(row).toMatchObject({ id: expect.any(String), email: expect.any(String) })
    expect(row.currentSalary).toMatchObject({
      amount: expect.any(String),
      currency: expect.any(String),
      effectiveDate: expect.any(String),
    })
  })

  it('filters by status, returning only matching rows', async () => {
    const res = await request(app).get('/api/employees?status=inactive&pageSize=15')

    expect(res.status).toBe(200)
    expect(res.body.rows.length).toBeGreaterThan(0)
    for (const row of res.body.rows) {
      expect(row.status).toBe('inactive')
    }
  })

  it('sorts by hire date descending when requested', async () => {
    const res = await request(app).get('/api/employees?sort=-hireDate&pageSize=20')
    const dates: string[] = res.body.rows.map((row: { hireDate: string }) => row.hireDate)

    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i] <= dates[i - 1]).toBe(true)
    }
  })

  it('narrows the total when a country filter is applied', async () => {
    const all = await request(app).get('/api/employees?pageSize=1')
    const japan = await request(app).get('/api/employees?country=Japan&pageSize=1')

    expect(japan.body.total).toBeGreaterThan(0)
    expect(japan.body.total).toBeLessThan(all.body.total)
  })

  it('rejects an out-of-range pageSize with 400 and validation details', async () => {
    const res = await request(app).get('/api/employees?pageSize=999')

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.details[0].path).toContain('pageSize')
  })

  it('rejects an unknown sort field with 400', async () => {
    const res = await request(app).get('/api/employees?sort=salary')
    expect(res.status).toBe(400)
  })
})

describe('GET /api/employees/:id', () => {
  /** Pick a real id from the directory so the detail test needs no fixtures. */
  async function anyEmployeeId(): Promise<string> {
    const res = await request(app).get('/api/employees?pageSize=1')
    return res.body.rows[0].id
  }

  it('returns the full profile and newest-first salary history', async () => {
    const id = await anyEmployeeId()
    const res = await request(app).get(`/api/employees/${id}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id, email: expect.any(String), country: expect.any(String) })
    expect(Array.isArray(res.body.salaryHistory)).toBe(true)
    expect(res.body.salaryHistory.length).toBeGreaterThanOrEqual(1)

    const dates: string[] = res.body.salaryHistory.map((r: { effectiveDate: string }) => r.effectiveDate)
    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i] <= dates[i - 1]).toBe(true)
    }
  })

  it('points current_salary_id at the latest history record', async () => {
    const id = await anyEmployeeId()
    const res = await request(app).get(`/api/employees/${id}`)

    expect(res.body.currentSalaryId).toBe(res.body.salaryHistory[0].id)
  })

  it('returns 404 with a not_found code for a valid but absent id', async () => {
    const res = await request(app).get('/api/employees/00000000-0000-4000-8000-000000000000')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })

  it('rejects a malformed id with 400', async () => {
    const res = await request(app).get('/api/employees/not-a-uuid')
    expect(res.status).toBe(400)
  })
})
