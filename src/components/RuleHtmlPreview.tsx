type RuleHtmlPreviewProps = {
  html: string
  className?: string
  emptyMessage?: string
}

export function RuleHtmlPreview({
  html,
  className = '',
  emptyMessage = 'No content yet.',
}: RuleHtmlPreviewProps) {
  const trimmed = html.trim()

  if (!trimmed) {
    return <p className={`text-sm text-dnx-muted ${className}`.trim()}>{emptyMessage}</p>
  }

  return (
    <div
      className={`rule-html-preview text-sm ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  )
}

