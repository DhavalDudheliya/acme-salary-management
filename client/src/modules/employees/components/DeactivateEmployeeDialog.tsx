import { useState } from 'react'

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

import type { EmployeeDetail } from '../api/types'
import { useDeactivateEmployee, errorMessage } from '../hooks/use-employee-mutations'

export function DeactivateEmployeeDialog({ employee }: { employee: EmployeeDetail }) {
  const [open, setOpen] = useState(false)
  const mutation = useDeactivateEmployee(employee.id)

  const onConfirm = () => {
    mutation.mutate(undefined, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive">Deactivate</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate {employee.firstName} {employee.lastName}?</DialogTitle>
          <DialogDescription>
            This marks the employee inactive. Their record and salary history are preserved and they
            can be reactivated later from Edit profile.
          </DialogDescription>
        </DialogHeader>

        {mutation.isError && <p className="text-destructive text-sm">{errorMessage(mutation.error)}</p>}

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
          <Button type="button" variant="destructive" disabled={mutation.isPending} onClick={onConfirm}>
            {mutation.isPending ? 'Deactivating…' : 'Deactivate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
