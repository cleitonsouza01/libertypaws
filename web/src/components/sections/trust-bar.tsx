'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Shield, Clock, FileCheck, HeartHandshake } from 'lucide-react'
import { motion } from 'motion/react'
import { getImageUrl } from '@/lib/assets'

const icons = {
  shield: Shield,
  clock: Clock,
  file: FileCheck,
  heart: HeartHandshake,
}

const images = {
  shield: getImageUrl('images/trust/trust-official.jpg'),
  clock: getImageUrl('images/trust/trust-delivery.jpg'),
  file: getImageUrl('images/trust/trust-quality.jpg'),
  heart: getImageUrl('images/trust/trust-support.jpg'),
}

export function TrustBar() {
  const t = useTranslations('trustBar')

  const items = [
    { icon: 'shield' as const, titleKey: 'items.legal.title', descKey: 'items.legal.description' },
    { icon: 'clock' as const, titleKey: 'items.fast.title', descKey: 'items.fast.description' },
    { icon: 'file' as const, titleKey: 'items.official.title', descKey: 'items.official.description' },
    { icon: 'heart' as const, titleKey: 'items.support.title', descKey: 'items.support.description' },
  ]

  return (
    <section className="border-y border-border-light bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[item.icon]
            const imageSrc = images[item.icon]
            return (
              <motion.div
                key={item.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={t(item.titleKey)}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/40">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {t(item.descKey)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
