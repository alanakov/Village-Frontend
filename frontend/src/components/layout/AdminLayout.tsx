import { Outlet, Navigate } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { useAuthStore } from '@/store/authStore'

export function AdminLayout() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <AdminSidebar />

      <div className="flex-1 min-w-0 overflow-y-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
