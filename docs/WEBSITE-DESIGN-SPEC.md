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

> ⚠️ **CRITICAL**: Image generation uses Replicate (PAID service, no refunds). Each prompt has been optimized for google/nano-banana (Gemini 2.5 Flash Image) to maximize success rate on first generation.

### 7.1 Model & Configuration

| Setting | Value |
|---------|-------|
| **Model** | `google/nano-banana` (Gemini 2.5 Flash Image) |
| **Output Path** | `public/images/[category]/` |
| **Format** | `.webp` (preferred), `.png` (fallback) |
| **Naming** | `[category]-[descriptor].webp` |

### 7.2 Prompt Engineering Guidelines (google/nano-banana)

**Optimal Prompt Structure:**
```
[SUBJECT]: Primary subject with specific attributes (breed, clothing, expression)
[COMPOSITION]: Framing, background environment, perspective, spacing
[LIGHTING/CAMERA]: Light quality, camera lens terms, time of day
[STYLE]: Mood adjectives, photography style, color palette
[CONSTRAINTS]: Positive framing only (describe what IS there, not what isn't)
```

**Effective Camera/Lens Terms:**
- `85mm portrait lens` - Flattering portraits with background separation
- `wide-angle shot` - Environmental context, spacious feel
- `shallow depth of field` - Subject focus with blurred background
- `soft natural window light` - Warm, inviting indoor shots
- `golden hour lighting` - Warm outdoor shots
- `overhead flat lay` - Product arrangements

**Critical Rules:**
1. ❌ **AVOID text in images** - Model has spelling inconsistencies
2. ❌ **AVOID small faces** - Model struggles with fine facial details
3. ✅ **Use specific dog breeds** - Golden Retriever, Labrador, Cavalier King Charles
4. ✅ **Describe scene positively** - "clean background" not "no clutter"
5. ✅ **Be conversational but precise** - Natural language with specific details

---

### 7.3 Phase 1 Validation Batch (14 Images)

> Generate these 14 images first. Review quality before proceeding to remaining assets.

---

#### 7.3.1 HOME PAGE IMAGES (10 Images)

**HOME-01: Hero Main**
| Field | Value |
|-------|-------|
| **Filename** | `hero-main.webp` |
| **Aspect Ratio** | 16:9 (1920x1080) |
| **Purpose** | Main hero banner - emotional connection |

```
PROMPT:
A joyful middle-aged woman walking confidently through a sunny park path with her
golden retriever wearing a navy blue service dog vest. The dog walks attentively
beside her, looking up with a calm, trained expression. Warm golden hour sunlight
filters through trees creating dappled light patterns. Shot with 85mm portrait lens,
shallow depth of field blurring the green park background. Lifestyle photography
style, warm color palette with greens and golden tones, genuine candid moment
capturing the bond between handler and service dog.
```

---

**HOME-02: Hero Secondary**
| Field | Value |
|-------|-------|
| **Filename** | `hero-esa.webp` |
| **Aspect Ratio** | 16:9 (1920x1080) |
| **Purpose** | Alternative hero for ESA focus |

```
PROMPT:
A young woman in her late twenties relaxing on a cream-colored modern sofa in a
bright living room, with a small Cavalier King Charles Spaniel curled up against
her. Soft natural window light illuminates the cozy scene. She has a peaceful,
content expression while gently petting the dog. The room has warm minimalist
decor with a knit blanket and indoor plants visible. Shot with 50mm lens, medium
depth of field. Lifestyle photography capturing genuine emotional comfort and
companionship, warm inviting color palette with cream, beige, and soft natural tones.
```

---

**HOME-03: Trust - Official Registration**
| Field | Value |
|-------|-------|
| **Filename** | `trust-official.webp` |
| **Aspect Ratio** | 1:1 (800x800) |
| **Purpose** | Trust bar icon - official documentation |

