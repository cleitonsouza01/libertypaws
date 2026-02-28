-- 00005_payments.sql
-- Payments, refunds, and Stripe webhook event tracking

-- ============================================================
-- Payments (1:N from orders — multiple payment attempts allowed)
-- Fix: ON DELETE RESTRICT (financial records never cascade-deleted)
-- ============================================================
CREATE TABLE public.payments (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_charge_id         TEXT,
  amount                   NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency                 TEXT NOT NULL DEFAULT 'usd',
  status                   TEXT NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','succeeded','failed','refunded','partially_refunded')),
  payment_method_type      TEXT,
  payment_method_last4     TEXT,
  payment_method_brand     TEXT,
  receipt_url              TEXT,
  refund_amount            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
  refund_reason            TEXT,
  stripe_fee               NUMERIC(10,2),
  metadata                 JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at                  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.payments IS 'Local mirror of Stripe payment data, updated via webhooks';
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Refunds (new table per review — 1:N from payments)
-- ============================================================
CREATE TABLE public.refunds (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id        UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
  stripe_refund_id  TEXT UNIQUE NOT NULL,
  amount            NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency          TEXT NOT NULL DEFAULT 'usd',
  reason            TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','succeeded','failed','cancelled')),
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.refunds IS 'Individual Stripe refund records (1:N from payments)';
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Stripe Webhook Events (enhanced per review: +error_message, +retry_count, +status)
-- ============================================================
CREATE TABLE public.stripe_webhook_events (
  id            TEXT PRIMARY KEY,  -- Stripe Event ID (evt_xxx)
  type          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','processing','processed','failed')),
  payload       JSONB NOT NULL,
  error_message TEXT,
  retry_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

COMMENT ON TABLE public.stripe_webhook_events IS 'Webhook idempotency tracking with error handling';
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
