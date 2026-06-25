import api from './api'
import type { SectionButton, ButtonDto, CreateButtonDto } from '@/types'

export const buttonService = {
  async getAll(): Promise<SectionButton[]> {
    const { data } = await api.get<SectionButton[]>('/button')
    return data
  },

  async getById(id: number): Promise<SectionButton> {
    const { data } = await api.get<SectionButton>(`/button/${id}`)
    return data
  },

  async create(dto: CreateButtonDto): Promise<SectionButton> {
    const { data } = await api.post<SectionButton>('/button', dto)
    return data
  },

  async update(id: number, dto: ButtonDto): Promise<SectionButton> {
    const { data } = await api.put<SectionButton>(`/button/${id}`, dto)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/button/${id}`)
  },
}