```
PROMPT:
Overhead flat lay photograph of official-looking documents on a warm oak wood desk.
A navy blue folder partially open revealing a cream-colored certificate with an
embossed gold seal. Beside it, a professional ID card with a navy and gold color
scheme. A golden retriever's paw rests gently at the edge of frame. Soft diffused
natural light from above, clean organized composition. Professional product
photography style, warm wood tones contrasting with official navy and gold accents,
conveying authenticity and legitimacy.
```

---

**HOME-04: Trust - Quality Materials**
| Field | Value |
|-------|-------|
| **Filename** | `trust-quality.webp` |
| **Aspect Ratio** | 1:1 (800x800) |
| **Purpose** | Trust bar icon - premium quality |

```
PROMPT:
Close-up macro photograph of a premium navy blue service dog vest fabric showing
detailed stitching and high-quality material texture. A reflective embroidered
patch in red and gold is partially visible. The fabric has a durable, professional
appearance with reinforced edges. Shot with macro lens, shallow depth of field
focusing on the texture and craftsmanship. Studio lighting with soft shadows,
product photography style emphasizing premium materials and attention to detail,
navy blue and gold color palette.
```

---

**HOME-05: Trust - Fast Delivery**
| Field | Value |
|-------|-------|
| **Filename** | `trust-delivery.webp` |
| **Aspect Ratio** | 1:1 (800x800) |
| **Purpose** | Trust bar icon - shipping/delivery |

```
PROMPT:
A neatly packaged brown kraft box with a red ribbon sitting on a welcoming front
porch of a suburban home. Warm afternoon sunlight creates inviting shadows. A
friendly yellow Labrador sits beside the package, looking expectantly at the door.
The porch has warm wood tones and a cheerful welcome mat. Shot with 35mm lens,
environmental portrait style. Lifestyle photography capturing the excitement of
package arrival, warm earthy color palette with brown, cream, and touches of red,
conveying reliability and care in delivery.
```

---

**HOME-06: Trust - Multilingual Support**
| Field | Value |
|-------|-------|
| **Filename** | `trust-support.webp` |
| **Aspect Ratio** | 1:1 (800x800) |
| **Purpose** | Trust bar icon - customer support |

```
PROMPT:
A friendly customer service representative in her thirties sitting at a clean
modern desk with a laptop, wearing a headset and smiling warmly while working.
A calm golden retriever lies peacefully on a dog bed beside the desk. The office
space has warm wood accents, a green plant, and soft natural light from a nearby
window. Shot with 50mm lens at f/2.8, shallow depth of field. Professional
lifestyle photography, warm and approachable atmosphere, earth tones with pops
of green, conveying helpful and caring customer service.
```

---

**HOME-07: Category - Service Dogs**
| Field | Value |
|-------|-------|
| **Filename** | `category-service-dog.webp` |
| **Aspect Ratio** | 4:3 (1200x900) |
| **Purpose** | Category card - Service Dog products |

```
PROMPT:
A confident black Labrador Retriever wearing a professional navy blue service dog
vest with red accents, walking beside its handler through a bright shopping mall
corridor. The dog has an alert, focused expression showing its trained demeanor.
The handler is partially visible from waist down. The mall has modern architecture
with natural light streaming through skylights. Shot with 85mm lens, shallow depth
of field blurring the mall background. Documentary style photography capturing a
working service dog in public, professional and dignified atmosphere, cool modern
tones with navy blue accents.
```

---

**HOME-08: Category - ESA**
| Field | Value |
|-------|-------|
| **Filename** | `category-esa.webp` |
| **Aspect Ratio** | 4:3 (1200x900) |
| **Purpose** | Category card - ESA products |

