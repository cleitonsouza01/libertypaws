-- 00003_catalog.sql
-- Service catalog: categories, tags, services, media, addons, junction tables

-- ============================================================
-- Categories
-- ============================================================
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.categories IS 'Service categories (esa, psd, documents, accessories)';
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Tags
-- ============================================================
CREATE TABLE public.tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.tags IS 'Descriptive tags for services (best-value, housing, popular)';
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Services
-- ============================================================
CREATE TABLE public.services (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT UNIQUE NOT NULL,
  name               TEXT NOT NULL,
  description        TEXT NOT NULL,
  short_description  TEXT,
  price              NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  max_price          NUMERIC(10,2) CHECK (max_price IS NULL OR max_price >= price),
  currency           TEXT NOT NULL DEFAULT 'usd',
  stripe_product_id  TEXT UNIQUE,
  stripe_price_id    TEXT,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  is_featured        BOOLEAN NOT NULL DEFAULT false,
  sort_order         INTEGER NOT NULL DEFAULT 0,
  badge_text         TEXT,
  features           JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_fields    JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivery_type      TEXT NOT NULL DEFAULT 'digital' CHECK (delivery_type IN ('digital', 'physical', 'both')),
  processing_time    TEXT,
  validity_period    TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.services IS 'Service catalog — the products customers purchase';
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Service Media
-- ============================================================
CREATE TABLE public.service_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  alt_text    TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.service_media IS 'Photos and videos for services';
ALTER TABLE public.service_media ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Service Addons (enhanced per review: +description, +icon, +sort_order)
-- ============================================================
CREATE TABLE public.service_addons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stripe_price_id TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.service_addons IS 'Optional add-ons for services (e.g. Apple Wallet card)';
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Service <-> Categories (M:N)
-- ============================================================
CREATE TABLE public.service_categories (
  service_id  UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, category_id)
);

COMMENT ON TABLE public.service_categories IS 'Many-to-many: services belong to categories';
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Service <-> Tags (M:N)
-- ============================================================
CREATE TABLE public.service_tags (
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, tag_id)
);

COMMENT ON TABLE public.service_tags IS 'Many-to-many: services have descriptive tags';
ALTER TABLE public.service_tags ENABLE ROW LEVEL SECURITY;
