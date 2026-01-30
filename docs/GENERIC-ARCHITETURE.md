# Generic Next.js 15 Multilingual Business Website Architecture

> **Purpose**: This document provides a comprehensive, reusable architecture template for building production-ready multilingual business websites using Next.js 15, TypeScript, Tailwind CSS v4, and next-intl v4. It is designed as an LLM-consumable specification for generating new websites following this proven pattern.
>
> **Last Updated**: January 2026
> **Compatibility**: Next.js 15.x (stable) / 16.x (latest), React 18/19, Tailwind CSS 4.x

---

## Table of Contents

1. [Technology Stack Overview](#1-technology-stack-overview)
2. [Project Structure](#2-project-structure)
3. [Configuration Files](#3-configuration-files)
4. [Internationalization (i18n) System](#4-internationalization-i18n-system)
5. [App Router Architecture](#5-app-router-architecture)
6. [Component Architecture](#6-component-architecture)
7. [Design System](#7-design-system)
8. [SEO Implementation](#8-seo-implementation)
9. [API Routes & Form Handling](#9-api-routes--form-handling)
10. [Analytics Integration](#10-analytics-integration)
11. [Security Headers](#11-security-headers)
12. [Implementation Patterns](#12-implementation-patterns)
13. [Step-by-Step Generation Guide](#13-step-by-step-generation-guide)

---

## 1. Technology Stack Overview

### Core Framework
```json
{
  "next": "^15.1.0",
  "react": "^18.3.0 || ^19.0.0",
  "react-dom": "^18.3.0 || ^19.0.0",
  "typescript": "^5.6"
}
```

> **Note**: Next.js 16 (released October 2025) introduces `proxy.ts` replacing `middleware.ts` and Turbopack as default bundler. This document covers Next.js 15 patterns with Next.js 16 migration notes where applicable.

### Essential Dependencies
```json
{
  "next-intl": "^4.0.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "motion": "^12.0.0",
  "lucide-react": "^0.563.0",
  "@vercel/analytics": "^1.4.1",
  "@vercel/speed-insights": "^1.1.0"
}
```

> **Note**: `framer-motion` has been rebranded to `motion`. Both package names work, but `motion` is the new official name.

### Development Dependencies
```json
{
  "@types/node": "^22",
  "@types/react": "^18 || ^19",
  "@types/react-dom": "^18 || ^19",
  "eslint": "^9",
  "eslint-config-next": "^15.1.0",
  "postcss": "^8",
  "tailwindcss": "^4.0.0"
}
```

### Key Technology Decisions

| Feature | Technology | Rationale |
|---------|------------|-----------|
| Framework | Next.js 15 App Router | Server components, streaming, enhanced SEO, Turbopack support |
| i18n | next-intl v4 | Tight Next.js integration, type safety, SSG support, improved bundle size |
| Styling | Tailwind CSS v4 | CSS-first config, Oxide engine (100x faster), modern browser support |
| Component Variants | CVA | Type-safe variants, composition patterns |
| Animations | Motion | Declarative animations, scroll triggers (formerly Framer Motion) |
| Icons | Lucide React | Consistent, tree-shakeable icon library |

### Browser Compatibility (Tailwind CSS v4)

Tailwind CSS v4 requires modern browser support:

| Browser | Minimum Version |
|---------|-----------------|
| Safari | 16.4+ |
| Chrome | 111+ |
| Firefox | 128+ |
| Edge | 111+ |

> **Warning**: If you need to support older browsers, consider staying on Tailwind CSS v3.4.x or using a PostCSS fallback strategy.

### Package Compatibility Matrix

| Package | Version | React 18 | React 19 | Next.js 15 | Next.js 16 |
|---------|---------|----------|----------|------------|------------|
| next-intl | 4.x | ✅ | ✅ | ✅ | ✅ (proxy.ts) |
| motion | 12.x | ✅ | ✅ | ✅ | ✅ |
| lucide-react | 0.563+ | ✅ | ✅ | ✅ | ✅ |
| CVA | 0.7.x | ✅ | ✅ | ✅ | ✅ |
| Tailwind CSS | 4.x | ✅ | ✅ | ✅ | ✅ |

---

## 2. Project Structure

```
project-root/
├── public/
│   ├── logos/                    # Brand assets (multiple sizes)
│   ├── images/                   # General images
│   └── [feature-specific]/       # Organized by feature
│
├── src/
│   ├── app/
│   │   ├── [locale]/             # Locale-specific routes
│   │   │   ├── layout.tsx        # Locale layout with i18n provider
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       ├── layout.tsx    # Optional: Page-specific layout
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── [endpoint]/
│   │   │       └── route.ts      # API routes
│   │   ├── layout.tsx            # Root layout (analytics, fonts)
│   │   ├── page.tsx              # Root page (redirect to locale)
│   │   ├── globals.css           # Global styles
│   │   ├── sitemap.ts            # Dynamic sitemap generation
│   │   ├── robots.ts             # Robots.txt configuration
│   │   └── manifest.json         # PWA manifest
│   │
│   ├── components/
│   │   ├── ui/                   # Atomic/primitive components
│   │   │   ├── button.tsx
│   │   │   ├── typography.tsx
│   │   │   ├── fade-in.tsx
│   │   │   └── [component].tsx
│   │   ├── sections/             # Composite/feature components
│   │   │   ├── service-card.tsx
│   │   │   ├── contact-form.tsx
│   │   │   └── [section].tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── icons/                # Custom icon components
│   │   │   └── [icon].tsx
│   │   └── analytics/            # Analytics components
│   │       └── [analytics].tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── use-scroll-animation.ts
│   │
│   ├── lib/                      # Utilities and configurations
│   │   ├── utils.ts              # cn() utility function
│   │   ├── fonts.ts              # Font configuration
│   │   ├── seo-config.ts         # SEO metadata helpers
│   │   ├── social-metadata.ts    # Social media optimization
│   │   └── structured-data.tsx   # JSON-LD schema generators
│   │
│   ├── messages/                 # i18n translation files
│   │   ├── en.json
│   │   ├── pt.json
│   │   ├── es.json
│   │   └── fr.json
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── [types].ts
│   │
│   ├── i18n.ts                   # i18n configuration
│   ├── routing.ts                # Locale routing setup
│   └── middleware.ts             # Locale detection middleware
│
├── docs/                         # Project documentation
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.js             # PostCSS configuration
└── package.json
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `ServiceCard.tsx` |
| Multi-word files | kebab-case | `background-motion.tsx` |
| Utilities | camelCase | `utils.ts`, `seoConfig.ts` |
| Pages | lowercase | `page.tsx`, `layout.tsx` |
| Message files | lowercase locale code | `en.json`, `pt.json` |
| Type files | kebab-case | `contact.ts` |

---

## 3. Configuration Files

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration

#### Tailwind CSS v4 (CSS-First Configuration)

Tailwind CSS v4 uses a CSS-first configuration approach. Create `src/app/globals.css`:

```css
@import "tailwindcss";

/* Custom theme configuration */
@theme {
  /* Primary palette (customize per project) */
  --color-primary-dark: #212529;
  --color-primary-blue: #2980b9;
  --color-dark-blue: #0a2046;
  --color-bg-light: #eaf9fa;
  --color-alert-red: #e74c3c;
  --color-muted: #475874;
  
  /* Font family */
  --font-inter: var(--font-inter), system-ui, sans-serif;
}

:root {
  --foreground-rgb: 15, 23, 42;
  --background-start-rgb: 248, 250, 252;
  --background-end-rgb: 255, 255, 255;
}

/* Force light mode */
@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 15, 23, 42;
    --background-start-rgb: 248, 250, 252;
    --background-end-rgb: 255, 255, 255;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@utility text-balance {
  text-wrap: balance;
}
```

> **Tailwind v4 Changes**:
> - No more `tailwind.config.ts` file needed
> - Use `@import "tailwindcss"` instead of `@tailwind` directives
> - Theme customization via `@theme` block in CSS
> - Custom utilities via `@utility` directive
> - PostCSS config simplified (just needs `@tailwindcss/postcss`)

#### PostCSS Configuration (`postcss.config.js`)

```javascript
// Tailwind CSS v4
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

#### Fallback: Tailwind CSS v3 Configuration (`tailwind.config.ts`)

If you need to support older browsers or use incompatible plugins, use Tailwind v3:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#212529',
        'primary-blue': '#2980b9',
        'dark-blue': '#0a2046',
        'bg-light': '#eaf9fa',
        'alert-red': '#e74c3c',
        'muted': '#475874',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
export default config;
```

### Next.js Configuration (`next.config.js`)

```javascript
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clarity.ms https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.clarity.ms",
              "font-src 'self' data:",
              "connect-src 'self' https://*.clarity.ms https://vitals.vercel-insights.com https://*.vercel-analytics.com",
              "frame-src 'self' https://www.google.com https://maps.google.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
```

### ESLint Configuration (`.eslintrc.json`)

```json
{
  "extends": "next/core-web-vitals"
}
```

---

## 4. Internationalization (i18n) System

### Core Configuration (`src/i18n.ts`)

```typescript
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'

export const locales = ['en', 'pt', 'es', 'fr'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming locale is valid
  const requested = await requestLocale
  const locale = hasLocale(locales, requested) ? requested : 'en'

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  }
})
```

> **next-intl v4 Changes**: 
> - Uses `requestLocale` instead of `locale` parameter
> - Uses `hasLocale()` for type-safe locale validation
> - Returns `locale` in the config object

### Routing Configuration (`src/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'pt', 'es', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'  // URLs always include locale prefix
})

// Export navigation utilities for use in components
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

> **next-intl v4 Changes**: 
> - Uses `createNavigation` instead of deprecated `createSharedPathnamesNavigation`
> - Adds `getPathname` export for server-side path generation

### Middleware (`src/middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except API, static files, and internal Next.js paths
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

> **Next.js 16 Migration Note**: In Next.js 16, `middleware.ts` is replaced by `proxy.ts`. The next-intl middleware should be placed in `src/proxy.ts` instead:
> ```typescript
> // src/proxy.ts (Next.js 16+)
> import createMiddleware from 'next-intl/middleware'
> import { routing } from './routing'
> 
> export default createMiddleware(routing)
> ```

### Message File Structure (`src/messages/en.json`)

```json
{
  "metadata": {
    "siteName": "Company Name",
    "pages": {
      "home": {
        "title": "Company Name - Tagline",
        "description": "SEO-optimized description"
      },
      "services": { "title": "...", "description": "..." },
      "about": { "title": "...", "description": "..." },
      "contact": { "title": "...", "description": "..." }
    },
    "social": {
      "home": {
        "title": "Social-optimized title with emoji",
        "description": "Engaging social description"
      }
    }
  },
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About",
    "contact": "Contact",
    "getQuote": "Get Quote"
  },
  "hero": {
    "title": "Main headline",
    "subtitle": "Supporting text",
    "description": "Detailed description",
    "cta": "Call to action"
  },
  "home": {
    "servicesTitle": "Section Title",
    "servicesSubtitle": "Section subtitle",
    "features": {
      "feature1": {
        "title": "Feature title",
        "description": "Feature description"
      }
    }
  },
  "services": {
    "title": "Page Title",
    "subtitle": "Page subtitle",
    "service1": {
      "title": "Service title",
      "description": "Service description",
      "feature1": "Feature 1",
      "feature2": "Feature 2"
    }
  },
  "about": {
    "title": "About Us",
    "story": {
      "title": "Our Story",
      "paragraph1": "Story text..."
    },
    "mission": { "title": "...", "description": "..." },
    "values": {
      "value1": { "title": "...", "description": "..." }
    }
  },
  "contact": {
    "title": "Contact Us",
    "address": "Physical address",
    "phone": "Phone number",
    "email": "Email address",
    "hours": {
      "weekdays": "Mon-Fri",
      "weekdaysTime": "9AM-6PM"
    },
    "form": {
      "name": "Your Name",
      "email": "Email",
      "submit": "Send Message",
      "successMessage": "Thank you!",
      "errorGeneric": "Error message"
    }
  },
  "footer": {
    "description": "Footer description",
    "quickLinks": "Quick Links",
    "rights": "All rights reserved."
  }
}
```

### Usage Pattern in Components

```typescript
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

export default function Component() {
  const t = useTranslations()

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <Link href="/services">{t('nav.services')}</Link>
    </div>
  )
}
```

---

## 5. App Router Architecture

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { inter } from '@/lib/fonts'
import { getBaseMetadata } from '@/lib/seo-config'
import './globals.css'

export const metadata: Metadata = getBaseMetadata('en')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Locale Layout (`src/app/[locale]/layout.tsx`)

```typescript
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/routing'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

// Enable static generation for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  // Await params in Next.js 15+
  const { locale } = await params
  
  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
```

> **next-intl v4 & Next.js 15 Changes**:
> - `unstable_setRequestLocale` is now stable as `setRequestLocale`
> - Use `getMessages()` instead of manual message imports
> - `NextIntlClientProvider` no longer needs explicit `locale` prop (inherits from parent)
> - `params` is now a Promise in Next.js 15 (must be awaited)
> - Use `hasLocale()` for type-safe validation

### Page Component Pattern (`src/app/[locale]/page.tsx`)

```typescript
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { getLocalizedSocialMetadata } from '@/lib/social-metadata'
import { StructuredData } from '@/lib/structured-data'
import { routing } from '@/routing'

// Static params for SSG
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  params: Promise<{ locale: string }>
}

// Dynamic metadata per locale
export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  
  return getLocalizedSocialMetadata({
    locale: locale as 'en' | 'pt' | 'es' | 'fr',
    pageKey: 'home',
    path: '',
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  
  // Enable static rendering
  setRequestLocale(locale)

  // Get translations (works in Server Components with next-intl v4)
  const t = useTranslations()

  return (
    <>
      {/* Structured Data */}
      <StructuredData type="Organization" />
      <StructuredData type="LocalBusiness" />
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: t('nav.home'), path: `/${locale}` },
          ],
        }}
      />

      {/* Page Content */}
      <section className="py-20">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.description')}</p>
      </section>
    </>
  )
}
```

> **Next.js 15 Changes**:
> - `params` is now a Promise and must be awaited
> - Use `setRequestLocale` (stable) instead of `unstable_setRequestLocale`
> - `generateStaticParams` uses `routing.locales` for consistency

### Sitemap Generation (`src/app/sitemap.ts`)

```typescript
import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/services', '/about', '/contact']
  const sitemapEntries: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    siteConfig.locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${siteConfig.url}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            siteConfig.locales.map((l) => [l, `${siteConfig.url}/${l}${route}`])
          ),
        },
      })
    })
  })

  return sitemapEntries
}
```

### Robots Configuration (`src/app/robots.ts`)

```typescript
import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

---

## 6. Component Architecture

### Utility Function (`src/lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Button Component with CVA (`src/components/ui/button.tsx`)

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary-blue hover:bg-dark-blue text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-muted hover:bg-primary-dark text-white',
        accent: 'bg-alert-red hover:bg-red-600 text-white shadow-lg',
        outline: 'border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white',
        ghost: 'hover:bg-bg-light text-primary-dark',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Typography Components (`src/components/ui/typography.tsx`)

```typescript
'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface TypographyBaseProps {
  gradient?: boolean
  glow?: boolean
  animate?: boolean
}

type TypographyProps = TypographyBaseProps &
  Omit<React.HTMLAttributes<HTMLHeadingElement>, 'onAnimationStart' | 'onAnimationEnd'>

export const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, gradient, glow, animate, children, ...props }, ref) => {
    const baseClasses = 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight'
    const gradientClasses = gradient
      ? 'bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent'
      : 'text-primary-dark'
    const glowClasses = glow ? 'drop-shadow-[0_0_15px_rgba(41,128,185,0.5)]' : ''

    if (animate) {
      return (
        <motion.h1
          ref={ref}
          className={cn(baseClasses, gradientClasses, glowClasses, className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          {...(props as any)}
        >
          {children}
        </motion.h1>
      )
    }

    return (
      <h1
        ref={ref}
        className={cn(baseClasses, gradientClasses, glowClasses, className)}
        {...props}
      >
        {children}
      </h1>
    )
  }
)
H1.displayName = 'H1'

// H2, H3, H4 follow same pattern with different base sizes
```

> **Motion Package Note**: Import from `motion/react` instead of `framer-motion`. The API is identical.

### FadeIn Animation Component (`src/components/ui/fade-in.tsx`)

```typescript
'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = '',
}: FadeInProps) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: -40 },
    right: { x: 40 },
    none: {},
  }

  const initialState = {
    opacity: 0,
    ...directionOffset[direction],
  }

  const animateState = {
    opacity: 1,
    x: 0,
    y: 0,
  }

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={isVisible ? animateState : initialState}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Scroll Animation Hook (`src/hooks/use-scroll-animation.ts`)

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}
```

### Section Card Component (`src/components/sections/service-card.tsx`)

```typescript
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/routing'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  ctaText: string
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  ctaText,
}: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary-blue/5 transition-transform duration-300 group-hover:scale-150" />

      <div className="relative">
        <div className="mb-4 inline-flex rounded-xl bg-primary-blue/10 p-3">
          <Icon className="h-8 w-8 text-primary-blue" />
        </div>

        <h3 className="mb-3 text-2xl font-bold text-primary-dark">{title}</h3>
        <p className="mb-6 text-muted">{description}</p>

        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link href="/contact">
          <Button variant="outline" className="w-full group-hover:bg-primary-blue group-hover:text-white">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

### Layout Components

#### Header (`src/components/layout/header.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/routing'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  const locales = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    window.location.href = `/${newLocale}${pathname}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logos/logo.png"
            alt="Company Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-primary-dark">Company Name</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors ${
                pathname === item.href
                  ? 'text-primary-blue'
                  : 'text-gray-700 hover:text-primary-blue'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Contact & CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-6">
          <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted hover:text-primary-blue transition-colors">
            <Phone className="h-4 w-4" />
            <span>{t('contact.phone')}</span>
          </a>
          <Link href="/contact">
            <Button size="sm">{t('nav.getQuote')}</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-gray-200 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'bg-primary-blue/10 text-primary-blue'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-blue'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
```

---

## 7. Design System

### Color Palette Template

```typescript
// tailwind.config.ts colors section
colors: {
  // Primary brand colors (customize per project)
  'primary-dark': '#212529',      // Dark text, headings
  'primary-blue': '#2980b9',       // Primary brand color
  'dark-blue': '#0a2046',          // Secondary/deeper brand

  // Utility colors
  'bg-light': '#eaf9fa',           // Light backgrounds
  'muted': '#475874',              // Muted text
  'alert-red': '#e74c3c',          // Warnings, CTAs
}
```

### Typography Scale

```css
/* Base typography classes */
.text-5xl { font-size: 3rem; }     /* 48px - H1 mobile */
.text-6xl { font-size: 3.75rem; }  /* 60px - H1 tablet */
.text-7xl { font-size: 4.5rem; }   /* 72px - H1 desktop */

.text-4xl { font-size: 2.25rem; }  /* 36px - H2 mobile */
.text-5xl { font-size: 3rem; }     /* 48px - H2 tablet */
.text-6xl { font-size: 3.75rem; }  /* 60px - H2 desktop */

.text-3xl { font-size: 1.875rem; } /* 30px - H3 mobile */
.text-4xl { font-size: 2.25rem; }  /* 36px - H3 tablet */
```

### Spacing System

```css
/* Common spacing patterns */
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }     /* Section mobile */
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }     /* Section tablet */
.py-24 { padding-top: 6rem; padding-bottom: 6rem; }     /* Section desktop */

.gap-8 { gap: 2rem; }              /* Grid gap base */
.gap-12 { gap: 3rem; }             /* Grid gap large */
```

### Font Configuration (`src/lib/fonts.ts`)

```typescript
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
```

### Global Styles (`src/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 15, 23, 42;
  --background-start-rgb: 248, 250, 252;
  --background-end-rgb: 255, 255, 255;
}

/* Force light mode */
@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 15, 23, 42;
    --background-start-rgb: 248, 250, 252;
    --background-end-rgb: 255, 255, 255;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 8. SEO Implementation

### Site Configuration (`src/lib/seo-config.ts`)

```typescript
import { Metadata } from 'next'

export const siteConfig = {
  name: 'Company Name',
  description: 'Company description for SEO',
  url: 'https://example.com',
  ogImage: '/logos/og-image.png',
  keywords: [
    'keyword1',
    'keyword2',
    'service keywords',
  ],
  locales: ['en', 'pt', 'es', 'fr'] as const,
  defaultLocale: 'en' as const,
}

export const businessInfo = {
  name: 'Company Name',
  type: 'Business Type',
  address: {
    streetAddress: '123 Main St',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  phone: '+1-234-567-8900',
  email: 'contact@example.com',
  priceRange: '$$',
  openingHours: 'Mo-Fr 09:00-18:00, Sa 10:00-16:00',
  services: ['Service 1', 'Service 2', 'Service 3'],
}

export const socialLinks = {
  facebook: 'https://facebook.com/company',
  instagram: 'https://instagram.com/company',
  twitter: '@company',
}

export function getBaseMetadata(locale: string = 'en'): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      template: `%s | ${siteConfig.name}`,
      default: `${siteConfig.name} - Tagline`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: getLocaleCode(locale),
      alternateLocale: getAlternateLocales(locale),
      siteName: siteConfig.name,
      title: `${siteConfig.name} - Tagline`,
      description: siteConfig.description,
      images: [{
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Logo`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: socialLinks.twitter,
      creator: socialLinks.twitter,
      title: `${siteConfig.name} - Tagline`,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function getPageMetadata({
  title,
  description,
  path,
  locale = 'en',
  image,
  noIndex = false,
}: {
  title: string
  description?: string
  path: string
  locale?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const pageDescription = description || siteConfig.description
  const pageImage = image || siteConfig.ogImage
  const absoluteImageUrl = pageImage.startsWith('http')
    ? pageImage
    : `${siteConfig.url}${pageImage}`
  const url = `${siteConfig.url}/${locale}${path}`

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        pt: `${siteConfig.url}/pt${path}`,
        es: `${siteConfig.url}/es${path}`,
        fr: `${siteConfig.url}/fr${path}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: getLocaleCode(locale),
      alternateLocale: getAlternateLocales(locale),
      siteName: siteConfig.name,
      title,
      description: pageDescription,
      url,
      images: [{
        url: absoluteImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: socialLinks.twitter,
      creator: socialLinks.twitter,
      title,
      description: pageDescription,
      images: [absoluteImageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

function getLocaleCode(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en_US',
    pt: 'pt_BR',
    es: 'es_ES',
    fr: 'fr_FR',
  }
  return localeMap[locale] || 'en_US'
}

function getAlternateLocales(locale: string): string[] {
  return siteConfig.locales
    .filter((l) => l !== locale)
    .map((l) => getLocaleCode(l))
}
```

### Structured Data (`src/lib/structured-data.tsx`)

```typescript
import { businessInfo, siteConfig, socialLinks } from './seo-config'

export type StructuredDataType =
  | 'Organization'
  | 'LocalBusiness'
  | 'BreadcrumbList'
  | 'FAQPage'

interface StructuredDataProps {
  type: StructuredDataType
  data?: Record<string, any>
}

export function generateStructuredData({ type, data = {} }: StructuredDataProps) {
  const schemas: Record<StructuredDataType, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: businessInfo.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.ogImage}`,
      description: siteConfig.description,
      sameAs: Object.values(socialLinks).filter((link) => link !== ''),
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: businessInfo.phone,
        email: businessInfo.email,
        contactType: 'Customer Service',
        availableLanguage: ['en', 'pt', 'es', 'fr'],
      },
    },
    LocalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${siteConfig.url}#business`,
      name: businessInfo.name,
      description: siteConfig.description,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.ogImage}`,
      telephone: businessInfo.phone,
      email: businessInfo.email,
      priceRange: businessInfo.priceRange,
      address: {
        '@type': 'PostalAddress',
        ...businessInfo.address,
      },
      openingHoursSpecification: parseOpeningHours(businessInfo.openingHours),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: businessInfo.services.map((service, index) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service },
          position: index + 1,
        })),
      },
    },
    BreadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data.breadcrumbs || []).map((crumb: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${siteConfig.url}${crumb.path}`,
      })),
    },
    FAQPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data.faqs || []).map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  }

  return schemas[type]
}

