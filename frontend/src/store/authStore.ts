import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUserResponse, AuthState } from '@/types'

interface AuthActions {
  setAuth: (token: string, user: AuthUserResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'aldeia-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) state.isAuthenticated = true
      },
    }
  )
)
