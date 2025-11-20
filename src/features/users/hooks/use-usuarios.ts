import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMyAuthStore } from '../../../stores/my-auth-store'
import {
  type CreateUsuarioInput,
  createUsuarioSchema,
  type Usuario,
} from '../data/schema'
import { userRepo } from '../repo/user-repo'

const repo = userRepo()

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async (): Promise<Usuario[]> => {
      const { data, error } = await repo.listUser()
      console.log(data)
      if (error) throw error
      return data
    },
  })
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (usuarioData: CreateUsuarioInput) => {
      const { user: currentUser } = useMyAuthStore.getState()

      console.log(currentUser?.full_name)
      if (!currentUser) throw new Error('No autenticado')

      // Validar datos
      const validatedData = createUsuarioSchema.parse(usuarioData)
      const data = await repo.createUser(validatedData, currentUser.auth_id)
      if (data.error) throw data.error
      return data.user
    },
    onSuccess: () => {
      // ⭐️ SOLUCIÓN NUCLEAR: Recargar la página completamente
      window.location.reload()
      // 3. Invalidar y re-fetch inmediatamente
      //queryClient.invalidateQueries({ queryKey: ['usuarios'] })

      // 4. Forzar un re-fetch adicional después de un breve delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      }, 500)
    },
  })
}
