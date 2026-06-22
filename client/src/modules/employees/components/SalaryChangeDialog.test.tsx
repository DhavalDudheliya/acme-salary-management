import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { apiClient } from '@/api/client'

import type { EmployeeDetail } from '../api/types'
import { SalaryChangeDialog } from './SalaryChangeDialog'

vi.mock('@/api/client', () => ({
  apiClient: { post: vi.fn() },
  API_BASE_URL: 'http://test/api',
}))

const post = apiClient.post as unknown as Mock

const EMPLOYEE = {
  id: 'emp-1',
  firstName: 'Chloe',
  lastName: 'Garcia',
  currency: 'EUR',
  salaryHistory: [],
} as unknown as EmployeeDetail

function renderDialog() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <SalaryChangeDialog employee={EMPLOYEE} />
    </QueryClientProvider>,
  )
}

describe('SalaryChangeDialog', () => {
  beforeEach(() => {
    post.mockReset()
    post.mockResolvedValue({ data: EMPLOYEE })
  })

  it('submits a salary change to the API for the employee', async () => {
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Change salary' }))

    fireEvent.change(await screen.findByLabelText(/Amount \(EUR\)/), { target: { value: '90000' } })
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'promotion' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save change' }))

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith(
        '/employees/emp-1/salary',
        expect.objectContaining({ amount: 90000, reason: 'promotion' }),
      )
    })
  })

  it('shows validation errors and does not submit an empty form', async () => {
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Change salary' }))
    fireEvent.change(await screen.findByLabelText(/Amount \(EUR\)/), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save change' }))

    expect(await screen.findByText('Must be greater than 0')).toBeInTheDocument()
    expect(post).not.toHaveBeenCalled()
  })
})
