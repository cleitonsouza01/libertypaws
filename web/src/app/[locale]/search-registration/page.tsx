'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Search, ShieldCheck, CheckCircle, XCircle, ArrowLeft, Calendar, Dog, User, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/assets'

interface MockRegistration {
  id: string
  type: string
  handlerName: string
  dogName: string
  breed: string
  validThru: string
  status: 'active'
  photo: string
}

const MOCK_REGISTRATIONS: MockRegistration[] = [
  {
    id: '2984533',
    type: 'Service Dog',
    handlerName: 'Felipe Moisés Varela da Camara',
    dogName: 'Lui',
    breed: 'Golden Retriever',
    validThru: 'January 30, 2028',
    status: 'active',
    photo: '/images/mock-dog-lui.jpg',
  },
  {
    id: '2984544',
    type: 'Service Dog',
    handlerName: 'Luciene Maciel Sandes',
    dogName: 'Drogon',
    breed: 'French Bulldog',
    validThru: 'February 28, 2027',
    status: 'active',
    photo: '/images/mock-dog-drogon.jpg',
  },
]

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

function RegistrationResult({ registration, onReset }: { registration: MockRegistration; onReset: () => void }) {
  const t = useTranslations('searchRegistration.result')
  const reg = registration

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
            <div className="relative h-10 w-10">
              <Image
                src={getImageUrl('images/logo.png')}
                alt="Liberty Paws"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-secondary-content uppercase tracking-wider">
                {t('registrationType')}: {t('serviceDog')}
              </p>
              <p className="text-xs text-secondary-content/80 uppercase tracking-wide">
                {t('accessRequired')}
              </p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Dog photo placeholder */}
            <div className="flex flex-col items-center gap-2 sm:w-48 shrink-0">
              <div className="avatar">
                <div className="w-40 rounded-xl bg-base-300">
                  <Image
                    src={reg.photo}
                    alt={reg.dogName}
                    width={160}
                    height={160}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<div class="flex h-40 w-40 items-center justify-center bg-base-300 rounded-xl"><span class="text-5xl">🐕</span></div>`
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-base-content/50 uppercase">{t('dogName')}</p>
                <p className="font-bold text-secondary">{reg.dogName}</p>
              </div>
            </div>

            {/* Registration details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('handlerName')}</p>
                  <p className="font-semibold">{reg.handlerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dog className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('breed')}</p>
                  <p className="font-semibold">{reg.breed}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('validThru')}</p>
                  <p className="font-semibold">{reg.validThru}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/50 uppercase">{t('idNumber')}</p>
                  <p className="font-semibold font-mono">{reg.id}</p>
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
  const [foundRegistration, setFoundRegistration] = useState<MockRegistration | null>(null)

  async function handleSearch(id: string) {
    setState('searching')

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const match = MOCK_REGISTRATIONS.find((r) => r.id === id)
    if (match) {
      setFoundRegistration(match)
      setState('found')
    } else {
      setFoundRegistration(null)
      setState('not-found')
    }
  }

  function handleReset() {
    setState('idle')
    setFoundRegistration(null)
  }

  if (state === 'found' && foundRegistration) {
    return <RegistrationResult registration={foundRegistration} onReset={handleReset} />
  }

  if (state === 'not-found') {
    return <NotFoundResult onReset={handleReset} />
  }

  return <SearchForm onSearch={handleSearch} isSearching={state === 'searching'} />
}
