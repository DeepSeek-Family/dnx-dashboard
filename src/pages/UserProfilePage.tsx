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

import { getProfileImageUrl } from '@/shared/getImageUrl'

const { Title, Paragraph, Text } = Typography

export default function UserProfilePage() {
  const { id } = useParams()

  const {
    data: user,
    isLoading,
    refetch,
  } = useGetSingleUserQuery(
    id,

  )

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



  return (
    <div className="space-y-6">
      <div>
        <Link to={ROUTES.users}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!px-0 !text-dnx-yellow"
          >
            Back to users
          </Button>
        </Link>

        <Row gutter={[24, 16]} align="middle" className="!mt-2">
          <Col>
            <div className="size-72 border border-dnx-border bg-dnx-card rounded-full overflow-hidden">
              {user?.profile ? (
                <img
                  src={getProfileImageUrl(user?.profile || '')}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-dnx-muted">
                  {user?.name?.trim()?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
          </Col>

          <Col flex={1}>
            <Title level={2} className="!mb-1 !mt-0 !text-white">
              {user?.name}
            </Title>

            <Paragraph className="!mb-2 !text-dnx-muted">{user?.email}</Paragraph>

            <div className="flex flex-wrap gap-2">
              <Tag color={user?.role === 'SUPER_ADMIN' ? 'red' : 'blue'}>{user?.role}</Tag>

              <Tag color={user?.verified ? 'green' : 'orange'}>
                {user?.verified ? 'Verified' : 'Unverified'}
              </Tag>

              {user?.isBanned && <Tag color="red">Banned</Tag>}

              {user?.isDeleted && <Tag color="default">Deleted</Tag>}
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
          <Descriptions.Item label="Nickname">{user?.nickName || '—'}</Descriptions.Item>

          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>

          <Descriptions.Item label="Gender">{user?.gender || '—'}</Descriptions.Item>

          <Descriptions.Item label="Age">{user?.age ?? '—'}</Descriptions.Item>

          <Descriptions.Item label="Weight (kg)">
            {user?.weight != null ? user?.weight : '—'}
          </Descriptions.Item>

          <Descriptions.Item label="Member since">
            {user?.createdAt ? new Date(user?.createdAt).toLocaleString() : '—'}
          </Descriptions.Item>

          <Descriptions.Item label="Verified">
            {user?.verified ? 'Yes' : 'No'}
          </Descriptions.Item>

          <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>

          <Descriptions.Item label="Banned">
            {user?.isBanned ? 'Yes' : 'No'}
          </Descriptions.Item>

          <Descriptions.Item label="Deleted">
            {user?.isDeleted ? 'Yes' : 'No'}
          </Descriptions.Item>

          <Descriptions.Item label="Reset password flow">
            {user?.isResetPassword ? 'Active' : 'Inactive'}
          </Descriptions.Item>

          <Descriptions.Item label="One-time code">
            {user?.oneTimeCode ?? '—'}
          </Descriptions.Item>

          <Descriptions.Item label="Code expires">
            {user?.expireAt ? new Date(user?.expireAt).toLocaleString() : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      
    </div>
  )
}
