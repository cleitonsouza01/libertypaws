# Liberty Paws International

Multilingual (EN/ES/PT) Next.js 16 website for Service Dog & ESA registration services.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Runtime | React | 19.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS (v4, CSS-first) | 4.x |
| i18n | next-intl | 4.x |
| Animation | motion (not framer-motion) | 12.x |
| Icons | lucide-react | 0.563+ |
| Components | CVA + clsx + tailwind-merge | — |
| Backend | Supabase (planned) | 2.x |
| CDN | Cloudflare R2 | — |
| Analytics | Vercel Analytics + Speed Insights | — |
| Deploy | Vercel | — |

## Project Structure

```
web/                          # Next.js application root
├── src/
│   ├── app/
│   │   ├── [locale]/         # Locale-based routing (en, es, pt)
│   │   │   ├── layout.tsx    # Locale layout (Header + Footer + providers)
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── products/     # Product catalog + [slug] detail pages
│   │   │   └── contact/      # Contact page
│   │   ├── api/contact/      # Contact API (not yet implemented)
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Root redirect → default locale
│   │   └── globals.css       # Tailwind v4 @theme tokens
│   ├── components/
│   │   ├── ui/               # Base components (Button, Card, Input, Badge, etc.)
│   │   ├── sections/         # Page sections (Hero, ProductGrid, Testimonials, etc.)
│   │   └── layout/           # Header, Footer, MobileNav, LanguageSwitcher
│   ├── data/products.ts      # Static product catalog
│   ├── i18n/                 # next-intl config + routing
│   ├── lib/
│   │   ├── utils.ts          # cn() helper (clsx + tailwind-merge)
│   │   ├── assets.ts         # getAssetUrl(), getImageUrl(), getVideoUrl()
│   │   └── fonts.ts          # Inter font via next/font/google
│   ├── messages/             # Translation JSON files
│   │   ├── en.json           # English (source of truth)
│   │   ├── es.json           # Spanish
│   │   └── pt.json           # Portuguese
│   └── middleware.ts         # next-intl locale routing middleware
├── public/
│   ├── images/               # Local images (products, categories, trust badges)
│   └── videos/               # Hero carousel videos
└── package.json
docs/                         # Project documentation
├── WEBSITE-DESIGN-SPEC.md    # Full design spec + product catalog
├── GENERIC-ARCHITETURE.md    # Architecture patterns
├── i18next-rules.md          # i18n workflow rules (CRITICAL)
└── GENERIC-SEO-PRATICES.md   # SEO guidelines
```

## Commands

```bash
cd web && PORT=3050 next dev   # Dev server at localhost:3050
cd web && next build           # Production build
cd web && eslint               # Lint
./r2-sync.sh                   # Sync assets to Cloudflare R2
```

## Critical Rules

### 1. Internationalization (i18n)

**English is the source of truth.** All translation keys MUST be created in `en.json` first, then replicated to `es.json` and `pt.json` with identical structure.

- **Search before creating** any new translation key — zero tolerance for duplicates
- **Identical structure** across all 3 locale files at all times
- **Validate JSON** after every change (malformed JSON breaks the entire app)
- **Use `useTranslations()`** hook in client components, `getTranslations()` in server components
- See `docs/i18next-rules.md` for the full mandatory workflow

```typescript
// Client component
const t = useTranslations('products')
t('title') // reads from messages/[locale].json → products.title

// Server component
const t = await getTranslations('products')
```

### 2. Tailwind CSS v4 (CSS-First Config)

There is **no `tailwind.config.js`**. Theme tokens are defined in `globals.css` via `@theme`:

```css
@theme {
  --color-brand-navy: #2b301d;
  --color-brand-lime: #5d7901;
  --color-brand-red: #c41e3a;
  --color-bg-cream: #faf8f5;
  --font-inter: var(--font-inter), system-ui, sans-serif;
}
```

Usage: `bg-brand-lime`, `text-brand-navy`, `bg-bg-cream`, etc.

### 3. Asset URLs — Never Hardcode

Always use helpers from `@/lib/assets`:

```typescript
import { getAssetUrl, getImageUrl, getVideoUrl } from '@/lib/assets'

getImageUrl('images/products/esa-housing.jpg')  // R2 CDN in prod, /images/... in dev
getVideoUrl('videos/hero-airport-checkpoint.mp4')
```

### 4. Component Patterns

Components use **CVA** (class-variance-authority) for type-safe variants + `cn()` for class merging:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const variants = cva('base-classes', {
  variants: { variant: { primary: '...', secondary: '...' }, size: { sm: '...', md: '...' } },
  defaultVariants: { variant: 'primary', size: 'md' },
})

// In component JSX:
<div className={cn(variants({ variant, size, className }))} />
```

### 5. Import Aliases

Path alias `@/*` maps to `./src/*`:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { products } from '@/data/products'
```

### 6. Dynamic Routes & Locale

All pages live under `[locale]/`. Params are async in Next.js 16:

```typescript
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  // ...
}
```

### 7. Animation Library

Use `motion` (the rebranded package), **not** `framer-motion`:

```typescript
import { motion } from 'motion/react'
```

## Design Tokens

| Token | Value | Tailwind Class |
|-------|-------|---------------|
| Navy | `#2b301d` | `text-brand-navy`, `bg-brand-navy` |
| Lime | `#5d7901` | `text-brand-lime`, `bg-brand-lime` |
| Lime Dark | `#4a6101` | `bg-brand-lime-dark` |
| Red | `#c41e3a` | `text-brand-red`, `bg-brand-red` |
| Blue | `#3374ff` | `text-brand-blue` |
| Cream BG | `#faf8f5` | `bg-bg-cream` |
| Text Primary | `#1b1b1b` | `text-text-primary` |
| Text Muted | `#636363` | `text-text-muted` |
| Border Light | `#e5e5e5` | `border-border-light` |
| Font | Inter | `font-sans` (via CSS var) |
| Corners | `rounded-2xl` / `rounded-full` (buttons) | — |

## Locales

| Code | Language | Flag | Market |
|------|----------|------|--------|
| `en` | English | US | Default, primary |
| `es` | Espanol | ES | Spanish-speaking |
| `pt` | Portugues | BR | Brazil |

## Product Categories

- **ESA** — Emotional Support Animal letters (housing, travel, combo)
- **PSD** — Psychiatric Service Dog registration & training
- **Documents** — Certificates, ID cards, Apple Wallet cards
- **Accessories** — Collars, leashes, vests

## Current Status

**Phase 1 (Landing Page)** — In Progress
- [x] App Router with locale routing
- [x] Component library (21 components)
- [x] Product catalog (static data)
- [x] Hero video carousel
- [x] Cloudflare R2 CDN integration
- [ ] Contact form API (Supabase)
- [ ] SEO metadata (sitemap, robots.txt)
- [ ] Legal pages (privacy, terms)

**Phase 2 (Webapp)** — Planned: Auth, pet registration portal, user dashboard
**Phase 3 (E-commerce)** — Planned: Checkout, payments (Stripe/Square), orders
