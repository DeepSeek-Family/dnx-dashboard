import { AUTH_ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth-storage'

export const TOKEN_STORAGE_KEY = AUTH_ACCESS_TOKEN_STORAGE_KEY

export const setToLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === 'undefined') {
    return
  }

  localStorage.setItem(key, value)
}

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(key)
}

export const removeFromLocalStorage = (key: string) => {
  if (!key || typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(key)
}
