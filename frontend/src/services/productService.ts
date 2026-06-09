import api from './api'
import type { Product, CreateProductDto, UpdateProductDto } from '@/types'

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/product')
    return data
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/product/${id}`)
    return data
  },

  async search(name: string): Promise<Product[]> {
    const { data } = await api.get<Product[]>(`/product/search/${name}`)
    return data
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await api.post<Product>('/product', dto)
    return data
  },

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const { data } = await api.put<Product>(`/product/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product/${id}`)
  },
}
