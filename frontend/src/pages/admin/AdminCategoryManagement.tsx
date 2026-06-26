import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, FolderOpen, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { categorySchema, type CategoryFormData } from '@/utils/validations'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { usePagination } from '@/hooks/usePagination'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { getApiErrorMessage } from '@/utils/helpers'
import type { Category } from '@/types'
import type { SortOrder } from '@/hooks/usePagination'
import toast from 'react-hot-toast'

type SortableCatKey = 'name' | 'createdAt'

interface SortBtnProps {
  label: string
  sortKey: SortableCatKey
  activeSortKey: SortableCatKey | null
  sortOrder: SortOrder
  onSort: (key: SortableCatKey) => void
}

function SortBtn({ label, sortKey, activeSortKey, sortOrder, onSort }: SortBtnProps) {
  const isActive = activeSortKey === sortKey
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      title={`Ordenar por ${label}`}
    >
      {label}
      {isActive ? (
        sortOrder === 'asc'
          ? <ArrowUp className="w-3 h-3 text-[var(--primary)]" />
          : <ArrowDown className="w-3 h-3 text-[var(--primary)]" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-40" />
      )}
    </button>
  )
}

export function AdminCategoryManagement() {
  const { categories, loading, create, update, remove } = useCategories()
  const { products } = useProducts()
  const [modalOpen, setModalOpen]             = useState(false)
  const [editing, setEditing]                 = useState<Category | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema) })

  const productCountFor = (catId: number) =>
    products.filter((p) => p.categoryId === catId).length

  const pagination = usePagination<Category>({
    items: categories,
    pageSize: 6,
    defaultSortKey: 'name',
    defaultSortOrder: 'asc',
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '' })
    setModalOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    reset({ name: c.name })
    setModalOpen(true)
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editing) {
        await update(editing.idCategory, data)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await create(data)
        toast.success('Categoria criada com sucesso!')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleDelete = async (id: number) => {
    const count = productCountFor(id)
    if (count > 0) {
      toast.error(
        `Não é possível excluir: esta categoria possui ${count} produto${count > 1 ? 's' : ''} vinculado${count > 1 ? 's' : ''}. Mova ou exclua os produtos antes de continuar.`
      )
      setDeleteConfirmId(null)
      return
    }
    try {
      await remove(id)
      toast.success('Categoria excluída com sucesso.')
      setDeleteConfirmId(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)]">Categorias</h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm mt-1">
            {categories.length} categoria{categories.length !== 1 ? 's' : ''} cadastrada{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Nova Categoria
        </Button>
      </div>

      {!loading && categories.length > 1 && (
        <div className="flex items-center gap-3 mb-5 text-xs font-ui text-[var(--muted-foreground)]">
          <span className="font-semibold">Ordenar por:</span>
          <SortBtn
            label="Nome"
            sortKey="name"
            activeSortKey={pagination.sortKey as SortableCatKey | null}
            sortOrder={pagination.sortOrder}
            onSort={(k) => pagination.setSort(k as keyof Category)}
          />
          <SortBtn
            label="Data de criação"
            sortKey="createdAt"
            activeSortKey={pagination.sortKey as SortableCatKey | null}
            sortOrder={pagination.sortOrder}
            onSort={(k) => pagination.setSort(k as keyof Category)}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria cadastrada"
          description='Crie a primeira categoria clicando em "Nova Categoria".'
          action={
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" /> Nova Categoria
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pagination.paged.map((c) => {
              const count = productCountFor(c.idCategory)
              return (
                <div
                  key={c.idCategory}
                  className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--primary)] transition-colors"
                        aria-label={`Editar ${c.name}`}
                        title="Editar categoria"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(c.idCategory)}
                        className="p-2 rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--destructive)] transition-colors"
                        aria-label={`Excluir ${c.name}`}
                        title="Excluir categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-2">
                    {c.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <Badge variant="primary">
                      {count} produto{count !== 1 ? 's' : ''}
                    </Badge>
                    {c.createdAt && (
                      <span className="text-xs text-[var(--muted-foreground)] font-ui">
                        {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              pageSizeOptions={[6, 12, 24]}
              canGoPrev={pagination.canGoPrev}
              canGoNext={pagination.canGoNext}
              goFirst={pagination.goFirst}
              goLast={pagination.goLast}
              goPrev={pagination.goPrev}
              goNext={pagination.goNext}
              itemLabel="categoria"
              itemLabelPlural="categorias"
            />
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Categoria' : 'Nova Categoria'}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Nome da Categoria"
            required
            placeholder="Ex: Cestaria, Cerâmica..."
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {editing ? 'Salvar alterações' : 'Criar categoria'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar exclusão"
        className="max-w-sm"
      >
        <p className="text-[var(--muted-foreground)] font-ui mb-6">
          Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
          >
            <Trash2 className="w-4 h-4" /> Excluir categoria
          </Button>
        </div>
      </Modal>
    </div>
  )
}
