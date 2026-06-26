import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  BarChart2,
  FileText,
  LogOut,
  Leaf,
  UserCog,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products',   icon: Package,         label: 'Produtos' },
  { to: '/admin/categories', icon: FolderOpen,      label: 'Categorias' },
  { to: '/admin/analytics',  icon: BarChart2,       label: 'Análises' },
  { to: '/admin/content',    icon: FileText,        label: 'Conteúdo' },
  { to: '/admin/profile',    icon: UserCog,         label: 'Meu Perfil' },
]

export function AdminSidebar() {
  const { logout, user } = useAuthStore()

  return (
    <aside className="w-64 h-full bg-[var(--primary)] flex flex-col shrink-0 overflow-y-auto">
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold font-display text-sm leading-tight truncate">
              Aldeia Admin
            </p>
            <p className="text-white/60 text-xs font-ui truncate">
              {user?.name ?? user?.email ?? 'Administrador'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Menu administrativo">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold font-ui transition-all duration-200',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold font-ui text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
