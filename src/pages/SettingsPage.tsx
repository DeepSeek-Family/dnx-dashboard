import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { App, Avatar, Button, Card, Col, Form, Input, Menu, Row, Space, Tag, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'

import { useAuthSession } from '@/context/AuthSessionContext'
import type { AuthUser } from '@/types/auth'

type SettingsSection = 'profile' | 'password'

function profileInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SettingsProfilePanel({ user }: { user: AuthUser | null }) {
  return (
    <Card className="glass-card overflow-hidden border-dnx-border bg-dnx-card/90 p-0">
      {user ? (
        <>
          <div className="h-28 bg-gradient-to-br from-dnx-yellow/20 via-dnx-yellow/5 to-transparent" />
          <div className="relative -mt-14 px-6 pb-8 pt-0 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-8">
              <Avatar
                size={112}
                src={user.avatarUrl}
                alt=""
                className="shrink-0 border-4 border-dnx-bg bg-dnx-yellow/20 text-3xl font-semibold text-dnx-yellow shadow-lg ring-2 ring-dnx-border/60"
              >
                {!user.avatarUrl ? profileInitials(user.name) : null}
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
                <Typography.Title level={3} className="!mb-2 !mt-0 !text-white">
                  {user.name}
                </Typography.Title>
                <Space size="small" className="text-dnx-muted">
                  <MailOutlined className="text-dnx-yellow/80" />
                  <Typography.Link href={`mailto:${user.email}`} className="!text-dnx-muted hover:!text-white">
                    {user.email}
                  </Typography.Link>
                </Space>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {user.roles.map((r) => (
                    <Tag key={r} color="blue" className="m-0 capitalize">
                      {r.replace('_', ' ')}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 px-6 py-14">
          <Avatar size={96} icon={<UserOutlined />} className="bg-dnx-card text-dnx-muted" />
          <Typography.Text type="secondary" className="text-center">
            No signed-in user. Log in to see your profile.
          </Typography.Text>
        </div>
      )}
    </Card>
  )
}

function SettingsPasswordPanel() {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  return (
    <Card className="glass-card min-h-[280px] max-w-xl border-dnx-border bg-dnx-card/90" title="Change password">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={async () => {
          await new Promise((r) => setTimeout(r, 400))
          message.success('Password updated.')
          form.resetFields()
        }}
      >
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: 'Enter your current password' }]}
        >
          <Input.Password size="large" prefix={<LockOutlined className="text-dnx-muted" />} />
        </Form.Item>
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[
            { required: true, message: 'Enter a new password' },
            { min: 6, message: 'At least 6 characters' },
          ]}
        >
          <Input.Password size="large" prefix={<LockOutlined className="text-dnx-muted" />} />
        </Form.Item>
        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                return Promise.reject(new Error('Passwords do not match'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item className="!mb-0">
          <Button type="primary" htmlType="submit">
            Update password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const sideMenuItems: MenuProps['items'] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { key: 'password', icon: <LockOutlined />, label: 'Change password' },
]

export default function SettingsPage() {
  const { user } = useAuthSession()
  const [section, setSection] = useState<SettingsSection>('profile')

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">Settings</Typography.Text>
        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          Account
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 max-w-2xl text-dnx-muted">
          View your profile or update your sign-in password.
        </Typography.Paragraph>
      </div>

      <Row gutter={[18, 18]} wrap>
        <Col xs={24} md={8} lg={7} xl={6}>
          <div className="glass-card rounded-[20px] border border-dnx-border/80 bg-dnx-card/90 p-2 md:sticky md:top-4">
            <Menu
              mode="inline"
              selectedKeys={[section]}
              items={sideMenuItems}
              className="!border-0 !bg-transparent"
              onClick={({ key }) => setSection(key as SettingsSection)}
            />
          </div>
        </Col>
        <Col xs={24} md={16} lg={17} xl={18}>
          {section === 'profile' && <SettingsProfilePanel user={user} />}
          {section === 'password' && <SettingsPasswordPanel />}
        </Col>
      </Row>
    </div>
  )
}
