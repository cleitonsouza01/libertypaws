'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Menu, X, Search, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher, LanguageSwitcherCompact } from './language-switcher'
import { MobileNav } from './mobile-nav'
import { UserMenu } from './user-menu'
import { useAuth } from '@/contexts/auth-context'
import { getImageUrl } from '@/lib/assets'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const { isAuthenticated, isLoading } = useAuth()

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="navbar sticky top-0 z-40 bg-base-200/95 backdrop-blur-md border-b border-base-300 px-4 md:px-6 lg:px-8">
      {/* Logo - navbar-start */}
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost gap-2 px-1">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src={getImageUrl('images/logo.png')}
              alt="Liberty Paws International"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-secondary md:text-lg">
            Liberty Paws
          </span>
        </Link>
      </div>

      {/* Desktop Navigation - navbar-center */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop Right Side - navbar-end */}
      <div className="navbar-end">
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link href="/auth/login">
                  <Button variant="primary" size="sm">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcherCompact />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-square"
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
