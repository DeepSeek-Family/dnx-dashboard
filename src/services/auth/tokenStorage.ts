import { AUTH_ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth-storage'
import type { AuthTokens, AuthUser } from '@/types/auth'

/** Legacy JSON blob for full auth payloads (not used by the current login flow). */
const LEGACY_AUTH_BLOB_KEY = 'dnx-auth'

export interface StoredAuth {
  user: AuthUser
  tokens: AuthTokens
}

export function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(LEGACY_AUTH_BLOB_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export function persistAuth(data: StoredAuth) {
  localStorage.setItem(LEGACY_AUTH_BLOB_KEY, JSON.stringify(data))
}

export function clearStoredAuth() {
  localStorage.removeItem(LEGACY_AUTH_BLOB_KEY)
  localStorage.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)
}
