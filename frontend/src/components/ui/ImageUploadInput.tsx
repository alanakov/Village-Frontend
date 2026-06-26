import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { IMAGE_UPLOAD_CONFIG } from '@/utils/fileValidation'

interface ImageUploadInputProps {
  /** URL para exibição no preview (local ou remota) */
  previewUrl: string
  /** Nome do arquivo selecionado — exibido abaixo do preview */
  fileName?: string
  /** Mensagem de erro de validação */
  error?: string
  /** Rótulo do campo exibido acima do input */
  label?: string
  /** Indica campo obrigatório */
  required?: boolean
  /** Desabilita interações (ex: durante upload) */
  disabled?: boolean
  /** Callback disparado quando o usuário seleciona um arquivo */
  onFileChange: (file: File) => void
  /** Callback disparado quando o usuário remove a imagem */
  onClear: () => void
}

export function ImageUploadInput({
  previewUrl,
  fileName,
  error,
  label,
  required,
  disabled,
  onFileChange,
  onClear,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileChange(file)
    e.target.value = ''
  }

  const openFilePicker = () => {
    if (!disabled) fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-1.5 font-ui">
      {label && (
        <label className="text-sm font-semibold text-[var(--foreground)]">
          {label}
          {required && <span className="text-[var(--destructive)] ml-1">*</span>}
        </label>
      )}

      {previewUrl ? (
        <div className="flex flex-col gap-2">
          <div className="relative w-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
            <img
              src={previewUrl}
              alt="Preview da imagem"
              className="w-full h-48 object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />

            {disabled ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <button
                type="button"
                onClick={onClear}
                aria-label="Remover imagem"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[var(--destructive)] shadow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            {fileName && (
              <p className="text-xs text-[var(--muted-foreground)] truncate max-w-[70%]">
                <span className="font-semibold">Arquivo:</span> {fileName}
              </p>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={openFilePicker}
                className="text-xs text-[var(--primary)] hover:underline font-semibold ml-auto"
              >
                Trocar imagem
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-[var(--destructive)] text-[var(--destructive)]'
              : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
          )}
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm font-semibold">Clique para selecionar</span>
          <span className="text-xs">
            {IMAGE_UPLOAD_CONFIG.ACCEPTED_EXTENSIONS.replace(/\./g, '').toUpperCase().split(',').join(', ')}
            {' · '}Máx. {IMAGE_UPLOAD_CONFIG.MAX_SIZE_LABEL}
          </span>
        </button>
      )}

      {}
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_UPLOAD_CONFIG.ACCEPTED_EXTENSIONS}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
