import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ImageIcon, Type, LayoutGrid, Info,
  Pencil, Trash2, Check, X, Lock, Plus,
} from 'lucide-react'
import { contentService } from '@/services/contentService'
import { cardService } from '@/services/cardService'
import { imageService } from '@/services/imageService'
import { sectionService } from '@/services/sectionService'
import { getApiErrorMessage } from '@/utils/helpers'
import { getConfig, PAGE_GROUPS } from './sectionConfig'
import { ContentField } from './ContentField'
import { CardField } from './CardField'
import { ImageField } from './ImageField'
import { AddSubEntityModal } from './AddSubEntityModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import type { Section, ContentType } from '@/types'
import type { SubEntityType } from './AddSubEntityModal'

interface SectionPanelProps {
  section: Section
  onRefetch: () => void
  onDeleted: (id: number) => void
}

export function SectionPanel({ section, onRefetch, onDeleted }: SectionPanelProps) {
  const config = getConfig(section.name)
  const [saving, setSaving] = useState(false)

  // Header editing
  const [editingHeader, setEditingHeader] = useState(false)
  const [editTitle, setEditTitle]         = useState(section.title ?? '')
  const [editSubtitle, setEditSubtitle]   = useState(section.subtitle ?? '')
  const [savingHeader, setSavingHeader]   = useState(false)

  // Delete section
  const [confirmDelete, setConfirmDelete]   = useState(false)
  const [deletingSection, setDeletingSection] = useState(false)

  // Add sub-entity
  const [addModal, setAddModal] = useState<SubEntityType | null>(null)

  if (!config) {
    return (
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
        <p className="font-ui text-amber-800 text-sm">
          Configuração não encontrada para a seção "{section.name}". Verifique o sectionConfig.ts.
        </p>
      </div>
    )
  }

  const GroupIcon = PAGE_GROUPS.find((g) => g.key === config.group)?.Icon ?? Info
  const groupLabel = PAGE_GROUPS.find((g) => g.key === config.group)?.label ?? config.group

  const contentCount = section.contents?.length ?? 0
  const cardCount    = section.cards?.length    ?? 0
  const imageCount   = section.images?.length   ?? 0

  const canAddContent = config.contents.allowed &&
    (config.contents.max === undefined || contentCount < config.contents.max)
  const canAddCard  = config.cards.allowed &&
    (config.cards.max === undefined || cardCount < config.cards.max)
  const canAddImage = config.images.allowed &&
    (config.images.max === undefined || imageCount < config.images.max)

  // ── Handlers ─────────────────────────────────────────────────────────────

  const wrap = async (fn: () => Promise<void>) => {
    setSaving(true)
    try { await fn() }
    catch (err) { toast.error(getApiErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const handleSaveContent = (id: number, text: string, type: string) =>
    wrap(async () => {
      await contentService.update(id, { type: type as ContentType, content: text })
      toast.success('Texto salvo!')
      onRefetch()
    })

  const handleDeleteContent = async (id: number) => {
    await contentService.delete(id)
    toast.success('Texto excluído!')
    onRefetch()
  }

  const handleSaveCard = (id: number, title: string, description: string, icon: string) =>
    wrap(async () => {
      await cardService.update(id, { title, description, icon })
      toast.success('Card salvo!')
      onRefetch()
    })

  const handleDeleteCard = async (id: number) => {
    try {
      await cardService.delete(id)
      toast.success('Card excluído!')
      onRefetch()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleSaveHeader = async () => {
    if (config.titleEditable && !editTitle.trim()) {
      toast.error('Título não pode ser vazio'); return
    }
    setSavingHeader(true)
    try {
      const dto: { title?: string; subtitle?: string } = {}
      if (config.titleEditable)    dto.title    = editTitle.trim()
      if (config.subtitleEditable) dto.subtitle = editSubtitle.trim()
      await sectionService.update(section.idSection, dto)
      toast.success('Seção atualizada!')
      onRefetch()
      setEditingHeader(false)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setSavingHeader(false)
    }
  }

  const handleDeleteSection = async () => {
    setDeletingSection(true)
    try {
      await sectionService.delete(section.idSection)
      toast.success(`Seção "${section.name}" excluída!`)
      onDeleted(section.idSection)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setDeletingSection(false)
      setConfirmDelete(false)
    }
  }

  const canEditAnything = config.titleEditable || config.subtitleEditable

  return (
    <div className="space-y-5">

      {/* ── Section header card ───────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[var(--primary)]/8 border border-[var(--primary)]/20 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center shrink-0 mt-0.5">
            <config.Icon className="w-5 h-5 text-[var(--primary)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[var(--primary)]/70 font-ui uppercase tracking-wider">
                {groupLabel}
              </span>
              <span className="text-xs text-[var(--muted-foreground)] font-ui">·</span>
              <span className="text-xs text-[var(--muted-foreground)] font-ui">{config.description}</span>
            </div>
            <h2 className="font-display font-bold text-[var(--foreground)] text-xl leading-tight mt-1">
              {config.fixedTitle ?? section.title}
            </h2>

            {editingHeader ? (
              <div className="mt-3 space-y-2">
                {config.titleEditable && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Título</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      disabled={savingHeader}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--primary)]/40 bg-white text-sm font-ui focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                    />
                  </div>
                )}
                {config.subtitleEditable && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">Subtítulo</label>
                    <input
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      disabled={savingHeader}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--primary)]/40 bg-white text-sm font-ui focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveHeader}
                    loading={savingHeader}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {savingHeader ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditTitle(section.title ?? ''); setEditSubtitle(section.subtitle ?? ''); setEditingHeader(false) }}
                    disabled={savingHeader}
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1.5 space-y-0.5">
                {config.fixedSubtitle ? (
                  <p className="text-sm text-[var(--muted-foreground)] font-ui flex items-center gap-1">
                    <Lock className="w-3 h-3 shrink-0" />
                    {config.fixedSubtitle}
                  </p>
                ) : section.subtitle ? (
                  <p className="text-sm text-[var(--muted-foreground)] font-ui">{section.subtitle}</p>
                ) : config.subtitleEditable ? (
                  <p className="text-sm text-[var(--muted-foreground)] font-ui italic">Sem subtítulo — clique em editar para adicionar</p>
                ) : null}
              </div>
            )}
          </div>

          {!editingHeader && (
            <div className="flex items-center gap-1 shrink-0">
              {canEditAnything && (
                <button
                  onClick={() => { setEditTitle(section.title ?? ''); setEditSubtitle(section.subtitle ?? ''); setEditingHeader(true) }}
                  title="Editar título / subtítulo"
                  className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                title="Excluir seção"
                className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed buttons info ─────────────────────────────────────────────── */}
      {config.buttons === 'fixed' && config.fixedButtonLabels && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <Lock className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Botões (fixos)</span>
            <span className="text-xs text-[var(--muted-foreground)] font-ui ml-1">não editáveis</span>
          </div>
          <div className="p-5 flex flex-wrap gap-2">
            {config.fixedButtonLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm font-ui text-[var(--muted-foreground)]"
              >
                <Lock className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Contents ──────────────────────────────────────────────────────── */}
      {config.contents.allowed && (
        <SubEntityBlock
          icon={<Type className="w-4 h-4 text-[var(--primary)]" />}
          label={config.contents.label ?? 'Textos'}
          count={contentCount}
          limit={config.contents.max}
          canAdd={canAddContent}
          onAdd={() => setAddModal('content')}
        >
          {section.contents?.map((c) => (
            <ContentField
              key={c.idContent}
              item={c}
              onSave={handleSaveContent}
              onDelete={handleDeleteContent}
              disabled={saving}
            />
          ))}
        </SubEntityBlock>
      )}

      {/* ── Cards ─────────────────────────────────────────────────────────── */}
      {config.cards.allowed && (
        <SubEntityBlock
          icon={<LayoutGrid className="w-4 h-4 text-[var(--primary)]" />}
          label="Cards"
          count={cardCount}
          limit={config.cards.max}
          minRequired={config.cards.min}
          canAdd={canAddCard}
          onAdd={() => setAddModal('card')}
        >
          {section.cards?.map((c) => (
            <CardField
              key={c.idCard}
              item={c}
              subtitleLabel={config.cards.subtitleLabel}
              onSave={handleSaveCard}
              onDelete={handleDeleteCard}
              disabled={saving}
              canDelete={(cardCount ?? 0) > (config.cards.min ?? 0)}
            />
          ))}
        </SubEntityBlock>
      )}

      {/* ── Images ────────────────────────────────────────────────────────── */}
      {config.images.allowed && (
        <SubEntityBlock
          icon={<ImageIcon className="w-4 h-4 text-[var(--primary)]" />}
          label="Imagens"
          count={imageCount}
          limit={config.images.max}
          canAdd={canAddImage}
          onAdd={() => setAddModal('image')}
        >
          {section.images?.map((img) => (
            <ImageField key={img.idImage} item={img} onUpdated={onRefetch} disabled={saving} />
          ))}
        </SubEntityBlock>
      )}

      {/* ── Add modal ─────────────────────────────────────────────────────── */}
      {addModal && (
        <AddSubEntityModal
          open={true}
          onClose={() => setAddModal(null)}
          sectionId={section.idSection}
          type={addModal}
          config={config}
          onCreated={() => { setAddModal(null); onRefetch() }}
        />
      )}

      {/* ── Delete section confirm ─────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteSection}
        title="Excluir seção"
        message={`Excluir "${section.name}" é irreversível. Todo o conteúdo vinculado será permanentemente removido.`}
        confirmLabel="Excluir seção"
        loading={deletingSection}
        danger
      />
    </div>
  )
}

// ── SubEntityBlock ────────────────────────────────────────────────────────────

function SubEntityBlock({
  icon, label, count, limit, minRequired, canAdd, onAdd, children,
}: {
  icon: React.ReactNode
  label: string
  count: number
  limit?: number
  minRequired?: number
  canAdd: boolean
  onAdd: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
        {icon}
        <span className="text-sm font-semibold text-[var(--foreground)] font-ui">{label}</span>
        <span className="text-xs text-[var(--muted-foreground)] font-ui">
          {count}{limit !== undefined ? `/${limit}` : ''}
          {minRequired !== undefined ? ` (mín. ${minRequired})` : ''}
        </span>
        {canAdd && (
          <button
            onClick={onAdd}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-[var(--primary)] font-ui hover:underline transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
        )}
        {!canAdd && limit !== undefined && count >= limit && (
          <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui flex items-center gap-1">
            <Lock className="w-3 h-3" /> Limite atingido
          </span>
        )}
      </div>
      {count > 0 && <div className="p-5 space-y-3">{children}</div>}
    </div>
  )
}
