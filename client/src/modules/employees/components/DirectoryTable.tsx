import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { EmployeeRow } from '../api/types'
import { formatSalary } from '../utils/format'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** The API sort field for this column, if sortable. */
    sortField?: string
  }
}

const columns: ColumnDef<EmployeeRow>[] = [
  {
    id: 'name',
    header: 'Name',
    meta: { sortField: 'lastName' },
    cell: ({ row }) => (
      <Link
        to={`/employees/${row.original.id}`}
        className="font-medium text-foreground hover:underline"
      >
        {row.original.firstName} {row.original.lastName}
      </Link>
    ),
  },
  { id: 'department', header: 'Department', accessorKey: 'department', meta: { sortField: 'department' } },
  { id: 'country', header: 'Country', accessorKey: 'country', meta: { sortField: 'country' } },
  { id: 'jobTitle', header: 'Job title', accessorKey: 'jobTitle' },
  {
    id: 'salary',
    header: 'Current salary',
    cell: ({ row }) => formatSalary(row.original.currentSalary),
  },
  {
    id: 'status',
    header: 'Status',
    meta: { sortField: 'status' },
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'secondary' : 'outline'}>
        {row.original.status}
      </Badge>
    ),
  },
]

interface DirectoryTableProps {
  data: EmployeeRow[]
  sort?: string
  onSortChange: (sort: string | undefined) => void
  isLoading: boolean
}

/** Cycle a column's sort: none -> asc -> desc -> none. */
function nextSort(current: string | undefined, field: string): string | undefined {
  if (current === field) return `-${field}`
  if (current === `-${field}`) return undefined
  return field
}

export function DirectoryTable({ data, sort, onSortChange, isLoading }: DirectoryTableProps) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => {
              const field = header.column.columnDef.meta?.sortField
              const label = flexRender(header.column.columnDef.header, header.getContext())

              if (!field) {
                return <TableHead key={header.id}>{label}</TableHead>
              }

              const Icon = sort === field ? ArrowUp : sort === `-${field}` ? ArrowDown : ChevronsUpDown
              return (
                <TableHead key={header.id}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => onSortChange(nextSort(sort, field))}
                  >
                    {label}
                    <Icon className="size-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {isLoading ? 'Loading…' : 'No employees match these filters.'}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
