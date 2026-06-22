import { apiClient, API_BASE_URL } from '@/api/client'

import type { DirectoryParams, EmployeeDetail, EmployeeListResponse } from './types'

/** Drop empty/default values so the request (and URL) stays clean. */
function toQuery(params: Partial<DirectoryParams>): Record<string, string> {
  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) {
      query[key] = String(value)
    }
  }
  return query
}

export async function fetchEmployees(params: DirectoryParams): Promise<EmployeeListResponse> {
  const { data } = await apiClient.get<EmployeeListResponse>('/employees', {
    params: toQuery(params),
  })
  return data
}

export async function fetchEmployee(id: string): Promise<EmployeeDetail> {
  const { data } = await apiClient.get<EmployeeDetail>(`/employees/${id}`)
  return data
}

/** Direct CSV download URL for the current filtered view (no pagination). */
export function buildExportUrl(params: Omit<DirectoryParams, 'page' | 'pageSize'>): string {
  const search = new URLSearchParams(toQuery(params)).toString()
  return `${API_BASE_URL}/employees/export${search ? `?${search}` : ''}`
}
