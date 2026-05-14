import type { AdminRole } from '@/constants/routes'

export interface AuthUser {
  id: string
  email: string
  name: string
  roles: AdminRole[]
  avatarUrl?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}
