import { ADMIN_ROLES, type AdminRole } from '@/constants/routes'
import type { AuthUser } from '@/types/auth'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const segment = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = (4 - (segment.length % 4)) % 4
    const base64 = segment + '='.repeat(pad)
    const json = atob(base64)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function isJwtExpired(payload: Record<string, unknown>): boolean {
  const raw = payload.exp
  const exp = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  if (!Number.isFinite(exp)) return false
  return exp * 1000 <= Date.now()
}

function parseRoles(raw: unknown): AdminRole[] {
  const allowed = new Set<string>(ADMIN_ROLES)
  if (typeof raw === 'string' && allowed.has(raw)) return [raw as AdminRole]
  if (!Array.isArray(raw)) return []
  return raw.filter((r): r is AdminRole => typeof r === 'string' && allowed.has(r))
}

export function userFromAccessToken(token: string | null): AuthUser | null {
  if (!token?.trim()) return null
  const payload = decodeJwtPayload(token)
  if (!payload || isJwtExpired(payload)) {
    return null
  }
  const email =
    typeof payload.email === 'string'
      ? payload.email
      : typeof payload.sub === 'string' && payload.sub.includes('@')
        ? payload.sub
        : 'operator@dnx.lab'
  const name =
    typeof payload.name === 'string'
      ? payload.name
      : typeof payload.fullName === 'string'
        ? payload.fullName
        : email.split('@')[0] || 'Operator'
  const id =
    typeof payload.sub === 'string'
      ? payload.sub
      : typeof payload.userId === 'string'
        ? payload.userId
        : 'session'
  const roles = parseRoles(payload.roles ?? payload.role)
  return {
    id,
    email,
    name,
    roles: roles.length > 0 ? roles : ['admin'],
    avatarUrl: typeof payload.avatarUrl === 'string' ? payload.avatarUrl : undefined,
  }
}
