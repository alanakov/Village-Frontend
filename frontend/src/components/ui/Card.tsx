import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/helpers'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--border)]',
        hoverable && 'card-hover',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0 border-t border-[var(--border)]', className)} {...props} />
  )
}
