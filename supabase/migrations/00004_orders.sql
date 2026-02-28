-- 00004_orders.sql
-- Commerce: coupons, orders, order_items, order_item_addons, order_status_history

-- ============================================================
-- Coupons (new table per review)
-- ============================================================
CREATE TABLE public.coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT UNIQUE NOT NULL,
  description       TEXT,
  discount_type     TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value    NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  currency          TEXT NOT NULL DEFAULT 'usd',
  min_order_amount  NUMERIC(10,2),
  max_discount      NUMERIC(10,2),
  max_uses          INTEGER,
  current_uses      INTEGER NOT NULL DEFAULT 0,
  valid_from        TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until       TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.coupons IS 'Discount coupons with usage tracking';
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Order number sequence (atomic generation)
-- ============================================================
CREATE SEQUENCE public.order_number_seq START WITH 1 INCREMENT BY 1;

-- ============================================================
-- Orders
-- Fixes from review:
--   - Removed stripe_payment_intent_id (lives only on payments table, 1:N)
--   - Removed pet_info/handler_info (redundant with order_items.customization + pet_registrations)
--   - customer_id ON DELETE RESTRICT (never cascade-delete financial records)
--   - Added coupon_id FK + coupon_code snapshot
--   - Added 'delivered' to status enum
-- ============================================================
CREATE TABLE public.orders (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number                 TEXT UNIQUE NOT NULL,
  customer_id                  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status                       TEXT NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending','paid','processing','shipped','delivered','completed','cancelled','refunded','failed')),
  subtotal                     NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount              NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount                   NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount                 NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  currency                     TEXT NOT NULL DEFAULT 'usd',
  coupon_id                    UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  coupon_code                  TEXT,  -- snapshot of code at time of use
  stripe_checkout_session_id   TEXT UNIQUE,
  shipping_address             JSONB,
  customer_notes               TEXT,
  admin_notes                  TEXT,
  locale                       TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es', 'pt')),
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at                 TIMESTAMPTZ
);

COMMENT ON TABLE public.orders IS 'Customer orders — written by Edge Functions only';
COMMENT ON COLUMN public.orders.coupon_code IS 'Snapshot of coupon code at time of use (code may change later)';
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Order Items
-- Fix: service_id ON DELETE RESTRICT (can''t delete a purchased service)
-- ============================================================
CREATE TABLE public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  service_id    UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price   NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  size          TEXT,
  customization JSONB,  -- pet name, breed, handler name, etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_items IS 'Line items within an order';
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Order Item Addons (normalized junction table per review)
-- Replaces JSONB addons column on order_items
-- ============================================================
CREATE TABLE public.order_item_addons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  addon_id      UUID NOT NULL REFERENCES public.service_addons(id) ON DELETE RESTRICT,
  addon_name    TEXT NOT NULL,  -- snapshot at time of purchase
  addon_price   NUMERIC(10,2) NOT NULL CHECK (addon_price >= 0),  -- snapshot at time of purchase
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_item_addons IS 'Normalized addon selections per order item (price snapshots)';
ALTER TABLE public.order_item_addons ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Order Status History
-- ============================================================
CREATE TABLE public.order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status   TEXT NOT NULL
                CHECK (to_status IN ('pending','paid','processing','shipped','delivered','completed','cancelled','refunded','failed')),
  changed_by  UUID,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_status_history IS 'Audit trail of order status changes';
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
