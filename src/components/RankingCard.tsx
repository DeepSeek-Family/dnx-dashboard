import { TrophyOutlined } from '@ant-design/icons'
import { Avatar, Tag } from 'antd'
import { motion } from 'framer-motion'

import type { LeaderboardEntry } from '@/types/ranking'

function delta(prev: number, next: number) {
  return prev - next
}

export function RankingCard({ entry, delay = 0 }: { entry: LeaderboardEntry; delay?: number }) {
  const d = delta(entry.previousRank, entry.rank)
  const trend = d === 0 ? 'hold' : d > 0 ? 'up' : 'down'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="glass-card flex items-center gap-4 rounded-[18px] border border-dnx-border/80 bg-dnx-surface/75 p-4"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-dnx-card">
        <span className="text-lg font-bold text-dnx-yellow">{entry.rank}</span>
      </div>
      <Avatar size={48} className="border border-dnx-border bg-dnx-bg text-dnx-yellow">
        {entry.name
          .split(' ')
          .map((p) => p[0])
          .join('')}
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{entry.name}</p>
        <p className="truncate text-sm text-dnx-muted">{entry.gym}</p>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase-tracking text-dnx-muted">score</p>
        <p className="text-xl font-semibold text-white">{Math.round(entry.score)}</p>
        <Tag
          icon={<TrophyOutlined />}
          color={trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'default'}
          bordered={false}
          className="mt-1 rounded-full px-2 py-0 text-[10px]"
        >
          {trend === 'up' ? `+${d}` : trend === 'down' ? `${d}` : 'steady'}
        </Tag>
      </div>
    </motion.div>
  )
}
