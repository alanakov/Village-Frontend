import api from './api'
import type { SectionImage, UpdateImageDto } from '@/types'

export const imageService = {
  async getAll(): Promise<SectionImage[]> {
    const { data } = await api.get<SectionImage[]>('/images')
    return data
  },

  async getById(id: number): Promise<SectionImage> {
    const { data } = await api.get<SectionImage>(`/images/${id}`)
    return data
  },

  async create(altText: string, sectionId: number, file: File): Promise<SectionImage> {
    const form = new FormData()
    form.append('altText', altText)
    form.append('sectionId', String(sectionId))
    form.append('file', file)
    const { data } = await api.post<SectionImage>('/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async update(id: number, dto: UpdateImageDto, file?: File): Promise<SectionImage> {
    const form = new FormData()
    if (dto.altText !== undefined) form.append('altText', dto.altText)
    if (file) form.append('file', file)
    const { data } = await api.patch<SectionImage>(`/images/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/images/${id}`)
  },
}
