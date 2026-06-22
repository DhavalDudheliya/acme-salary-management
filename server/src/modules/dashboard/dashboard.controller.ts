import type { Request, Response } from 'express'

import { dashboardQuerySchema } from './dashboard.schemas.js'
import { getDashboard, type DashboardResult } from './dashboard.service.js'

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function serialize(result: DashboardResult) {
  return {
    ...result,
    recentChanges: result.recentChanges.map((change) => ({
      ...change,
      effectiveDate: toDateString(change.effectiveDate),
      createdAt: change.createdAt.toISOString(),
    })),
  }
}

export async function getDashboardController(request: Request, response: Response) {
  const query = dashboardQuerySchema.parse(request.query)
  const result = await getDashboard(query)

  response.json(serialize(result))
}
