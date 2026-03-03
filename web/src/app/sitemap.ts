import type { MetadataRoute } from 'next'
import { locales, type Locale } from '@/i18n/config'
import { getServiceSlugs } from '@/lib/services/queries'
import { SITE_URL, getLanguageAlternates } from '@/lib/seo'

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'
): MetadataRoute.Sitemap[number] {
  const languages = getLanguageAlternates(path) as Record<
    Locale | 'x-default',
    string
  >

  return {
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    entry('', 1.0, 'weekly'),
    entry('/products', 0.9, 'weekly'),
    entry('/contact', 0.7, 'monthly'),
  ]

  const slugs = await getServiceSlugs()
  const productPages = slugs.map((slug) =>
    entry(`/products/${slug}`, 0.8, 'weekly')
  )

  return [...staticPages, ...productPages]
}
