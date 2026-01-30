'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Heart, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CategorySectionProps {
  variant?: 'esa' | 'psd'
  reverse?: boolean
}

export function CategorySection({ variant = 'esa', reverse = false }: CategorySectionProps) {
  const t = useTranslations('home.categories')
  const isEsa = variant === 'esa'

  return (
    <section className={cn('py-16 md:py-24', isEsa ? 'bg-white' : 'bg-bg-cream')}>
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div
          className={cn(
            'grid items-center gap-12 lg:grid-cols-2 lg:gap-16',
            reverse && 'lg:flex-row-reverse'
          )}
        >
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(reverse && 'lg:order-2')}
          >
            {/* Icon */}
            <div
              className={cn(
                'mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl',
                isEsa ? 'bg-brand-lime/10' : 'bg-brand-navy/10'
              )}
            >
              {isEsa ? (
                <Heart className="h-7 w-7 text-brand-lime" />
              ) : (
                <Shield className="h-7 w-7 text-brand-navy" />
              )}
            </div>

            {/* Title */}
            <h2 className="mb-4 text-3xl font-bold text-brand-navy md:text-4xl">
              {t(`${variant}.title`)}
            </h2>

            {/* Description */}
            <p className="mb-6 text-lg text-text-muted">
              {t(`${variant}.description`)}
            </p>

            {/* Benefits */}
            <ul className="mb-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                      isEsa ? 'bg-brand-lime/20 text-brand-lime' : 'bg-brand-navy/20 text-brand-navy'
                    )}
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-text-muted">{t(`${variant}.benefits.${i}`)}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              variant={isEsa ? 'primary' : 'secondary'}
              size="lg"
              asChild
            >
              <Link href={`/products?category=${variant}`}>
                {t(`${variant}.cta`)}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn('relative', reverse && 'lg:order-1')}
          >
            <div
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-3xl',
                isEsa
                  ? 'bg-gradient-to-br from-brand-lime/20 to-brand-lime/5'
                  : 'bg-gradient-to-br from-brand-navy/20 to-brand-navy/5'
              )}
            >
              <Image
                src={isEsa ? '/images/categories/category-esa.jpg' : '/images/categories/category-service-dog.jpg'}
                alt={t(`${variant}.imageAlt`)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Decorative element */}
            <div
              className={cn(
                'absolute -z-10 h-full w-full rounded-3xl',
                isEsa ? '-bottom-4 -right-4 bg-brand-lime/10' : '-bottom-4 -left-4 bg-brand-navy/10'
              )}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
