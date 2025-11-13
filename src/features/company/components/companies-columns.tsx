import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '../../../components/long-text'
import OwnerTooltip from '../../../components/owner-tooltip'
import { cn } from '../../../lib/utils'
import { type Company } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const companiesColumns: ColumnDef<Company>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'owner_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Owner Id' />
    ),
    cell: ({ row }) => {
      const raw = String(row.getValue('owner_id') ?? '')
      const short =
        raw.length > 24 ? `${raw.slice(0, 10)}...${raw.slice(-6)}` : raw
      return (
        <LongText
          className='max-w-[200px] ps-3'
          contentClassName='break-all max-w-[480px]'
          tooltip={<OwnerTooltip value={raw} />}
          forceTooltip
        >
          {short}
        </LongText>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const raw = String(row.getValue('name') ?? '')
      const short =
        raw.length > 40 ? `${raw.slice(0, 30)}...${raw.slice(-6)}` : raw
      return (
        <LongText
          className='max-w-[180px] ps-2'
          contentClassName='break-words'
          tooltip={<OwnerTooltip value={raw} />}
          forceTooltip
        >
          {short}
        </LongText>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='created_at' />
    ),
    cell: ({ row }) => {
      const raw = String(row.getValue('created_at') ?? '')
      const date = new Date(raw)
      const formatted = !isNaN(date.getTime())
        ? format(date, 'dd/MM/yyyy HH:mm')
        : raw
      return (
        <LongText
          className='max-w-[120px] ps-2'
          contentClassName='break-words'
          tooltip={raw}
        >
          {formatted}
        </LongText>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='updated_at' />
    ),
    cell: ({ row }) => {
      const raw = String(row.getValue('updated_at') ?? '')
      const date = new Date(raw)
      const formatted = !isNaN(date.getTime())
        ? format(date, 'dd/MM/yyyy HH:mm')
        : raw
      return (
        <LongText
          className='max-w-[120px] ps-2'
          contentClassName='break-words'
          tooltip={raw}
        >
          {formatted}
        </LongText>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
