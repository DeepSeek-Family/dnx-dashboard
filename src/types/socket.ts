import type { BiometricDevice } from './device'
import type { LeaderboardEntry } from './ranking'
import type { LiveSessionRow } from './session'
import type { AppNotification } from './notification'

export interface SessionUpdatePayload {
  sessions: LiveSessionRow[]
  stationsOnline: number
}

export interface AthleteSocketPayload {
  athleteId: string
  patch: Partial<Pick<LiveSessionRow, 'heartRate' | 'loadScore' | 'status' | 'sessionSeconds'>>
}

export interface RankingUpdatePayload {
  scope: string
  top: LeaderboardEntry[]
}

export interface DeviceStatusPayload {
  devices: Partial<BiometricDevice> & { id: string }[]
}

export type AlertEventPayload = AppNotification
export interface SupportMessagePayload {
  ticketId: string
  from: 'admin' | 'user'
  text: string
  at: string
}

export type DnxSocketEvent =
  | { type: 'session_update'; payload: SessionUpdatePayload }
  | { type: 'athlete_update'; payload: AthleteSocketPayload }
  | { type: 'ranking_update'; payload: RankingUpdatePayload }
  | { type: 'device_status'; payload: DeviceStatusPayload }
  | { type: 'alert_event'; payload: AlertEventPayload }
  | { type: 'support_message'; payload: SupportMessagePayload }
