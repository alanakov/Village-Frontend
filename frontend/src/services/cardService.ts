import api from './api'
import type { SectionCard, CardDto, CreateCardDto } from '@/types'

export const cardService = {
  async getAll(): Promise<SectionCard[]> {
    const { data } = await api.get<SectionCard[]>('/card')
    return data
  },

  async getById(id: number): Promise<SectionCard> {
    const { data } = await api.get<SectionCard>(`/card/${id}`)
    return data
  },

  async create(dto: CreateCardDto): Promise<SectionCard> {
    const { data } = await api.post<SectionCard>('/card', dto)
    return data
  },

  async update(id: number, dto: CardDto): Promise<SectionCard> {
    const { data } = await api.put<SectionCard>(`/card/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/card/${id}`)
  },
}
