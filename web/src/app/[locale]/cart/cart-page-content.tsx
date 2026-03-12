'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'

export function CartPageContent() {
  const t = useTranslations('cart')
  const tProducts = useTranslations('products')
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="h-24 w-24 text-base-content/15" />
        <h1 className="text-2xl font-bold text-secondary">{t('empty')}</h1>
        <p className="text-base-content/60 text-center max-w-md">{t('emptyDescription')}</p>
        <Button variant="primary" size="lg" asChild>
          <Link href="/products">{t('continueShopping')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Breadcrumb */}
      <div className="border-b border-base-300 bg-base-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('continueShopping')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-secondary">{t('title')}</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.productId}-${item.variantId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card card-border bg-base-200"
              >
                <div className="card-body flex-row gap-4 p-4">
                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-base-300">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-semibold text-secondary hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-base-content/60">{item.variantName}</p>
                      )}
                      <p className="text-sm text-primary font-medium mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-base-content/60">{t('quantity')}:</span>
                        <div className="join">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="btn btn-sm join-item"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="btn btn-sm join-item pointer-events-none min-w-[2.5rem]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="btn btn-sm join-item"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-secondary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="btn btn-ghost btn-sm btn-square text-error"
                          aria-label={t('remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear cart */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearCart}
                className="btn btn-ghost btn-sm text-error"
              >
                <Trash2 className="h-4 w-4" />
                {t('clearCart')}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 sticky top-24">
              <div className="card-body">
                <h2 className="card-title text-secondary">{t('subtotal')}</h2>

                <div className="divider my-1" />

                {/* Items summary */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-base-content/60 line-clamp-1 flex-1 pr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="divider my-1" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-secondary">{t('total')}</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <div className="card-actions mt-4">
                  <Button variant="primary" size="lg" className="w-full" asChild>
                    <Link href="/checkout">
                      <ShoppingCart className="h-5 w-5" />
                      {t('checkout')}
                    </Link>
                  </Button>
                </div>

                {/* Continue Shopping */}
                <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                  <Link href="/products">{t('continueShopping')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
