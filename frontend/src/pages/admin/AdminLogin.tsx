import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Leaf, Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/utils/validations'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/helpers'
import { Button } from '@/components/ui/Button'
import { maskEmail } from '@/utils/masks'

export function AdminLogin() {
  const { isAuthenticated, setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const emailReg = register('email')

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      // Backend retorna { message, token, user } — NÃO { access_token }
      const res = await authService.login(data)
      setAuth(res.token, res.user)
      navigate('/admin/dashboard')
    } catch (err) {
      setServerError(getApiErrorMessage(err) || 'Email ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)]/5 to-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Área Administrativa
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">Aldeia Cultura Viva</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] p-8 rounded-2xl shadow-xl border border-[var(--border)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[var(--foreground)] font-ui"
              >
                Email <span className="text-[var(--destructive)]">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@aldeia.com"
                {...emailReg}
                onChange={(e) => {
                  e.target.value = maskEmail(e.target.value)
                  emailReg.onChange(e)
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                    : 'border-[var(--border)] focus:ring-[var(--primary)]'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[var(--foreground)] font-ui"
                >
                  Senha <span className="text-[var(--destructive)]">*</span>
                </label>
                {/* Link "Esqueceu a senha?" — inicia o fluxo de recuperação */}
                <Link
                  to="/admin/recuperar-senha"
                  className="text-xs text-[var(--primary)] font-ui font-semibold hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                      : 'border-[var(--border)] focus:ring-[var(--primary)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
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
              <LogIn className="w-5 h-5" />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Link para cadastro */}
            <p className="text-center text-sm text-[var(--muted-foreground)] font-ui">
              Não tem uma conta?{' '}
              <Link
                to="/admin/cadastro"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
