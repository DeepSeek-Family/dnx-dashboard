import { ConfigProvider, theme as antTheme, App as AntApp } from 'antd'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { AuthSessionProvider } from '@/context/AuthSessionContext'
import { store } from '@/store/index'
import { DNX_COLORS } from '@/constants/theme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SocketProvider } from '@/sockets/SocketProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthSessionProvider>
        <ConfigProvider
          theme={{
            algorithm: antTheme.darkAlgorithm,
            token: {
              colorPrimary: DNX_COLORS.primary,
              colorBgBase: DNX_COLORS.bg,
              colorTextBase: DNX_COLORS.text,
              colorBorder: DNX_COLORS.border,
              colorBorderSecondary: DNX_COLORS.border,
              colorSuccess: DNX_COLORS.success,
              colorWarning: DNX_COLORS.warning,
              colorError: DNX_COLORS.danger,
              colorLink: DNX_COLORS.primary,
              borderRadiusLG: 20,
              fontFamily: `'Space Grotesk', Inter, system-ui, sans-serif`,
            },
            components: {
              Layout: {
                bodyBg: DNX_COLORS.bg,
                headerBg: DNX_COLORS.surface,
                footerBg: DNX_COLORS.bg,
                siderBg: DNX_COLORS.surface,
              },
              Menu: {
                itemBg: 'transparent',
                itemActiveBg: 'rgba(255, 214, 0, 0.12)',
                itemHoverBg: 'rgba(255, 214, 0, 0.08)',
                itemSelectedBg: 'rgba(255, 214, 0, 0.14)',
                itemSelectedColor: DNX_COLORS.primary,
              },
              Button: {
                colorPrimaryHover: '#ffe24d',
                colorPrimaryActive: '#e6bf00',
              },
              Tabs: {
                itemSelectedColor: DNX_COLORS.primary,
                inkBarColor: DNX_COLORS.primary,
                itemHoverColor: '#fff6b0',
                itemColor: DNX_COLORS.muted,
              },
              Card: {
                colorBgContainer: DNX_COLORS.card,
                colorBorderSecondary: DNX_COLORS.border,
              },
              Input: {
                activeBorderColor: DNX_COLORS.primary,
                hoverBorderColor: DNX_COLORS.primary,
                colorBgContainer: DNX_COLORS.card,
                colorBorder: DNX_COLORS.border,
              },
              Table: {
                headerBg: 'transparent',
                rowHoverBg: 'rgba(255, 214, 0, 0.035)',
                colorBgContainer: 'transparent',
              },
              Typography: {
                colorTextHeading: DNX_COLORS.text,
                colorTextDescription: DNX_COLORS.muted,
              },
            },
          }}
        >
          <AntApp>
            <BrowserRouter>
              <SocketProvider>
                <ErrorBoundary>{children}</ErrorBoundary>
              </SocketProvider>
            </BrowserRouter>
          </AntApp>
        </ConfigProvider>
      </AuthSessionProvider>
    </Provider>
  )
}
