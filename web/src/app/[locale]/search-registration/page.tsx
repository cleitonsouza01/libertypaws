'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ShieldCheck, CheckCircle, XCircle, ArrowLeft, Calendar, Dog, User, Hash, Database, Fingerprint, ScanLine, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/assets'
import { createClient } from '@/lib/supabase/client'
import { clarityEvent } from '@/lib/clarity'

interface Registration {
  registration_number: string
  pet_name: string
  pet_breed: string
  pet_species: string
  handler_name: string
  registration_type: string
  registration_date: string
  expiry_date: string | null
  pet_photo_url: string | null
  status: string
}

type SearchState = 'idle' | 'searching' | 'found' | 'not-found'

function SearchForm({
  onSearch,
  isSearching,
}: {
  onSearch: (id: string) => void
  isSearching: boolean
}) {
  const t = useTranslations('searchRegistration')
  const [inputValue, setInputValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
    }
  }

  return (
    <div className="hero min-h-[60vh]">
      <div className="hero-content flex-col text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold text-secondary md:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-base-content/60">{t('subtitle')}</p>
        </div>
        <div className="card bg-base-200 shadow-sm w-full max-w-md mt-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">{t('inputLabel')}</legend>
                <div className="join w-full">
                  <input
                    type="text"
                    className="input input-lg join-item w-full"
                    placeholder={t('inputPlaceholder')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="join-item btn-lg"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotFoundResult({ onReset }: { onReset: () => void }) {
  const t = useTranslations('searchRegistration.notFound')

  return (
    <div className="hero min-h-[60vh]">
      <div className="hero-content flex-col text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
          <XCircle className="h-10 w-10 text-error" />
        </div>
        <h2 className="text-2xl font-bold text-secondary">{t('title')}</h2>
        <p className="max-w-md text-base-content/60">{t('message')}</p>
        <button onClick={onReset} className="btn btn-primary mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('tryAgain')}
        </button>
      </div>
    </div>
  )
}

const SEARCH_STEPS = [
  { icon: Database, key: 'step1' },
  { icon: Fingerprint, key: 'step2' },
  { icon: ScanLine, key: 'step3' },
] as const

function SearchingAnimation() {
  const t = useTranslations('searchRegistration.searchAnimation')
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % SEARCH_STEPS.length)
    }, 700)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero min-h-[60vh]">
      <div className="hero-content flex-col text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Animated scanning circle */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-primary/40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Search className="h-10 w-10 text-primary" />
            </motion.div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-secondary">{t('title')}</h2>
            <p className="mt-1 text-base-content/60">{t('subtitle')}</p>
          </div>

          {/* Step indicators */}
          <div className="flex flex-col gap-3 mt-2">
            {SEARCH_STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = i === activeStep
              const isDone = i < activeStep

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isActive ? 'bg-primary/10 text-primary' : isDone ? 'text-success' : 'text-base-content/30'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : isActive ? (
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                      <Icon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{t(step.key)}</span>
                  {isActive && <span className="loading loading-dots loading-xs" />}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function RegistrationResult({ registration, onReset }: { registration: Registration; onReset: () => void }) {
  const t = useTranslations('searchRegistration.result')
  const reg = registration

  const typeLabels: Record<string, string> = {
    esa: t('esaAnimal'),
    psd: t('serviceDog'),
  }
  const typeLabel = typeLabels[reg.registration_type] ?? reg.registration_type.toUpperCase()
  const TypeIcon = reg.registration_type === 'esa' ? Heart : ShieldCheck

  const validThru = reg.expiry_date
    ? new Date(reg.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : t('lifetime')

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-secondary md:text-3xl">{t('title')}</h2>
        <p className="mt-2 text-base-content/60">{t('subtitle')}</p>
      </div>

      {/* Registration card — styled like the physical ID card */}
      <div className="card bg-base-200 shadow-lg overflow-hidden">
        {/* Top banner */}
        <div className="bg-secondary px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <TypeIcon className="h-8 w-8 text-secondary-content" />
            <div>
              <p className="text-lg font-bold text-secondary-content uppercase tracking-wider">
                {t('registrationType')}: {typeLabel}
              </p>
              <p className="text-xs text-secondary-content/80 uppercase tracking-wide">
                {t('accessRequired')}
              </p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Pet photo */}
            <div className="flex flex-col items-center gap-2 sm:w-48 shrink-0">
              <div className="avatar">
                <div className="w-40 rounded-xl bg-base-300">
                  {reg.pet_photo_url ? (
                    <Image
                      src={reg.pet_photo_url}
                      alt={reg.pet_name}
                      width={160}
                      height={160}
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = `<div class="flex h-40 w-40 items-center justify-center bg-base-300 rounded-xl"><span class="text-5xl">🐕</span></div>`
                      }}
                    />
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center bg-base-300 rounded-xl">
                      <span className="text-5xl">{reg.pet_species === 'cat' ? '🐈' : '🐕'}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-base-content/50 uppercase">{t('dogName')}</p>
                <p className="font-bold text-secondary">{reg.pet_name}</p>
              </div>
            </div>

            {/* Registration details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('handlerName')}</p>
                  <p className="font-semibold">{reg.handler_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dog className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('breed')}</p>
                  <p className="font-semibold">{reg.pet_breed}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('validThru')}</p>
                  <p className="font-semibold">{validThru}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('idNumber')}</p>
                  <p className="font-semibold font-mono">{reg.registration_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="badge badge-success badge-soft gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t('active')}
                </span>
                <span className="badge badge-info badge-soft gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t('verifiedBadge')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="bg-base-300 px-6 py-3 text-center">
          <p className="text-xs text-base-content/50">{t('verificationNote')}</p>
        </div>
      </div>

      {/* Search another */}
      <div className="mt-8 text-center">
        <button onClick={onReset} className="btn btn-ghost gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('searchAnother')}
        </button>
      </div>
    </div>
  )
}

export default function SearchRegistrationPage() {
  const [state, setState] = useState<SearchState>('idle')
  const [foundRegistration, setFoundRegistration] = useState<Registration | null>(null)

  async function handleSearch(query: string) {
    setState('searching')
    clarityEvent('search_reg_submit')

    const minDelay = new Promise((r) => setTimeout(r, 2500))

    const supabase = createClient()
    const queryPromise = supabase
      .from('pet_registrations')
      .select('registration_number, pet_name, pet_breed, pet_species, handler_name, registration_type, registration_date, expiry_date, pet_photo_url, status')
      .ilike('registration_number', query)
      .eq('is_public', true)
      .eq('status', 'active')
      .limit(1)
      .single()

    const [{ data, error }] = await Promise.all([queryPromise, minDelay])

    if (error || !data) {
      clarityEvent('search_reg_not_found')
      setFoundRegistration(null)
      setState('not-found')
    } else {
      clarityEvent('search_reg_found')
      setFoundRegistration(data)
      setState('found')
    }
  }

  function handleReset() {
    setState('idle')
    setFoundRegistration(null)
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'searching' ? (
        <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <SearchingAnimation />
        </motion.div>
      ) : state === 'found' && foundRegistration ? (
        <motion.div key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <RegistrationResult registration={foundRegistration} onReset={handleReset} />
        </motion.div>
      ) : state === 'not-found' ? (
        <motion.div key="not-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <NotFoundResult onReset={handleReset} />
        </motion.div>
      ) : (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <SearchForm onSearch={handleSearch} isSearching={false} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
