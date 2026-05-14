import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { App, Button, Form, Input, Modal, Select, Switch, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type GymStatus = 'Active' | 'Pending' | 'Rejected'

interface GymRow {
  id: number
  name: string
  city: string
  state: string
  status: GymStatus
  createdAt: string
}

const INITIAL_GYMS: GymRow[] = [
  {
    id: 1,
    name: 'Form Studio',
    city: 'Queretaro',
    state: 'Queretaro',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Design Lab',
    city: 'Guadalajara',
    state: 'Jalisco',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Pixel Forge',
    city: 'Monterrey',
    state: 'Nuevo Leon',
    status: 'Rejected',
    createdAt: new Date().toISOString(),
  },
]

const CITY_FILTERS = ['All', 'Mexico City', 'Guadalajara', 'Monterrey', 'Queretaro'] as const
const STATUS_FILTERS: GymStatus[] = ['Active', 'Pending', 'Rejected']

export default function GymManagementPage() {
  const { message } = App.useApp()
  const [gyms, setGyms] = useState<GymRow[]>(INITIAL_GYMS)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState<(typeof CITY_FILTERS)[number]>('All')
  const [statusFilter, setStatusFilter] = useState<GymStatus | 'All'>('All')
  const [pendingOnly, setPendingOnly] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingGym, setEditingGym] = useState<GymRow | null>(null)
  const [form] = Form.useForm()

  const openAddModal = () => {
    setEditingGym(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEditModal = (gym: GymRow) => {
    setEditingGym(gym)
    form.setFieldsValue({
      gymName: gym.name,
      city: gym.city,
      state: gym.state,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingGym(null)
    form.resetFields()
  }

  const handleAddOrEditGym = async () => {
    const values = await form.validateFields()
    const name = values.gymName as string
    const city = values.city as string
    const state = (values.state as string) || city

    if (editingGym) {
      setGyms((prev) =>
        prev.map((g) => (g.id === editingGym.id ? { ...g, name, city, state } : g)),
      )
      message.success('Gym updated.')
    } else {
      const newGym: GymRow = {
        id: Date.now(),
        name,
        city,
        state,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }
      setGyms((prev) => [newGym, ...prev])
      message.success('Gym successfully added to DNX.')
    }
    closeModal()
  }

  const updateStatus = (id: number, status: GymStatus) => {
    setGyms((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)))
    message.success(`Status updated to ${status}.`)
  }

  const deleteGym = (gym: GymRow) => {
    Modal.confirm({
      title: 'Delete gym?',
      content: `Are you sure you want to delete ${gym.name}?`,
      okButtonProps: { danger: true },
      okText: 'Delete',
      onOk: () => {
        setGyms((prev) => prev.filter((g) => g.id !== gym.id))
        message.success('Gym deleted.')
      },
    })
  }

  const filteredGyms = useMemo(() => {
    return gyms.filter((g) => {
      const text = `${g.name} ${g.city} ${g.state}`.toLowerCase()
      const q = search.trim().toLowerCase()
      const matchSearch = !q || text.includes(q)

      const matchCity =
        cityFilter === 'All' ||
        g.city.toLowerCase() === cityFilter.toLowerCase() ||
        g.state.toLowerCase() === cityFilter.toLowerCase()

      const matchStatus =
        statusFilter === 'All' ? true : g.status.toLowerCase() === statusFilter.toLowerCase()

      const matchPending = !pendingOnly || g.status === 'Pending'

      return matchSearch && matchCity && matchStatus && matchPending
    })
  }, [gyms, search, cityFilter, statusFilter, pendingOnly])

  const statusTag = (status: GymStatus) => {
    const color =
      status === 'Active' ? '#00E38C' : status === 'Pending' ? '#FFD600' : '#FF4D5E'
    const bg =
      status === 'Active'
        ? 'bg-emerald-500/10'
        : status === 'Pending'
          ? 'bg-yellow-500/10'
          : 'bg-red-500/10'
    return (
      <Tag
        style={{ borderColor: color, color }}
        className={`${bg} rounded-full px-3 py-1 text-xs font-semibold shadow-[0_0_12px_rgba(0,0,0,0.4)]`}
      >
        {status}
      </Tag>
    )
  }

  const columns: ColumnsType<GymRow> = [
    {
      title: 'Gym',
      dataIndex: 'name',
      render: (_: unknown, row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-dnx-border bg-dnx-card text-dnx-yellow">
            <ShopOutlined />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{row.name}</p>
            <p className="mt-0.5 text-xs text-dnx-muted">
              {row.city} ? {row.state}
            </p>
          </div>
        </div>
      ),
    },
    { title: 'City', dataIndex: 'city' },
    { title: 'State', dataIndex: 'state' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: GymStatus) => statusTag(status),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: 'Actions',
      render: (_: unknown, row) => (
        <div className="flex flex-wrap gap-2">
          {row.status === 'Pending' && (
            <>
              <Button
                size="small"
                icon={<CheckOutlined />}
                className="rounded-full border-0 bg-dnx-success/20 text-dnx-success hover:bg-dnx-success/30"
                onClick={() => updateStatus(row.id, 'Active')}
              >
                Accept
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                className="rounded-full border border-dnx-border bg-transparent text-dnx-danger hover:border-dnx-danger"
                onClick={() => updateStatus(row.id, 'Rejected')}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            className="rounded-full border-dnx-border bg-dnx-surface text-dnx-muted hover:text-white"
            onClick={() => openEditModal(row)}
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            className="rounded-full"
            onClick={() => deleteGym(row)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">
            Gym management
          </Typography.Text>
          <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
            Studios and federation nodes
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !text-dnx-muted">
            Manage and monitor all gym nodes in DNX.
          </Typography.Paragraph>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="rounded-[14px] !bg-dnx-yellow !text-black !font-semibold transition hover:!bg-[#ffe24d] hover:shadow-[0_0_20px_rgba(255,214,0,0.35)]"
          onClick={openAddModal}
        >
          Add Gym
        </Button>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-wrap items-center gap-3 rounded-[20px] border border-dnx-border/80 p-4"
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gym, city, or state..."
          prefix={<SearchOutlined className="text-dnx-muted" />}
          className="h-11 min-w-[220px] flex-1 rounded-[14px]"
        />
        <Select
          value={cityFilter}
          onChange={setCityFilter}
          className="min-w-[180px]"
          options={CITY_FILTERS.map((c) => ({ label: c, value: c }))}
        />
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as GymStatus | 'All')}
          className="min-w-[160px]"
          options={[{ label: 'All', value: 'All' }, ...STATUS_FILTERS.map((s) => ({ label: s, value: s }))]}
        />
        <div className="flex items-center gap-2">
          <Switch checked={pendingOnly} onChange={setPendingOnly} />
          <span className="text-xs text-dnx-muted">Pending only</span>
        </div>
      </motion.div>

      {/* Gym Table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-[24px] border border-dnx-border/80 p-5"
      >
        <Table<GymRow>
          rowKey="id"
          dataSource={filteredGyms}
          columns={columns}
          pagination={{ pageSize: 8 }}
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-tbody>tr>td]:!border-b-dnx-border/40 [&_.ant-table-tbody>tr:hover>td]:!bg-dnx-yellow/5 rounded-2xl overflow-hidden"
        />
      </motion.section>

      {/* Add / Edit Gym Modal */}
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleAddOrEditGym}
        title={
          <div>
            <p className="text-sm font-semibold text-white">Add New Gym</p>
            <p className="mt-1 text-xs text-dnx-muted">
              Create and instantly register a new gym node in DNX.
            </p>
          </div>
        }
        okText={editingGym ? 'Save Gym' : 'Add Gym'}
        cancelText="Cancel"
        className="[&_.ant-modal-content]:rounded-[24px] [&_.ant-modal-content]:border [&_.ant-modal-content]:border-dnx-border [&_.ant-modal-content]:bg-dnx-card/95 [&_.ant-modal-content]:backdrop-blur-xl"
        width={640}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="gymName"
            label={<span className="text-dnx-muted">Gym Name</span>}
            rules={[{ required: true, message: 'Gym Name is required' }]}
          >
            <Input size="large" className="!rounded-2xl" />
          </Form.Item>
          <Form.Item
            name="city"
            label={<span className="text-dnx-muted">City</span>}
            rules={[{ required: true, message: 'City is required' }]}
          >
            <Input size="large" className="!rounded-2xl" />
          </Form.Item>
          <Form.Item name="state" label={<span className="text-dnx-muted">State (optional)</span>}>
            <Input size="large" className="!rounded-2xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

