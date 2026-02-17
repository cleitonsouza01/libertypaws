'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/auth-context'
import { AuthGuard } from '@/components/layout/auth-guard'
import { AccountLayout } from '@/components/layout/account-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import {
  Package,
  ChevronRight,
  PawPrint,
} from 'lucide-react'

function ProfileSection() {
  const t = useTranslations('auth.account')
  const { user, updateProfile } = useAuth()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSaved(false)
    await updateProfile({ fullName })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-secondary">{t('editProfile')}</h2>

          {saved && (
            <div role="alert" className="alert alert-success alert-soft text-sm">
              {t('saved')}
            </div>
          )}

          <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
            <Input
              type="text"
              label={t('profile')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              value={user?.email || ''}
              disabled
              className="input-disabled"
            />

            <div className="card-actions justify-end">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    {t('saving')}
                  </>
                ) : (
                  t('saveChanges')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Orders Summary */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-secondary">{t('recentOrders')}</h2>
            <Link href="/account/orders" className="btn btn-ghost btn-sm gap-1">
              {t('viewAllOrders')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divider my-1" />

          <div className="space-y-3">
            {[
              { id: 'LP-2026-001847', item: 'ESA Complete Package', status: 'shipped' as const, total: 249, date: '2026-02-10' },
              { id: 'LP-2026-001632', item: 'PSD Complete Kit', status: 'delivered' as const, total: 349, date: '2026-01-22' },
              { id: 'LP-2026-001501', item: 'ESA Letter for Housing', status: 'processing' as const, total: 149, date: '2026-01-05' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-base-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.item}</p>
                    <p className="text-xs text-base-content/50">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge badge-soft badge-sm ${
                    order.status === 'delivered' ? 'badge-success' :
                    order.status === 'shipped' ? 'badge-accent' : 'badge-warning'
                  }`}>
                    {t(`ordersPage.statuses.${order.status}`)}
                  </span>
                  <span className="text-sm font-semibold">${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pet Registrations Summary */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-secondary">{t('yourPets')}</h2>
            <Link href="/account/registrations" className="btn btn-ghost btn-sm gap-1">
              {t('viewAllRegistrations')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divider my-1" />

          <div className="space-y-3">
            {[
              { petName: 'Max', breed: 'Golden Retriever', type: 'esa' as const, status: 'active' as const, letter: 'M' },
              { petName: 'Luna', breed: 'German Shepherd', type: 'psd' as const, status: 'active' as const, letter: 'L' },
              { petName: 'Buddy', breed: 'Labrador Retriever', type: 'esa' as const, status: 'expired' as const, letter: 'B' },
            ].map((pet) => (
              <div key={pet.petName} className="flex items-center justify-between rounded-lg bg-base-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-placeholder">
                    <div className="bg-secondary text-secondary-content w-9 rounded-full">
                      <span className="text-sm">{pet.letter}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pet.petName}</p>
                    <p className="text-xs text-base-content/50">{pet.breed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-soft badge-sm ${pet.type === 'esa' ? 'badge-info' : 'badge-accent'}`}>
                    {t(`registrationsPage.types.${pet.type}`)}
                  </span>
                  <span className={`badge badge-soft badge-sm ${pet.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {t(`registrationsPage.statuses.${pet.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <ProfileSection />
      </AccountLayout>
    </AuthGuard>
  )
}
