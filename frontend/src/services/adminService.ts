import api from './api'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types'

export interface ResetPasswordDto {
  email: string
  recoveryCode: string
  newPassword: string
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

  async create(dto: CreateAdminDto): Promise<AdminUser> {
    const { data } = await api.post<AdminUser>('/admin', dto)
    return data
  },

  async update(id: number, dto: UpdateAdminDto): Promise<AdminUser> {
    const { data } = await api.put<AdminUser>(`/admin/${id}`, dto)
    return data
  },

  /**
   * POST /api/admin/recover-password
   * Gera um código numérico de 6 dígitos, armazena no Redis por 15 min
   * e envia por e-mail para o administrador.
   * Responde: { message: 'Código de recuperação enviado para o e-mail informado' }
   */
  async recoverPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/admin/recover-password', { email })
    return data
  },

  /**
   * POST /api/admin/reset-password
   * Valida o código recebido por e-mail, verifica os requisitos de senha
   * e persiste a nova senha com hash bcrypt.
   * Responde: { message: 'Senha redefinida com sucesso' }
   */
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/admin/reset-password', dto)
    return data
  },
}
