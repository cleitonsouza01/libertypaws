'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { useCart } from '@/contexts/cart-context'
import { createCheckoutSession } from '@/app/actions/checkout'

export function CheckoutRedirect({ locale }: { locale: string }) {
  const t = useTranslations('cart')
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    async function redirect() {
      const result = await createCheckoutSession(items, locale)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.url) {
        // Clear cart before redirect — Stripe will handle the rest
        clearCart()
        window.location.href = result.url
      }
    }

    redirect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="alert alert-error max-w-md">
          <span>{t('checkoutError')}</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="btn btn-primary"
        >
          {t('viewCart')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/60">{t('checkoutLoading')}</p>
    </div>
  )
}
