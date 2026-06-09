import api from './api'
import type { LoginCredentials, LoginResponse, ProfileResponse } from '@/types'

export const authService = {
  /** POST /api/auth/login → { message, token, user } */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  /** GET /api/auth/profile → { message, user } */
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ProfileResponse>('/auth/profile')
    return data
  },

  /** POST /api/auth/check-email */
  async checkEmail(email: string): Promise<{ exists: boolean; userType?: string }> {
    const { data } = await api.post<{ exists: boolean; userType?: string }>(
      '/auth/check-email',
      { email }
    )
    return data
  },
}
