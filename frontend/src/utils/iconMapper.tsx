import {
  Leaf, Music, Palette, BookOpen, Star, Heart, Users, Zap, Globe,
  Sun, Moon, Cloud, Flame, Droplets, Wind, Mountain, Trees,
  ShoppingBag, Layers, Camera, Home, Award, Trophy, Target,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  // Nature
  leaf:     Leaf,
  trees:    Trees,
  mountain: Mountain,
  sun:      Sun,
  moon:     Moon,
  cloud:    Cloud,
  flame:    Flame,
  droplets: Droplets,
  wind:     Wind,
  // Culture / Art
  music:    Music,
  palette:  Palette,
  camera:   Camera,
  // People / Community
  users:    Users,
  heart:    Heart,
  home:     Home,
  // Commerce
  shoppingbag: ShoppingBag,
  layers:   Layers,
  // Achievement
  star:     Star,
  award:    Award,
  trophy:   Trophy,
  target:   Target,
  // Knowledge
  bookopen: BookOpen,
  // Energy
  zap:      Zap,
  globe:    Globe,
}

// Ordered fallbacks used when icon name is empty or unknown
const FALLBACKS: LucideIcon[] = [Leaf, Music, Palette, BookOpen, Star, Heart, Users, Zap]

/**
 * Returns the Lucide component for a given icon name string (case-insensitive,
 * spaces/hyphens stripped). Falls back to a positional default if unknown.
 */
export function resolveIcon(name: string | undefined | null, fallbackIndex = 0): LucideIcon {
  if (name) {
    const key = name.toLowerCase().replace(/[-\s]/g, '')
    if (ICON_MAP[key]) return ICON_MAP[key]
  }
  return FALLBACKS[fallbackIndex % FALLBACKS.length]
}
