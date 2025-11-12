import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Company } from '../data/schema'

type CompaniesViewDialogProps = {
  currentRow?: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompaniesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CompaniesViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(state) => onOpenChange(state)}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Company details</DialogTitle>
          <DialogDescription>
            Details for the selected company.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-3 py-2'>
          {currentRow ? (
            <>
              <div className='grid grid-cols-3 items-center gap-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  ID
                </div>
                <div className='col-span-2 text-sm break-all'>
                  {currentRow.id}
                </div>
              </div>

              <div className='grid grid-cols-3 items-center gap-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Name
                </div>
                <div className='col-span-2 text-sm'>{currentRow.name}</div>
              </div>

              <div className='grid grid-cols-3 items-center gap-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Owner
                </div>
                <div className='col-span-2 text-sm'>{currentRow.owner_id}</div>
              </div>

              <div className='grid grid-cols-3 items-center gap-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Created
                </div>
                <div className='col-span-2 text-sm'>
                  {currentRow.created_at}
                </div>
              </div>

              <div className='grid grid-cols-3 items-center gap-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Updated
                </div>
                <div className='col-span-2 text-sm'>
                  {currentRow.updated_at}
                </div>
              </div>
            </>
          ) : (
            <div>No company selected.</div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
