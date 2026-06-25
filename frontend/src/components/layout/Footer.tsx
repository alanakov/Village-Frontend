import { Link } from 'react-router-dom'
import { Leaf, Heart, MessageCircle, Lock } from 'lucide-react'
import { useInstitutionalStore } from '@/store/institutionalStore'
import { buildWhatsAppUrl } from '@/utils/helpers'

export function Footer() {
  const { content } = useInstitutionalStore()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--primary)] text-[var(--primary-foreground)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display">Aldeia Cultura Viva</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Preservando tradições ancestrais e compartilhando a riqueza cultural da nossa comunidade com o mundo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-ui text-sm uppercase tracking-wider opacity-70">Navegação</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Início' },
                { to: '/cultura', label: 'Nossa História' },
                { to: '/produtos', label: 'Artesanato' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm opacity-80 hover:opacity-100 hover:underline transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-ui text-sm uppercase tracking-wider opacity-70">Contato</h3>
            <a
              href={buildWhatsAppUrl(content.whatsappNumber, 'Olá! Gostaria de mais informações sobre os produtos da aldeia.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-60">
          <p>© {year} Aldeia Cultura Viva. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-3 h-3 fill-current" /> pela comunidade
            </p>
            {/* Link discreto para acesso administrativo */}
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              aria-label="Acesso à área administrativa"
            >
              <Lock className="w-3 h-3" />
              <span className="text-xs">Área administrativa</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
