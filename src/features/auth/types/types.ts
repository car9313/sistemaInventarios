import type { Session as SupabaseSession, Session } from '@supabase/supabase-js'
import { type LoginInput, type RegisterInput } from '../schemas/auth-schema'

export type AuthError = {
  code?: string
  message: string
}

export type SignInDTO = { email: string; password: string }

export type AuthRepository = {
  login: (dto: LoginInput) => Promise<{
    user?: AuthUser
    session?: SupabaseSession
    error?: AuthError
  }>
  registerPublic: (dto: RegisterInput) => Promise<{
    user?: AuthUser
    session?: SupabaseSession
    error?: AuthError
  }>
  signOut: () => Promise<{ error?: AuthError }>

  getSessionUser: () => Promise<{
    user?: AuthUser
    session?: SupabaseSession
    error?: AuthError
  }>
  onAuthStateChange: (
    cb: (event: string, session: SupabaseSession | null) => void
  ) => { unsubscribe: () => void }
}

export type Profile = {
  id: number
  full_name: string
  role: string
  auth_id: string
  created_by?: number | null
}

export type AuthUser = Profile & { email: string }

export type AuthResult = {
  user?: AuthUser
  session?: Session | null
  error?: { code?: string; message: string }
}
