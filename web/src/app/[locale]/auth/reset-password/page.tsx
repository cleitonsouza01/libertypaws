'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/auth-context'
import { AuthForm } from '@/components/sections/auth-form'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const t = useTranslations('auth.reset')
  const { updatePassword } = useAuth()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('error.password'))
      return
    }

    setIsSubmitting(true)
    const result = await updatePassword(password)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(t('error.generic'))
    }
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <AuthForm title={t('title')}>
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle className="h-16 w-16 text-success" />
          <p className="text-center text-base-content/80">{t('success')}</p>
          <Link href="/auth/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </AuthForm>
    )
  }

  return (
    <AuthForm title={t('title')} subtitle={t('subtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {error}
          </div>
        )}

        <PasswordInput
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
        />

        <PasswordInput
          label={t('confirmLabel')}
          placeholder={t('confirmPlaceholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
        />

        <Button
          type="submit"
          variant="primary"
          className="btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              {t('submitting')}
            </>
          ) : (
            t('submitButton')
          )}
        </Button>
      </form>
    </AuthForm>
  )
}