function parseOpeningHours(hoursString: string) {
  // Parse "Mo-Fr 09:00-18:00, Sa 10:00-16:00" format
  const segments = hoursString.split(',').map((s) => s.trim())
  const specs: any[] = []

  const dayMap: Record<string, string> = {
    Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday',
    Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
  }

  segments.forEach((segment) => {
    const [days, hours] = segment.split(' ')
    const [opens, closes] = hours.split('-')

    if (days.includes('-')) {
      const [start, end] = days.split('-')
      const daysOfWeek = Object.keys(dayMap)
      const startIndex = daysOfWeek.indexOf(start)
      const endIndex = daysOfWeek.indexOf(end)

      for (let i = startIndex; i <= endIndex; i++) {
        specs.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dayMap[daysOfWeek[i]],
          opens,
          closes,
        })
      }
    } else {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[days],
        opens,
        closes,
      })
    }
  })

  return specs
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = generateStructuredData({ type, data })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

---

## 9. API Routes & Form Handling

### Contact API Route (`src/app/api/contact/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

// Rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const clientData = rateLimitMap.get(ip)

  if (!clientData) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  clientData.count++
  return clientData.count > RATE_LIMIT_MAX_REQUESTS
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  return /^\+?\d{10,15}$/.test(cleanPhone)
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 1000)
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'rate_limit' },
        { status: 429 }
      )
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('Missing CONTACT_WEBHOOK_URL')
      return NextResponse.json(
        { success: false, error: 'server_error' },
        { status: 500 }
      )
    }

    let formData: ContactFormData
    try {
      formData = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'invalid_json' },
        { status: 400 }
      )
    }

    // Validate
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return NextResponse.json(
        { success: false, error: 'validation' },
        { status: 400 }
      )
    }

    if (!isValidEmail(formData.email)) {
      return NextResponse.json(
        { success: false, error: 'invalid_email' },
        { status: 400 }
      )
    }

    if (!isValidPhone(formData.phone)) {
      return NextResponse.json(
        { success: false, error: 'invalid_phone' },
        { status: 400 }
      )
    }

    // Sanitize
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      service: sanitizeInput(formData.service),
      message: sanitizeInput(formData.message),
    }

    // Send to webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData),
      signal: AbortSignal.timeout(15000),
    })

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'webhook_error' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Contact request received' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
```

### Type Definitions (`src/types/contact.ts`)

```typescript
export interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export interface ContactApiSuccess {
  success: true
  message: string
}