```
PROMPT:
A young man in his twenties sitting in a cozy reading nook by a large window,
with a fluffy white Bichon Frise emotional support dog resting on his lap. He
has a calm, peaceful expression while gently stroking the dog. Soft afternoon
light creates a warm, serene atmosphere. The space has comfortable cushions,
a knit blanket, and books visible. Shot with 50mm lens, medium depth of field.
Lifestyle photography capturing emotional comfort and companionship, warm cozy
color palette with cream, white, and soft natural tones, intimate and comforting mood.
```

---

**HOME-09: Category - Documents**
| Field | Value |
|-------|-------|
| **Filename** | `category-documents.webp` |
| **Aspect Ratio** | 4:3 (1200x900) |
| **Purpose** | Category card - Documents & Certificates |

```
PROMPT:
An elegant flat lay arrangement on a warm walnut wood desk featuring official
pet registration documents. A cream-colored certificate with an embossed gold
seal lies beside a professional ID card in a clear protective sleeve. A quality
fountain pen and a small potted succulent add sophisticated touches. Soft
diffused overhead lighting creates gentle shadows. Professional product
photography with clean, organized composition, warm wood tones with navy,
cream, and gold accents, conveying professionalism and authenticity.
```

---

**HOME-10: Category - Accessories**
| Field | Value |
|-------|-------|
| **Filename** | `category-accessories.webp` |
| **Aspect Ratio** | 4:3 (1200x900) |
| **Purpose** | Category card - Collars & Leashes |

```
PROMPT:
A beautifully arranged flat lay of premium pet accessories on a clean white
marble surface. A navy blue collar with gold hardware, a matching navy leash
neatly coiled, and a small bone-shaped tag are artfully positioned. Soft
studio lighting with minimal shadows creates a clean, premium aesthetic.
Professional e-commerce product photography style, minimalist composition
with intentional negative space, navy blue and gold against white marble,
conveying quality craftsmanship and premium materials.
```

---

#### 7.3.2 PRODUCTS PAGE IMAGES (4 Images)

**PROD-01: Featured Products Banner**
| Field | Value |
|-------|-------|
| **Filename** | `products-hero.webp` |
| **Aspect Ratio** | 21:9 (2100x900) |
| **Purpose** | Products page hero banner |

```
PROMPT:
A wide panoramic lifestyle scene of a happy family in their living room with
their golden retriever service dog wearing a navy vest. The mother sits on a
sofa reviewing documents while the father plays with their child on the floor
near the attentive dog. Warm afternoon light streams through large windows.
The modern home has comfortable furnishings in neutral tones. Shot with 24mm
wide-angle lens, deep depth of field capturing the entire scene. Lifestyle
photography showcasing family life with a service animal, warm inviting
atmosphere, earth tones with navy accents, conveying trust and family values.
```

---

**PROD-02: Service Dog Kits Collection**
| Field | Value |
|-------|-------|
| **Filename** | `collection-service-dog-kits.webp` |
| **Aspect Ratio** | 16:9 (1600x900) |
| **Purpose** | Service Dog Kits section header |

```
PROMPT:
A professional product arrangement showing service dog registration kit
components on a clean cream linen backdrop. A navy blue folder, ID card in
clear sleeve, certificate with gold seal, and a folded service dog vest are
arranged in an elegant diagonal composition. Soft studio lighting from the
left creates gentle shadows and depth. A black Labrador's snout enters the
frame from the right corner, sniffing curiously at the items. Professional
e-commerce photography, clean and organized layout, navy blue and gold
against cream, conveying completeness and professionalism.
```

---

**PROD-03: ESA Kits Collection**
| Field | Value |
|-------|-------|
| **Filename** | `collection-esa-kits.webp` |
| **Aspect Ratio** | 16:9 (1600x900) |
| **Purpose** | ESA Kits section header |

```
PROMPT:
A warm lifestyle flat lay of ESA registration kit components arranged on a
cozy knit blanket. Documents including a certificate with an embossed seal,
an ID card, and informational materials are spread out naturally. A small
Cavalier King Charles Spaniel lies peacefully at the edge of the frame, its
soft fur visible. Warm natural window light creates a homey, comfortable
atmosphere. Lifestyle product photography with an organic, lived-in feel,
warm cream and beige tones with touches of red and gold, conveying comfort
and emotional support.
```

