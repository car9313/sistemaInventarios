import { temporarilyIgnoreAuthEvents } from '../../../context/auth-provider'
import { supabase } from '../../../lib/supabase'
import { mapDbUsuarioToAuthUser } from '../../auth/adapters/mapperAuthAdapter'
import {
  extractMessage,
  getErrorMessage,
  getErrorName,
} from '../../auth/repo/repoAuth'
import type { AuthError, AuthUser, Profile } from '../../auth/types/types'
import { type CreateUsuarioInput } from '../data/schema'

export const userRepo = (opts?: { supabaseClient?: typeof supabase }) => {
  const client = opts?.supabaseClient ?? supabase

  const listUser = async () => {
    return await supabase.from('usuarios').select('*')
  }

  const createUser = async (
    usuarioData: CreateUsuarioInput,
    idCurrentUser: string
  ) => {
    console.log('ID del usuario actual:', idCurrentUser)

    // ⭐️ 1. Activar flag para ignorar eventos de auth
    temporarilyIgnoreAuthEvents(3000) // Ignorar por 3 segundos

    try {
      // 2. Crear el nuevo usuario
      const res = await client.auth.signUp({
        email: usuarioData.email,
        password: usuarioData.password,
      })

      if (res.error) {
        return {
          error: {
            code: getErrorName(res.error) ?? 'AUTH_ERROR',
            message:
              getErrorMessage(res.error) ??
              res.error.message ??
              'Error de signUp',
          } as AuthError,
        }
      }

      const supUser = res.data?.user ?? null

      if (!supUser) {
        return {
          error: {
            message: 'No se creó el usuario en Supabase',
          } as AuthError,
        }
      }

      // 3. Insertar en tu tabla usuarios
      const insertPayload: Omit<Profile, 'id'> = {
        auth_id: supUser.id,
        full_name: usuarioData.full_name,
        role: usuarioData.role,
        created_by: idCurrentUser,
      }

      const { data: createdUsuario, error: insertError } = await client
        .from('usuarios')
        .insert(insertPayload)
        .select()
        .maybeSingle()

      if (insertError) {
        return {
          error: { message: extractMessage(insertError) } as AuthError,
        }
      }

      if (!createdUsuario) {
        return {
          error: {
            message: 'No se pudo crear el registro en usuarios',
          } as AuthError,
        }
      }

      let user: AuthUser
      try {
        user = mapDbUsuarioToAuthUser(createdUsuario, supUser)
      } catch (mErr: unknown) {
        return { error: { message: extractMessage(mErr) } as AuthError }
      }

      return { user }
    } catch (err: unknown) {
      return { error: { message: extractMessage(err) } as AuthError }
    }
  }
  return {
    listUser,
    createUser,
  }
}
