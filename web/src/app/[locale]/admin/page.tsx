'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { fetchDashboardStats, fetchRecentActivity } from '@/lib/admin/queries'
import { StatCard } from '@/components/admin/stat-card'
import { ActivityFeed } from '@/components/admin/activity-feed'
import {
  Users,
  ShoppingBag,
  PawPrint,
  MessageSquare,
  DollarSign,
  Briefcase,
  Ticket,
  AlertCircle,
} from 'lucide-react'
import type { DashboardStats, ActivityItem } from '@/types/admin'

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [statsData, activityData] = await Promise.all([
        fetchDashboardStats(supabase),
        fetchRecentActivity(supabase),
      ])
      setStats(statsData)
      setActivity(activityData)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary">{t('title')}</h1>

      {/* Stats grid */}
      <div className="stats stats-vertical bg-base-200 w-full shadow-sm lg:stats-horizontal">
        <StatCard title={t('totalUsers')} value={stats.totalUsers} icon={Users} />
        <StatCard title={t('totalOrders')} value={stats.totalOrders} icon={ShoppingBag} />
        <StatCard title={t('totalRevenue')} value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title={t('unreadMessages')} value={stats.unreadMessages} icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Secondary stats */}
        <div className="stats stats-vertical bg-base-200 w-full shadow-sm">
          <StatCard title={t('pendingRegistrations')} value={stats.pendingRegistrations} icon={AlertCircle} />
          <StatCard title={t('totalRegistrations')} value={stats.totalRegistrations} icon={PawPrint} />
          <StatCard title={t('activeServices')} value={stats.activeServices} icon={Briefcase} />
          <StatCard title={t('activeCoupons')} value={stats.activeCoupons} icon={Ticket} />
        </div>

        {/* Activity feed */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">{t('recentActivity')}</h2>
            <ActivityFeed items={activity} />
          </div>
        </div>
      </div>
    </div>
  )
}
