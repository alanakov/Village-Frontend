import { useState } from 'react'
import { RefreshCw, ChevronDown, ChevronRight, Settings } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/helpers'
import { SECTION_META, DEFAULT_META, PAGE_GROUPS } from './sectionMeta'
import type { Section } from '@/types'
import type { PageGroupKey, ActiveView } from './types'

interface SectionNavProps {
  sections: Section[]
  activeView: ActiveView
  onSelect: (view: ActiveView) => void
  onRefetch: () => void
  loading: boolean
}

export function SectionNav({ sections, activeView, onSelect, onRefetch, loading }: SectionNavProps) {
  const activeGroupKey: PageGroupKey | null = (() => {
    if (typeof activeView !== 'number') return null
    const section = sections.find((s) => s.idSection === activeView)
    if (!section) return null
    return (SECTION_META[section.name] ?? DEFAULT_META).group as PageGroupKey
  })()

  const [openGroups, setOpenGroups] = useState<Set<PageGroupKey>>(
    new Set([activeGroupKey ?? 'home'])
  )

  const toggleGroup = (key: PageGroupKey) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleSelectSection = (id: number) => {
    const section = sections.find((s) => s.idSection === id)
    if (section) {
      const groupKey = (SECTION_META[section.name] ?? DEFAULT_META).group as PageGroupKey
      setOpenGroups((prev) => new Set([...prev, groupKey]))
    }
    onSelect(id)
  }

  const groupedSections = PAGE_GROUPS.map((group) => ({
    ...group,
    items: sections.filter(
      (s) => (SECTION_META[s.name] ?? DEFAULT_META).group === group.key
    ),
  })).filter((g) => g.items.length > 0)

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pt-1 pb-2">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] font-ui uppercase tracking-wider">
            Páginas do site
          </span>
          <button
            onClick={onRefetch}
            className="p-1 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
            title="Recarregar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2 px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-10 rounded-xl" />
                <div className="pl-3 space-y-1">
                  <Skeleton className="h-8 rounded-lg" />
                  <Skeleton className="h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="px-3 py-3">
            <p className="text-xs text-[var(--muted-foreground)] font-ui italic">
              Nenhuma seção no banco.
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5 px-1">
            {groupedSections.map(({ key, label, Icon, items }) => {
              const isOpen = openGroups.has(key)
              const groupHasActiveChild = items.some((s) => s.idSection === activeView)

              return (
                <li key={key}>
                  <button
                    onClick={() => toggleGroup(key)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                      groupHasActiveChild
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4 shrink-0',
                      groupHasActiveChild ? 'text-[var(--primary)]' : 'text-[var(--primary)]/60'
                    )} />
                    <span className={cn(
                      'flex-1 text-sm font-semibold font-ui',
                      groupHasActiveChild ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'
                    )}>
                      {label}
                    </span>
                    <span className={cn(
                      'text-xs font-ui px-1.5 py-0.5 rounded-full',
                      groupHasActiveChild
                        ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    )}>
                      {items.length}
                    </span>
                    <ChevronDown className={cn(
                      'w-3.5 h-3.5 shrink-0 transition-transform duration-200',
                      isOpen ? 'rotate-180' : '',
                      groupHasActiveChild ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                    )} />
                  </button>

                  {isOpen && (
                    <ul className="mt-0.5 ml-3 pl-3 border-l-2 border-[var(--border)] space-y-0.5 pb-1">
                      {items.map((s) => {
                        const meta = SECTION_META[s.name] ?? DEFAULT_META
                        const { Icon: SIcon } = meta
                        const isActive = activeView === s.idSection
                        const totalItems =
                          (s.contents?.length ?? 0) +
                          (s.stats?.length    ?? 0) +
                          (s.cards?.length    ?? 0) +
                          (s.buttons?.length  ?? 0) +
                          (s.images?.length   ?? 0)

                        return (
                          <li key={s.idSection}>
                            <button
                              onClick={() => handleSelectSection(s.idSection)}
                              className={cn(
                                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group',
                                isActive
                                  ? 'bg-[var(--primary)] text-white'
                                  : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                              )}
                            >
                              <SIcon className={cn(
                                'w-3.5 h-3.5 shrink-0',
                                isActive ? 'text-white' : 'text-[var(--primary)]/70'
                              )} />
                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  'text-xs font-semibold font-ui truncate leading-tight',
                                  isActive ? 'text-white' : 'text-[var(--foreground)]'
                                )}>
                                  {meta.label}
                                </p>
                                {totalItems > 0 && (
                                  <p className={cn(
                                    'text-xs font-ui mt-0.5',
                                    isActive ? 'text-white/70' : 'text-[var(--muted-foreground)]'
                                  )}>
                                    {totalItems} elemento{totalItems !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className={cn(
                                'w-3 h-3 shrink-0 transition-transform',
                                isActive
                                  ? 'text-white'
                                  : 'text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                              )} />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-[var(--border)] my-3 mx-3" />

      <div className="px-1 pb-1">
        <button
          onClick={() => onSelect('general')}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group',
            activeView === 'general'
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
          )}
        >
          <Settings className={cn(
            'w-4 h-4 shrink-0',
            activeView === 'general' ? 'text-white' : 'text-[var(--primary)]/60'
          )} />
          <span className={cn(
            'flex-1 text-sm font-semibold font-ui',
            activeView === 'general' ? 'text-white' : 'text-[var(--foreground)]'
          )}>
            Configurações Gerais
          </span>
          <ChevronRight className={cn(
            'w-3.5 h-3.5 shrink-0',
            activeView === 'general'
              ? 'text-white'
              : 'text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all'
          )} />
        </button>
      </div>
    </nav>
  )
}
