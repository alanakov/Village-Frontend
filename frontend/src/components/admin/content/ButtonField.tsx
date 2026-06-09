import { useState } from 'react'
import { Save } from 'lucide-react'
import type { SectionButton } from '@/types'

interface ButtonFieldProps {
  item: SectionButton
  onSave: (id: number, label: string, link: string) => Promise<void>
  disabled: boolean
}

export function ButtonField({ item, onSave, disabled }: ButtonFieldProps) {
  const [label, setLabel] = useState(item.label)
  const [link, setLink] = useState(item.link)
  const isDirty = label !== item.label || link !== item.link

  return (
    <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--muted)] rounded-xl">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Link</label>
        <div className="flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
          {isDirty && (
            <button
              onClick={() => onSave(item.idButton, label, link)}
              disabled={disabled}
              className="shrink-0 p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
