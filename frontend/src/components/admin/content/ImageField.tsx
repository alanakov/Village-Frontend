import { useState } from 'react'
import toast from 'react-hot-toast'
import { imageService } from '@/services/imageService'
import { ImageUploadInput } from '@/components/ui/ImageUploadInput'
import { getApiErrorMessage } from '@/utils/helpers'
import { getUploadUrl } from '@/services/api'
import { validateImageFile } from '@/utils/fileValidation'
import type { SectionImage } from '@/types'

interface ImageFieldProps {
  item: SectionImage
  onUpdated: () => void
  disabled: boolean
}

export function ImageField({ item, onUpdated, disabled }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState('')

  const handleFileChange = (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error ?? 'Arquivo inválido.')
      return
    }
    if (localPreview) URL.revokeObjectURL(localPreview)
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
  }

  const handleClear = () => {
    if (localPreview) URL.revokeObjectURL(localPreview)
    setPendingFile(null)
    setLocalPreview('')
  }

  const handleSave = async () => {
    if (!pendingFile) return
    setUploading(true)
    try {
      await imageService.update(item.idImage, { altText: item.altText }, pendingFile)
      toast.success('Imagem atualizada!')
      handleClear()
      onUpdated()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const previewUrl = localPreview || getUploadUrl(item.imageUrl)

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl space-y-2">
      <p className="text-xs font-semibold text-[var(--muted-foreground)] font-ui truncate">
        {item.altText || `Imagem #${item.idImage}`}
      </p>
      <ImageUploadInput
        previewUrl={previewUrl}
        fileName={pendingFile?.name}
        disabled={uploading || disabled}
        onFileChange={handleFileChange}
        onClear={handleClear}
      />
      {pendingFile && !uploading && (
        <button
          onClick={handleSave}
          className="w-full py-1.5 text-xs font-semibold text-[var(--primary)] border border-[var(--primary)]/30 rounded-lg hover:bg-[var(--primary)]/5 transition-colors"
        >
          Salvar imagem
        </button>
      )}
    </div>
  )
}
