import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { DirectoryParams } from '../api/types'
import type { DirectoryOptions } from '../hooks/use-directory-options'
import { useDebouncedValue } from '../hooks/use-debounced-value'

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface DirectoryFiltersProps {
  params: DirectoryParams
  options?: DirectoryOptions
  onChange: (updates: Partial<DirectoryParams>) => void
  exportUrl: string
}

export function DirectoryFilters({ params, options, onChange, exportUrl }: DirectoryFiltersProps) {
  const [search, setSearch] = useState(params.q ?? '')
  const debouncedSearch = useDebouncedValue(search, 300)

  // Push the debounced search term to the URL only when it actually changed.
  useEffect(() => {
    const next = debouncedSearch.trim() || undefined
    if (next !== (params.q ?? undefined)) {
      onChange({ q: next })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
      <Input
        type="search"
        className="lg:max-w-xs"
        placeholder="Search name or email"
        aria-label="Search employees"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="flex flex-1 flex-wrap items-center gap-3">
        <select
          className={selectClass}
          aria-label="Filter by country"
          value={params.country ?? ''}
          onChange={(event) => onChange({ country: event.target.value || undefined })}
        >
          <option value="">All countries</option>
          {options?.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          aria-label="Filter by department"
          value={params.department ?? ''}
          onChange={(event) => onChange({ department: event.target.value || undefined })}
        >
          <option value="">All departments</option>
          {options?.departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          aria-label="Filter by status"
          value={params.status ?? ''}
          onChange={(event) => onChange({ status: (event.target.value || undefined) as DirectoryParams['status'] })}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <a
        href={exportUrl}
        className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2')}
      >
        <Download />
        Export CSV
      </a>
    </div>
  )
}
