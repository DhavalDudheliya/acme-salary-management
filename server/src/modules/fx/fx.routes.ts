import { Router } from 'express'

import { getFxRates, putFxRates } from './fx.controller.js'

export const fxRouter = Router()

fxRouter.get('/', getFxRates)
fxRouter.put('/', putFxRates)
