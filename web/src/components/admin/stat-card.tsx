'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('stat', className)}>
      <div className="stat-figure text-primary">
        <Icon className="inline-block h-8 w-8" />
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-2xl">{value}</div>
      {trend && (
        <div className={cn('stat-desc', trend.value >= 0 ? 'text-success' : 'text-error')}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </div>
      )}
    </div>
  )
}
