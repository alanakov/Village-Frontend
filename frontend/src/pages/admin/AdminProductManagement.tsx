import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Search, Image } from 'lucide-react'
import { productUploadSchema, type ProductUploadFormData, type ProductUploadFormInput } from '@/utils/validations'
import { useProducts } from '@/hooks/useProducts'
import { useImageUpload } from '@/hooks/useImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { ImageUploadInput } from '@/components/ui/ImageUploadInput'
import { formatPrice, getApiErrorMessage } from '@/utils/helpers'
import { getUploadUrl } from '@/services/api'
import type { Product, CreateProductDto } from '@/types'
import toast from 'react-hot-toast'

export function AdminProductManagement() {
  const { products, categories, loading, create, update, remove } = useProducts()
  const imageUpload = useImageUpload()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductUploadFormInput>({
    resolver: zodResolver(productUploadSchema),
    defaultValues: { name: '', description: '', price: 0, size: '', categoryId: 0 },
  })

  // ── Sincroniza a imagem existente ao abrir edição ──────────────────────────

  useEffect(() => {
    if (modalOpen && editing?.imageUrl) {
      imageUpload.initWithUrl(editing.imageUrl)
    }
  }, [modalOpen, editing, imageUpload.initWithUrl])

  // ── Filtro de busca ────────────────────────────────────────────────────────

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  // ── Controle do modal ──────────────────────────────────────────────────────

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', description: '', price: 0, size: '', categoryId: 0 })
    imageUpload.reset()
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    reset({
      name: p.name,
      description: p.description,
      price: Number(p.price),
      size: p.size ?? '',
      categoryId: p.categoryId,
    })
    imageUpload.reset()
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    imageUpload.reset()
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<ProductUploadFormData> = async (data) => {
    if (!imageUpload.hasImage) {
      imageUpload.markRequired()
      return
    }

    let imageUrl: string
    try {
      imageUrl = await imageUpload.resolveImageUrl(data.name)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      return
    }

    const dto: CreateProductDto = {
      name: data.name,
      description: data.description,
      price: data.price,
      size: data.size || undefined,
      imageUrl,
      categoryId: data.categoryId,
    }

    try {
      if (editing) {
        await update(editing.idProduct, dto)
        toast.success('Produto atualizado com sucesso!')
      } else {
        await create(dto)
        toast.success('Produto criado com sucesso!')
      }
      closeModal()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  // ── Exclusão ───────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      await remove(id)
      toast.success('Produto excluído.')
      setDeleteConfirmId(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)]">
            Gestão de Produtos
          </h1>
          <p className="text-[var(--muted-foreground)] font-ui text-sm mt-1">
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado
            {products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      {/* Busca */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          type="search"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-ui text-sm"
        />
      </div>

      {/* Tabela */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description={search ? 'Tente outros termos.' : 'Crie seu primeiro produto.'}
            action={
              !search ? (
                <Button onClick={openCreate}>
                  <Plus className="w-4 h-4" /> Novo Produto
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                  {['Imagem', 'Nome', 'Categoria', 'Preço', 'Tamanho', 'Ações'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider font-ui whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((p) => (
                  <tr key={p.idProduct} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="py-4 px-5">
                      {p.imageUrl ? (
                        <img
                          src={getUploadUrl(p.imageUrl)}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center">
                          <Image className="w-5 h-5 text-[var(--muted-foreground)]" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-sm text-[var(--foreground)] font-ui">
                        {p.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5 max-w-[200px] truncate">
                        {p.description}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <Badge variant="primary">
                        {p.category?.name ?? `Cat. ${p.categoryId}`}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 font-semibold text-[var(--primary)] font-ui whitespace-nowrap">
                      {formatPrice(Number(p.price))}
                    </td>
                    <td className="py-4 px-5 text-sm text-[var(--muted-foreground)] font-ui">
                      {p.size || '—'}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--primary)] transition-colors"
                          aria-label={`Editar ${p.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.idProduct)}
                          className="p-2 rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--destructive)] transition-colors"
                          aria-label={`Excluir ${p.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de criação / edição */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Editar Produto' : 'Novo Produto'}
        className="max-w-2xl"
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome do Produto"
              required
              placeholder="Ex: Cesto Artesanal"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex flex-col gap-1.5 font-ui">
              <label
                htmlFor="categoryId"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Categoria <span className="text-[var(--destructive)]">*</span>
              </label>
              <select
                id="categoryId"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                onChange={(e) => setValue('categoryId', Number(e.target.value))}
                defaultValue={editing?.categoryId ?? ''}
              >
                <option value="">Selecione...</option>
                {categories.map((c) => (
                  <option key={c.idCategory} value={c.idCategory}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-[var(--destructive)]">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <Textarea
            label="Descrição"
            required
            placeholder="Descreva o produto..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 font-ui">
              <label
                htmlFor="price"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Preço (R$) <span className="text-[var(--destructive)]">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                onChange={(e) => setValue('price', parseFloat(e.target.value) || 0)}
                defaultValue={editing ? Number(editing.price) : ''}
              />
              {errors.price && (
                <p className="text-sm text-[var(--destructive)]">{errors.price.message}</p>
              )}
            </div>
            <Input
              label="Tamanho"
              placeholder="Ex: P, M, G, 30cm..."
              error={errors.size?.message}
              {...register('size')}
            />
          </div>

          <ImageUploadInput
            label="Imagem do Produto"
            required
            previewUrl={imageUpload.previewUrl}
            fileName={imageUpload.pendingFile?.name}
            error={imageUpload.error}
            disabled={imageUpload.uploading}
            onFileChange={imageUpload.selectFile}
            onClear={imageUpload.clearImage}
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || imageUpload.uploading}
            >
              {editing ? 'Salvar alterações' : 'Criar produto'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar exclusão"
        className="max-w-sm"
      >
        <p className="text-[var(--muted-foreground)] font-ui mb-6">
          Tem certeza? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </Button>
        </div>
      </Modal>
    </div>
  )
}
