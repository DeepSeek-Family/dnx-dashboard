import { Card, Space, Typography, Avatar } from "antd"
import { getProfileImageUrl } from "@/shared/getImageUrl"
import { MailOutlined, UserOutlined } from "@ant-design/icons"

const SettingsProfilePanel = ({ user }: { user: any }) => {
  return (
    <Card className="glass-card overflow-hidden border-dnx-border bg-dnx-card/90 p-0">
      {user ? (
        <>
          <div className="h-28 bg-gradient-to-br from-dnx-yellow/20 via-dnx-yellow/5 to-transparent" />
          <div className="relative -mt-14 px-6 pb-8 pt-0 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-8">
              <img
                width={112}
                height={112}
                src={getProfileImageUrl(user?.profile || '')}
                alt=""
                className="shrink-0 border-4 border-dnx-bg bg-dnx-yellow/20 text-3xl font-semibold text-dnx-yellow shadow-lg ring-2 ring-dnx-border/60"
              />


              <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
                <Typography.Title level={3} className="!mb-2 !mt-0 !text-white">
                  {user?.name}
                </Typography.Title>
                <Space size="small" className="text-dnx-muted">
                  <MailOutlined className="text-dnx-yellow/80" />
                  <Typography.Link href={`mailto:${user?.email}`} className="!text-dnx-muted hover:!text-white">
                    {user?.email}
                  </Typography.Link>
                </Space>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  <h1 className="text-white"> {user?.role}</h1>
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

export default SettingsProfilePanel