import { ICON_MAP, CARD_ICONS } from '@/components/ui/IconPicker'
import type { LucideIcon } from 'lucide-react'

const FALLBACKS: LucideIcon[] = CARD_ICONS.map((c) => c.Icon)

export function resolveIcon(name: string | undefined | null, fallbackIndex = 0): LucideIcon {
  if (name) {
    const key = name.toLowerCase().replace(/[-\s]/g, '')
    if (ICON_MAP[key]) return ICON_MAP[key]
  }
  return FALLBACKS[fallbackIndex % FALLBACKS.length]
}
