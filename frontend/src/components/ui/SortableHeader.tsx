import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { SortOrder } from '@/hooks/usePagination'

interface SortableHeaderProps {
  label: string
  sortKey: string
  activeSortKey: string | null
  sortOrder: SortOrder
  onSort: (key: string) => void
  className?: string
}

export function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortOrder,
  onSort,
  className,
}: SortableHeaderProps) {
  const isActive = activeSortKey === sortKey

  return (
    <th
      className={cn(
        'text-left py-3 px-5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider font-ui whitespace-nowrap',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors group"
        title={`Ordenar por ${label}`}
      >
        {label}
        <span className={cn('transition-opacity', isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50')}>
          {isActive ? (
            sortOrder === 'asc'
              ? <ArrowUp className="w-3 h-3" />
              : <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUpDown className="w-3 h-3" />
          )}
        </span>
      </button>
    </th>
  )
}
