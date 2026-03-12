-- ── Service Variants (size/tier-based pricing) ─────────────────────

CREATE TABLE public.service_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  slug            TEXT NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stripe_price_id TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (service_id, slug)
);

-- ── Indexes ─────────────────────────────────────────────────────────

CREATE INDEX idx_service_variants_service_id ON public.service_variants(service_id);
CREATE INDEX idx_service_variants_active_sort ON public.service_variants(service_id, is_active, sort_order);

-- Ensure at most one default variant per service
CREATE UNIQUE INDEX idx_service_variants_one_default
  ON public.service_variants(service_id)
  WHERE is_default = true;

-- ── updated_at trigger ──────────────────────────────────────────────

CREATE TRIGGER set_service_variants_updated_at
  BEFORE UPDATE ON public.service_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────

ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active variants
CREATE POLICY "Anyone can read active service variants"
  ON public.service_variants
  FOR SELECT
  USING (is_active = true);

-- Admin: full access
CREATE POLICY "Admins can manage service variants"
  ON public.service_variants
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── Add variant_id FK to order_items ────────────────────────────────

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.service_variants(id) ON DELETE SET NULL;
