'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher, LanguageSwitcherCompact } from './language-switcher'
import { MobileNav } from './mobile-nav'
import { getImageUrl } from '@/lib/assets'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-light bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src={getImageUrl('images/logo.png')}
              alt="Liberty Paws International"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-brand-navy md:text-lg">
            Liberty Paws
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button variant="primary" size="sm">
            <Search className="h-4 w-4" />
            {t('searchRegistration')}
          </Button>
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcherCompact />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-brand-navy hover:bg-gray-100"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </header>
  )
}
