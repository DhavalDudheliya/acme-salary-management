import { z } from 'zod'

import { BASE_CURRENCY } from '../../lib/currency.js'

/** Largest rate that fits the rate_to_base column (numeric(18,8)) comfortably. */
const MAX_RATE = 1_000_000

const currencyCode = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, 'currency must be a 3-letter ISO 4217 code')
  .transform((value) => value.toUpperCase())

/**
 * HR-edited FX rates. Each rate converts its local currency to the base
 * reporting currency (`local * rateToBase = base`). The base currency is pinned
 * at 1 and duplicates are rejected so an update is unambiguous.
 */
export const fxRatesUpdateSchema = z
  .object({
    rates: z
      .array(
        z.object({
          currency: currencyCode,
          rateToBase: z.number().positive().max(MAX_RATE),
        }),
      )
      .min(1, 'provide at least one rate'),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>()
    data.rates.forEach((rate, index) => {
      if (seen.has(rate.currency)) {
        ctx.addIssue({
          code: 'custom',
          message: `duplicate currency ${rate.currency}`,
          path: ['rates', index, 'currency'],
        })
      }
      seen.add(rate.currency)

      if (rate.currency === BASE_CURRENCY && rate.rateToBase !== 1) {
        ctx.addIssue({
          code: 'custom',
          message: `${BASE_CURRENCY} is the base currency and must have rateToBase = 1`,
          path: ['rates', index, 'rateToBase'],
        })
      }
    })
  })

export type FxRatesUpdateInput = z.infer<typeof fxRatesUpdateSchema>
