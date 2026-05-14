import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthSession } from '@/context/AuthSessionContext'
import { ROUTES } from '@/constants/routes'
import { setToLocalStorage, TOKEN_STORAGE_KEY } from '@/utils/local-storage'
import { useLoginMutation } from '@/store/api/auth.api'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loginMutation, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const { refresh } = useAuthSession()

  const handleLogin = async (values: { email: string; password: string }) => {
    await loginMutation({ email: values.email, password: values.password }).unwrap()
      .then((res) => {
        setToLocalStorage(TOKEN_STORAGE_KEY, res.data.accessToken)
        refresh()
        toast.success(res.message ?? 'Signed in')
        navigate(ROUTES.dashboard, { replace: true })
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }


  return (
    <Card className="glass-card border-dnx-border !bg-dnx-card/90 !rounded-[22px]" bordered={false}>
      <div className="mb-8">
        <p className="text-[11px] uppercase-tracking text-dnx-muted">DNX biometric operations</p>
        <Title level={3} className="!mb-2 !mt-4 !font-semibold !text-white">
          Command access
        </Title>
        <Text type="secondary" className="!text-dnx-muted">
          Biometric console preview mode.
        </Text>
      </div>
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleLogin}
      >
        <Form.Item
          label={<span className="text-dnx-muted">Operations email</span>}
          name="email"
        >
          <Input size="large" prefix={<MailOutlined className="text-dnx-muted" />} placeholder="yourmail@dnx.lab" />
        </Form.Item>
        <Form.Item
          label={<span className="text-dnx-muted">Passphrase</span>}
          name="password"
        >
          <Input.Password size="large" prefix={<LockOutlined className="text-dnx-muted" />} />
        </Form.Item>
        <div className="mb-6 flex justify-between text-sm">
          <Link to={ROUTES.forgotPassword} className="text-dnx-yellow hover:text-white">
            Forgot password
          </Link>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isLoading}
          className="!h-12 !font-semibold"
        >
          Enter command deck
        </Button>
      </Form>
      <p className="mt-6 text-center text-xs text-dnx-muted">
        Instant demo preview enabled.
      </p>
    </Card>
  )
}
