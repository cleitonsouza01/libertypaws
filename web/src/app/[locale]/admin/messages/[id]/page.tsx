'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { updateMessageStatus, updateMessageNotes } from '@/lib/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { ArrowLeft, Mail, Phone, Clock } from 'lucide-react'
import type { AdminContactMessage, MessageStatus } from '@/types/admin'

export default function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.messages')
  const [msg, setMsg] = useState<AdminContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setMsg(data as unknown as AdminContactMessage)
        setNotes(data.admin_notes ?? '')
        // Mark as read if unread
        if (data.status === 'unread') {
          await updateMessageStatus(supabase, id, 'read')
          setMsg((m) => m ? { ...m, status: 'read' } : m)
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleStatusChange(status: MessageStatus) {
    if (!msg) return
    setSaving(true)
    const supabase = createClient()
    await updateMessageStatus(supabase, msg.id, status)
    setMsg({ ...msg, status })
    setSaving(false)
  }

  async function handleSaveNotes() {
    if (!msg) return
    setSaving(true)
    const supabase = createClient()
    await updateMessageNotes(supabase, msg.id, notes)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!msg) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/messages" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/messages" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{msg.subject}</h1>
        <StatusBadge status={msg.status} />
      </div>

      {/* Sender info */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium">{msg.name}</span>
            <span className="inline-flex items-center gap-1 text-base-content/60">
              <Mail className="h-3 w-3" /> {msg.email}
            </span>
            {msg.phone && (
              <span className="inline-flex items-center gap-1 text-base-content/60">
                <Phone className="h-3 w-3" /> {msg.phone}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-base-content/60">
              <Clock className="h-3 w-3" /> {new Date(msg.created_at).toLocaleString()}
            </span>
          </div>

          <div className="divider my-2" />

          <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {msg.status !== 'replied' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusChange('replied')}
            disabled={saving}
          >
            {t('markReplied')}
          </button>
        )}
        {msg.status !== 'closed' && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleStatusChange('closed')}
            disabled={saving}
          >
            {t('close')}
          </button>
        )}
      </div>

      {/* Admin notes */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">{t('adminNotes')}</h3>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
          />
          <div className="card-actions justify-end">
            <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs" /> : t('saveNotes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
