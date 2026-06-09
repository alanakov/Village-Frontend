import { usePublicContent } from '@/hooks/usePublicContent'
import { useInstitutionalStore } from '@/store/institutionalStore'
import { Leaf, Music, Palette, BookOpen } from 'lucide-react'
import { getUploadUrl } from '@/services/api'
import type { LucideIcon } from 'lucide-react'

// Nomes das seções — exatamente como estão no enum do backend
const S_IDENTITY = 'Identidade'
const S_VALUES   = 'Valores'
const S_TECH     = 'Técnicas Tradicionais'
const S_PRESERVE = 'Preserve'

// Ícones mapeados por índice para os cards (backend armazena apenas string, não componente)
const ICON_MAP: LucideIcon[] = [Leaf, Music, Palette, BookOpen]

// Fallback de cards quando o backend ainda não tem a seção cadastrada
const DEFAULT_CARDS = [
  {
    icon: Leaf,
    title: 'Conexão com a Natureza',
    text: 'Nossa relação com a floresta é sagrada. Cada planta, animal e elemento da natureza tem um significado espiritual e prático na nossa vida cotidiana.',
  },
  {
    icon: Music,
    title: 'Música e Dança',
    text: 'Nossos rituais e celebrações são expressos através de cantos ancestrais e danças tradicionais que contam histórias de nossos antepassados.',
  },
  {
    icon: Palette,
    title: 'Artes Visuais',
    text: 'A pintura corporal, o artesanato e as pinturas rupestres são formas de expressão que preservamos e ensinamos às novas gerações.',
  },
  {
    icon: BookOpen,
    title: 'Transmissão Oral',
    text: 'Nosso conhecimento é transmitido de geração em geração através de histórias, mitos e ensinamentos dos mais velhos.',
  },
]

export function Culture() {
  const { content: local } = useInstitutionalStore()
  const { getContent, getCards, getSection, getImages, getFirstImage } = usePublicContent()

  // ── Seção Identidade ──────────────────────────────────────────────────────
  const identitySection  = getSection(S_IDENTITY)
  // Hero banner: primeira imagem de "Identidade", senão Unsplash padrão
  const heroBanner       = getFirstImage(S_IDENTITY) ||
    'https://images.unsplash.com/photo-1705516121728-da619fb299a9?w=1200&q=80'
  // Subtítulo do hero vem do subtitle da seção
  const heroSubtitle     = identitySection?.subtitle ??
    'Uma herança viva que une passado, presente e futuro'
  // Título do bloco de texto vem do title da seção
  const identityTitle    = identitySection?.title ?? 'Uma Herança Que Vive em Cada Gesto'
  // Texto principal vem de contents P1
  const cultureText      = getContent(S_IDENTITY, 'P1') || local.cultureText

  // ── Cards culturais ───────────────────────────────────────────────────────
  // Prioridade: Valores → Técnicas Tradicionais → fallback hardcoded
  const rawCards = getCards(S_VALUES).length ? getCards(S_VALUES) : getCards(S_TECH)
  const culturalCards = rawCards.length > 0
    ? rawCards.map((c, i) => ({
        icon: ICON_MAP[i % ICON_MAP.length],
        title: c.title,
        text: c.description,
      }))
    : DEFAULT_CARDS

  // ── Galeria de fotos ──────────────────────────────────────────────────────
  // Imagens vêm da seção "Preserve"; fallback para Unsplash se ainda não cadastradas
  const preserveImages = getImages(S_PRESERVE)
  const galleryImages = preserveImages.length > 0
    ? preserveImages.map((img) => ({
        src: getUploadUrl(img.imageUrl),
        alt: img.altText || 'Momento cultural da comunidade',
      }))
    : [
        { src: 'https://images.unsplash.com/photo-1758517821242-3d9d73ef550b?w=400&q=80', alt: 'Momento cultural 1' },
        { src: 'https://images.unsplash.com/photo-1508622843032-c8d7baeb5f42?w=400&q=80', alt: 'Momento cultural 2' },
        { src: 'https://images.unsplash.com/photo-1705516121728-da619fb299a9?w=400&q=80', alt: 'Momento cultural 3' },
        { src: 'https://images.unsplash.com/photo-1769358720638-932b3dd8101a?w=400&q=80', alt: 'Momento cultural 4' },
      ]

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/80 via-[var(--primary)]/70 to-[var(--foreground)]/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Nossa Cultura
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Texto Principal ── */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-[var(--secondary)] rounded-full" />
            <span className="text-[var(--secondary)] text-sm font-semibold font-ui uppercase tracking-widest">
              Identidade
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-8 decorative-underline">
            {identityTitle}
          </h2>
          <div className="mt-10 sidebar-accent mb-8">
            <p className="text-xl text-[var(--foreground)] leading-relaxed">
              {cultureText}
            </p>
          </div>
          <p className="text-[var(--muted-foreground)] leading-relaxed text-lg mb-6">
            Cada técnica, cada padrão e cada cor tem um significado especial em nossa tradição.
            O artesanato não é apenas uma atividade econômica — é uma forma de manter viva nossa
            conexão com os ancestrais e com a natureza.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed text-lg">
            Quando você adquire uma peça artesanal da nossa aldeia, você não está comprando apenas
            um objeto. Você está se tornando parte de uma cadeia de preservação cultural que remonta
            a séculos de história.
          </p>
        </div>
      </section>

      {/* ── Dimensões da Cultura ── */}
      <section className="bg-[var(--muted)] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">
              Dimensões da Nossa Cultura
            </h2>
            <div className="w-16 h-1 bg-[var(--accent)] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {culturalCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] card-hover"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">
                  {title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galeria ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center text-[var(--primary)] mb-12">
            Momentos da Nossa Comunidade
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${i === 0 || i === 3 ? 'row-span-2' : ''}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover min-h-[200px]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
