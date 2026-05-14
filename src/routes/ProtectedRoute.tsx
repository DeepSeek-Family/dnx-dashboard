import { Spin } from 'antd'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthSession } from '@/context/AuthSessionContext'
import { ROUTES } from '@/constants/routes'

export function ProtectedRoute() {
  const location = useLocation()
  const { accessToken, user, hydrated } = useAuthSession()

  if (!hydrated) return <Spin size="large" fullscreen tip="Hydrating biometric console..." />

  if (!accessToken || !user) return <Navigate to={ROUTES.login} state={{ from: location }} replace />

  return <Outlet />
}
