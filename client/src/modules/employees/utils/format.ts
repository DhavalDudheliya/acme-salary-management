import type { CurrentSalary } from '../api/types'

/** Format a salary string in its own currency, e.g. "€64,500". */
export function formatSalary(salary: CurrentSalary | null): string {
  if (!salary) return '—'
  const amount = Number(salary.amount)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: salary.currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // Unknown currency code — fall back to a plain number with the code.
    return `${salary.currency} ${amount.toLocaleString()}`
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
