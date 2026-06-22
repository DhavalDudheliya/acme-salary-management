/**
 * The single reporting currency that all aggregates normalize to. Its FX row
 * has rate_to_base = 1; every other currency converts via `local * rateToBase`.
 */
export const BASE_CURRENCY = 'USD'
