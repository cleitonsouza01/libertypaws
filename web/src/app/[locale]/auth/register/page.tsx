'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/auth-context'
import { clarityEvent } from '@/lib/clarity'
import { AuthForm } from '@/components/sections/auth-form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const { signUp, isAuthenticated } = useAuth()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    router.replace('/account')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('error.password'))
      return
    }
    if (!acceptTerms) {
      setError(t('error.terms'))
      return
    }

    setIsSubmitting(true)
    const result = await signUp(email, password, fullName)
    if (result.success) {
      clarityEvent('auth_register_success')
      setSuccess(true)
    } else {
      clarityEvent('auth_register_error')
      setError(
        result.error === 'email_exists'
          ? t('error.exists')
          : t('error.generic')
      )
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
            {t('loginLink')}
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

        <Input
          type="text"
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

        <Input
          type="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

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

        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm mt-0.5"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span className="text-base-content/70">
            {t.rich('termsText', {
              terms: (chunks) => (
                <Link href="/" className="link link-primary">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/" className="link link-primary">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>

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

        <p className="text-center text-sm text-base-content/60">
          {t('hasAccount')}{' '}
          <Link href="/auth/login" className="link link-primary">
            {t('loginLink')}
          </Link>
        </p>
      </form>
    </AuthForm>
  )
}
