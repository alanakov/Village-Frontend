import { usePublicContent } from '@/hooks/usePublicContent'
import { useInstitutionalStore } from '@/store/institutionalStore'
import { getUploadUrl } from '@/services/api'
import { SectionName } from '@/types'
import { resolveIcon } from '@/utils/iconMapper'

export function Culture() {
  const { content: local } = useInstitutionalStore()
  const { getSection, getCards, getImages } = usePublicContent()
  const identidadeSection  = getSection(SectionName.identity)
  const identidadeTitle    = identidadeSection?.title    ?? 'Uma Herança Que Vive em Cada Gesto'
  const identidadeSubtitle = identidadeSection?.subtitle ?? 'Uma herança viva que une passado, presente e futuro'
  const dimensoesCards = getCards(SectionName.cultureDimensions)
  const galleryImages = getImages(SectionName.communityMoments)

  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/80 to-[var(--secondary)]/70" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Nossa Cultura
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {identidadeSubtitle}
          </p>
        </div>
      </section>
      {identidadeSection && (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-[var(--secondary)] rounded-full" />
              <span className="text-[var(--secondary)] text-sm font-semibold font-ui uppercase tracking-widest">
                Identidade
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-8 decorative-underline">
              {identidadeTitle}
            </h2>

            {identidadeSection.contents && identidadeSection.contents.length > 0 ? (
              identidadeSection.contents.map((c, i) => (
                <p
                  key={c.idContent}
                  className={`text-[var(--muted-foreground)] leading-relaxed text-lg mb-6 ${i === 0 ? 'sidebar-accent mt-10' : ''}`}
                >
                  {c.content}
                </p>
              ))
            ) : (
              <p className="text-[var(--muted-foreground)] leading-relaxed text-lg mb-6 sidebar-accent mt-10">
                {local.cultureText}
              </p>
            )}
          </div>
        </section>
      )}
      {dimensoesCards.length > 0 && (
        <section className="bg-[var(--muted)] py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">
                Dimensões da Nossa Cultura
              </h2>
              <div className="w-16 h-1 bg-[var(--accent)] mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {dimensoesCards.map((card, i) => {
                const CardIcon = resolveIcon(card.icon, i)
                return (
                  <div key={card.idCard} className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] card-hover">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                      <CardIcon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-3">{card.title}</h3>
                    <p className="text-[var(--muted-foreground)] leading-relaxed">{card.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      {galleryImages.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-[var(--primary)] mb-12">
              Momentos da Nossa Comunidade
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {galleryImages.map((img, i) => (
                <div
                  key={img.idImage}
                  className={`rounded-2xl overflow-hidden ${i === 0 || i === 3 ? 'row-span-2' : ''}`}
                >
                  <img
                    src={getUploadUrl(img.imageUrl)}
                    alt={img.altText || 'Momento da comunidade'}
                    className="w-full h-full object-cover min-h-[200px]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
