import { ApiOutlined, DollarOutlined, HeartOutlined, RadarChartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Skeleton } from 'antd'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { AnimatedNumber } from '@/components/AnimatedNumber'
import { MetricCard } from '@/components/MetricCard'
import { mockKpi } from '@/utils/mockData'
import { useGetDashboardOverviewQuery, useGetMOnthlyProgressQuery } from '@/store/api/dashboardOverViewPage/dashboardOverview'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function DashboardPage() {
  const kpi = mockKpi
  const monthOrder = [
    "jan",
    "feb",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const kpiLoading = false
  const { data: dashboardOverview, } = useGetDashboardOverviewQuery({})
  const { data: monthlyProgress, isLoading: isMonthlyProgressLoading } = useGetMOnthlyProgressQuery({})
  const dashboardOverviewData = dashboardOverview?.data ?? {}


  const data = monthlyProgress?.data || {};

  const chartData = monthOrder.map((month) => ({
    month,
    users: data.users?.[month] || 0,
    gyms: data.gyms?.[month] || 0,
    subscriptions: data.subscriptions?.[month] || 0,
    liveSessions: data.liveSessions?.[month] || 0,
  }));

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <p className="text-xs uppercase-tracking text-dnx-muted">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Dashboard Overview</h1>
        <p className="mt-2 max-w-2xl text-dnx-muted">Monitor platform activity and manage system operations.</p>
      </div>

      {/* KPI cards */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={6}>
          {kpiLoading || !kpi ? (
            <Skeleton.Node active className="!h-[140px] !w-full !rounded-[20px]" />
          ) : (
            <MetricCard
              label="Total Users"
              value={<AnimatedNumber value={dashboardOverviewData.totalUsers ?? 0} />}
              sublabel="Registered athletes"
              icon={<HeartOutlined />}
              delay={0.02}
            />
          )}
        </Col>
        <Col xs={24} sm={12} xl={6}>
          {kpiLoading || !kpi ? (
            <Skeleton.Node active className="!h-[140px] !w-full !rounded-[20px]" />
          ) : (
            <MetricCard
              label="Active Gyms"
              value={<AnimatedNumber value={dashboardOverviewData.activeGym ?? 0} />}
              sublabel="Connected gym nodes"
              icon={<ApiOutlined />}
              accent="muted"
              delay={0.06}
            />
          )}
        </Col>
        <Col xs={24} sm={12} xl={6}>
          {kpiLoading || !kpi ? (
            <Skeleton.Node active className="!h-[140px] !w-full !rounded-[20px]" />
          ) : (
            <MetricCard
              label="Subscriptions"
              value={<AnimatedNumber value={dashboardOverviewData.totalSubscription ?? 0} />}
              sublabel="Active premium members"
              icon={<DollarOutlined />}
              delay={0.1}
            />
          )}
        </Col>
        <Col xs={24} sm={12} xl={6}>
          {kpiLoading || !kpi ? (
            <Skeleton.Node active className="!h-[140px] !w-full !rounded-[20px]" />
          ) : (
            <MetricCard
              label="Live Sessions"
              value={<AnimatedNumber value={dashboardOverviewData.totalLiveSessions ?? 0} />}
              sublabel="Current active sessions"
              icon={<RadarChartOutlined />}
              accent="green"
              delay={0.14}
            />
          )}
        </Col>
      </Row>

      {/* Single weekly activity chart */}
      <Card
        title={<span className="text-sm font-medium text-white">Weekly Activity</span>}
        className="glass-card !border-dnx-border/80 !bg-dnx-card/80 !shadow-none"
        bodyStyle={{ padding: 20 }}
      >
        {isMonthlyProgressLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 8" stroke="#2B304822" />
                <XAxis dataKey="month" stroke="#8B91A8" />
                <YAxis stroke="#8B91A8" />
                <Tooltip contentStyle={{ background: '#131726', borderColor: '#2B3048' }} />
                <Line type="monotone" dataKey="users" stroke="#FFD600" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="gyms" stroke="#00E38C" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="subscriptions" stroke="#FFB800" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="liveSessions" stroke="#4D516E" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Pending requests */}
      <Row gutter={[20, 20]} className="mt-12">
        <Col span={24}>
          <Card
            title={<span className="text-sm font-medium text-white">Pending Requests</span>}
            className="glass-card !border-dnx-border/80 !bg-dnx-card/80 !shadow-none"
            bodyStyle={{ padding: 20 }}
          >
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white">Gyms pending approval</p>
                  <p className="text-xs text-dnx-muted">4 gyms waiting for admin review</p>
                </div>
                <Button size="small" className="rounded-full border-dnx-yellow/60 text-dnx-yellow">
                  <Link to={ROUTES.gyms}>Review</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white">Support tickets</p>
                  <p className="text-xs text-dnx-muted">2 tickets pending assignment</p>
                </div>
                <Button size="small" className="rounded-full border-dnx-yellow/60 text-dnx-yellow">
                  <Link to={ROUTES.support}>Open</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white">Subscription drafts</p>
                  <p className="text-xs text-dnx-muted">1 plan in draft state</p>
                </div>
                <Button size="small" className="rounded-full border-dnx-yellow/60 text-dnx-yellow">
                  <Link to={ROUTES.subscriptions}>Manage</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  )
}
