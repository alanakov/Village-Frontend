import { useState } from 'react'
import type { SectionContent } from '@/types'

interface ContentFieldProps {
  item: SectionContent
  onSave: (id: number, text: string, type: string) => Promise<void>
  disabled: boolean
}

export function ContentField({ item, onSave, disabled }: ContentFieldProps) {
  const [text, setText] = useState(item.content)
  const isDirty = text !== item.content

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] font-ui uppercase tracking-wider">
          Texto {item.type}
        </span>
        {isDirty && (
          <button
            onClick={() => onSave(item.idContent, text, item.type)}
            disabled={disabled}
            className="text-xs text-[var(--primary)] font-semibold font-ui hover:underline disabled:opacity-50"
          >
            Salvar
          </button>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white text-sm font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
      />
    </div>
  )
}
