-- 00007_reviews.sql
-- Customer reviews with moderation support

CREATE TABLE public.reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id            UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  order_id              UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating                INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title                 TEXT,
  comment               TEXT NOT NULL,
  is_verified_purchase  BOOLEAN NOT NULL DEFAULT false,
  is_published          BOOLEAN NOT NULL DEFAULT false,
  admin_response        TEXT,
  admin_response_at     TIMESTAMPTZ,
  helpful_count         INTEGER NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  locale                TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es', 'pt')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reviews_one_per_customer_service UNIQUE (customer_id, service_id)
);

COMMENT ON TABLE public.reviews IS 'Customer reviews with admin moderation';
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
