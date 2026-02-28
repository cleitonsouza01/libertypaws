'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { createCoupon } from '@/lib/admin/actions'
import { ArrowLeft } from 'lucide-react'

export default function AdminNewCouponPage() {
  const t = useTranslations('admin.coupons')
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)

    const data: Record<string, unknown> = {
      code: (form.get('code') as string).toUpperCase().trim(),
      description: form.get('description') as string,
      discount_type: form.get('discount_type') as string,
      discount_value: parseFloat(form.get('discount_value') as string),
      is_active: form.get('is_active') === 'on',
      current_uses: 0,
    }

    const minOrder = form.get('min_order_amount') as string
    if (minOrder) data.min_order_amount = parseFloat(minOrder)

    const maxUses = form.get('max_uses') as string
    if (maxUses) data.max_uses = parseInt(maxUses, 10)

    const validFrom = form.get('valid_from') as string
    if (validFrom) data.valid_from = new Date(validFrom).toISOString()

    const validUntil = form.get('valid_until') as string
    if (validUntil) data.valid_until = new Date(validUntil).toISOString()

    try {
      const supabase = createClient()
      await createCoupon(supabase, data)
      router.push('/admin/coupons')
    } catch {
      setError(t('saveError'))
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/coupons" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('addCoupon')}</h1>
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
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('discountType')}</legend>
                <select name="discount_type" className="select select-bordered w-full" required>
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
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('maxUses')}</legend>
                <input
                  name="max_uses"
                  type="number"
                  min="0"
                  className="input input-bordered w-full"
                />
              </fieldset>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('startsAt')}</legend>
                <input name="valid_from" type="date" className="input input-bordered w-full" />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('expiresAt')}</legend>
                <input name="valid_until" type="date" className="input input-bordered w-full" />
              </fieldset>
            </div>

            <label className="label cursor-pointer gap-2 w-fit">
              <input type="checkbox" name="is_active" className="toggle toggle-primary" defaultChecked />
              {t('active')}
            </label>

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
