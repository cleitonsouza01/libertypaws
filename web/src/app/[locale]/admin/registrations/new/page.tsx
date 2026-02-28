'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

interface Service {
  id: string
  name: string
}

export default function AdminNewRegistrationPage() {
  const t = useTranslations('admin.registrations')
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    async function loadServices() {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      if (data) setServices(data)
    }
    loadServices()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const form = new FormData(e.currentTarget)

    const payload: Record<string, unknown> = {
      email: (form.get('email') as string).trim(),
      fullName: (form.get('fullName') as string).trim(),
      petName: (form.get('petName') as string).trim(),
      petBreed: (form.get('petBreed') as string).trim(),
      petSpecies: form.get('petSpecies') as string,
      registrationType: form.get('registrationType') as string,
      serviceId: form.get('serviceId') as string,
      locale: form.get('locale') as string,
    }

    const petColor = (form.get('petColor') as string)?.trim()
    if (petColor) payload.petColor = petColor

    const petWeight = (form.get('petWeight') as string)?.trim()
    if (petWeight) payload.petWeight = petWeight

    const petDateOfBirth = form.get('petDateOfBirth') as string
    if (petDateOfBirth) payload.petDateOfBirth = petDateOfBirth

    const registrationDate = form.get('registrationDate') as string
    if (registrationDate) payload.registrationDate = registrationDate

    const expiryDate = form.get('expiryDate') as string
    if (expiryDate) payload.expiryDate = expiryDate

    const adminNotes = (form.get('adminNotes') as string)?.trim()
    if (adminNotes) payload.adminNotes = adminNotes

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unknown error')
      }

      router.push('/admin/registrations')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveError'))
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/registrations" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">{t('newRegistration')}</h1>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            <h2 className="card-title text-lg">{t('customerInfo')}</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('email')} *</legend>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered w-full"
                  placeholder={t('emailHint')}
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('fullName')} *</legend>
                <input
                  name="fullName"
                  type="text"
                  className="input input-bordered w-full"
                  required
                />
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('locale')}</legend>
              <select name="locale" className="select select-bordered w-full" defaultValue="en">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
              </select>
            </fieldset>
          </div>
        </div>

        {/* Pet Information */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            <h2 className="card-title text-lg">{t('petInfo')}</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('petName')} *</legend>
                <input
                  name="petName"
                  type="text"
                  className="input input-bordered w-full"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('breed')} *</legend>
                <input
                  name="petBreed"
                  type="text"
                  className="input input-bordered w-full"
                  required
                />
              </fieldset>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('petSpecies')} *</legend>
                <select name="petSpecies" className="select select-bordered w-full" required>
                  <option value="dog">{t('speciesDog')}</option>
                  <option value="cat">{t('speciesCat')}</option>
                  <option value="other">{t('speciesOther')}</option>
                </select>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('type')} *</legend>
                <select name="registrationType" className="select select-bordered w-full" required>
                  <option value="esa">{t('typeEsa')}</option>
                  <option value="psd">{t('typePsd')}</option>
                </select>
              </fieldset>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('petColor')}</legend>
                <input
                  name="petColor"
                  type="text"
                  className="input input-bordered w-full"
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('petWeight')}</legend>
                <input
                  name="petWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  className="input input-bordered w-full"
                />
              </fieldset>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('dateOfBirth')}</legend>
                <input name="petDateOfBirth" type="date" className="input input-bordered w-full" />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('registrationDate')}</legend>
                <input
                  name="registrationDate"
                  type="date"
                  className="input input-bordered w-full"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('expires')}</legend>
              <input name="expiryDate" type="date" className="input input-bordered w-full" />
              <p className="text-xs text-base-content/50 mt-1">{t('expiryHint')}</p>
            </fieldset>
          </div>
        </div>

        {/* Service & Order */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-4">
            <h2 className="card-title text-lg">{t('serviceOrder')}</h2>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('selectService')} *</legend>
              <select name="serviceId" className="select select-bordered w-full" required>
                <option value="">{t('selectService')}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('adminNotes')}</legend>
              <textarea
                name="adminNotes"
                className="textarea textarea-bordered w-full h-24"
                placeholder={t('notesPlaceholder')}
              />
            </fieldset>

            <div className="card-actions justify-end">
              <Link href="/admin/registrations" className="btn btn-ghost">{t('cancel')}</Link>
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
