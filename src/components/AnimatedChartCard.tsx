import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function AnimatedChartCard({ title, subtitle, actions, children }: Props) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[20px] p-[1px]"
    >
      <div className="rounded-[19px] bg-dnx-card/90 p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xs uppercase-tracking text-dnx-muted">{title}</h3>
            {subtitle && <p className="mt-2 text-sm leading-6 text-white/80">{subtitle}</p>}
          </div>
          {actions}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.5 }}>
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}
