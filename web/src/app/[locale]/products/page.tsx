import type { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { type Locale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'
import ProductsPageClient from './products-page-client'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const meta = (messages.metadata as Record<string, unknown>)?.products as
    | Record<string, string>
    | undefined

  return buildMetadata({
    locale: locale as Locale,
    path: '/products',
    title:
      meta?.title || 'ESA Letters & Service Dog Registration',
    description:
      meta?.description ||
      'Browse our professional ESA letters and Service Dog registration kits.',
  })
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ProductsPageClient />
}
