import api from './api'
import type { SectionContent, ContentDto } from '@/types'

export const contentService = {
  async getAll(): Promise<SectionContent[]> {
    const { data } = await api.get<SectionContent[]>('/content')
    return data
  },

  async getById(id: number): Promise<SectionContent> {
    const { data } = await api.get<SectionContent>(`/content/${id}`)
    return data
  },

  async update(id: number, dto: ContentDto): Promise<SectionContent> {
    const { data } = await api.put<SectionContent>(`/content/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/content/${id}`)
  },
}
