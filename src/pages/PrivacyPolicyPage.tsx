import { RuleHtmlPreview } from '@/components/RuleHtmlPreview'
import { RuleRichTextEditor } from '@/components/RuleRichTextEditor'
import { useCreateRuleMutation, useGetRuleByTypeQuery } from '@/store/api/dashboardOverViewPage/rule.api'
import type { IRule } from '@/types/rule.types'
import { useAppMessage } from '@/hooks/useAppMessage'
import { Button, Card, Modal, Spin, Typography } from 'antd'
import { useState } from 'react'

export default function PrivacyPolicyPage() {
  const message = useAppMessage()
  const [draft, setDraft] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const { data: rule, isLoading, refetch } = useGetRuleByTypeQuery('PRIVACY')

  const [updateRule, { isLoading: isUpdating }] = useCreateRuleMutation()

  if (isLoading) {
    return <Spin />
  }

  const serverContent = rule?.data?.content ?? ''
  const editorValue = draft !== null ? draft : serverContent

  const handleSaveChanges = async () => {
    await updateRule({
      content: editorValue,
      type: 'PRIVACY',
    } as unknown as IRule).unwrap().then(() => {
      message.success('Rule updated successfully')
      setDraft(null)
      refetch()
    }).catch((error) => {
      message.error(error?.data?.message || 'Update failed')
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">Privacy Policy</Typography.Text>
        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          Policy management workspace
        </Typography.Title>
      </div>
      <Card className="glass-card rounded-[20px] border-dnx-border bg-dnx-card/90">
        <RuleRichTextEditor
          value={editorValue}
          onChange={setDraft}
          placeholder="Write your privacy policy…"
        />
      </Card>
      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={() => setPreview(true)}>Preview</Button>
        <Button
          type="primary"
          onClick={handleSaveChanges}
          loading={isUpdating}
        >
          Save Changes
        </Button>
      </div>
      <Modal
        open={preview}
        onCancel={() => setPreview(false)}
        onOk={() => setPreview(false)}
        title="Preview"
        okText="Close"
        width={720}
        className="[&_.ant-modal-content]:bg-dnx-card [&_.ant-modal-header]:bg-dnx-card"
      >
        <RuleHtmlPreview html={editorValue} emptyMessage="No privacy policy content yet." />
      </Modal>
    </div>
  )
}
