import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
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

interface HomePageProps {
  params: Promise<{ locale: string }>
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
