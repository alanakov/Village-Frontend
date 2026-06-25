import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUploadInput } from '@/components/ui/ImageUploadInput'
import { validateImageFile } from '@/utils/fileValidation'
import { contentService } from '@/services/contentService'
import { cardService } from '@/services/cardService'
import { imageService } from '@/services/imageService'
import { getApiErrorMessage } from '@/utils/helpers'
import toast from 'react-hot-toast'
import type { SectionConfig } from './sectionConfig'
import type { ContentType } from '@/types'

export type SubEntityType = 'content' | 'card' | 'image'

interface AddSubEntityModalProps {
  open: boolean
  onClose: () => void
  sectionId: number
  type: SubEntityType
  config: SectionConfig
  onCreated: () => void
}

export function AddSubEntityModal({
  open, onClose, sectionId, type, config, onCreated,
}: AddSubEntityModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Content
  const [contentText, setContentText] = useState('')

  // Card
  const [cardTitle,  setCardTitle]  = useState('')
  const [cardDesc,   setCardDesc]   = useState('')
  const [cardIcon,   setCardIcon]   = useState('')

  // Image
  const [imgAltText, setImgAltText] = useState('')
  const [imgFile,    setImgFile]    = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState('')

  const handleImgFileChange = (file: File) => {
    const v = validateImageFile(file)
    if (!v.valid) { toast.error(v.error ?? 'Arquivo inválido'); return }
    if (imgPreview) URL.revokeObjectURL(imgPreview)
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleImgClear = () => {
    if (imgPreview) URL.revokeObjectURL(imgPreview)
    setImgFile(null); setImgPreview('')
  }

  const resetAll = () => {
    setError('')
    setContentText('')
    setCardTitle(''); setCardDesc(''); setCardIcon('')
    setImgAltText(''); handleImgClear()
  }

  const handleClose = () => { resetAll(); onClose() }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (type === 'content') {
        if (!contentText.trim()) { setError('O texto é obrigatório'); return }
        await contentService.create({ type: 'P1' as ContentType, content: contentText, sectionId })
        toast.success('Texto adicionado!')
      } else if (type === 'card') {
        if (!cardTitle.trim() || !cardDesc.trim() || !cardIcon.trim()) {
          setError('Preencha todos os campos do card'); return
        }
        await cardService.create({ title: cardTitle, description: cardDesc, icon: cardIcon, sectionId })
        toast.success('Card adicionado!')
      } else if (type === 'image') {
        if (!imgFile)           { setError('Selecione um arquivo'); return }
        if (!imgAltText.trim()) { setError('Texto alternativo é obrigatório'); return }
        await imageService.create(imgAltText, sectionId, imgFile)
        toast.success('Imagem adicionada!')
      }
      onCreated()
      handleClose()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const titles: Record<SubEntityType, string> = {
    content: `Adicionar ${config.contents.label ?? 'Texto'}`,
    card:    'Adicionar Card',
    image:   'Adicionar Imagem',
  }

  return (
    <Modal open={open} onClose={handleClose} title={titles[type]} className="max-w-lg">
      <div className="space-y-4">

        {type === 'content' && (
          <Textarea
            label={config.contents.label ?? 'Texto'}
            rows={4}
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Escreva aqui..."
            required
          />
        )}

        {type === 'card' && (
          <>
            <Input label="Título" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} required />
            <Input
              label="Ícone"
              value={cardIcon}
              onChange={(e) => setCardIcon(e.target.value)}
              placeholder="ex: leaf, heart, star, users..."
              required
              hint="Identificador do ícone utilizado pelo site público"
            />
            <Textarea
              label={config.cards.subtitleLabel ?? 'Subtítulo'}
              rows={3}
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
              required
            />
          </>
        )}

        {type === 'image' && (
          <>
            <Input
              label="Texto alternativo (acessibilidade)"
              value={imgAltText}
              onChange={(e) => setImgAltText(e.target.value)}
              placeholder="Descrição da imagem..."
              required
            />
            <ImageUploadInput
              label="Arquivo (JPG / PNG, máx. 5 MB)"
              required
              previewUrl={imgPreview}
              fileName={imgFile?.name}
              disabled={loading}
              onFileChange={handleImgFileChange}
              onClear={handleImgClear}
            />
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 font-ui bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} loading={loading} className="flex-1">
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
