'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductVariant } from '@/components/sections/product-card'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selected: string | null
  onSelect: (variantId: string) => void
}

export function VariantSelector({ variants, selected, onSelect }: VariantSelectorProps) {
  const t = useTranslations('products.detail.variants')

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-secondary">{t('title')}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {variants.map((variant) => {
          const isSelected = selected === variant.id
          return (
            <button
              key={variant.id}
              type="button"
              className={cn(
                'relative flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-base-300 bg-base-200 hover:border-primary/40'
              )}
              onClick={() => onSelect(variant.id)}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-content" />
                </div>
              )}

              {/* Variant name + default badge */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-secondary">{variant.name}</span>
                {variant.isDefault && (
                  <span className="badge badge-primary badge-soft badge-xs">
                    {t('recommended')}
                  </span>
                )}
              </div>

              {/* Description */}
              {variant.description && (
                <span className="text-sm text-base-content/60">{variant.description}</span>
              )}

              {/* Price */}
              <span className="mt-1 text-lg font-bold text-primary">
                ${variant.price.toFixed(2)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
