import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { DirectoryParams } from '../api/types'
import type { DirectoryOptions } from '../hooks/use-directory-options'
import { useDebouncedValue } from '../hooks/use-debounced-value'

const allValue = '__all__'

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
        <Select
          value={params.country ?? allValue}
          onValueChange={(value) =>
            onChange({ country: value === allValue || value === null ? undefined : value })
          }
        >
          <SelectTrigger className="h-9 min-w-36" aria-label="Filter by country">
            <SelectValue>{(value: string) => value === allValue ? 'All countries' : value}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={allValue}>All countries</SelectItem>
            {options?.countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.department ?? allValue}
          onValueChange={(value) =>
            onChange({ department: value === allValue || value === null ? undefined : value })
          }
        >
          <SelectTrigger className="h-9 min-w-42" aria-label="Filter by department">
            <SelectValue>{(value: string) => value === allValue ? 'All departments' : value}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={allValue}>All departments</SelectItem>
            {options?.departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.status ?? allValue}
          onValueChange={(value) =>
            onChange({
              status: (value === allValue || value === null
                ? undefined
                : value) as DirectoryParams['status'],
            })
          }
        >
          <SelectTrigger className="h-9 min-w-30" aria-label="Filter by status">
            <SelectValue>{(value: string) => value === allValue ? 'All statuses' : value}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={allValue}>All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        render={<a href={exportUrl} />}
        variant="outline"
        size="lg"
        className="gap-2"
      >
        <Download />
        Export CSV
      </Button>
    </div>
  )
}
