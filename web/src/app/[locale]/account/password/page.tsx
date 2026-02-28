'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AuthGuard } from '@/components/layout/auth-guard'
import { AccountLayout } from '@/components/layout/account-layout'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

function ChangePasswordContent() {
  const t = useTranslations('auth.account')
  const { updatePassword } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    if (newPassword.length < 8) {
      setError(t('passwordRequirements'))
      return
    }

    setIsSubmitting(true)

    const result = await updatePassword(newPassword)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? t('passwordUpdateFailed'))
      return
    }

    setSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-secondary">{t('changePassword')}</h2>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('updatePassword')}</h3>
              <p className="text-xs text-base-content/60">{t('passwordRequirements')}</p>
            </div>
          </div>

          {success && (
            <div role="alert" className="alert alert-success alert-soft text-sm">
              <CheckCircle className="h-4 w-4" />
              {t('passwordUpdated')}
            </div>
          )}

          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <PasswordInput
              label={t('currentPasswordLabel')}
              placeholder={t('currentPasswordPlaceholder')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <div className="divider my-0" />

            <PasswordInput
              label={t('newPasswordLabel')}
              placeholder={t('newPasswordPlaceholder')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            <PasswordInput
              label={t('confirmPasswordLabel')}
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />

            <div className="card-actions mt-2 justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    {t('updatingPassword')}
                  </>
                ) : (
                  t('updatePassword')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <ChangePasswordContent />
      </AccountLayout>
    </AuthGuard>
  )
}
