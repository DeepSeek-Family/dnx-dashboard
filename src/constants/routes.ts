export const ROUTES = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard/overview',
  rankings: '/rankings',
  users: '/users',
  userDetail: (id: string) => `/users/${id}`,
  gyms: '/gyms',
  subscriptions: '/subscription',
  support: '/support',
  terms: '/terms',
  privacy: '/privacy',
  settings: '/settings',
  // legacy aliases kept for compatibility with older modules
  liveSessions: '/dashboard/overview',
  athletes: '/users',
  athleteDetail: (id: string) => `/users/${id}`,
  stations: '/gyms',
  devices: '/settings',
  notifications: '/support',
} as const

export const ADMIN_ROLES = ['super_admin', 'admin', 'operator', 'viewer'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

/** Roles allowed to use the main dashboard shell and routes */
export const DASHBOARD_ACCESS_ROLES: AdminRole[] = ['admin', 'super_admin']
