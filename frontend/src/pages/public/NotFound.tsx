import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-[var(--primary)]/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)] mb-4">
          Página não encontrada
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold font-ui text-base hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
        >
          <Home className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
