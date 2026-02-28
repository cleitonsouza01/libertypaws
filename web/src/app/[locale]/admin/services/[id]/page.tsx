'use client'

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchServiceDetail } from '@/lib/admin/queries'
import { updateService } from '@/lib/admin/actions'
import { ArrowLeft } from 'lucide-react'
import type { AdminService } from '@/types/admin'

export default function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.services')
  const router = useRouter()
  const [service, setService] = useState<AdminService | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchServiceDetail(supabase, id)
      setService(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!service) return
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const featuresRaw = (form.get('features') as string) ?? ''
    const tagsRaw = (form.get('tags') as string) ?? ''

    const data = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      price: parseFloat(form.get('price') as string),
      category: form.get('category') as string,
      is_active: form.get('is_active') === 'on',
      is_featured: form.get('is_featured') === 'on',
      features: featuresRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsRaw.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      const supabase = createClient()
      await updateService(supabase, service.id, data)
      router.push('/admin/services')
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

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">{t('notFound')}</p>
        <Link href="/admin/services" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('editService')}</h1>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('name')}</legend>
              <input
                name="name"
                type="text"
                className="input input-bordered w-full"
                defaultValue={service.name}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('description')}</legend>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                rows={4}
                defaultValue={service.description}
                required
              />
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('price')}</legend>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  defaultValue={service.price}
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('category')}</legend>
                <select
                  name="category"
                  className="select select-bordered w-full"
                  defaultValue={service.category}
                  required
                >
                  <option value="esa">ESA</option>
                  <option value="psd">PSD</option>
                  <option value="documents">Documents</option>
                  <option value="accessories">Accessories</option>
                </select>
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('features')}</legend>
              <textarea
                name="features"
                className="textarea textarea-bordered w-full"
                rows={3}
                defaultValue={service.features?.join('\n') ?? ''}
                placeholder={t('featuresPlaceholder')}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('tags')}</legend>
              <input
                name="tags"
                type="text"
                className="input input-bordered w-full"
                defaultValue={service.tags?.join(', ') ?? ''}
                placeholder={t('tagsPlaceholder')}
              />
            </fieldset>

            <div className="flex flex-wrap gap-6">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  className="toggle toggle-primary"
                  defaultChecked={service.is_active}
                />
                {t('active')}
              </label>
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  className="toggle toggle-secondary"
                  defaultChecked={service.is_featured}
                />
                {t('featured')}
              </label>
            </div>

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
