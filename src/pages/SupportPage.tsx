import { Badge, Col, Row, Select, Table, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'

import { useDnxSocket } from '@/sockets/socket-context'
import { supportTickets } from '@/utils/adminMockData'

export default function SupportPage() {
  const { connected } = useDnxSocket()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const tickets = useMemo(
    () => supportTickets.filter((t) => !statusFilter || t.status === statusFilter),
    [statusFilter],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">Support</Typography.Text>
          <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
            Ticket command center
          </Typography.Title>
        </div>
        <Badge dot color={connected ? '#00E38C' : '#FFB800'}>
          <span className="rounded-full border border-dnx-border px-4 py-2 text-xs text-dnx-muted">
            {connected ? 'Realtime online' : 'Reconnecting'}
          </span>
        </Badge>
      </div>

      <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
        <Select
          allowClear
          placeholder="Filter by status"
          options={['Open', 'Pending', 'Resolved', 'Closed'].map((s) => ({ label: s, value: s }))}
          value={statusFilter}
          onChange={setStatusFilter}
          className="min-w-[200px]"
        />
      </div>

      <Row gutter={[18, 18]}>
        <Col span={24}>
          <Table
            rowKey="id"
            dataSource={tickets}
            className="[&_.ant-table]:!bg-transparent"
            pagination={{ pageSize: 6 }}
            onRow={() => ({
              className: 'cursor-pointer',
            })}
            columns={[
              { title: 'Ticket ID', dataIndex: 'id' },
              { title: 'User', dataIndex: 'user' },
              { title: 'Subject', dataIndex: 'subject' },
              { title: 'Priority', dataIndex: 'priority' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (s: string) => <Tag color={s === 'Open' ? 'red' : s === 'Pending' ? 'gold' : 'green'}>{s}</Tag>,
              },
              { title: 'Date', dataIndex: 'date', render: (v: string) => new Date(v).toLocaleString() },
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}
