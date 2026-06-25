import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Leaf, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validations'
import { adminService } from '@/services/adminService'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/helpers'
import { Button } from '@/components/ui/Button'
import { PasswordStrength } from '@/components/admin/PasswordStrength'
import toast from 'react-hot-toast'
import { maskEmail } from '@/utils/masks'

// ── Sub-componente reutilizado: campo de texto comum ──────────────────────────

function FormField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  registration,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  placeholder?: string
  error?: string
  registration: object
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--foreground)] font-ui">
        {label} <span className="text-[var(--destructive)]">*</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...registration}
        className={`w-full px-4 py-3 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
            : 'border-[var(--border)] focus:ring-[var(--primary)]'
        }`}
      />
      {error && (
        <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// ── Sub-componente: campo de senha com botão de visibilidade ──────────────────

function PasswordField({
  id,
  label,
  autoComplete,
  show,
  onToggle,
  error,
  registration,
}: {
  id: string
  label: string
  autoComplete?: string
  show: boolean
  onToggle: () => void
  error?: string
  registration: object
}) {
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

// ── Componente principal ──────────────────────────────────────────────────────

export function AdminResetPassword() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) })

  const newPasswordValue = watch('newPassword', '')

  // Usuário já autenticado não precisa desta tela
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const emailReg = register('email')
  const maskedEmailReg = {
    ...emailReg,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      e.target.value = maskEmail(e.target.value)
      emailReg.onChange(e)
    },
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError('')
    try {
      await adminService.resetPassword({
        email: data.email,
        recoveryCode: data.recoveryCode,
        newPassword: data.newPassword,
      })
      setSuccess(true)
      toast.success('Senha redefinida com sucesso!')
    } catch (err) {
      const message = getApiErrorMessage(err)

      // O backend pode retornar { message: 'Senha muito fraca', requirements: {...} }
      // getApiErrorMessage extrai apenas o campo message, que é suficiente aqui.
      setServerError(message || 'Não foi possível redefinir a senha. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)]/5 to-[var(--background)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Redefinir Senha
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">Aldeia Cultura Viva</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] p-8 rounded-2xl shadow-xl border border-[var(--border)]">

          {success ? (
            /* ── Estado de sucesso ── */
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                Senha redefinida!
              </h2>
              <p className="text-[var(--muted-foreground)] font-ui text-sm mb-6">
                Sua senha foi alterada com sucesso. Use a nova senha para acessar o painel.
              </p>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/admin')}
              >
                <KeyRound className="w-5 h-5" />
                Ir para o login
              </Button>
            </div>
          ) : (
            /* ── Formulário ── */
            <>
              {/* Aviso informativo */}
              <div className="bg-[var(--muted)] rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-[var(--muted-foreground)] font-ui leading-relaxed">
                  Preencha o e-mail, o código de 6 dígitos recebido por e-mail e a nova senha.
                  O código expira em <span className="font-semibold text-[var(--foreground)]">15 minutos</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                {/* E-mail */}
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@aldeia.com"
                  error={errors.email?.message}
                  registration={maskedEmailReg}
                />

                {/* Código de recuperação */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="recoveryCode"
                    className="text-sm font-semibold text-[var(--foreground)] font-ui"
                  >
                    Código de verificação <span className="text-[var(--destructive)]">*</span>
                  </label>
                  <input
                    id="recoveryCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="000000"
                    {...register('recoveryCode')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white font-ui text-[var(--foreground)] text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 transition-all ${
                      errors.recoveryCode
                        ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                        : 'border-[var(--border)] focus:ring-[var(--primary)]'
                    }`}
                  />
                  {errors.recoveryCode ? (
                    <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                      {errors.recoveryCode.message}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--muted-foreground)] font-ui">
                      Digite os 6 dígitos recebidos no e-mail
                    </p>
                  )}
                </div>

                {/* Nova senha */}
                <div>
                  <PasswordField
                    id="newPassword"
                    label="Nova senha"
                    autoComplete="new-password"
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                    error={errors.newPassword?.message}
                    registration={register('newPassword')}
                  />
                  <PasswordStrength password={newPasswordValue} />
                </div>

                {/* Confirmar nova senha */}
                <PasswordField
                  id="confirmPassword"
                  label="Confirmar nova senha"
                  autoComplete="new-password"
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword?.message}
                  registration={register('confirmPassword')}
                />

                {/* Erro do servidor */}
                {serverError && (
                  <div
                    className="bg-[var(--destructive)]/10 text-[var(--destructive)] px-4 py-3 rounded-xl text-sm font-ui border border-[var(--destructive)]/20"
                    role="alert"
                  >
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full mt-2"
                >
                  <KeyRound className="w-5 h-5" />
                  {isSubmitting ? 'Redefinindo senha...' : 'Redefinir senha'}
                </Button>
              </form>
            </>
          )}

          {/* Voltar ao login */}
          {!success && (
            <div className="mt-6 pt-5 border-t border-[var(--border)]">
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] font-ui hover:text-[var(--primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
