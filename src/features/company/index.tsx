import { ConfigDrawer } from '../../components/config-drawer'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { CompaniesDialogs } from './components/companies-dialogs'
import { CompaniesPrimaryButtons } from './components/companies-primary-buttons'
import { CompaniesTable } from './components/companies-table'
import { CompaniesProvider } from './context/companies-provider'
import { useCompanies } from './hooks/use-companies'

export default function Companies() {
  const { data: companies = [] } = useCompanies()
  return (
    <CompaniesProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Companies</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your companies for this month!
            </p>
          </div>
          <CompaniesPrimaryButtons />
        </div>
        <CompaniesTable data={companies} />
      </Main>
      <CompaniesDialogs />
    </CompaniesProvider>
  )
}
