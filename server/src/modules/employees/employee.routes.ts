import { Router } from 'express'

import { getEmployee, getEmployees, postEmployee } from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
employeeRouter.post('/', postEmployee)
employeeRouter.get('/:id', getEmployee)
