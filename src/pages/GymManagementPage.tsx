import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import { App, Button, Form, Input, Modal, Select, Table, Tag, Typography } from 'antd'

import { useMemo, useState } from 'react'

import {
  useAddGymMutation,
  useDeleteGymMutation,
  useGetGymsQuery,
  useUpdateGymMutation,
} from '@/store/api/dashboardOverViewPage/gym.api'

import type { IGym } from '@/types/gymTypes'

export default function GymManagementPage() {
  const { message } = App.useApp()

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingGym, setEditingGym] = useState<IGym | null>(null)

  const [form] = Form.useForm()

  const { data: gymsResponse, isLoading, refetch } = useGetGymsQuery({})

  const [addGym, { isLoading: addingGym }] = useAddGymMutation()

  const [updateGym, { isLoading: updatingGym }] = useUpdateGymMutation()

  const [deleteGym] = useDeleteGymMutation()

  const [statusAction, setStatusAction] = useState<{
    id: string
    kind: 'accept' | 'reject'
  } | null>(null)

  const gyms = gymsResponse?.data ?? []

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym: IGym) =>
      `${gym.gymName} ${gym.city}`.toLowerCase().includes(search.toLowerCase()),
    )
  }, [gyms, search])

  const handleOpenAddModal = () => {
    setEditingGym(null)
    form.resetFields()
    setOpen(true)
  }

  const handleEdit = (payload: IGym) => {
    setEditingGym(payload)

    form.setFieldsValue({
      gymName: payload.gymName,
      city: payload.city,
      status: payload.status,
    })

    setOpen(true)
  }

  const handleDelete = async (payload: Partial<IGym>) => {
    await deleteGym(payload.id!)
      .unwrap()
      .then(() => {
        message.success('Gym deleted successfully')
        refetch()
      })
      .catch((error: any) => {
        message.error(error?.data?.message || 'Failed to delete gym')
      })
  }

  const isPendingGym = (gym: IGym) =>
    String(gym?.status ?? '').toUpperCase() === 'PENDING'

  const handleGymStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setStatusAction({
        id,
        kind: status === 'APPROVED' ? 'accept' : 'reject',
      })

      await updateGym({
        id,
        status,
      }).unwrap()

      message.success('Gym status updated successfully')

      await refetch()
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to update gym status')
    } finally {
      setStatusAction(null)
    }
  }

  const handleSubmit = async (payload: IGym) => {
    await addGym(payload)
      .unwrap()
      .then(() => {
        message.success('Gym added successfully')
        refetch()
      })
      .catch((error: any) => {
        message.error(error?.data?.message || 'Failed to add gym')
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography.Text className="text-[11px] uppercase tracking-[0.2em] text-dnx-muted">
            Gym management
          </Typography.Text>

          <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
            Manage gyms
          </Typography.Title>

          <Typography.Paragraph className="!mb-0 !text-dnx-muted">
            Add, edit and delete gyms.
          </Typography.Paragraph>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal}>
          Add Gym
        </Button>
      </div>

      <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
        <Input.Search
          allowClear
          placeholder="Search gym"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={filteredGyms}
        pagination={{
          pageSize: 10,
        }}
        className="[&_.ant-table]:!bg-transparent"
        columns={[
          {
            title: 'Gym Name',
            dataIndex: 'gymName',
          },

          {
            title: 'Country',
            dataIndex: 'country',
          },
          {
            title: 'City',
            dataIndex: 'city',
          },
          {
            title: 'State',
            dataIndex: 'state',
          },

          {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => {
              const s = String(status ?? '').toUpperCase()

              const color =
                s === 'APPROVED'
                  ? 'success'
                  : s === 'REJECTED'
                    ? 'error'
                    : s === 'PENDING'
                      ? 'warning'
                      : 'default'

              return <Tag color={color}>{status ?? '—'}</Tag>
            },
          },

          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
          },

          {
            title: 'Actions',
            render: (_: unknown, row: IGym) => (
              <div className="flex flex-wrap items-center gap-2">
                {isPendingGym(row) && (
                  <>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      loading={
                        statusAction?.id === row.id && statusAction.kind === 'accept'
                      }
                      disabled={statusAction !== null}
                      onClick={() => handleGymStatus(row.id, 'APPROVED')}
                    >
                      Accept
                    </Button>

                    <Button
                      danger
                      icon={<CloseOutlined />}
                      loading={
                        statusAction?.id === row.id && statusAction.kind === 'reject'
                      }
                      disabled={statusAction !== null}
                      onClick={() => handleGymStatus(row.id, 'REJECTED')}
                    >
                      Reject
                    </Button>
                  </>
                )}

                <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(row)}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditingGym(null)
          form.resetFields()
        }}
        onOk={async () => {
          const values = await form.validateFields()

          if (editingGym) {
            await updateGym({
              id: editingGym.id,
              ...values,
            }).unwrap()

            message.success('Gym updated successfully')

            await refetch()
          } else {
            await handleSubmit({
              ...values,
              status: 'APPROVED',
            } as IGym)
          }

          setOpen(false)
          setEditingGym(null)
          form.resetFields()
        }}
        confirmLoading={addingGym || updatingGym}
        title={editingGym ? 'Update Gym' : 'Add Gym'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="gymName"
            label="Gym Name"
            rules={[
              {
                required: true,
                message: 'Gym Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[
              {
                required: true,
                message: 'Country is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[
              {
                required: true,
                message: 'City is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[
              {
                required: true,
                message: 'State is required',
              },
            ]}
          >
            <Input />
          </Form.Item>


          {editingGym && (
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: 'Status is required',
                },
              ]}
            >
              <Select
                options={[
                  {
                    label: 'PENDING',
                    value: 'PENDING',
                  },
                  {
                    label: 'APPROVED',
                    value: 'APPROVED',
                  },
                  {
                    label: 'REJECTED',
                    value: 'REJECTED',
                  },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
