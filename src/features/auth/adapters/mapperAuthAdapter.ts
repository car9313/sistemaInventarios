import type { User as SupabaseUser } from '@supabase/supabase-js'
import { type AuthUser, type Profile } from '../types/types'

/**
 * Mapper estricto (Opción B)
 * - exige id y auth_id (si faltan -> lanza)
 * - devuelve strings/fallbacks que tu DTO requiere
 */
export const mapDbUsuarioToAuthUser = (
  row: Profile | null,
  supabaseUser?: SupabaseUser
): AuthUser => {
  if (!row && !supabaseUser) {
    throw new Error(
      'No se puede crear AuthUser: ni fila usuarios ni supabaseUser disponibles'
    )
  }

  const resolvedId = row?.id
  const resolvedAuthId = row?.auth_id ?? supabaseUser?.id

  if (resolvedId === undefined || resolvedId === null) {
    throw new Error('No se puede crear AuthUser: id de usuarios ausente')
  }

  if (!resolvedAuthId) {
    throw new Error('No se puede crear AuthUser: auth_id ausente')
  }

  // Email obligatorio: debe venir de row o supabaseUser
  const email = supabaseUser?.email
  if (!email) {
    throw new Error('No se puede crear AuthUser: email ausente')
  }

  // full_name obligatorio: preferimos row, si no tomamos metadata de Supabase
  const full_name = row?.full_name ?? supabaseUser?.user_metadata?.fullName
  if (!full_name) {
    throw new Error('No se puede crear AuthUser: full_name ausente')
  }

  // role obligatorio: debe venir de la DB (row), no se toma de Supabase
  const role = row?.role
  if (!role) {
    throw new Error('No se puede crear AuthUser: role ausente')
  }

  const created_by = row?.created_by ?? null

  return {
    id: resolvedId,
    auth_id: resolvedAuthId,
    email,
    full_name,
    role,
    created_by,
  }
}
