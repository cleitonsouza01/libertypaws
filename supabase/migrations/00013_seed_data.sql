-- 00013_seed_data.sql
-- Seed categories, tags, and 6 services from web/src/data/products.ts

-- ============================================================
-- Categories
-- ============================================================
INSERT INTO public.categories (slug, name, description, icon, sort_order) VALUES
  ('esa',         'Emotional Support Animal', 'ESA letters and documentation for housing and travel accommodations', 'heart',       1),
  ('psd',         'Psychiatric Service Dog',  'PSD registration, training guides, and complete documentation kits',  'shield',      2),
  ('documents',   'Documents & ID Cards',     'Certificates, ID cards, and digital wallet cards',                    'file-text',   3),
  ('accessories', 'Accessories',              'Collars, leashes, vests, and service dog gear',                       'shopping-bag', 4);

-- ============================================================
-- Tags
-- ============================================================
INSERT INTO public.tags (slug, name) VALUES
  ('best-value',  'Best Value'),
  ('housing',     'Housing'),
  ('travel',      'Travel'),
  ('service-dog', 'Service Dog'),
  ('training',    'Training'),
  ('complete',    'Complete'),
  ('popular',     'Popular');

-- ============================================================
-- Services (from products.ts)
-- ============================================================
INSERT INTO public.services (slug, name, description, price, max_price, is_active, is_featured, sort_order, badge_text, features, delivery_type, processing_time, validity_period) VALUES
  (
    'esa-letter-housing',
    'ESA Letter for Housing',
    'Official Emotional Support Animal letter for housing accommodations under the Fair Housing Act.',
    149.00, NULL, true, false, 1, 'Housing',
    '["Valid for 1 year", "Licensed mental health professional", "Fair Housing Act compliant", "Digital & physical copy"]'::jsonb,
    'both', '24-48 hours', '1 year'
  ),
  (
    'esa-letter-travel',
    'ESA Letter for Travel',
    'Documentation for traveling with your Emotional Support Animal on airlines.',
    149.00, NULL, true, false, 2, 'Travel',
    '["Airline approved format", "Licensed professional evaluation", "24-48 hour delivery", "Customer support included"]'::jsonb,
    'digital', '24-48 hours', '1 year'
  ),
  (
    'esa-combo-package',
    'ESA Complete Package',
    'Comprehensive ESA package including housing and travel letters plus ID card.',
    249.00, NULL, true, true, 3, 'Best Value',
    '["Housing & travel letters", "ESA ID card included", "Priority processing", "1 year validity"]'::jsonb,
    'both', '24-48 hours', '1 year'
  ),
  (
    'psd-registration',
    'Psychiatric Service Dog Registration',
    'Official registration for your Psychiatric Service Dog with documentation and ID.',
    79.00, 199.00, true, false, 4, 'Service Dog',
    '["Official registration", "Service dog ID card", "Handler certificate", "Lifetime validity"]'::jsonb,
    'both', '3-5 business days', 'Lifetime'
  ),
  (
    'psd-training-guide',
    'PSD Training & Documentation',
    'Complete training guide and documentation package for Psychiatric Service Dogs.',
    129.00, NULL, true, false, 5, 'Training',
    '["Training curriculum", "Public access guide", "Legal rights handbook", "Ongoing support"]'::jsonb,
    'digital', '24-48 hours', NULL
  ),
  (
    'psd-complete-kit',
    'PSD Complete Kit',
    'Everything you need: registration, ID, vest, and comprehensive documentation.',
    299.00, NULL, true, true, 6, 'Complete',
    '["Full registration", "Official ID card", "Service dog vest", "Complete documentation"]'::jsonb,
    'both', '5-7 business days', 'Lifetime'
  );

-- ============================================================
-- Service <-> Category mappings
-- ============================================================
INSERT INTO public.service_categories (service_id, category_id)
SELECT s.id, c.id FROM public.services s, public.categories c
WHERE (s.slug = 'esa-letter-housing' AND c.slug = 'esa')
   OR (s.slug = 'esa-letter-travel'  AND c.slug = 'esa')
   OR (s.slug = 'esa-combo-package'  AND c.slug = 'esa')
   OR (s.slug = 'psd-registration'   AND c.slug = 'psd')
   OR (s.slug = 'psd-training-guide' AND c.slug = 'psd')
   OR (s.slug = 'psd-complete-kit'   AND c.slug = 'psd');

-- ============================================================
-- Service <-> Tag mappings
-- ============================================================
-- ESA Housing: housing, popular
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'esa-letter-housing' AND t.slug IN ('housing', 'popular');

-- ESA Travel: travel
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'esa-letter-travel' AND t.slug IN ('travel');

-- ESA Combo: best-value, housing, travel, popular
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'esa-combo-package' AND t.slug IN ('best-value', 'housing', 'travel', 'popular');

-- PSD Registration: service-dog
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'psd-registration' AND t.slug IN ('service-dog');

-- PSD Training: training, service-dog
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'psd-training-guide' AND t.slug IN ('training', 'service-dog');

-- PSD Complete Kit: complete, service-dog, popular
INSERT INTO public.service_tags (service_id, tag_id)
SELECT s.id, t.id FROM public.services s, public.tags t
WHERE s.slug = 'psd-complete-kit' AND t.slug IN ('complete', 'service-dog', 'popular');
