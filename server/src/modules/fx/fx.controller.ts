import type { Request, Response } from 'express'

import { fxRatesUpdateSchema } from './fx.schemas.js'
import { listFxRates, updateFxRates, type FxRatesResult } from './fx.service.js'

/** Decimal -> string, Date -> ISO, for the wire. */
function serialize(result: FxRatesResult) {
  return {
    base: result.base,
    rates: result.rates.map((rate) => ({
      currency: rate.currency,
      rateToBase: rate.rateToBase.toString(),
      updatedAt: rate.updatedAt.toISOString(),
    })),
  }
}

export async function getFxRates(_request: Request, response: Response) {
  response.json(serialize(await listFxRates()))
}

export async function putFxRates(request: Request, response: Response) {
  const input = fxRatesUpdateSchema.parse(request.body)
  response.json(serialize(await updateFxRates(input)))
}
