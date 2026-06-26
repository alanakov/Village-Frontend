import { useState, useEffect } from 'react'
import { publicApi } from '@/lib/publicApi'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { resolveProductCategories } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import type { Product, Category } from '@/types'

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token           = useAuthStore((s) => s.token)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetch = isAuthenticated && token
      ? Promise.all([productService.getAll(), categoryService.getAll()])
      : Promise.all([
          publicApi.get<Product[]>('/product').then((r) => r.data),
          publicApi.get<Category[]>('/category').then((r) => r.data),
        ])

    fetch
      .then(([prods, cats]) => setProducts(resolveProductCategories(prods, cats)))
      .catch(() => {
        setProducts([])
        setError('Não foi possível carregar os produtos.')
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, token])

  return { products, loading, error }
}
