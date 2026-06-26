import { useState, useMemo, useEffect } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { ProductCard } from '@/components/public/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { usePublicProducts } from '@/hooks/usePublicProducts'
import { usePublicContent } from '@/hooks/usePublicContent'
import { usePagination } from '@/hooks/usePagination'
import { SectionName } from '@/types'
import type { Product } from '@/types'
import { cn } from '@/utils/helpers'

type SortOption = { key: keyof Product; label: string; order: 'asc' | 'desc' }

const SORT_OPTIONS: SortOption[] = [
  { key: 'name',  label: 'Nome (A–Z)',    order: 'asc'  },
  { key: 'name',  label: 'Nome (Z–A)',    order: 'desc' },
  { key: 'price', label: 'Menor preço',  order: 'asc'  },
  { key: 'price', label: 'Maior preço',  order: 'desc' },
]

export function Products() {
  const { products, loading, error } = usePublicProducts()
  const { getSection, getContents }  = usePublicContent()

  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [sortIdx, setSortIdx]             = useState(0)  
  const productsSection = getSection(SectionName.crafts)
  const pageTitle       = productsSection?.title    ?? 'Nossa Coleção'
  const pageSubtitle    = getContents(SectionName.crafts)[0]?.content
    ?? 'Cada peça é única, feita à mão com materiais naturais e técnicas ancestrais'  
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

  const currentSort = SORT_OPTIONS[sortIdx]  
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[currentSort.key]
      const vb = b[currentSort.key]
      let cmp = 0      
      const na = Number(va)
      const nb = Number(vb)
      if (!isNaN(na) && !isNaN(nb)) {
        cmp = na - nb
      } else if (typeof va === 'string' && typeof vb === 'string') {
        cmp = va.localeCompare(vb, 'pt-BR', { sensitivity: 'base' })
      }
      return currentSort.order === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortIdx])

  const pagination = usePagination<Product>({
    items: sorted,
    pageSize: 12,
  })  
  useEffect(() => { pagination.setPage(1) }, [search, activeCategory, sortIdx])

  return (
    <div className="container mx-auto px-4 py-16">
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
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-3xl mx-auto">
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
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
          <select
            value={sortIdx}
            onChange={(e) => setSortIdx(Number(e.target.value))}
            className="pl-9 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-ui text-sm text-[var(--foreground)] appearance-none cursor-pointer"
            aria-label="Ordenar produtos"
          >
            {SORT_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-semibold font-ui transition-all duration-200',
              !activeCategory
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            )}
          >
            Todos
          </button>
          {categories.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(activeCategory === id ? null : id)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold font-ui transition-all duration-200',
                activeCategory === id
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)] font-ui">{error}</p>
        </div>
      )}
      {!error && loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
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
            {pagination.totalCount}{' '}
            {pagination.totalCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pagination.paged.map((p) => (
              <ProductCard key={p.idProduct} product={p} />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="inline-flex">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                  onPageChange={pagination.setPage}
                  onPageSizeChange={pagination.setPageSize}
                  pageSizeOptions={[8, 12, 24]}
                  canGoPrev={pagination.canGoPrev}
                  canGoNext={pagination.canGoNext}
                  goFirst={pagination.goFirst}
                  goLast={pagination.goLast}
                  goPrev={pagination.goPrev}
                  goNext={pagination.goNext}
                  itemLabel="produto"
                  itemLabelPlural="produtos"
                />
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
