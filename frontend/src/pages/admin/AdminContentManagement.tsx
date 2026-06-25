import { useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { useSections } from '@/hooks/useSections'
import { Skeleton } from '@/components/ui/Skeleton'
import { SectionNav } from '@/components/admin/content/SectionNav'
import { SectionPanel } from '@/components/admin/content/SectionPanel'
import { GeneralSettingsPanel } from '@/components/admin/content/GeneralSettingsPanel'
import { CreateSectionModal } from '@/components/admin/content/CreateSectionModal'
import type { ActiveView } from '@/components/admin/content/types'

export function AdminContentManagement() {
  const {
    sections,
    loading,
    refetch,
    createFull,
    deleteSection,
  } = useSections()

  const [activeView, setActiveView] = useState<ActiveView | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Resolve what's currently displayed
  const resolvedView: ActiveView =
    activeView ?? (sections.length > 0 ? sections[0].idSection : 'general')

  const activeSection =
    typeof resolvedView === 'number'
      ? sections.find((s) => s.idSection === resolvedView) ?? null
      : null

  // When a section is deleted, clear selection if it was active
  const handleSectionDeleted = (deletedId: number) => {
    deleteSection(deletedId)
    if (resolvedView === deletedId) {
      const remaining = sections.filter((s) => s.idSection !== deletedId)
      setActiveView(remaining.length > 0 ? remaining[0].idSection : 'general')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)]">Conteúdo</h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm mt-1">
            Gerencie os textos e dados exibidos no site público
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={sections.length >= 10}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-ui text-sm font-semibold hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Nova seção
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5 font-ui text-sm font-semibold transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver site público
          </a>
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────── */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar nav */}
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
                onCreateSection={() => setShowCreateModal(true)}
                loading={loading}
              />
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0 pb-8">
          {loading && sections.length === 0 ? (
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
              onDeleted={handleSectionDeleted}
            />
          ) : (
            /* No sections at all */
            <div className="rounded-2xl border-2 border-dashed border-[var(--border)] p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <div>
                <p className="font-display font-bold text-[var(--foreground)] text-xl mb-1">
                  Nenhuma seção criada
                </p>
                <p className="text-sm text-[var(--muted-foreground)] font-ui max-w-sm">
                  Crie a primeira seção do site para começar a gerenciar o conteúdo. O sistema suporta até 10 seções distintas.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-ui text-sm font-semibold hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Criar primeira seção
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Create section modal ──────────────────────────────────────── */}
      <CreateSectionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        existingSections={sections}
        onCreate={async (dto) => {
          const result = await createFull(dto)
          setShowCreateModal(false)
          setActiveView(result.section.idSection)
          return result
        }}
      />
    </div>
  )
}
