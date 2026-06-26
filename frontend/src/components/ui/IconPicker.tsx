import {
  Heart, Users, Leaf, BookOpen, TrendingUp,
  HandHeart, Globe, Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface IconOption {
  name: string      // valor persistido no banco
  label: string     // rótulo visível
  Icon: LucideIcon  // componente lucide
}

export const CARD_ICONS: IconOption[] = [
  { name: 'heart',    label: 'Impacto Social',   Icon: Heart      },
  { name: 'users',    label: 'Comunidade',        Icon: Users      },
  { name: 'leaf',     label: 'Sustentabilidade',  Icon: Leaf       },
  { name: 'book',     label: 'Educação',          Icon: BookOpen   },
  { name: 'trending', label: 'Crescimento',       Icon: TrendingUp },
  { name: 'hand',     label: 'Inclusão',          Icon: HandHeart  },
  { name: 'globe',    label: 'Colaboração',       Icon: Globe      },
  { name: 'star',     label: 'Destaque',          Icon: Star       },
]

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  CARD_ICONS.map(({ name, Icon }) => [name, Icon])
)

interface IconPickerProps {
  value: string
  onChange: (name: string) => void
  disabled?: boolean
  error?: string
}

export function IconPicker({ value, onChange, disabled, error }: IconPickerProps) {
  return (
    <div className="flex flex-col gap-1.5 font-ui">
      <label className="text-xs font-semibold text-[var(--muted-foreground)]">
        Ícone <span className="text-[var(--destructive)]">*</span>
      </label>
      <div
        className={cn(
          'grid grid-cols-4 gap-1.5 p-2 rounded-xl border bg-white transition-all',
          error
            ? 'border-[var(--destructive)]'
            : 'border-[var(--border)]',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {CARD_ICONS.map(({ name, label, Icon }) => {
          const isSelected = value === name
          return (
            <button
              key={name}
              type="button"
              title={label}
              onClick={() => onChange(name)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center gap-1 px-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150',
                isSelected
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[10px] leading-tight text-center truncate w-full">
                {label}
              </span>
            </button>
          )
        })}
      </div>
      {value ? (
        <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
          Selecionado:
          <span className="font-semibold text-[var(--primary)]">
            {CARD_ICONS.find((i) => i.name === value)?.label ?? value}
          </span>
        </p>
      ) : (
        <p className="text-xs text-[var(--muted-foreground)]">
          Selecione um ícone para o card
        </p>
      )}

      {error && (
        <p className="text-xs text-[var(--destructive)]">{error}</p>
      )}
    </div>
  )
}
