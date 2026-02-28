'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { createService } from '@/lib/admin/actions'
import { ArrowLeft } from 'lucide-react'

export default function AdminNewServicePage() {
  const t = useTranslations('admin.services')
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const featuresRaw = (form.get('features') as string) ?? ''
    const tagsRaw = (form.get('tags') as string) ?? ''

    const data = {
      name: form.get('name') as string,
      slug: (form.get('name') as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.get('description') as string,
      price: parseFloat(form.get('price') as string),
      currency: 'USD',
      category: form.get('category') as string,
      is_active: form.get('is_active') === 'on',
      is_featured: form.get('is_featured') === 'on',
      features: featuresRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsRaw.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      const supabase = createClient()
      await createService(supabase, data)
      router.push('/admin/services')
    } catch {
      setError(t('saveError'))
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('addService')}</h1>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            {/* Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('name')}</legend>
              <input
                name="name"
                type="text"
                className="input input-bordered w-full"
                required
              />
            </fieldset>

            {/* Description */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('description')}</legend>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                rows={4}
                required
              />
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Price */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('price')}</legend>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  required
                />
              </fieldset>

              {/* Category */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('category')}</legend>
                <select name="category" className="select select-bordered w-full" required>
                  <option value="esa">ESA</option>
                  <option value="psd">PSD</option>
                  <option value="documents">Documents</option>
                  <option value="accessories">Accessories</option>
                </select>
              </fieldset>
            </div>

            {/* Features */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('features')}</legend>
              <textarea
                name="features"
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder={t('featuresPlaceholder')}
              />
            </fieldset>

            {/* Tags */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('tags')}</legend>
              <input
                name="tags"
                type="text"
                className="input input-bordered w-full"
                placeholder={t('tagsPlaceholder')}
              />
            </fieldset>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" name="is_active" className="toggle toggle-primary" defaultChecked />
                {t('active')}
              </label>
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" name="is_featured" className="toggle toggle-secondary" />
                {t('featured')}
              </label>
            </div>

            {/* Submit */}
            <div className="card-actions justify-end">
              <Link href="/admin/services" className="btn btn-ghost">
                {t('cancel')}
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  t('save')
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
