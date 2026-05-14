import type { SessionStatus } from '@/types/session'

export function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    n,
  )
}

export function statusTone(s: SessionStatus): 'default' | 'success' | 'warning' | 'error' | 'processing' {
  switch (s) {
    case 'Recovery':
      return 'success'
    case 'Moderate':
      return 'processing'
    case 'High':
      return 'warning'
    case 'Peak':
      return 'error'
    default:
      return 'default'
  }
}
