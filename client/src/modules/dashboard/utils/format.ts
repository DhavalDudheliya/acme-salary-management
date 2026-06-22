import type { DistributionBucket } from '../api/dashboard-api'

/** Short currency label for axes/labels, e.g. "$75K", "$1.2M". */
export function compactMoney(value: number | string, currency: string): string {
  const amount = typeof value === 'string' ? Number(value) : value
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  } catch {
    return `${currency} ${new Intl.NumberFormat(undefined, { notation: 'compact' }).format(amount)}`
  }
}

/** A readable range label for a distribution bucket. */
export function bucketLabel(bucket: DistributionBucket, currency: string): string {
  if (Number(bucket.min) === 0) return `< ${compactMoney(bucket.max ?? 0, currency)}`
  if (bucket.max === null) return `${compactMoney(bucket.min, currency)}+`
  return `${compactMoney(bucket.min, currency)}–${compactMoney(bucket.max, currency)}`
}
