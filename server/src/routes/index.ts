import { Router } from 'express'

import { employeeRouter } from '../modules/employees/employee.routes.js'
import { fxRouter } from '../modules/fx/fx.routes.js'
import { healthRouter } from '../modules/health/health.routes.js'

export const routes = Router()

routes.use('/health', healthRouter)
routes.use('/employees', employeeRouter)
routes.use('/fx-rates', fxRouter)
