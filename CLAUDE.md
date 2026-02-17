# Liberty Paws International

Multilingual (EN/ES/PT) Next.js 16 website for Service Dog & ESA registration services.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Runtime | React | 19.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS (v4, CSS-first) | 4.x |
| UI Library | DaisyUI | 5.x |
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
│   │   └── globals.css       # Tailwind v4 @theme tokens + DaisyUI theme
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

## AI Standards — MUST Follow

**Before writing any code, check existing patterns in the codebase.** All new code MUST follow the conventions below. Do NOT invent custom styles, use raw HTML/CSS for things DaisyUI provides, or deviate from established patterns.

### 1. DaisyUI First — Always Use DaisyUI Components

DaisyUI is the primary UI library. **Always use DaisyUI classes** instead of writing custom CSS or raw Tailwind for common UI patterns.

| Element | Use (DaisyUI) | Do NOT use |
|---------|---------------|------------|
| Buttons | `btn btn-primary`, `btn-secondary`, `btn-ghost`, `btn-outline` | Custom `bg-*` + `px-*` + `py-*` button styles |
| Cards | `card`, `card-body`, `card-title`, `card-actions` | Custom `rounded-*` + `shadow-*` + `p-*` wrappers |
| Badges | `badge badge-primary badge-soft` | Custom `inline-flex` + `rounded-full` + `text-xs` |
| Inputs | `input`, `textarea`, `select` with `fieldset`/`fieldset-legend` | Custom styled `<input>` elements |
| Navigation | `navbar`, `navbar-start`, `navbar-center`, `navbar-end` | Custom header flex layouts |
| Footer | `footer`, `footer-title`, `link link-hover` | Custom footer grid layouts |
| Dropdown | `dropdown`, `dropdown-end`, `dropdown-content` | Custom popover implementations |
| Menu | `menu`, `menu-horizontal` | Custom `<ul>` nav lists |
| Rating | `rating`, `mask mask-star-2` | Custom star implementations |
| Avatar | `avatar` | Custom image wrappers |
| Hero | `hero`, `hero-content` | Custom hero section layouts |

**DaisyUI semantic colors are mandatory:**

| Color Purpose | DaisyUI Class | Hex Value |
|---------------|---------------|-----------|
| Primary action | `text-primary`, `bg-primary`, `btn-primary` | #5d7901 (lime) |
| Secondary/headings | `text-secondary`, `bg-secondary` | #2b301d (navy) |
| Error/accent | `text-error`, `btn-error` | #c41e3a (red) |
| Info/links | `text-accent`, `text-info` | #3374ff (blue) |
| Backgrounds | `bg-base-100` / `bg-base-200` / `bg-base-300` | cream/white/light |
| Body text | `text-base-content` | #1b1b1b |
| Muted text | `text-base-content/60` | — |
| Borders | `border-base-300` | — |

### 2. DaisyUI Theme Configuration

The custom theme is defined in `globals.css` using CSS-first DaisyUI v5 plugin syntax:

```css
@plugin "daisyui";
@plugin "daisyui/theme" {
  name: "libertypaws";
  default: true;
  color-scheme: light;
  --color-primary: #5d7901;
  --color-secondary: #2b301d;
  --color-error: #c41e3a;
  --color-base-100: #faf8f5;
  /* ... see globals.css for full config */
}
```

The theme is activated via `data-theme="libertypaws"` on the `<html>` element in `[locale]/layout.tsx`.

**Legacy `@theme` tokens** (`bg-brand-lime`, `text-brand-navy`, etc.) still exist for backward compatibility but **prefer DaisyUI semantic classes** for all new code.

### 3. Internationalization (i18n)

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

### 4. Tailwind CSS v4 (CSS-First Config)

There is **no `tailwind.config.js`**. Theme tokens are defined in `globals.css` via `@theme`. DaisyUI is loaded via `@plugin "daisyui"`.

### 5. Asset URLs — Never Hardcode

Always use helpers from `@/lib/assets`:

```typescript
import { getAssetUrl, getImageUrl, getVideoUrl } from '@/lib/assets'

getImageUrl('images/products/esa-housing.jpg')  // R2 CDN in prod, /images/... in dev
getVideoUrl('videos/hero-airport-checkpoint.mp4')
```

### 6. Component Patterns

Components use **CVA** (class-variance-authority) for type-safe variants mapped to **DaisyUI classes** + `cn()` for class merging:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// CVA variants map to DaisyUI classes
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline btn-primary',
      ghost: 'btn-ghost',
    },
    size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
```

### 7. Import Aliases

Path alias `@/*` maps to `./src/*`:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { products } from '@/data/products'
```

### 8. Dynamic Routes & Locale

All pages live under `[locale]/`. Params are async in Next.js 16:

```typescript
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  // ...
}
```

### 9. Animation Library

Use `motion` (the rebranded package), **not** `framer-motion`:

```typescript
import { motion } from 'motion/react'
```

### 10. Mobile-First Layout

- Content-first on mobile: text/CTA above media (images/videos)
- Use `flex-col lg:flex-row` to stack on mobile, side-by-side on desktop
- All components must be responsive — test at 375px and 1280px minimum

## Design Tokens

### DaisyUI Semantic Colors (Primary — use these)

| Purpose | Class | Hex |
|---------|-------|-----|
| Primary | `primary` | #5d7901 |
| Primary text | `primary-content` | #ffffff |
| Secondary | `secondary` | #2b301d |
| Secondary text | `secondary-content` | #ffffff |
| Accent/Info | `accent` / `info` | #3374ff |
| Error | `error` | #c41e3a |
| Success | `success` | #5d7901 |
| Warning | `warning` | #f59e0b |
| Base 100 | `base-100` | #faf8f5 (cream) |
| Base 200 | `base-200` | #ffffff |
| Base 300 | `base-300` | #f5f5f5 |
| Base content | `base-content` | #1b1b1b |
| Neutral | `neutral` | #2b301d |

### Legacy Brand Tokens (backward compat only)

| Token | Value | Tailwind Class |
|-------|-------|---------------|
| Navy | `#2b301d` | `text-brand-navy`, `bg-brand-navy` |
| Lime | `#5d7901` | `text-brand-lime`, `bg-brand-lime` |
| Lime Dark | `#4a6101` | `bg-brand-lime-dark` |
| Red | `#c41e3a` | `text-brand-red`, `bg-brand-red` |
| Blue | `#3374ff` | `text-brand-blue` |
| Cream BG | `#faf8f5` | `bg-bg-cream` |

### Typography & Shape

| Token | Value |
|-------|-------|
| Font | Inter (`font-sans` via CSS var) |
| Border radius (boxes) | `--radius-box: 1rem` |
| Border radius (buttons/inputs) | `--radius-field: 2rem` (pill shape) |

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
- [x] DaisyUI 5 integration with custom theme
- [ ] Contact form API (Supabase)
- [ ] SEO metadata (sitemap, robots.txt)
- [ ] Legal pages (privacy, terms)

**Phase 2 (Webapp)** — Planned: Auth, pet registration portal, user dashboard
**Phase 3 (E-commerce)** — Planned: Checkout, payments (Stripe/Square), orders
