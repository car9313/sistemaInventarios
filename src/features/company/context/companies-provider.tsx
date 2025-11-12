import { createContext, useContext, useState } from 'react'
import useDialogState from '../../../hooks/use-dialog-state'
import { type Company } from '../data/schema'

type CompaniesDialogType = 'create' | 'update' | 'delete' | 'import' | 'view'

type CompaniesContextType = {
  open: CompaniesDialogType | null
  setOpen: (str: CompaniesDialogType | null) => void
  currentRow: Company | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Company | null>>
}
const CompaniesContext = createContext<CompaniesContextType | null>(null)

export function CompaniesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CompaniesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Company | null>(null)

  return (
    <CompaniesContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </CompaniesContext>
  )
}
export const useContextCompanies = () => {
  const companiesContext = useContext(CompaniesContext)

  if (!companiesContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return companiesContext
}
