import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMyAuthStore } from '@/stores/my-auth-store'
import { supabase } from '@/lib/supabase'
import {
  type RegisterInput,
  type LoginInput,
  loginSchema,
  registerSchema,
} from '@/features/auth/schemas/auth-schema'
import { repoAuth } from '../repo/repoAuth'

const authRepo = repoAuth()

/* export const useSessionUser = () => {
para que chapgpt lo lea me gustaria usar el getSessionUser
} */
// Login mutation

// En tus hooks de autenticación - useLogin es el ÚNICO que actualiza
export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuth = useMyAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const validatedCredentials = loginSchema.parse(credentials)

      // ⭐️ Solo llamar al repositorio para obtener datos
      const data = await authRepo.login(validatedCredentials)
      if (data.error) throw data.error

      // ⭐️ ACTUALIZAR EL STORE SOLO AQUÍ
      if (data.user && data.session) {
        setAuth({
          user: data.user,
          session: data.session,
        })
      }

      return data
    },
    onSuccess: (data) => {
      console.log('Login manual exitoso, usuario:', data.user?.email)
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['profile', data.user?.id] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
    onError: (error) => {
      console.error('Error en useLogin:', error)
    },
  })
}

// useRegister (si necesitas login después del registro)
export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuth = useMyAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const validatedData = registerSchema.parse(userData)
      const authData = await authRepo.registerPublic(validatedData)
      return authData
    },
    onSuccess: (data) => {
      // Si quieres hacer login automático después del registro
      if (data.user && data.session) {
        setAuth({ user: data.user, session: data.session })
      }
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const clearAuth = useMyAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: async () => {
      await authRepo.signOut()
    },
    onSuccess: () => {
      clearAuth() // ⭐️ Actualizar store solo en el hook
      queryClient.clear()
    },
  })
}

// Get user profile
export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId!)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
