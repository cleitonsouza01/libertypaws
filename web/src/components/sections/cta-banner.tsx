'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Phone } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  const t = useTranslations('home.cta')

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-lime to-brand-lime-dark py-16 md:py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 max-w-2xl text-lg text-white/90"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand-lime hover:bg-white/90"
              asChild
            >
              <Link href="/products">
                {t('primaryButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">
                <Phone className="h-5 w-5" />
                {t('secondaryButton')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
