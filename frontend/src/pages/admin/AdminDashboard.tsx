import { useState } from 'react'
import { Package, FolderOpen, TrendingUp, Layers, UserPlus } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { InviteAdminModal } from '@/components/admin/InviteAdminModal'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useSections } from '@/hooks/useSections'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/utils/helpers'
import { getUploadUrl } from '@/services/api'

export function AdminDashboard() {
  const { products, loading: loadingProducts } = useProducts()
  const { categories, loading: loadingCats } = useCategories()
  const { sections, loading: loadingSections } = useSections()
  const { user } = useAuthStore()
  const [inviteOpen, setInviteOpen] = useState(false)

  const totalValue = products.reduce((acc, p) => acc + Number(p.price), 0)
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5)

  const loading = loadingProducts || loadingCats || loadingSections

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-1">
            Dashboard
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm">
            Bem-vindo, {user?.name ?? 'Administrador'} · Visão geral do sistema
          </p>
        </div>
        <Button variant="ghost" onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4" /> Convidar administrador
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
              title="Categorias"
              value={categories.length}
              icon={FolderOpen}
              colorClass="bg-[var(--secondary)]"
            />
            <StatCard
              title="Valor Total do Catálogo"
              value={formatPrice(totalValue)}
              icon={TrendingUp}
              colorClass="bg-[var(--accent)]"
            />
            <StatCard
              title="Seções do Site"
              value={sections.length}
              icon={Layers}
              colorClass="bg-emerald-600"
            />
          </>
        )}
      </div>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-display text-xl font-semibold text-[var(--card-foreground)]">
            Produtos Recentes
          </h2>
        </div>

        {loadingProducts ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <EmptyState
            title="Nenhum produto cadastrado"
            description="Adicione produtos na seção Produtos."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--muted)]">
                  {['Imagem', 'Nome', 'Categoria', 'Preço', 'Data'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider font-ui"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentProducts.map((p) => (
                  <tr
                    key={p.idProduct}
                    className="hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <img
                        src={getUploadUrl(p.imageUrl)}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://placehold.co/40x40?text=?'
                        }}
                      />
                    </td>
                    <td className="py-4 px-5 font-semibold text-sm text-[var(--foreground)] font-ui">
                      {p.name}
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-semibold font-ui">
                        {p.category?.name ?? `Cat. ${p.categoryId}`}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-[var(--primary)] font-ui">
                      {formatPrice(Number(p.price))}
                    </td>
                    <td className="py-4 px-5 text-sm text-[var(--muted-foreground)] font-ui">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteAdminModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
