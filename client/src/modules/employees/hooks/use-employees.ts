import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchEmployees } from '../api/employees-api'
import type { DirectoryParams } from '../api/types'

/** Server-paginated directory query. Key encodes the full param set. */
export function useEmployees(params: DirectoryParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => fetchEmployees(params),
    placeholderData: keepPreviousData, // keep the old page visible while the next loads
  })
}
