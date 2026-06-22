export type EmployeeStatus = 'active' | 'inactive'

export interface CurrentSalary {
  amount: string
  currency: string
  effectiveDate: string
}

export interface EmployeeRow {
  id: string
  firstName: string
  lastName: string
  email: string
  country: string
  department: string
  jobTitle: string
  currency: string
  status: EmployeeStatus
  hireDate: string
  currentSalary: CurrentSalary | null
}

export interface EmployeeListResponse {
  rows: EmployeeRow[]
  total: number
  page: number
  pageSize: number
}

export interface SalaryHistoryItem {
  id: string
  amount: string
  currency: string
  effectiveDate: string
  reason: string
  createdAt: string
}

export interface EmployeeDetail {
  id: string
  firstName: string
  lastName: string
  email: string
  country: string
  department: string
  jobTitle: string
  currency: string
  status: EmployeeStatus
  hireDate: string
  currentSalaryId: string | null
  createdAt: string
  updatedAt: string
  salaryHistory: SalaryHistoryItem[]
}

/** Directory query state, mirrored in the URL. */
export interface DirectoryParams {
  page: number
  pageSize: number
  q?: string
  country?: string
  department?: string
  status?: EmployeeStatus
  sort?: string
}
