-- 00006_registrations.sql
-- Pet registrations with public search support

CREATE TABLE public.pet_registrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number  TEXT UNIQUE NOT NULL,
  customer_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  -- preserve registration if user deleted
  order_id             UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  order_item_id        UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  pet_name             TEXT NOT NULL,
  pet_breed            TEXT NOT NULL,
  pet_species          TEXT NOT NULL DEFAULT 'dog' CHECK (pet_species IN ('dog', 'cat', 'other')),
  pet_photo_url        TEXT,
  pet_color            TEXT,
  pet_weight           TEXT,
  pet_date_of_birth    DATE,
  handler_name         TEXT NOT NULL,
  registration_type    TEXT NOT NULL CHECK (registration_type IN ('esa', 'psd')),
  registration_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date          DATE,  -- NULL = lifetime
  status               TEXT NOT NULL DEFAULT 'pending_review'
                         CHECK (status IN ('pending_review','active','expired','revoked','suspended')),
  certificate_url      TEXT,
  id_card_url          TEXT,
  apple_wallet_url     TEXT,
  is_public            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.pet_registrations IS 'Pet registration records — searchable by registration number';
COMMENT ON COLUMN public.pet_registrations.is_public IS 'Whether visible in public registration search';
COMMENT ON COLUMN public.pet_registrations.expiry_date IS 'NULL means lifetime validity';
ALTER TABLE public.pet_registrations ENABLE ROW LEVEL SECURITY;
