# Generic SEO Best Practices for Next.js Applications

A comprehensive guide to SEO implementation patterns extracted from production-ready code. Designed for LLMs and developers to apply in any Next.js project.

---

## Table of Contents

1. [Core Metadata Configuration](#1-core-metadata-configuration)
2. [Page-Level Metadata](#2-page-level-metadata)
3. [Internationalization (i18n) SEO](#3-internationalization-i18n-seo)
4. [Structured Data (JSON-LD)](#4-structured-data-json-ld)
5. [Sitemap Generation](#5-sitemap-generation)
6. [Robots.txt Configuration](#6-robotstxt-configuration)
7. [Image Optimization](#7-image-optimization)
8. [Performance & Caching](#8-performance--caching)
9. [Semantic HTML](#9-semantic-html)
10. [Font Optimization](#10-font-optimization)
11. [URL Structure](#11-url-structure)
12. [Checklist](#12-seo-implementation-checklist)

---

## 1. Core Metadata Configuration

### Pattern: Centralized SEO Config File

Create a single source of truth for site-wide SEO settings:

```typescript
// src/lib/seo-config.ts
import { Metadata } from 'next'

export const siteConfig = {
  name: 'YourBrand',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
  description: 'Primary site description (150-160 chars optimal)',
  keywords: [
    'primary keyword',
    'secondary keyword',
    'long-tail keyword phrase',
    // 5-10 relevant keywords
  ],
  authors: [{ name: 'Brand Team' }],
  creator: 'YourBrand',
  publisher: 'YourBrand',
  twitterHandle: '@yourbrand',
  ogImage: '/images/og-image.png', // 1200x630px recommended
  locale: 'en',
  locales: ['en', 'es', 'pt'], // supported languages
}
```

### Pattern: Default Metadata Export

```typescript
// src/lib/seo-config.ts
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`, // "Page Title | Brand"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
}
```

### Apply in Root Layout

```typescript
// src/app/[locale]/layout.tsx
import { defaultMetadata } from '@/lib/seo-config'

export const metadata = defaultMetadata

export default function RootLayout({ children }) {
  return (
    <html lang={locale} className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
```

---

## 2. Page-Level Metadata

### Pattern: Static Page Metadata

```typescript
// src/app/about/page.tsx
import { generatePageMetadata } from '@/lib/seo-config'

export const metadata = generatePageMetadata(
  'About Us | Your Brand',
  'Learn about our mission and team. We help businesses grow with innovative solutions.',
  '/about'
)
```

### Pattern: Page Metadata Generator Function

```typescript
// src/lib/seo-config.ts
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string,
  noIndex: boolean = false
): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || siteConfig.ogImage

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.url}/en${path}`,
        'es': `${siteConfig.url}/es${path}`,
        'pt': `${siteConfig.url}/pt${path}`,
      },
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
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
```

### Pattern: Dynamic Metadata with generateMetadata

```typescript
// src/app/[locale]/(default)/pricing/page.tsx
import { generateLocalizedMetadata } from '@/lib/seo-config'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: 'en' | 'es' | 'pt' }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateLocalizedMetadata(locale, 'pricing', '/pricing')
}
```

---

## 3. Internationalization (i18n) SEO

### Pattern: Localized Metadata Generator

```typescript
// src/lib/seo-config.ts
type LocaleOptions = 'en' | 'es' | 'pt'

export async function generateLocalizedMetadata(
  locale: LocaleOptions,
  pageName: 'home' | 'pricing' | 'about' | 'dashboard',
  path: string = '',
  image?: string,
  noIndex: boolean = false
): Promise<Metadata> {
  // Import translations dynamically
  const messages = await import(`@/messages/${locale}.json`)
  const metadata = messages.metadata

  const pageMetadata = metadata.pages[pageName]
  const globalMetadata = metadata.global

  const url = `${siteConfig.url}/${locale}${path}`
  const ogImage = image || siteConfig.ogImage

  // Map locale to OpenGraph format
  const ogLocale = locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : 'pt_BR'
  const alternateLocales = siteConfig.locales.filter(l => l !== locale)

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    keywords: pageMetadata.keywords || globalMetadata.keywords,
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: alternateLocales.map(l =>
        l === 'en' ? 'en_US' : l === 'es' ? 'es_ES' : 'pt_BR'
      ),
      url,
      title: pageMetadata.title,
      description: pageMetadata.description,
      siteName: globalMetadata.siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageMetadata.title }],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.url}/en${path}`,
        'es': `${siteConfig.url}/es${path}`,
        'pt': `${siteConfig.url}/pt${path}`,
        'x-default': `${siteConfig.url}/en${path}`, // Fallback language
      },
    },
  }
}
```

### Pattern: Translation File Structure for SEO

```json
// src/messages/en.json
{
  "metadata": {
    "global": {
      "siteName": "YourBrand",
      "author": "YourBrand Team",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    },
    "pages": {
      "home": {
        "title": "Your Main Title | YourBrand",
        "description": "Compelling description under 160 characters.",
        "keywords": ["home specific", "keywords"]
      },
      "pricing": {
        "title": "Pricing Plans | YourBrand",
        "description": "Pricing description optimized for search.",
        "keywords": ["pricing", "plans", "cost"]
      }
    }
  }
}
```

### Pattern: Middleware for SEO-Friendly URLs

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'always', // Ensures /en/, /es/, /pt/ prefixes for SEO
});

export default function middleware(req) {
  // Exclude SEO files from i18n processing
  if (req.nextUrl.pathname === '/robots.txt' ||
      req.nextUrl.pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
```

---

## 4. Structured Data (JSON-LD)

### Pattern: Schema Generator Functions

```typescript
// src/lib/seo-config.ts

// Organization Schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    sameAs: [
      `https://twitter.com/${siteConfig.twitterHandle.replace('@', '')}`,
      'https://linkedin.com/company/yourbrand',
      'https://github.com/yourbrand',
    ],
  }
}

// Website Schema with Search Action
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Product Schema (for SaaS)
export function generateProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Your Product Name',
    description: 'Product description for rich snippets',
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  }
}

// FAQ Schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
```

### Pattern: Inject JSON-LD in Pages

```typescript
// src/app/page.tsx
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateProductSchema,
} from '@/lib/seo-config';

export default function Home() {
  const jsonLd = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateProductSchema(),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Pattern: Page-Specific Schema with Breadcrumbs

```typescript
// src/app/pricing/page.tsx
export default function Pricing() {
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pricing Plans',
    description: 'Pricing plans for our platform',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://yourdomain.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pricing',
          item: 'https://yourdomain.com/pricing',
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {/* Page content */}
    </>
  )
}
```

---

## 5. Sitemap Generation

### Pattern: Dynamic Sitemap with i18n Support

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const locales = siteConfig.locales;
  const currentDate = new Date();

  // Define static routes (without leading slashes)
  const staticRoutes = [
    '',           // Homepage
    'about',
    'pricing',
    'contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: [baseUrl, locale, route].filter(Boolean).join('/').replace(/([^:])\/\/+/g, '$1/'),
        lastModified: currentDate,
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === 'pricing' ? 0.9 : 0.8,
      });
    });
  });

  // NOTE: Only include URLs with locale prefix to avoid redirect issues
  // Google bot has problems with redirects

  return sitemapEntries;
}
```

### Priority Guidelines

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | daily |
| Pricing/Product | 0.9 | weekly |
| Features/About | 0.8 | weekly |
| Blog posts | 0.7 | monthly |
| Legal pages | 0.5 | yearly |

---

## 6. Robots.txt Configuration

### Pattern: Dynamic Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',      // Protected routes
          '/api/',           // API endpoints
          '/signin',         // Auth pages
          '/signup',
          '/onboarding',
          '/reset-password',
          '/_next/',         // Next.js internals
          '/images/favicon/', // Favicon directory
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

### Common Disallow Patterns

```
/dashboard      - Authenticated user areas
/api/           - API endpoints
/admin          - Admin panels
/_next/         - Next.js build assets
/private/       - Private content
/search?        - Search result pages (optional)
```

---

## 7. Image Optimization

### Pattern: Priority Loading for Above-the-Fold Images

```typescript
// Hero images should have priority attribute
import Image from 'next/image'

