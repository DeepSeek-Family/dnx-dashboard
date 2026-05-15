import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, Form, Input, Space, Typography, Upload } from 'antd'
import { CameraOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'

import { getImageUrl } from '@/shared/getImageUrl'
import { useGetUserQuery, useUpdateUserMutation } from '@/store/api/auth.api'
import type { SettingsProfileUser, UpdateProfileFormValues } from '@/types/auth'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const SettingsProfilePanel = ({ user }: { user?: SettingsProfileUser }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm<UpdateProfileFormValues>()
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const { refetch } = useGetUserQuery({})

  useEffect(() => {
    if (user?.name) {
      form.setFieldsValue({ name: user.name })
    }
    setProfileFile(null)
    setPreviewUrl('')
  }, [user?.name, form])

  const profileSrc =
    previewUrl || (user?.profile?.trim() ? getImageUrl(user.profile) : '')

  const handleUpdateUser = async (values: UpdateProfileFormValues) => {
    const formData = new FormData()
    formData.append('name', values.name.trim())
    if (profileFile) {
      formData.append('profile', profileFile)
    }

    try {
      await updateUser(formData).unwrap()
      message.success('Profile updated successfully')
      setProfileFile(null)
      setPreviewUrl('')
      refetch()
    } catch (err: unknown) {
      const apiMessage =
        typeof err === 'object' &&
          err !== null &&
          'data' in err &&
          typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : null
      message.error(apiMessage ?? 'Could not update profile')
    }
  }

  return (
    <Card className="glass-card overflow-hidden border-dnx-border bg-dnx-card/90 p-0">
      {user ? (
        <>
          <div className="h-28 bg-gradient-to-br from-dnx-yellow/20 via-dnx-yellow/5 to-transparent" />
          <div className="relative -mt-14 px-6 pb-8 pt-0 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-8">
              <div className="relative shrink-0">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-dnx-bg bg-dnx-yellow/20 shadow-lg ring-2 ring-dnx-border/60 sm:h-[7rem] sm:w-[7rem]">
                  {profileSrc ? (
                    <img src={profileSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-dnx-yellow">
                      <UserOutlined />
                    </div>
                  )}
                </div>
                <Upload
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                      message.error('Please upload a JPEG, PNG, WebP, or GIF image')
                      return Upload.LIST_IGNORE
                    }
                    setProfileFile(file)
                    setPreviewUrl(URL.createObjectURL(file))
                    return false
                  }}
                >
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-dnx-border bg-dnx-card text-dnx-yellow shadow-md transition hover:bg-dnx-bg"
                    aria-label="Change profile photo"
                  >
                    <CameraOutlined />
                  </button>
                </Upload>
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
                <Typography.Title level={3} className="!mb-2 !mt-0 !text-white">
                  {user?.name}
                </Typography.Title>
                <Space size="small" className="text-dnx-muted">
                  <MailOutlined className="text-dnx-yellow/80" />
                  <Typography.Link
                    href={`mailto:${user?.email}`}
                    className="!text-dnx-muted hover:!text-white"
                  >
                    {user?.email}
                  </Typography.Link>
                </Space>
                {user?.role ? (
                  <Typography.Text className="mt-4 text-white">
                    {user.role}
                  </Typography.Text>
                ) : null}
              </div>
            </div>

            <div className="mt-8 border-t border-dnx-border/60 pt-8">
              <Typography.Title level={5} className="!mb-4 !mt-0 !text-white">
                Edit profile
              </Typography.Title>
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                className="max-w-md"
                onFinish={handleUpdateUser}
              >
                <Form.Item
                  label={<span className="text-dnx-muted">Display name</span>}
                  name="name"
                  rules={[
                    { required: true, message: 'Enter your name' },
                    { whitespace: true, message: 'Enter your name' },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Your name"
                    prefix={<UserOutlined className="text-dnx-muted" />}
                  />
                </Form.Item>
                <Form.Item className="!mb-0">
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Save changes
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 px-6 py-14">
          <Avatar
            size={96}
            icon={<UserOutlined />}
            className="bg-dnx-card text-dnx-muted"
          />
          <Typography.Text type="secondary" className="text-center">
            No signed-in user. Log in to see your profile.
          </Typography.Text>
        </div>
      )}
    </Card>
  )
}

export default SettingsProfilePanel
