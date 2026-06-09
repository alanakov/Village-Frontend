import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Users, Star, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/public/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { usePublicProducts } from '@/hooks/usePublicProducts'
import { usePublicContent } from '@/hooks/usePublicContent'
import { useInstitutionalStore } from '@/store/institutionalStore'

// Nomes das seções — exatamente como estão no enum do backend
const S_HOME    = 'Página Inicial'
const S_ABOUT   = 'Sobre Nós'
const S_IMPACT  = 'Impacto Social'

export function Home() {
  const { products, loading } = usePublicProducts()
  const { content: local } = useInstitutionalStore()
  const { getContent, getStats, getSection, getFirstImage } = usePublicContent()

  const featured = products.slice(0, 6)

  // ── Hero ──────────────────────────────────────────────────────────────────
  // P1 = título principal, P2 = subtítulo
  const heroTitle    = getContent(S_HOME, 'P1') || local.homeTitle
  const heroSubtitle = getContent(S_HOME, 'P2') || local.homeSubtitle
  // Imagem do hero: primeira imagem da seção "Página Inicial", senão localStorage
  const heroBanner   = getFirstImage(S_HOME) || local.heroBanner

  // ── Quem Somos ────────────────────────────────────────────────────────────
  const aboutText  = getContent(S_ABOUT, 'P1') || local.aboutText
  // Imagem lateral: primeira imagem de "Sobre Nós"
  const aboutImage = getFirstImage(S_ABOUT)

  // ── Impacto Social ────────────────────────────────────────────────────────
  const impactSection  = getSection(S_IMPACT)
  const impactTitle    = impactSection?.title ?? 'Impacto Social e Cultural'
  const impactSubtitle = getContent(S_IMPACT, 'P1') ||
    'O artesanato é uma forma essencial de preservação cultural, educação dos jovens e manutenção da nossa conexão com a natureza e os ancestrais.'
  const impactStats    = getStats(S_IMPACT)

  // Fallback de stats quando a seção ainda não foi cadastrada
  const defaultStats = [
    { value: '500+', label: 'Peças Produzidas',       icon: Star  },
    { value: '50+',  label: 'Artesãos na Comunidade', icon: Users },
    { value: '10+',  label: 'Técnicas Tradicionais',  icon: Leaf  },
  ]

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/70 via-[var(--primary)]/60 to-[var(--secondary)]/75" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
              <span className="text-sm font-semibold font-ui tracking-wide">
                Cultura · Tradição · Ancestralidade
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight font-bold drop-shadow-lg">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed opacity-90 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/produtos"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold font-ui hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Conheça o artesanato <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cultura"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold font-ui hover:bg-white/10 transition-all duration-300"
              >
                Nossa história
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Quem Somos ── */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[var(--secondary)] rounded-full" />
              <span className="text-[var(--secondary)] text-sm font-semibold font-ui uppercase tracking-widest">
                Quem Somos
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 decorative-underline">
              {getSection(S_ABOUT)?.title ?? 'História Viva, Memória que Pulsa'}
            </h2>
            <div className="sidebar-accent mb-6 mt-10">
              <p className="text-lg text-[var(--foreground)] leading-relaxed">
                {getSection(S_ABOUT)?.subtitle ??
                  'Nossa aldeia é um território de memória viva, onde cada dia é um elo entre o passado ancestral e o futuro que construímos juntos.'}
              </p>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
              {aboutText}
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              A terra que habitamos não é apenas um lugar geográfico — é parte de quem somos,
              entrelaçada com nossa identidade. Respeitamos os ciclos naturais, honramos nossos
              ancestrais.
            </p>
            <Link
              to="/cultura"
              className="mt-8 inline-flex items-center gap-2 text-[var(--primary)] font-semibold font-ui hover:gap-3 transition-all duration-200"
            >
              Conheça nossa cultura <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
            <img
              src={aboutImage || 'https://images.unsplash.com/photo-1758517821242-3d9d73ef550b?w=800&q=80'}
              alt="Comunidade da aldeia reunida"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Produtos em Destaque ── */}
      <section className="bg-[var(--muted)] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-[var(--accent)] font-semibold font-ui text-sm uppercase tracking-widest">
                Seleção especial
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
              Artesanato em Destaque
            </h2>
            <div className="w-20 h-1 bg-[var(--accent)] mx-auto mb-6 rounded-full" />
            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
              Peças únicas feitas à mão com dedicação e amor, carregando a alma de nossa tradição
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p.idProduct} product={p} />)}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg" className="rounded-2xl shadow-xl">
              <Link to="/produtos" className="flex items-center gap-2">
                Ver todos os artesanatos <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Impacto Social ── */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/85 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              {impactTitle}
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-16">
              {impactSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              {impactStats.length > 0
                ? impactStats.map(({ value, title }) => (
                    <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                      <div className="font-display text-5xl font-bold mb-2">{value}</div>
                      <div className="opacity-80 font-ui">{title}</div>
                    </div>
                  ))
                : defaultStats.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                      <Icon className="w-8 h-8 mx-auto mb-3 opacity-70" />
                      <div className="font-display text-5xl font-bold mb-2">{value}</div>
                      <div className="opacity-80 font-ui">{label}</div>
                    </div>
                  ))}
            </div>

            <Link
              to="/cultura"
              className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-10 py-4 rounded-2xl font-semibold font-ui hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Conheça mais sobre nossa cultura <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
