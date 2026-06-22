import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { apiClient } from '@/api/client'

import { EmployeeDirectory } from './EmployeeDirectory'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn() },
  API_BASE_URL: 'http://test/api',
}))

const get = apiClient.get as unknown as Mock

const ROWS = [
  {
    id: '1',
    firstName: 'Olivia',
    lastName: 'Smith',
    email: 'olivia.smith@acme.example',
    country: 'United States',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    currency: 'USD',
    status: 'active',
    hireDate: '2022-01-10',
    currentSalary: { amount: '120000', currency: 'USD', effectiveDate: '2024-01-01' },
  },
  {
    id: '2',
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@acme.example',
    country: 'India',
    department: 'Sales',
    jobTitle: 'Account Executive',
    currency: 'INR',
    status: 'inactive',
    hireDate: '2021-05-01',
    currentSalary: { amount: '2400000', currency: 'INR', effectiveDate: '2023-06-01' },
  },
]

beforeEach(() => {
  get.mockReset()
  get.mockImplementation((url: string, config?: { params?: Record<string, string> }) => {
    if (url === '/dashboard') {
      return Promise.resolve({
        data: {
          byCountry: [{ country: 'India' }, { country: 'United States' }],
          byDepartment: [{ department: 'Engineering' }, { department: 'Sales' }],
        },
      })
    }
    if (url === '/employees') {
      const params = config?.params ?? {}
      return Promise.resolve({
        data: { rows: ROWS, total: 42, page: Number(params.page) || 1, pageSize: 25 },
      })
    }
    return Promise.resolve({ data: {} })
  })
})

function renderDirectory() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/employees']}>
        <EmployeeDirectory />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

/** Assert the directory was fetched with params matching the expectation. */
async function expectEmployeesFetchedWith(params: Record<string, string>) {
  await waitFor(
    () => {
      expect(get).toHaveBeenCalledWith(
        '/employees',
        expect.objectContaining({ params: expect.objectContaining(params) }),
      )
    },
    { timeout: 1500 },
  )
}

describe('EmployeeDirectory', () => {
  it('renders employees and the total count from the API', async () => {
    renderDirectory()

    expect(await screen.findByText('Olivia Smith')).toBeInTheDocument()
    expect(screen.getByText('Arjun Patel')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /42 employees/i })).toBeInTheDocument()
    // Current salary is formatted in its own currency.
    expect(screen.getByText(/120,000/)).toBeInTheDocument()
    // Export links to the API with no extra filters yet.
    expect(screen.getByRole('link', { name: /export csv/i })).toHaveAttribute(
      'href',
      'http://test/api/employees/export',
    )
  })

  it('filters by country, refetching with the country param', async () => {
    renderDirectory()
    await screen.findByText('Olivia Smith')

    fireEvent.change(screen.getByLabelText('Filter by country'), { target: { value: 'India' } })

    await expectEmployeesFetchedWith({ country: 'India' })
  })

  it('advances the page, refetching with the next page', async () => {
    renderDirectory()
    await screen.findByText('Olivia Smith')

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    await expectEmployeesFetchedWith({ page: '2' })
  })

  it('debounces search before refetching with the q param', async () => {
    renderDirectory()
    await screen.findByText('Olivia Smith')

    fireEvent.change(screen.getByLabelText('Search employees'), { target: { value: 'oliv' } })

    await expectEmployeesFetchedWith({ q: 'oliv' })
  })
})
