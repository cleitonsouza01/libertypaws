'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchRegistrationDetail } from '@/lib/admin/queries'
import { approveRegistration, rejectRegistration, updateRegistrationStatus, toggleRegistrationPublic } from '@/lib/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PhotoUpload } from '@/components/admin/photo-upload'
import { ArrowLeft, Mail, User, PawPrint, Eye, EyeOff, Save, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import type { AdminRegistration, RegistrationStatus } from '@/types/admin'

// Fields the admin can edit
interface EditableFields {
  registration_number: string
  pet_name: string
  pet_breed: string
  pet_species: string
  pet_color: string
  pet_weight: string
  pet_date_of_birth: string
  pet_photo_url: string
  handler_name: string
  registration_type: 'esa' | 'psd'
  registration_date: string
  expiry_date: string
}

function extractEditable(reg: AdminRegistration): EditableFields {
  return {
    registration_number: reg.registration_number,
    pet_name: reg.pet_name,
    pet_breed: reg.pet_breed,
    pet_species: reg.pet_species,
    pet_color: reg.pet_color ?? '',
    pet_weight: reg.pet_weight ?? '',
    pet_date_of_birth: reg.pet_date_of_birth ?? '',
    pet_photo_url: reg.pet_photo_url ?? '',
    handler_name: reg.handler_name,
    registration_type: reg.registration_type,
    registration_date: reg.registration_date,
    expiry_date: reg.expiry_date ?? '',
  }
}

function getChangedFields(
  original: EditableFields,
  current: EditableFields
): Record<string, unknown> {
  const changes: Record<string, unknown> = {}
  for (const key of Object.keys(original) as (keyof EditableFields)[]) {
    if (original[key] !== current[key]) {
      changes[key] = current[key]
    }
  }
  return changes
}

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

  // Editable form state
  const [form, setForm] = useState<EditableFields | null>(null)
  const [original, setOriginal] = useState<EditableFields | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState('')

  const isDirty = original && form
    ? Object.keys(getChangedFields(original, form)).length > 0
    : false

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchRegistrationDetail(supabase, id)
      setReg(data)
      if (data) {
        const editable = extractEditable(data)
        setForm(editable)
        setOriginal(editable)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const updateField = useCallback(<K extends keyof EditableFields>(key: K, value: EditableFields[K]) => {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)
    setSaveStatus('idle')
  }, [])

  async function handleSave() {
    if (!form || !original || !reg) return

    const changes = getChangedFields(original, form)
    if (Object.keys(changes).length === 0) return

    setSaving(true)
    setSaveStatus('idle')
    setSaveError('')

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unknown error')
      }

      // Update local state to reflect saved values
      const updatedReg = { ...reg }
      for (const [key, value] of Object.entries(changes)) {
        ;(updatedReg as Record<string, unknown>)[key] = value || null
      }
      setReg(updatedReg)
      setOriginal({ ...form })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('updateError'))
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

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

  if (!reg || !form) {
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/registrations" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">
          {t('regNumber')} {reg.registration_number}
        </h1>
        <StatusBadge status={reg.status} />
      </div>

      {/* Success / Error alerts */}
      {saveStatus === 'success' && (
        <div role="alert" className="alert alert-success alert-soft text-sm">
          <CheckCircle className="h-4 w-4" />
          {t('updateSuccess')}
        </div>
      )}
      {saveStatus === 'error' && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {saveError || t('updateError')}
        </div>
      )}

      {/* Pet info — editable */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-4">
          <h3 className="card-title text-base">
            <PawPrint className="h-5 w-5 text-primary" />
            {t('petInfo')}
          </h3>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Pet photo */}
            <div className="shrink-0">
              <PhotoUpload
                value={form.pet_photo_url}
                onChange={(url) => updateField('pet_photo_url', url)}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('petName')} *</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.pet_name}
                    onChange={(e) => updateField('pet_name', e.target.value)}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('breed')} *</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.pet_breed}
                    onChange={(e) => updateField('pet_breed', e.target.value)}
                    required
                  />
                </fieldset>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('petSpecies')} *</legend>
                  <select
                    className="select select-bordered w-full"
                    value={form.pet_species}
                    onChange={(e) => updateField('pet_species', e.target.value)}
                  >
                    <option value="dog">{t('speciesDog')}</option>
                    <option value="cat">{t('speciesCat')}</option>
                    <option value="other">{t('speciesOther')}</option>
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('registrationType')} *</legend>
                  <select
                    className="select select-bordered w-full"
                    value={form.registration_type}
                    onChange={(e) => updateField('registration_type', e.target.value as 'esa' | 'psd')}
                  >
                    <option value="esa">{t('typeEsa')}</option>
                    <option value="psd">{t('typePsd')}</option>
                  </select>
                </fieldset>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('petColor')}</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.pet_color}
                    onChange={(e) => updateField('pet_color', e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">{t('petWeight')}</legend>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input input-bordered w-full"
                    value={form.pet_weight}
                    onChange={(e) => updateField('pet_weight', e.target.value)}
                  />
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('dateOfBirth')}</legend>
                <input
                  type="date"
                  className="input input-bordered w-full sm:w-auto"
                  value={form.pet_date_of_birth}
                  onChange={(e) => updateField('pet_date_of_birth', e.target.value)}
                />
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* Registration details — editable */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-4">
          <h3 className="card-title text-base">{t('registrationDetails')}</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('registrationNumberLabel')}</legend>
              <input
                type="text"
                className="input input-bordered w-full font-mono"
                value={form.registration_number}
                onChange={(e) => updateField('registration_number', e.target.value)}
                required
              />
              <p className="text-xs text-base-content/50 mt-1">{t('registrationNumberHint')}</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('handlerName')} *</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.handler_name}
                onChange={(e) => updateField('handler_name', e.target.value)}
                required
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('registrationDate')}</legend>
              <input
                type="date"
                className="input input-bordered w-full"
                value={form.registration_date}
                onChange={(e) => updateField('registration_date', e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('expires')}</legend>
              <input
                type="date"
                className="input input-bordered w-full"
                value={form.expiry_date}
                onChange={(e) => updateField('expiry_date', e.target.value)}
              />
              <p className="text-xs text-base-content/50 mt-1">{t('expiryHint')}</p>
            </fieldset>
          </div>
        </div>
      </div>

      {/* Owner info — read-only */}
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

      {/* Visibility */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body flex-row items-center justify-between">
          <div>
            <h3 className="card-title text-base inline-flex items-center gap-2">
              {reg.is_public ? <Eye className="h-5 w-5 text-success" /> : <EyeOff className="h-5 w-5 text-base-content/40" />}
              {t('isPublic')}
            </h3>
            <p className="text-xs text-base-content/50">{t('isPublicHint')}</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={reg.is_public}
            onChange={async (e) => {
              const newVal = e.target.checked
              const supabase = createClient()
              await toggleRegistrationPublic(supabase, reg.id, newVal)
              setReg({ ...reg, is_public: newVal })
            }}
          />
        </div>
      </div>

      {/* Status actions */}
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

      {/* Sticky save bar */}
      {isDirty && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-base-300 bg-base-100/95 backdrop-blur-sm px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between max-w-5xl">
            <p className="text-sm font-medium text-warning">{t('unsavedChanges')}</p>
            <button
              className="btn btn-primary btn-sm gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('saveChanges')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
