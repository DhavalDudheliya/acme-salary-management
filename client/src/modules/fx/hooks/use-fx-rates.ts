import { useQuery } from '@tanstack/react-query'

import { fetchFxRates } from '../api/fx-api'

export function useFxRates() {
  return useQuery({
    queryKey: ['fx-rates'],
    queryFn: fetchFxRates,
    staleTime: 60_000,
  })
}
