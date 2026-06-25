import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const url = error.config?.url ?? ''
    // Don't redirect on auth/login — a 401 there means wrong credentials, not session expiry
    if (error.response?.status === 401 && !url.includes('/auth/login')) {
      useAuthStore.getState().logout()
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

export default api

export function getUploadUrl(pathOrFilename: string): string {
  if (!pathOrFilename) return ''
  if (pathOrFilename.startsWith('http')) return pathOrFilename
  const base = (import.meta.env.VITE_UPLOADS_URL as string) ?? 'http://localhost:8080/uploads'
  const filename = pathOrFilename.replace(/^\/uploads\//, '')
  return `${base}/${filename}`
}
