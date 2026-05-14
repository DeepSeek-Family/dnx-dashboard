import { Progress, Table, Tag, Typography } from 'antd'
import { motion } from 'framer-motion'
import type { ColumnsType } from 'antd/es/table'

import type { LiveSessionRow } from '@/types/session'

import { formatDuration, statusTone } from '@/utils/format'

const { Text } = Typography

export function SessionTable({ rows }: { rows: LiveSessionRow[] }) {
  const cols: ColumnsType<LiveSessionRow> = [
    {
      title: 'Athlete',
      dataIndex: 'athleteName',
      render: (_, r) => (
        <div>
          <Text strong className="text-white">
            {r.athleteName}
          </Text>
          <div className="text-[11px] uppercase-tracking text-dnx-muted">{r.stationLabel}</div>
        </div>
      ),
    },
    {
      title: 'HR',
      dataIndex: 'heartRate',
      width: 140,
      render: (hr: number) => (
        <div className="flex items-baseline gap-2">
          <motion.span
            key={hr}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            className="text-lg font-semibold text-dnx-yellow tabular-nums"
          >
            {hr}
          </motion.span>
          <span className="text-[10px] uppercase-tracking text-dnx-muted">BPM</span>
        </div>
      ),
    },
    {
      title: 'Session time',
      dataIndex: 'sessionSeconds',
      width: 140,
      render: (s: number) => (
        <span className="font-mono text-sm text-white/90">{formatDuration(s)}</span>
      ),
    },
    {
      title: 'Current station',
      dataIndex: 'stationLabel',
    },
    {
      title: 'Load score',
      dataIndex: 'loadScore',
      width: 170,
      render: (score: number) => (
        <Progress
          percent={score}
          size="small"
          strokeColor={{ from: '#00E38C', to: '#FFD600' }}
          trailColor="#1f2438"
          className="m-0"
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: LiveSessionRow['status']) => <Tag color={statusTone(s)}>{s}</Tag>,
    },
  ]

  return (
    <Table<LiveSessionRow>
      columns={cols}
      dataSource={rows}
      pagination={false}
      rowKey="athleteId"
      scroll={{ x: 960 }}
      className="[&_.ant-table-thead>tr>th]:!bg-transparent [&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!text-[11px] [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-[0.2em]"
    />
  )
}
