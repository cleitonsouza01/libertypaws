# Language Switcher Dropdown - Implementation Guide

A comprehensive guide for implementing an accessible, animated language switcher dropdown component in Next.js projects with `next-intl` internationalization.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Dependencies](#dependencies)
5. [Project Structure](#project-structure)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Component API](#component-api)
8. [Customization](#customization)
9. [Accessibility](#accessibility)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This language switcher provides a polished dropdown menu for switching between locales in a Next.js application. It features:

- Animated dropdown with Framer Motion
- Flag emojis and native language names
- Click-outside and Escape key dismissal
- Full keyboard accessibility (ARIA)
- Responsive variants (default and compact for mobile)
- Smooth hover and selection animations

### Screenshots

**Desktop - Closed State:**

![Language Switcher Closed](./images/language-switcher-closed.png)

**Desktop - Dropdown Open:**

![Language Switcher Dropdown](./images/language-switcher-dropdown.png)

**Desktop - Full Context with Dropdown:**

![Language Switcher Open Context](./images/language-switcher-open-context.png)

**Mobile - Compact Variant (Closed):**

![Language Switcher Mobile Closed](./images/language-switcher-mobile-closed.png)

**Mobile - Compact Variant (Open):**

![Language Switcher Mobile Open](./images/language-switcher-mobile-open.png)

---

## Features

| Feature | Description |
|---------|-------------|
| **Animated Dropdown** | Smooth fade/scale animations via Framer Motion |
| **Flag + Acronym** | Visual flag emoji + language code (EN, PT, ES, FR) |
| **Native Names** | Shows language in its native form (Português, Español) |
| **Click-Outside Close** | Closes when clicking anywhere outside the dropdown |
| **Escape Key Close** | Keyboard accessibility for closing |
| **Selection Indicator** | Checkmark on currently selected language |
| **Hover Animation** | Subtle horizontal movement on hover |
| **Responsive Variants** | Compact version for mobile headers |
| **ARIA Compliant** | Full accessibility support |

---

## Prerequisites

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Basic understanding of React hooks

---

## Dependencies

Install required packages:

```bash
npm install next-intl framer-motion lucide-react clsx tailwind-merge
```

| Package | Version | Purpose |
|---------|---------|---------|
| `next-intl` | ^3.26.5 | Internationalization for Next.js |
| `framer-motion` | ^11.18.2 | Animation library |
| `lucide-react` | ^0.545.0 | Icons (Globe, ChevronDown, Check) |
| `clsx` | ^2.1.1 | Conditional class names |
| `tailwind-merge` | ^2.6.0 | Merge Tailwind classes without conflicts |

---

## Project Structure

```
src/
├── i18n.ts                          # Locale configuration
├── routing.ts                       # Next-intl routing setup
├── middleware.ts                    # Locale middleware
├── lib/
│   └── utils.ts                     # cn() utility function
├── components/
│   └── layout/
│       └── language-switcher.tsx    # Main component
├── messages/
│   ├── en.json                      # English translations
│   ├── pt.json                      # Portuguese translations
│   ├── es.json                      # Spanish translations
│   └── fr.json                      # French translations
└── app/
    └── [locale]/
        └── layout.tsx               # Locale-aware layout
```

---

## Step-by-Step Implementation

### Step 1: Configure i18n

**`src/i18n.ts`**
```typescript
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'pt', 'es', 'fr'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || !locales.includes(locale as Locale)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
```

### Step 2: Set Up Routing

**`src/routing.ts`**
```typescript
import { defineRouting } from 'next-intl/routing'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'pt', 'es', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'  // URLs always include locale: /en/about, /pt/about
})

// Export navigation utilities for use in components
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
```

### Step 3: Create Middleware

**`src/middleware.ts`**
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
})

export const config = {
  // Match all paths except API, static files, and internal Next.js paths
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### Step 4: Create Utility Function

**`src/lib/utils.ts`**
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names using clsx and tailwind-merge
 * Handles Tailwind CSS class conflicts properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 5: Create Language Switcher Component

**`src/components/layout/language-switcher.tsx`**
```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/routing'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/i18n'

// Define available locales with metadata
const locales = [
  { code: 'en' as Locale, label: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'pt' as Locale, label: 'PT', name: 'Português', flag: '🇧🇷' },
  { code: 'es' as Locale, label: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Locale, label: 'FR', name: 'Français', flag: '🇫🇷' },
]

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          'flex items-center gap-2 rounded-full border border-border/50 bg-white/80 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-200',
          'hover:border-primary-blue/30 hover:bg-white hover:shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-blue/20',
          isOpen && 'border-primary-blue/30 bg-white shadow-sm',
          variant === 'compact' && 'px-2 py-1.5'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className={cn('text-primary-blue', variant === 'compact' ? 'h-4 w-4' : 'h-4 w-4')} />
        <span className="flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label={currentLocale.name}>
            {currentLocale.flag}
          </span>
          <span className={cn('font-semibold text-primary-dark', variant === 'compact' && 'text-xs')}>
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
              'absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border/50 bg-white/95 p-1.5 shadow-lg backdrop-blur-md',
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
                      ? 'bg-primary-blue/10 text-primary-blue'
                      : 'text-text-muted hover:bg-bg-light hover:text-primary-dark'
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
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary-blue" />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for mobile header (visible next to hamburger)
export function LanguageSwitcherCompact({ className }: { className?: string }) {
  return <LanguageSwitcher variant="compact" className={className} />
}
```

### Step 6: Usage in Header

**`src/components/layout/header.tsx`** (example usage)
```typescript
import { LanguageSwitcher, LanguageSwitcherCompact } from './language-switcher'

export function Header() {
  return (
    <header>
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div>Your Logo</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Nav links... */}
          <LanguageSwitcher />  {/* Default variant */}
        </div>

        {/* Mobile: Compact switcher next to hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcherCompact />
          <button>{/* Hamburger menu */}</button>
        </div>
      </nav>
    </header>
  )
}
```

### Step 7: Configure next.config.js

**`next.config.js`**
```javascript
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your other config options
}

module.exports = withNextIntl(nextConfig)
```

---

## Component API

### LanguageSwitcher

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'compact'` | `'default'` | Size variant |
| `className` | `string` | `undefined` | Additional CSS classes |

### LanguageSwitcherCompact

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |

---

## Customization

### Adding/Removing Languages

Edit the `locales` array in the component:

```typescript
const locales = [
  { code: 'en' as Locale, label: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'de' as Locale, label: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  // Add more...
]
```

**Important:** Also update:
1. `src/i18n.ts` - Add to `locales` array
2. `src/routing.ts` - Add to `locales` array
3. `src/messages/` - Create translation file (e.g., `de.json`)

### Custom Colors

Replace Tailwind classes with your design system colors:

```typescript
// Replace these class names:
'text-primary-blue'      → 'text-blue-600'
'bg-primary-blue/10'     → 'bg-blue-100'
'text-text-muted'        → 'text-gray-500'
'bg-bg-light'            → 'bg-gray-50'
'border-border/50'       → 'border-gray-200'
```

### Animation Customization

Modify Framer Motion props:

```typescript
// Slower animation
transition={{ duration: 0.25, ease: 'easeInOut' }}

// Different entry animation
initial={{ opacity: 0, y: -16, scale: 0.9 }}

// No hover movement
whileHover={{ x: 0 }}  // or remove whileHover entirely
```

---

## Accessibility

The component implements these ARIA patterns:

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `aria-expanded` | Button | Indicates dropdown state |
| `aria-haspopup="listbox"` | Button | Indicates popup type |
| `aria-label` | Button, Menu | Screen reader descriptions |
| `role="listbox"` | Dropdown | Identifies as selection list |
| `role="option"` | Items | Identifies as selectable options |
| `aria-selected` | Items | Indicates selected state |
| `role="img"` | Flags | Identifies emoji as image |

**Keyboard Navigation:**
- **Tab** - Focus trigger button
- **Enter/Space** - Toggle dropdown
- **Escape** - Close dropdown
- **Click outside** - Close dropdown

---

## Troubleshooting

### Common Issues

**1. Dropdown not appearing**
- Check z-index: Ensure `z-50` is higher than other elements
- Verify `position: relative` on parent container

**2. Locale not changing**
- Verify `middleware.ts` matcher pattern
- Check translation files exist in `src/messages/`
- Ensure routing configuration matches i18n config

**3. Animation not working**
- Verify `framer-motion` is installed
- Check `AnimatePresence` wraps the conditional render
- Ensure `'use client'` directive is at top of file

**4. Click-outside not closing**
- Verify `dropdownRef` is attached to wrapper div
- Check event listener cleanup in useEffect

**5. TypeScript errors**
- Ensure `Locale` type is exported from `src/i18n.ts`
- Verify path aliases (`@/`) are configured in `tsconfig.json`

### Path Alias Configuration

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Complete Example Files

For reference implementation, see:
- Component: `src/components/layout/language-switcher.tsx`
- i18n Config: `src/i18n.ts`
- Routing: `src/routing.ts`
- Middleware: `src/middleware.ts`

---

## License

This implementation guide is provided as-is for educational and reuse purposes.
