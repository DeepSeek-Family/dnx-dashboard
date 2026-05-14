import { SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Select, Table, Tag } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { AnimatedChartCard } from '@/components/AnimatedChartCard'
import { RankingCard } from '@/components/RankingCard'
import { managedUsers } from '@/utils/adminMockData'
import { mockLeaderboard } from '@/utils/mockData'

export default function RankingsPage() {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState<string | null>(null)

  const data = mockLeaderboard
  const isFetching = false

  const countries = [...new Set(managedUsers.map((u) => u.country))]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter(
      (row) =>
        (!q || `${row.name} ${row.gym}`.toLowerCase().includes(q)) &&
        (!country || row.region === country),
    )
  }, [data, search, country])

  const podium = useMemo(() => [...filtered].sort((a, b) => a.rank - b.rank).slice(0, 3), [filtered])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase-tracking text-dnx-muted">Competitive leaderboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">DNX supremacy standings</h1>
        <p className="mt-2 text-dnx-muted">
          National · state · gym slices with animated podium and rank velocity indicators.
        </p>
      </div>

      <div className="glass-card flex flex-wrap items-center gap-3 rounded-[20px] border border-dnx-border/70 p-4">

        <Input.Search
          allowClear
          prefix={<SearchOutlined className="text-dnx-muted" />}
          placeholder="Search athlete · gym"
          className="min-w-[260px] max-w-md flex-1"
          onSearch={(v) => setSearch(v)}
        />
        <Select
          allowClear
          placeholder="Location"
          className="min-w-[130px]"
          options={countries.map((c) => ({ label: c, value: c }))}
          value={country ?? undefined}
          onChange={(v) => setCountry(v ?? null)}
        />

      </div>

      <Row gutter={[18, 18]}>
        {podium.map((entry, idx) => (
          <Col xs={24} md={8} key={entry.athleteId}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: idx === 0 ? -12 : idx === 1 ? -4 : 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative"
            >
              <div className="absolute inset-x-10 -top-6 flex justify-center">
                <span className="rounded-full border border-dnx-border bg-dnx-yellow px-3 py-1 text-[11px] font-bold text-black glow-yellow">
                  #{entry.rank}
                </span>
              </div>
              <div className="glass-card rounded-[22px] border border-dnx-border/70 bg-gradient-to-b from-dnx-card to-black p-5 pt-8">
                <p className="text-center text-sm font-semibold text-white">{entry.name}</p>
                <p className="text-center text-[11px] uppercase-tracking text-dnx-muted">{entry.gym}</p>
                <p className="mt-6 text-center text-4xl font-bold text-gradient-gold">{Math.round(entry.score)}</p>
                <p className="mt-3 text-center text-xs text-dnx-muted">DNA composite · DNX</p>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <AnimatedChartCard title="Full leaderboard lattice" subtitle="Sortable telemetry · pagination ready">
        <Table
          rowKey="athleteId"
          loading={isFetching}
          dataSource={filtered}
          pagination={{ pageSize: 8 }}
          columns={[
            { title: 'Rank', dataIndex: 'rank' },
            { title: 'Athlete', dataIndex: 'name' },
            { title: 'Gym', dataIndex: 'gym' },
            { title: 'Region', dataIndex: 'region' },
            { title: 'Rank Change', render: (_, r) => r.previousRank - r.rank },
            { title: 'DNX Score', dataIndex: 'score' },
            {
              title: 'Status',
              render: (_, r) => (
                <Tag color={r.previousRank > r.rank ? 'green' : r.previousRank < r.rank ? 'red' : 'default'}>
                  {r.previousRank > r.rank ? 'Up' : r.previousRank < r.rank ? 'Down' : 'Stable'}
                </Tag>
              ),
            },
          ]}
          className="[&_.ant-table]:!bg-transparent"
        />
      </AnimatedChartCard>

      <div className="space-y-3">
        <p className="text-[11px] uppercase-tracking text-dnx-muted">Vector cards · movement pulses</p>
        {filtered.slice(3, 7).map((e, i) => (
          <RankingCard key={e.athleteId} entry={e} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}
