import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserCog, Mail, Phone, User, KeyRound, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { updateProfileSchema, type UpdateProfileFormData } from '@/utils/validations'
import { getApiErrorMessage } from '@/utils/helpers'
import { maskPhone } from '@/utils/masks'
import { useProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

export function AdminProfile() {
  const { user } = useAuthStore()
  const { profile, loading, saving, error, updateProfile } = useProfile()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '', phone: '' },
  })  
  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, phone: profile.phone })
    }
  }, [profile, reset])

  const phoneReg = register('phone')

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile({ name: data.name, phone: data.phone })
      toast.success('Perfil atualizado com sucesso!')
      reset(data) // mark form as pristine after save
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Não foi possível salvar as alterações.')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Meu Perfil
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">
            Visualize e edite as suas informações pessoais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col items-center text-center gap-3">
            {loading ? (
              <>
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-5 w-36 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold font-display text-[var(--primary)]">
                    {(profile?.name ?? user?.name ?? 'A')
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="font-semibold font-display text-[var(--card-foreground)] text-lg leading-tight">
                    {profile?.name ?? user?.name ?? 'Administrador'}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] font-ui mt-0.5">
                    {profile?.email ?? user?.email}
                  </p>
                </div>

                <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-semibold font-ui">
                  Administrador
                </span>

                {profile?.createdAt && (
                  <p className="text-xs text-[var(--muted-foreground)] font-ui mt-1">
                    Membro desde{' '}
                    {new Date(profile.createdAt).toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="mt-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--card-foreground)] font-ui">
                  Senha da conta
                </p>
                <p className="text-xs text-[var(--muted-foreground)] font-ui mt-0.5 leading-relaxed">
                  Para alterar sua senha, utilize o fluxo de redefinição de senha.
                </p>
                <Link
                  to="/admin/recuperar-senha"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[var(--primary)] hover:underline font-ui"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Alterar senha
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
              <UserCog className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-display text-xl font-semibold text-[var(--card-foreground)]">
                Editar informações
              </h2>
            </div>
            {error && !loading && (
              <div className="mx-6 mt-6 bg-[var(--destructive)]/10 text-[var(--destructive)] px-4 py-3 rounded-xl text-sm font-ui border border-[var(--destructive)]/20">
                {error}
              </div>
            )}

            <div className="p-6 space-y-6">
              {loading ? (
                <div className="space-y-5">
                  <Skeleton className="h-[70px] rounded-xl" />
                  <Skeleton className="h-[70px] rounded-xl" />
                  <Skeleton className="h-[70px] rounded-xl" />
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="flex flex-col gap-1.5 font-ui">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      Nome completo
                      <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome"
                      {...register('name')}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white text-[var(--foreground)] font-ui
                        focus:outline-none focus:ring-2 transition-all duration-200
                        placeholder:text-[var(--muted-foreground)]
                        ${
                          errors.name
                            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                            : 'border-[var(--border)] focus:ring-[var(--primary)] focus:border-[var(--primary)]'
                        }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 font-ui">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      E-mail
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={profile?.email ?? user?.email ?? ''}
                        readOnly
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]
                          text-[var(--muted-foreground)] font-ui cursor-not-allowed select-none"
                      />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] font-ui">
                      O e-mail é utilizado como identificador da conta e não pode ser alterado.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 font-ui">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      Telefone
                      <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      {...phoneReg}
                      onChange={(e) => {
                        e.target.value = maskPhone(e.target.value)
                        phoneReg.onChange(e)
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white text-[var(--foreground)] font-ui
                        focus:outline-none focus:ring-2 transition-all duration-200
                        placeholder:text-[var(--muted-foreground)]
                        ${
                          errors.phone
                            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
                            : 'border-[var(--border)] focus:ring-[var(--primary)] focus:border-[var(--primary)]'
                        }`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-[var(--destructive)] font-ui" role="alert">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={saving}
                      disabled={!isDirty || saving}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
