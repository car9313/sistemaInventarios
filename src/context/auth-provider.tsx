// src/app/providers/AuthProvider.tsx
import { useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { repoAuth } from '@/features/auth/repo/repoAuth'
import { useMyAuthStore } from '../stores/my-auth-store'

// ⭐️ Variable global para controlar si ignorar eventos
let ignoreAuthEvents = false

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setAuth = useMyAuthStore((s) => s.setAuth)
  const clearAuth = useMyAuthStore((s) => s.clearAuth ?? s.logout)
  const setIsLoading = useMyAuthStore((s) => s.setIsLoading)
  const isLoading = useMyAuthStore((s) => s.isLoading)
  const handleSessionChange = useMyAuthStore((s) => s.handleSessionChange)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  // ⭐️ Función para ignorar eventos temporalmente
  const ignoreEventsTemporarily = (ms: number = 5000) => {
    ignoreAuthEvents = true
    setTimeout(() => {
      ignoreAuthEvents = false
    }, ms)
  }

  useEffect(() => {
    const repo = repoAuth()
    let mounted = true

    const normalize = (sess?: Session | null) => sess ?? null

    const fetchAndSetAuth = async (allowClear = true) => {
      setIsLoading(true)
      try {
        if (!mounted) return
        const res = await repo.getSessionUser()
        if (!mounted) return
        if (res.user) {
          setAuth({ user: res.user, session: normalize(res.session) })
        } else if (allowClear) {
          clearAuth()
        }
      } catch (e) {
        console.error('[AuthProvider] fetchAndSetAuth error', e)
        clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    const rehydrate = async () => {
      console.log('[AuthProvider] rehydrating auth state')
      await fetchAndSetAuth(true)
    }

    rehydrate()

    const onAuthStateChange = async (
      event: string,
      session: Session | null
    ) => {
      // ⭐️ IGNORAR TODOS LOS EVENTOS SI ESTÁ ACTIVO EL FLAG
      if (ignoreAuthEvents) {
        console.log(
          `[AuthProvider] Ignoring ${event} due to temporary ignore flag`
        )
        return
      }

      console.log(`[AuthProvider] Auth state change: ${event}`, {
        sessionUserId: session?.user?.id,
        currentStoreUser: useMyAuthStore.getState().user?.auth_id,
      })

      const newSession = normalize(session)

      // If there's no session (signed out / deleted) clear the store and exit.
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED' || !newSession) {
        clearAuth()
        return
      }

      // Delegate session-change handling to the store.
      try {
        const handled = handleSessionChange?.(newSession)
        if (handled) return
      } catch (e) {
        console.error('[AuthProvider] handleSessionChange error', e)
      }

      await fetchAndSetAuth(true)
    }

    const sub = repo.onAuthStateChange(onAuthStateChange)
    subscriptionRef.current = sub

    return () => {
      mounted = false
      try {
        sub?.unsubscribe?.()
      } catch {
        // noop
      }
    }
  }, [setAuth, clearAuth, setIsLoading, handleSessionChange])

  console.log('AuthProvider render, isLoading:', isLoading)
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <span>Loading...</span>
      </div>
    )
  }
  return <>{children}</>
}

// ⭐️ Exportar función para que otros módulos puedan ignorar eventos
export const temporarilyIgnoreAuthEvents = (ms: number = 5000) => {
  ignoreAuthEvents = true
  setTimeout(() => {
    ignoreAuthEvents = false
  }, ms)
}
