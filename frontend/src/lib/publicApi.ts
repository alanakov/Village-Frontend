import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8080/api'

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8_000,
})

publicApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
