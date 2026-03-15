'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { locales as localeList, localeNames, localeFlags, type Locale } from '@/i18n/config'
import { clarityEvent, clarityTag } from '@/lib/clarity'

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
  const [mounted, setMounted] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]

  // Track mount for portal (avoids SSR hydration mismatch)
  useEffect(() => setMounted(true), [])

  const handleLocaleChange = (newLocale: Locale) => {
    clarityTag('to_locale', newLocale)
    clarityEvent('locale_switch')
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  // Calculate menu position from button's bounding rect
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      })
    }
  }, [])

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen((prev) => !prev)
  }

  // Close dropdown when clicking/touching outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Close on scroll (fixed-position menu won't follow scroll)
  useEffect(() => {
    if (!isOpen) return
    const handleScroll = () => setIsOpen(false)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Close on window resize (position would be stale)
  useEffect(() => {
    if (!isOpen) return
    const handleResize = () => setIsOpen(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Dropdown menu rendered via portal to escape header stacking context
  const dropdownMenu = (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={menuStyle}
          className={cn(
            'menu rounded-box bg-base-200 p-2 shadow-lg',
            variant === 'compact' ? 'min-w-[160px]' : 'min-w-[180px]'
          )}
          role="listbox"
          aria-label="Available languages"
        >
          {locales.map((loc) => {
            const isSelected = locale === loc.code
            return (
              <li key={loc.code}>
                <button
                  onClick={() => handleLocaleChange(loc.code)}
                  className={cn(
                    'flex items-center gap-3 touch-manipulation min-h-[44px]',
                    isSelected && 'active'
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
                    <span className="text-xs opacity-60">{loc.name}</span>
                  </div>

                  {/* Checkmark for selected */}
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              </li>
            )
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'btn btn-ghost gap-2 touch-manipulation',
          variant === 'compact' ? 'btn-sm min-h-[44px] px-2' : 'btn-sm',
          className
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className={cn('text-primary', variant === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
        <span className="flex items-center gap-1">
          <span className="text-base" role="img" aria-label={currentLocale.name}>
            {currentLocale.flag}
          </span>
          <span className={cn('font-semibold text-secondary', variant === 'compact' && 'text-xs')}>
            {currentLocale.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Portal: renders dropdown at document.body level, escaping all parent stacking contexts */}
      {mounted && createPortal(dropdownMenu, document.body)}
    </>
  )
}

// Compact version for mobile header
export function LanguageSwitcherCompact({ className }: { className?: string }) {
  return <LanguageSwitcher variant="compact" className={className} />
}
