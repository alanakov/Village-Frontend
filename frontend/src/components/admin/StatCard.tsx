import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  colorClass?: string
  trend?: string
}

export function StatCard({ title, value, icon: Icon, colorClass = 'bg-[var(--primary)]', trend }: StatCardProps) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-ui">
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-[var(--card-foreground)] mb-1 font-display">{value}</div>
      <div className="text-sm text-[var(--muted-foreground)] font-ui">{title}</div>
    </div>
  )
}
