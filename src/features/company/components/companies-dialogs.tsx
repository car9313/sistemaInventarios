import { toast } from 'sonner'
import { ConfirmDialog } from '../../../components/confirm-dialog'
import { showSubmittedData } from '../../../lib/show-submitted-data'
import { useContextCompanies } from '../context/companies-provider'
import { useDeleteCompany } from '../hooks/use-companies'
import { CompaniesActionDialog } from './companies-action-dialog'
import { CompaniesImportDialog } from './companies-import-dialog'
import { CompaniesViewDialog } from './companies-view-dialog'

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useContextCompanies()
  const { mutateAsync: deleteCompanyAsync } = useDeleteCompany()
  return (
    <>
      <CompaniesActionDialog
        key='company-create'
        open={open === 'create'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'create' : null)}
      />
      <CompaniesImportDialog
        key='company-import'
        open={open === 'import'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'import' : null)}
      />
      {currentRow && (
        <>
          <CompaniesViewDialog
            key={`company-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? 'view' : null)
              if (!isOpen) setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
          <CompaniesActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? 'update' : null)
              if (!isOpen) setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='comapany-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? 'delete' : null)
              if (!isOpen) setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setCurrentRow(null)
              /*  setTimeout(() => {
                setCurrentRow(null)
              }, 500) */
              /* showSubmittedData(
                currentRow,
                'The following company has been deleted:'
              ) */
              deleteCompanyAsync(currentRow.id)
              toast.success('Empresa eliminada')
            }}
            className='max-w-md'
            title={`Delete this company: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a company with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
