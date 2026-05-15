import { AUTH_ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth-storage'

/** Legacy JSON blob for full auth payloads (not used by the current login flow). */
const LEGACY_AUTH_BLOB_KEY = 'dnx-auth'

export function clearStoredAuth() {
  localStorage.removeItem(LEGACY_AUTH_BLOB_KEY)
  localStorage.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)
}
