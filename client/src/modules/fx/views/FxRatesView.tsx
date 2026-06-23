import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { errorMessage } from '@/modules/employees/hooks/use-employee-mutations'
import { formatDate } from '@/modules/employees/utils/format'

import { useFxRates } from '../hooks/use-fx-rates'
import { useUpdateFxRates } from '../hooks/use-update-fx-rates'
import {
  BASE_CURRENCY,
  fxRatesFormSchema,
  type FxRatesForm,
  type FxRatesFormInput,
} from '../schemas/fx-form-schema'

export function FxRatesView() {
  const { data, isLoading, isError } = useFxRates()
  const mutation = useUpdateFxRates()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FxRatesFormInput, unknown, FxRatesForm>({
    resolver: zodResolver(fxRatesFormSchema),
    defaultValues: { rates: [] },
  })

  const { fields } = useFieldArray({ control, name: 'rates' })

  // Seed the form once rates arrive (and after a save returns fresh values).
  useEffect(() => {
    if (data) {
      reset({
        rates: data.rates.map((rate) => ({
          currency: rate.currency,
          rateToBase: rate.rateToBase,
        })),
      })
    }
  }, [data, reset])

  const onSubmit = (values: FxRatesForm) => {
    // Reset the dirty baseline to the saved values so feedback is immediate and
    // does not depend on the background refetch returning a changed reference.
    mutation.mutate(values.rates, { onSuccess: () => reset({ rates: values.rates }) })
  }

  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">FX rates</h1>
        <p className="text-muted-foreground">
          One unit of each currency converts to <strong>{data?.base ?? BASE_CURRENCY}</strong> at its rate.
          Salaries are normalised with these rates across the directory and dashboard.
        </p>
      </header>

      {isError ? (
        <p className="text-destructive text-sm">
          Could not load FX rates. Check the API is running and try again.
        </p>
      ) : !data ? (
        <p className="text-muted-foreground">{isLoading ? 'Loading rates…' : null}</p>
      ) : (
        <Card className="px-(--card-spacing)">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead className="w-48">Rate to {data.base}</TableHead>
                  <TableHead className="text-right">Last updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const isBase = field.currency === BASE_CURRENCY
                  const error = errors.rates?.[index]?.rateToBase?.message
                  const source = data.rates[index]
                  return (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">
                        {field.currency}
                        {isBase && <span className="text-muted-foreground ml-2 text-xs">base</span>}
                        <input type="hidden" {...register(`rates.${index}.currency`)} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          disabled={isBase}
                          aria-label={`Rate for ${field.currency}`}
                          aria-invalid={error ? true : undefined}
                          {...register(`rates.${index}.rateToBase`)}
                        />
                        {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-sm">
                        {source?.updatedAt ? formatDate(source.updatedAt) : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-end gap-3">
              {mutation.isError && (
                <p className="text-destructive mr-auto text-sm">{errorMessage(mutation.error)}</p>
              )}
              {mutation.isSuccess && !isDirty && (
                <p className="text-muted-foreground mr-auto text-sm">Rates saved.</p>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || mutation.isPending}
                onClick={() =>
                  reset({
                    rates: data.rates.map((rate) => ({
                      currency: rate.currency,
                      rateToBase: rate.rateToBase,
                    })),
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save rates'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
