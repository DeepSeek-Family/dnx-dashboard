import { EyeOutlined, StopOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table, Tag, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import {
  useBanUserMutation,
  useGetUserManagementQuery,
} from '@/store/api/dashboardOverViewPage/userManagement'
import { debounce } from '@/utils/debounce'

const SEARCH_DEBOUNCE_MS = 300

export default function UserManagementPage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null)
  const [listQuery, setListQuery] = useState({ page: 1, limit: 10 })
  const [banUser] = useBanUserMutation()

  const scheduleDebouncedSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearchTerm(value), SEARCH_DEBOUNCE_MS),
    [],
  )

  useEffect(() => {
    scheduleDebouncedSearch(searchInput)
  }, [searchInput, scheduleDebouncedSearch])

  useEffect(() => () => scheduleDebouncedSearch.cancel(), [scheduleDebouncedSearch])

  useEffect(() => {
    setListQuery((q) => ({ ...q, page: 1 }))
  }, [debouncedSearchTerm, verifiedFilter])

  const {
    data: userManagement,
    isLoading,
    refetch,
  } = useGetUserManagementQuery({
    ...listQuery,
    searchTerm: debouncedSearchTerm,
  })

  const userManagementData = userManagement?.data ?? []
  const serverPagination = userManagement?.pagination

  const displayData = useMemo(() => {
    if (!verifiedFilter) return userManagementData
    return userManagementData.filter((user: { verified: boolean }) =>
      verifiedFilter === 'verified' ? user.verified : !user.verified,
    )
  }, [userManagementData, verifiedFilter])

  const handleBanUser = async (id: string, isBanned: boolean) => {
    await banUser({ id, isBanned })
      .unwrap()
      .then(() => {
        toast.success(isBanned ? 'User banned' : 'User unbanned')
        refetch()
      })
      .catch((err) => {
        toast.error(
          (err as { data?: { message?: string } })?.data?.message ??
            'Could not update ban status',
        )
      })
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase tracking-[0.2em] text-dnx-muted">
          User management
        </Typography.Text>

        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          Athlete intelligence directory
        </Typography.Title>

        <Typography.Paragraph className="!mb-0 !text-dnx-muted">
          Search users, inspect profile analytics, and enforce account controls.
        </Typography.Paragraph>
      </div>

      {/* Filters */}
      <div className="glass-card flex flex-wrap gap-3 rounded-[20px] border border-dnx-border/80 p-4">
        <Input.Search
          allowClear
          placeholder="Search users"
          className="min-w-[220px] flex-1"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
          onChange={(v) => {
            setVerifiedFilter(v ?? null)
            setListQuery((q) => ({ ...q, page: 1 }))
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={displayData}
          scroll={{ x: 'max-content' }}
          className="[&_.ant-table]:!bg-transparent"
          pagination={
            !verifiedFilter
              ? {
                  current: serverPagination?.page ?? listQuery.page,
                  pageSize: serverPagination?.limit ?? listQuery.limit,
                  total: serverPagination?.total ?? 0,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 50],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} users`,
                  onChange: (page, pageSize) => {
                    setListQuery({ page, limit: pageSize })
                  },
                }
              : {
                  pageSize: listQuery.limit,
                  showSizeChanger: false,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} (this page)`,
                }
          }
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
              render: (nickName: string) => <span>{nickName || 'N/A'}</span>,
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
              render: (weight: number) => (weight ? `${weight} kg` : 'N/A'),
            },

            {
              title: 'Role',
              dataIndex: 'role',
              render: (role: string) => (
                <Tag color={role === 'SUPER_ADMIN' ? 'red' : 'blue'}>{role}</Tag>
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
              render: (date: string) => new Date(date).toLocaleDateString(),
            },

            {
              title: 'Actions',
              render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                  <Link to={ROUTES.userDetail(row.id)}>
                    <Button size="small" icon={<EyeOutlined />} />
                  </Link>

                  <Button
                    size="small"
                    danger={row.isBanned}
                    icon={<StopOutlined />}
                    onClick={() => handleBanUser(row.id, !row.isBanned)}
                  >
                    {row.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
