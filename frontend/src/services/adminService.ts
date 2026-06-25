import api from './api'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types'

export interface ResetPasswordDto {
  email: string
  recoveryCode: string
  newPassword: string
}

export interface InviteValidationResponse {
  valid: boolean
  email: string
}

export const adminService = {
  async getAll(): Promise<AdminUser[]> {
    const { data } = await api.get<AdminUser[]>('/admin')
    return data
  },

  async getById(id: number): Promise<AdminUser> {
    const { data } = await api.get<AdminUser>(`/admin/${id}`)
    return data
  },

  async create(dto: CreateAdminDto & { inviteToken: string }): Promise<AdminUser> {
    const { data } = await api.post<AdminUser>('/admin', dto)
    return data
  },

  async update(id: number, dto: UpdateAdminDto): Promise<AdminUser> {
    const { data } = await api.put<AdminUser>(`/admin/${id}`, dto)
    return data
  },

  /**
   * POST /api/admin/invite (autenticado)
   * Envia convite por e-mail para um novo administrador.
   */
  async sendInvite(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/admin/invite', { email })
    return data
  },

  /**
   * POST /api/admin/invite/validate
   * Verifica se o token de convite é válido e retorna o e-mail vinculado.
   */
  async validateInviteToken(token: string): Promise<InviteValidationResponse> {
    const { data } = await api.post<InviteValidationResponse>('/admin/invite/validate', { token })
    return data
  },

  async recoverPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/admin/recover-password', { email })
    return data
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/admin/reset-password', dto)
    return data
  },
}
