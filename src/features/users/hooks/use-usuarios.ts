import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMyAuthStore } from '../../../stores/my-auth-store'
import {
  type CreateUsuarioInput,
  createUsuarioSchema,
  type Usuario,
} from '../data/schema'
import { userRepo } from '../repo/user-repo'

const repo = userRepo()

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (usuarioData: CreateUsuarioInput) => {
      const { user: currentUser } = useMyAuthStore.getState()
      if (!currentUser) throw new Error('No autenticado')

      // Validar datos
      const validatedData = createUsuarioSchema.parse(usuarioData)
      const data = await repo.createUser(validatedData, 1)
      if (data.error) throw data.error
      return data.user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}

// GET - Obtener todos los usuarios
export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async (): Promise<Usuario[]> => {
      const { data, error } = await repo.listUser()
      if (error) throw error
      return data
    },
  })
}
