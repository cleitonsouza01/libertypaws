'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/auth-context'
import { AuthGuard } from '@/components/layout/auth-guard'
import { AccountLayout } from '@/components/layout/account-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ShoppingBag, PawPrint } from 'lucide-react'

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

      {/* Orders - Empty State */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body items-center text-center">
          <ShoppingBag className="h-12 w-12 text-base-content/30" />
          <h2 className="card-title text-secondary">{t('orders')}</h2>
          <p className="text-sm text-base-content/60">{t('noOrders')}</p>
        </div>
      </div>

      {/* Registrations - Empty State */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body items-center text-center">
          <PawPrint className="h-12 w-12 text-base-content/30" />
          <h2 className="card-title text-secondary">{t('registrations')}</h2>
          <p className="text-sm text-base-content/60">{t('noRegistrations')}</p>
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
