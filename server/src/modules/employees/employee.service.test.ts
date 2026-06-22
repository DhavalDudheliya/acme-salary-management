import { describe, expect, it } from 'vitest'

import { buildOrderBy, buildWhere, toSkipTake } from './employee.service.js'

describe('buildWhere', () => {
  it('is empty when no filters are given', () => {
    expect(buildWhere({})).toEqual({})
  })

  it('maps scalar filters to equality conditions', () => {
    expect(buildWhere({ status: 'active', country: 'Japan', department: 'Engineering' })).toEqual({
      status: 'active',
      country: 'Japan',
      department: 'Engineering',
    })
  })

  it('expands a search term to a case-insensitive OR over name and email', () => {
    expect(buildWhere({ q: 'patel' })).toEqual({
      OR: [
        { firstName: { contains: 'patel', mode: 'insensitive' } },
        { lastName: { contains: 'patel', mode: 'insensitive' } },
        { email: { contains: 'patel', mode: 'insensitive' } },
      ],
    })
  })

  it('combines a search term with scalar filters', () => {
    const where = buildWhere({ q: 'kim', status: 'inactive' })
    expect(where.status).toBe('inactive')
    expect(where.OR).toHaveLength(3)
  })
})

describe('buildOrderBy', () => {
  it('defaults to last name with stable name + id tiebreakers', () => {
    expect(buildOrderBy()).toEqual([{ lastName: 'asc' }, { firstName: 'asc' }, { id: 'asc' }])
  })

  it('sorts ascending by the requested field, then tiebreakers', () => {
    expect(buildOrderBy('hireDate')).toEqual([
      { hireDate: 'asc' },
      { lastName: 'asc' },
      { firstName: 'asc' },
      { id: 'asc' },
    ])
  })

  it('treats a leading "-" as descending', () => {
    expect(buildOrderBy('-hireDate')[0]).toEqual({ hireDate: 'desc' })
  })

  it('does not duplicate the primary field in the tiebreakers', () => {
    expect(buildOrderBy('lastName')).toEqual([
      { lastName: 'asc' },
      { firstName: 'asc' },
      { id: 'asc' },
    ])
  })
})

describe('toSkipTake', () => {
  it('returns no offset for the first page', () => {
    expect(toSkipTake(1, 25)).toEqual({ skip: 0, take: 25 })
  })

  it('offsets by full pages for later pages', () => {
    expect(toSkipTake(3, 20)).toEqual({ skip: 40, take: 20 })
  })
})
