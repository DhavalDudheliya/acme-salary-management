import { Link } from 'react-router-dom'

import { formatDate, formatMoney } from '@/modules/employees/utils/format'

import type { RecentChange } from '../api/dashboard-api'

export function RecentChangesPanel({
  changes,
  currency,
}: {
  changes: RecentChange[]
  currency: string
}) {
  return (
    <section className="bg-card text-card-foreground rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold">Recent salary changes</h2>
      {changes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent changes.</p>
      ) : (
        <ul className="divide-y">
          {changes.map((change) => (
            <li key={change.id} className="flex items-center justify-between gap-4 py-2.5">
              <div className="min-w-0">
                <Link to={`/employees/${change.employeeId}`} className="font-medium hover:underline">
                  {change.name}
                </Link>
                <p className="text-muted-foreground text-xs">
                  <span className="capitalize">{change.reason}</span> · {formatDate(change.effectiveDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatMoney(change.amount, change.currency)}</p>
                {change.currency !== currency && (
                  <p className="text-muted-foreground text-xs">
                    ≈ {formatMoney(change.amountReporting, currency)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
