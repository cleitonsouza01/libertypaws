'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchOrderDetail } from '@/lib/admin/queries'
import { updateOrderStatus, updateOrderAdminNotes } from '@/lib/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ArrowLeft, Mail, User } from 'lucide-react'
import type { AdminOrder, AdminOrderItem, OrderStatus } from '@/types/admin'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled', 'failed'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['completed', 'refunded'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
  failed: [],
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.orders')
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [items, setItems] = useState<AdminOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const result = await fetchOrderDetail(supabase, id)
      if (result) {
        setOrder(result.order)
        setItems(result.items)
        setNotes(result.order.admin_notes ?? '')
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return
    setSaving(true)
    const supabase = createClient()
    await updateOrderStatus(supabase, order.id, newStatus)
    setOrder({ ...order, status: newStatus })
    setConfirmStatus(null)
    setSaving(false)
  }

  async function handleSaveNotes() {
    if (!order) return
    setSaving(true)
    const supabase = createClient()
    await updateOrderAdminNotes(supabase, order.id, notes)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/orders" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  const allowedTransitions = TRANSITIONS[order.status] ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">
          {t('orderNumber')} #{order.order_number}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      {/* Customer info */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">{t('customer')}</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" /> {order.user_name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" /> {order.user_email}
            </span>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">{t('items')}</h3>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>{t('itemName')}</th>
                  <th>{t('qty')}</th>
                  <th>{t('unitPrice')}</th>
                  <th>{t('subtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.service_name}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.unit_price).toFixed(2)}</td>
                    <td>${Number(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">{t('total')}</td>
                  <td className="font-bold">${Number(order.total_amount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Status actions */}
      {allowedTransitions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allowedTransitions.map((status) => (
            <button
              key={status}
              className={`btn btn-sm ${status === 'cancelled' ? 'btn-error' : 'btn-primary'}`}
              onClick={() => setConfirmStatus(status)}
              disabled={saving}
            >
              {t(`actions.${status}`)}
            </button>
          ))}
        </div>
      )}

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

      {/* Confirm status change dialog */}
      <ConfirmDialog
        open={!!confirmStatus}
        title={t('confirmStatusChange')}
        message={t('confirmStatusMessage', { status: confirmStatus ?? '' })}
        variant={confirmStatus === 'cancelled' ? 'error' : 'primary'}
        onConfirm={() => confirmStatus && handleStatusChange(confirmStatus)}
        onCancel={() => setConfirmStatus(null)}
      />
    </div>
  )
}
