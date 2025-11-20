import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
  companyFormUpdateSchema,
  type CompanyUpdateForm,
} from '../data/schema'
import { useCreateCompany, useUpdateCompany } from '../hooks/use-companies'

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

  const { mutateAsync: createCompanyAsync } = useCreateCompany()
  const { mutateAsync: updateCompanyAsync } = useUpdateCompany()
  // elegir esquema/resolver según si es create o update
  const form = useForm({
    resolver: zodResolver(
      isUpdate ? companyFormUpdateSchema : companyFormCreateSchema
    ),
    defaultValues: isUpdate ? { name: currentRow?.name ?? '' } : undefined,
  })
  useEffect(() => {
    if (currentRow) {
      form.reset({ name: currentRow.name })
    } else {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRow])

  const onSubmit = async (data: CompanyCreateForm | CompanyUpdateForm) => {
    console.log('Submitting data:', data)
    console.log('Is update:', isUpdate)
    console.log('Current row:', currentRow)
    try {
      if (isUpdate && currentRow) {
        // enviar SOLO los campos del formulario: supabase hará update parcial
        await updateCompanyAsync({ id: currentRow.id, data })
        form.reset()
        onOpenChange(false)
        toast.success('Empresa actualizada')
        return
      }

      await createCompanyAsync(data as CompanyCreateForm)
      form.reset()
      onOpenChange(false)
      toast.success('Empresa creada')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      toast.error(message || 'Error al enviar el formulario')
    }
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
          <Button
            type='submit'
            form='user-form'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <svg
                  className='mr-2 -ml-1 h-4 w-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
