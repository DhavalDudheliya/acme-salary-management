import { EmployeeDirectory } from '../modules/employees/views/EmployeeDirectory'

export function EmployeesPage() {
  return (
    <div className="grid gap-6 lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
      <header>
        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          System of record
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Employees</h1>
      </header>

      <EmployeeDirectory />
    </div>
  )
}
