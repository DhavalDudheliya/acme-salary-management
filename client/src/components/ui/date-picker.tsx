import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id?: string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function parseDate(value?: string): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value?: string): string {
  const date = parseDate(value)
  return date
    ? new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date)
    : ''
}

export function DatePicker({
  id,
  value,
  onValueChange,
  placeholder = 'Pick a date',
  disabled,
  className,
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  const selected = parseDate(value)
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => {
    const initial = selected ?? new Date()
    return new Date(initial.getFullYear(), initial.getMonth(), 1)
  })

  const days = useMemo(() => {
    const firstDay = month.getDay()
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDay + 1
      return day > 0 && day <= daysInMonth
        ? new Date(month.getFullYear(), month.getMonth(), day)
        : null
    })
  }, [month])

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(month)

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          const current = selected ?? new Date()
          setMonth(new Date(current.getFullYear(), current.getMonth(), 1))
        }
        setOpen(next)
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={cn(
              'h-9 w-full justify-between px-3 font-normal',
              !value && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <span>{formatDate(value) || placeholder}</span>
        <CalendarDays className="text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent className="w-72" aria-label="Choose date">
        <div className="mb-2 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Previous month"
            onClick={() =>
              setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
            }
          >
            <ChevronLeft />
          </Button>
          <p className="text-sm font-medium">{monthLabel}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Next month"
            onClick={() =>
              setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
            }
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="grid grid-cols-7 text-center">
          {weekDays.map((day) => (
            <span key={day} className="text-muted-foreground py-1 text-xs font-medium">
              {day}
            </span>
          ))}
          {days.map((date, index) =>
            date ? (
              <Button
                key={toIsoDate(date)}
                type="button"
                variant={value === toIsoDate(date) ? 'default' : 'ghost'}
                size="icon-sm"
                className="mx-auto"
                aria-label={new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)}
                aria-pressed={value === toIsoDate(date)}
                onClick={() => {
                  onValueChange(toIsoDate(date))
                  setOpen(false)
                }}
              >
                {date.getDate()}
              </Button>
            ) : (
              <span key={`empty-${index}`} className="size-7" aria-hidden="true" />
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
