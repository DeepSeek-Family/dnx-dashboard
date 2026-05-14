import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: ReactNode
  sublabel?: string
  icon?: ReactNode
  accent?: 'yellow' | 'green' | 'muted'
  delay?: number
}

export function MetricCard({ label, value, sublabel, icon, accent = 'yellow', delay = 0 }: MetricCardProps) {
  const ring =
    accent === 'green'
      ? 'from-dnx-success/25'
      : accent === 'muted'
        ? 'from-dnx-muted/10'
        : 'from-dnx-yellow/35'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass-card relative overflow-hidden rounded-[20px] p-[1px]"
    >
      <div
        className={`pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-gradient-to-br ${ring} to-transparent blur-2xl`}
      />
      <div className="relative rounded-[19px] bg-dnx-card/80 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase-tracking text-dnx-muted">{label}</p>
            <div className="mt-2.5 text-3xl sm:text-4xl text-white">{value}</div>
            {sublabel && <p className="mt-2 text-sm text-dnx-muted">{sublabel}</p>}
          </div>
          {icon && (
            <div className="rounded-2xl border border-dnx-border/80 bg-dnx-surface p-3 text-dnx-yellow glow-yellow">
              {icon}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
