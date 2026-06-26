import { useState, useEffect, useCallback } from 'react'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { resolveProductCategories } from '@/utils/helpers'
import type { Product, Category, CreateProductDto, UpdateProductDto } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])
      setCategories(cats)
      setProducts(resolveProductCategories(prods, cats))
    } catch {
      setError('Erro ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (dto: CreateProductDto): Promise<Product> => {
    const created = await productService.create(dto)
    const withCat = { ...created, category: categories.find((c) => c.idCategory === created.categoryId) }
    setProducts((prev) => [withCat, ...prev])
    return withCat
  }

  const update = async (id: number, dto: UpdateProductDto): Promise<Product> => {
    const updated = await productService.update(id, dto)
    const withCat = { ...updated, category: categories.find((c) => c.idCategory === updated.categoryId) }
    setProducts((prev) => prev.map((p) => (p.idProduct === id ? withCat : p)))
    return withCat
  }

  const remove = async (id: number): Promise<void> => {
    await productService.delete(id)
    setProducts((prev) => prev.filter((p) => p.idProduct !== id))
  }

  return { products, categories, loading, error, refetch: fetchAll, create, update, remove }
}
