import { Check, X } from 'lucide-react'

interface Requirement {
  label: string
  met: boolean
}

interface PasswordStrengthProps {
  password: string
}

function getStrengthLabel(metCount: number): string {
  if (metCount <= 1) return 'Muito fraca'
  if (metCount <= 2) return 'Fraca'
  if (metCount <= 3) return 'Média'
  if (metCount === 4) return 'Boa'
  return 'Forte'
}

function getStrengthBarColor(metCount: number): string {
  if (metCount <= 1) return 'bg-red-500'
  if (metCount <= 2) return 'bg-orange-500'
  if (metCount <= 3) return 'bg-yellow-500'
  if (metCount === 4) return 'bg-blue-500'
  return 'bg-emerald-500'
}

function getStrengthTextColor(metCount: number): string {
  if (metCount <= 2) return 'text-red-500'
  if (metCount === 3) return 'text-yellow-600'
  if (metCount === 4) return 'text-blue-500'
  return 'text-emerald-500'
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const requirements: Requirement[] = [
    { label: 'No mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Letra maiúscula (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Letra minúscula (a-z)', met: /[a-z]/.test(password) },
    { label: 'Número (0-9)', met: /[0-9]/.test(password) },
    { label: 'Caractere especial (@#$%&*°?)', met: /[@#$%&*°?]/.test(password) },
  ]

  const metCount = requirements.filter((r) => r.met).length

  return (
    <div className="mt-3 space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--muted-foreground)] font-ui">Força da senha</span>
          <span className={`text-xs font-semibold font-ui ${getStrengthTextColor(metCount)}`}>
            {getStrengthLabel(metCount)}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < metCount ? getStrengthBarColor(metCount) : 'bg-[var(--muted)]'
              }`}
            />
          ))}
        </div>
      </div>

      <ul className="space-y-1.5">
        {requirements.map(({ label, met }) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                met ? 'bg-emerald-500' : 'bg-[var(--muted)]'
              }`}
            >
              {met ? (
                <Check className="w-2.5 h-2.5 text-white" />
              ) : (
                <X className="w-2.5 h-2.5 text-[var(--muted-foreground)]" />
              )}
            </span>
            <span
              className={`text-xs font-ui transition-colors ${
                met ? 'text-emerald-600' : 'text-[var(--muted-foreground)]'
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
