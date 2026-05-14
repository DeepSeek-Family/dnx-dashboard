import { motion } from 'framer-motion'

import type { StationActivity } from '@/types/session'

export function GymMapPanel({ stations }: { stations: StationActivity[] }) {
  return (
    <div className="glass-card rounded-[20px] p-5">
      <h3 className="text-[12px] uppercase-tracking text-dnx-muted">Active gym map</h3>
      <p className="mt-2 text-sm text-white/80">Surface telemetry · kinetic mesh</p>
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-dnx-border bg-gradient-to-br from-dnx-card via-dnx-surface to-black p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,214,0,0.16),transparent_55%)]" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stations.map((s, i) => (
            <motion.div
              key={s.stationId}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-dnx-border/80 bg-black/35 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-white">{s.label}</p>
                <span className="text-[10px] text-dnx-success">live</span>
              </div>
              <div className="mt-2 text-[11px] text-dnx-muted">Motion events</div>
              <motion.div
                className="text-lg font-semibold text-dnx-yellow tabular-nums"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
              >
                {s.motionEvents.toLocaleString()}
              </motion.div>
              <p className="mt-2 truncate text-[11px] text-dnx-muted">{s.activeAthlete}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between text-[11px] uppercase-tracking text-dnx-muted">
        <span>Zoning</span>
        <span>
          OCC{' '}
          {Math.round(
            (stations.reduce((a, s) => a + s.occupancy, 0) / Math.max(1, stations.length)) * 100,
          )}
          %
        </span>
      </div>
    </div>
  )
}
