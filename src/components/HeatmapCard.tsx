import { Tooltip } from 'antd'
import { motion } from 'framer-motion'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const hours = Array.from({ length: 12 }).map((_, i) => `${(8 + i * 2).toString().padStart(2, '0')}:00`)

function heatColor(v: number) {
  const t = Math.max(0, Math.min(1, v / 100))
  const mix = Math.round(t * 255)
  const g = Math.round(40 + (214 - 40) * t)
  const b = Math.round(30 + (0 - 30) * t)
  return `rgb(${Math.min(255, 40 + mix)}, ${g}, ${b})`
}

export function HeatmapCard({
  grid,
  title,
  subtitle,
}: {
  grid: number[][]
  title: string
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[20px] p-5"
    >
      <div className="mb-4">
        <h3 className="text-[12px] uppercase-tracking text-dnx-muted">{title}</h3>
        {subtitle && <p className="mt-2 text-sm text-white/80">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `64px repeat(${hours.length}, minmax(0,1fr))` }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-center text-[10px] uppercase-tracking text-dnx-muted">
              {h}
            </div>
          ))}
          {grid.map((row, di) => (
            <div key={`row-${di}`} className="contents">
              <div className="flex items-center text-[11px] uppercase-tracking text-dnx-muted">
                {days[di]}
              </div>
              {row.map((cell, hi) => (
                <Tooltip key={`cell-${di}-${hi}`} title={`${cell}% load`}>
                  <div
                    className="h-7 w-8 rounded-md border border-dnx-border/40 sm:h-8 sm:w-10"
                    style={{ backgroundColor: heatColor(cell) }}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
