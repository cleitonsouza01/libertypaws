'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/auth-context'
import { AuthForm } from '@/components/sections/auth-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgot')
  const { resetPassword, isAuthenticated } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    router.replace('/account')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    await resetPassword(email)
    setSuccess(true)
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <AuthForm title={t('title')}>
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle className="h-16 w-16 text-success" />
          <p className="text-center text-base-content/80">{t('success')}</p>
          <Link href="/auth/login" className="btn btn-primary">
            {t('backToLogin')}
          </Link>
        </div>
      </AuthForm>
    )
  }

  return (
    <AuthForm title={t('title')} subtitle={t('subtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
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

        <Link
          href="/auth/login"
          className="btn btn-ghost btn-sm mx-auto gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToLogin')}
        </Link>
      </form>
    </AuthForm>
  )
}
