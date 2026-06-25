import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  danger?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  loading = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            danger ? 'bg-red-100' : 'bg-[var(--primary)]/10'
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-[var(--primary)]'}`}
          />
        </div>
        <div>
          <h3 className="font-display font-bold text-[var(--foreground)] text-lg">{title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] font-ui mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm font-ui transition-colors disabled:opacity-50 ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white'
            }`}
          >
            {loading ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
