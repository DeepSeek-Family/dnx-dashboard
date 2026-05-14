import {
  EyeOutlined,
  StopOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { useGetUserManagementQuery } from '@/store/api/dashboardOverViewPage/userManagement'

export default function UserManagementPage() {
  const [search, setSearch] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null)

  const { data: userManagement, isLoading } =
    useGetUserManagementQuery({
      page: 1,
      limit: 10,
      searchTerm: search,
    })

  const userManagementData = userManagement?.data ?? []

  const filteredData = useMemo(() => {
    return userManagementData.filter((user: any) => {
      const matchesSearch =
        !search ||
        `${user.name} ${user.email} ${user.nickName}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesVerified =
        !verifiedFilter ||
        (verifiedFilter === 'verified' && user.verified) ||
        (verifiedFilter === 'unverified' && !user.verified)

      return matchesSearch && matchesVerified
    })
  }, [search, verifiedFilter, userManagementData])

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase tracking-[0.2em] text-dnx-muted">
          User management
        </Typography.Text>

        <Typography.Title
          level={2}
          className="!mb-1 !mt-2 !text-white"
        >
          Athlete intelligence directory
        </Typography.Title>

        <Typography.Paragraph className="!mb-0 !text-dnx-muted">
          Search users, inspect profile analytics,
          and enforce account controls.
        </Typography.Paragraph>
      </div>

      {/* Filters */}
      <div className="glass-card flex flex-wrap gap-3 rounded-[20px] border border-dnx-border/80 p-4">
        <Input.Search
          allowClear
          placeholder="Search users"
          className="min-w-[220px] flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          allowClear
          placeholder="Verification"
          className="min-w-[180px]"
          options={[
            {
              label: 'Verified',
              value: 'verified',
            },
            {
              label: 'Unverified',
              value: 'unverified',
            },
          ]}
          value={verifiedFilter ?? undefined}
          onChange={(v) => setVerifiedFilter(v ?? null)}
        />
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={filteredData}
        className="[&_.ant-table]:!bg-transparent"
        pagination={{
          current: userManagement?.pagination?.page || 1,
          pageSize: userManagement?.pagination?.limit || 10,
          total: userManagement?.pagination?.total || 0,
          showSizeChanger: false,
        }}
        columns={[
          {
            title: 'User',
            dataIndex: 'name',
            render: (name: string, row: any) => (
              <Link
                className="font-semibold text-dnx-yellow"
                to={ROUTES.userDetail(row.id)}
              >
                {name}
              </Link>
            ),
          },

          {
            title: 'Nickname',
            dataIndex: 'nickName',
            render: (nickName: string) => (
              <span>{nickName || 'N/A'}</span>
            ),
          },

          {
            title: 'Email',
            dataIndex: 'email',
          },

          {
            title: 'Gender',
            dataIndex: 'gender',
          },

          {
            title: 'Age',
            dataIndex: 'age',
            render: (age: number) => age || 'N/A',
          },

          {
            title: 'Weight',
            dataIndex: 'weight',
            render: (weight: number) =>
              weight ? `${weight} kg` : 'N/A',
          },

          {
            title: 'Role',
            dataIndex: 'role',
            render: (role: string) => (
              <Tag color={role === 'SUPER_ADMIN' ? 'red' : 'blue'}>
                {role}
              </Tag>
            ),
          },

          {
            title: 'Verification',
            render: (_: any, row: any) => (
              <Tag color={row.verified ? 'green' : 'orange'}>
                {row.verified ? 'Verified' : 'Unverified'}
              </Tag>
            ),
          },

          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date: string) =>
              new Date(date).toLocaleDateString(),
          },

          {
            title: 'Actions',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <Link to={ROUTES.userDetail(row.id)}>
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                  />
                </Link>

                <Button
                  size="small"
                  icon={<StopOutlined />}
                />

                <Button
                  danger
                  size="small"
                  icon={<UserDeleteOutlined />}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}