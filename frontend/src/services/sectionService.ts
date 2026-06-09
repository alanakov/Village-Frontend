import api from './api'
import type {
  Section,
  CreateSectionDto,
  UpdateSectionDto,
  CreateFullSectionDto,
} from '@/types'

export const sectionService = {
  async getAll(): Promise<Section[]> {
    const { data } = await api.get<Section[]>('/section')
    return data
  },

  async getById(id: number): Promise<Section> {
    const { data } = await api.get<Section>(`/section/${id}`)
    return data
  },

  async create(dto: CreateSectionDto): Promise<Section> {
    const { data } = await api.post<Section>('/section', dto)
    return data
  },

  async update(id: number, dto: UpdateSectionDto): Promise<Section> {
    const { data } = await api.put<Section>(`/section/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/section/${id}`)
  },

  async getAllFull(): Promise<Section[]> {
    const { data } = await api.get<Section[]>('/full/section')
    return data
  },

  async getFullById(id: number): Promise<Section> {
    const { data } = await api.get<Section>(`/full/section/${id}`)
    return data
  },

  async createFull(dto: CreateFullSectionDto): Promise<{ message: string; section: Section }> {
    const { data } = await api.post<{ message: string; section: Section }>('/full/section', dto)
    return data
  },
}
