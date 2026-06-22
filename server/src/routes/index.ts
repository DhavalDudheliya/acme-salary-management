import { Router } from 'express'

import { dashboardRouter } from '../modules/dashboard/dashboard.routes.js'
import { employeeRouter } from '../modules/employees/employee.routes.js'
import { fxRouter } from '../modules/fx/fx.routes.js'
import { healthRouter } from '../modules/health/health.routes.js'

export const routes = Router()

routes.use('/health', healthRouter)
routes.use('/employees', employeeRouter)
routes.use('/fx-rates', fxRouter)
routes.use('/dashboard', dashboardRouter)
