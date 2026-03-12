-- 00019_new_service_media.sql
-- Assign images to new services using existing product images

INSERT INTO public.service_media (service_id, url, media_type, alt_text, is_primary, sort_order)
SELECT s.id, v.url, 'image', v.alt_text, true, 0
FROM public.services s
JOIN (VALUES
  ('svan-program',     'images/products/psd-kit.jpg',     'Service Dog Program (SVAN)'),
  ('esa-full-kit',     'images/products/esa-combo.jpg',   'Emotional Support Animal (ESA) - Full Kit'),
  ('travel-advisory',  'images/products/esa-travel.jpg',  'Liberty Paws Travel Advisory')
) AS v(slug, url, alt_text) ON s.slug = v.slug;
