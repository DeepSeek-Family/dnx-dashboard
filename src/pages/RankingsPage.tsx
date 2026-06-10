import { FileExcelOutlined, FilePdfOutlined, SearchOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Input, Row, Spin, Table, Tag } from 'antd'
import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { AnimatedChartCard } from '@/components/AnimatedChartCard'

import { useGetSessionQuery, useLazyGetSessionQuery } from '@/store/api/session.api'
import {
  exportRankingsToExcel,
  exportRankingsToPdf,
  type RankingExportEntry,
} from '@/utils/exportRankingReport'

export default function RankingsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null)

  const limit = 20

  const { data: session, isLoading } = useGetSessionQuery({
    page,
    limit,
  })
  const [fetchSession] = useLazyGetSessionQuery()

  const leaderboard = session?.data || []

  const pagination = session?.pagination

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return leaderboard.filter(
      (item: any) =>
        !q ||
        item?.user?.name?.toLowerCase()?.includes(q) ||
        item?.user?.nickName?.toLowerCase()?.includes(q),
    )
  }, [leaderboard, search])

  const podium = useMemo(() => {
    return [...filtered].sort((a, b) => (a.rank || 0) - (b.rank || 0)).slice(0, 3)
  }, [filtered])

  const fetchAllRankingsForExport = useCallback(async (): Promise<RankingExportEntry[]> => {
    const collected: RankingExportEntry[] = []
    let currentPage = 1
    let totalPages = 1

    while (currentPage <= totalPages) {
      const response = await fetchSession({
        page: currentPage,
        limit: 100,
      }).unwrap()

      collected.push(...(response.data as RankingExportEntry[]))
      totalPages = response.pagination?.totalPage ?? 1
      currentPage += 1
    }

    const q = search.trim().toLowerCase()

    if (!q) return collected

    return collected.filter(
      (item) =>
        item?.user?.name?.toLowerCase()?.includes(q) ||
        item?.user?.nickName?.toLowerCase()?.includes(q),
    )
  }, [fetchSession, search])

  const handleExport = async (format: 'excel' | 'pdf') => {
    setExporting(format)

    try {
      const entries = await fetchAllRankingsForExport()

      if (entries.length === 0) {
        toast.error('No rankings to export with the current filters')
        return
      }

      if (format === 'excel') {
        await exportRankingsToExcel(entries)
      } else {
        await exportRankingsToPdf(entries)
      }

      toast.success(`Exported ${entries.length} rankings to ${format.toUpperCase()}`)
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          'Could not export rankings',
      )
    } finally {
      setExporting(null)
    }
  }

  if (isLoading) {
    return <Spin className="flex h-screen items-center justify-center" />
  }
  // 

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase-tracking text-dnx-muted">
          Competitive leaderboard
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          DNX supremacy standings
        </h1>

        <p className="mt-2 text-dnx-muted">National leaderboard</p>
      </div>

      <div className="glass-card rounded-[20px] border border-dnx-border/70 p-4">
        <Input.Search
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search athlete"
          onSearch={setSearch}
        />
      </div>

      <Row gutter={[18, 18]}>
        {podium.map((entry: any, idx) => (
          <Col xs={24} md={8} key={entry.id}>
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: idx === 0 ? -12 : idx === 1 ? -4 : 0,
              }}
            >
              <div className="absolute inset-x-10 -top-6 flex justify-center">
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-black">
                  #{entry.rank ?? '-'}
                </span>
              </div>

              <div className="glass-card rounded-[22px] p-5 pt-8">
                <Avatar size={60} src={entry?.user?.profile}>
                  {entry?.user?.name?.[0] || 'U'}
                </Avatar>

                <p className="mt-3 text-center text-white">
                  {entry?.user?.name || 'Unknown'}
                </p>

                <p className="text-center text-xs text-dnx-muted">
                  @{entry?.user?.nickName || 'No username'}
                </p>

                <p className="mt-5 text-center text-4xl font-bold text-gradient-gold">
                  {Math.round(entry?.totalDNXScore || 0)}
                </p>

                <p className="text-center text-xs text-dnx-muted">DNX score</p>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <AnimatedChartCard
        title="Leaderboard"
        subtitle="Live ranking"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              icon={<FileExcelOutlined />}
              loading={exporting === 'excel'}
              disabled={exporting !== null}
              className="rounded-[12px] border-dnx-border !text-white hover:!border-dnx-yellow hover:!text-dnx-yellow"
              onClick={() => handleExport('excel')}
            >
              Export Excel
            </Button>

            <Button
              icon={<FilePdfOutlined />}
              loading={exporting === 'pdf'}
              disabled={exporting !== null}
              className="rounded-[12px] border-dnx-border !text-white hover:!border-dnx-yellow hover:!text-dnx-yellow"
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
          </div>
        }
      >
        <Table
          rowKey="id"
          dataSource={filtered}
          pagination={{
            current: page,
            pageSize: limit,
            total: pagination?.total || 0,
            onChange: (current) => setPage(current),
          }}
          columns={[
            {
              title: 'Rank',

              dataIndex: 'rank',
            },

            {
              title: 'Athlete',

              render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                  <Avatar src={row?.user?.profile} />

                  <div>
                    <p>{row?.user?.name || '-'}</p>

                    <p className="text-xs text-gray-400">@{row?.user?.nickName || '-'}</p>
                  </div>
                </div>
              ),
            },

            {
              title: 'Level',
              dataIndex: 'level',
            },
            {
              title: 'Steps',
              dataIndex: 'totalSteps',
            },
            {
              title: 'Workout Days',
              dataIndex: 'totalWorkoutDays',
            },
            {
              title: 'Gym Name',
              render: (_: any, row: any) => row?.user?.gym?.gymName || '-',
            },
            {
              title: 'Country',
              render: (_: any, row: any) => row?.user?.gym?.country || '-',
            },
            {
              title: 'City',
              render: (_: any, row: any) => row?.user?.gym?.city || '-',
            },
            {
              title: 'State',
              render: (_: any, row: any) => row?.user?.gym?.state || '-',
            },

            {
              title: 'DNX Score',
              render: (_: any, row: any) => row?.totalDNXScore?.toFixed(1) || '0',
            },
            {
              title: 'Status',
              render: (_: any, _row: any) => <Tag color="green">Active</Tag>,
            },
          ]}
        />
      </AnimatedChartCard>
    </div>
  )
}
