import {
  Leaf, Music, Palette, BookOpen, Star, Heart, Users, Zap, Globe,
  Sun, Moon, Cloud, Flame, Droplets, Wind, Mountain, Trees,
  ShoppingBag, Layers, Camera, Home, Award, Trophy, Target,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  leaf:        Leaf,
  trees:       Trees,
  mountain:    Mountain,
  sun:         Sun,
  moon:        Moon,
  cloud:       Cloud,
  flame:       Flame,
  droplets:    Droplets,
  wind:        Wind,
  music:       Music,
  palette:     Palette,
  camera:      Camera,
  users:       Users,
  heart:       Heart,
  home:        Home,
  shoppingbag: ShoppingBag,
  layers:      Layers,
  star:        Star,
  award:       Award,
  trophy:      Trophy,
  target:      Target,
  bookopen:    BookOpen,
  zap:         Zap,
  globe:       Globe,
}

const FALLBACKS: LucideIcon[] = [Leaf, Music, Palette, BookOpen, Star, Heart, Users, Zap]

export function resolveIcon(name: string | undefined | null, fallbackIndex = 0): LucideIcon {
  if (name) {
    const key = name.toLowerCase().replace(/[-\s]/g, '')
    if (ICON_MAP[key]) return ICON_MAP[key]
  }
  return FALLBACKS[fallbackIndex % FALLBACKS.length]
}
