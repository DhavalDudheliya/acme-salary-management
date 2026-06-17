import { Button } from '@/components/ui/button'

import { EmployeeDirectoryPreview } from '../modules/employees/views/EmployeeDirectoryPreview'

export function EmployeesPage() {
  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">System of record</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-5xl">Employee salary management</h1>
        </div>
        <Button type="button" size="lg">
          New employee
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Compensation summary">
        <article className="bg-card text-card-foreground rounded-lg border p-4">
          <span className="text-muted-foreground text-sm">Headcount</span>
          <strong className="mt-2 block text-2xl">10,000</strong>
        </article>
        <article className="bg-card text-card-foreground rounded-lg border p-4">
          <span className="text-muted-foreground text-sm">Reporting currency</span>
          <strong className="mt-2 block text-2xl">USD</strong>
        </article>
        <article className="bg-card text-card-foreground rounded-lg border p-4">
          <span className="text-muted-foreground text-sm">Salary history</span>
          <strong className="mt-2 block text-2xl">Append-only</strong>
        </article>
      </section>

      <EmployeeDirectoryPreview />
    </div>
  )
}
