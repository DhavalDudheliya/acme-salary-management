import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { EmployeeDetail } from '../api/types'
import { useUpdateEmployee, errorMessage } from '../hooks/use-employee-mutations'
import { editEmployeeFormSchema, type EditEmployeeForm } from '../schemas/employee-form-schemas'
import { FormField } from './forms/FormField'

export function EditEmployeeDialog({ employee }: { employee: EmployeeDetail }) {
  const [open, setOpen] = useState(false)
  const mutation = useUpdateEmployee(employee.id)

  const defaults: EditEmployeeForm = {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    country: employee.country,
    department: employee.department,
    jobTitle: employee.jobTitle,
    status: employee.status,
  }

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditEmployeeForm>({
    resolver: zodResolver(editEmployeeFormSchema),
    defaultValues: defaults,
  })

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      reset(defaults)
      mutation.reset()
    }
  }

  const onSubmit = (values: EditEmployeeForm) => {
    mutation.mutate(values, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Salary and pay currency are changed separately.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input id="firstName" {...register('firstName')} />
            </FormField>
            <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input id="lastName" {...register('lastName')} />
            </FormField>
          </div>

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Country" htmlFor="country" error={errors.country?.message}>
              <Input id="country" {...register('country')} />
            </FormField>
            <FormField label="Department" htmlFor="department" error={errors.department?.message}>
              <Input id="department" {...register('department')} />
            </FormField>
          </div>

          <FormField label="Job title" htmlFor="jobTitle" error={errors.jobTitle?.message}>
            <Input id="jobTitle" {...register('jobTitle')} />
          </FormField>

          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                  <SelectTrigger id="status" className="h-9 w-full">
                    <SelectValue>
                      {(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {mutation.isError && <p className="text-destructive text-sm">{errorMessage(mutation.error)}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
