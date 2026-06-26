import { useState, useCallback, useRef } from 'react'
import { productImageService } from '@/services/productImageService'
import { validateImageFile, createLocalPreview } from '@/utils/fileValidation'
import { getUploadUrl } from '@/services/api'

export function useImageUpload() {
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
    async (_altText?: string): Promise<string> => {
      if (resolvedUrl && !pendingFile) return resolvedUrl

      if (!pendingFile) {
        const msg = 'Selecione uma imagem.'
        setError(msg)
        throw new Error(msg)
      }

      setUploading(true)
      setError('')

      try {
        const { imageUrl } = await productImageService.upload(pendingFile)
        setResolvedUrl(imageUrl)
        setPendingFile(null)
        return imageUrl
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Falha no upload da imagem.'
        setError(msg)
        throw err
      } finally {
        setUploading(false)
      }
    },
    [pendingFile, resolvedUrl],
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
