import { useState, type ChangeEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Leaf, Eye, EyeOff, Check } from 'lucide-react'
import { createAdminSchema, type CreateAdminFormData } from '@/utils/validations'
import { adminService } from '@/services/adminService'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/helpers'
import { Button } from '@/components/ui/Button'
import { PasswordStrength } from '@/components/admin/PasswordStrength'
import { maskEmail, maskPhone } from '@/utils/masks'

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
        <p className="text-sm text-[var(--destructive)] font-ui" role="alert">{error}</p>
      )}
    </div>
  )
}

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
        <p className="text-sm text-[var(--destructive)] font-ui" role="alert">{error}</p>
      )}
    </div>
  )
}

export function AdminRegister() {
  const { isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormData>({ resolver: zodResolver(createAdminSchema) })

  const passwordValue = watch('password', '')

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const emailReg = register('email')
  const phoneReg = register('phone')

  const maskedEmailReg = {
    ...emailReg,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      e.target.value = maskEmail(e.target.value)
      emailReg.onChange(e)
    },
  }

  const maskedPhoneReg = {
    ...phoneReg,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      e.target.value = maskPhone(e.target.value)
      phoneReg.onChange(e)
    },
  }

  const onSubmit = async (data: CreateAdminFormData) => {
    setServerError('')
    try {
      await adminService.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })
      setSuccess(true)
    } catch (err) {
      setServerError(getApiErrorMessage(err) || 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)]/5 to-[var(--background)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Criar Conta
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">Aldeia Cultura Viva</p>
        </div>

        <div className="bg-[var(--card)] p-8 rounded-2xl shadow-xl border border-[var(--border)]">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                Conta criada com sucesso!
              </h2>
              <p className="text-[var(--muted-foreground)] font-ui text-sm mb-6">
                Sua conta de administrador foi criada. Faça login para acessar o painel.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 w-full bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-semibold font-ui hover:opacity-90 transition-opacity"
              >
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField
                id="name"
                label="Nome completo"
                autoComplete="name"
                placeholder="Seu nome"
                error={errors.name?.message}
                registration={register('name')}
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="admin@aldeia.com"
                error={errors.email?.message}
                registration={maskedEmailReg}
              />
              <FormField
                id="phone"
                label="Telefone"
                type="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                error={errors.phone?.message}
                registration={maskedPhoneReg}
              />

              <div>
                <PasswordField
                  id="password"
                  label="Senha"
                  autoComplete="new-password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                  registration={register('password')}
                />
                <PasswordStrength password={passwordValue} />
              </div>

              <PasswordField
                id="confirmPassword"
                label="Confirmar senha"
                autoComplete="new-password"
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword?.message}
                registration={register('confirmPassword')}
              />

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
                <UserPlus className="w-5 h-5" />
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </Button>

              <p className="text-center text-sm text-[var(--muted-foreground)] font-ui">
                Já tem uma conta?{' '}
                <Link to="/admin" className="text-[var(--primary)] font-semibold hover:underline">
                  Fazer login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
