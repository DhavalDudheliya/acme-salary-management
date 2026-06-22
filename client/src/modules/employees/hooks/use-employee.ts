import { useQuery } from '@tanstack/react-query'

import { fetchEmployee } from '../api/employees-api'

/** Single employee detail (profile + salary history). */
export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id as string),
    enabled: Boolean(id),
  })
}
