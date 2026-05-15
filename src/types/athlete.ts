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
