import { useState } from 'react'
import { Eye, Info } from 'lucide-react'
import { useSections } from '@/hooks/useSections'
import { Skeleton } from '@/components/ui/Skeleton'
import { SectionNav } from '@/components/admin/content/SectionNav'
import { SectionPanel } from '@/components/admin/content/SectionPanel'
import { GeneralSettingsPanel } from '@/components/admin/content/GeneralSettingsPanel'
import type { ActiveView } from '@/components/admin/content/types'

export function AdminContentManagement() {
  const { sections, loading, refetch } = useSections()
  const [activeView, setActiveView] = useState<ActiveView | null>(null)

  const resolvedView: ActiveView =
    activeView ?? (sections.length > 0 ? sections[0].idSection : 'general')

  const activeSection =
    typeof resolvedView === 'number'
      ? sections.find((s) => s.idSection === resolvedView) ?? null
      : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)]">Conteúdo</h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm mt-1">
            Gerencie os textos e dados exibidos no site público
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5 font-ui text-sm font-semibold transition-colors shrink-0"
        >
          <Eye className="w-4 h-4" /> Ver site público
        </a>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <aside className="w-64 shrink-0">
          <div className="sticky top-0 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <p className="font-display font-bold text-[var(--foreground)] text-sm">
                Gerenciador de Conteúdo
              </p>
              <p className="text-xs text-[var(--muted-foreground)] font-ui mt-0.5">
                Selecione uma seção para editar
              </p>
            </div>
            <div className="p-2">
              <SectionNav
                sections={sections}
                activeView={resolvedView}
                onSelect={setActiveView}
                onRefetch={refetch}
                loading={loading}
              />
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 pb-8">
          {loading && !activeSection && resolvedView !== 'general' ? (
            <div className="space-y-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : resolvedView === 'general' ? (
            <GeneralSettingsPanel />
          ) : activeSection ? (
            <SectionPanel
              key={activeSection.idSection}
              section={activeSection}
              onRefetch={refetch}
            />
          ) : (
            <div className="rounded-2xl bg-[var(--muted)] p-8 flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--muted-foreground)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[var(--foreground)] font-ui text-sm mb-1">
                  Nenhuma seção encontrada
                </p>
                <p className="text-sm text-[var(--muted-foreground)] font-ui">
                  As seções do site ainda não foram criadas no banco de dados. Use{' '}
                  <code className="bg-white px-1 py-0.5 rounded text-xs">POST /api/full/section</code>{' '}
                  para criá-las.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
