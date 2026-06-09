import { useState } from 'react'
import { Save } from 'lucide-react'
import type { SectionCard } from '@/types'

interface CardFieldProps {
  item: SectionCard
  onSave: (id: number, title: string, description: string, icon: string) => Promise<void>
  disabled: boolean
}

export function CardField({ item, onSave, disabled }: CardFieldProps) {
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description)
  const [icon, setIcon] = useState(item.icon)
  const isDirty = title !== item.title || description !== item.description || icon !== item.icon

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Ícone</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="ex: leaf, music..."
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Descrição</label>
        <div className="flex gap-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui resize-none"
          />
          {isDirty && (
            <button
              onClick={() => onSave(item.idCard, title, description, icon)}
              disabled={disabled}
              className="shrink-0 p-1.5 self-end text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
