import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/public/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePublicProducts } from '@/hooks/usePublicProducts'
import { usePublicContent } from '@/hooks/usePublicContent'
import { SectionName } from '@/types'

export function Products() {
  const { products, loading, error } = usePublicProducts()
  const { getSection, getContents }  = usePublicContent()

  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  // Section data — uses SectionName.crafts = 'Artesanato'
  const productsSection = getSection(SectionName.crafts)
  const pageTitle       = productsSection?.title    ?? 'Nossa Coleção'
  const pageSubtitle    = getContents(SectionName.crafts)[0]?.content
    ?? 'Cada peça é única, feita à mão com materiais naturais e técnicas ancestrais'

  // Build unique category list from real products
  const categories = useMemo(() => {
    const seen = new Map<number, string>()
    for (const p of products) {
      if (!seen.has(p.categoryId)) {
        seen.set(p.categoryId, p.category?.name ?? `Categoria ${p.categoryId}`)
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = !activeCategory || p.categoryId === activeCategory
      return matchSearch && matchCat
    })
  }, [products, search, activeCategory])

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
          <span className="text-[var(--accent)] text-sm font-semibold font-ui uppercase tracking-widest">
            Artesanato
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
          {pageTitle}
        </h1>
        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mb-6 rounded-full" />
        <p className="text-[var(--muted-foreground)] text-lg max-w-xl mx-auto">
          {pageSubtitle}
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="search"
            placeholder="Buscar artesanato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-ui"
            aria-label="Buscar produtos"
          />
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-semibold font-ui transition-all duration-200 ${
              !activeCategory
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            Todos
          </button>
          {categories.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(activeCategory === id ? null : id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold font-ui transition-all duration-200 ${
                activeCategory === id
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)] font-ui">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : !error && filtered.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
          description={
            products.length === 0
              ? 'Os produtos cadastrados pelo administrador aparecerão aqui.'
              : 'Tente buscar por outros termos ou limpar os filtros.'
          }
          action={
            products.length > 0 ? (
              <button
                onClick={() => { setSearch(''); setActiveCategory(null) }}
                className="text-[var(--primary)] font-semibold underline font-ui"
              >
                Limpar filtros
              </button>
            ) : undefined
          }
        />
      ) : !error ? (
        <>
          <p className="text-sm text-[var(--muted-foreground)] mb-6 font-ui">
            {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.idProduct} product={p} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
