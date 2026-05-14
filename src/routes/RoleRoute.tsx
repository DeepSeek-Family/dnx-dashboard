import { Navigate, Outlet } from 'react-router-dom'

import { useAuthSession } from '@/context/AuthSessionContext'
import type { AdminRole } from '@/constants/routes'
import { ROUTES } from '@/constants/routes'
import { canAccess } from '@/hooks/useRoleAccess'

export function RoleRoute({ allow }: { allow: AdminRole[] }) {
  const { user } = useAuthSession()
  if (!canAccess(user, allow)) return <Navigate to={ROUTES.login} replace />
  return <Outlet />
}
