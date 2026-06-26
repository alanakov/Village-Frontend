import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Send } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { getApiErrorMessage } from '@/utils/helpers'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

const inviteSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email muito longo'),
})
type InviteFormData = z.infer<typeof inviteSchema>

interface Props {
  open: boolean
  onClose: () => void
}

export function InviteAdminModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({ resolver: zodResolver(inviteSchema) })

  const handleClose = () => {
    reset()
    setSent(false)
    setSentEmail('')
    onClose()
  }

  const onSubmit = async (data: InviteFormData) => {
    try {
      await adminService.sendInvite(data.email)
      setSentEmail(data.email)
      setSent(true)
      toast.success('Convite enviado com sucesso!')
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Erro ao enviar convite.')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Convidar Administrador" className="max-w-sm">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="font-ui text-sm text-[var(--muted-foreground)] mb-1">
            Convite enviado para
          </p>
          <p className="font-ui font-semibold text-[var(--foreground)] mb-5">{sentEmail}</p>
          <p className="font-ui text-xs text-[var(--muted-foreground)] mb-6">
            O link de cadastro é válido por 24 horas e pode ser usado apenas uma vez.
          </p>
          <Button variant="primary" className="w-full" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <p className="text-sm font-ui text-[var(--muted-foreground)]">
            A pessoa receberá um e-mail com um link de cadastro exclusivo, válido por 24 horas.
          </p>
          <Input
            label="Email do novo administrador"
            type="email"
            placeholder="novo@aldeia.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              <Mail className="w-4 h-4" /> Enviar convite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
