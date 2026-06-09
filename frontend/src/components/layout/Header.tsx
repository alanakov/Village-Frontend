import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { cn } from '@/utils/helpers';

const NAV_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/cultura', label: 'Nossa História', end: false },
  { to: '/produtos', label: 'Artesanato', end: false },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-[var(--border)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Aldeia Cultura Viva - Início">
            <div className="w-12 h-12 bg-[var(--secondary)] rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--foreground)] font-display leading-tight">Aldeia</span>
              <span className="text-xs text-[var(--muted-foreground)] font-ui leading-tight">Cultura Viva</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold font-ui transition-colors',
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary)]/8'
                      : 'text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)]'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-1 border-t border-[var(--border)] pt-4" aria-label="Navegação mobile">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-3 px-4 rounded-xl text-sm font-semibold font-ui transition-colors',
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary)]/8'
                      : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
