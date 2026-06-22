import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { apiClient } from '@/api/client'

import { EmployeeDetail } from './EmployeeDetail'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn() },
  API_BASE_URL: 'http://test/api',
}))

const get = apiClient.get as unknown as Mock

const DETAIL = {
  id: 'emp-1',
  firstName: 'Chloe',
  lastName: 'Garcia',
  email: 'chloe.garcia@acme.example',
  country: 'Australia',
  department: 'Engineering',
  jobTitle: 'Senior Software Engineer',
  currency: 'AUD',
  status: 'active',
  hireDate: '2016-10-13',
  currentSalaryId: 's4',
  createdAt: '2026-06-22T00:00:00.000Z',
  updatedAt: '2026-06-22T00:00:00.000Z',
  salaryHistory: [
    { id: 's4', amount: '185000', currency: 'AUD', effectiveDate: '2021-04-13', reason: 'annual review', createdAt: '2026-06-22T00:00:00.000Z' },
    { id: 's3', amount: '179500', currency: 'AUD', effectiveDate: '2019-06-13', reason: 'market adjustment', createdAt: '2026-06-22T00:00:00.000Z' },
    { id: 's2', amount: '162500', currency: 'AUD', effectiveDate: '2018-03-13', reason: 'annual review', createdAt: '2026-06-22T00:00:00.000Z' },
    { id: 's1', amount: '147000', currency: 'AUD', effectiveDate: '2016-10-13', reason: 'hire', createdAt: '2026-06-22T00:00:00.000Z' },
  ],
}

function renderDetail(id = 'emp-1') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EmployeeDetail id={id} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('EmployeeDetail', () => {
  beforeEach(() => get.mockReset())

  it('renders the profile and the full salary-history timeline', async () => {
    get.mockResolvedValue({ data: DETAIL })
    renderDetail()

    expect(await screen.findByRole('heading', { name: 'Chloe Garcia' })).toBeInTheDocument()
    expect(screen.getByText(/Senior Software Engineer/)).toBeInTheDocument()

    // Every record renders, newest first; the latest is marked Current exactly once.
    expect(screen.getByText('hire')).toBeInTheDocument()
    expect(screen.getByText('market adjustment')).toBeInTheDocument()
    expect(screen.getAllByText('Current')).toHaveLength(1)

    // Percentage change versus the previous record (185000 vs 179500).
    expect(screen.getByText('+3.1%')).toBeInTheDocument()
  })

  it('shows a downward change when a later record is lower', async () => {
    get.mockResolvedValue({
      data: {
        ...DETAIL,
        currentSalaryId: 'd2',
        salaryHistory: [
          { id: 'd2', amount: '170000', currency: 'AUD', effectiveDate: '2022-01-01', reason: 'adjustment', createdAt: '2026-06-22T00:00:00.000Z' },
          { id: 'd1', amount: '185000', currency: 'AUD', effectiveDate: '2021-04-13', reason: 'hire', createdAt: '2026-06-22T00:00:00.000Z' },
        ],
      },
    })
    renderDetail()

    // 170000 vs 185000 is about -8.1%.
    expect(await screen.findByText('-8.1%')).toBeInTheDocument()
  })
})
