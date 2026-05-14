export type SubscriptionTier = 'free' | 'pro' | 'elite'

export interface AthleteSummary {
  id: string
  displayName: string
  gym: string
  state: string
  country: string
  dnxScore: number
  rankNational: number
  subscription: SubscriptionTier
  lastSessionAt: string
  avatarUrl?: string
}

export interface AthleteDetail extends AthleteSummary {
  age: number
  weightKg: number
  heightCm: number
  dominantSide: 'L' | 'R'
  weeklyLoad: number
  recoveryIndex: number
  vo2Estimate: number
}

export interface SessionRecord {
  id: string
  athleteId: string
  startedAt: string
  endedAt: string
  durationMin: number
  avgHr: number
  peakHr: number
  loadScore: number
  station: string
}

export interface RankingPoint {
  week: string
  rank: number
  score: number
}
