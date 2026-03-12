'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'

export function CartDrawer() {
  const t = useTranslations('cart')
  const tProducts = useTranslations('products')
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-base-100 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-base-300 px-4 py-4">
              <h2 className="text-lg font-bold text-secondary">
                {t('title')}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="btn btn-ghost btn-sm btn-square"
                aria-label={t('title')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
                <ShoppingBag className="h-16 w-16 text-base-content/20" />
                <p className="text-lg font-medium text-base-content/60">{t('empty')}</p>
                <p className="text-sm text-base-content/40 text-center">{t('emptyDescription')}</p>
                <Button variant="primary" onClick={closeCart} asChild>
                  <Link href="/products">{t('continueShopping')}</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-4 rounded-lg bg-base-200 p-3"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-base-300">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="text-sm font-semibold text-secondary hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.variantName && (
                              <p className="text-xs text-base-content/60">{item.variantName}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                className="btn btn-ghost btn-xs btn-square"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-[1.5rem] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                className="btn btn-ghost btn-xs btn-square"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId, item.variantId)}
                                className="btn btn-ghost btn-xs btn-square text-error"
                                aria-label={t('remove')}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-base-300 px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60">{t('subtotal')}</span>
                    <span className="text-lg font-bold text-secondary">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/cart">
                      {t('viewCart')}
                    </Link>
                  </Button>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="btn btn-ghost btn-sm w-full"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
