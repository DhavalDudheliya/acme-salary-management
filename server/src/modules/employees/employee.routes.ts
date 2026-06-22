import { Router } from 'express'

import {
  deleteEmployee,
  exportEmployees,
  getEmployee,
  getEmployees,
  patchEmployee,
  postEmployee,
  postSalaryChange,
} from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', getEmployees)
employeeRouter.post('/', postEmployee)
// Must precede '/:id' so "export" isn't parsed as an id.
employeeRouter.get('/export', exportEmployees)
employeeRouter.get('/:id', getEmployee)
employeeRouter.patch('/:id', patchEmployee)
employeeRouter.delete('/:id', deleteEmployee)
employeeRouter.post('/:id/salary', postSalaryChange)