<Image
  src="/hero-image.png"
  alt="Descriptive alt text for SEO"
  width={1200}
  height={600}
  priority  // Loads immediately, skips lazy loading
/>
```

### Pattern: Responsive Images with Sizes

```typescript
<Image
  src="/product.jpg"
  alt="Product Name - Category"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Pattern: Image with Caption (Figure/Figcaption)

```typescript
// Good for image SEO and accessibility
export default function PostImage({ alt, caption, src }) {
  return (
    <figure>
      <Image className="w-full" src={src} alt={alt} />
      {caption && (
        <figcaption className="text-sm text-center text-gray-500 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

### Image Alt Text Guidelines

| Type | Example |
|------|---------|
| Product | "Blue Nike Running Shoes - Men's Size 10" |
| Hero | "Team collaborating on project in modern office" |
| Icon | "" (empty for decorative) or skip alt |
| Chart | "Sales growth chart showing 50% increase in Q3 2024" |

---

## 8. Performance & Caching

### Pattern: Cache Headers for Public Pages

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        // Public marketing pages
        source: '/:locale(en|es|pt)?/:path(about|pricing|terms|privacy)?',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // robots.txt (long cache)
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'Content-Type', value: 'text/plain' },
        ],
      },
      {
        // sitemap.xml
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Content-Type', value: 'application/xml' },
        ],
      },
      {
        // Homepage
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};
```

