import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Leaf, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validations'
import { adminService } from '@/services/adminService'
import { getApiErrorMessage } from '@/utils/helpers'
import { Button } from '@/components/ui/Button'
import { maskEmail } from '@/utils/masks'

export function AdminForgotPassword() {

  const [serverError, setServerError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [sentToEmail, setSentToEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })
  const emailReg = register('email')

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('')
    try {
      await adminService.recoverPassword(data.email)
      setSentToEmail(data.email)
      setEmailSent(true)
    } catch (err) {
      setServerError(
        getApiErrorMessage(err) || 'Não foi possível enviar o código. Tente novamente.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)]/5 to-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Recuperar Senha
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">Aldeia Cultura Viva</p>
        </div>
        <div className="bg-[var(--card)] p-8 rounded-2xl shadow-xl border border-[var(--border)]">

          {emailSent ? (
            
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                Código enviado!
              </h2>

              <p className="text-[var(--muted-foreground)] font-ui text-sm mb-1">
                Um código de verificação de 6 dígitos foi enviado para:
              </p>
              <p className="text-[var(--foreground)] font-ui font-semibold text-sm mb-5 break-all">
                {sentToEmail}
              </p>

              <div className="bg-[var(--muted)] rounded-xl px-4 py-3 mb-6 text-left">
                <p className="text-xs text-[var(--muted-foreground)] font-ui leading-relaxed">
                  <span className="font-semibold text-[var(--foreground)]">Importante:</span> o código
                  expira em <span className="font-semibold">15 minutos</span>. Verifique também a
                  pasta de spam caso não encontre o e-mail.
                </p>
              </div>

              <Link
                to="/admin/redefinir-senha"
                className="inline-flex items-center justify-center gap-2 w-full bg-[var(--primary)] text-white px-8 py-3.5 rounded-xl font-semibold font-ui text-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
              >
                Inserir o código
              </Link>

              <button
                type="button"
                onClick={() => {
                  setEmailSent(false)
                  setServerError('')
                }}
                className="mt-4 w-full text-sm text-[var(--muted-foreground)] font-ui hover:text-[var(--foreground)] transition-colors"
              >
                Tentar com outro e-mail
              </button>
            </div>
          ) : (
            
            <>
              <p className="text-[var(--muted-foreground)] font-ui text-sm mb-6 leading-relaxed">
                Informe o e-mail cadastrado e enviaremos um código de 6 dígitos para você
                redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[var(--foreground)] font-ui"
                  >
                    Email <span className="text-[var(--destructive)]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
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
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white font-ui text-[var(--foreground)] focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                          : 'border-[var(--border)] focus:ring-[var(--primary)]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
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
                  <Mail className="w-5 h-5" />
                  {isSubmitting ? 'Enviando código...' : 'Enviar código'}
                </Button>
              </form>
            </>
          )}
          {!emailSent && (
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
