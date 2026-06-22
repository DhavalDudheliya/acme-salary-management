import { BASE_CURRENCY } from '../../lib/currency.js'
import { prisma } from '../../lib/prisma.js'
import type { FxRatesUpdateInput } from './fx.schemas.js'

/**
 * FX rate service. Reads the HR-editable rate table and upserts edits. Rates are
 * keyed by currency; the base currency's row is pinned at 1.
 */

export async function listFxRates() {
  const rates = await prisma.fxRate.findMany({ orderBy: { currency: 'asc' } })
  return { base: BASE_CURRENCY, rates }
}

export type FxRatesResult = Awaited<ReturnType<typeof listFxRates>>

/** Upsert the given rates in one transaction, then return the full table. */
export async function updateFxRates(input: FxRatesUpdateInput): Promise<FxRatesResult> {
  await prisma.$transaction(
    input.rates.map((rate) =>
      prisma.fxRate.upsert({
        where: { currency: rate.currency },
        create: { currency: rate.currency, rateToBase: rate.rateToBase.toFixed(8) },
        update: { rateToBase: rate.rateToBase.toFixed(8) },
      }),
    ),
  )

  return listFxRates()
}
