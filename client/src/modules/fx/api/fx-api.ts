import { apiClient } from '@/api/client'

export interface FxRate {
  currency: string
  rateToBase: string
  updatedAt: string
}

export interface FxRatesResponse {
  base: string
  rates: FxRate[]
}

export async function fetchFxRates(): Promise<FxRatesResponse> {
  const { data } = await apiClient.get<FxRatesResponse>('/fx-rates')
  return data
}

export async function updateFxRates(
  rates: Array<{ currency: string; rateToBase: number }>,
): Promise<FxRatesResponse> {
  const { data } = await apiClient.put<FxRatesResponse>('/fx-rates', { rates })
  return data
}