export interface ContactApiError {
  success: false
  error: string
  field?: string
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError
```

### Contact Form Component (`src/components/sections/contact-form.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { ContactFormData, ContactApiResponse } from '@/types/contact'

export function ContactForm() {
  const t = useTranslations()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', service: '', message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data: ContactApiResponse = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', service: '', message: '' })
          setSubmitStatus('idle')
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(t(`contact.form.error${data.error}`) || t('contact.form.errorGeneric'))
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage(t('contact.form.errorNetwork'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-primary-dark">
            {t('contact.form.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
          />
        </div>
        {/* Additional form fields... */}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
      </Button>

      {submitStatus === 'success' && (
        <p className="text-sm text-green-600">{t('contact.form.successMessage')}</p>
      )}
      {submitStatus === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </form>
  )
}
```

---

## 10. Analytics Integration

### Vercel Analytics Setup

Already included in root layout. No additional configuration needed for Vercel deployments.

### Microsoft Clarity Integration (`src/components/analytics/ClarityAnalytics.tsx`)

```typescript
'use client'

import { useEffect } from 'react'
import clarity from '@microsoft/clarity'

export function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID

    if (!projectId) {
      console.warn('Microsoft Clarity: Project ID not found')
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      console.info('Microsoft Clarity: Disabled in development mode')
      return
    }

    try {
      clarity.init(projectId)
      console.info('Microsoft Clarity: Initialized successfully')
    } catch (error) {
      console.error('Microsoft Clarity: Failed to initialize', error)
    }
  }, [])

  return null
}
```

### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID=your-project-id
CONTACT_WEBHOOK_URL=https://your-webhook-endpoint.com/contact
CONTACT_WEBHOOK_AUTH_TOKEN=your-auth-token
```

