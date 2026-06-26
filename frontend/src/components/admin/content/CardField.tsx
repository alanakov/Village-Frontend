import { useState } from 'react'
import { Save, Trash2, Lock } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconPicker } from '@/components/ui/IconPicker'
import type { SectionCard } from '@/types'

interface CardFieldProps {
  item: SectionCard
  subtitleLabel?: string
  onSave: (id: number, title: string, description: string, icon: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  disabled: boolean
  canDelete: boolean
}

export function CardField({ item, subtitleLabel = 'Subtítulo', onSave, onDelete, disabled, canDelete }: CardFieldProps) {
  const [title, setTitle]                   = useState(item.title)
  const [description, setDescription]       = useState(item.description)
  const [icon, setIcon]                     = useState(item.icon)
  const [confirmDelete, setConfirmDelete]   = useState(false)
  const [deleting, setDeleting]             = useState(false)

  const isDirty = title !== item.title || description !== item.description || icon !== item.icon

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(item.idCard) }
    finally { setDeleting(false); setConfirmDelete(false) }
  }

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)] space-y-3">
      {/* Título */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
        />
      </div>

      {/* Ícone via seletor visual */}
      <IconPicker value={icon} onChange={setIcon} disabled={disabled} />

      {/* Subtítulo + ações */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">{subtitleLabel}</label>
        <div className="flex gap-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            disabled={disabled}
            className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui resize-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          />
          <div className="flex flex-col gap-1 shrink-0">
            {isDirty && (
              <button
                onClick={() => onSave(item.idCard, title, description, icon)}
                disabled={disabled}
                title="Salvar alterações"
                className="p-1.5 text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-lg disabled:opacity-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            )}
            {canDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={disabled || deleting}
                title="Excluir card"
                className="p-1.5 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span
                title="Número mínimo de cards — não é possível remover"
                className="p-1.5 text-[var(--muted-foreground)]/40"
              >
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir card"
        message={`Tem certeza que deseja excluir o card "${item.title}"? Esta ação é irreversível.`}
        confirmLabel="Excluir"
        loading={deleting}
        danger
      />
    </div>
  )
}
