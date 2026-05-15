import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Col, Menu, Row, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'

import { useGetUserQuery } from '@/store/api/auth.api'
import ChangePassword from '@/components/ChangePassword'
import SettingsProfilePanel from '@/components/SettingsProfilePanel'

type SettingsSection = 'profile' | 'password'

const sideMenuItems: MenuProps['items'] = [
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { key: 'password', icon: <LockOutlined />, label: 'Change password' },
]

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>('profile')
  const { data: userData } = useGetUserQuery({})
  const user = userData?.data
  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">
          Settings
        </Typography.Text>
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
          {section === 'password' && <ChangePassword />}
        </Col>
      </Row>
    </div>
  )
}
