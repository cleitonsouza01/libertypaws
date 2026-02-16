'use client'

import { useTranslations } from 'next-intl'
import {
  Shield,
  Clock,
  Award,
  HeartHandshake,
  BadgeCheck,
  Headphones,
} from 'lucide-react'
import { motion } from 'motion/react'

const icons = {
  shield: Shield,
  clock: Clock,
  award: Award,
  heart: HeartHandshake,
  badge: BadgeCheck,
  support: Headphones,
}

interface ReasonItem {
  icon: keyof typeof icons
  titleKey: string
  descKey: string
}

const reasons: ReasonItem[] = [
  { icon: 'shield', titleKey: 'items.legal.title', descKey: 'items.legal.description' },
  { icon: 'clock', titleKey: 'items.fast.title', descKey: 'items.fast.description' },
  { icon: 'badge', titleKey: 'items.professional.title', descKey: 'items.professional.description' },
  { icon: 'heart', titleKey: 'items.compassionate.title', descKey: 'items.compassionate.description' },
  { icon: 'award', titleKey: 'items.trusted.title', descKey: 'items.trusted.description' },
  { icon: 'support', titleKey: 'items.support.title', descKey: 'items.support.description' },
]

export function WhyChooseUs() {
  const t = useTranslations('home.whyChooseUs')

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-secondary-content md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-secondary-content/70">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = icons[reason.icon]
            return (
              <motion.div
                key={reason.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <div className="card-body">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="card-title text-secondary-content">
                    {t(reason.titleKey)}
                  </h3>
                  <p className="text-sm text-secondary-content/70">
                    {t(reason.descKey)}
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
