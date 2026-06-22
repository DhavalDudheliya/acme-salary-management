import { formatMoney } from '@/modules/employees/utils/format'

import type { Dashboard } from '../api/dashboard-api'

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="bg-card text-card-foreground rounded-lg border p-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <strong className="mt-2 block text-2xl tracking-tight">{value}</strong>
    </article>
  )
}

export function KpiCards({ data }: { data: Dashboard }) {
  const currency = data.reportingCurrency
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
      <Kpi label="Active headcount" value={data.headcount.toLocaleString()} />
      <Kpi label={`Total payroll (${currency})`} value={formatMoney(data.totalPayroll, currency)} />
      <Kpi label="Average salary" value={formatMoney(data.averageSalary, currency)} />
      <Kpi label="Median salary" value={formatMoney(data.medianSalary, currency)} />
    </section>
  )
}
