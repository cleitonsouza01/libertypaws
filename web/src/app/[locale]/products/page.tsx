'use client'

import { Suspense, useState, useMemo } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { ProductCard } from '@/components/sections/product-card'
import { products } from '@/data/products'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/assets'

type Category = 'all' | 'esa' | 'psd'
type SortOption = 'featured' | 'priceLow' | 'priceHigh' | 'newest'

function ProductsContent() {
  const t = useTranslations('products')
  const searchParams = useSearchParams()

  const initialCategory = (searchParams.get('category') as Category) || 'all'
  const [category, setCategory] = useState<Category>(initialCategory)
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: t('categories.all') },
    { value: 'esa', label: t('categories.esa') },
    { value: 'psd', label: t('categories.psd') },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: t('filters.sortOptions.featured') },
    { value: 'priceLow', label: t('filters.sortOptions.priceLow') },
    { value: 'priceHigh', label: t('filters.sortOptions.priceHigh') },
    { value: 'newest', label: t('filters.sortOptions.newest') },
  ]

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category)
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price
        case 'priceHigh':
          return b.price - a.price
        case 'featured':
          // Popular products first, then by price
          if (a.popular && !b.popular) return -1
          if (!a.popular && b.popular) return 1
          return b.price - a.price
        case 'newest':
          // For now, reverse the array order as a proxy for "newest"
          return 0
        default:
          return 0
      }
    })

    return sorted
  }, [category, sortBy])

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 text-white md:py-24">
        <Image
          src={getImageUrl('images/products/products-hero.jpg')}
          alt="Products"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-navy/70" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold md:text-5xl"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-white/90"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    category === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">
                {t('filters.sortBy')}:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ProductsLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded bg-brand-navy/50" />
          <div className="mx-auto h-6 w-96 animate-pulse rounded bg-brand-navy/50" />
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="border-b bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent />
      </Suspense>
    </div>
  )
}
