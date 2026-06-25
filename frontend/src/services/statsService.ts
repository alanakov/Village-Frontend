import api from './api'
import type { SectionStat, StatsDto, CreateStatDto } from '@/types'

export const statsService = {
  async getAll(): Promise<SectionStat[]> {
    const { data } = await api.get<SectionStat[]>('/stats')
    return data
  },

  async getById(id: number): Promise<SectionStat> {
    const { data } = await api.get<SectionStat>(`/stats/${id}`)
    return data
  },

  async create(dto: CreateStatDto): Promise<SectionStat> {
    const { data } = await api.post<SectionStat>('/stats', dto)
    return data
  },

  async update(id: number, dto: StatsDto): Promise<SectionStat> {
    const { data } = await api.put<SectionStat>(`/stats/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/stats/${id}`)
  },
}
