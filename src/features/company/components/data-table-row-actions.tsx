import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useContextCompanies } from '../context/companies-provider'
import { companySchema } from '../data/schema'
import { useCreateCompany } from '../hooks/use-companies'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const company = companySchema.parse(row.original)

  const { setOpen, setCurrentRow } = useContextCompanies()
  const { mutate: createCompany } = useCreateCompany()
  const [isCopying, setIsCopying] = useState(false)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(company)
            setOpen('view')
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(company)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (isCopying) return
            setIsCopying(true)
            createCompany(
              { name: `${company.name} (copy)` },
              {
                onSuccess: () => {
                  toast.success('Company copied')
                  setIsCopying(false)
                },
                onError: (err: unknown) => {
                  const msg = err instanceof Error ? err.message : String(err)
                  toast.error(msg || 'Could not copy company')
                  setIsCopying(false)
                },
              }
            )
          }}
          disabled={isCopying}
        >
          {isCopying ? 'Copying...' : 'Make a copy'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(company)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
