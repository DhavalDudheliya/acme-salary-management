import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'

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
import { useFxRates } from '@/modules/fx/hooks/use-fx-rates'

import { useCreateEmployee, errorMessage } from '../hooks/use-employee-mutations'
import {
  createEmployeeFormSchema,
  type CreateEmployeeForm,
  type CreateEmployeeFormInput,
} from '../schemas/employee-form-schemas'
import { FormField, formSelectClass } from './forms/FormField'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const mutation = useCreateEmployee()
  const { data: fx } = useFxRates()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeFormInput, unknown, CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeFormSchema),
    defaultValues: { hireDate: today() },
  })

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset({ hireDate: today() })
      mutation.reset()
    }
  }

  const onSubmit = (values: CreateEmployeeForm) => {
    const { amount, ...profile } = values
    mutation.mutate(
      { ...profile, salary: { amount } },
      {
        onSuccess: (employee) => {
          setOpen(false)
          navigate(`/employees/${employee.id}`)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button className="gap-2"><Plus />New employee</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New employee</DialogTitle>
          <DialogDescription>Creates the employee and their first salary record.</DialogDescription>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pay currency" htmlFor="currency" error={errors.currency?.message}>
              <select id="currency" className={formSelectClass} defaultValue="" {...register('currency')}>
                <option value="" disabled>
                  Select…
                </option>
                {fx?.rates?.map((rate) => (
                  <option key={rate.currency} value={rate.currency}>
                    {rate.currency}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Hire date" htmlFor="hireDate" error={errors.hireDate?.message}>
              <Input id="hireDate" type="date" {...register('hireDate')} />
            </FormField>
          </div>

          <FormField label="Annual salary" htmlFor="amount" error={errors.amount?.message}>
            <Input id="amount" type="number" step="0.01" min="0" {...register('amount')} />
          </FormField>

          {mutation.isError && <p className="text-destructive text-sm">{errorMessage(mutation.error)}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
