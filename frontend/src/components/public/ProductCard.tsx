import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, buildWhatsAppUrl } from '@/utils/helpers';
import { useInstitutionalStore } from '@/store/institutionalStore';
import { getUploadUrl } from '@/services/api';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { content } = useInstitutionalStore();

  const handleWhatsApp = () => {
    const msg = `Olá! Tenho interesse no produto: *${product.name}* (R$ ${formatPrice(product.price)}). Poderia me passar mais informações?`;
    window.open(buildWhatsAppUrl(content.whatsappNumber, msg), '_blank');
  };

  return (
    <article className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] card-hover flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={getUploadUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary">{product.category.name}</Badge>
          </div>
        )}
        {product.size && (
          <div className="absolute top-3 right-3">
            <Badge variant="muted">{product.size}</Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-[var(--foreground)] mb-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-[var(--primary)] font-ui">
            {formatPrice(product.price)}
          </span>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={handleWhatsApp}
          className="w-full"
          aria-label={`Comprar ${product.name} via WhatsApp`}
        >
          <MessageCircle className="w-4 h-4" />
          Comprar via WhatsApp
        </Button>
      </div>
    </article>
  );
}
