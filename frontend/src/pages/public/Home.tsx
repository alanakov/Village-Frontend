import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/public/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { usePublicProducts } from '@/hooks/usePublicProducts'
import { usePublicContent } from '@/hooks/usePublicContent'
import { useInstitutionalStore } from '@/store/institutionalStore'
import { SectionName } from '@/types'
import { getUploadUrl } from '@/services/api'
import { resolveIcon } from '@/utils/iconMapper'

export function Home() {
  const { products, loading }  = usePublicProducts()
  const { content: local }     = useInstitutionalStore()
  const { getSection, getCards, getImages } = usePublicContent()

  const featured = products.slice(0, 6)
  const heroSection   = getSection(SectionName.home)
  const heroTitle     = heroSection?.title    ?? local.homeTitle
  const heroSubtitle  = heroSection?.subtitle ?? local.homeSubtitle
  const aboutSection  = getSection(SectionName.aboutUs)
  const aboutSubtitle = aboutSection?.subtitle ?? ''
  const aboutImages   = getImages(SectionName.aboutUs)  
  const aboutImageUrl = aboutImages.length > 0 ? getUploadUrl(aboutImages[0].imageUrl) : null
  const artDestSection  = getSection(SectionName.featuredCraft)
  const artDestSubtitle = artDestSection?.subtitle ?? 'Peças únicas feitas à mão com dedicação e amor'
  const impactoSection  = getSection(SectionName.socialImpact)
  const impactoSubtitle = impactoSection?.subtitle ?? 'O artesanato preserva nossa cultura e identidade.'
  const impactoCards    = getCards(SectionName.socialImpact)

  return (
    <div>
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${local.heroBanner})` }}
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>
      {aboutSection && (
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
                Quem Somos?
              </h2>
              {aboutSubtitle && (
                <div className="sidebar-accent mb-6 mt-10">
                  <p className="text-lg text-[var(--foreground)] leading-relaxed">
                    {aboutSubtitle}
                  </p>
                </div>
              )}
              {aboutSection.contents?.map((c) => (
                <p key={c.idContent} className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  {c.content}
                </p>
              ))}
              <Link
                to="/cultura"
                className="mt-8 inline-flex items-center gap-2 text-[var(--primary)] font-semibold font-ui hover:gap-3 transition-all duration-200"
              >
                Conheça nossa cultura <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {aboutImageUrl ? (
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img
                  src={aboutImageUrl}
                  alt="Comunidade da aldeia"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-[var(--muted)] border-2 border-dashed border-[var(--border)] aspect-[4/5] flex items-center justify-center">
                <p className="text-[var(--muted-foreground)] text-sm font-ui text-center px-6">
                  Imagem não configurada.<br />Adicione uma imagem no painel administrativo.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
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
              {artDestSubtitle}
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
      {impactoSection && (
        <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/85 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Impacto Social
              </h2>
              {impactoSubtitle && (
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-16">
                  {impactoSubtitle}
                </p>
              )}

              {impactoCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                  {impactoCards.map((card, i) => {
                    const CardIcon = resolveIcon(card.icon, i)
                    return (
                      <div key={card.idCard} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                        <CardIcon className="w-10 h-10 mx-auto mb-4 opacity-90" />
                        <div className="font-display text-3xl font-bold mb-2">{card.title}</div>
                        <div className="opacity-80 font-ui text-sm">{card.description}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              <Link
                to="/cultura"
                className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-10 py-4 rounded-2xl font-semibold font-ui hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Conheça mais sobre nossa cultura <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
