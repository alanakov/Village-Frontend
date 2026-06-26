import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  canGoPrev: boolean
  canGoNext: boolean
  goFirst: () => void
  goLast: () => void
  goPrev: () => void
  goNext: () => void
  /** Rótulo do item (singular). Padrão: 'item' */
  itemLabel?: string
  /** Rótulo do item (plural). Padrão: 'itens' */
  itemLabelPlural?: string
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24],
  canGoPrev,
  canGoNext,
  goFirst,
  goLast,
  goPrev,
  goNext,
  itemLabel = 'item',
  itemLabelPlural = 'itens',
  className,
}: PaginationProps) {
  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalCount)

  const btnBase =
    'flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'

  // Gera os números de página a exibir (janela deslizante de 5)
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    const delta = 2
    const range: number[] = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) range.push(i)

    pages.push(1)
    if (range[0] > 2) pages.push('...')
    pages.push(...range)
    if (range[range.length - 1] < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  if (totalCount === 0) return null

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3',
        className
      )}
    >
      {/* Contagem */}
      <p className="text-xs text-[var(--muted-foreground)] font-ui shrink-0">
        {from}–{to} de {totalCount}{' '}
        {totalCount === 1 ? itemLabel : itemLabelPlural}
      </p>

      {/* Controles centrais */}
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={goFirst} disabled={!canGoPrev} className={btnBase} title="Primeira página">
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={goPrev} disabled={!canGoPrev} className={btnBase} title="Página anterior">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center w-8 h-8 text-xs text-[var(--muted-foreground)] font-ui"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => typeof p === 'number' && onPageChange(p)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold font-ui transition-all',
                p === currentPage
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
              )}
              disabled={p === currentPage}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button onClick={goNext} disabled={!canGoNext} className={btnBase} title="Próxima página">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={goLast} disabled={!canGoNext} className={btnBase} title="Última página">
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Itens por página */}
      {onPageSizeChange && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs font-ui border border-[var(--border)] rounded-lg px-2 py-1.5 bg-white text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] shrink-0"
          title="Itens por página"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s} por página
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
