import { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/adminService'
import { useAuthStore } from '@/store/authStore'
import type { AdminUser, UpdateAdminDto } from '@/types'

interface UseProfileReturn {
  profile: AdminUser | null
  loading: boolean
  saving: boolean
  error: string | null
  refresh: () => Promise<void>
  updateProfile: (dto: UpdateAdminDto) => Promise<AdminUser>
}

/**
 * Hook responsible for fetching and updating the currently authenticated
 * admin's own profile data.
 *
 * Strategy:
 * - Uses `req.user.idUser` from the JWT (available in authStore) to call
 *   `GET /admin/:id`, which returns the full admin record including `phone`.
 * - Updates via `PUT /admin/:id`, the backend enforces that id === loggedAdminId.
 */
export function useProfile(): UseProfileReturn {
  const { user, setAuth, token } = useAuthStore()
  const [profile, setProfile] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user?.idUser) return
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getById(user.idUser)
      setProfile(data)
    } catch (err) {
      setError('Não foi possível carregar os dados do perfil.')
    } finally {
      setLoading(false)
    }
  }, [user?.idUser])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateProfile = useCallback(
    async (dto: UpdateAdminDto): Promise<AdminUser> => {
      if (!user?.idUser) throw new Error('Usuário não autenticado')
      setSaving(true)
      try {
        const updated = await adminService.update(user.idUser, dto)
        setProfile(updated)
        // Keep the auth store in sync with the new name
        if (token) {
          setAuth(token, {
            ...user,
            name: updated.name ?? user.name,
          })
        }
        return updated
      } finally {
        setSaving(false)
      }
    },
    [user, token, setAuth]
  )

  return { profile, loading, saving, error, refresh, updateProfile }
}
