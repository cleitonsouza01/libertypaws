-- 00016_seed_service_media.sql
-- Seed service_media rows with image paths for each service
-- Fix is_featured for esa-letter-housing (popular in mocked data)

-- ============================================================
-- Fix: esa-letter-housing should be featured (was popular: true)
-- ============================================================
UPDATE public.services
SET is_featured = true
WHERE slug = 'esa-letter-housing';

-- ============================================================
-- Service Media (primary card images)
-- ============================================================
INSERT INTO public.service_media (service_id, url, media_type, alt_text, is_primary, sort_order)
SELECT s.id, v.url, 'image', v.alt_text, true, 0
FROM public.services s
JOIN (VALUES
  ('esa-letter-housing',  'images/products/esa-housing.jpg',      'ESA Letter for Housing'),
  ('esa-letter-travel',   'images/products/esa-travel.jpg',       'ESA Letter for Travel'),
  ('esa-combo-package',   'images/products/esa-combo.jpg',        'ESA Complete Package'),
  ('psd-registration',    'images/products/psd-registration.jpg', 'Psychiatric Service Dog Registration'),
  ('psd-training-guide',  'images/products/psd-training.jpg',     'PSD Training & Documentation'),
  ('psd-complete-kit',    'images/products/psd-kit.jpg',          'PSD Complete Kit')
) AS v(slug, url, alt_text) ON s.slug = v.slug;
