import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Lock, Info } from 'lucide-react'
import { SECTION_CONFIGS, getConfig } from './sectionConfig'
import { getApiErrorMessage } from '@/utils/helpers'
import { SectionName } from '@/types'
import type { Section, CreateFullSectionDto } from '@/types'

interface CreateSectionModalProps {
  open: boolean
  onClose: () => void
  existingSections: Section[]
  onCreate: (dto: CreateFullSectionDto) => Promise<{ message: string; section: Section }>
}

export function CreateSectionModal({ open, onClose, existingSections, onCreate }: CreateSectionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [name, setName]       = useState<SectionName | ''>('')
  const [title, setTitle]     = useState('')
  const [subtitle, setSubtitle] = useState('')

  const usedNames    = existingSections.map((s) => s.name)
  const available    = SECTION_CONFIGS.filter((c) => !usedNames.includes(c.sectionName))
  const selectedConf = name ? getConfig(name) : undefined

  const reset = () => {
    setName(''); setTitle(''); setSubtitle(''); setError('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleCreate = async () => {
    if (!name) { setError('Selecione uma seção'); return }
    setLoading(true)
    setError('')
    try {
      const conf = getConfig(name)!
      const dto: CreateFullSectionDto = {
        section: {
          name,
          // Always send a title — use fixedTitle for non-editable sections
          title:    conf.titleEditable ? title.trim() : (conf.fixedTitle ?? ''),
          // Always send a subtitle — use fixedSubtitle for non-editable sections
          subtitle: conf.subtitleEditable ? subtitle.trim() : (conf.fixedSubtitle ?? ''),
        },
      }
      await onCreate(dto)
      handleClose()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nova Seção"
      className="max-w-lg"
    >
      <div className="space-y-5">

        {/* Section selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[var(--foreground)] font-ui">
            Seção <span className="text-[var(--destructive)]">*</span>
          </label>
          {available.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3 font-ui">
              Todas as {SECTION_CONFIGS.length} seções já foram criadas.
            </p>
          ) : (
            <>
              <select
                value={name}
                onChange={(e) => { setName(e.target.value as SectionName); setTitle(''); setSubtitle('') }}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-ui text-sm"
              >
                <option value="">Selecione...</option>
                {available.map((c) => (
                  <option key={c.sectionName} value={c.sectionName}>
                    {c.sectionName} — {c.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--muted-foreground)] font-ui">
                {usedNames.length} de {SECTION_CONFIGS.length} seções criadas ·{' '}
                {available.length} disponível{available.length !== 1 ? 'is' : ''}
              </p>
            </>
          )}
        </div>

        {/* Preview of what will be created */}
        {selectedConf && (
          <div className="rounded-xl bg-[var(--muted)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" />
              <div className="text-xs text-[var(--muted-foreground)] font-ui space-y-1">
                <p className="font-semibold text-[var(--foreground)]">{selectedConf.description}</p>
                <p>
                  Conteúdo permitido:{' '}
                  <span className="font-medium text-[var(--foreground)]">
                    {[
                      selectedConf.contents.allowed && `textos${selectedConf.contents.max ? ` (máx. ${selectedConf.contents.max})` : ''}`,
                      selectedConf.cards.allowed    && `cards (${selectedConf.cards.min ?? 0}–${selectedConf.cards.max ?? '∞'})`,
                      selectedConf.images.allowed   && `imagens${selectedConf.images.max ? ` (máx. ${selectedConf.images.max})` : ''}`,
                    ].filter(Boolean).join(', ') || 'nenhum campo adicional'}
                  </span>
                </p>
                {selectedConf.buttons === 'fixed' && (
                  <p>Botões fixos: {selectedConf.fixedButtonLabels?.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Title field */}
        {selectedConf?.titleEditable && (
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da seção"
            required
          />
        )}
        {selectedConf && !selectedConf.titleEditable && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] font-ui flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Título (fixo)
            </label>
            <p className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-sm font-ui text-[var(--muted-foreground)]">
              {selectedConf.fixedTitle}
            </p>
          </div>
        )}

        {/* Subtitle field */}
        {selectedConf?.subtitleEditable && (
          <Textarea
            label="Subtítulo"
            rows={2}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtítulo da seção"
          />
        )}
        {selectedConf?.fixedSubtitle && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] font-ui flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Subtítulo (fixo)
            </label>
            <p className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-sm font-ui text-[var(--muted-foreground)]">
              {selectedConf.fixedSubtitle}
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-600 font-ui bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleCreate}
            loading={loading}
            disabled={!name || available.length === 0}
            className="flex-1"
          >
            Criar seção
          </Button>
        </div>
      </div>
    </Modal>
  )
}
