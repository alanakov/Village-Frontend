import { useState, useMemo } from 'react'

export type SortOrder = 'asc' | 'desc'

export interface PaginationConfig<T> {
  items: T[]
  pageSize?: number
  defaultSortKey?: keyof T
  defaultSortOrder?: SortOrder
}

export interface PaginationResult<T> {
  /** Items on the current page */
  paged: T[]
  /** Total count after filtering (passed from outside) */
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  sortKey: keyof T | null
  sortOrder: SortOrder
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setSort: (key: keyof T) => void
  goFirst: () => void
  goLast: () => void
  goPrev: () => void
  goNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

export function usePagination<T>(config: PaginationConfig<T>): PaginationResult<T> {
  const {
    items,
    pageSize: initialPageSize = 10,
    defaultSortKey = null,
    defaultSortOrder = 'asc',
  } = config

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState]  = useState(initialPageSize)
  const [sortKey, setSortKey]         = useState<keyof T | null>(defaultSortKey as keyof T | null)
  const [sortOrder, setSortOrder]     = useState<SortOrder>(defaultSortOrder)  
  const sorted = useMemo(() => {
    if (!sortKey) return items
    return [...items].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      let cmp = 0
      if (typeof va === 'string' && typeof vb === 'string') {
        cmp = va.localeCompare(vb, 'pt-BR', { sensitivity: 'base' })
      } else if (typeof va === 'number' && typeof vb === 'number') {
        cmp = va - vb
      } else {
        cmp = String(va).localeCompare(String(vb))
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [items, sortKey, sortOrder])

  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))  
  const safePage = Math.min(currentPage, totalPages)

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, safePage, pageSize])

  const setPage = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)))
  const setPageSize = (size: number) => { setPageSizeState(size); setCurrentPage(1) }

  const setSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  return {
    paged,
    totalCount,
    currentPage: safePage,
    totalPages,
    pageSize,
    sortKey,
    sortOrder,
    setPage,
    setPageSize,
    setSort,
    goFirst: () => setPage(1),
    goLast:  () => setPage(totalPages),
    goPrev:  () => setPage(safePage - 1),
    goNext:  () => setPage(safePage + 1),
    canGoPrev: safePage > 1,
    canGoNext: safePage < totalPages,
  }
}
