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

/** POST /auth/change-password request body */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

/** Ant Design form values before mapping to the API */
export interface ChangePasswordFormValues {
  oldPassword: string
  newPassword: string
}

export interface SettingsProfileUser {
  name?: string
  email?: string
  profile?: string
  role?: string
}

export interface UpdateProfileFormValues {
  name: string
}
