import type { AthleteDetail, AthleteSummary, RankingPoint, SessionRecord } from '@/types/athlete'
import type { BiometricDevice } from '@/types/device'
import type { DashboardKpi, DistributionSlice, TimeSeriesPoint } from '@/types/dashboard'
import type { LeaderboardEntry } from '@/types/ranking'
import type { LiveSessionRow, StationActivity } from '@/types/session'

const names = [
  ['Maya Ortiz', 'Vertex Performance Lab'],
  ['Jonah Reeves', 'Ironline Athletics'],
  ['Sydney Chen', 'Pulse District'],
  ['Diego Martins', 'Vertex Performance Lab'],
  ['Nova Blake', 'Apex Movement'],
  ['Kai Andersen', 'DNX HQ'],
]

export const mockAthletes: AthleteSummary[] = names.map(([n, gym], i) => ({
  id: `ath-${i + 1}`,
  displayName: n,
  gym,
  state: ['CA', 'TX', 'NY', 'FL', 'WA', 'IL'][i % 6],
  country: 'US',
  dnxScore: 920 - i * 17,
  rankNational: i + 3,
  subscription: i % 3 === 0 ? 'free' : i % 3 === 1 ? 'pro' : 'elite',
  lastSessionAt: new Date(Date.now() - i * 3600000 * 6).toISOString(),
}))

export function athleteDetail(id: string): AthleteDetail | undefined {
  const base = mockAthletes.find((a) => a.id === id)
  if (!base) return undefined
  return {
    ...base,
    age: 22 + (id.charCodeAt(4) % 8),
    weightKg: 68 + (id.charCodeAt(4) % 14),
    heightCm: 168 + (id.charCodeAt(4) % 18),
    dominantSide: id.charCodeAt(4) % 2 === 0 ? 'R' : 'L',
    weeklyLoad: 62 + (id.charCodeAt(4) % 30),
    recoveryIndex: 72 + (id.charCodeAt(4) % 22),
    vo2Estimate: 48 + (id.charCodeAt(4) % 12),
  }
}

export function sessionHistory(athleteId: string): SessionRecord[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `sess-${athleteId}-${i}`,
    athleteId,
    startedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    endedAt: new Date(Date.now() - (i + 1) * 86400000 + 3600000).toISOString(),
    durationMin: 38 + (i % 20),
    avgHr: 128 + (i % 28),
    peakHr: 168 + (i % 22),
    loadScore: 42 + (i % 35),
    station: ['Sprint Rack', 'VO2 Dome', 'Kinetic Cage', 'Neuro Track'][i % 4],
  }))
}

export function rankingHistory(athleteId: string): RankingPoint[] {
  return Array.from({ length: 8 }).map((_, i) => ({
    week: `W${48 - i}`,
    rank: 4 + (i % 6) + (athleteId.charCodeAt(4) % 5),
    score: 880 + i * 6,
  }))
}

export const mockLiveSessions: LiveSessionRow[] = mockAthletes.slice(0, 5).map((a, i) => ({
  athleteId: a.id,
  athleteName: a.displayName,
  heartRate: 118 + i * 7,
  sessionSeconds: 1200 + i * 240,
  stationId: `st-${i + 1}`,
  stationLabel: ['Kinetic Cage A', 'VO2 Dome', 'Sprint Rack 2', 'Neuro Track', 'Bias Lab'][i],
  loadScore: 48 + i * 5,
  status: (['Recovery', 'Moderate', 'High', 'Peak', 'Moderate'] as const)[i],
  fatigue: 22 + i * 6,
  recoveryScore: 88 - i * 4,
}))

export const mockStations: StationActivity[] = [
  { stationId: 'st-1', label: 'Kinetic Cage A', occupancy: 0.82, motionEvents: 1240, activeAthlete: 'Maya Ortiz' },
  { stationId: 'st-2', label: 'VO2 Dome', occupancy: 0.64, motionEvents: 980, activeAthlete: 'Jonah Reeves' },
  { stationId: 'st-3', label: 'Sprint Rack 2', occupancy: 0.71, motionEvents: 1102, activeAthlete: 'Sydney Chen' },
  { stationId: 'st-4', label: 'Neuro Track', occupancy: 0.45, motionEvents: 640, activeAthlete: 'Diego Martins' },
  { stationId: 'st-5', label: 'Bias Lab', occupancy: 0.39, motionEvents: 520, activeAthlete: 'Nova Blake' },
]

export const mockLeaderboard: LeaderboardEntry[] = mockAthletes.map((a, i) => ({
  athleteId: a.id,
  name: a.displayName,
  gym: a.gym,
  score: 980 - i * 12,
  rank: i + 1,
  previousRank: i + 1 + (i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0),
  region: a.state,
}))

export const mockDevices: BiometricDevice[] = mockStations.map((s, i) => ({
  id: `dev-${i + 1}`,
  label: `Pod ${s.label.split(' ').pop()}`,
  stationId: s.stationId,
  firmware: `2.${4 + (i % 3)}.${i % 9}`,
  batteryPct: 92 - i * 6,
  status: i === mockStations.length - 1 ? 'offline' : i === 3 ? 'warning' : 'online',
  lastSeen: new Date(Date.now() - (i === mockStations.length - 1 ? 3600000 : 0)).toISOString(),
}))

export const mockKpi: DashboardKpi = {
  activeAthletes: 1284,
  liveSessions: 42,
  revenueUsd: 284900,
  onlineStations: 36,
}

export function buildSeries(prefix: string, n: number, base: number): TimeSeriesPoint[] {
  return Array.from({ length: n }).map((_, i) => ({
    t: `${prefix}${i + 1}`,
    v: base + Math.sin(i / 2) * 12 + (i % 4) * 3,
  }))
}

export const mockRevenueDistribution: DistributionSlice[] = [
  { name: 'Pro', value: 58 },
  { name: 'Elite', value: 27 },
  { name: 'Add-ons', value: 15 },
]

export function heatmapGrid(): number[][] {
  return Array.from({ length: 7 }).map((_, d) =>
    Array.from({ length: 12 }).map((__, h) => {
      const peak = h >= 9 && h <= 20 ? 1.4 : 0.75
      const weekend = d >= 5 ? 0.85 : 1
      return Math.min(100, Math.round(35 + Math.random() * 40 * peak * weekend))
    }),
  )
}
