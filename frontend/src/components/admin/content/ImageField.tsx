import { useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { imageService } from '@/services/imageService'
import { ImageUploadInput } from '@/components/ui/ImageUploadInput'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
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
  const [altText, setAltText] = useState(item.altText)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    if (!pendingFile && altText === item.altText) return
    setUploading(true)
    try {
      await imageService.update(item.idImage, { altText }, pendingFile ?? undefined)
      toast.success('Imagem atualizada!')
      handleClear()
      onUpdated()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await imageService.delete(item.idImage)
      toast.success('Imagem excluída!')
      onUpdated()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const previewUrl = localPreview || getUploadUrl(item.imageUrl)
  const isDirty = !!pendingFile || altText !== item.altText

  return (
    <div className="p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)] space-y-2">
      {/* Alt text row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-[var(--muted-foreground)] font-ui">
            Texto alternativo
          </label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            disabled={uploading || disabled}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm font-ui focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          />
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={disabled || deleting || uploading}
          className="shrink-0 self-end p-1.5 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Excluir imagem"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image upload */}
      <ImageUploadInput
        previewUrl={previewUrl}
        fileName={pendingFile?.name}
        disabled={uploading || disabled}
        onFileChange={handleFileChange}
        onClear={handleClear}
      />

      {isDirty && !uploading && (
        <button
          onClick={handleSave}
          className="w-full py-1.5 text-xs font-semibold text-[var(--primary)] border border-[var(--primary)]/30 rounded-lg hover:bg-[var(--primary)]/5 transition-colors"
        >
          Salvar alterações
        </button>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir imagem"
        message="Tem certeza que deseja excluir esta imagem? O arquivo será removido do servidor."
        confirmLabel="Excluir"
        loading={deleting}
        danger
      />
    </div>
  )
}
