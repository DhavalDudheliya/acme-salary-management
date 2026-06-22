import { useState } from 'react'
import { useForm } from 'react-hook-form'
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

import type { EmployeeDetail } from '../api/types'
import { useChangeSalary, errorMessage } from '../hooks/use-employee-mutations'
import {
  salaryChangeFormSchema,
  type SalaryChangeForm,
  type SalaryChangeFormInput,
} from '../schemas/employee-form-schemas'
import { FormField, formSelectClass } from './forms/FormField'

const REASONS = ['merit increase', 'promotion', 'market adjustment', 'annual review', 'retention']

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function SalaryChangeDialog({ employee }: { employee: EmployeeDetail }) {
  const [open, setOpen] = useState(false)
  const mutation = useChangeSalary(employee.id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalaryChangeFormInput, unknown, SalaryChangeForm>({
    resolver: zodResolver(salaryChangeFormSchema),
    defaultValues: { effectiveDate: today(), reason: REASONS[0] },
  })

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset({ effectiveDate: today(), reason: REASONS[0] })
      mutation.reset()
    }
  }

  const onSubmit = (values: SalaryChangeForm) => {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button>Change salary</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change salary</DialogTitle>
          <DialogDescription>
            Appends a new record to {employee.firstName}&apos;s salary history. History is never edited.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <FormField label={`Amount (${employee.currency})`} htmlFor="amount" error={errors.amount?.message}>
            <Input id="amount" type="number" step="0.01" min="0" {...register('amount')} />
          </FormField>

          <FormField label="Effective date" htmlFor="effectiveDate" error={errors.effectiveDate?.message}>
            <Input id="effectiveDate" type="date" {...register('effectiveDate')} />
          </FormField>

          <FormField label="Reason" htmlFor="reason" error={errors.reason?.message}>
            <select id="reason" className={formSelectClass} {...register('reason')}>
              {REASONS.map((reason) => (
                <option key={reason} value={reason} className="capitalize">
                  {reason}
                </option>
              ))}
            </select>
          </FormField>

          {mutation.isError && <p className="text-destructive text-sm">{errorMessage(mutation.error)}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save change'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
