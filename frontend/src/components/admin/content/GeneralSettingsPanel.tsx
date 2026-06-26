import { useForm } from 'react-hook-form'
import { Save, Home, Type, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInstitutionalStore } from '@/store/institutionalStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { InstitutionalContent } from '@/types'

export function GeneralSettingsPanel() {
  const { content, update } = useInstitutionalStore()
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } =
    useForm<InstitutionalContent>({ defaultValues: content })

  const onSubmit = (data: InstitutionalContent) => {
    update(data)
    toast.success('Configurações salvas!')
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[var(--muted)] border border-[var(--border)] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[var(--foreground)] text-xl">
            Configurações Gerais
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] font-ui mt-1">
            Fallback usado quando as seções do banco ainda não contêm o conteúdo correspondente.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <Home className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Hero — Página Inicial</span>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Título principal" placeholder="Ex: Preservando Nossa Cultura..." {...register('homeTitle')} />
            <Textarea label="Subtítulo" rows={2} placeholder="Texto abaixo do título principal..." {...register('homeSubtitle')} />
            <Input label="URL da imagem de fundo" type="url" placeholder="https://..." {...register('heroBanner')} />
            {content.heroBanner && (
              <div className="rounded-xl overflow-hidden h-36">
                <img src={content.heroBanner} alt="Preview do banner" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <Type className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Textos Institucionais</span>
          </div>
          <div className="p-5 space-y-4">
            <Textarea label="Texto — Quem Somos" rows={4} {...register('aboutText')} />
            <Textarea label="Texto — Cultura" rows={4} {...register('cultureText')} />
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <Settings className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] font-ui">Contato</span>
          </div>
          <div className="p-5">
            <Input
              label="Número do WhatsApp"
              placeholder="5511999999999"
              hint="Código do país + DDD + número. Ex: 5511999999999"
              {...register('whatsappNumber')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-2">
          {!isDirty && (
            <p className="text-sm text-[var(--muted-foreground)] font-ui self-center">
              Sem alterações pendentes
            </p>
          )}
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}>
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
