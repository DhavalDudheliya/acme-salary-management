import { Router } from 'express'

import { getEmployees } from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
