# Liberty Paws International - Website Design & Development Specification

> **Document Version**: 1.0
> **Generated**: January 2026
> **Status**: Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Analysis](#2-business-analysis)
3. [Information Architecture](#3-information-architecture)
4. [Page Specifications](#4-page-specifications)
5. [Design System](#5-design-system)
6. [Component Inventory](#6-component-inventory)
7. [AI Asset Generation Plan](#7-ai-asset-generation-plan)
8. [Implementation Roadmap](#8-implementation-roadmap)
9. [Technical Specifications](#9-technical-specifications)
10. [Future Webapp Expansion](#10-future-webapp-expansion)

---

## 1. Executive Summary

### Project Overview

Design and development of a multilingual landing page website for **Liberty Paws International**, a company specializing in service dog and emotional support animal (ESA) registration kits, certificates, ID cards, and accessories. Phase 1 focuses on a product showcase landing page with future expansion into a full webapp with authentication and e-commerce capabilities.

### Key Objectives

- **Product Showcase**: Present the complete product catalog with professional imagery
- **Trust Building**: Establish credibility through warm, friendly design and clear information
- **Multilingual Reach**: Serve English, Spanish, and Portuguese-speaking markets
- **Lead Generation**: Capture contact inquiries via Supabase-stored form submissions
- **Future-Ready**: Architecture designed for seamless webapp expansion

### Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | App Router, SSG, Server Components |
| TypeScript | Type safety |
| Tailwind CSS v4 | CSS-first styling |
| next-intl v4 | Internationalization (EN, ES, PT) |
| Motion | Animations (formerly Framer Motion) |
| Lucide React | Icons |
| Supabase | Contact form storage (Phase 1), Auth & DB (Phase 2) |
| Vercel | Hosting & Analytics |

### Project Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Landing Page (Home, Products, Contact) | 🎯 Current |
| **Phase 2** | Webapp (Auth, Pet Registration, User Dashboard) | 📋 Planned |
| **Phase 3** | E-commerce (Full checkout, Payment integration) | 📋 Planned |

---

## 2. Business Analysis

### 2.1 Company Profile

| Attribute | Value |
|-----------|-------|
| **Company Name** | Liberty Paws International |
| **Industry** | Pet Services / Service Animal Registration |
| **Current Platform** | Square Online Store |
| **Website** | libertypawsinternational.com |
| **Languages** | English, Spanish, Portuguese |
| **Copyright** | © 2026 |

### 2.2 Unique Value Proposition

> "Complete service dog and emotional support animal registration solutions with professional ID cards, certificates, and accessories—delivered with care and authenticity."

### 2.3 Target Personas

#### Persona 1: Service Dog Handler
- **Age**: 25-65
- **Need**: Legitimate service dog documentation and identification
- **Pain Points**: Confusing requirements, unprofessional-looking IDs, lack of support
- **Key Message**: "Professional, recognized documentation that gives you confidence everywhere you go."

#### Persona 2: ESA Owner
- **Age**: 20-50
- **Need**: Emotional support animal documentation for housing/travel
- **Pain Points**: Landlord disputes, airline requirements, unclear processes
- **Key Message**: "Complete ESA documentation packages that help you and your companion stay together."

#### Persona 3: Property Manager/Landlord
- **Age**: 30-60
- **Need**: Verify ESA registration legitimacy
- **Pain Points**: Fraudulent documentation, liability concerns
- **Key Message**: "Verifiable registration system you can trust for housing compliance."

### 2.4 Product Catalog

| Category | Products | Price Range |
|----------|----------|-------------|
| **Service Dog Kits** | Deluxe Kit, Complete Kit, Comprehensive Coverage Kit | $119.99 - $299.90 |
| **ESA Kits** | Complete ESA Kit, Comprehensive Coverage Kit, Housing Package | $119.99 - $249.99 |
| **Documents** | Service Dog Document Kit, ESA Document Kit, DOT Travel Form | $49.99 - $89.99 |
| **Certificates** | Service Dog Certificate, ESA Certificate | $49.99 |
| **ID Cards** | Service Dog ID Card, ESA ID Card | $49.99 |
| **Accessories** | ESA Collar, ESA Leash | $29.99 |

### 2.5 Competitive Differentiators

- ✅ Complete registration kits with everything included
- ✅ Professional, high-quality ID cards and certificates
- ✅ Apple Wallet digital card option ($59.99 add-on)
- ✅ Trilingual support (EN/ES/PT)
- ✅ Searchable registration database
- ✅ Housing-specific ESA packages

---

## 3. Information Architecture

### 3.1 Sitemap (Phase 1)

```
/
├── [locale]/                      # en, es, pt
│   ├── page.tsx                   # Home
│   ├── products/
│   │   ├── page.tsx               # Products Catalog
│   │   ├── [slug]/
│   │   │   └── page.tsx           # Product Detail
│   ├── contact/
│   │   └── page.tsx               # Contact Form
│   ├── privacy/
│   │   └── page.tsx               # Privacy Policy
│   └── terms/
│       └── page.tsx               # Terms of Service
├── api/
│   └── contact/
│       └── route.ts               # Contact API (Supabase)
├── sitemap.ts
└── robots.ts
```

### 3.2 Navigation Structure

#### Primary Navigation
```
Home | Products | Contact | [Language Selector] | [Pet Registration Search Button]
```

#### Products Sub-Navigation (on Products page)
- Featured Products
- Service Dog Kits
- ESA Kits
- Documents & Certificates
- Accessories

### 3.3 User Flow Paths

```
DISCOVERY FLOW (Primary):
Home Hero → Browse Products → Product Detail → Contact/Square Store

CATEGORY FLOW:
Products Hub → Category Section → Product Detail → Contact

DIRECT INQUIRY FLOW:
Any Page → Contact Form → Confirmation

REGISTRATION LOOKUP FLOW (Future):
Header CTA → Pet Registration Search → Results
```

### 3.4 Conversion Elements (Every Page)

- Sticky header with Pet Registration Search button
- Language selector (EN/ES/PT)
- Mobile: Sticky "Contact Us" bar
- Trust badges (Official Registration, Secure, etc.)
- Footer with quick links and contact info

---

## 4. Page Specifications

### 4.1 Home Page

| Section | Purpose | Content |
|---------|---------|---------|
| **Hero** | Emotional connection + Value prop | Headline, lifestyle image, CTA buttons |
| **Trust Bar** | Build credibility | 4 icons: Official Registration, Quality Guaranteed, Fast Shipping, Multilingual Support |
| **Featured Products** | Highlight best sellers | 4-6 featured product cards |
| **Categories Overview** | Guide navigation | Service Dog, ESA, Documents, Accessories |
| **Why Choose Us** | Differentiation | 4 benefit blocks |
| **Testimonials** | Social proof | 3-4 customer reviews |
| **CTA Banner** | Drive action | "Register Your Pet Today" |
| **Footer** | Navigation + contact | Links, contact info, language selector |

#### Hero Content
```
Headline: "Your Best Friend Deserves Official Recognition"
Subheadline: "Professional Service Dog & ESA Registration Kits"
Primary CTA: "Shop Now"
Secondary CTA: "Learn More"
Trust Text: "Trusted by pet owners worldwide • Official documentation"
```

### 4.2 Products Page

| Section | Content |
|---------|---------|
| **Hero** | "Our Products" with filter/category navigation |
| **Featured Products** | 4-6 top products with "Featured" badge |
| **Service Dog Kits** | Category section with 4 products |
| **ESA Kits** | Category section with 5 products |
| **Documents & Certificates** | Category section with 5 products |
| **Accessories** | Category section with 2 products |
| **Apple Wallet Add-on** | Promotional banner for digital card |
| **CTA** | Contact for custom requests |

### 4.3 Product Detail Pages

| Section | Content |
|---------|---------|
| **Product Gallery** | Main image + thumbnails (AI-generated) |
| **Product Info** | Name, price, description |
| **Size Options** | Size selector (if applicable) |
| **Features List** | What's included in the kit |
| **Required Fields Info** | Pet's Name, Handler's Name, Pet's Breed |
| **Apple Wallet Option** | Add-on promotion ($59.99) |
| **Related Products** | 3 related items |
| **CTA** | "Buy on Store" → Link to Square |

### 4.4 Contact Page

| Section | Content |
|---------|---------|
| **Hero** | "Get in Touch" |
| **Contact Form** | Name, Email, Phone, Subject, Message |
| **Contact Info** | Email, response time expectations |
| **FAQ Preview** | 3-4 common questions |
| **Social Links** | If applicable |

#### Contact Form Fields
```typescript
interface ContactFormData {
  name: string;          // Required
  email: string;         // Required, validated
  phone?: string;        // Optional
  subject: string;       // Dropdown: General, Product Question, Order Issue, Other
  message: string;       // Required, min 10 chars
  locale: string;        // Auto-detected
}
```

---

## 5. Design System

### 5.1 Color Palette

Based on current branding with warm/friendly adjustments:

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-navy` | `#2b301d` | Primary text, headers, logo |
| `brand-lime` | `#5d7901` | Primary accents, CTAs |
| `brand-red` | `#c41e3a` | Featured badges, alerts |
| `brand-blue` | `#3374ff` | Links, secondary accents |
| `text-primary` | `#1b1b1b` | Body text |
| `text-muted` | `#636363` | Secondary text |
| `bg-cream` | `#faf8f5` | Warm light backgrounds |
| `bg-white` | `#ffffff` | Card backgrounds |
| `border-light` | `#e5e5e5` | Subtle borders |

### 5.2 Typography

| Element | Font | Weight | Size (Mobile → Desktop) |
|---------|------|--------|-------------------------|
| H1 | Inter | Bold (700) | 36px → 48px → 60px |
| H2 | Inter | Bold (700) | 30px → 36px → 48px |
| H3 | Inter | Semibold (600) | 24px → 30px → 36px |
| H4 | Inter | Semibold (600) | 20px → 24px → 30px |
| Body | Inter | Regular (400) | 16px → 18px |
| Small | Inter | Regular (400) | 14px |
| Caption | Inter | Medium (500) | 12px |

### 5.3 Tailwind CSS v4 Configuration

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand Colors */
  --color-brand-navy: #2b301d;
  --color-brand-lime: #5d7901;
  --color-brand-red: #c41e3a;
  --color-brand-blue: #3374ff;

  /* Text Colors */
  --color-text-primary: #1b1b1b;
  --color-text-muted: #636363;

  /* Background Colors */
  --color-bg-cream: #faf8f5;
  --color-bg-white: #ffffff;

  /* Border Colors */
  --color-border-light: #e5e5e5;

  /* Font Family */
  --font-inter: var(--font-inter), system-ui, sans-serif;
}
```

### 5.4 Button Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| Primary | `bg-brand-lime hover:bg-lime-700 text-white` | Main CTAs, "Shop Now" |
| Secondary | `bg-brand-navy hover:bg-gray-800 text-white` | Secondary actions |
| Accent | `bg-brand-red hover:bg-red-700 text-white` | Featured items, urgent CTAs |
| Outline | `border-2 border-brand-lime text-brand-lime hover:bg-brand-lime hover:text-white` | Tertiary actions |
| Ghost | `text-brand-navy hover:bg-gray-100` | Navigation, subtle actions |

### 5.5 Warm/Friendly Design Principles

- **Rounded Corners**: Use `rounded-2xl` for cards, `rounded-full` for buttons
- **Soft Shadows**: Use `shadow-sm` and `shadow-md` with warm undertones
- **Generous Spacing**: Ample whitespace for breathing room
- **Pet-Focused Imagery**: Dogs and owners in happy, relatable scenarios
- **Warm Color Accents**: Cream backgrounds, lime highlights
- **Friendly Typography**: Approachable headlines, readable body text

### 5.6 Spacing Scale

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Section padding | `py-16` (64px) | `py-20` (80px) | `py-24` (96px) |
| Container | `px-4` | `px-6` | `px-8` |
| Card gap | `gap-6` | `gap-8` | `gap-8` |
| Max width | 100% | 100% | `max-w-7xl` |

---

## 6. Component Inventory

### 6.1 UI Components (`src/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `button.tsx` | variant, size, disabled | CVA-based button with 5 variants |
| `typography.tsx` | as, gradient, animate | H1-H4, P with optional effects |
| `fade-in.tsx` | delay, direction, duration | Scroll-triggered animation wrapper |
| `card.tsx` | variant, padding | Base card with hover effects |
| `badge.tsx` | variant, icon | Featured badge, category badge |
| `input.tsx` | error, label | Form input with validation |
| `textarea.tsx` | error, label | Multi-line input |
| `select.tsx` | options, error | Dropdown select |
| `language-selector.tsx` | locales | EN/ES/PT language switcher |
| `price.tsx` | amount, range | Price display with range support |
| `icon.tsx` | name, size | Lucide icon wrapper |

### 6.2 Section Components (`src/components/sections/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `hero.tsx` | title, subtitle, ctas, image | Main hero with lifestyle image |
| `trust-bar.tsx` | items | Horizontal trust indicators |
| `product-grid.tsx` | products, category | Product card grid |
| `product-card.tsx` | product | Individual product card |
| `category-section.tsx` | title, products | Category with products |
| `why-choose-us.tsx` | features | Benefits section |
| `testimonials.tsx` | reviews | Reviews carousel |
| `cta-banner.tsx` | title, cta | Full-width promotional banner |
| `contact-form.tsx` | onSubmit | Supabase-connected form |
| `faq-section.tsx` | faqs | Accordion FAQ |

### 6.3 Layout Components (`src/components/layout/`)

| Component | Description |
|-----------|-------------|
| `header.tsx` | Sticky nav with logo, links, language selector, CTA |
| `mobile-nav.tsx` | Hamburger menu with full navigation |
| `footer.tsx` | Links, contact info, languages, copyright |
| `page-container.tsx` | Standard page wrapper with meta |
| `section-container.tsx` | Section wrapper with spacing |

### 6.4 Icons (`src/components/icons/`)

| Icon | Usage |
|------|-------|
| `PawIcon` | Brand, pet-related |
| `CertificateIcon` | Certificates, documents |
| `IdCardIcon` | ID cards |
| `ShieldIcon` | Trust, security |
| `TruckIcon` | Shipping |
| `GlobeIcon` | Multilingual |
| `HeartIcon` | ESA, emotional support |
| `DogIcon` | Service dogs |
| `CheckIcon` | Features, benefits |

---

## 7. AI Asset Generation Plan

### 7.1 Image Generation Specifications

| Setting | Value |
|---------|-------|
| **Model** | `google/imagen-4-ultra-fast` or equivalent |
| **Output Path** | `public/images/[category]/` |
| **Format** | `.webp` (preferred), `.png` (fallback) |
| **Naming** | `[category]-[descriptor].webp` |

### 7.2 Home Page Images (10 images)

| Filename | Prompt | Aspect |
|----------|--------|--------|
| `hero-dog-owner.webp` | "Happy dog owner walking with golden retriever wearing service dog vest in sunny park, warm friendly atmosphere, professional photography, shallow depth of field" | 16:9 |
| `hero-esa-comfort.webp` | "Person relaxing at home with emotional support dog on couch, cozy warm lighting, authentic genuine moment, lifestyle photography" | 16:9 |
| `trust-official.webp` | "Official certificate and ID card on wooden desk with golden retriever paw visible, professional documentation, warm lighting" | 1:1 |
| `trust-quality.webp` | "Close-up of premium service dog vest with embroidered patches, high quality materials, professional product shot" | 1:1 |
| `trust-shipping.webp` | "Service dog kit package being delivered to happy family at front door, warm suburban setting" | 1:1 |
| `trust-support.webp` | "Friendly customer service representative helping customer on phone, warm office environment, professional" | 1:1 |
| `category-service-dog.webp` | "Confident service dog (labrador) wearing vest with handler in public space, professional helpful demeanor" | 4:3 |
| `category-esa.webp` | "Person cuddling with emotional support dog (small breed) on bed, cozy bedroom setting, emotional connection" | 4:3 |
| `category-documents.webp` | "Professional certificate and ID card laid out on desk with pen, official documentation look" | 4:3 |
| `category-accessories.webp` | "Service dog collar and leash arranged neatly on light background, product photography" | 4:3 |

### 7.3 Product Images (32 images - 2 per product)

Each of the 16 products needs:
- **Main Image**: Product kit/item on clean background with warm styling
- **Lifestyle Image**: Product in use context

| Category | Products | Image Types |
|----------|----------|-------------|
| Service Dog Kits (4) | Deluxe, Complete, Document, Comprehensive | Product shot + handler using |
| ESA Kits (5) | Complete, Document, Housing, Comprehensive, Special | Product shot + owner with pet |
| Certificates (2) | Service Dog, ESA | Certificate close-up + framed display |
| ID Cards (2) | Service Dog, ESA | Card detail + in wallet/lanyard |
| Accessories (2) | Collar, Leash | Product shot + on dog |
| Forms (1) | DOT Travel Form | Document + travel context |

### 7.4 Contact Page Images (2 images)

| Filename | Prompt | Aspect |
|----------|--------|--------|
| `contact-hero.webp` | "Friendly person with laptop helping customer, with happy dog nearby, warm home office setting" | 16:9 |
| `contact-support.webp` | "Customer service team member smiling with headset, service dog resting at feet, professional friendly" | 4:3 |

### 7.5 Asset Summary

| Page/Category | Images |
|---------------|--------|
| Home | 10 |
| Products (overview) | 4 |
| Product Details | 32 |
| Contact | 2 |
| **TOTAL** | **48** |

### 7.6 Generation Priority

```
★★★ CRITICAL (Generate First):
├── Home hero images (2)
├── Trust bar icons (4)
├── Category images (4)
└── Featured product images (8)

★★☆ IMPORTANT (Generate Second):
├── Remaining product main images (8)
├── Contact page images (2)
└── Product lifestyle images (16)

★☆☆ ENHANCEMENT (Generate Last):
├── Remaining product lifestyle images (4)
└── Decorative backgrounds
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Days 1-2)

```bash
# 1. Create Next.js 15 project
npx create-next-app@latest liberty-paws-web --typescript --tailwind --eslint --app --src-dir

# 2. Install dependencies
npm install next-intl@^4 class-variance-authority clsx tailwind-merge motion lucide-react @vercel/analytics @vercel/speed-insights @supabase/supabase-js

# 3. Upgrade to Tailwind CSS v4
npm install tailwindcss@^4 @tailwindcss/postcss

# 4. Create directory structure
mkdir -p src/{messages,hooks,lib,types,components/{ui,sections,layout,icons,analytics}}
```

**Tasks:**
- [ ] Project initialization
- [ ] Dependency installation
- [ ] Directory structure creation
- [ ] TypeScript configuration
- [ ] Tailwind CSS v4 configuration with brand colors
- [ ] ESLint configuration

### Phase 2: Internationalization (Days 2-3)

**Tasks:**
- [ ] Create `src/i18n.ts` with locales: `['en', 'es', 'pt']`
- [ ] Create `src/routing.ts` with navigation utilities
- [ ] Create `src/middleware.ts` for locale detection
- [ ] Create message files:
  - [ ] `src/messages/en.json`
  - [ ] `src/messages/es.json`
  - [ ] `src/messages/pt.json`

### Phase 3: Design System (Days 3-4)

**Tasks:**
- [ ] `src/lib/utils.ts` - cn() utility
- [ ] `src/lib/fonts.ts` - Inter configuration
- [ ] `src/components/ui/button.tsx` - 5 variants
- [ ] `src/components/ui/typography.tsx` - H1-H4, P
- [ ] `src/components/ui/fade-in.tsx` - Animation wrapper
- [ ] `src/components/ui/card.tsx` - Card component
- [ ] `src/components/ui/badge.tsx` - Featured/category badges
- [ ] `src/components/ui/input.tsx` - Form input
- [ ] `src/components/ui/textarea.tsx` - Multi-line input
- [ ] `src/components/ui/select.tsx` - Dropdown
- [ ] `src/components/ui/price.tsx` - Price display
- [ ] `src/components/ui/language-selector.tsx` - Locale switcher
- [ ] `src/hooks/use-scroll-animation.ts` - Scroll hook
- [ ] `src/app/globals.css` - Tailwind v4 theme

### Phase 4: Layout (Days 4-5)

**Tasks:**
- [ ] `src/app/layout.tsx` - Root layout with analytics
- [ ] `src/app/[locale]/layout.tsx` - Locale layout
- [ ] `src/components/layout/header.tsx` - Sticky header
- [ ] `src/components/layout/mobile-nav.tsx` - Mobile menu
- [ ] `src/components/layout/footer.tsx` - Full footer

### Phase 5: SEO Setup (Day 5)

**Tasks:**
- [ ] `src/lib/seo-config.ts` - Site configuration
- [ ] `src/lib/social-metadata.ts` - OG/Twitter metadata
- [ ] `src/lib/structured-data.tsx` - JSON-LD schemas
- [ ] `src/app/sitemap.ts` - Dynamic sitemap
- [ ] `src/app/robots.ts` - Robots configuration

### Phase 6: Home Page (Days 6-8)

**Tasks:**
- [ ] `src/components/sections/hero.tsx`
- [ ] `src/components/sections/trust-bar.tsx`
- [ ] `src/components/sections/product-grid.tsx`
- [ ] `src/components/sections/product-card.tsx`
- [ ] `src/components/sections/category-section.tsx`
- [ ] `src/components/sections/why-choose-us.tsx`
- [ ] `src/components/sections/testimonials.tsx`
- [ ] `src/components/sections/cta-banner.tsx`
- [ ] `src/app/[locale]/page.tsx` - Home page assembly

### Phase 7: Products Pages (Days 9-12)

**Tasks:**
- [ ] `src/lib/products.ts` - Product data and types
- [ ] `src/app/[locale]/products/page.tsx` - Products catalog
- [ ] `src/app/[locale]/products/[slug]/page.tsx` - Product detail template
- [ ] Generate all 16 product detail pages with proper slugs
- [ ] Implement category filtering and navigation

### Phase 8: Contact & Supabase (Days 13-15)

**Tasks:**
- [ ] Supabase project setup and configuration
- [ ] `src/lib/supabase.ts` - Supabase client
- [ ] `src/types/contact.ts` - Form types
- [ ] `src/app/api/contact/route.ts` - Contact API with Supabase
- [ ] `src/components/sections/contact-form.tsx` - Form component
- [ ] `src/app/[locale]/contact/page.tsx` - Contact page
- [ ] Rate limiting implementation

### Phase 9: Legal Pages (Days 16-17)

**Tasks:**
- [ ] `src/app/[locale]/privacy/page.tsx` - Privacy Policy
- [ ] `src/app/[locale]/terms/page.tsx` - Terms of Service
- [ ] Footer links to legal pages

### Phase 10: Asset Generation (Days 18-21)

**Tasks:**
- [ ] Generate critical images (home hero, trust bar)
- [ ] Generate category images
- [ ] Generate product main images (16)
- [ ] Generate product lifestyle images (16)
- [ ] Generate contact page images
- [ ] Optimize all images for web

### Phase 11: QA & Launch (Days 22-25)

**Tasks:**
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] All locale testing (EN, ES, PT)
- [ ] Form submission testing
- [ ] Lighthouse audit (performance, accessibility, SEO)
- [ ] Structured data validation
- [ ] Final review and fixes
- [ ] Deployment to Vercel

---

## 9. Technical Specifications

### 9.1 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://libertypawsinternational.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID=optional
```

### 9.2 Supabase Schema (Phase 1)

```sql
-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from authenticated or anon users
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);
```

### 9.3 SEO Configuration

```typescript
// src/lib/seo-config.ts
export const siteConfig = {
  name: 'Liberty Paws International',
  description: 'Professional Service Dog & Emotional Support Animal registration kits, certificates, and ID cards.',
  url: 'https://libertypawsinternational.com',
  ogImage: '/images/og-image.png',
  keywords: [
    'service dog registration',
    'ESA registration',
    'emotional support animal',
    'service dog ID card',
    'ESA certificate',
    'service dog vest',
    'pet registration',
  ],
  locales: ['en', 'es', 'pt'] as const,
  defaultLocale: 'en' as const,
}

export const businessInfo = {
  name: 'Liberty Paws International',
  type: 'Pet Services',
  email: '', // Add actual email
  services: [
    'Service Dog Registration',
    'ESA Registration',
    'ID Cards',
    'Certificates',
    'Pet Accessories',
  ],
}
```

### 9.4 Locale Configuration

```typescript
// src/i18n.ts
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'

export const locales = ['en', 'es', 'pt'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(locales, requested) ? requested : 'en'

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  }
})
```

### 9.5 Product Data Structure

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceMax?: number; // For price ranges
  category: 'service-dog-kit' | 'esa-kit' | 'document' | 'certificate' | 'id-card' | 'accessory';
  featured: boolean;
  images: {
    main: string;
    lifestyle?: string;
    gallery?: string[];
  };
  sizes?: string[]; // XXS, XS, S, M, L, XL
  features: string[];
  requiredFields: string[];
  addOns?: {
    name: string;
    price: number;
  }[];
  squareUrl: string;
}
```

### 9.6 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | ≥90 | Lighthouse |
| Lighthouse Accessibility | ≥95 | Lighthouse |
| Lighthouse SEO | ≥95 | Lighthouse |
| First Contentful Paint | <1.8s | Web Vitals |
| Largest Contentful Paint | <2.5s | Web Vitals |
| Cumulative Layout Shift | <0.1 | Web Vitals |
| Time to Interactive | <3.8s | Web Vitals |

---

## 10. Future Webapp Expansion

### 10.1 Phase 2: Authentication & Pet Registration

**Planned Features:**
- User registration and login via Supabase Auth
- Pet registration portal
- Registration search functionality (replace external link)
- User dashboard with registered pets
- Digital certificate/ID card access

**Database Extensions:**
```sql
-- Users profile extension
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet registrations
CREATE TABLE pet_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pet_name TEXT NOT NULL,
  pet_breed TEXT NOT NULL,
  pet_type TEXT NOT NULL, -- 'service_dog' | 'esa'
  registration_number TEXT UNIQUE NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_url TEXT,
  id_card_url TEXT,
  status TEXT DEFAULT 'active'
);
```

### 10.2 Phase 3: E-commerce Integration

**Planned Features:**
- Full checkout on-site (no Square redirect)
- Payment integration (Stripe/Square/PayPal)
- Order management
- Digital delivery for certificates/ID cards
- Subscription options for renewals

**Payment Considerations:**
- Stripe recommended for developer experience
- Square integration possible for consistency
- Afterpay/Klarna for payment plans

### 10.3 Migration Path

1. **Phase 1 → Phase 2**: Add Supabase Auth, build user/pet tables, create dashboard routes
2. **Phase 2 → Phase 3**: Add payment provider, order management, digital delivery system

---

## Appendix A: Translation Checklist

### English (en) - Primary
- [ ] Complete message file
- [ ] All page metadata
- [ ] All UI strings
- [ ] Product descriptions
- [ ] Form validation messages
- [ ] Error messages

### Spanish (es)
- [ ] Complete message file
- [ ] All page metadata
- [ ] All UI strings
- [ ] Product descriptions
- [ ] Form validation messages
- [ ] Error messages

### Portuguese (pt)
- [ ] Complete message file
- [ ] All page metadata
- [ ] All UI strings
- [ ] Product descriptions
- [ ] Form validation messages
- [ ] Error messages

---

## Appendix B: Product Slugs Reference

| Product | Slug |
|---------|------|
| Deluxe Service Dog Kit | `deluxe-service-dog-kit` |
| Complete Emotional Support Animal Kit | `complete-esa-kit` |
| Service Dog Document Kit | `service-dog-document-kit` |
| ESA Document Kit | `esa-document-kit` |
| ESA Housing Package | `esa-housing-package` |
| Emotional Support Animal Collar | `esa-collar` |
| Emotional Support Animal Leash | `esa-leash` |
| Service Dog Certificate | `service-dog-certificate` |
| Emotional Support Animal Certificate | `esa-certificate` |
| Emotional Support Animal ID Card | `esa-id-card` |
| ESA Comprehensive Coverage Kit | `esa-comprehensive-kit` |
| Complete Service Animal Kit | `complete-service-animal-kit` |
| DOT Travel Form | `dot-travel-form` |
| Special: ESA Registration Package | `special-esa-registration-package` |
| Service Dog Comprehensive Coverage Kit | `service-dog-comprehensive-kit` |
| Service Dog ID Card Only | `service-dog-id-card` |

---

## Appendix C: Deployment Checklist

- [ ] All environment variables configured
- [ ] Domain configured in Vercel
- [ ] SSL certificate active
- [ ] Supabase project connected
- [ ] Contact form tested in production
- [ ] Analytics verified
- [ ] All 3 locales tested
- [ ] Mobile responsiveness verified
- [ ] Structured data validated
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] 404 page customized
- [ ] Performance audit passed

---

**Document End**

*This specification provides a complete blueprint for implementing the Liberty Paws International website Phase 1 (Landing Page). Follow the implementation roadmap phases in order, using the component inventory and design system specifications as your guide. Future phases (Authentication, E-commerce) are outlined for planning purposes.*
