import { Router } from 'express'

import { getEmployee, getEmployees } from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
employeeRouter.get('/:id', getEmployee)
