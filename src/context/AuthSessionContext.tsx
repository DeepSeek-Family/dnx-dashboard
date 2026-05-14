import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { AuthUser } from '@/types/auth'
import { clearStoredAuth } from '@/services/auth/tokenStorage'
import { getFromLocalStorage, removeFromLocalStorage, TOKEN_STORAGE_KEY } from '@/utils/local-storage'
import { userFromAccessToken } from '@/utils/auth-session'

type AuthSessionValue = {
  hydrated: boolean
  accessToken: string | null
  user: AuthUser | null
  logout: () => void
  refresh: () => void
}

const AuthSessionContext = createContext<AuthSessionValue | null>(null)

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    queueMicrotask(() => {
      const stored = getFromLocalStorage(TOKEN_STORAGE_KEY)
      if (stored?.trim()) {
        const parsed = userFromAccessToken(stored)
        if (!parsed) {
          removeFromLocalStorage(TOKEN_STORAGE_KEY)
          setToken(null)
        } else {
          setToken(stored)
        }
      } else {
        setToken(null)
      }
      setHydrated(true)
    })
  }, [])

  const user = useMemo(() => userFromAccessToken(token), [token])

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
  }, [])

  const refresh = useCallback(() => {
    const stored = getFromLocalStorage(TOKEN_STORAGE_KEY)
    if (!stored?.trim()) {
      setToken(null)
      return
    }
    const parsed = userFromAccessToken(stored)
    if (!parsed) {
      removeFromLocalStorage(TOKEN_STORAGE_KEY)
      setToken(null)
      return
    }
    setToken(stored)
  }, [])

  const value = useMemo<AuthSessionValue>(
    () => ({
      hydrated,
      accessToken: token,
      user,
      logout,
      refresh,
    }),
    [hydrated, token, user, logout, refresh],
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useAuthSession(): AuthSessionValue {
  const ctx = useContext(AuthSessionContext)
  if (!ctx) {
    throw new Error('useAuthSession must be used within AuthSessionProvider')
  }
  return ctx
}
