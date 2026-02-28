'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchRegistrationDetail } from '@/lib/admin/queries'
import { approveRegistration, rejectRegistration, updateRegistrationStatus } from '@/lib/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ArrowLeft, Mail, User, PawPrint } from 'lucide-react'
import type { AdminRegistration, RegistrationStatus } from '@/types/admin'

export default function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.registrations')
  const [reg, setReg] = useState<AdminRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'suspend' | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchRegistrationDetail(supabase, id)
      setReg(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleAction(action: 'approve' | 'reject' | 'suspend') {
    if (!reg) return
    setSaving(true)
    const supabase = createClient()

    if (action === 'approve') {
      await approveRegistration(supabase, reg.id)
      setReg({ ...reg, status: 'active' })
    } else if (action === 'reject') {
      await rejectRegistration(supabase, reg.id)
      setReg({ ...reg, status: 'revoked' })
    } else if (action === 'suspend') {
      await updateRegistrationStatus(supabase, reg.id, 'suspended')
      setReg({ ...reg, status: 'suspended' })
    }

    setConfirmAction(null)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!reg) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/registrations" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/registrations" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">
          {t('regNumber')} {reg.registration_number}
        </h1>
        <StatusBadge status={reg.status} />
      </div>

      {/* Pet info */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">
            <PawPrint className="h-5 w-5 text-primary" />
            {t('petInfo')}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-base-content/40">{t('petName')}</p>
              <p className="text-sm font-medium">{reg.pet_name}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-base-content/40">{t('petType')}</p>
              <p className="text-sm">{reg.pet_species}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-base-content/40">{t('breed')}</p>
              <p className="text-sm">{reg.pet_breed}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-base-content/40">{t('type')}</p>
              <span className="badge badge-sm badge-outline">{reg.registration_type.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-base-content/40">{t('date')}</p>
              <p className="text-sm">{new Date(reg.created_at).toLocaleDateString()}</p>
            </div>
            {reg.expiry_date && (
              <div>
                <p className="text-xs font-medium uppercase text-base-content/40">{t('expires')}</p>
                <p className="text-sm">{new Date(reg.expiry_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Owner info */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">{t('owner')}</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" /> {reg.user_name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" /> {reg.user_email}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {reg.status === 'pending_review' && (
          <>
            <button
              className="btn btn-success btn-sm"
              onClick={() => setConfirmAction('approve')}
              disabled={saving}
            >
              {t('approve')}
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() => setConfirmAction('reject')}
              disabled={saving}
            >
              {t('reject')}
            </button>
          </>
        )}
        {reg.status === 'active' && (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => setConfirmAction('suspend')}
            disabled={saving}
          >
            {t('suspend')}
          </button>
        )}
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={t(`confirm.${confirmAction ?? 'approve'}.title`)}
        message={t(`confirm.${confirmAction ?? 'approve'}.message`)}
        variant={confirmAction === 'approve' ? 'primary' : 'error'}
        onConfirm={() => confirmAction && handleAction(confirmAction)}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  )
}
