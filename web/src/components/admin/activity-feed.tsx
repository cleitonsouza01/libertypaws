'use client'

import { useTranslations } from 'next-intl'
import { ShoppingBag, PawPrint, MessageSquare, Star } from 'lucide-react'
import type { ActivityItem } from '@/types/admin'

const iconMap = {
  order: ShoppingBag,
  registration: PawPrint,
  message: MessageSquare,
  review: Star,
}

const colorMap = {
  order: 'text-info',
  registration: 'text-success',
  message: 'text-warning',
  review: 'text-primary',
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const t = useTranslations('admin.dashboard')

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-base-content/60">
        {t('noRecentActivity')}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const Icon = iconMap[item.type]
        return (
          <li key={item.id} className="flex items-start gap-3">
            <div className={`mt-0.5 ${colorMap[item.type]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-base-content/60">{item.description}</p>
            </div>
            <time className="shrink-0 text-xs text-base-content/40">
              {new Date(item.timestamp).toLocaleDateString()}
            </time>
          </li>
        )
      })}
    </ul>
  )
}
