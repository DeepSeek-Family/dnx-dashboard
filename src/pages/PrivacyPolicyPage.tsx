import { Card, Input, Typography } from 'antd'
import { useState } from 'react'

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState('DNX privacy policy draft...')

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">Privacy Policy</Typography.Text>
        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          Policy management workspace
        </Typography.Title>
      </div>
      <Card className="glass-card rounded-[20px] border-dnx-border bg-dnx-card/90">
        <Input.TextArea rows={14} value={content} onChange={(e) => setContent(e.target.value)} />
        <Typography.Paragraph className="!mt-4 !mb-0 !text-dnx-muted">
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
