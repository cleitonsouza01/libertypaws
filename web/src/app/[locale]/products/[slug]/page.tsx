import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ArrowLeft, Check, ShoppingCart, Shield, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, getProductById, getRelatedProducts } from '@/data/products'
import { ProductCard, type Product } from '@/components/sections/product-card'

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }))
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = getProductById(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(slug, 3)

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />
}

function ProductDetailContent({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const tProduct = useTranslations(`productDetails.${product.id}`)
  const tCommon = useTranslations('products')

  const categoryLabel =
    product.category === 'esa' ? tCommon('categories.esa') : tCommon('categories.psd')

  const priceDisplay = product.maxPrice
    ? `$${product.price.toFixed(2)} - $${product.maxPrice.toFixed(2)}`
    : `$${product.price.toFixed(2)}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon('detail.backToProducts')}
          </Link>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200">
              <Image
                src={product.image}
                alt={tProduct('name')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.popular && (
                <div className="absolute left-4 top-4 rounded-full bg-accent-500 px-3 py-1 text-sm font-medium text-white">
                  {tCommon('popular')}
                </div>
              )}
              {product.badge && (
                <div className="absolute right-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-sm font-medium text-white">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2 text-sm font-medium text-primary-600">{categoryLabel}</div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {tProduct('name')}
              </h1>
              <p className="mb-6 text-lg text-gray-600">{tProduct('description')}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="text-3xl font-bold text-primary-600">{priceDisplay}</div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {tCommon('detail.features')}
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <Check className="h-3 w-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-100 p-4 text-center">
                  <Shield className="h-6 w-6 text-primary-600" />
                  <span className="text-xs font-medium text-gray-700">100% Legal</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-100 p-4 text-center">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <span className="text-xs font-medium text-gray-700">24-48h Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-100 p-4 text-center">
                  <Award className="h-6 w-6 text-primary-600" />
                  <span className="text-xs font-medium text-gray-700">Licensed Pros</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {tCommon('buyNow')}
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  {tCommon('addToCart')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {tCommon('detail.relatedProducts')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
