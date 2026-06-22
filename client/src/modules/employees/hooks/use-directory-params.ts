import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { DirectoryParams, EmployeeStatus } from '../api/types'

const DEFAULT_PAGE_SIZE = 25

/**
 * Directory state lives in the URL so views are shareable and back/forward
 * works. This hook reads typed params from the query string and writes them
 * back, resetting to page 1 whenever a filter/search/sort changes.
 */
export function useDirectoryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo<DirectoryParams>(() => {
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE
    const status = searchParams.get('status') ?? undefined
    return {
      page,
      pageSize,
      q: searchParams.get('q') ?? undefined,
      country: searchParams.get('country') ?? undefined,
      department: searchParams.get('department') ?? undefined,
      status: status === 'active' || status === 'inactive' ? (status as EmployeeStatus) : undefined,
      sort: searchParams.get('sort') ?? undefined,
    }
  }, [searchParams])

  const setParams = useCallback(
    (updates: Partial<DirectoryParams>, { resetPage = true } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(updates)) {
            if (value === undefined || value === '' || value === null) {
              next.delete(key)
            } else {
              next.set(key, String(value))
            }
          }
          if (resetPage && !('page' in updates)) {
            next.delete('page')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback((page: number) => setParams({ page }, { resetPage: false }), [setParams])

  return { params, setParams, setPage }
}
