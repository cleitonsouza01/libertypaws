'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { CheckCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

export function CheckoutSuccess() {
  const t = useTranslations('checkout.success')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card bg-base-200 max-w-lg w-full"
      >
        <div className="card-body items-center text-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>

          <h1 className="card-title text-2xl text-secondary">{t('title')}</h1>
          <p className="text-base-content/60">{t('subtitle')}</p>
          <p className="text-sm text-base-content/40">{t('orderInfo')}</p>

          <div className="card-actions flex-col sm:flex-row gap-3 mt-4 w-full">
            <Button variant="primary" size="lg" className="flex-1" asChild>
              <Link href="/">{t('backToHome')}</Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/products">{t('viewProducts')}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
