import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import {
  type CompanyCreateForm,
  companySchema,
  type Company,
  companyFormCreateSchema,
  companyFormUpdateSchema,
} from '../data/schema'
import { companyRepo } from './../repo/company-repo'

// ✅ Listar empresas del usuario actual
const repo = companyRepo()
export const useCompanies = () => {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await repo.listCompanies()
      if (error) throw error
      return data
    },
  })
}

// ✅ Crear empresa
export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (companyForm: CompanyCreateForm) => {
      // Validar con Zod
      console.log(companyForm)
      const validatedData = companyFormCreateSchema.parse(companyForm)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Usuario no autenticado')

      const { error } = await repo.createCompany(validatedData, session.user.id)
      if (error) throw error
    },
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

// ✅ Actualizar empresa
export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Pick<CompanyCreateForm, 'name'>
    }) => {
      const validatedData = companyFormUpdateSchema.parse(data)
      const { error } = await repo.updateCompany(id, validatedData)
      if (error) throw error
    },
    onSuccess: (_, { id }) => {
      // Invalidar caché
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', id] })
    },
  })
}

// ✅ Eliminar empresa
export const useDeleteCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.deleteCompany(id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

// ✅ Obtener una empresa por ID (para edición/detalle)
export const useCompany = (id: string) => {
  return useQuery<Company>({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await repo.getCompany(id)
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
