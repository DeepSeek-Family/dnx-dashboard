import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { DASHBOARD_ACCESS_ROLES, ROUTES } from '@/constants/routes'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const RankingsPage = lazy(() => import('@/pages/RankingsPage'))
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'))
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'))
const GymManagementPage = lazy(() => import('@/pages/GymManagementPage'))
const SubscriptionsPage = lazy(() => import('@/pages/SubscriptionsPage'))
const SupportPage = lazy(() => import('@/pages/SupportPage'))
const TermsConditionsPage = lazy(() => import('@/pages/TermsConditionsPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allow={DASHBOARD_ACCESS_ROLES} />}>
            <Route element={<DashboardLayout />}>
              <Route path={ROUTES.dashboard.slice(1)} element={<DashboardPage />} />
              <Route path={ROUTES.rankings.slice(1)} element={<RankingsPage />} />
              <Route path={ROUTES.users.slice(1)} element={<UserManagementPage />} />
              <Route path="users/:id" element={<UserProfilePage />} />
              <Route path={ROUTES.gyms.slice(1)} element={<GymManagementPage />} />
              <Route
                path={ROUTES.subscriptions.slice(1)}
                element={<SubscriptionsPage />}
              />
              <Route path={ROUTES.support.slice(1)} element={<SupportPage />} />
              <Route path={ROUTES.terms.slice(1)} element={<TermsConditionsPage />} />
              <Route path={ROUTES.privacy.slice(1)} element={<PrivacyPolicyPage />} />
              <Route path={ROUTES.settings.slice(1)} element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
    </Suspense>
  )
}
