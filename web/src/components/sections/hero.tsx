'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Shield, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getVideoUrl } from '@/lib/assets'

const heroVideos = [
  getVideoUrl('videos/hero-airport-checkpoint.mp4'),
  getVideoUrl('videos/hero-airplane-travel.mp4'),
]

export function Hero() {
  const t = useTranslations('hero')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked, user interaction needed
      })
    }
  }, [currentVideoIndex])

  return (
    <section className="hero bg-gradient-to-b from-base-100 to-base-200 py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5" />
        <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-secondary/5" />
      </div>

      <div className="hero-content relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex-col lg:flex-row-reverse gap-12 lg:gap-16">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full lg:w-1/2"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/10">
            <AnimatePresence mode="wait">
              <motion.video
                key={currentVideoIndex}
                ref={videoRef}
                src={heroVideos[currentVideoIndex]}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          {/* Video indicator dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {heroVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentVideoIndex
                    ? 'w-6 bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -left-4 card bg-base-200 shadow-lg p-4 md:-bottom-6 md:-left-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary">
                  {t('floatingBadge.title')}
                </p>
                <p className="text-xs text-base-content/60">
                  {t('floatingBadge.subtitle')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left w-full lg:w-1/2"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="badge badge-primary badge-soft badge-lg gap-2 mb-6">
              <Shield className="h-4 w-4" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-base-content/60 md:text-xl">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button variant="primary" size="lg" asChild>
              <Link href="/products">
                {t('cta.primary')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">{t('cta.secondary')}</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
          >
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <Heart className="h-4 w-4 text-error" />
              <span>{t('stats.happy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <Shield className="h-4 w-4 text-primary" />
              <span>{t('stats.verified')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
