import { ApiOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Progress, Tag } from 'antd'
import { motion } from 'framer-motion'

import type { BiometricDevice } from '@/types/device'

function statusLabel(s: BiometricDevice['status']) {
  switch (s) {
    case 'online':
      return { color: 'green' as const, label: 'Online' }
    case 'warning':
      return { color: 'gold' as const, label: 'Warning' }
    case 'offline':
      return { color: 'red' as const, label: 'Offline' }
  }
}

export function DeviceStatusCard({ device }: { device: BiometricDevice }) {
  const meta = statusLabel(device.status)

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="glass-card rounded-[18px] border border-dnx-border/80 bg-dnx-surface/70 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase-tracking text-dnx-muted">{device.label}</p>
          <p className="text-lg font-semibold text-white">Station {device.stationId.toUpperCase()}</p>
        </div>
        <Tag bordered={false} color={meta.color} className="rounded-full uppercase text-[10px] tracking-[0.14em]">
          {meta.label}
        </Tag>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-dnx-muted">
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-dnx-yellow" />
          <span>Battery</span>
        </div>
        <div className="flex items-center gap-2">
          <ApiOutlined className="text-dnx-success" />
          <span className="font-mono text-[11px] text-white/85">fw {device.firmware}</span>
        </div>
      </div>
      <Progress
        percent={device.batteryPct}
        size="small"
        strokeColor={device.status === 'warning' ? '#FFB800' : '#00E38C'}
        trailColor="#1f2438"
        className="mt-3"
      />
      <p className="mt-3 text-[11px] text-dnx-muted">Last telemetry · {new Date(device.lastSeen).toLocaleTimeString()}</p>
    </motion.div>
  )
}
