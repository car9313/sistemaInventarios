import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type CompanyCreateForm,
  type Company,
  companyFormCreateSchema,
} from '../data/schema'
import { useCreateCompany } from '../hooks/use-companies'

type CompanyActionDialogProps = {
  currentRow?: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompaniesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CompanyActionDialogProps) {
  const isUpdate = !!currentRow

  const { mutate: createCompany } = useCreateCompany()
  const form = useForm<CompanyCreateForm>({
    resolver: zodResolver(companyFormCreateSchema),
    defaultValues: currentRow,
  })

  const onSubmit = (data: CompanyCreateForm) => {
    console.log(data)
    createCompany(data, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isUpdate ? 'Update' : 'Create'} Comapany</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Update the company here. '
              : 'Create new company here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[20.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Mi empresa'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
