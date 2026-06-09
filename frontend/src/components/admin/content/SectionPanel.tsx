import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Info,
  ImageIcon, Type, BarChart2, MousePointerClick, LayoutGrid,
} from 'lucide-react'
import { contentService } from '@/services/contentService'
import { statsService } from '@/services/statsService'
import { buttonService } from '@/services/buttonService'
import { cardService } from '@/services/cardService'
import { getApiErrorMessage } from '@/utils/helpers'
import { ContentField } from './ContentField'
import { StatField } from './StatField'
import { ButtonField } from './ButtonField'
import { CardField } from './CardField'
import { ImageField } from './ImageField'
import { SECTION_META, DEFAULT_META, PAGE_GROUPS } from './sectionMeta'
import type { Section } from '@/types'
import type { ContentType } from '@/types'

interface SectionPanelProps {
  section: Section
  onRefetch: () => void
}

export function SectionPanel({ section, onRefetch }: SectionPanelProps) {
  const [saving, setSaving] = useState(false)
  const meta = SECTION_META[section.name] ?? DEFAULT_META
  const { Icon } = meta

  const hasContents = (section.contents?.length ?? 0) > 0
  const hasStats    = (section.stats?.length   ?? 0) > 0
  const hasButtons  = (section.buttons?.length ?? 0) > 0
  const hasCards    = (section.cards?.length   ?? 0) > 0
  const hasImages   = (section.images?.length  ?? 0) > 0
  const hasAnything = hasContents || hasStats || hasButtons || hasCards || hasImages

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
    })

  const handleSaveStat = (id: number, title: string, value: string) =>
    wrap(async () => {
      await statsService.update(id, { title, value })
      toast.success('Estatística salva!')
    })

  const handleSaveButton = (id: number, label: string, link: string) =>
    wrap(async () => {
      await buttonService.update(id, { label, link })
      toast.success('Botão salvo!')
    })

  const handleSaveCard = (id: number, title: string, description: string, icon: string) =>
    wrap(async () => {
      await cardService.update(id, { title, description, icon })
      toast.success('Card salvo!')
    })

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[var(--primary)]/8 border border-[var(--primary)]/20 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-[var(--primary)]/70 font-ui uppercase tracking-wider">
              {PAGE_GROUPS.find((g) => g.key === meta.group)?.label ?? meta.group}
            </span>
          </div>
          <h2 className="font-display font-bold text-[var(--foreground)] text-xl leading-tight">
            {meta.label}
          </h2>
          {section.title && (
            <p className="text-sm text-[var(--foreground)] font-ui mt-1 font-medium">{section.title}</p>
          )}
          {section.subtitle && (
            <p className="text-sm text-[var(--muted-foreground)] font-ui mt-0.5">{section.subtitle}</p>
          )}
        </div>
      </div>

      {!hasAnything && (
        <div className="rounded-2xl bg-[var(--muted)] p-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--muted-foreground)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)] font-ui mb-1">
              Nenhum conteúdo cadastrado nesta seção
            </p>
            <p className="text-sm text-[var(--muted-foreground)] font-ui">
              Adicione textos, cards, imagens, botões ou estatísticas via{' '}
              <code className="bg-white px-1 py-0.5 rounded text-xs">POST /api/full/section</code>.
            </p>
          </div>
        </div>
      )}

      {hasContents && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <Type className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Textos</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui">
              {section.contents!.length} item{section.contents!.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-5 space-y-4">
            {section.contents!.map((c) => (
              <ContentField key={c.idContent} item={c} onSave={handleSaveContent} disabled={saving} />
            ))}
          </div>
        </div>
      )}

      {hasStats && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <BarChart2 className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Estatísticas</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui">
              {section.stats!.length} item{section.stats!.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {section.stats!.map((s) => (
              <StatField key={s.idStat} item={s} onSave={handleSaveStat} disabled={saving} />
            ))}
          </div>
        </div>
      )}

      {hasButtons && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <MousePointerClick className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Botões</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui">
              {section.buttons!.length} item{section.buttons!.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {section.buttons!.map((b) => (
              <ButtonField key={b.idButton} item={b} onSave={handleSaveButton} disabled={saving} />
            ))}
          </div>
        </div>
      )}

      {hasCards && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <LayoutGrid className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Cards</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui">
              {section.cards!.length} item{section.cards!.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {section.cards!.map((c) => (
              <CardField key={c.idCard} item={c} onSave={handleSaveCard} disabled={saving} />
            ))}
          </div>
        </div>
      )}

      {hasImages && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <ImageIcon className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Imagens</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)] font-ui">
              {section.images!.length} item{section.images!.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {section.images!.map((img) => (
              <ImageField key={img.idImage} item={img} onUpdated={onRefetch} disabled={saving} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
