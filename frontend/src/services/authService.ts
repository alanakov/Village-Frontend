import api from './api'
import type { LoginCredentials, LoginResponse, ProfileResponse } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ProfileResponse>('/auth/profile')
    return data
  },
}
