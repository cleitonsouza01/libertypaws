'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { updateCoupon } from '@/lib/admin/actions'
import { ArrowLeft } from 'lucide-react'
import type { AdminCoupon } from '@/types/admin'

export default function AdminEditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.coupons')
  const router = useRouter()
  const [coupon, setCoupon] = useState<AdminCoupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('coupons').select('*').eq('id', id).single()
      if (data) setCoupon(data as unknown as AdminCoupon)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!coupon) return
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)

    const data: Record<string, unknown> = {
      code: (form.get('code') as string).toUpperCase().trim(),
      description: form.get('description') as string,
      discount_type: form.get('discount_type') as string,
      discount_value: parseFloat(form.get('discount_value') as string),
      is_active: form.get('is_active') === 'on',
    }

    const minOrder = form.get('min_order_amount') as string
    data.min_order_amount = minOrder ? parseFloat(minOrder) : null

    const maxUses = form.get('max_uses') as string
    data.max_uses = maxUses ? parseInt(maxUses, 10) : null

    const validFrom = form.get('valid_from') as string
    data.valid_from = validFrom ? new Date(validFrom).toISOString() : null

    const validUntil = form.get('valid_until') as string
    data.valid_until = validUntil ? new Date(validUntil).toISOString() : null

    try {
      const supabase = createClient()
      await updateCoupon(supabase, coupon.id, data)
      router.push('/admin/coupons')
    } catch {
      setError(t('saveError'))
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!coupon) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/coupons" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  const toDateStr = (iso: string | null) => iso ? iso.split('T')[0] : ''

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/coupons" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('editCoupon')}</h1>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('code')}</legend>
                <input
                  name="code"
                  type="text"
                  className="input input-bordered w-full font-mono uppercase"
                  defaultValue={coupon.code}
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('discountType')}</legend>
                <select
                  name="discount_type"
                  className="select select-bordered w-full"
                  defaultValue={coupon.discount_type}
                  required
                >
                  <option value="percentage">{t('percentage')}</option>
                  <option value="fixed_amount">{t('fixedAmount')}</option>
                </select>
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('description')}</legend>
              <input
                name="description"
                type="text"
                className="input input-bordered w-full"
                defaultValue={coupon.description}
                required
              />
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('discountValue')}</legend>
                <input
                  name="discount_value"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  defaultValue={coupon.discount_value}
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('minOrder')}</legend>
                <input
                  name="min_order_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  defaultValue={coupon.min_order_amount ?? ''}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('maxUses')}</legend>
                <input
                  name="max_uses"
                  type="number"
                  min="0"
                  className="input input-bordered w-full"
                  defaultValue={coupon.max_uses ?? ''}
                />
              </fieldset>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('startsAt')}</legend>
                <input
                  name="valid_from"
                  type="date"
                  className="input input-bordered w-full"
                  defaultValue={toDateStr(coupon.valid_from)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('expiresAt')}</legend>
                <input
                  name="valid_until"
                  type="date"
                  className="input input-bordered w-full"
                  defaultValue={toDateStr(coupon.valid_until)}
                />
              </fieldset>
            </div>

            <div className="flex items-center gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  className="toggle toggle-primary"
                  defaultChecked={coupon.is_active}
                />
                {t('active')}
              </label>
              <p className="text-sm text-base-content/60">
                {t('currentUses')}: {coupon.current_uses}
              </p>
            </div>

            <div className="card-actions justify-end">
              <Link href="/admin/coupons" className="btn btn-ghost">{t('cancel')}</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm" /> : t('save')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
