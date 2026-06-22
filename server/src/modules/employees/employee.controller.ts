import type { Request, Response } from 'express'

import { employeeListQuerySchema } from './employee.schemas.js'
import { listEmployees, type EmployeeListResult } from './employee.service.js'

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