---

## 11. Security Headers

Configured in `next.config.js`:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | SAMEORIGIN | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME type sniffing |
| Referrer-Policy | origin-when-cross-origin | Control referrer info |
| Content-Security-Policy | Detailed CSP | XSS protection |

---

## 12. Implementation Patterns

### Adding a New Locale

1. Add locale code to arrays in:
   - `src/i18n.ts` → `locales` array
   - `src/routing.ts` → `locales` array
   - `src/lib/seo-config.ts` → `locales` array and `getLocaleCode` function

2. Create translation file: `src/messages/{locale}.json`

3. Update `generateStaticParams` in all pages

4. Add locale mapping in `getLocaleCode()` function

### Adding a New Page

1. Create directory: `src/app/[locale]/page-name/`
2. Create `page.tsx` with:
   - `generateStaticParams()` for SSG
   - `generateMetadata()` for SEO
   - `unstable_setRequestLocale()` call
   - Structured data components
3. Add translations to all locale message files
4. Add route to Header navigation
5. Add to sitemap routes array

### Adding a New Component

1. Determine component type:
   - `ui/` → Atomic, reusable primitives
   - `sections/` → Feature-specific composites
   - `layout/` → Page structure components

2. Use CVA pattern for variants
3. Use `cn()` utility for className merging
4. Export component and TypeScript types
5. Use `'use client'` directive only if needed

