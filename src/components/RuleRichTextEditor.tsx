import '@/styles/tiptap-editor.css'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useMemo } from 'react'

function normalizeRuleContent(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) return ''
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return content
  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

type RuleRichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

type ToolbarButtonProps = {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

function ToolbarButton({ label, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={active ? 'is-active' : undefined}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  )
}

export function RuleRichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your policy content…',
  minHeight = 320,
}: RuleRichTextEditorProps) {
  const htmlValue = useMemo(() => normalizeRuleContent(value), [value])

  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'rule-tiptap-content',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (htmlValue !== current) {
      editor.commands.setContent(htmlValue, { emitUpdate: false })
    }
  }, [editor, htmlValue])

  useEffect(() => {
    if (!editor) return
    const root = editor.view.dom as HTMLElement
    root.style.minHeight = `${minHeight}px`
  }, [editor, minHeight])

  if (!editor) {
    return (
      <div
        className="rule-tiptap-editor flex min-h-[320px] items-center justify-center text-sm text-dnx-muted"
        style={{ minHeight }}
      >
        Loading editor…
      </div>
    )
  }

  return (
    <div className="rule-tiptap-editor">
      <div className="rule-tiptap-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton
          label="B"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="S"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="• List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1. List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
