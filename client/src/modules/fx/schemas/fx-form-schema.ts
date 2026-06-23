import { z } from 'zod'

/** Base reporting currency — pinned at 1 and not editable. */
export const BASE_CURRENCY = 'USD'

/**
 * Mirrors the API's FX validation so a bad rate is caught before the request.
 * Inputs come from text fields, so the rate is coerced from a string.
 */
const rateToBase = z.coerce
  .number({ message: 'Enter a rate' })
  .positive('Must be greater than 0')
  .max(1_000_000, 'Rate is too large')

export const fxRatesFormSchema = z.object({
  rates: z
    .array(
      z.object({
        currency: z.string(),
        rateToBase,
      }),
    )
    .superRefine((rates, ctx) => {
      rates.forEach((rate, index) => {
        if (rate.currency === BASE_CURRENCY && rate.rateToBase !== 1) {
          ctx.addIssue({
            code: 'custom',
            message: `${BASE_CURRENCY} is the base currency and stays at 1`,
            path: [index, 'rateToBase'],
          })
        }
      })
    }),
})

export type FxRatesFormInput = z.input<typeof fxRatesFormSchema>
export type FxRatesForm = z.output<typeof fxRatesFormSchema>
