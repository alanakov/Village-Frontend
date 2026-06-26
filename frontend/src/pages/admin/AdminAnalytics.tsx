import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { StatCard } from '@/components/admin/StatCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatPrice } from '@/utils/helpers'
import { Package, TrendingUp, Tag, DollarSign } from 'lucide-react'

export function AdminAnalytics() {
  const { products, loading: loadingP } = useProducts()
  const { categories, loading: loadingC } = useCategories()

  const byCategory = useMemo(() => {
    return categories
      .map((c) => {
        const items = products.filter((p) => p.categoryId === c.idCategory)
        const total = items.reduce((s, p) => s + Number(p.price), 0)
        const avg = items.length ? total / items.length : 0
        return { name: c.name, count: items.length, total, avg }
      })
      .sort((a, b) => b.count - a.count)
  }, [categories, products])

  const maxCount = Math.max(...byCategory.map((c) => c.count), 1)
  const avgPrice = products.length
    ? products.reduce((s, p) => s + Number(p.price), 0) / products.length
    : 0
  const maxPrice = products.length
    ? Math.max(...products.map((p) => Number(p.price)))
    : 0
  const minPrice = products.length
    ? Math.min(...products.map((p) => Number(p.price)))
    : 0

  const loading = loadingP || loadingC

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--primary)]">Análises</h1>
        <p className="text-[var(--muted-foreground)] font-ui text-sm mt-1">
          Visão analítica do catálogo
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total de Produtos"
              value={products.length}
              icon={Package}
              colorClass="bg-[var(--primary)]"
            />
            <StatCard
              title="Preço Médio"
              value={formatPrice(avgPrice)}
              icon={DollarSign}
              colorClass="bg-[var(--accent)]"
            />
            <StatCard
              title="Produto Mais Caro"
              value={formatPrice(maxPrice)}
              icon={TrendingUp}
              colorClass="bg-[var(--secondary)]"
            />
            <StatCard
              title="Categorias Ativas"
              value={byCategory.filter((c) => c.count > 0).length}
              icon={Tag}
              colorClass="bg-emerald-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--card-foreground)] mb-6">
            Produtos por Categoria
          </h2>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          ) : byCategory.length === 0 ? (
            <p className="text-[var(--muted-foreground)] font-ui text-sm text-center py-8">
              Nenhum dado disponível
            </p>
          ) : (
            <div className="space-y-5">
              {byCategory.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[var(--foreground)] font-ui">
                      {c.name}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-ui">
                      {c.count} produto{c.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--muted)] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70 transition-all duration-700"
                      style={{ width: `${(c.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--card-foreground)] mb-6">
            Análise de Preços
          </h2>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Preço médio', value: formatPrice(avgPrice), color: 'bg-[var(--primary)]' },
                { label: 'Preço mínimo', value: formatPrice(minPrice), color: 'bg-emerald-500' },
                { label: 'Preço máximo', value: formatPrice(maxPrice), color: 'bg-[var(--secondary)]' },
                {
                  label: 'Total do catálogo',
                  value: formatPrice(products.reduce((s, p) => s + Number(p.price), 0)),
                  color: 'bg-[var(--accent)]',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--muted)]">
                  <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                  <span className="text-sm text-[var(--muted-foreground)] font-ui flex-1">
                    {label}
                  </span>
                  <span className="font-semibold text-[var(--foreground)] font-ui">{value}</span>
                </div>
              ))}

              {byCategory.filter((c) => c.count > 0).length > 0 && (
                <div className="border-t border-[var(--border)] pt-4 mt-2">
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-3 font-ui">
                    Valor por Categoria
                  </p>
                  {byCategory
                    .filter((c) => c.count > 0)
                    .map((c) => (
                      <div
                        key={c.name}
                        className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0"
                      >
                        <span className="text-sm text-[var(--muted-foreground)] font-ui">
                          {c.name}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-[var(--primary)] font-ui block">
                            {formatPrice(c.total)}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)] font-ui">
                            média: {formatPrice(c.avg)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
