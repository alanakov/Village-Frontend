export const IMAGE_UPLOAD_CONFIG = {
  ACCEPTED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png'] as const,
  ACCEPTED_EXTENSIONS: '.jpg,.jpeg,.png',
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  MAX_SIZE_LABEL: '5 MB',
} as const

export type AcceptedMimeType = (typeof IMAGE_UPLOAD_CONFIG.ACCEPTED_MIME_TYPES)[number]

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  if (!IMAGE_UPLOAD_CONFIG.ACCEPTED_MIME_TYPES.includes(file.type as AcceptedMimeType)) {
    return { valid: false, error: 'Formato inválido. Use JPG, JPEG ou PNG.' }
  }
  if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo permitido: ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_LABEL}.`,
    }
  }
  return { valid: true }
}

export function createLocalPreview(file: File): string {
  return URL.createObjectURL(file)
}
