import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  id: string
  label: string
  autoComplete?: string
  show: boolean
  onToggle: () => void
  error?: string
  registration: object
}

export function PasswordField({
  id,
  label,
  autoComplete,
  show,
  onToggle,
  error,
  registration,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--foreground)] font-ui">
        {label} <span className="text-[var(--destructive)]">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder="••••••••"
          {...registration}
          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
              : 'border-[var(--border)] focus:ring-[var(--primary)]'
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
