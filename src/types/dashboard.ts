export interface DashboardKpi {
  activeAthletes: number
  liveSessions: number
  revenueUsd: number
  onlineStations: number
}

export interface TimeSeriesPoint {
  t: string
  v: number
}

export interface DistributionSlice {
  name: string
  value: number
}
