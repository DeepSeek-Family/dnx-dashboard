export type SessionStatus = 'Recovery' | 'Moderate' | 'High' | 'Peak'

export interface LiveSessionRow {
  athleteId: string
  athleteName: string
  heartRate: number
  sessionSeconds: number
  stationId: string
  stationLabel: string
  loadScore: number
  status: SessionStatus
  fatigue: number
  recoveryScore: number
}

export interface StationActivity {
  stationId: string
  label: string
  occupancy: number
  motionEvents: number
  activeAthlete?: string
}
