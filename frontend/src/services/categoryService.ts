import api from './api'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/category')
    return data
  },

  async getById(id: number): Promise<Category> {
    const { data } = await api.get<Category>(`/category/${id}`)
    return data
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const { data } = await api.post<Category>('/category', dto)
    return data
  },

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const { data } = await api.put<Category>(`/category/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/category/${id}`)
  },
}
