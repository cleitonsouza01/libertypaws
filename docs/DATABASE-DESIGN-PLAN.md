# Liberty Paws International - Database Design Plan

> **Document Version**: 1.0
> **Generated**: February 2026
> **Status**: Planning (Awaiting Approval)
> **Backend**: Supabase (PostgreSQL + Auth + Edge Functions + Realtime)
> **Payment Processor**: Stripe (Checkout Sessions + Webhooks)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Supabase Auth & Customer Profiles](#2-supabase-auth--customer-profiles)
3. [Service Catalog](#3-service-catalog)
4. [Categories & Tags](#4-categories--tags)
5. [Orders & Order Items](#5-orders--order-items)
6. [Payments (Stripe Integration)](#6-payments-stripe-integration)
7. [Reviews](#7-reviews)
8. [Pet Registration & Public Search](#8-pet-registration--public-search)
9. [Contact Messages](#9-contact-messages)
10. [Entity Relationship Diagram](#10-entity-relationship-diagram)
11. [Row Level Security (RLS) Policies](#11-row-level-security-rls-policies)
12. [Stripe vs Supabase: Payment Handling Recommendation](#12-stripe-vs-supabase-payment-handling-recommendation)
13. [Supabase Features Leveraged](#13-supabase-features-leveraged)
14. [Migration Strategy](#14-migration-strategy)

---

## 1. Architecture Overview

### Design Principles

- **Supabase Auth** handles all authentication (email/password, OAuth, magic links)
- **Supabase Postgres** is the application database for all business data
- **Stripe** is the payment processor and source of truth for payment/charge data
- **Supabase stores Stripe IDs locally** (never raw card data) for fast access
- **Edge Functions** handle Stripe webhooks and server-side payment logic
- **RLS (Row Level Security)** enforced on every public table
- **Realtime** subscriptions for live order status updates in the UI
- **Keep it simple** — fewer than 10 services, so no over-engineering

### Data Flow

```
Customer → Browse Services (public, no auth required)
         → Sign Up / Login (Supabase Auth)
         → Add to Cart → Checkout (Stripe Checkout Session via Edge Function)
         → Stripe processes payment
         → Stripe Webhook → Edge Function → writes order + payment to Supabase
         → Customer sees order status (Realtime subscription)
         → Service completed → Registration number generated
         → Public "Search Registration" feature (no auth required)
```

---

## 2. Supabase Auth & Customer Profiles

### How Supabase Auth Works

Supabase provides a built-in `auth.users` table in the `auth` schema. This table:
- Is **managed internally** by Supabase — do not modify its schema
- Is **not** exposed via the auto-generated REST API
- Contains: `id` (UUID), `email`, `encrypted_password`, `raw_user_meta_data` (JSONB), timestamps
- Handles: sign up, login, password reset, email confirmation, OAuth

**We extend it** with a `public.profiles` table that references `auth.users(id)`.

### Table: `profiles`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, FK → auth.users(id) ON DELETE CASCADE` | Same as Supabase Auth user ID |
| `full_name` | `TEXT` | `NOT NULL` | Customer's full name |
| `email` | `TEXT` | `NOT NULL` | Mirrors auth.users email for queries |
| `phone` | `TEXT` | `NULL` | Phone number (optional) |
| `avatar_url` | `TEXT` | `NULL` | Profile picture URL |
| `locale` | `TEXT` | `DEFAULT 'en'` | Preferred language: `en`, `es`, `pt` |
| `shipping_address` | `JSONB` | `NULL` | `{ street, city, state, zip, country }` |
| `billing_address` | `JSONB` | `NULL` | `{ street, city, state, zip, country }` |
| `stripe_customer_id` | `TEXT` | `UNIQUE, NULL` | Stripe Customer ID (e.g., `cus_xxx`) |
| `marketing_consent` | `BOOLEAN` | `DEFAULT false` | Email marketing opt-in |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration date |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last profile update |
| `last_login_at` | `TIMESTAMPTZ` | `NULL` | Updated via auth hook or trigger |

**Notes:**
- A **Postgres trigger** on `auth.users` automatically creates a `profiles` row on signup
- `last_login_at` can be updated via a Supabase Auth hook or a database function triggered on sign-in
- `stripe_customer_id` is set the first time the user initiates a checkout (created via Edge Function)
- Address stored as JSONB for flexibility (different countries have different formats)

**Suggested additional fields (optional, for future):**
- `date_of_birth` — for age verification if ever needed
- `notification_preferences` — JSONB for email/SMS/push preferences

---

## 3. Service Catalog

Since the project has **fewer than 10 services**, we keep this simple. Services are the "products" the customer buys.

### Table: `services`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | Service ID |
| `slug` | `TEXT` | `UNIQUE, NOT NULL` | URL-friendly identifier (e.g., `esa-letter-housing`) |
| `name` | `TEXT` | `NOT NULL` | Service name (English, source of truth) |
| `description` | `TEXT` | `NOT NULL` | Full description (English) |
| `short_description` | `TEXT` | `NULL` | Brief tagline for cards/listings |
| `price` | `NUMERIC(10,2)` | `NOT NULL` | Base price (USD) |
| `max_price` | `NUMERIC(10,2)` | `NULL` | Upper bound for price ranges (e.g., "From $79 - $199") |
| `currency` | `TEXT` | `DEFAULT 'usd'` | ISO currency code |
| `stripe_product_id` | `TEXT` | `UNIQUE, NULL` | Stripe Product ID (e.g., `prod_xxx`) |
| `stripe_price_id` | `TEXT` | `NULL` | Stripe Price ID (e.g., `price_xxx`) |
| `is_active` | `BOOLEAN` | `DEFAULT true` | Whether service is visible/purchasable |
| `is_featured` | `BOOLEAN` | `DEFAULT false` | Show in "Featured" sections |
| `sort_order` | `INTEGER` | `DEFAULT 0` | Display ordering |
| `badge_text` | `TEXT` | `NULL` | Badge label (e.g., "Best Value", "Housing") |
| `features` | `JSONB` | `DEFAULT '[]'` | Array of feature strings: `["Valid for 1 year", ...]` |
| `required_fields` | `JSONB` | `DEFAULT '[]'` | Info needed from customer: `["pet_name", "breed", ...]` |
| `delivery_type` | `TEXT` | `DEFAULT 'digital'` | `digital`, `physical`, `both` |
| `processing_time` | `TEXT` | `NULL` | E.g., "24-48 hours", "3-5 business days" |
| `validity_period` | `TEXT` | `NULL` | E.g., "1 year", "Lifetime" |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `service_media`

Separate table for photos and videos to support multiple media items per service.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `service_id` | `UUID` | `FK → services(id) ON DELETE CASCADE, NOT NULL` | Parent service |
| `url` | `TEXT` | `NOT NULL` | CDN URL (Cloudflare R2 or Supabase Storage) |
| `media_type` | `TEXT` | `NOT NULL` | `image`, `video` |
| `alt_text` | `TEXT` | `NULL` | Accessibility alt text |
| `is_primary` | `BOOLEAN` | `DEFAULT false` | Main image for cards/thumbnails |
| `sort_order` | `INTEGER` | `DEFAULT 0` | Gallery ordering |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `service_addons`

For optional add-ons like Apple Wallet digital card.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `service_id` | `UUID` | `FK → services(id) ON DELETE CASCADE, NOT NULL` | Parent service |
| `name` | `TEXT` | `NOT NULL` | E.g., "Apple Wallet Digital Card" |
| `price` | `NUMERIC(10,2)` | `NOT NULL` | Add-on price (e.g., 59.99) |
| `stripe_price_id` | `TEXT` | `NULL` | Stripe Price ID for the add-on |
| `is_active` | `BOOLEAN` | `DEFAULT true` | — |

### Translations

Service names and descriptions are stored in English in the database. Translations are handled by the `messages/{locale}.json` i18n files on the frontend (existing pattern). The `slug` serves as the translation key lookup.

**Alternative for Phase 3+**: If dynamic admin-managed translations are needed, add a `service_translations` table:

| Column | Type | Description |
|--------|------|-------------|
| `service_id` | `UUID` | FK |
| `locale` | `TEXT` | `en`, `es`, `pt` |
| `name` | `TEXT` | Translated name |
| `description` | `TEXT` | Translated description |
| PK: `(service_id, locale)` | | |

---

## 4. Categories & Tags

### Table: `categories`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `slug` | `TEXT` | `UNIQUE, NOT NULL` | URL-friendly: `esa`, `psd`, `documents`, `accessories` |
| `name` | `TEXT` | `NOT NULL` | Display name (English) |
| `description` | `TEXT` | `NULL` | Category description |
| `icon` | `TEXT` | `NULL` | Lucide icon name (e.g., `heart`, `shield`) |
| `sort_order` | `INTEGER` | `DEFAULT 0` | Display ordering |
| `is_active` | `BOOLEAN` | `DEFAULT true` | — |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `service_categories` (Many-to-Many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `service_id` | `UUID` | `FK → services(id) ON DELETE CASCADE` | — |
| `category_id` | `UUID` | `FK → categories(id) ON DELETE CASCADE` | — |
| PK: `(service_id, category_id)` | | | Composite primary key |

### Table: `tags`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `slug` | `TEXT` | `UNIQUE, NOT NULL` | URL-friendly: `best-value`, `housing`, `travel` |
| `name` | `TEXT` | `NOT NULL` | Display name |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `service_tags` (Many-to-Many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `service_id` | `UUID` | `FK → services(id) ON DELETE CASCADE` | — |
| `tag_id` | `UUID` | `FK → tags(id) ON DELETE CASCADE` | — |
| PK: `(service_id, tag_id)` | | | Composite primary key |

**Rationale for keeping categories AND tags with fewer than 10 services:**
- Categories are structural (navigation, filtering) — e.g., ESA, PSD, Documents, Accessories
- Tags are descriptive (marketing, search) — e.g., "Best Value", "Housing", "Popular", "New"
- Even with few services, they improve filtering, SEO, and future scalability
- Both tables are tiny and add negligible complexity

---

## 5. Orders & Order Items

### Table: `orders`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | Order ID |
| `order_number` | `TEXT` | `UNIQUE, NOT NULL` | Human-readable order number (e.g., `LP-2026-00001`) |
| `customer_id` | `UUID` | `FK → profiles(id), NOT NULL` | Customer who placed the order |
| `status` | `TEXT` | `NOT NULL, DEFAULT 'pending'` | See status enum below |
| `subtotal` | `NUMERIC(10,2)` | `NOT NULL` | Sum of items before tax/discounts |
| `discount_amount` | `NUMERIC(10,2)` | `DEFAULT 0` | Applied discount |
| `tax_amount` | `NUMERIC(10,2)` | `DEFAULT 0` | Tax amount |
| `total_amount` | `NUMERIC(10,2)` | `NOT NULL` | Final charged amount |
| `currency` | `TEXT` | `DEFAULT 'usd'` | ISO currency code |
| `stripe_checkout_session_id` | `TEXT` | `UNIQUE, NULL` | Stripe Checkout Session ID |
| `stripe_payment_intent_id` | `TEXT` | `UNIQUE, NULL` | Stripe PaymentIntent ID |
| `shipping_address` | `JSONB` | `NULL` | Shipping address snapshot at time of order |
| `customer_notes` | `TEXT` | `NULL` | Special instructions from customer |
| `admin_notes` | `TEXT` | `NULL` | Internal notes (not visible to customer) |
| `pet_info` | `JSONB` | `NULL` | Pet details submitted: `{ name, breed, type, photo_url }` |
| `handler_info` | `JSONB` | `NULL` | Handler details: `{ name, address }` |
| `locale` | `TEXT` | `DEFAULT 'en'` | Language at time of order |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Order creation date |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last status change |
| `completed_at` | `TIMESTAMPTZ` | `NULL` | When status changed to `completed` |

**Order Status Enum:**

| Status | Description |
|--------|-------------|
| `pending` | Order created, awaiting payment |
| `paid` | Payment confirmed by Stripe |
| `processing` | Staff preparing documents/kit |
| `shipped` | Physical items shipped (if applicable) |
| `completed` | Service delivered, registration number assigned |
| `cancelled` | Cancelled by customer or admin |
| `refunded` | Payment refunded via Stripe |
| `failed` | Payment failed |

### Table: `order_items`

Supports the many-to-many relationship between orders and services.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `order_id` | `UUID` | `FK → orders(id) ON DELETE CASCADE, NOT NULL` | Parent order |
| `service_id` | `UUID` | `FK → services(id), NOT NULL` | Service purchased |
| `quantity` | `INTEGER` | `NOT NULL, DEFAULT 1` | Quantity (usually 1) |
| `unit_price` | `NUMERIC(10,2)` | `NOT NULL` | Price at time of purchase (snapshot) |
| `total_price` | `NUMERIC(10,2)` | `NOT NULL` | `quantity * unit_price` |
| `addons` | `JSONB` | `DEFAULT '[]'` | Selected add-ons: `[{ name, price }]` |
| `size` | `TEXT` | `NULL` | Size selection if applicable (e.g., vest: S, M, L) |
| `customization` | `JSONB` | `NULL` | Custom fields: pet name, breed, handler name |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `order_status_history`

Tracks every status change for audit trail and customer transparency.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `order_id` | `UUID` | `FK → orders(id) ON DELETE CASCADE, NOT NULL` | — |
| `from_status` | `TEXT` | `NULL` | Previous status (NULL for initial) |
| `to_status` | `TEXT` | `NOT NULL` | New status |
| `changed_by` | `UUID` | `NULL` | User or admin who changed it |
| `note` | `TEXT` | `NULL` | Reason for change |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | When the change occurred |

**Key relationships:**
- A customer can have **multiple orders** (1:N)
- An order can have **multiple services** via `order_items` (M:N through junction table)
- Each order item snapshots the price at purchase time (prices may change later)

---

## 6. Payments (Stripe Integration)

### Table: `payments`

This table is a **local mirror** of Stripe payment data, updated exclusively via webhooks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `order_id` | `UUID` | `FK → orders(id), NOT NULL` | Associated order |
| `stripe_payment_intent_id` | `TEXT` | `UNIQUE, NOT NULL` | Stripe PaymentIntent ID |
| `stripe_charge_id` | `TEXT` | `NULL` | Stripe Charge ID |
| `amount` | `NUMERIC(10,2)` | `NOT NULL` | Amount in base currency |
| `currency` | `TEXT` | `DEFAULT 'usd'` | ISO currency code |
| `status` | `TEXT` | `NOT NULL` | `pending`, `succeeded`, `failed`, `refunded`, `partially_refunded` |
| `payment_method_type` | `TEXT` | `NULL` | `card`, `bank_transfer`, `apple_pay`, etc. |
| `payment_method_last4` | `TEXT` | `NULL` | Last 4 digits of card (safe to store) |
| `payment_method_brand` | `TEXT` | `NULL` | Card brand: `visa`, `mastercard`, etc. |
| `receipt_url` | `TEXT` | `NULL` | Stripe receipt URL |
| `refund_amount` | `NUMERIC(10,2)` | `DEFAULT 0` | Total refunded amount |
| `refund_reason` | `TEXT` | `NULL` | Reason for refund |
| `stripe_fee` | `NUMERIC(10,2)` | `NULL` | Stripe processing fee |
| `metadata` | `JSONB` | `DEFAULT '{}'` | Additional Stripe metadata |
| `paid_at` | `TIMESTAMPTZ` | `NULL` | When payment was confirmed |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Table: `stripe_webhook_events`

Idempotency tracking — prevents processing the same webhook event twice.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | `PK` | Stripe Event ID (e.g., `evt_xxx`) |
| `type` | `TEXT` | `NOT NULL` | Event type (e.g., `checkout.session.completed`) |
| `processed` | `BOOLEAN` | `DEFAULT false` | Whether we've handled this event |
| `payload` | `JSONB` | `NOT NULL` | Full webhook payload |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `processed_at` | `TIMESTAMPTZ` | `NULL` | When processing completed |

**What is stored where:**

| Data | Stored In | Reason |
|------|-----------|--------|
| Card numbers, CVV, tokens | **Stripe ONLY** | PCI compliance — never in our DB |
| PaymentIntent ID, Charge ID | Supabase `payments` | Fast lookups, avoid Stripe API calls |
| Payment status | Supabase `payments` | RLS-protected customer access |
| Card last4, brand | Supabase `payments` | Display in order history |
| Receipt URL | Supabase `payments` | Direct link for customer |
| Full charge details | **Stripe** | Source of truth, accessible via Dashboard |
| Refund processing | **Stripe API** | Initiated via Stripe, webhook updates our DB |

---

## 7. Reviews

### Table: `reviews`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `customer_id` | `UUID` | `FK → profiles(id) ON DELETE SET NULL, NULL` | Reviewer (NULL if account deleted) |
| `service_id` | `UUID` | `FK → services(id) ON DELETE CASCADE, NOT NULL` | Service being reviewed |
| `order_id` | `UUID` | `FK → orders(id), NULL` | Verify they actually purchased it |
| `rating` | `INTEGER` | `NOT NULL, CHECK (rating >= 1 AND rating <= 5)` | 1-5 stars |
| `title` | `TEXT` | `NULL` | Review headline |
| `comment` | `TEXT` | `NOT NULL` | Review body text |
| `is_verified_purchase` | `BOOLEAN` | `DEFAULT false` | Auto-set if linked to a completed order |
| `is_published` | `BOOLEAN` | `DEFAULT false` | Admin moderation — hidden until approved |
| `admin_response` | `TEXT` | `NULL` | Business reply to the review |
| `admin_response_at` | `TIMESTAMPTZ` | `NULL` | When admin responded |
| `helpful_count` | `INTEGER` | `DEFAULT 0` | "Was this helpful?" counter |
| `locale` | `TEXT` | `DEFAULT 'en'` | Language of the review |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

**Unique constraint**: `UNIQUE(customer_id, service_id)` — one review per customer per service.

**Suggested fields:**
- `is_verified_purchase` — automatically set to `true` if an `order_id` with status `completed` exists for that customer + service combo
- `is_published` — allows moderation before reviews go public
- `admin_response` — enables the business to reply publicly
- `helpful_count` — simple social proof without needing a separate votes table

---

## 8. Pet Registration & Public Search

This is the core differentiator: after an order is completed, the customer receives a registration number. Anyone can search by this number to verify the registration.

### Table: `pet_registrations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `registration_number` | `TEXT` | `UNIQUE, NOT NULL` | Public registration ID (e.g., `LP-ESA-2026-A1B2C3`) |
| `customer_id` | `UUID` | `FK → profiles(id), NOT NULL` | Owner |
| `order_id` | `UUID` | `FK → orders(id), NOT NULL` | Originating order |
| `order_item_id` | `UUID` | `FK → order_items(id), NULL` | Specific line item |
| `pet_name` | `TEXT` | `NOT NULL` | Pet's name |
| `pet_breed` | `TEXT` | `NOT NULL` | Breed |
| `pet_species` | `TEXT` | `DEFAULT 'dog'` | `dog`, `cat`, `other` |
| `pet_photo_url` | `TEXT` | `NULL` | Photo stored in Supabase Storage |
| `pet_color` | `TEXT` | `NULL` | Primary color/markings |
| `pet_weight` | `TEXT` | `NULL` | Weight range |
| `pet_date_of_birth` | `DATE` | `NULL` | — |
| `handler_name` | `TEXT` | `NOT NULL` | Handler/owner legal name |
| `registration_type` | `TEXT` | `NOT NULL` | `esa`, `psd` (Emotional Support Animal or Psychiatric Service Dog) |
| `registration_date` | `DATE` | `NOT NULL, DEFAULT CURRENT_DATE` | — |
| `expiry_date` | `DATE` | `NULL` | NULL = lifetime, otherwise annual renewal |
| `status` | `TEXT` | `DEFAULT 'active'` | `active`, `expired`, `revoked`, `suspended` |
| `certificate_url` | `TEXT` | `NULL` | Digital certificate download link |
| `id_card_url` | `TEXT` | `NULL` | Digital ID card download link |
| `apple_wallet_url` | `TEXT` | `NULL` | Apple Wallet pass URL |
| `is_public` | `BOOLEAN` | `DEFAULT true` | Whether searchable in public lookup |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

### Registration Number Format

Suggested format: `LP-{TYPE}-{YEAR}-{RANDOM}`
- `LP` — Liberty Paws prefix
- `TYPE` — `ESA` or `PSD`
- `YEAR` — 4-digit year
- `RANDOM` — 6-character alphanumeric (e.g., `A1B2C3`)
- Example: `LP-ESA-2026-A1B2C3`

Generated via a Postgres function or Edge Function when order status changes to `completed`.

### Public Search API

The "Search Registration" feature:
- **Endpoint**: `GET /api/registration/search?number=LP-ESA-2026-A1B2C3`
- **No authentication required** — public feature
- **Returns**: Pet name, breed, species, handler name, registration type, registration date, expiry date, status
- **Does NOT return**: Customer email, phone, address, order details, payment info

### Security Measures for Public Search

| Measure | Implementation |
|---------|---------------|
| **Rate Limiting** | Supabase Edge Function with IP-based rate limiting (e.g., 10 requests/minute) |
| **CAPTCHA** | Cloudflare Turnstile or hCaptcha on the search form (free tier available) |
| **Information Minimization** | Only return necessary public fields, never private data |
| **Enumeration Prevention** | Registration numbers use random characters, not sequential IDs |
| **Logging** | Log search queries for abuse detection |
| **RLS** | A special public-read policy on `pet_registrations` filtered by `is_public = true` |

---

## 9. Contact Messages

Supabase handles this natively — it's just a table with RLS + an Edge Function or API route for rate-limited inserts.

### Table: `contact_messages`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | — |
| `name` | `TEXT` | `NOT NULL` | Sender's name |
| `email` | `TEXT` | `NOT NULL` | Sender's email |
| `phone` | `TEXT` | `NULL` | Optional phone |
| `subject` | `TEXT` | `NOT NULL` | `general`, `product`, `order`, `other` |
| `message` | `TEXT` | `NOT NULL, CHECK (char_length(message) >= 10)` | Min 10 chars |
| `locale` | `TEXT` | `DEFAULT 'en'` | Language of the message |
| `customer_id` | `UUID` | `FK → profiles(id), NULL` | If user is logged in |
| `order_id` | `UUID` | `FK → orders(id), NULL` | If regarding a specific order |
| `status` | `TEXT` | `DEFAULT 'new'` | `new`, `read`, `replied`, `closed` |
| `assigned_to` | `TEXT` | `NULL` | Admin email handling this inquiry |
| `admin_notes` | `TEXT` | `NULL` | Internal notes |
| `ip_address` | `INET` | `NULL` | For rate limiting / spam detection |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

**Supabase handling for contact messages:**
- Insert via **Edge Function** (preferred) or **Next.js API route**
- Rate limiting: 3 messages per IP per hour
- Optional: Supabase Database Webhook triggers email notification to support team
- RLS: Anonymous users can INSERT only, admins can SELECT/UPDATE
- Future: Add Realtime subscription for admin dashboard to see new messages live

---

## 10. Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   auth.users    │     │   categories    │     │      tags       │
│─────────────────│     │─────────────────│     │─────────────────│
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ email           │     │ slug            │     │ slug            │
│ ...             │     │ name            │     │ name            │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │ 1:1                   │                        │
         ▼                       │ M:N                    │ M:N
┌─────────────────┐     ┌───────┴─────────┐     ┌───────┴─────────┐
│    profiles     │     │service_categories│     │  service_tags   │
│─────────────────│     │─────────────────│     │─────────────────│
│ id (PK/FK)      │     │ service_id (FK) │     │ service_id (FK) │
│ full_name       │     │ category_id (FK)│     │ tag_id (FK)     │
│ email           │     └───────┬─────────┘     └───────┬─────────┘
│ phone           │             │                        │
│ stripe_cust_id  │             │ M:N                    │ M:N
│ ...             │     ┌───────┴─────────┐              │
└──┬──────────┬───┘     │    services     │◄─────────────┘
   │          │         │─────────────────│
   │          │         │ id (PK)         │
   │          │         │ slug            │
   │          │         │ name, price     │
   │          │         │ stripe_prod_id  │
   │          │         │ ...             │
   │          │         └──┬──────┬───────┘
   │          │            │      │
   │          │            │      │ 1:N
   │          │            │      ▼
   │          │            │  ┌──────────────┐
   │          │            │  │service_media │
   │          │            │  │──────────────│
   │          │            │  │ service_id   │
   │          │            │  │ url, type    │
   │          │            │  └──────────────┘
   │          │            │
   │ 1:N      │ 1:N        │ (via order_items)
   │          │            │
   ▼          │            ▼
┌─────────────┴───┐  ┌─────────────────┐
│     orders      │  │   order_items   │
│─────────────────│  │─────────────────│
│ id (PK)         │  │ id (PK)         │
│ order_number    │  │ order_id (FK)   │──► orders
│ customer_id (FK)│  │ service_id (FK) │──► services
│ status          │  │ unit_price      │
│ total_amount    │  │ quantity        │
│ stripe_pi_id    │  └─────────────────┘
│ ...             │
└──┬──────┬───────┘
   │      │
   │ 1:1  │ 1:N
   │      │
   ▼      ▼
┌─────────┐  ┌──────────────────┐
│payments │  │order_status_hist │
│─────────│  │──────────────────│
│ id (PK) │  │ order_id (FK)    │
│ order_id│  │ from/to_status   │
│ amount  │  │ changed_by       │
│ status  │  │ created_at       │
│ stripe_│  └──────────────────┘
│  pi_id  │
└─────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    reviews      │     │pet_registrations│     │contact_messages │
│─────────────────│     │─────────────────│     │─────────────────│
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ customer_id (FK)│     │ reg_number      │     │ name, email     │
│ service_id (FK) │     │ customer_id (FK)│     │ subject, message│
│ order_id (FK)   │     │ order_id (FK)   │     │ status          │
│ rating (1-5)    │     │ pet_name, breed │     │ customer_id (FK)│
│ comment         │     │ handler_name    │     │ ...             │
│ is_published    │     │ status          │     └─────────────────┘
│ ...             │     │ ...             │
└─────────────────┘     └─────────────────┘
                        (Public search endpoint)
```

### Relationship Summary

| Relationship | Type | Implementation |
|-------------|------|----------------|
| Customer → Orders | 1:N | `orders.customer_id → profiles.id` |
| Order → Services | M:N | Via `order_items` junction table |
| Order → Payment | 1:1 | `payments.order_id → orders.id` |
| Customer → Reviews | 1:N | `reviews.customer_id → profiles.id` |
| Review → Service | N:1 | `reviews.service_id → services.id` |
| Service → Categories | M:N | Via `service_categories` junction table |
| Service → Tags | M:N | Via `service_tags` junction table |
| Service → Media | 1:N | `service_media.service_id → services.id` |
| Service → Add-ons | 1:N | `service_addons.service_id → services.id` |
| Order → Pet Registration | 1:N | `pet_registrations.order_id → orders.id` |
| Order → Status History | 1:N | `order_status_history.order_id → orders.id` |
| Contact → Customer | N:1 (optional) | `contact_messages.customer_id → profiles.id` |

---

## 11. Row Level Security (RLS) Policies

**RLS is enabled on EVERY table.** No exceptions.

### Policy Summary

| Table | Anonymous | Authenticated User | Admin |
|-------|-----------|-------------------|-------|
| `profiles` | — | SELECT/UPDATE own | SELECT/UPDATE all |
| `services` | SELECT (active only) | SELECT (active only) | FULL |
| `service_media` | SELECT | SELECT | FULL |
| `service_addons` | SELECT (active only) | SELECT (active only) | FULL |
| `categories` | SELECT (active only) | SELECT (active only) | FULL |
| `tags` | SELECT | SELECT | FULL |
| `service_categories` | SELECT | SELECT | FULL |
| `service_tags` | SELECT | SELECT | FULL |
| `orders` | — | SELECT own | FULL |
| `order_items` | — | SELECT own (via order) | FULL |
| `order_status_history` | — | SELECT own (via order) | FULL |
| `payments` | — | SELECT own (via order) | FULL |
| `reviews` | SELECT (published only) | SELECT all published + own; INSERT own | FULL |
| `pet_registrations` | SELECT (public + active only) | SELECT own | FULL |
| `contact_messages` | INSERT only | INSERT; SELECT own | FULL |
| `stripe_webhook_events` | — | — | FULL |

**Admin identification**: Via `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`

**Critical rule**: Orders, payments, and pet_registrations are **written only by Edge Functions** (using the service role key, which bypasses RLS). Customers never directly INSERT into these tables.

---

## 12. Stripe vs Supabase: Payment Handling Recommendation

### Verdict: Use Both — Each for What It Does Best

| Concern | Recommendation | Why |
|---------|---------------|-----|
| **Payment processing** | **Stripe** | PCI-compliant, global coverage, proven infrastructure |
| **Checkout UI** | **Stripe Checkout** (hosted) | Pre-built, localized, handles card validation, 3D Secure, Apple Pay |
| **Payment data storage** | **Stripe** (source of truth) + **Supabase** (local mirror) | Fast reads, no API dependency, offline resilience |
| **Refunds** | **Stripe API** via Edge Function | Stripe processes the refund, webhook updates Supabase |
| **Subscription management** | **Stripe** (if needed in Phase 3) | Stripe Billing handles proration, invoicing, dunning |
| **Order management** | **Supabase** | Application logic, status tracking, customer dashboard |
| **Receipts** | **Stripe** | Auto-generated, legally compliant, multi-currency |
| **Analytics/Reporting** | **Supabase** + Stripe Dashboard | Join Stripe data with app data for custom reports |

### Why NOT Handle Payments in Supabase Alone?

- Supabase is a database, not a payment processor — it has no PCI compliance
- Storing card numbers or processing charges yourself is a massive liability
- Stripe handles fraud detection, chargebacks, compliance, and receipt generation
- The Stripe Checkout hosted page eliminates frontend payment form complexity

### Integration Architecture

```
Frontend                Edge Function              Stripe
   |                       |                         |
   |-- "Buy Now" click --->|                         |
   |                       |-- Create Checkout ----->|
   |                       |   Session               |
   |<-- Redirect URL ------|                         |
   |                       |                         |
   |-- Redirect to Stripe Checkout ----------------->|
   |                       |                         |
   |<-- Customer completes payment ------------------|
   |                       |                         |
   |                       |<-- Webhook: ------------|
   |                       |   checkout.session      |
   |                       |   .completed            |
   |                       |                         |
   |                       |-- Verify signature      |
   |                       |-- Create order in DB    |
   |                       |-- Create payment record |
   |                       |-- Send confirmation     |
   |                       |                         |
   |<-- Realtime: order ---|                         |
   |    status update      |                         |
```

### Webhook Events to Listen For

| Event | Action in Our System |
|-------|---------------------|
| `checkout.session.completed` | Create order + payment records, send confirmation email |
| `payment_intent.succeeded` | Update payment status to `succeeded` |
| `payment_intent.payment_failed` | Update payment status to `failed`, notify customer |
| `charge.refunded` | Update payment with refund amount, update order status |
| `charge.dispute.created` | Flag order, notify admin |

---

## 13. Supabase Features Leveraged

| Feature | Usage in Liberty Paws |
|---------|----------------------|
| **Auth** | Customer accounts (email/password, Google OAuth, magic links) |
| **Database (Postgres)** | All business tables, triggers, functions, constraints |
| **RLS** | Per-table access control, user isolation, admin roles |
| **Edge Functions** | Stripe webhooks, checkout session creation, registration search API, contact form submission |
| **Realtime** | Live order status updates on customer dashboard |
| **Storage** | Pet photos, digital certificates, ID card PDFs |
| **Database Webhooks** | Trigger email notifications on new orders, contact messages |
| **Postgres Triggers** | Auto-create profile on signup, auto-set `updated_at`, generate registration numbers |
| **Postgres Functions** | Registration number generation, order number generation, review verification |

---

## 14. Migration Strategy

### Phase 1 → Phase 2 (Current → Database)

Since the current app uses static data in `web/src/data/products.ts`, migration involves:

1. **Create all tables** via Supabase SQL migrations
2. **Seed service data** from the existing `products.ts` file
3. **Set up Edge Functions** for contact form (replacing planned API route)
4. **Enable RLS** on all tables from day one
5. **Create profiles trigger** for auto-creation on signup

### Phase 2 → Phase 3 (Database → E-Commerce)

1. **Create Stripe products/prices** matching Supabase services
2. **Store Stripe IDs** in `services.stripe_product_id` and `services.stripe_price_id`
3. **Deploy Edge Functions** for checkout and webhook handling
4. **Add orders, payments, and pet_registrations tables** (already designed above)
5. **Enable Realtime** on `orders` table for live status updates
6. **Build admin dashboard** for order management and review moderation

### Table Creation Order (respecting foreign keys)

```
1. categories
2. tags
3. services
4. service_categories (depends on services + categories)
5. service_tags (depends on services + tags)
6. service_media (depends on services)
7. service_addons (depends on services)
8. -- Wait for Supabase Auth setup --
9. profiles (depends on auth.users)
10. orders (depends on profiles)
11. order_items (depends on orders + services)
12. order_status_history (depends on orders)
13. payments (depends on orders)
14. reviews (depends on profiles + services + orders)
15. pet_registrations (depends on profiles + orders)
16. contact_messages (depends on profiles, optional FK)
17. stripe_webhook_events (no dependencies)
```

---

## Complete Table Count Summary

| Table | Purpose | Phase |
|-------|---------|-------|
| `profiles` | Customer accounts (extends auth.users) | 2 |
| `services` | Service catalog | 2 |
| `service_media` | Service photos/videos | 2 |
| `service_addons` | Optional add-ons | 2 |
| `categories` | Service categories | 2 |
| `tags` | Service tags | 2 |
| `service_categories` | M:N junction | 2 |
| `service_tags` | M:N junction | 2 |
| `orders` | Customer orders | 3 |
| `order_items` | Order line items | 3 |
| `order_status_history` | Audit trail | 3 |
| `payments` | Payment records (Stripe mirror) | 3 |
| `reviews` | Customer reviews | 2/3 |
| `pet_registrations` | Registration records + public search | 3 |
| `contact_messages` | Contact form submissions | 2 |
| `stripe_webhook_events` | Webhook idempotency | 3 |
| **TOTAL** | **16 tables** | |

---

## Indexes (Recommended)

| Table | Column(s) | Type | Reason |
|-------|-----------|------|--------|
| `services` | `slug` | UNIQUE | URL lookups |
| `services` | `is_active, sort_order` | BTREE | Catalog queries |
| `orders` | `customer_id` | BTREE | "My orders" queries + RLS performance |
| `orders` | `status` | BTREE | Admin filtering |
| `orders` | `order_number` | UNIQUE | Order lookup |
| `payments` | `order_id` | BTREE | Payment lookup by order |
| `payments` | `stripe_payment_intent_id` | UNIQUE | Webhook idempotency |
| `reviews` | `service_id, is_published` | BTREE | Public review display |
| `reviews` | `customer_id, service_id` | UNIQUE | One review per service |
| `pet_registrations` | `registration_number` | UNIQUE | Public search |
| `pet_registrations` | `customer_id` | BTREE | "My registrations" |
| `contact_messages` | `status` | BTREE | Admin inbox |

---

**Document End**

*This plan covers all tables, relationships, security policies, and integration patterns needed for Liberty Paws International's database. Review and approve before implementation begins. The SQL migration scripts will be created based on this plan.*
