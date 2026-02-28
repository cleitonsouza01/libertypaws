-- 00008_contact.sql
-- Contact form submissions

CREATE TABLE public.contact_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  subject      TEXT NOT NULL CHECK (subject IN ('general', 'product', 'order', 'other')),
  message      TEXT NOT NULL CHECK (char_length(message) >= 10),
  locale       TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es', 'pt')),
  customer_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id     UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new','read','replied','closed')),
  assigned_to  TEXT,
  admin_notes  TEXT,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contact_messages IS 'Contact form submissions with admin workflow';
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
