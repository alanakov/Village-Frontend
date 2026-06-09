import { useState, useEffect, useCallback } from 'react'
import { categoryService } from '@/services/categoryService'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch {
      setError('Erro ao carregar categorias.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (dto: CreateCategoryDto): Promise<Category> => {
    const created = await categoryService.create(dto)
    setCategories((prev) => [...prev, created])
    return created
  }

  const update = async (id: number, dto: UpdateCategoryDto): Promise<Category> => {
    const updated = await categoryService.update(id, dto)
    setCategories((prev) =>
      prev.map((c) => (c.idCategory === id ? updated : c))
    )
    return updated
  }

  const remove = async (id: number): Promise<void> => {
    await categoryService.delete(id)
    setCategories((prev) => prev.filter((c) => c.idCategory !== id))
  }

  return { categories, loading, error, refetch: fetchAll, create, update, remove }
}
