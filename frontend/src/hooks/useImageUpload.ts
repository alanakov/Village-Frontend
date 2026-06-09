import { useState, useCallback, useRef } from 'react'
import { imageService } from '@/services/imageService'
import { sectionService } from '@/services/sectionService'
import { validateImageFile, createLocalPreview } from '@/utils/fileValidation'
import { getUploadUrl } from '@/services/api'
import type { SectionName } from '@/types'

export function useImageUpload(anchorSectionName: SectionName) {
  const [pendingFile, setPendingFile]   = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string>('')
  const [resolvedUrl, setResolvedUrl]   = useState<string>('')
  const [uploading, setUploading]       = useState(false)
  const [error, setError]               = useState<string>('')

  const localPreviewRef = useRef<string>('')

  const revokeLocalPreview = () => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current)
      localPreviewRef.current = ''
    }
  }

  const resolveSectionId = async (): Promise<number> => {
    const sections = await sectionService.getAll()
    const section = sections.find((s) => s.name === anchorSectionName)
    if (!section) {
      throw new Error(
        `A seção "${anchorSectionName}" ainda não existe no banco de dados. ` +
        `Acesse Conteúdo → crie a seção "${anchorSectionName}" para habilitar o upload de imagens de produto.`
      )
    }
    return section.idSection
  }

  const initWithUrl = useCallback((url: string) => {
    revokeLocalPreview()
    setPendingFile(null)
    setLocalPreview('')
    setResolvedUrl(url)
    setError('')
  }, [])

  const selectFile = useCallback((file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error ?? 'Arquivo inválido.')
      return
    }
    revokeLocalPreview()
    const preview = createLocalPreview(file)
    localPreviewRef.current = preview
    setPendingFile(file)
    setLocalPreview(preview)
    setResolvedUrl('')
    setError('')
  }, [])

  const clearImage = useCallback(() => {
    revokeLocalPreview()
    setPendingFile(null)
    setLocalPreview('')
    setResolvedUrl('')
    setError('')
  }, [])

  const reset = useCallback(() => {
    revokeLocalPreview()
    setPendingFile(null)
    setLocalPreview('')
    setResolvedUrl('')
    setError('')
    setUploading(false)
  }, [])

  const markRequired = useCallback(() => {
    setError('Selecione uma imagem para o produto.')
  }, [])

  const resolveImageUrl = useCallback(
    async (altText: string): Promise<string> => {
      if (resolvedUrl && !pendingFile) return resolvedUrl

      if (!pendingFile) {
        const msg = 'Selecione uma imagem.'
        setError(msg)
        throw new Error(msg)
      }

      setUploading(true)
      setError('')

      try {
        const sectionId = await resolveSectionId()
        const result = await imageService.create(altText || 'Imagem', sectionId, pendingFile)
        const url = result.imageUrl
        setResolvedUrl(url)
        setPendingFile(null)
        return url
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Falha no upload da imagem.'
        setError(msg)
        throw err
      } finally {
        setUploading(false)
      }
    },
    [pendingFile, resolvedUrl, anchorSectionName]
  )

  const previewUrl = localPreview || (resolvedUrl ? getUploadUrl(resolvedUrl) : '')
  const hasImage   = Boolean(pendingFile || resolvedUrl)

  return {
    pendingFile,
    localPreview,
    resolvedUrl,
    previewUrl,
    hasImage,
    uploading,
    error,
    selectFile,
    clearImage,
    initWithUrl,
    reset,
    markRequired,
    resolveImageUrl,
  }
}
