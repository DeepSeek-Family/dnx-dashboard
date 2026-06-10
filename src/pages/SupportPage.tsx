import { EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Col,
  Descriptions,
  Dropdown,
  Image,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd'

import { useMemo, useState } from 'react'

import {
  useGetAllSupportTicketsQuery,
  useUpdateSupportTicketMutation,
} from '@/store/api/dashboardOverViewPage/support.api'
import type { ISupport, SupportTicketStatus } from '@/types/supportTypes'

export default function SupportPage() {
  const { message } = App.useApp()

  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | 'ALL'>('ALL')

  const [detailTicket, setDetailTicket] = useState<ISupport | null>(null)

  const [statusActionRowId, setStatusActionRowId] = useState<string | null>(null)

  const [listQuery, setListQuery] = useState({
    page: 1,
    limit: 10,
  })

  const {
    data: supportTickets,
    isLoading,
    refetch,
  } = useGetAllSupportTicketsQuery(listQuery)

  const [updateTicket, { isLoading: updatingTicket }] = useUpdateSupportTicketMutation()

  const supportData = supportTickets?.data ?? []
  const serverPagination = supportTickets?.pagination

  const displayRows = useMemo(() => {
    if (statusFilter === 'ALL') {
      return supportData
    }
    return supportData.filter((ticket) => ticket.status === statusFilter)
  }, [supportData, statusFilter])

  const handleUpdateStatus = async (id: string, status: SupportTicketStatus) => {
    setStatusActionRowId(id)
    try {
      await updateTicket({ id, status }).unwrap()
      message.success('Ticket updated')
      await refetch()
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string }
      }
      message.error(err?.data?.message ?? 'Failed to update ticket')
    } finally {
      setStatusActionRowId(null)
    }
  }

  if (isLoading) {
    return <Spin description="Loading..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">
            Support
          </Typography.Text>

          <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
            Ticket command center
          </Typography.Title>
        </div>
      </div>

      <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
        <Select<SupportTicketStatus | 'ALL'>
          allowClear
          placeholder="All statuses"
          optionFilterProp="label"
          options={[
            { label: 'All statuses', value: 'ALL' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Resolved', value: 'RESOLVED' },
            { label: 'Closed', value: 'CLOSED' },
          ]}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter((value ?? 'ALL') as SupportTicketStatus | 'ALL')
            setListQuery((q) => ({ ...q, page: 1 }))
          }}
          getPopupContainer={() => document.body}
          popupMatchSelectWidth={false}
          styles={{
            popup: {
              root: { zIndex: 2000 },
            },
          }}
          className="min-w-[200px]"
        />
      </div>

      <Row gutter={[18, 18]}>
        <Col span={24}>
          <Table
            rowKey="id"
            dataSource={displayRows}
            className="[&_.ant-table]:!bg-transparent"
            pagination={
              statusFilter === 'ALL'
                ? {
                    current: serverPagination?.page ?? listQuery.page,
                    pageSize: serverPagination?.limit ?? listQuery.limit,
                    total: serverPagination?.total ?? 0,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} tickets`,
                    onChange: (page, pageSize) => {
                      setListQuery({ page, limit: pageSize })
                    },
                  }
                : {
                    pageSize: listQuery.limit,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} (this page)`,
                    onShowSizeChange: (_current, size) => {
                      setListQuery((q) => ({
                        ...q,
                        limit: size,
                        page: 1,
                      }))
                    },
                  }
            }
            columns={[
              {
                title: 'User',
                dataIndex: 'name',
              },

              {
                title: 'Email',
                dataIndex: 'email',
              },

              {
                title: 'Phone',
                dataIndex: 'phone',
              },

              {
                title: 'Subject',
                dataIndex: 'subject',
              },

              {
                title: 'Status',
                dataIndex: 'status',
                render: (s: string) => {
                  const color =
                    s === 'PENDING' ? 'gold' : s === 'RESOLVED' ? 'green' : 'red'

                  return <Tag color={color}>{s}</Tag>
                },
              },

              {
                title: 'Created',
                dataIndex: 'createdAt',
                render: (v: string) => new Date(v).toLocaleString(),
              },

              {
                title: 'Updated',
                dataIndex: 'updatedAt',
                render: (v: string) => new Date(v).toLocaleString(),
              },

              // actions column
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record: ISupport) => {
                  const rowBusy = updatingTicket && statusActionRowId === record?.id

                  const items = [
                    {
                      key: 'pending',
                      label: 'Mark Pending',
                      onClick: () => handleUpdateStatus(record?.id, 'PENDING'),
                    },
                    {
                      key: 'resolved',
                      label: 'Mark Resolved',
                      onClick: () => handleUpdateStatus(record?.id, 'RESOLVED'),
                    },
                  ]

                  return (
                    <Space size="small" wrap>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => setDetailTicket(record)}
                      ></Button>
                      <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        disabled={rowBusy}
                        getPopupContainer={() => document.body}
                      >
                        <Button
                          type="primary"
                          icon={<EllipsisOutlined />}
                          loading={rowBusy}
                        />
                      </Dropdown>
                    </Space>
                  )
                },
              },
            ]}
          />
        </Col>
      </Row>

      <Modal
        title="Ticket details"
        open={detailTicket !== null}
        onCancel={() => setDetailTicket(null)}
        footer={null}
        width={640}
        destroyOnClose
      >
        {detailTicket && (
          <div className="space-y-4">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="User">{detailTicket.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{detailTicket.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{detailTicket.phone}</Descriptions.Item>
              <Descriptions.Item label="Subject">
                {detailTicket.subject}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    detailTicket.status === 'PENDING'
                      ? 'gold'
                      : detailTicket.status === 'RESOLVED'
                        ? 'green'
                        : 'red'
                  }
                >
                  {detailTicket.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(detailTicket.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {new Date(detailTicket.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Message">
                <Typography.Paragraph className="!mb-0 whitespace-pre-wrap">
                  {detailTicket.message}
                </Typography.Paragraph>
              </Descriptions.Item>
            </Descriptions>

            {detailTicket.image ? (
              <div>
                <Typography.Text className="mb-2 block text-dnx-muted">
                  Attachment
                </Typography.Text>
                <Image
                  src={detailTicket.image}
                  alt="Ticket attachment"
                  className="max-w-full rounded-lg border border-dnx-border"
                />
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  )
}
