import { useSearchParams } from 'react-router-dom'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFxRates } from '@/modules/fx/hooks/use-fx-rates'

import { BreakdownChart } from '../components/BreakdownChart'
import { DistributionChart } from '../components/DistributionChart'
import { KpiCards } from '../components/KpiCards'
import { RecentChangesPanel } from '../components/RecentChangesPanel'
import { useDashboard } from '../hooks/use-dashboard'

export function DashboardView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currency = searchParams.get('currency') ?? 'USD'

  const { data, isLoading, isError } = useDashboard(currency)
  const { data: fx } = useFxRates()

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">How the organisation pays people.</p>
        </div>
        <div className="grid gap-1 text-sm">
          <span className="text-muted-foreground text-xs font-medium">Reporting currency</span>
          <Select
            value={currency}
            onValueChange={(value) => {
              if (value) setSearchParams({ currency: value }, { replace: true })
            }}
          >
            <SelectTrigger className="h-9 min-w-32" aria-label="Reporting currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {fx?.rates?.map((rate) => (
                <SelectItem key={rate.currency} value={rate.currency}>
                  {rate.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {isError ? (
        <p className="text-destructive text-sm">
          Could not load the dashboard. Check the API is running and try again.
        </p>
      ) : !data ? (
        <p className="text-muted-foreground">{isLoading ? 'Loading dashboard…' : null}</p>
      ) : (
        <>
          <KpiCards data={data} />

          <DistributionChart data={data.distribution} currency={data.reportingCurrency} />

          <div className="grid gap-6 lg:grid-cols-2">
            <BreakdownChart
              title="Payroll by country"
              currency={data.reportingCurrency}
              data={data.byCountry.map((c) => ({
                name: c.country,
                payroll: Number(c.totalPayroll),
                headcount: c.headcount,
              }))}
            />
            <BreakdownChart
              title="Payroll by department"
              currency={data.reportingCurrency}
              data={data.byDepartment.map((d) => ({
                name: d.department,
                payroll: Number(d.totalPayroll),
                headcount: d.headcount,
              }))}
            />
          </div>

          <RecentChangesPanel changes={data.recentChanges} currency={data.reportingCurrency} />
        </>
      )}
    </div>
  )
}
