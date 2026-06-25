import {
  Home, BookOpen, Layers, BarChart2,
  Leaf, LayoutGrid, Camera, ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { SectionName } from '@/types'

// ─── Config type ──────────────────────────────────────────────────────────────

export interface SectionFieldConfig {
  allowed: boolean
  /** Max number of items. undefined = unlimited */
  max?: number
  /** Min number of items (for required fields like cards) */
  min?: number
}

export interface SectionConfig {
  sectionName: SectionName
  displayLabel: string
  group: 'home' | 'historia' | 'artesanato'
  Icon: LucideIcon
  description: string

  // ── Title / Subtitle ───────────────────────────────────────────────────────
  /** false = title is fixed, admin cannot edit */
  titleEditable: boolean
  fixedTitle?: string
  subtitleEditable: boolean
  fixedSubtitle?: string

  // ── Sub-entities ───────────────────────────────────────────────────────────
  contents: SectionFieldConfig & { label: string }
  cards:    SectionFieldConfig & { subtitleLabel: string }
  images:   SectionFieldConfig
  stats:    SectionFieldConfig

  // ── Buttons ────────────────────────────────────────────────────────────────
  /** 'none' = no buttons; 'fixed' = hardcoded labels, shown for info only */
  buttons: 'none' | 'fixed'
  fixedButtonLabels?: string[]
}

// ─── Config table ─────────────────────────────────────────────────────────────

export const SECTION_CONFIGS: SectionConfig[] = [

  // ── HOME ──────────────────────────────────────────────────────────────────

  {
    sectionName: SectionName.home,
    displayLabel: 'Principal',
    group: 'home',
    Icon: Home,
    description: 'Banner principal da página inicial.',
    titleEditable:    true,
    subtitleEditable: true,
    contents: { allowed: false, label: 'Parágrafos' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'fixed',
    fixedButtonLabels: ['Conheça o Artesanato', 'Nossa História'],
  },

  {
    sectionName: SectionName.aboutUs,
    displayLabel: 'Quem Somos',
    group: 'home',
    Icon: BookOpen,
    description: 'Seção de apresentação da comunidade.',
    titleEditable:    false,
    fixedTitle:       'Quem Somos?',
    subtitleEditable: true,
    contents: { allowed: true, label: 'Parágrafos' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: true, max: 1 },
    stats:    { allowed: false },
    buttons:  'fixed',
    fixedButtonLabels: ['Conheça Nossa Cultura'],
  },

  {
    sectionName: SectionName.featuredCraft,
    displayLabel: 'Artesanato em Destaque',
    group: 'home',
    Icon: Layers,
    description: 'Apresenta os produtos artesanais em destaque.',
    titleEditable:    false,
    fixedTitle:       'Artesanato em Destaque',
    subtitleEditable: true,
    contents: { allowed: false, label: 'Parágrafos' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'fixed',
    fixedButtonLabels: ['Ver Todos os Artesanatos'],
  },

  {
    sectionName: SectionName.socialImpact,
    displayLabel: 'Impacto Social',
    group: 'home',
    Icon: BarChart2,
    description: 'Exibe 3 cards com o impacto social da comunidade.',
    titleEditable:    false,
    fixedTitle:       'Impacto Social',
    subtitleEditable: true,
    contents: { allowed: false, label: 'Parágrafos' },
    cards:    { allowed: true, min: 3, max: 3, subtitleLabel: 'Subtítulo do card' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'fixed',
    fixedButtonLabels: ['Conheça Mais Sobre Nossa Cultura'],
  },

  // ── NOSSA HISTÓRIA ────────────────────────────────────────────────────────

  {
    sectionName: SectionName.identity,
    displayLabel: 'Identidade',
    group: 'historia',
    Icon: Leaf,
    description: 'Texto principal de identidade cultural (até 4 parágrafos).',
    titleEditable:    true,
    subtitleEditable: true,
    contents: { allowed: true, max: 4, label: 'Parágrafos' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'none',
  },

  {
    sectionName: SectionName.cultureDimensions,
    displayLabel: 'Dimensões da Nossa Cultura',
    group: 'historia',
    Icon: LayoutGrid,
    description: 'Exibe exatamente 4 cards com dimensões culturais.',
    titleEditable:    false,
    fixedTitle:       'Dimensões da Nossa Cultura',
    subtitleEditable: false,
    contents: { allowed: false, label: 'Parágrafos' },
    cards:    { allowed: true, min: 4, max: 4, subtitleLabel: 'Subtítulo do card' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'none',
  },

  {
    sectionName: SectionName.communityMoments,
    displayLabel: 'Momentos da Nossa Comunidade',
    group: 'historia',
    Icon: Camera,
    description: 'Galeria de fotos da comunidade (até 8 imagens).',
    titleEditable:    false,
    fixedTitle:       'Momentos da Nossa Comunidade',
    subtitleEditable: false,
    contents: { allowed: false, label: 'Parágrafos' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: true, max: 8 },
    stats:    { allowed: false },
    buttons:  'none',
  },

  // ── ARTESANATO ────────────────────────────────────────────────────────────

  {
    sectionName: SectionName.crafts,
    displayLabel: 'Artesanato',
    group: 'artesanato',
    Icon: ShoppingBag,
    description: 'Descrição dos produtos artesanais (1 parágrafo).',
    titleEditable:    false,
    fixedTitle:       'Artesanato',
    subtitleEditable: false,
    fixedSubtitle:    'Sobre os Produtos',
    contents: { allowed: true, max: 1, label: 'Descrição (1 parágrafo)' },
    cards:    { allowed: false, subtitleLabel: 'Subtítulo' },
    images:   { allowed: false },
    stats:    { allowed: false },
    buttons:  'none',
  },
]

export const SECTION_CONFIG_MAP: Record<string, SectionConfig> = Object.fromEntries(
  SECTION_CONFIGS.map((c) => [c.sectionName, c])
)

export function getConfig(sectionName: string): SectionConfig | undefined {
  return SECTION_CONFIG_MAP[sectionName]
}

// ─── Group metadata ───────────────────────────────────────────────────────────

export type PageGroupKey = 'home' | 'historia' | 'artesanato'

export interface PageGroup {
  key: PageGroupKey
  label: string
  Icon: LucideIcon
}

export const PAGE_GROUPS: PageGroup[] = [
  { key: 'home',      label: 'Início',          Icon: Home      },
  { key: 'historia',  label: 'Nossa História',   Icon: BookOpen  },
  { key: 'artesanato',label: 'Artesanato',       Icon: ShoppingBag },
]

// Keep sectionMeta-compatible exports for backward compat (SectionNav etc.)
export type SectionMeta = Pick<SectionConfig, 'Icon' | 'group' | 'displayLabel'>
export const SECTION_META: Record<string, SectionMeta> = Object.fromEntries(
  SECTION_CONFIGS.map((c) => [c.sectionName, { Icon: c.Icon, group: c.group, label: c.displayLabel }])
)
export const DEFAULT_META: SectionMeta = { Icon: Home, group: 'home', displayLabel: 'Seção' }
