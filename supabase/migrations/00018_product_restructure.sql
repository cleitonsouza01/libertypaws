-- 00018_product_restructure.sql
-- Restructure products to match new service catalog:
--   svan-program, esa-full-kit, esa-housing-letter (update), travel-advisory
-- Deactivate 5 old services, create 3 new ones, add variants.

-- ============================================================
-- 1. New category: Professional Services
-- ============================================================
INSERT INTO public.categories (slug, name, description, icon, sort_order)
VALUES ('services', 'Professional Services', 'Travel advisory, consultations, and specialized professional services', 'briefcase', 5);

-- ============================================================
-- 2. Deactivate old services (keep data for FK integrity)
-- ============================================================
UPDATE public.services SET is_active = false, is_featured = false, updated_at = now()
WHERE slug IN ('esa-letter-travel', 'esa-combo-package', 'psd-registration', 'psd-training-guide', 'psd-complete-kit');

-- ============================================================
-- 3. Update esa-letter-housing → match esa_housing_letter spec
-- ============================================================
UPDATE public.services SET
  name = 'ESA Letter: Housing Support Documentation',
  description = 'Licensed mental health professional evaluation via secure video consultation for housing and condo accommodations.',
  features = '["Online video consultation", "Clinical ESA evaluation", "Official ESA Letter issued after assessment", "Housing/Condominium compliance documentation", "Professional guidance during evaluation"]'::jsonb,
  badge_text = 'ESA',
  is_featured = false,
  sort_order = 3,
  updated_at = now()
WHERE slug = 'esa-letter-housing';

-- ============================================================
-- 4. Create new services
-- ============================================================
INSERT INTO public.services (slug, name, description, price, max_price, is_active, is_featured, sort_order, badge_text, features, delivery_type, processing_time, validity_period)
VALUES
  (
    'svan-program',
    'Service Dog Program (SVAN)',
    'Provides identification and supporting documentation for trained service dogs assisting with physical or psychological conditions.',
    359.00, 509.00, true, true, 1, 'SVAN',
    '["Service Dog Identification ID Card", "Official Service Dog Certificate", "Housing Documentation (Housing Form)", "DOT Air Travel Form preparation support", "Relief Certification", "Personalized Service Dog identified harness", "Matching leash", "Complete identification kit"]'::jsonb,
    'both', '5-7 business days', 'Lifetime'
  ),
  (
    'esa-full-kit',
    'Emotional Support Animal (ESA) - Full Kit',
    'Professional evaluation and identification for individuals benefiting from the emotional support of their pet.',
    249.00, 509.00, true, true, 2, 'Full Kit',
    '["Professional evaluation for ESA qualification", "Official ESA letter (post-assessment)", "Personalized ESA Certificate", "Pet Identification ID Card", "Emotional Support identified harness", "Matching leash", "Complete identification kit"]'::jsonb,
    'both', '5-7 business days', '1 year'
  ),
  (
    'travel-advisory',
    'Liberty Paws Travel Advisory',
    'Specialized veterinary guidance for international pet travel requirements and preparation.',
    397.00, 497.00, true, true, 4, 'Featured',
    '["Specialized veterinarian consultation", "Route/Destination case evaluation", "Document review and guidance", "Airlines coordination support", "24-hour initial contact guarantee"]'::jsonb,
    'digital', '24 hours', NULL
  );

-- ============================================================
-- 5. Service <-> Category mappings for new services
-- ============================================================
INSERT INTO public.service_categories (service_id, category_id)
SELECT s.id, c.id FROM public.services s, public.categories c
WHERE (s.slug = 'svan-program' AND c.slug = 'psd')
   OR (s.slug = 'esa-full-kit' AND c.slug = 'esa')
   OR (s.slug = 'travel-advisory' AND c.slug = 'services');

-- ============================================================
-- 6. Service variants
-- ============================================================

-- svan-program: 4 size tiers
INSERT INTO public.service_variants (service_id, slug, name, description, price, is_default, is_active, sort_order)
SELECT s.id, v.slug, v.name, v.description, v.price, v.is_default, true, v.sort_order
FROM public.services s,
(VALUES
  ('small-medium', 'Small / Medium', 'Sizes XXS, XS, S, M', 359.00, true,  0),
  ('large',        'Large',          'Size L',               409.00, false, 1),
  ('xl',           'Extra Large',    'Size XL',              459.00, false, 2),
  ('xxl',          'Double Extra Large', 'Size XXL',         509.00, false, 3)
) AS v(slug, name, description, price, is_default, sort_order)
WHERE s.slug = 'svan-program';

-- esa-full-kit: 5 size tiers
INSERT INTO public.service_variants (service_id, slug, name, description, price, is_default, is_active, sort_order)
SELECT s.id, v.slug, v.name, v.description, v.price, v.is_default, true, v.sort_order
FROM public.services s,
(VALUES
  ('small',  'Small',             'Sizes XXS, XS, S', 249.00, true,  0),
  ('medium', 'Medium',            'Size M',           359.00, false, 1),
  ('large',  'Large',             'Size L',           409.00, false, 2),
  ('xl',     'Extra Large',       'Size XL',          459.00, false, 3),
  ('xxl',    'Double Extra Large', 'Size XXL',        509.00, false, 4)
) AS v(slug, name, description, price, is_default, sort_order)
WHERE s.slug = 'esa-full-kit';

-- travel-advisory: 2 tiers (Standard / Priority)
INSERT INTO public.service_variants (service_id, slug, name, description, price, is_default, is_active, sort_order)
SELECT s.id, v.slug, v.name, v.description, v.price, v.is_default, true, v.sort_order
FROM public.services s,
(VALUES
  ('standard', 'Standard Travel Advisory', 'Individual assessment and general guidance', 397.00, false, 0),
  ('priority', 'Priority Travel Advisory',  'Priority contact, accelerated case review, dedicated support', 497.00, true, 1)
) AS v(slug, name, description, price, is_default, sort_order)
WHERE s.slug = 'travel-advisory';
