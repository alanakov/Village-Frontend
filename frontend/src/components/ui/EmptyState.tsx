import { PackageSearch } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Não há itens para exibir no momento.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="text-[var(--muted-foreground)] mb-4">
        {icon ?? <PackageSearch className="w-12 h-12 mx-auto opacity-40" />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
