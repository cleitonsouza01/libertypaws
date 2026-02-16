'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ProductCard, type Product } from './product-card'

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  showViewAll?: boolean
  columns?: 2 | 3
}

export function ProductGrid({
  products,
  title,
  subtitle,
  showViewAll = true,
  columns = 3,
}: ProductGridProps) {
  const t = useTranslations('home.products')

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            {title && (
              <h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-base-content/60">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Grid */}
        <div
          className={`grid gap-6 md:gap-8 ${
            columns === 3
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : 'md:grid-cols-2'
          }`}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                {t('viewAll')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
