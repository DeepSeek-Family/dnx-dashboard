import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Table,
  Tag,
  Typography,
} from 'antd'

import { useMemo, useState } from 'react'

import {
  useAddGymMutation,
  useDeleteGymMutation,
  useGetGymsQuery,
  useUpdateGymMutation,
} from '@/store/api/dashboardOverViewPage/gym.api'

export default function GymManagementPage() {
  const { message } = App.useApp()

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingGym, setEditingGym] = useState<any>(null)

  const [form] = Form.useForm()

  const { data: gymsResponse, isLoading, refetch } =
    useGetGymsQuery({})

  const [addGym, { isLoading: addingGym }] =
    useAddGymMutation()

  const [updateGym, { isLoading: updatingGym }] =
    useUpdateGymMutation()

  const [deleteGym] = useDeleteGymMutation()

  const [statusAction, setStatusAction] = useState<{
    id: string
    kind: 'accept' | 'reject'
  } | null>(null)

  const gyms = gymsResponse?.data ?? []
  console.log("Totla gym", gyms)

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym: any) => {
      return `${gym.gymName} ${gym.city}`
        .toLowerCase()
        .includes(search.toLowerCase())
    })
  }, [gyms, search])

  const handleOpenAddModal = () => {
    setEditingGym(null)
    form.resetFields()
    setOpen(true)
  }

  const handleEdit = (gym: any) => {
    setEditingGym(gym)

    form.setFieldsValue({
      gymName: gym.gymName,
      city: gym.city,
    })

    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGym(id).unwrap()

      message.success('Gym deleted successfully')
    } catch (error: any) {
      message.error(
        error?.data?.message ||
        'Failed to delete gym',
      )
    }
  }

  const isPendingGym = (gym: any) =>
    String(gym?.status ?? '').toUpperCase() === 'PENDING'

  const handleGymStatus = async (
    gym: any,
    status: 'ACCEPTED' | 'REJECTED',
  ) => {
    try {
      setStatusAction({
        id: gym.id,
        kind: status === 'ACCEPTED' ? 'accept' : 'reject',
      })
      await updateGym({
        id: gym.id,
        gymName: gym.gymName,
        city: gym.city,
        status,
      }).unwrap()
      await refetch()
      message.success(
        status === 'ACCEPTED'
          ? 'Gym accepted'
          : 'Gym rejected',
      )
    } catch (error: any) {
      message.error(
        error?.data?.message ||
        'Failed to update gym status',
      )
    } finally {
      setStatusAction(null)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingGym) {
        await updateGym({
          id: editingGym.id,

          ...values,
        }).unwrap()

        message.success(
          'Gym updated successfully',
        )
      } else {
        await addGym({ ...values, status: "ACCEPTED" }).unwrap()
        await refetch()
        message.success(
          'Gym added successfully',
        )
      }

      setOpen(false)
      form.resetFields()
    } catch (error: any) {
      message.error(
        error?.data?.message ||
        'Something went wrong',
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography.Text className="text-[11px] uppercase tracking-[0.2em] text-dnx-muted">
            Gym management
          </Typography.Text>

          <Typography.Title
            level={2}
            className="!mb-1 !mt-2 !text-white"
          >
            Manage gyms
          </Typography.Title>

          <Typography.Paragraph className="!mb-0 !text-dnx-muted">
            Add, edit and delete gyms.
          </Typography.Paragraph>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddModal}
        >
          Add Gym
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
        <Input.Search
          allowClear
          placeholder="Search gym"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Table */}
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
            title: 'City',
            dataIndex: 'city',
          },

          {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => {
              const s = String(status ?? '').toUpperCase()
              const color =
                s === 'ACCEPTED'
                  ? 'success'
                  : s === 'REJECTED'
                    ? 'error'
                    : s === 'PENDING'
                      ? 'warning'
                      : 'default'
              return (
                <Tag color={color}>
                  {status ?? '—'}
                </Tag>
              )
            },
          },

          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date: string) =>
              new Date(
                date,
              ).toLocaleDateString(),
          },

          {
            title: 'Actions',
            render: (_: any, row: any) => (
              <div className="flex flex-wrap items-center gap-2">
                {isPendingGym(row) ? (
                  <>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      loading={
                        statusAction?.id === row.id &&
                        statusAction.kind === 'accept'
                      }
                      disabled={statusAction !== null}
                      onClick={() =>
                        handleGymStatus(row, 'ACCEPTED')
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      loading={
                        statusAction?.id === row.id &&
                        statusAction.kind === 'reject'
                      }
                      disabled={statusAction !== null}
                      onClick={() =>
                        handleGymStatus(row, 'REJECTED')
                      }
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    handleEdit(row)
                  }
                />

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    handleDelete(row.id)
                  }
                />
              </div>
            ),
          },
        ]}
      />

      {/* Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={
          addingGym || updatingGym
        }
        title={
          editingGym
            ? 'Update Gym'
            : 'Add Gym'
        }
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="gymName"
            label="Gym Name"
            rules={[
              {
                required: true,
                message:
                  'Gym Name is required',
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
                message:
                  'City is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}