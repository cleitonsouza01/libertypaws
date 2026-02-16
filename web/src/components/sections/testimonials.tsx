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
    <section className="bg-base-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-base-content/60">
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
              className="card bg-base-200 shadow-sm relative"
            >
              <div className="card-body">
                {/* Quote icon */}
                <div className="absolute -top-3 right-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Quote className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Rating */}
                <div className="rating rating-sm mb-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      className="mask mask-star-2 bg-warning"
                      disabled
                      defaultChecked={i === testimonial.rating - 1}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-base-content/70 mb-4">
                  &ldquo;{t(testimonial.textKey)}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full bg-base-300">
                      <Image
                        src={testimonial.avatar}
                        alt={t(testimonial.nameKey)}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">
                      {t(testimonial.nameKey)}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {t(testimonial.locationKey)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
