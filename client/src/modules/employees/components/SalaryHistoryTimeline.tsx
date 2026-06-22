import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { SalaryHistoryItem } from '../api/types'
import { formatDate, formatMoney } from '../utils/format'

interface SalaryHistoryTimelineProps {
  items: SalaryHistoryItem[]
  currentSalaryId: string | null
}

/** Percentage change of `item` versus the next-older record, if any. */
function changeFromPrevious(items: SalaryHistoryItem[], index: number): number | null {
  const previous = items[index + 1]
  if (!previous) return null
  const prev = Number(previous.amount)
  if (prev === 0) return null
  return ((Number(items[index].amount) - prev) / prev) * 100
}

export function SalaryHistoryTimeline({ items, currentSalaryId }: SalaryHistoryTimelineProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No salary records.</p>
  }

  return (
    <ol className="relative ml-2 border-l pl-6">
      {items.map((item, index) => {
        const change = changeFromPrevious(items, index)
        const isCurrent = item.id === currentSalaryId
        return (
          <li key={item.id} className="relative pb-6 last:pb-0">
            <span
              className={cn(
                'absolute -left-[27px] mt-1.5 size-3 rounded-full ring-4 ring-card',
                isCurrent ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-lg font-semibold">{formatMoney(item.amount, item.currency)}</span>
              {isCurrent && <Badge variant="secondary">Current</Badge>}
              {change !== null && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium',
                    change >= 0 ? 'text-emerald-600' : 'text-destructive',
                  )}
                >
                  {change >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {change >= 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              <span className="capitalize">{item.reason}</span> · effective {formatDate(item.effectiveDate)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