### Form Handling Pattern

1. Create type definitions in `src/types/`
2. Create API route in `src/app/api/`
3. Implement rate limiting and validation
4. Create form component with:
   - State management for form data
   - Loading and error states
   - Translation-based error messages
   - Accessible form controls

---

## 13. Step-by-Step Generation Guide

### Phase 1: Project Initialization

```bash
# 1. Create Next.js 15 project
npx create-next-app@latest project-name --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Install dependencies
npm install next-intl@^4 class-variance-authority clsx tailwind-merge motion lucide-react @vercel/analytics @vercel/speed-insights

# 3. Create directory structure
mkdir -p src/{messages,hooks,lib,types,components/{ui,sections,layout,icons,analytics}}
```

> **Note**: The `--tailwind` flag in `create-next-app` still uses Tailwind v3 by default. To use Tailwind v4:
> ```bash
> # After project creation, upgrade to Tailwind v4
> npm install tailwindcss@^4 @tailwindcss/postcss
> # Then update postcss.config.js and globals.css per v4 configuration above
> ```

### Phase 2: Core Configuration

1. Configure TypeScript (`tsconfig.json`)
2. Configure Tailwind (CSS-first `globals.css` for v4 or `tailwind.config.ts` for v3)
3. Configure PostCSS (`postcss.config.js`)
4. Configure Next.js (`next.config.js`) with next-intl plugin and security headers
5. Create utility functions (`src/lib/utils.ts`)
6. Configure fonts (`src/lib/fonts.ts`)

