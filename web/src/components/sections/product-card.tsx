'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Star, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'
import { cn } from '@/lib/utils'

export interface Product {
  id: string
  slug: string
  category: 'esa' | 'psd'
  name: string
  description: string
  price: number
  maxPrice?: number
  image: string
  badge?: string
  popular?: boolean
  features: string[]
}

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations('products')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-white transition-all duration-300',
        'hover:border-brand-lime/30 hover:shadow-lg',
        product.popular && 'ring-2 ring-brand-lime'
      )}
    >
      {/* Popular badge */}
      {product.popular && (
        <div className="absolute right-4 top-4 z-10">
          <Badge variant="featured">
            <Star className="h-3 w-3" />
            {t('popular')}
          </Badge>
        </div>
      )}

      {/* Category badge */}
      {product.badge && (
        <div className="absolute left-4 top-4 z-10">
          <Badge variant={product.category === 'esa' ? 'secondary' : 'outline'}>
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-lime">
          {t(`categories.${product.category}`)}
        </p>

        {/* Name */}
        <h3 className="mb-2 text-lg font-bold text-brand-navy">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mb-4 flex-1 text-sm text-text-muted line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        <ul className="mb-4 space-y-2">
          {product.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price and CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border-light pt-4">
          <Price
            amount={product.price}
            maxAmount={product.maxPrice}
            showFrom={!!product.maxPrice}
          />
          <Button variant="primary" size="sm" asChild>
            <Link href={`/products/${product.slug}`}>
              {t('viewDetails')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
