import {
  Home, BookOpen, BarChart2, Leaf,
  HelpCircle, ShoppingBag, Shield, Settings,
} from 'lucide-react'

export type SectionMeta = { Icon: React.ElementType; group: string; label: string }

export const SECTION_META: Record<string, SectionMeta> = {
  'Página Inicial':        { Icon: Home,       group: 'home',     label: 'Hero Principal'        },
  'Sobre Nós':             { Icon: BookOpen,    group: 'home',     label: 'Quem Somos'            },
  'Impacto Social':        { Icon: BarChart2,   group: 'home',     label: 'Impacto Social'        },
  'Identidade':            { Icon: Leaf,        group: 'historia', label: 'Identidade'            },
  'Valores':               { Icon: Leaf,        group: 'historia', label: 'Dimensões da Cultura'  },
  'Técnicas Tradicionais': { Icon: Leaf,        group: 'historia', label: 'Técnicas Tradicionais' },
  'Preserve':              { Icon: Leaf,        group: 'historia', label: 'Preserve'              },
  'Sobre os Produtos':     { Icon: ShoppingBag, group: 'produtos', label: 'Sobre os Produtos'     },
  'Dúvidas':               { Icon: HelpCircle,  group: 'geral',    label: 'Dúvidas'               },
  'Garantia':              { Icon: Shield,      group: 'geral',    label: 'Garantia'              },
}

export const DEFAULT_META: SectionMeta = { Icon: Settings, group: 'geral', label: 'Seção' }

export type PageGroupKey = 'home' | 'historia' | 'produtos' | 'geral'

export type PageGroup = {
  key: PageGroupKey
  label: string
  Icon: React.ElementType
}

export const PAGE_GROUPS: PageGroup[] = [
  { key: 'home',     label: 'Home',          Icon: Home        },
  { key: 'historia', label: 'Nossa História', Icon: BookOpen    },
  { key: 'produtos', label: 'Produtos',       Icon: ShoppingBag },
  { key: 'geral',    label: 'Geral',          Icon: HelpCircle  },
]
