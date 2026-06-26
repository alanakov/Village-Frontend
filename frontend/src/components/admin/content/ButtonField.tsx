import { useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { SectionButton } from '@/types'

interface ButtonFieldProps {
  item: SectionButton
  onSave: (id: number, label: string, link: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  disabled: boolean
}

export function ButtonField({ item, onSave, onDelete, disabled }: ButtonFieldProps) {
  const [label, setLabel] = useState(item.label)
  const [link, setLink] = useState(item.link)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isDirty = label !== item.label || link !== item.link

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(item.idButton)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Link (URL completa)</label>
          <div className="flex gap-2">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              disabled={disabled}
              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
            />
            {isDirty && (
              <button
                onClick={() => onSave(item.idButton, label, link)}
                disabled={disabled}
                className="shrink-0 p-1.5 text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-lg disabled:opacity-50 transition-colors"
                title="Salvar"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={disabled || deleting}
              className="shrink-0 p-1.5 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Excluir"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir botão"
        message={`Tem certeza que deseja excluir o botão "${item.label}"?`}
        confirmLabel="Excluir"
        loading={deleting}
        danger
      />
    </div>
  )
}
