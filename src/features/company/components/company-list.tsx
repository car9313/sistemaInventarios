import { useNavigate } from '@tanstack/react-router'
import { Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCompanies, useDeleteCompany } from '../hooks/use-companies'

export function CompanyList() {
  const { data: companies = [], isLoading } = useCompanies()
  const { mutate: deleteCompany } = useDeleteCompany()
  const navigate = useNavigate()

  if (isLoading) return <div>Cargando empresas...</div>

  return (
    <div className='grid gap-4'>
      {companies.length === 0 ? (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>No tienes empresas aún.</p>
          {/* <Button onClick={() => navigate({ to: '/companies/new' })} className="mt-4">
            Crear primera empresa
          </Button> */}
        </div>
      ) : (
        companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>{company.name}</span>
                <div className='flex gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      navigate({ to: `/companies/${company.id}/edit` })
                    }
                  >
                    <Edit3 className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      if (
                        confirm(
                          '¿Eliminar empresa? Esta acción no se puede deshacer.'
                        )
                      ) {
                        deleteCompany(company.id)
                      }
                    }}
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Creada el {new Date(company.created_at).toLocaleDateString()}
              </p>
              <Button
                className='mt-4'
                onClick={() =>
                  navigate({ to: `/companies/${company.id}/warehouses` })
                }
              >
                Ver almacenes
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
