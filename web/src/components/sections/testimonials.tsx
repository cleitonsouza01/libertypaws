'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'
import { motion } from 'motion/react'

interface Testimonial {
  id: string
  nameKey: string
  locationKey: string
  textKey: string
  rating: number
  avatar: string
  petType: 'dog' | 'cat'
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    nameKey: 'items.1.name',
    locationKey: 'items.1.location',
    textKey: 'items.1.text',
    rating: 5,
    avatar: '/images/testimonials/avatar-1.jpg',
    petType: 'dog',
  },
  {
    id: '2',
    nameKey: 'items.2.name',
    locationKey: 'items.2.location',
    textKey: 'items.2.text',
    rating: 5,
    avatar: '/images/testimonials/avatar-2.jpg',
    petType: 'cat',
  },
  {
    id: '3',
    nameKey: 'items.3.name',
    locationKey: 'items.3.location',
    textKey: 'items.3.text',
    rating: 5,
    avatar: '/images/testimonials/avatar-3.jpg',
    petType: 'dog',
  },
]

export function Testimonials() {
  const t = useTranslations('home.testimonials')

  return (
    <section className="bg-bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-brand-navy md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl bg-white p-6 shadow-sm"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 right-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lime/10">
                  <Quote className="h-5 w-5 text-brand-lime" />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="mb-6 text-text-muted">
                "{t(testimonial.textKey)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-bg-cream">
                  <Image
                    src={testimonial.avatar}
                    alt={t(testimonial.nameKey)}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">
                    {t(testimonial.nameKey)}
                  </p>
                  <p className="text-sm text-text-muted">
                    {t(testimonial.locationKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
