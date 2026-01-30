import type { Product } from '@/components/sections/product-card'

export const products: Product[] = [
  // ESA Products
  {
    id: 'esa-letter-housing',
    slug: 'esa-letter-housing',
    category: 'esa',
    name: 'ESA Letter for Housing',
    description: 'Official Emotional Support Animal letter for housing accommodations under the Fair Housing Act.',
    price: 149,
    image: '/images/products/esa-housing.jpg',
    badge: 'Housing',
    popular: true,
    features: [
      'Valid for 1 year',
      'Licensed mental health professional',
      'Fair Housing Act compliant',
      'Digital & physical copy',
    ],
  },
  {
    id: 'esa-letter-travel',
    slug: 'esa-letter-travel',
    category: 'esa',
    name: 'ESA Letter for Travel',
    description: 'Documentation for traveling with your Emotional Support Animal on airlines.',
    price: 149,
    image: '/images/products/esa-travel.jpg',
    badge: 'Travel',
    features: [
      'Airline approved format',
      'Licensed professional evaluation',
      '24-48 hour delivery',
      'Customer support included',
    ],
  },
  {
    id: 'esa-combo-package',
    slug: 'esa-combo-package',
    category: 'esa',
    name: 'ESA Complete Package',
    description: 'Comprehensive ESA package including housing and travel letters plus ID card.',
    price: 249,
    image: '/images/products/esa-combo.jpg',
    badge: 'Best Value',
    popular: true,
    features: [
      'Housing & travel letters',
      'ESA ID card included',
      'Priority processing',
      '1 year validity',
    ],
  },
  // PSD Products
  {
    id: 'psd-registration',
    slug: 'psd-registration',
    category: 'psd',
    name: 'Psychiatric Service Dog Registration',
    description: 'Official registration for your Psychiatric Service Dog with documentation and ID.',
    price: 79,
    maxPrice: 199,
    image: '/images/products/psd-registration.jpg',
    badge: 'Service Dog',
    features: [
      'Official registration',
      'Service dog ID card',
      'Handler certificate',
      'Lifetime validity',
    ],
  },
  {
    id: 'psd-training-guide',
    slug: 'psd-training-guide',
    category: 'psd',
    name: 'PSD Training & Documentation',
    description: 'Complete training guide and documentation package for Psychiatric Service Dogs.',
    price: 129,
    image: '/images/products/psd-training.jpg',
    badge: 'Training',
    features: [
      'Training curriculum',
      'Public access guide',
      'Legal rights handbook',
      'Ongoing support',
    ],
  },
  {
    id: 'psd-complete-kit',
    slug: 'psd-complete-kit',
    category: 'psd',
    name: 'PSD Complete Kit',
    description: 'Everything you need: registration, ID, vest, and comprehensive documentation.',
    price: 299,
    image: '/images/products/psd-kit.jpg',
    badge: 'Complete',
    popular: true,
    features: [
      'Full registration',
      'Official ID card',
      'Service dog vest',
      'Complete documentation',
    ],
  },
]

export const esaProducts = products.filter((p) => p.category === 'esa')
export const psdProducts = products.filter((p) => p.category === 'psd')
export const popularProducts = products.filter((p) => p.popular)

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: 'esa' | 'psd'): Product[] {
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(productId: string, limit: number = 3): Product[] {
  const product = getProductById(productId)
  if (!product) return []

  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit)
}
