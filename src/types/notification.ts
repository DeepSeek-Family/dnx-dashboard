export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  createdAt: string
  read: boolean
  source: 'device' | 'athlete' | 'competition' | 'system' | 'support'
}
