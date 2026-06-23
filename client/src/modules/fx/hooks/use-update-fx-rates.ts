import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateFxRates } from '../api/fx-api'

/**
 * Persist edited FX rates. New rates change every normalized figure, so the
 * dashboard is invalidated alongside the rate table itself.
 */
export function useUpdateFxRates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (rates: Array<{ currency: string; rateToBase: number }>) => updateFxRates(rates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fx-rates'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
