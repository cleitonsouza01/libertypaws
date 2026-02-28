'use client'

import { Suspense, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { clarityEvent } from '@/lib/clarity'
import { AuthForm } from '@/components/sections/auth-form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

function LoginForm() {
  const t = useTranslations('auth.login')
  const { signIn, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const next = searchParams.get('next') || '/account'
  const justRegistered = searchParams.get('registered') === 'true'

  if (isAuthenticated) {
    router.replace(next)
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await signIn(email, password)
    if (result.success) {
      clarityEvent('auth_login_success')
      router.replace(next)
    } else {
      clarityEvent('auth_login_error')
      if (result.error === 'email_not_confirmed') {
        setError('email_not_confirmed')
      } else {
        setError(
          result.error === 'invalid_credentials'
            ? t('error.invalid')
            : t('error.generic')
        )
      }
    }
    setIsSubmitting(false)
  }

  return (
    <AuthForm title={t('title')} subtitle={t('subtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {justRegistered && !error && (
          <div role="status" className="alert alert-info alert-soft text-sm">
            <Mail className="h-4 w-4" />
            <span>{t('registeredBanner')}</span>
          </div>
        )}

        {error === 'email_not_confirmed' ? (
          <div role="alert" className="alert alert-warning alert-soft text-sm">
            <Mail className="h-4 w-4" />
            <span>{t('error.emailNotConfirmed')}</span>
          </div>
        ) : error ? (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {error}
          </div>
        ) : null}

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
          autoComplete="current-password"
          minLength={6}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer gap-2 text-xs">
            <input type="checkbox" className="toggle toggle-xs" name="remember" />
            {t('rememberMe')}
          </label>
          <Link
            href="/auth/forgot-password"
            className="link link-hover text-xs text-primary"
          >
            {t('forgotPassword')}
          </Link>
        </div>

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
          {t('noAccount')}{' '}
          <Link href="/auth/register" className="link link-primary">
            {t('registerLink')}
          </Link>
        </p>
      </form>
    </AuthForm>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
