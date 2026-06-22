import { apiClient } from '@/api/client'

export interface DistributionBucket {
  min: string
  max: string | null
  count: number
}

export interface GroupBreakdown {
  headcount: number
  totalPayroll: string
  averageSalary: string
}

export interface CountryBreakdown extends GroupBreakdown {
  country: string
}

export interface DepartmentBreakdown extends GroupBreakdown {
  department: string
}

export interface RecentChange {
  id: string
  employeeId: string
  name: string
  amount: string
  currency: string
  amountReporting: string
  effectiveDate: string
  reason: string
  createdAt: string
}

export interface Dashboard {
  reportingCurrency: string
  headcount: number
  totalPayroll: string
  averageSalary: string
  medianSalary: string
  distribution: DistributionBucket[]
  byCountry: CountryBreakdown[]
  byDepartment: DepartmentBreakdown[]
  recentChanges: RecentChange[]
}

export async function fetchDashboard(currency?: string): Promise<Dashboard> {
  const { data } = await apiClient.get<Dashboard>('/dashboard', {
    params: currency ? { currency } : undefined,
  })
  return data
}
