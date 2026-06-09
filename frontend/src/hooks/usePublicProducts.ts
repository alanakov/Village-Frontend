import { useState, useEffect } from 'react'
import { publicApi } from '@/lib/publicApi'
import type { Product, Category } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'

const MOCK_PRODUCTS: Product[] = [
  {
    idProduct: 1,
    name: 'Cesto Artesanal Tradicional',
    description: 'Cesto trançado à mão com fibras naturais da floresta.',
    price: 120, size: 'M', categoryId: 1,
    category: { idCategory: 1, name: 'Cestaria' },
    imageUrl: 'https://images.unsplash.com/photo-1768902406144-a348c559c73c?w=600&q=80',
  },
  {
    idProduct: 2,
    name: 'Cerâmica Decorativa',
    description: 'Peça única de cerâmica feita com barro natural.',
    price: 85, size: 'P', categoryId: 2,
    category: { idCategory: 2, name: 'Cerâmica' },
    imageUrl: 'https://images.unsplash.com/photo-1682668701024-b6508708a764?w=600&q=80',
  },
  {
    idProduct: 3,
    name: 'Colar de Sementes',
    description: 'Colar tradicional feito com sementes naturais da floresta.',
    price: 65, size: 'único', categoryId: 3,
    category: { idCategory: 3, name: 'Adornos' },
    imageUrl: 'https://images.unsplash.com/photo-1756792339487-d044709b27f2?w=600&q=80',
  },
  {
    idProduct: 4,
    name: 'Cocar de Penas',
    description: 'Cocar cerimonial decorativo com penas naturais.',
    price: 200, size: 'G', categoryId: 3,
    category: { idCategory: 3, name: 'Adornos' },
    imageUrl: 'https://images.unsplash.com/photo-1699793813622-d67573c37fcf?w=600&q=80',
  },
  {
    idProduct: 5,
    name: 'Tecido Tradicional',
    description: 'Tecido artesanal com padrões tradicionais da aldeia.',
    price: 150, size: '2mx1m', categoryId: 4,
    category: { idCategory: 4, name: 'Tecelagem' },
    imageUrl: 'https://images.unsplash.com/photo-1769358720638-932b3dd8101a?w=600&q=80',
  },
  {
    idProduct: 6,
    name: 'Peneira Artesanal',
    description: 'Peneira tradicional trançada com fibras naturais.',
    price: 75, size: 'G', categoryId: 1,
    category: { idCategory: 1, name: 'Cestaria' },
    imageUrl: 'https://images.unsplash.com/photo-1768902406144-a348c559c73c?w=600&q=80',
  },
]

function resolveCategories(prods: Product[], cats: Category[]): Product[] {
  const catMap = new Map(cats.map((c) => [c.idCategory, c]))
  return prods.map((p) => ({ ...p, category: p.category ?? catMap.get(p.categoryId) }))
}

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (isAuthenticated && token) {
      Promise.all([productService.getAll(), categoryService.getAll()])
        .then(([prods, cats]) => setProducts(resolveCategories(prods, cats)))
        .catch(() => setProducts(MOCK_PRODUCTS))
        .finally(() => setLoading(false))
    } else {
      Promise.all([
        publicApi.get<Product[]>('/product').then((r) => r.data),
        publicApi.get<Category[]>('/category').then((r) => r.data),
      ])
        .then(([prods, cats]) => setProducts(resolveCategories(prods, cats)))
        .catch(() => setProducts(MOCK_PRODUCTS))
        .finally(() => setLoading(false))
    }
  }, [isAuthenticated, token])

  return { products, loading }
}
