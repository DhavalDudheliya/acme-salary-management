import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import {
  changeSalary,
  createEmployee,
  deactivateEmployee,
  updateEmployee,
  type CreateEmployeePayload,
  type SalaryChangePayload,
  type UpdateEmployeePayload,
} from '../api/employees-api'

/** Human-readable message from an API error, falling back to a generic line. */
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const apiError = error.response?.data?.error
    if (apiError?.message) return apiError.message as string
  }
  return 'Something went wrong. Please try again.'
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

/** Invalidate both the directory and this employee's detail after a write. */
function useEmployeeWrite<TPayload>(id: string, mutationFn: (payload: TPayload) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployee(id: string) {
  return useEmployeeWrite<UpdateEmployeePayload>(id, (payload) => updateEmployee(id, payload))
}

export function useChangeSalary(id: string) {
  return useEmployeeWrite<SalaryChangePayload>(id, (payload) => changeSalary(id, payload))
}

export function useDeactivateEmployee(id: string) {
  return useEmployeeWrite<void>(id, () => deactivateEmployee(id))
}
