import { useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { SectionContent, ContentType } from '@/types'

interface ContentFieldProps {
  item: SectionContent
  onSave: (id: number, text: string, type: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  disabled: boolean
}

export function ContentField({ item, onSave, onDelete, disabled }: ContentFieldProps) {
  const [text, setText] = useState(item.content)
  const [type, setType] = useState<ContentType>(item.type)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isDirty = text !== item.content || type !== item.type

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(item.idContent)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const contentTypes: ContentType[] = ['P1', 'P2', 'P3', 'P4', 'P5']

  return (
    <div className="space-y-2 p-3 bg-[var(--muted)]/50 rounded-xl border border-[var(--border)]">
      <div className="flex items-center justify-between gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ContentType)}
          disabled={disabled}
          className="text-xs font-semibold text-[var(--muted-foreground)] font-ui uppercase tracking-wider bg-transparent border border-[var(--border)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        >
          {contentTypes.map((t) => (
            <option key={t} value={t}>
              Texto {t}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={() => onSave(item.idContent, text, type)}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[var(--primary)] rounded-lg font-semibold font-ui hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
              title="Salvar alterações"
            >
              <Save className="w-3 h-3" />
              Salvar
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={disabled || deleting}
            className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Excluir texto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white text-sm font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y disabled:opacity-50"
      />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir texto"
        message={`Tem certeza que deseja excluir o bloco "${item.type}"? Esta ação é irreversível.`}
        confirmLabel="Excluir"
        loading={deleting}
        danger
      />
    </div>
  )
}
