'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchUserDetail } from '@/lib/admin/queries'
import { ArrowLeft, Mail, Globe } from 'lucide-react'
import type { AdminProfile } from '@/types/admin'

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.users')
  const [user, setUser] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchUserDetail(supabase, id)
      setUser(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/users" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('detail')}</h1>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="avatar avatar-placeholder">
              <div className="bg-primary text-primary-content w-14 rounded-full">
                <span className="text-lg">
                  {user.full_name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) ?? '??'}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.full_name}</h2>
              <div className="flex items-center gap-4 text-sm text-base-content/60">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {user.locale?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-base-content/40 uppercase">{t('joined')}</p>
              <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-base-content/40 uppercase">{t('lastUpdated')}</p>
              <p className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
