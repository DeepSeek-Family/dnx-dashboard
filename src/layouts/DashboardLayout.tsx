import {
  CustomerServiceOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserSwitchOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Avatar, Drawer, Dropdown, Grid, Layout, Menu, type MenuProps } from 'antd'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthSession } from '@/context/AuthSessionContext'
import { LiveStatusBadge } from '@/components/LiveStatusBadge'
import { ROUTES } from '@/constants/routes'
import { useDnxSocket } from '@/sockets/socket-context'

const { Header, Sider, Content } = Layout

const navItems: MenuProps['items'] = [
  { key: ROUTES.dashboard, icon: <DashboardOutlined />, label: <Link to={ROUTES.dashboard}>Dashboard Overview</Link> },
  { key: ROUTES.rankings, icon: <TrophyOutlined />, label: <Link to={ROUTES.rankings}>Rankings</Link> },
  { key: ROUTES.users, icon: <TeamOutlined />, label: <Link to={ROUTES.users}>User Management</Link> },
  { key: ROUTES.gyms, icon: <DeploymentUnitOutlined />, label: <Link to={ROUTES.gyms}>Gym Management</Link> },
  { key: ROUTES.subscriptions, icon: <WalletOutlined />, label: <Link to={ROUTES.subscriptions}>Subscription</Link> },
  { key: ROUTES.support, icon: <CustomerServiceOutlined />, label: <Link to={ROUTES.support}>Support</Link> },
  { key: ROUTES.terms, icon: <SafetyOutlined />, label: <Link to={ROUTES.terms}>Terms & Conditions</Link> },
  { key: ROUTES.privacy, icon: <UserSwitchOutlined />, label: <Link to={ROUTES.privacy}>Privacy Policy</Link> },
  { key: ROUTES.settings, icon: <SettingOutlined />, label: <Link to={ROUTES.settings}>Settings</Link> },
]

export function DashboardLayout() {
  const screens = Grid.useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const nav = useNavigate()
  const { user, logout } = useAuthSession()
  const { demoMode } = useDnxSocket()
  const mobile = !screens.lg

  const selectedKey = useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/users/')) return ROUTES.users
    return path === '/' ? ROUTES.dashboard : path
  }, [location.pathname])

  const menuNode = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={navItems}
      onClick={() => setDrawerOpen(false)}
      className="border-none bg-transparent px-2 py-4 [&_.ant-menu-item]:rounded-xl [&_.ant-menu-item-selected]:bg-dnx-yellow/15 [&_.ant-menu-item-selected]:text-dnx-yellow [&_.ant-menu-item-active]:text-dnx-yellow"
    />
  )

  return (
    <Layout className="min-h-svh bg-dnx-bg">
      {!mobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={292}
          className="relative border-r border-dnx-border bg-dnx-surface/95 !min-h-svh backdrop-blur-xl"
        >
          <div className="flex h-16 items-center gap-3 border-b border-dnx-border px-5">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-dnx-yellow/35 bg-dnx-card text-dnx-yellow glow-yellow">
              <DeploymentUnitOutlined className="text-xl" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-[10px] uppercase-tracking text-dnx-muted">DNX Admin</p>
                <p className="text-sm font-semibold text-white">Biometric Command</p>
              </div>
            )}
          </div>
          {menuNode}

        </Sider>
      )}
      <Layout>
        <Header className="flex h-16 items-center justify-between border-b border-dnx-border bg-dnx-surface/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              className="flex size-10 items-center justify-center rounded-xl border border-dnx-border bg-dnx-card text-dnx-yellow transition hover:scale-105 hover:shadow-[0_0_20px_rgba(255,214,0,0.25)]"
              onClick={() => (mobile ? setDrawerOpen(true) : setCollapsed((c) => !c))}
            >
              {collapsed || mobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] uppercase-tracking text-dnx-muted">Elite athletic intelligence center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LiveStatusBadge demo={demoMode} />
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: 'Admin profile' },
                  { type: 'divider' },
                  {
                    key: 'out',
                    danger: true,
                    label: 'Terminate session',
                    onClick: () => {
                      logout()
                      nav(ROUTES.login)
                    },
                  },
                ],
              }}
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-dnx-border bg-dnx-card px-3 py-1.5"
              >
                <Avatar className="bg-dnx-yellow/20 text-dnx-yellow">
                  {(user?.name ?? 'DNX')
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </Avatar>
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-4 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        size={300}
        title={<span className="text-dnx-yellow">DNX Navigation</span>}
        className="[&_.ant-drawer-header]:border-dnx-border [&_.ant-drawer-header]:bg-dnx-surface [&_.ant-drawer-body]:bg-dnx-surface"
      >
        {menuNode}
      </Drawer>
    </Layout>
  )
}
