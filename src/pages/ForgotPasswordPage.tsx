import { MailOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const { message } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card className="glass-card border-dnx-border !bg-dnx-card/90 !rounded-[22px]" bordered={false}>
      <Title level={3} className="!mb-2 !font-semibold !text-white">
        Recover access
      </Title>
      <Text type="secondary" className="!text-dnx-muted">
        We&apos;ll route a secure reset path to your operations inbox.
      </Text>
      <Form
        layout="vertical"
        className="mt-8"
        requiredMark={false}
        onFinish={async () => {
          setIsLoading(true)
          await new Promise((resolve) => setTimeout(resolve, 800))
          message.success('Reset link simulation sent successfully.')
          setIsLoading(false)
        }}
      >
        <Form.Item label={<span className="text-dnx-muted">Email</span>} name="email">
          <Input size="large" prefix={<MailOutlined className="text-dnx-muted" />} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
          Send recovery link
        </Button>
        <div className="mt-6 text-center text-sm">
          <Link to={ROUTES.login} className="text-dnx-yellow">
            Return to login
          </Link>
        </div>
      </Form>
    </Card>
  )
}
