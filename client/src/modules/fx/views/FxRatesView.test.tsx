import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { apiClient } from '@/api/client'

import { FxRatesView } from './FxRatesView'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
  API_BASE_URL: 'http://test/api',
}))

const get = apiClient.get as unknown as Mock
const put = apiClient.put as unknown as Mock

const FX = {
  base: 'USD',
  rates: [
    { currency: 'USD', rateToBase: '1', updatedAt: '2026-06-01T00:00:00.000Z' },
    { currency: 'EUR', rateToBase: '1.08', updatedAt: '2026-06-01T00:00:00.000Z' },
    { currency: 'GBP', rateToBase: '1.27', updatedAt: '2026-06-01T00:00:00.000Z' },
  ],
}

beforeEach(() => {
  get.mockReset()
  put.mockReset()
  get.mockResolvedValue({ data: FX })
  put.mockResolvedValue({ data: FX })
})

function renderView() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <FxRatesView />
    </QueryClientProvider>,
  )
}

describe('FxRatesView', () => {
  it('renders a row per rate with the base currency locked', async () => {
    renderView()

    const usd = (await screen.findByLabelText('Rate for USD')) as HTMLInputElement
    expect(usd).toBeDisabled()
    expect(usd.value).toBe('1')

    const eur = screen.getByLabelText('Rate for EUR') as HTMLInputElement
    expect(eur).not.toBeDisabled()
    expect(eur.value).toBe('1.08')
  })

  it('saves edited rates as numbers via PUT /fx-rates', async () => {
    renderView()

    const eur = await screen.findByLabelText('Rate for EUR')
    fireEvent.change(eur, { target: { value: '1.12' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save rates' }))

    await waitFor(() => {
      expect(put).toHaveBeenCalledWith('/fx-rates', {
        rates: [
          { currency: 'USD', rateToBase: 1 },
          { currency: 'EUR', rateToBase: 1.12 },
          { currency: 'GBP', rateToBase: 1.27 },
        ],
      })
    })

    expect(await screen.findByText('Rates saved.')).toBeInTheDocument()
  })

  it('rejects a non-positive rate without calling the API', async () => {
    renderView()

    const eur = await screen.findByLabelText('Rate for EUR')
    fireEvent.change(eur, { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save rates' }))

    expect(await screen.findByText('Must be greater than 0')).toBeInTheDocument()
    expect(put).not.toHaveBeenCalled()
  })
})