### Phase 3: Internationalization Setup

1. Create `src/i18n.ts` with locale configuration
2. Create `src/routing.ts` with navigation utilities
3. Create `src/middleware.ts` for locale detection
4. Create translation files in `src/messages/`

### Phase 4: Layout Structure

1. Create root layout (`src/app/layout.tsx`)
2. Create locale layout (`src/app/[locale]/layout.tsx`)
3. Create header component (`src/components/layout/header.tsx`)
4. Create footer component (`src/components/layout/footer.tsx`)
5. Add global styles (`src/app/globals.css`)

### Phase 5: SEO Implementation

1. Create SEO config (`src/lib/seo-config.ts`)
2. Create social metadata helpers (`src/lib/social-metadata.ts`)
3. Create structured data generators (`src/lib/structured-data.tsx`)
4. Create sitemap generator (`src/app/sitemap.ts`)
5. Create robots config (`src/app/robots.ts`)

### Phase 6: Component Library

1. Create Button component with CVA
2. Create Typography components (H1, H2, etc.)
3. Create FadeIn animation component
4. Create scroll animation hook
5. Create section components (cards, forms, etc.)

### Phase 7: Pages

1. Create home page (`src/app/[locale]/page.tsx`)
2. Create services page
3. Create about page
4. Create contact page with form

