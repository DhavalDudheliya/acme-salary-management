import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { apiClient } from '@/api/client'

import { DashboardView } from './DashboardView'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn() },
  API_BASE_URL: 'http://test/api',
}))

const get = apiClient.get as unknown as Mock

const DASHBOARD = {
  reportingCurrency: 'USD',
  headcount: 9319,
  totalPayroll: '822124211.00',
  averageSalary: '88220.22',
  medianSalary: '83160.00',
  distribution: [
    { min: '0.00', max: '50000.00', count: 2058 },
    { min: '200000.00', max: null, count: 96 },
  ],
  byCountry: [{ country: 'United States', headcount: 791, totalPayroll: '114891500.00', averageSalary: '145249.68' }],
  byDepartment: [{ department: 'Engineering', headcount: 948, totalPayroll: '120000000.00', averageSalary: '126582.27' }],
  recentChanges: [
    {
      id: 'sr1',
      employeeId: 'e1',
      name: 'Marco Moreau',
      amount: '152500.00',
      currency: 'EUR',
      amountReporting: '164700.00',
      effectiveDate: '2026-04-19',
      reason: 'promotion',
      createdAt: '2026-06-22T08:23:27.337Z',
    },
  ],
}

beforeEach(() => {
  get.mockReset()
  get.mockImplementation((url: string) => {
    if (url === '/fx-rates') {
      return Promise.resolve({
        data: {
          base: 'USD',
          rates: [
            { currency: 'USD', rateToBase: '1', updatedAt: '' },
            { currency: 'EUR', rateToBase: '1.08', updatedAt: '' },
          ],
        },
      })
    }
    return Promise.resolve({ data: DASHBOARD })
  })
})

function renderDashboard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardView />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DashboardView', () => {
  it('renders KPI metrics and recent changes from the API', async () => {
    renderDashboard()

    expect(await screen.findByText('9,319')).toBeInTheDocument()
    expect(screen.getByText(/\$(?:822,124,211|82,21,24,211)/)).toBeInTheDocument()
    expect(screen.getByText('Marco Moreau')).toBeInTheDocument()
  })

  it('refetches in the selected reporting currency', async () => {
    renderDashboard()
    await screen.findByText('9,319')

    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Reporting currency'))
    await user.click(await screen.findByRole('option', { name: 'EUR' }))

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith('/dashboard', expect.objectContaining({ params: { currency: 'EUR' } }))
    })
  })
})
