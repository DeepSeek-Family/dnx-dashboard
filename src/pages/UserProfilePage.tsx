import { ArrowLeftOutlined } from '@ant-design/icons'

import {

  Alert,

  Button,

  Card,

  Col,

  Descriptions,

  Row,

  Spin,

  Table,

  Tabs,

  Tag,

  Typography,

} from 'antd'

import {

  Area,

  AreaChart,

  CartesianGrid,

  Line,

  LineChart,

  ResponsiveContainer,

  Tooltip,

  XAxis,

  YAxis,

} from 'recharts'

import { Link, useParams } from 'react-router-dom'



import { AnimatedChartCard } from '@/components/AnimatedChartCard'

import { ROUTES } from '@/constants/routes'

import { useGetSingleUserQuery } from '@/store/api/dashboardOverViewPage/userManagement'

import { rankingHistory, sessionHistory } from '@/utils/mockData'
import { getProfileImageUrl } from '@/shared/getImageUrl'



const { Title, Paragraph, Text } = Typography



export default function UserProfilePage() {

  const { id = '' } = useParams()

  const { data: user, isLoading, isError, error, refetch } = useGetSingleUserQuery(

    id,

    { skip: !id },

  )

  console.log('user', user)


  const sessions = sessionHistory(id)

  const rankings = rankingHistory(id)



  if (!id) {

    return (

      <Card className="glass-card border-dnx-border text-dnx-muted">

        Invalid user link.

      </Card>

    )

  }



  if (isLoading) {

    return (

      <div className="flex min-h-[40vh] items-center justify-center">

        <Spin size="large" />

      </div>

    )

  }



  if (isError || !user) {

    return (

      <div className="space-y-4">

        <Link to={ROUTES.users}>

          <Button type="text" icon={<ArrowLeftOutlined />} className="!px-0 !text-dnx-yellow">

            Back to users

          </Button>

        </Link>

        <Alert

          type="error"

          showIcon

          message="Could not load user"

          description={

            'status' in (error as object)

              ? `Request failed (${(error as { status?: string | number }).status}).`

              : 'Please try again.'

          }

          action={

            <Button size="small" onClick={() => refetch()}>

              Retry

            </Button>

          }

        />

      </div>

    )

  }




  const profileSrc = user.profile?.trim() ? getProfileImageUrl(user.profile) : ''



  return (

    <div className="space-y-6">

      <div>

        <Link to={ROUTES.users}>

          <Button type="text" icon={<ArrowLeftOutlined />} className="!px-0 !text-dnx-yellow">

            Back to users

          </Button>

        </Link>

        <Row gutter={[24, 16]} align="middle" className="!mt-2">

          <Col>

            <div className="size-72 border border-dnx-border bg-dnx-card rounded-full overflow-hidden">
              {profileSrc ? (
                <img src={profileSrc} alt="profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-dnx-muted">
                  {user.name?.trim()?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
          </Col>

          <Col flex={1}>

            <Title level={2} className="!mb-1 !mt-0 !text-white">

              {user.name}

            </Title>

            <Paragraph className="!mb-2 !text-dnx-muted">{user.email}</Paragraph>

            <div className="flex flex-wrap gap-2">

              <Tag color={user.role === 'SUPER_ADMIN' ? 'red' : 'blue'}>{user.role}</Tag>

              <Tag color={user.verified ? 'green' : 'orange'}>

                {user.verified ? 'Verified' : 'Unverified'}

              </Tag>

              {user.isBanned && <Tag color="red">Banned</Tag>}

              {user.isDeleted && <Tag color="default">Deleted</Tag>}

              {user.isResetPassword && <Tag color="gold">Password reset pending</Tag>}

            </div>

          </Col>

        </Row>

      </div>



      <Card className="glass-card border-dnx-border bg-dnx-card">

        <Text className="text-dnx-muted">Profile details</Text>

        <Descriptions

          bordered

          size="small"

          column={{ xs: 1, sm: 1, md: 2, lg: 2 }}

          className="!mt-4 [&_.ant-descriptions-item-label]:!text-dnx-muted [&_.ant-descriptions-view]:!bg-transparent"

        >

          <Descriptions.Item label="Nickname">{user.nickName || '—'}</Descriptions.Item>

          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

          <Descriptions.Item label="Gender">{user.gender || '—'}</Descriptions.Item>

          <Descriptions.Item label="Age">{user.age ?? '—'}</Descriptions.Item>

          <Descriptions.Item label="Weight (kg)">

            {user.weight != null ? user.weight : '—'}

          </Descriptions.Item>

          <Descriptions.Item label="Member since">

            {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}

          </Descriptions.Item>

          <Descriptions.Item label="Verified">{user.verified ? 'Yes' : 'No'}</Descriptions.Item>

          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>

          <Descriptions.Item label="Banned">{user.isBanned ? 'Yes' : 'No'}</Descriptions.Item>

          <Descriptions.Item label="Deleted">{user.isDeleted ? 'Yes' : 'No'}</Descriptions.Item>

          <Descriptions.Item label="Reset password flow">

            {user.isResetPassword ? 'Active' : 'Inactive'}

          </Descriptions.Item>

          <Descriptions.Item label="One-time code">{user.oneTimeCode ?? '—'}</Descriptions.Item>

          <Descriptions.Item label="Code expires">

            {user.expireAt ? new Date(user.expireAt).toLocaleString() : '—'}

          </Descriptions.Item>

        </Descriptions>

      </Card>



      <Tabs

        items={[

          {

            key: 'performance',

            label: 'Performance Analytics',

            children: (

              <AnimatedChartCard title="Performance curve" subtitle="DNX score and load behavior">

                <Row gutter={[16, 16]}>

                  <Col span={24}>

                    <div className="h-[260px] w-full">

                      <ResponsiveContainer>

                        <AreaChart data={sessions.map((s, i) => ({ i, load: s.loadScore }))}>

                          <CartesianGrid strokeDasharray="4 12" stroke="#2B304822" />

                          <XAxis dataKey="i" stroke="#8B91A8" />

                          <YAxis stroke="#8B91A8" />

                          <Tooltip contentStyle={{ background: '#131726', borderColor: '#2B3048' }} />

                          <Area type="monotone" dataKey="load" stroke="#FFD600" fill="rgba(255,214,0,0.18)" />

                        </AreaChart>

                      </ResponsiveContainer>

                    </div>

                  </Col>

                </Row>

              </AnimatedChartCard>

            ),

          },

          {

            key: 'sessions',

            label: 'Session History',

            children: (

              <Table

                rowKey="id"

                dataSource={sessions}

                pagination={{ pageSize: 6 }}

                className="[&_.ant-table]:!bg-transparent"

                columns={[

                  { title: 'Start', dataIndex: 'startedAt', render: (t: string) => new Date(t).toLocaleString() },

                  { title: 'Duration', dataIndex: 'durationMin', render: (v: number) => `${v} min` },

                  { title: 'Avg HR', dataIndex: 'avgHr' },

                  { title: 'Peak HR', dataIndex: 'peakHr' },

                  { title: 'Load', dataIndex: 'loadScore' },

                ]}

              />

            ),

          },

          {

            key: 'ranking',

            label: 'Ranking History',

            children: (

              <div className="h-[260px] w-full">

                <ResponsiveContainer>

                  <LineChart data={rankings}>

                    <CartesianGrid strokeDasharray="4 12" stroke="#2B304822" />

                    <XAxis dataKey="week" stroke="#8B91A8" />

                    <YAxis stroke="#8B91A8" />

                    <Tooltip contentStyle={{ background: '#131726', borderColor: '#2B3048' }} />

                    <Line type="monotone" dataKey="rank" stroke="#00E38C" />

                    <Line type="monotone" dataKey="score" stroke="#FFD600" />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            ),

          },

          {

            key: 'subscription',

            label: 'Subscription',

            children: (

              <Card className="glass-card border-dnx-border bg-dnx-card">

                <Text className="text-dnx-muted">

                  Subscription and billing are not included in the user profile API response yet.

                </Text>

              </Card>

            ),

          },

          {

            key: 'biometric',

            label: 'Biometric',

            children: (

              <Row gutter={[16, 16]}>

                <Col xs={24} md={8}>

                  <Card className="glass-card border-dnx-border bg-dnx-card">

                    <Text className="text-dnx-muted">Age</Text>

                    <Title level={2} className="!mb-0 !mt-2 !text-dnx-yellow">

                      {user.age ?? '—'}

                    </Title>

                  </Card>

                </Col>

                <Col xs={24} md={8}>

                  <Card className="glass-card border-dnx-border bg-dnx-card">

                    <Text className="text-dnx-muted">Weight (kg)</Text>

                    <Title level={2} className="!mb-0 !mt-2 !text-dnx-yellow">

                      {user.weight != null ? user.weight : '—'}

                    </Title>

                  </Card>

                </Col>

                <Col xs={24} md={8}>

                  <Card className="glass-card border-dnx-border bg-dnx-card">

                    <Text className="text-dnx-muted">Gender</Text>

                    <Title level={4} className="!mb-0 !mt-2 !text-white">

                      {user.gender || '—'}

                    </Title>

                  </Card>

                </Col>

              </Row>

            ),

          },

        ]}

      />

    </div>

  )

}

