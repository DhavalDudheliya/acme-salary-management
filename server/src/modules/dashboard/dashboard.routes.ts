import { Router } from 'express'

import { getDashboardController } from './dashboard.controller.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', getDashboardController)