### Phase 8: API & Forms

1. Create type definitions
2. Create API route with validation
3. Implement rate limiting

### Phase 9: Analytics & Monitoring

1. Add Vercel Analytics to root layout
2. Add Speed Insights
3. Configure Clarity (optional)

### Phase 10: Testing & Deployment

1. Run build to verify SSG
2. Test all locales
3. Validate structured data
4. Check SEO metadata
5. Deploy to Vercel

---

## Appendix: Environment Variables

```bash
# Production Environment
NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID=
CONTACT_WEBHOOK_URL=
CONTACT_WEBHOOK_AUTH_TOKEN=

# Optional
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=
```

---

**Document Version**: 2.0
**Architecture Reference**: Creative R US Website
**Originally Created**: December 2024
**Last Updated**: January 2026
**Purpose**: LLM-consumable specification for generating multilingual Next.js 15/16 business websites

---

### Changelog

#### v2.0 (January 2026)
- Updated to Next.js 15 (stable) with Next.js 16 migration notes
- Updated to next-intl v4 with new API patterns (`hasLocale`, `setRequestLocale`, `createNavigation`)
- Updated to Tailwind CSS v4 with CSS-first configuration
- Updated framer-motion to motion (rebranding)
- Added package compatibility matrix
- Added browser compatibility requirements for Tailwind v4
- Updated all code examples with async params pattern (Next.js 15)

#### v1.0 (December 2024)
- Initial architecture document
- Next.js 14, next-intl v3, Tailwind CSS v3, Framer Motion v11