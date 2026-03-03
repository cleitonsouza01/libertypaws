import { unstable_cache } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getAssetUrl } from '@/lib/assets'
import type { Product } from '@/components/sections/product-card'

// Use a plain Supabase client (no cookies) since catalog data is public
// and these queries must work at build time (generateStaticParams, sitemap)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

function getClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// ── Mapping helper ──────────────────────────────────────────────────

interface ServiceRow {
  id: string
  slug: string
  name: string
  description: string
  price: number
  max_price: number | null
  is_featured: boolean
  badge_text: string | null
  features: string[]
  sort_order: number
  service_categories: { categories: { slug: string } }[]
  service_media: { url: string }[]
}

function mapToProduct(row: ServiceRow): Product {
  const categorySlug = row.service_categories?.[0]?.categories?.slug ?? 'esa'
  const imageUrl = row.service_media?.[0]?.url

  return {
    id: row.slug,
    slug: row.slug,
    category: categorySlug as 'esa' | 'psd',
    name: row.name,
    description: row.description,
    price: Number(row.price),
    maxPrice: row.max_price ? Number(row.max_price) : undefined,
    image: imageUrl ? getAssetUrl(imageUrl) : getAssetUrl('images/products/placeholder.jpg'),
    badge: row.badge_text ?? undefined,
    popular: row.is_featured,
    features: Array.isArray(row.features) ? row.features : [],
  }
}

// ── Select shape (reused by all queries) ────────────────────────────

const SERVICE_SELECT = `
  id, slug, name, description, price, max_price,
  is_featured, badge_text, features, sort_order,
  service_categories(categories(slug)),
  service_media(url)
` as const

// ── Queries ─────────────────────────────────────────────────────────

/** All active services, ordered by sort_order */
async function _getAllServices(): Promise<Product[]> {
  const supabase = getClient()

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_SELECT)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('getAllServices error:', error)
    return []
  }

  return (data as unknown as ServiceRow[]).map(mapToProduct)
}

export const getAllServices = unstable_cache(_getAllServices, ['all-services'], {
  tags: ['services'],
  revalidate: 3600,
})

/** Featured services (is_featured = true), for homepage */
async function _getFeaturedServices(): Promise<Product[]> {
  const supabase = getClient()

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order')

  if (error) {
    console.error('getFeaturedServices error:', error)
    return []
  }

  return (data as unknown as ServiceRow[]).map(mapToProduct)
}

export const getFeaturedServices = unstable_cache(_getFeaturedServices, ['featured-services'], {
  tags: ['services'],
  revalidate: 3600,
})

/** Single service by slug, for detail page and metadata */
async function _getServiceBySlug(slug: string): Promise<Product | null> {
  const supabase = getClient()

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  return mapToProduct(data as unknown as ServiceRow)
}

export const getServiceBySlug = unstable_cache(_getServiceBySlug, ['service-by-slug'], {
  tags: ['services'],
  revalidate: 3600,
})

/** Related services: same category, excluding current slug */
async function _getRelatedServices(slug: string, limit: number = 3): Promise<Product[]> {
  const service = await _getServiceBySlug(slug)
  if (!service) return []

  const supabase = getClient()

  // Get category_id for this service's category
  const { data: catData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', service.category)
    .single()

  if (!catData) return []

  // Find service_ids in the same category
  const { data: scData } = await supabase
    .from('service_categories')
    .select('service_id')
    .eq('category_id', catData.id)

  if (!scData || scData.length === 0) return []

  const siblingIds = scData.map((sc) => sc.service_id)

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_SELECT)
    .eq('is_active', true)
    .neq('slug', slug)
    .in('id', siblingIds)
    .order('sort_order')
    .limit(limit)

  if (error || !data) return []

  return (data as unknown as ServiceRow[]).map(mapToProduct)
}

export const getRelatedServices = unstable_cache(_getRelatedServices, ['related-services'], {
  tags: ['services'],
  revalidate: 3600,
})

/** All slugs for generateStaticParams */
async function _getServiceSlugs(): Promise<string[]> {
  const supabase = getClient()

  const { data, error } = await supabase
    .from('services')
    .select('slug')
    .eq('is_active', true)
    .order('sort_order')

  if (error || !data) return []

  return data.map((s) => s.slug)
}

export const getServiceSlugs = unstable_cache(_getServiceSlugs, ['service-slugs'], {
  tags: ['services'],
  revalidate: 3600,
})
