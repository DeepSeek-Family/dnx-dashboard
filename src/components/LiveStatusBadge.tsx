import { Badge } from 'antd'

const pulseRing =
  'after:absolute after:inset-0 after:rounded-full after:animate-[ping_2.4s_ease-out_infinite] after:bg-dnx-yellow after:opacity-25'

export function LiveStatusBadge({ demo }: { demo?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-dnx-border bg-dnx-surface px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-dnx-muted relative overflow-hidden glow-yellow">
      <span className="relative flex size-3 items-center justify-center">
        <span className={`relative z-10 size-2 rounded-full bg-dnx-yellow ${pulseRing}`} />
      </span>
      <span className="flex flex-col gap-0.5 leading-tight">
        <span className="text-dnx-text">{demo ? 'Neural uplink demo' : 'Live neural uplink'}</span>
      </span>
    </div>
  )
}

export function OnlinePulse({ tone = 'yellow' }: { tone?: 'yellow' | 'green' }) {
  const color = tone === 'green' ? '#00E38C' : '#FFD600'
  return <Badge color={color} className="[&_.ant-badge-status-dot]:shadow-[0_0_12px_currentColor]" />
}
