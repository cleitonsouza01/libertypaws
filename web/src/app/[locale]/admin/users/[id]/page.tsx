'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchUserOrders, fetchUserRegistrations } from '@/lib/admin/queries'
import { StatusBadge } from '@/components/admin/status-badge'
import {
  ArrowLeft,
  Globe,
  User,
  Save,
  CheckCircle,
  ShoppingCart,
  PawPrint,
  Shield,
} from 'lucide-react'
import type { AdminProfile, AdminOrder, AdminRegistration } from '@/types/admin'

// Fields the admin can edit
interface EditableFields {
  full_name: string
  email: string
  phone: string
  locale: string
  role: 'admin' | 'user'
  avatar_url: string
}

function extractEditable(user: AdminProfile): EditableFields {
  return {
    full_name: user.full_name ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    locale: user.locale ?? 'en',
    role: user.role ?? 'user',
    avatar_url: user.avatar_url ?? '',
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

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('admin.users')
  const router = useRouter()
  const [user, setUser] = useState<AdminProfile | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      // Fetch user profile+role via API (role requires server-side auth admin)
      // and orders/registrations directly from Supabase in parallel
      const [userRes, userOrders, userRegs] = await Promise.all([
        fetch(`/api/admin/users/${id}`),
        fetchUserOrders(supabase, id),
        fetchUserRegistrations(supabase, id),
      ])

      const userData = userRes.ok ? ((await userRes.json()) as AdminProfile) : null
      setUser(userData)
      setOrders(userOrders)
      setRegistrations(userRegs)
      if (userData) {
        const editable = extractEditable(userData)
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
    if (!form || !original || !user) return

    const changes = getChangedFields(original, form)
    if (Object.keys(changes).length === 0) return

    setSaving(true)
    setSaveStatus('idle')
    setSaveError('')

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unknown error')
      }

      // Update local state to reflect saved values
      const updatedUser = { ...user }
      for (const [key, value] of Object.entries(changes)) {
        ;(updatedUser as Record<string, unknown>)[key] = value || null
      }
      setUser(updatedUser)
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!user || !form) {
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="avatar avatar-placeholder">
            <div className="bg-primary text-primary-content w-12 rounded-full">
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
            <h1 className="text-2xl font-bold text-secondary">{user.full_name}</h1>
            <p className="text-sm text-base-content/60">{user.email}</p>
          </div>
        </div>
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

      {/* Profile info — editable */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-4">
          <h3 className="card-title text-base">
            <User className="h-5 w-5 text-primary" />
            {t('profileInfo')}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('fullName')} *</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">{t('email')} *</legend>
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t('phone')}</legend>
            <input
              type="tel"
              className="input input-bordered w-full sm:w-1/2"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </fieldset>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                <Globe className="inline h-3 w-3" /> {t('locale')}
              </legend>
              <select
                className="select select-bordered w-full"
                value={form.locale}
                onChange={(e) => updateField('locale', e.target.value)}
              >
                <option value="en">{t('localeEn')}</option>
                <option value="es">{t('localeEs')}</option>
                <option value="pt">{t('localePt')}</option>
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                <Shield className="inline h-3 w-3" /> {t('role')}
              </legend>
              <select
                className="select select-bordered w-full"
                value={form.role}
                onChange={(e) => updateField('role', e.target.value as 'admin' | 'user')}
              >
                <option value="user">{t('roleUser')}</option>
                <option value="admin">{t('roleAdmin')}</option>
              </select>
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t('avatarUrl')}</legend>
            <input
              type="url"
              className="input input-bordered w-full"
              value={form.avatar_url}
              onChange={(e) => updateField('avatar_url', e.target.value)}
              placeholder="https://..."
            />
          </fieldset>

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

      {/* Orders section */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {t('ordersSection')} ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <p className="text-sm text-base-content/60">{t('noOrders')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>{t('orderNumber')}</th>
                    <th>{t('status')}</th>
                    <th>{t('total')}</th>
                    <th>{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <td className="font-mono text-xs">{order.order_number}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>${Number(order.total_amount).toFixed(2)}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registrations section */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-base">
            <PawPrint className="h-5 w-5 text-primary" />
            {t('registrationsSection')} ({registrations.length})
          </h3>

          {registrations.length === 0 ? (
            <p className="text-sm text-base-content/60">{t('noRegistrations')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>{t('regNumber')}</th>
                    <th>{t('petName')}</th>
                    <th>{t('type')}</th>
                    <th>{t('status')}</th>
                    <th>{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover cursor-pointer"
                      onClick={() => router.push(`/admin/registrations/${reg.id}`)}
                    >
                      <td className="font-mono text-xs">{reg.registration_number}</td>
                      <td>{reg.pet_name}</td>
                      <td>
                        <span className="badge badge-sm badge-soft badge-primary">
                          {reg.registration_type?.toUpperCase()}
                        </span>
                      </td>
                      <td><StatusBadge status={reg.status} /></td>
                      <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
