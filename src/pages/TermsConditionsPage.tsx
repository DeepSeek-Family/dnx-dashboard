import { RuleHtmlPreview } from '@/components/RuleHtmlPreview'
import { RuleRichTextEditor } from '@/components/RuleRichTextEditor'
import {
  useCreateRuleMutation,
  useGetRuleByTypeQuery,
} from '@/store/api/dashboardOverViewPage/rule.api'
import type { IRule } from '@/types/rule.types'
import { useAppMessage } from '@/hooks/useAppMessage'
import { Alert, Button, Card, Modal, Spin, Typography } from 'antd'
import { useState } from 'react'

function readQueryErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const msg = (data as { message?: unknown }).message
      if (typeof msg === 'string' && msg.trim()) return msg
    }
    if (typeof data === 'string' && data.trim()) return data
  }
  if (error && typeof error === 'object' && 'error' in error) {
    const err = (error as { error?: unknown }).error
    if (typeof err === 'string' && err.trim()) return err
  }
  return 'Terms could not be loaded from the server.'
}

export default function TermsConditionsPage() {
  const message = useAppMessage()
  const [preview, setPreview] = useState(false)
  const {
    data: rule,
    isLoading,
    isError,
    error: loadError,
    refetch,
  } = useGetRuleByTypeQuery('TERMS')

  const [updateRule, { isLoading: isUpdating }] = useCreateRuleMutation()

  const [draft, setDraft] = useState<string | null>(null)

  if (isLoading) {
    return <Spin />
  }

  const rawContent = rule?.data?.content
  const serverContent = typeof rawContent === 'string' ? rawContent : ''
  const editorValue = draft !== null ? draft : serverContent

  const handleSaveChanges = async () => {
    await updateRule({
      content: editorValue,
      type: 'TERMS',
    } as unknown as IRule)
      .unwrap()
      .then(() => {
        message.success('Rule updated successfully')
        setDraft(null)
        refetch()
      })
      .catch((error) => {
        message.error(error?.data?.message || 'Update failed')
      })
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography.Text className="text-[11px] uppercase-tracking text-dnx-muted">
          Terms & Conditions
        </Typography.Text>

        <Typography.Title level={2} className="!mb-1 !mt-2 !text-white">
          CMS policy editor
        </Typography.Title>
      </div>

      {isError && (
        <Alert
          type="warning"
          showIcon
          message="Could not load saved terms"
          description={readQueryErrorMessage(loadError)}
          action={
            <Button size="small" type="primary" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {!isError && !serverContent.trim() && draft === null && (
        <Alert
          type="info"
          showIcon
          message="No terms in the database yet"
          description="The editor is empty. Add content below and save to create the TERMS rule."
        />
      )}

      <Card className="glass-card rounded-[20px] border-dnx-border bg-dnx-card/90">
        <RuleRichTextEditor
          value={editorValue}
          onChange={setDraft}
          placeholder="Write your terms and conditions…"
          minHeight={360}
        />
      </Card>

      <Modal
        open={preview}
        onCancel={() => setPreview(false)}
        onOk={() => setPreview(false)}
        title="Preview mode"
        okText="Close"
        width={720}
        className="[&_.ant-modal-content]:bg-dnx-card [&_.ant-modal-header]:bg-dnx-card"
      >
        <RuleHtmlPreview html={editorValue} emptyMessage="No terms content yet." />
      </Modal>

      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={() => setPreview(true)}>Preview</Button>
        <Button type="primary" onClick={handleSaveChanges} loading={isUpdating}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
