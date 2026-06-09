import { cn } from '@/utils/helpers';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
  accent: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  muted: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-ui',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
