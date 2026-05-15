import { useCreateRuleMutation, useGetRuleByTypeQuery } from '@/store/api/dashboardOverViewPage/rule.api'
import type { IRule } from '@/types/rule.types'
import { Button, Card, Input, message, Spin, Typography } from 'antd'
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
  return 'Privacy policy could not be loaded from the server.'
}

export default function PrivacyPolicyPage() {
  const [draft, setDraft] = useState<string | null>(null)
  const { data: rule, isLoading, refetch } = useGetRuleByTypeQuery('PRIVACY')

  const [updateRule, { isLoading: isUpdating }] = useCreateRuleMutation()

  if (isLoading) {
    return <Spin />
  }

  const serverContent = rule?.data?.content ?? ''
  const textareaValue = draft !== null ? draft : serverContent

  const handleSaveChanges = async () => {
    await updateRule({
      content: textareaValue,
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
        <Input.TextArea rows={14} value={textareaValue} onChange={(e) => setDraft(e.target.value)} />
        <Typography.Paragraph className="!mt-4 !mb-0 !text-dnx-muted">
        </Typography.Paragraph>
      </Card>
      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          onClick={handleSaveChanges}
          loading={isUpdating}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
