import { z } from 'zod'

import { BASE_CURRENCY } from '../../lib/currency.js'

/**
 * Dashboard query. `currency` chooses the reporting currency all money figures
 * are normalized to; it defaults to the base currency and must be a known FX
 * code (existence is checked in the service).
 */
export const dashboardQuerySchema = z.object({
  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/, 'currency must be a 3-letter ISO 4217 code')
    .transform((value) => value.toUpperCase())
    .default(BASE_CURRENCY),
})

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>
