'use client'

import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  // Orders
  pending: 'badge-warning',
  paid: 'badge-info',
  processing: 'badge-info',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  completed: 'badge-success',
  cancelled: 'badge-error',
  refunded: 'badge-ghost',
  failed: 'badge-error',
  // Registrations
  pending_review: 'badge-warning',
  active: 'badge-success',
  suspended: 'badge-error',
  revoked: 'badge-error',
  expired: 'badge-ghost',
  // Messages
  new: 'badge-warning',
  read: 'badge-info',
  replied: 'badge-success',
  closed: 'badge-ghost',
}

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] ?? 'badge-ghost'

  return (
    <span className={cn('badge badge-sm', colorClass, className)}>
      {label ?? status.replace(/_/g, ' ')}
    </span>
  )
}
