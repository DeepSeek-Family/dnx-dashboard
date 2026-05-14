import { LockOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { API_BASE_URL } from '@/utils/api-base'

const { Title, Text } = Typography

export default function ResetPasswordPage() {
  const { message } = App.useApp()
  const [search] = useSearchParams()
  const token = search.get('token') ?? ''
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ token })
  }, [form, token])

  return (
    <Card className="glass-card border-dnx-border !bg-dnx-card/90 !rounded-[22px]" bordered={false}>
      <Title level={3} className="!mb-2 !font-semibold !text-white">
        Reset passphrase
      </Title>
      <Text type="secondary" className="!text-dnx-muted">
        Token:{' '}
        <span className="font-mono text-xs text-white/80">{token || 'missing — use emailed link'}</span>
      </Text>
      <Form
        form={form}
        layout="vertical"
        className="mt-8"
        requiredMark={false}
        initialValues={{ token }}
        onFinish={async (v: { token: string; password: string; confirm: string }) => {
          setIsLoading(true)
          try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: v.token, password: v.password }),
            })
            if (!res.ok) {
              message.error('Reset failed — verify token')
              return
            }
            message.success('Credentials rotated')
          } catch {
            message.error('Reset failed — verify token')
          } finally {
            setIsLoading(false)
          }
        }}
      >
        <Form.Item name="token" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="New passphrase"
          name="password"
          rules={[{ required: true }, { min: 6, message: 'Min 6 characters' }]}
        >
          <Input.Password size="large" prefix={<LockOutlined className="text-dnx-muted" />} />
        </Form.Item>
        <Form.Item
          label="Confirm"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve()
                return Promise.reject(new Error('Passphrases must match'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
          Lock new keys
        </Button>
        <div className="mt-6 text-center text-sm">
          <Link to={ROUTES.login} className="text-dnx-yellow">
            Back to login
          </Link>
        </div>
      </Form>
    </Card>
  )
}
