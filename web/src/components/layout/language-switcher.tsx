'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { locales as localeList, localeNames, localeFlags, type Locale } from '@/i18n/config'

const locales = localeList.map((code) => ({
  code,
  label: code.toUpperCase(),
  name: localeNames[code],
  flag: localeFlags[code],
}))

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function LanguageSwitcher({
  variant = 'default',
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-border-light bg-white/80 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-200',
          'hover:border-brand-lime/30 hover:bg-white hover:shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-brand-lime/20',
          isOpen && 'border-brand-lime/30 bg-white shadow-sm',
          variant === 'compact' && 'px-2 py-1.5'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe
          className={cn(
            'text-brand-lime',
            variant === 'compact' ? 'h-4 w-4' : 'h-4 w-4'
          )}
        />
        <span className="flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label={currentLocale.name}>
            {currentLocale.flag}
          </span>
          <span
            className={cn(
              'font-semibold text-brand-navy',
              variant === 'compact' && 'text-xs'
            )}
          >
            {currentLocale.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border-light bg-white/95 p-1.5 shadow-lg backdrop-blur-md',
              variant === 'compact' && 'min-w-[160px]'
            )}
            role="listbox"
            aria-label="Available languages"
          >
            {locales.map((loc) => {
              const isSelected = locale === loc.code
              return (
                <motion.button
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    isSelected
                      ? 'bg-brand-lime/10 text-brand-lime'
                      : 'text-text-muted hover:bg-bg-light hover:text-brand-navy'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Flag */}
                  <span className="text-xl" role="img" aria-label={loc.name}>
                    {loc.flag}
                  </span>

                  {/* Language info */}
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold">{loc.label}</span>
                    <span className="text-xs text-text-muted">{loc.name}</span>
                  </div>

                  {/* Checkmark for selected */}
                  {isSelected && <Check className="h-4 w-4 text-brand-lime" />}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for mobile header
export function LanguageSwitcherCompact({ className }: { className?: string }) {
  return <LanguageSwitcher variant="compact" className={className} />
}
