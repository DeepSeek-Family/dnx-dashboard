import { useChangePasswordMutation } from '@/store/api/auth.api'
import type { ChangePasswordFormValues } from '@/types/auth'
import { LockOutlined } from '@ant-design/icons'
import { App, Card, Input, Form, Button } from 'antd'

const ChangePassword = () => {
    const { message } = App.useApp()
    const [form] = Form.useForm<ChangePasswordFormValues>()

    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const handleChangePassword = async (values: ChangePasswordFormValues) => {
        try {
            await changePassword(values).unwrap()
            message.success('Password updated.')
            form.resetFields()
        } catch (err: unknown) {
            const apiMessage =
                typeof err === 'object' &&
                    err !== null &&
                    'data' in err &&
                    typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
                    ? (err as { data: { message: string } }).data.message
                    : null
            message.error(apiMessage ?? 'Could not update password')
        }
    }
    return (
        <Card className="glass-card min-h-[280px] max-w-xl border-dnx-border bg-dnx-card/90" title="Change password">
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleChangePassword}
            >
                <Form.Item
                    label="Current password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Enter your current password' }]}
                >
                    <Input.Password
                        size="large"
                        placeholder="Enter your current password"
                        prefix={<LockOutlined className="text-dnx-muted" />}
                    />
                </Form.Item>
                <Form.Item
                    label="New password"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Enter a new password' },
                        { min: 6, message: 'At least 6 characters' },
                    ]}
                >
                    <Input.Password
                        size="large"
                        placeholder="Enter a new password"
                        prefix={<LockOutlined className="text-dnx-muted" />}
                    />
                </Form.Item>
                <Form.Item className="!mb-0">
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Update password
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ChangePassword;