import { useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { SectionStat } from '@/types'

interface StatFieldProps {
  item: SectionStat
  onSave: (id: number, title: string, value: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  disabled: boolean
}

export function StatField({ item, onSave, onDelete, disabled }: StatFieldProps) {
  const [title, setTitle] = useState(item.title)
  const [value, setValue] = useState(item.value)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isDirty = title !== item.title || value !== item.value

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(item.idStat)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Valor</label>
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
            />
            {isDirty && (
              <button
                onClick={() => onSave(item.idStat, title, value)}
                disabled={disabled}
                className="shrink-0 p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg disabled:opacity-50"
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
        title="Excluir estatística"
        message={`Tem certeza que deseja excluir "${item.title}"?`}
        confirmLabel="Excluir"
        loading={deleting}
        danger
      />
    </div>
  )
}
