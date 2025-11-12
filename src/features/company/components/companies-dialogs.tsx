import { ConfirmDialog } from '../../../components/confirm-dialog'
import { showSubmittedData } from '../../../lib/show-submitted-data'
import { useContextCompanies } from '../context/companies-provider'
import { CompaniesActionDialog } from './companies-action-dialog'
import { CompaniesImportDialog } from './companies-import-dialog'
import { CompaniesViewDialog } from './companies-view-dialog'

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useContextCompanies()
  return (
    <>
      <CompaniesActionDialog
        key='company-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />
      <CompaniesImportDialog
        key='company-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />
      {currentRow && (
        <>
          <CompaniesViewDialog
            key={`company-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <CompaniesActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='comapany-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
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
