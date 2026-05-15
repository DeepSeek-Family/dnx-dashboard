import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type BillingType = 'Monthly' | 'Annual'
type PlanStatus = 'Active' | 'Draft' | 'Disabled'

type FeatureKey =
  | 'Rankings'
  | 'Weekly Competition'
  | 'Position Visibility'
  | 'AI Analytics'
  | 'Unlimited Sessions'
  | 'Premium Access'

interface PlanRow {
  id: string
  name: string
  billing: BillingType
  price: number
  subscribers: number
  status: PlanStatus
  features: FeatureKey[]
  trialEnabled: boolean
  trialDays: number
}

const FEATURE_OPTIONS: FeatureKey[] = [
  'Rankings',
  'Weekly Competition',
  'Position Visibility',
  'AI Analytics',
  'Unlimited Sessions',
  'Premium Access',
]

const INITIAL_PLANS: PlanRow[] = [
  {
    id: 'free',
    name: 'Free',
    billing: 'Monthly',
    price: 0,
    subscribers: 1240,
    status: 'Active',
    features: [],
    trialEnabled: false,
    trialDays: 0,
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    billing: 'Monthly',
    price: 299,
    subscribers: 610,
    status: 'Active',
    features: ['Rankings', 'Weekly Competition', 'Position Visibility'],
    trialEnabled: false,
    trialDays: 0,
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    billing: 'Annual',
    price: 199,
    subscribers: 420,
    status: 'Active',
    features: ['Rankings', 'Weekly Competition', 'Position Visibility', 'Premium Access'],
    trialEnabled: true,
    trialDays: 7,
  },
]

function statusTag(status: PlanStatus) {
  const tone =
    status === 'Active'
      ? { color: '#00E38C', bg: 'bg-emerald-500/10' }
      : status === 'Draft'
        ? { color: '#FFD600', bg: 'bg-yellow-500/10' }
        : { color: '#FF4D5E', bg: 'bg-red-500/10' }
  return (
    <Tag
      style={{ borderColor: tone.color, color: tone.color }}
      className={`${tone.bg} rounded-full px-3 py-1 text-xs font-semibold`}
    >
      {status}
    </Tag>
  )
}

function money(v: number) {
  return v === 0 ? '$0' : `$${v}`
}

