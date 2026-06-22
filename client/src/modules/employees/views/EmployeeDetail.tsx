import { isAxiosError } from 'axios'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'

import { DeactivateEmployeeDialog } from '../components/DeactivateEmployeeDialog'
import { EditEmployeeDialog } from '../components/EditEmployeeDialog'
import { SalaryChangeDialog } from '../components/SalaryChangeDialog'
import { SalaryHistoryTimeline } from '../components/SalaryHistoryTimeline'
import { useEmployee } from '../hooks/use-employee'
import { formatDate, formatSalary } from '../utils/format'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/employees" className="text-muted-foreground text-sm hover:underline">
      ← Back to directory
    </Link>
  )
}

export function EmployeeDetail({ id }: { id: string | undefined }) {
  const { data: employee, isLoading, isError, error } = useEmployee(id)

  if (isLoading) {
    return <p className="text-muted-foreground">Loading employee…</p>
  }

  if (isError || !employee) {
    const notFound = isAxiosError(error) && error.response?.status === 404
    return (
      <div className="grid gap-3">
        <BackLink />
        <h1 className="text-2xl font-semibold">
          {notFound ? 'Employee not found' : 'Could not load employee'}
        </h1>
        {!notFound && (
          <p className="text-muted-foreground text-sm">Check the API is running and try again.</p>
        )}
      </div>
    )
  }

  const current = employee.salaryHistory.find((s) => s.id === employee.currentSalaryId) ?? null

  return (
    <div className="grid gap-6">
      <BackLink />

      <header className="flex flex-wrap items-center gap-4">
        <span className="bg-primary text-primary-foreground grid size-14 place-items-center rounded-full text-lg font-semibold">
          {employee.firstName[0]}
          {employee.lastName[0]}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground">
            {employee.jobTitle} · {employee.department}
          </p>
        </div>
        <Badge variant={employee.status === 'active' ? 'secondary' : 'outline'} className="ml-auto">
          {employee.status}
        </Badge>
      </header>

      <div className="flex flex-wrap gap-2">
        <SalaryChangeDialog employee={employee} />
        <EditEmployeeDialog employee={employee} />
        {employee.status === 'active' && <DeactivateEmployeeDialog employee={employee} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="bg-card text-card-foreground grid gap-5 rounded-lg border p-5">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Current salary
            </p>
            <p className="mt-1 text-3xl font-semibold">{formatSalary(current)}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <a href={`mailto:${employee.email}`} className="hover:underline">
                {employee.email}
              </a>
            </Field>
            <Field label="Pay currency">{employee.currency}</Field>
            <Field label="Country">{employee.country}</Field>
            <Field label="Department">{employee.department}</Field>
            <Field label="Hire date">{formatDate(employee.hireDate)}</Field>
            <Field label="Status">{employee.status}</Field>
          </dl>
        </section>

        <section className="bg-card text-card-foreground rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">Salary history</h2>
          <SalaryHistoryTimeline
            items={employee.salaryHistory}
            currentSalaryId={employee.currentSalaryId}
          />
        </section>
      </div>
    </div>
  )
}
