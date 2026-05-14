import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import { motion } from 'framer-motion'

import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import type { AthleteSummary } from '@/types/athlete'

export function AthleteCard({ athlete }: { athlete: AthleteSummary }) {
  const nav = useNavigate()
  const tierColor =
    athlete.subscription === 'elite'
      ? 'text-dnx-yellow border-dnx-yellow/50'
      : athlete.subscription === 'pro'
        ? 'text-dnx-success border-dnx-success/45'
        : 'text-dnx-muted border-dnx-border'

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className="glass-card rounded-[18px] border border-dnx-border/80 bg-dnx-surface/70 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{athlete.displayName}</p>
          <p className="text-sm text-dnx-muted">{athlete.gym}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag bordered={false} className="rounded-full border border-dnx-border bg-dnx-bg/60 text-dnx-text">
              Nation rank #{athlete.rankNational}
            </Tag>
            <Tag
              bordered={false}
              className={`rounded-full bg-transparent uppercase text-[10px] tracking-[0.16em] ${tierColor}`}
            >
              {athlete.subscription}
            </Tag>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase-tracking text-dnx-muted">DNX score</p>
          <p className="text-2xl font-semibold text-gradient-gold">{athlete.dnxScore}</p>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          className="text-dnx-yellow"
          onClick={() => nav(ROUTES.athleteDetail(athlete.id))}
        >
          Open dossier
        </Button>
      </div>
    </motion.div>
  )
}
