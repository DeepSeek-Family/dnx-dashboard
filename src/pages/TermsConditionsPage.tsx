import { Card, Input, Modal, Typography } from 'antd'
import { useState } from 'react'

export default function TermsConditionsPage() {
  const [content, setContent] = useState('DNX terms v2.1\\n\\n1. Usage\\n2. Data policy\\n3. Competition governance')
  const [preview, setPreview] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">Terms & Conditions</Typography.Text>
        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          CMS policy editor
        </Typography.Title>
      </div>
      <Card className="glass-card rounded-[20px] border-dnx-border bg-dnx-card/90">
        <Input.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="font-mono"
        />
        <Typography.Paragraph className="!mt-4 !mb-0 !text-dnx-muted">
          Version history: v2.1 (current), v2.0, v1.9
        </Typography.Paragraph>
      </Card>
      <Modal open={preview} onCancel={() => setPreview(false)} onOk={() => setPreview(false)} title="Preview mode">
        <pre className="whitespace-pre-wrap text-sm">{content}</pre>
      </Modal>
    </div>
  )
}
