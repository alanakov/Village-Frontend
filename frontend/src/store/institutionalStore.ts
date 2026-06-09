import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InstitutionalContent } from '@/types'

interface InstitutionalStore {
  content: InstitutionalContent
  update: (partial: Partial<InstitutionalContent>) => void
  reset: () => void
}

const DEFAULT_CONTENT: InstitutionalContent = {
  homeTitle: 'Preservando Nossa Cultura, Compartilhando Nossa Arte',
  homeSubtitle:
    'Conheça o artesanato tradicional da nossa aldeia e ajude a preservar nossa cultura milenar',
  aboutText:
    'Nossa aldeia mantém vivas as tradições ancestrais através do artesanato tradicional. Cada peça é feita à mão, seguindo técnicas passadas de geração em geração, usando materiais naturais da floresta.',
  cultureText:
    'Nossa identidade cultural é expressa através das artes manuais. O artesanato não é apenas uma atividade econômica, mas uma forma de manter viva nossa conexão com os ancestrais e com a natureza.',
  heroBanner:
    'https://images.unsplash.com/photo-1508622843032-c8d7baeb5f42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  whatsappNumber: '5511999999999',
}

export const useInstitutionalStore = create<InstitutionalStore>()(
  persist(
    (set) => ({
      content: DEFAULT_CONTENT,
      update: (partial) => set((s) => ({ content: { ...s.content, ...partial } })),
      reset: () => set({ content: DEFAULT_CONTENT }),
    }),
    { name: 'aldeia-institutional' }
  )
)
