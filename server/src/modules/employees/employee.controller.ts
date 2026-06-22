import type { Request, Response } from 'express'
import { format } from 'fast-csv'

import {
  createEmployeeSchema,
  employeeExportQuerySchema,
  employeeIdParamSchema,
  employeeListQuerySchema,
  salaryChangeSchema,
  updateEmployeeSchema,
} from './employee.schemas.js'
import {
  createEmployee,
  createSalaryChange,
  deactivateEmployee,
  getEmployeeById,
  listEmployees,
  streamEmployeeRows,
  updateEmployee,
  type EmployeeCsvRow,
  type EmployeeDetail,
  type EmployeeListResult,
} from './employee.service.js'

/** Format a DATE-column value as `YYYY-MM-DD` (no spurious time/zone). */
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Shape a directory row for the wire: Decimal -> string, Date -> date string. */
function serializeRow(row: EmployeeListResult['rows'][number]) {
  return {
    ...row,
    hireDate: toDateString(row.hireDate),
    currentSalary: row.currentSalary
      ? {
          amount: row.currentSalary.amount.toString(),
          currency: row.currentSalary.currency,
          effectiveDate: toDateString(row.currentSalary.effectiveDate),
        }
      : null,
  }
}

export async function getEmployees(request: Request, response: Response) {
  const query = employeeListQuerySchema.parse(request.query)
  const result = await listEmployees(query)

  response.json({
    rows: result.rows.map(serializeRow),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  })
}

/** Shape the detail view: profile + newest-first salary history. */
function serializeDetail(employee: EmployeeDetail) {
  const { salaryRecords, ...profile } = employee
  return {
    ...profile,
    hireDate: toDateString(profile.hireDate),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    salaryHistory: salaryRecords.map((record) => ({
      id: record.id,
      amount: record.amount.toString(),
      currency: record.currency,
      effectiveDate: toDateString(record.effectiveDate),
      reason: record.reason,
      createdAt: record.createdAt.toISOString(),
    })),
  }
}

export async function getEmployee(request: Request, response: Response) {
  const { id } = employeeIdParamSchema.parse(request.params)
  const employee = await getEmployeeById(id)

  response.json(serializeDetail(employee))
}

export async function postEmployee(request: Request, response: Response) {
  const input = createEmployeeSchema.parse(request.body)
  const employee = await createEmployee(input)

  response.status(201).json(serializeDetail(employee))
}

export async function patchEmployee(request: Request, response: Response) {
  const { id } = employeeIdParamSchema.parse(request.params)
  const input = updateEmployeeSchema.parse(request.body)
  const employee = await updateEmployee(id, input)

  response.json(serializeDetail(employee))
}

export async function deleteEmployee(request: Request, response: Response) {
  const { id } = employeeIdParamSchema.parse(request.params)
  const employee = await deactivateEmployee(id)

  response.json(serializeDetail(employee))
}

export async function postSalaryChange(request: Request, response: Response) {
  const { id } = employeeIdParamSchema.parse(request.params)
  const input = salaryChangeSchema.parse(request.body)
  const employee = await createSalaryChange(id, input)

  response.status(201).json(serializeDetail(employee))
}

/** Write one row, awaiting drain when the stream's buffer is full (backpressure). */
function writeRow(stream: ReturnType<typeof format>, row: EmployeeCsvRow): Promise<void> {
  if (stream.write(row)) {
    return Promise.resolve()
  }
  return new Promise((resolve) => stream.once('drain', resolve))
}

export async function exportEmployees(request: Request, response: Response) {
  // Validate before any bytes are sent so a bad query is still a clean 400.
  const query = employeeExportQuerySchema.parse(request.query)

  response.setHeader('Content-Type', 'text/csv; charset=utf-8')
  response.setHeader('Content-Disposition', 'attachment; filename="employees.csv"')

  const csv = format({ headers: true })
  csv.pipe(response)

  for await (const row of streamEmployeeRows(query)) {
    await writeRow(csv, row)
  }
  csv.end()
}
