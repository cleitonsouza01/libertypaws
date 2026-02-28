-- 00002_profiles.sql
-- Customer profiles extending Supabase auth.users

CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  avatar_url          TEXT,
  locale              TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es', 'pt')),
  shipping_address    JSONB,
  billing_address     JSONB,
  stripe_customer_id  TEXT UNIQUE,
  marketing_consent   BOOLEAN NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,  -- soft delete: anonymize instead of hard-deleting
  last_login_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Customer profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.deleted_at IS 'Soft delete timestamp; when set, profile is anonymized';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe Customer ID (cus_xxx), set on first checkout';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
