import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n/config'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://libertypawsinternational.com'

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  pt: 'pt_BR',
}

export function getOgLocale(locale: Locale): string {
  return OG_LOCALE_MAP[locale]
}

export function getCanonicalUrl(locale: Locale, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}/${locale}${cleanPath}`
}

export function getLanguageAlternates(
  path: string = ''
): Record<string, string> {
  const alternates: Record<string, string> = {}
  for (const locale of locales) {
    alternates[locale] = getCanonicalUrl(locale as Locale, path)
  }
  alternates['x-default'] = getCanonicalUrl('en', path)
  return alternates
}

export function buildMetadata({
  locale,
  path = '',
  title,
  description,
  ogImage,
  type = 'website',
}: {
  locale: Locale
  path?: string
  title: string
  description: string
  ogImage?: string
  type?: 'website' | 'article'
}): Metadata {
  const canonical = getCanonicalUrl(locale, path)
  const languages = getLanguageAlternates(path)
  const image = ogImage || `${SITE_URL}/images/og-image.jpg`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Liberty Paws International',
      locale: getOgLocale(locale),
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
