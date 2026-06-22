import { buildExportUrl } from '../api/employees-api'
import { CreateEmployeeDialog } from '../components/CreateEmployeeDialog'
import { DirectoryFilters } from '../components/DirectoryFilters'
import { DirectoryPagination } from '../components/DirectoryPagination'
import { DirectoryTable } from '../components/DirectoryTable'
import { useDirectoryOptions } from '../hooks/use-directory-options'
import { useDirectoryParams } from '../hooks/use-directory-params'
import { useEmployees } from '../hooks/use-employees'

export function EmployeeDirectory() {
  const { params, setParams, setPage } = useDirectoryParams()
  const { data, isLoading, isError, isFetching } = useEmployees(params)
  const { data: options } = useDirectoryOptions()

  const exportUrl = buildExportUrl({
    q: params.q,
    country: params.country,
    department: params.department,
    status: params.status,
    sort: params.sort,
  })

  return (
    <section
      className="bg-card text-card-foreground overflow-hidden rounded-lg border"
      aria-labelledby="directory-heading"
      aria-busy={isFetching}
    >
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Employee directory
          </p>
          <h2 id="directory-heading" className="mt-1 text-xl font-semibold">
            {data ? `${data.total.toLocaleString()} employees` : 'Employees'}
          </h2>
        </div>
        <CreateEmployeeDialog />
      </div>

      <DirectoryFilters
        params={params}
        options={options}
        onChange={setParams}
        exportUrl={exportUrl}
      />

      {isError ? (
        <p className="text-destructive p-6 text-sm">
          Could not load employees. Check the API is running and try again.
        </p>
      ) : (
        <>
          <DirectoryTable
            data={data?.rows ?? []}
            sort={params.sort}
            onSortChange={(sort) => setParams({ sort })}
            isLoading={isLoading}
          />
          <DirectoryPagination
            page={params.page}
            pageSize={params.pageSize}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  )
}
