import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchDashboard } from '../api/dashboard-api'

/** Org dashboard analytics for the given reporting currency. */
export function useDashboard(currency: string) {
  return useQuery({
    queryKey: ['dashboard', currency],
    queryFn: () => fetchDashboard(currency),
    placeholderData: keepPreviousData, // keep charts visible while switching currency
  })
}
