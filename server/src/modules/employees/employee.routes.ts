import { Router } from 'express'

import {
  getEmployee,
  getEmployees,
  patchEmployee,
  postEmployee,
} from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
employeeRouter.post('/', postEmployee)
employeeRouter.get('/:id', getEmployee)
employeeRouter.patch('/:id', patchEmployee)