### Cache Duration Guidelines

| Content Type | max-age | s-maxage | stale-while-revalidate |
|--------------|---------|----------|------------------------|
| Marketing pages | 1 hour | 1 hour | 24 hours |
| robots.txt | 24 hours | - | - |
| sitemap.xml | 1 hour | 1 hour | - |
| Static assets | 1 year | - | - |

---

## 9. Semantic HTML

### Pattern: Proper Document Structure

```html
<html lang="en">
<body>
  <header>
    <nav><!-- Main navigation --></nav>
  </header>

  <main>
    <article>
      <h1>Main Page Title</h1>
      <section>
        <h2>Section Heading</h2>
        <!-- Content -->
      </section>
    </article>
  </main>

  <aside><!-- Sidebar content --></aside>

  <footer>
    <nav><!-- Footer navigation --></nav>
  </footer>
</body>
</html>
```

### Pattern: Accessible Links with ARIA

```typescript
// Logo link with aria-label
<Link href="/" aria-label="YourBrand - Go to homepage">
  <Logo />
</Link>

// Social links
<a
  href="https://twitter.com/brand"
  aria-label="Follow us on Twitter"
  rel="noopener noreferrer"
  target="_blank"
>
  <TwitterIcon />
</a>
```

### Heading Hierarchy Rules

1. Only ONE `<h1>` per page
2. Don't skip heading levels (h1 → h2 → h3)
3. Use headings for structure, not styling
4. Include keywords naturally in h1 and h2

---

## 10. Font Optimization

### Pattern: Next.js Font Optimization

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents FOUT (Flash of Unstyled Text)
})

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body className="font-inter">{children}</body>
    </html>
  )
}
```

### Font Display Options

| Value | Behavior | Use Case |
|-------|----------|----------|
| `swap` | Shows fallback immediately | Most websites |
| `optional` | May skip custom font | Performance-critical |
| `block` | Brief invisible text | Branding-critical |

---

## 11. URL Structure

### Best Practices

| Pattern | Example | Why |
|---------|---------|-----|
| Lowercase | `/pricing` not `/Pricing` | Consistency |
| Hyphens | `/about-us` not `/about_us` | Readability |
| No trailing slash | `/pricing` not `/pricing/` | Canonicalization |
| Locale prefix | `/en/pricing` | i18n SEO |
| Descriptive | `/blog/seo-tips` | Keywords |

### Avoid

- Query parameters for content: `/page?id=123`
- Session IDs in URLs: `/page;jsessionid=xxx`
- Excessive depth: `/a/b/c/d/e/page`
- Duplicate content paths

---

## 12. SEO Implementation Checklist

### Core Setup
- [ ] `seo-config.ts` with site settings
- [ ] `defaultMetadata` applied in root layout
- [ ] `metadataBase` set for absolute URLs
- [ ] OG image created (1200x630px)
- [ ] Favicon set (multiple sizes)

### Every Page
- [ ] Unique `title` (50-60 chars)
- [ ] Unique `description` (150-160 chars)
- [ ] Canonical URL set
- [ ] OG tags configured
- [ ] Twitter card configured
- [ ] Single `<h1>` tag
- [ ] Alt text on all images

### i18n (if applicable)
- [ ] hreflang tags with `x-default`
- [ ] Localized metadata per language
- [ ] Locale in URL path
- [ ] OpenGraph `locale` and `alternateLocale`

### Technical
- [ ] `robots.ts` configured
- [ ] `sitemap.ts` with all public pages
- [ ] Cache headers on static content
- [ ] Priority images have `priority` prop
- [ ] Font optimization with `display: swap`

### Structured Data
- [ ] Organization schema on homepage
- [ ] Website schema with search action
- [ ] Product/Service schema (if applicable)
- [ ] Breadcrumb schema on inner pages
- [ ] FAQ schema (if applicable)

### Performance
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly design
- [ ] HTTPS enabled
- [ ] No render-blocking resources

---

## Quick Reference: Metadata Template

```typescript
// Copy-paste template for new pages
import { Metadata } from 'next'
import { siteConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: 'Page Title | Brand',
  description: 'Page description under 160 characters.',
  openGraph: {
    title: 'Page Title | Brand',
    description: 'Page description under 160 characters.',
    url: `${siteConfig.url}/page-path`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title | Brand',
    description: 'Page description under 160 characters.',
  },
  alternates: {
    canonical: `${siteConfig.url}/page-path`,
  },
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-03 | Initial extraction from production codebase |

---

*This document is designed for AI/LLM consumption. Patterns are extracted from production Next.js applications and verified to work with Next.js 14+.*
