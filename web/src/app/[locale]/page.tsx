import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import {
  Hero,
  TrustBar,
  ProductGrid,
  CategorySection,
  WhyChooseUs,
  Testimonials,
  CtaBanner,
} from '@/components/sections'
import { popularProducts } from '@/data/products'
import { type Locale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const t = messages.metadata as Record<string, string>

  return buildMetadata({
    locale: locale as Locale,
    title: t?.title || 'Liberty Paws International - Service Dog & ESA Registration',
    description:
      t?.description || 'Professional Service Dog & ESA Registration',
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* ESA Category Section */}
      <CategorySection variant="esa" />

      {/* PSD Category Section */}
      <CategorySection variant="psd" reverse />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Banner */}
      <CtaBanner />
    </>
  )
}

function FeaturedProducts() {
  const t = useTranslations('home.products')

  return (
    <ProductGrid
      products={popularProducts}
      title={t('title')}
      subtitle={t('subtitle')}
      showViewAll={true}
    />
  )
}
