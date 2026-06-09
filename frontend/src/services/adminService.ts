import api from './api'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types'

export const adminService = {
  async getAll(): Promise<AdminUser[]> {
    const { data } = await api.get<AdminUser[]>('/admin')
    return data
  },

  async getById(id: number): Promise<AdminUser> {
    const { data } = await api.get<AdminUser>(`/admin/${id}`)
    return data
  },

  async create(dto: CreateAdminDto): Promise<AdminUser> {
    const { data } = await api.post<AdminUser>('/admin', dto)
    return data
  },

  async update(id: number, dto: UpdateAdminDto): Promise<AdminUser> {
    const { data } = await api.put<AdminUser>(`/admin/${id}`, dto)
    return data
  },
}
