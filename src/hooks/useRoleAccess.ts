import type { AdminRole } from '@/constants/routes'
import type { AuthUser } from '@/types/auth'

export function hasRole(user: AuthUser | null | undefined, allowed: AdminRole[]) {
  if (!user) return false
  return user.roles.some((r) => allowed.includes(r))
}

export function canAccess(user: AuthUser | null | undefined, required?: AdminRole[]) {
  if (!required || required.length === 0) return true
  return hasRole(user, required)
}