export default function SubscriptionsPage() {
  const { message } = App.useApp()

  const [plans, setPlans] = useState<PlanRow[]>(INITIAL_PLANS)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  const [activePlanId, setActivePlanId] = useState<string | null>(null)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const activePlan = useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? null,
    [plans, activePlanId],
  )

  const openAdd = () => {
    addForm.resetFields()
    setAddOpen(true)
  }

  const closeAdd = () => {
    setAddOpen(false)
    addForm.resetFields()
  }

  const submitAdd = async () => {
    const v = await addForm.validateFields()
    const row: PlanRow = {
      id: `plan-${Date.now()}`,
      name: v.name,
      billing: v.billing,
      price: v.price,
      subscribers: v.subscribers ?? 0,
      status: v.status,
      features: v.features ?? [],
      trialEnabled: !!v.trialEnabled,
      trialDays: v.trialEnabled ? (v.trialDays ?? 7) : 0,
    }
    setPlans((prev) => [row, ...prev])
    message.success('Subscription created.')
    closeAdd()
  }

  const openManage = (id: string) => {
    setActivePlanId(id)
    setManageOpen(true)
  }

  const closeManage = () => {
    setManageOpen(false)
    setActivePlanId(null)
  }

  const openEdit = (row: PlanRow) => {
    setActivePlanId(row.id)
    editForm.setFieldsValue({
      name: row.name,
      billing: row.billing,
      price: row.price,
      features: row.features,
      status: row.status,
      trialEnabled: row.trialEnabled,
      trialDays: row.trialDays,
    })
    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
    editForm.resetFields()
    setActivePlanId(null)
  }

  const submitEdit = async () => {
    const id = activePlanId
    if (!id) return
    const v = await editForm.validateFields()
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: v.name,
              billing: v.billing,
              price: v.price,
              features: v.features ?? [],
              status: v.status,
              trialEnabled: !!v.trialEnabled,
              trialDays: v.trialEnabled ? (v.trialDays ?? 7) : 0,
            }
          : p,
      ),
    )
    message.success('Subscription updated.')
    closeEdit()
  }

  const deletePlan = (row: PlanRow) => {
    Modal.confirm({
      title: 'Delete subscription plan?',
      content: `Delete ${row.name}?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        setPlans((prev) => prev.filter((p) => p.id !== row.id))
        message.success('Subscription deleted.')
      },
    })
  }

  const accessList = ['Rankings', 'Weekly Competition', 'Position Visibility'] as const

  const columns: ColumnsType<PlanRow> = [
    { title: 'Plan Name', dataIndex: 'name' },
    { title: 'Billing Type', dataIndex: 'billing' },
    { title: 'Price', render: (_, r) => money(r.price) },
    { title: 'Subscribers', dataIndex: 'subscribers' },
    { title: 'Status', dataIndex: 'status', render: (s: PlanStatus) => statusTag(s) },
    {
      title: 'Actions',
      render: (_, r) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => openManage(r.id)}
          />
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deletePlan(r)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header + Add Subscription */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase-tracking text-dnx-muted">Subscription</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Subscription Management
          </h1>
          <p className="mt-2 text-dnx-muted">
            Manage subscription plans, pricing, and access permissions.
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="rounded-[14px] !bg-dnx-yellow !text-black !font-semibold transition hover:!bg-[#ffe24d] hover:shadow-[0_0_20px_rgba(255,214,0,0.35)]"
          onClick={openAdd}
        >
          Add Subscription
        </Button>
      </div>

      {/* Access overview cards */}
      <div>
        <p className="text-[11px] uppercase-tracking text-dnx-muted">Access Overview</p>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[24px] border border-dnx-border/80 p-4"
          >
            <p className="text-sm font-semibold text-white">FREE</p>
            <div className="mt-4 space-y-3">
              {accessList.map((label) => (
                <div key={label} className="flex items-center gap-3 text-white/80">
                  <CloseCircleOutlined className="text-lg text-dnx-danger" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-[24px] border border-dnx-yellow/60 bg-gradient-to-b from-dnx-yellow/10 to-transparent p-4 shadow-[0_0_24px_rgba(255,214,0,0.18)]"
          >
            <p className="text-sm font-semibold text-white">PRO</p>
            <div className="mt-4 space-y-3">
              {accessList.map((label) => (
                <div key={label} className="flex items-center gap-3 text-white">
                  <CheckCircleOutlined className="text-lg text-dnx-yellow" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscription management table */}
      <div>
        <p className="text-[11px] uppercase-tracking text-dnx-muted">
          Subscription Management
        </p>
        <div className="mt-4 glass-card rounded-[24px] border border-dnx-border/80 p-5">
          <Table<PlanRow>
            rowKey="id"
            dataSource={plans}
            columns={columns}
            pagination={{ pageSize: 6 }}
            size="middle"
            className="[&_.ant-table]:!bg-transparent [&_.ant-table-tbody>tr>td]:!border-b-dnx-border/40 [&_.ant-table-tbody>tr:hover>td]:!bg-dnx-yellow/5 rounded-2xl overflow-hidden"
          />
        </div>
      </div>

      {/* Add subscription modal */}
      <Modal
        open={addOpen}
        onCancel={closeAdd}
        onOk={submitAdd}
        okText="Add Subscription"
        cancelText="Cancel"
        width={680}
        title={<span className="text-white">Add Subscription</span>}
        className="[&_.ant-modal-content]:rounded-[24px] [&_.ant-modal-content]:border [&_.ant-modal-content]:border-dnx-border [&_.ant-modal-content]:bg-dnx-card/95 [&_.ant-modal-content]:backdrop-blur-xl"
      >
        <Form
          form={addForm}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            billing: 'Monthly',
            trialEnabled: true,
            trialDays: 7,
            status: 'Draft',
            subscribers: 0,
            features: ['Rankings', 'Weekly Competition', 'Position Visibility'],
            price: 299,
          }}
        >
          <Form.Item
            name="name"
            label={<span className="text-dnx-muted">Plan Name</span>}
            rules={[{ required: true, message: 'Plan Name is required' }]}
          >
            <Input size="large" className="!rounded-2xl" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="price"
              label={<span className="text-dnx-muted">Price</span>}
              rules={[{ required: true, message: 'Price is required' }]}
            >
              <InputNumber size="large" className="w-full !rounded-2xl" min={0} />
            </Form.Item>
            <Form.Item
              name="billing"
              label={<span className="text-dnx-muted">Billing Type</span>}
              rules={[{ required: true, message: 'Billing Type is required' }]}
            >
              <Select
                size="large"
                options={[
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Annual', value: 'Annual' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="features"
            label={<span className="text-dnx-muted">Features</span>}
          >
            <Select
              mode="multiple"
              size="large"
              options={FEATURE_OPTIONS.map((f) => ({ label: f, value: f }))}
              placeholder="Select features"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="trialEnabled"
              label={<span className="text-dnx-muted">Trial Enabled</span>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="trialDays"
              label={<span className="text-dnx-muted">Trial Days</span>}
            >
              <InputNumber size="large" className="w-full !rounded-2xl" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="status" label={<span className="text-dnx-muted">Status</span>}>
            <Select
              size="large"
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Disabled', value: 'Disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit subscription modal */}
      <Modal
        open={editOpen}
        onCancel={closeEdit}
        onOk={submitEdit}
        okText="Save"
        cancelText="Cancel"
        width={680}
        title={<span className="text-white">Edit Subscription</span>}
        className="[&_.ant-modal-content]:rounded-[24px] [&_.ant-modal-content]:border [&_.ant-modal-content]:border-dnx-border [&_.ant-modal-content]:bg-dnx-card/95 [&_.ant-modal-content]:backdrop-blur-xl"
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="name"
            label={<span className="text-dnx-muted">Plan Name</span>}
            rules={[{ required: true, message: 'Plan Name is required' }]}
          >
            <Input size="large" className="!rounded-2xl" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="price"
              label={<span className="text-dnx-muted">Price</span>}
              rules={[{ required: true, message: 'Price is required' }]}
            >
              <InputNumber size="large" className="w-full !rounded-2xl" min={0} />
            </Form.Item>
            <Form.Item
              name="billing"
              label={<span className="text-dnx-muted">Billing Type</span>}
              rules={[{ required: true, message: 'Billing Type is required' }]}
            >
              <Select
                size="large"
                options={[
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Annual', value: 'Annual' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="features"
            label={<span className="text-dnx-muted">Features</span>}
          >
            <Select
              mode="multiple"
              size="large"
              options={FEATURE_OPTIONS.map((f) => ({ label: f, value: f }))}
              placeholder="Select features"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="trialEnabled"
              label={<span className="text-dnx-muted">Trial Enabled</span>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="trialDays"
              label={<span className="text-dnx-muted">Trial Days</span>}
            >
              <InputNumber size="large" className="w-full !rounded-2xl" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="status" label={<span className="text-dnx-muted">Status</span>}>
            <Select
              size="large"
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Disabled', value: 'Disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage drawer */}
      <Drawer
        open={manageOpen}
        onClose={closeManage}
        placement="right"
        size={520}
        title={<span className="text-white">Manage plan</span>}
        className="[&_.ant-drawer-header]:border-dnx-border [&_.ant-drawer-header]:bg-dnx-surface [&_.ant-drawer-body]:bg-dnx-surface"
      >
        {!activePlan ? (
          <div className="text-dnx-muted">No plan selected.</div>
        ) : (
          <div className="space-y-5">
            <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
              <p className="text-[11px] uppercase-tracking text-dnx-muted">Plan</p>
              <p className="mt-2 text-xl font-semibold text-white">{activePlan.name}</p>
              <p className="mt-1 text-dnx-muted">
                {activePlan.billing} · {money(activePlan.price)}
              </p>
              <div className="mt-3">{statusTag(activePlan.status)}</div>
            </div>

            <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
              <p className="text-[11px] uppercase-tracking text-dnx-muted">
                Enabled features
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activePlan.features.length === 0 ? (
                  <span className="text-dnx-muted">No features enabled.</span>
                ) : (
                  activePlan.features.map((f) => (
                    <Tag
                      key={f}
                      className="rounded-full border-dnx-border bg-dnx-card text-white/80"
                    >
                      {f}
                    </Tag>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
              <p className="text-[11px] uppercase-tracking text-dnx-muted">Trials</p>
              <p className="mt-2 text-sm text-white">
                Trial:{' '}
                <span
                  className={
                    activePlan.trialEnabled ? 'text-dnx-yellow' : 'text-dnx-muted'
                  }
                >
                  {activePlan.trialEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </p>
              {activePlan.trialEnabled && (
                <p className="mt-1 text-sm text-dnx-muted">
                  Trial days: {activePlan.trialDays}
                </p>
              )}
            </div>

            <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
              <p className="text-[11px] uppercase-tracking text-dnx-muted">
                Active users
              </p>
              <p className="mt-2 text-sm text-white">
                Subscribers:{' '}
                <span className="text-dnx-yellow">{activePlan.subscribers}</span>
              </p>
            </div>

            <div className="glass-card rounded-[20px] border border-dnx-border/80 p-4">
              <p className="text-[11px] uppercase-tracking text-dnx-muted">
                Billing settings
              </p>
              <p className="mt-2 text-sm text-white">
                {activePlan.billing} billing · Price:{' '}
                <span className="text-dnx-yellow">{money(activePlan.price)}</span>
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