---

**PROD-04: Accessories Collection**
| Field | Value |
|-------|-------|
| **Filename** | `collection-accessories.webp` |
| **Aspect Ratio** | 16:9 (1600x900) |
| **Purpose** | Accessories section header |

```
PROMPT:
A premium product photography arrangement of pet accessories on a slate gray
surface. A navy blue ESA collar with brushed gold buckle, a matching woven
leash, and coordinating accessories are positioned with intentional spacing.
Clean studio lighting creates soft reflections on the hardware. The
composition has a luxury fashion accessory aesthetic. Professional e-commerce
photography with minimalist styling, slate gray background with navy blue
and gold products, conveying premium quality and sophisticated design.
```

---

### 7.4 Phase 1 Validation Summary

| Batch | Count | Purpose |
|-------|-------|---------|
| Home Page | 10 | Hero (2), Trust Bar (4), Categories (4) |
| Products Page | 4 | Hero (1), Collection Headers (3) |
| **TOTAL PHASE 1** | **14** | Manual review before continuing |

**Validation Checklist After Generation:**
- [ ] Check image quality and clarity
- [ ] Verify no unwanted text artifacts
- [ ] Confirm color palette matches brand (navy, lime, cream)
- [ ] Assess dog breed accuracy
- [ ] Review composition and framing
- [ ] Test images at intended display sizes

---

### 7.5 Phase 2: Product Detail Images (Pending Validation)

> ⏸️ **HOLD**: Generate only after Phase 1 validation is approved.

| Category | Products | Images Each | Total |
|----------|----------|-------------|-------|
| Service Dog Kits | 4 | 2 (main + lifestyle) | 8 |
| ESA Kits | 5 | 2 (main + lifestyle) | 10 |
| Certificates | 2 | 2 (main + display) | 4 |
| ID Cards | 2 | 2 (main + in-use) | 4 |
| Accessories | 2 | 2 (main + on-dog) | 4 |
| Forms | 1 | 2 (main + context) | 2 |
| **SUBTOTAL** | 16 | - | 32 |

### 7.6 Phase 3: Contact & Misc Images (Pending Validation)

| Image | Purpose | Aspect |
|-------|---------|--------|
| `contact-hero.webp` | Contact page banner | 16:9 |
| `contact-team.webp` | Support team visual | 4:3 |
| **SUBTOTAL** | - | 2 |

### 7.7 Complete Asset Summary

| Phase | Images | Status |
|-------|--------|--------|
| Phase 1: Validation Batch | 14 | 🎯 Generate First |
| Phase 2: Product Details | 32 | ⏸️ After Validation |
| Phase 3: Contact & Misc | 2 | ⏸️ After Validation |
| **TOTAL** | **48** | - |

### 7.8 Generation Execution Commands

```bash
# Phase 1: Generate validation batch (14 images)
# Use Replicate MCP with google/nano-banana model
# Wait up to 120 seconds per image
# Generate sequentially to monitor quality

# Example API parameters:
{
  "model": "google/nano-banana",
  "input": {
    "prompt": "[OPTIMIZED PROMPT FROM ABOVE]",
    "aspect_ratio": "[ASPECT FROM SPEC]"
  }
}
```

### 7.9 Cost Estimation

| Phase | Images | Est. Cost/Image | Total Est. |
|-------|--------|-----------------|------------|
| Phase 1 | 14 | ~$0.04 | ~$0.56 |
| Phase 2 | 32 | ~$0.04 | ~$1.28 |
| Phase 3 | 2 | ~$0.04 | ~$0.08 |
| **TOTAL** | 48 | - | **~$1.92** |

> Note: Costs are estimates based on typical Replicate pricing. Actual costs may vary.

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
