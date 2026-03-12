import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { getServiceBySlug, getRelatedServices, getServiceSlugs } from '@/lib/services/queries'
import { type Locale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'
import { ProductDetailContent } from './product-detail-content'

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getServiceBySlug(slug)
  if (!product) return {}

  const messages = await getMessages()
  const productDetails = messages.productDetails as Record<
    string,
    Record<string, string>
  >
  const t = productDetails?.[slug]

  const title = t?.name || product.name
  const description = t?.description || product.description

  return buildMetadata({
    locale: locale as Locale,
    path: `/products/${slug}`,
    title,
    description,
    ogImage: product.image,
  })
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = await getServiceBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedServices(slug, 3)

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />
}
