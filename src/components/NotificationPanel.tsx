import {
  ThunderboltOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { Button, Empty, List, Tabs, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import type { AppNotification } from '@/types/notification'

const { Paragraph } = Typography

function severityIcon(s: AppNotification['severity']) {
  switch (s) {
    case 'success':
      return <CheckCircleOutlined className="text-dnx-success" />
    case 'warning':
    case 'error':
      return <WarningOutlined className="text-dnx-danger" />
    default:
      return <ThunderboltOutlined className="text-dnx-yellow" />
  }
}

function AlertsList({
  notifications,
  onAck,
}: {
  notifications: AppNotification[]
  onAck: (id: string) => void
}) {
  return (
    <List
      dataSource={notifications}
      locale={{ emptyText: <Empty description="All clear." /> }}
      renderItem={(n) => (
        <motion.li layout className="mb-3">
          <div
            className={`rounded-2xl border border-dnx-border/80 bg-dnx-bg/55 p-4 ${
              n.read ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{severityIcon(n.severity)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Paragraph className="!mb-1 !font-semibold !text-white">{n.title}</Paragraph>
                  <span className="text-[10px] uppercase-tracking text-dnx-muted">{n.source}</span>
                </div>
                <Paragraph className="!mb-0 !text-sm !text-dnx-muted">{n.message}</Paragraph>
                {!n.read && (
                  <Button
                    size="small"
                    type="link"
                    className="px-0 text-dnx-yellow"
                    onClick={() => onAck(n.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.li>
      )}
    />
  )
}

export function NotificationPanel({ compact }: { compact?: boolean }) {
  const [items, setItems] = useState<AppNotification[]>([])

  const unread = useMemo(() => items.filter((x) => !x.read), [items])

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleSimulate = () => {
    setItems((prev) => [
      {
        id: `sim-${Date.now()}`,
        title: 'Athlete tachycardia threshold',
        message: 'Kinetic Cage B exceeded sustained HR corridor.',
        severity: 'warning',
        createdAt: new Date().toISOString(),
        read: false,
        source: 'athlete',
      },
      ...prev,
    ])
  }

  if (compact) {
    return <AlertsList notifications={items} onAck={markRead} />
  }

  return (
    <div className="glass-card rounded-[20px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[12px] uppercase-tracking text-dnx-muted flex items-center gap-2">
            <BellOutlined className="text-dnx-yellow" />
            Tactical alerts
          </h3>
          <p className="mt-1 text-sm text-white/80">{unread.length} unresolved</p>
        </div>
        <Button onClick={handleSimulate} className="border-dnx-yellow/35 text-dnx-yellow">
          Inject test ping
        </Button>
      </div>
      <Tabs
        items={[
          {
            key: 'all',
            label: 'All',
            children: <AlertsList notifications={items} onAck={markRead} />,
          },
          {
            key: 'unread',
            label: 'Unread',
            children: <AlertsList notifications={unread} onAck={markRead} />,
          },
        ]}
      />
    </div>
  )
}
