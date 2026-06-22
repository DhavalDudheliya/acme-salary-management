import { EmployeeDirectory } from '../modules/employees/views/EmployeeDirectory'

export function EmployeesPage() {
  return (
    <div className="grid gap-6">
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
