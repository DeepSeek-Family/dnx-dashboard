export type RankingScope = 'national' | 'state' | 'gym' | 'weekly'

export interface LeaderboardEntry {
  athleteId: string
  name: string
  gym: string
  score: number
  rank: number
  previousRank: number
  region: string
  avatarUrl?: string
}
