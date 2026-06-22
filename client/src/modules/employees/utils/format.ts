import type { CurrentSalary } from '../api/types'

/** Format an amount string in the given currency, e.g. "€64,500". */
export function formatMoney(amount: string, currency: string): string {
  const value = Number(amount)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    // Unknown currency code — fall back to a plain number with the code.
    return `${currency} ${value.toLocaleString()}`
  }
}

/** Format a current-salary object, or an em dash when absent. */
export function formatSalary(salary: CurrentSalary | null): string {
  if (!salary) return '—'
  return formatMoney(salary.amount, salary.currency)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
