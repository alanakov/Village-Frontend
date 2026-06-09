import { useState } from 'react'
import { Save } from 'lucide-react'
import type { SectionStat } from '@/types'

interface StatFieldProps {
  item: SectionStat
  onSave: (id: number, title: string, value: string) => Promise<void>
  disabled: boolean
}

export function StatField({ item, onSave, disabled }: StatFieldProps) {
  const [title, setTitle] = useState(item.title)
  const [value, setValue] = useState(item.value)
  const isDirty = title !== item.title || value !== item.value

  return (
    <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--muted)] rounded-xl">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Valor</label>
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
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
        </div>
      </div>
    </div>
  )
}
