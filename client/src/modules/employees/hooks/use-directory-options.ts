import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'

interface DashboardBreakdown {
  byCountry: Array<{ country: string }>
  byDepartment: Array<{ department: string }>
}

export interface DirectoryOptions {
  countries: string[]
  departments: string[]
}

/**
 * Country/department options for the directory filters. Derived from the
 * dashboard breakdown so no extra endpoint is needed; cached aggressively since
 * the option set is effectively static.
 */
export function useDirectoryOptions() {
  return useQuery<DirectoryOptions>({
    queryKey: ['directory-options'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardBreakdown>('/dashboard')
      return {
        countries: data.byCountry.map((c) => c.country).sort(),
        departments: data.byDepartment.map((d) => d.department).sort(),
      }
    },
    staleTime: Infinity,
  })
}
