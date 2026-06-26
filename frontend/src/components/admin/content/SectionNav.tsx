import { useState } from 'react'
import { RefreshCw, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/helpers'
import { getConfig, PAGE_GROUPS, SECTION_CONFIGS } from './sectionConfig'
import type { PageGroupKey } from './sectionConfig'
import type { Section } from '@/types'
import type { ActiveView } from './types'

interface SectionNavProps {
  sections: Section[]
  activeView: ActiveView | null
  onSelect: (view: ActiveView) => void
  onRefetch: () => void
  onCreateSection: () => void
  loading: boolean
}

export function SectionNav({
  sections, activeView, onSelect, onRefetch, onCreateSection, loading,
}: SectionNavProps) {
  const activeGroupKey: PageGroupKey | null = (() => {
    if (typeof activeView !== 'number') return null
    const s = sections.find((s) => s.idSection === activeView)
    return s ? (getConfig(s.name)?.group as PageGroupKey ?? null) : null
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

  const handleSelect = (id: number) => {
    const s = sections.find((s) => s.idSection === id)
    if (s) {
      const gk = getConfig(s.name)?.group as PageGroupKey | undefined
      if (gk) setOpenGroups((prev) => new Set([...prev, gk]))
    }
    onSelect(id)
  }

  const MAX = SECTION_CONFIGS.length
  const canCreate = sections.length < MAX

  const groupedSections = PAGE_GROUPS.map((group) => ({
    ...group,
    items: sections.filter((s) => getConfig(s.name)?.group === group.key),
  })).filter((g) => g.items.length > 0)

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pt-1 pb-2">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] font-ui uppercase tracking-wider">
            Páginas
          </span>
          <div className="flex items-center gap-1">
            {canCreate && (
              <button onClick={onCreateSection} title="Nova seção" className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--primary)] transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={onRefetch} title="Recarregar" className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-10 rounded-xl" />
                <div className="pl-3 space-y-1">
                  <Skeleton className="h-8 rounded-lg" /><Skeleton className="h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="px-3 py-3 space-y-2">
            <p className="text-xs text-[var(--muted-foreground)] font-ui italic">Nenhuma seção criada.</p>
            <button
              onClick={onCreateSection}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-dashed border-[var(--primary)]/30 text-[var(--primary)] text-xs font-semibold font-ui hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Criar primeira seção
            </button>
          </div>
        ) : (
          <ul className="space-y-0.5 px-1">
            {groupedSections.map(({ key, label, Icon, items }) => {
              const isOpen = openGroups.has(key)
              const groupActive = items.some((s) => s.idSection === activeView)
              return (
                <li key={key}>
                  <button
                    onClick={() => toggleGroup(key)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                      groupActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', groupActive ? 'text-[var(--primary)]' : 'text-[var(--primary)]/60')} />
                    <span className={cn('flex-1 text-sm font-semibold font-ui', groupActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]')}>
                      {label}
                    </span>
                    <span className={cn('text-xs font-ui px-1.5 py-0.5 rounded-full', groupActive ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]')}>
                      {items.length}
                    </span>
                    <ChevronDown className={cn('w-3.5 h-3.5 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180' : '')} />
                  </button>

                  {isOpen && (
                    <ul className="mt-0.5 ml-3 pl-3 border-l-2 border-[var(--border)] space-y-0.5 pb-1">
                      {items.map((s) => {
                        const conf = getConfig(s.name)
                        const isActive = activeView === s.idSection
                        const totalItems = (s.contents?.length ?? 0) + (s.cards?.length ?? 0) + (s.images?.length ?? 0)
                        return (
                          <li key={s.idSection}>
                            <button
                              onClick={() => handleSelect(s.idSection)}
                              className={cn(
                                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group',
                                isActive ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                              )}
                            >
                              {conf && <conf.Icon className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-white' : 'text-[var(--primary)]/70')} />}
                              <div className="min-w-0 flex-1">
                                <p className={cn('text-xs font-semibold font-ui truncate', isActive ? 'text-white' : 'text-[var(--foreground)]')}>
                                  {conf?.displayLabel ?? s.name}
                                </p>
                                <p className={cn('text-xs font-ui', isActive ? 'text-white/70' : 'text-[var(--muted-foreground)]')}>
                                  {totalItems > 0 ? `${totalItems} elemento${totalItems !== 1 ? 's' : ''}` : 'Sem conteúdo'}
                                </p>
                              </div>
                              <ChevronRight className={cn('w-3 h-3 shrink-0', isActive ? 'text-white' : 'text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-all')} />
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

      <div className="border-t border-[var(--border)] mx-3 my-3" />
      <div className="px-4 pb-3">
        <p className="text-xs text-[var(--muted-foreground)] font-ui">
          <span className="font-semibold text-[var(--foreground)]">{sections.length}</span> de {MAX} seções criadas
        </p>
        <div className="mt-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${(sections.length / MAX) * 100}%` }} />
        </div>
      </div>
    </nav>
  )
}
