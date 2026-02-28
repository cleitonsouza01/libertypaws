-- 00012_indexes.sql
-- All additional indexes (FK indexes, composite, partial)
-- Note: PostgreSQL auto-indexes PRIMARY KEYs and UNIQUE constraints,
-- but does NOT auto-index foreign keys.

-- ============================================================
-- PROFILES
-- ============================================================
CREATE INDEX idx_profiles_email ON public.profiles (email);
CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- ============================================================
-- SERVICES
-- ============================================================
CREATE INDEX idx_services_active_sort ON public.services (is_active, sort_order) WHERE is_active = true;
CREATE INDEX idx_services_featured ON public.services (is_featured) WHERE is_featured = true AND is_active = true;

-- ============================================================
-- SERVICE_MEDIA (FK index)
-- ============================================================
CREATE INDEX idx_service_media_service_id ON public.service_media (service_id);

-- ============================================================
-- SERVICE_ADDONS (FK index)
-- ============================================================
CREATE INDEX idx_service_addons_service_id ON public.service_addons (service_id);

-- ============================================================
-- SERVICE_CATEGORIES (FK indexes — composite PK covers service_id, need category_id)
-- ============================================================
CREATE INDEX idx_service_categories_category_id ON public.service_categories (category_id);

-- ============================================================
-- SERVICE_TAGS (FK indexes — composite PK covers service_id, need tag_id)
-- ============================================================
CREATE INDEX idx_service_tags_tag_id ON public.service_tags (tag_id);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE INDEX idx_coupons_active ON public.coupons (is_active, valid_until) WHERE is_active = true;

-- ============================================================
-- ORDERS (FK + query indexes)
-- ============================================================
CREATE INDEX idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX idx_orders_coupon_id ON public.orders (coupon_id) WHERE coupon_id IS NOT NULL;

-- ============================================================
-- ORDER_ITEMS (FK indexes)
-- ============================================================
CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX idx_order_items_service_id ON public.order_items (service_id);

-- ============================================================
-- ORDER_ITEM_ADDONS (FK indexes)
-- ============================================================
CREATE INDEX idx_order_item_addons_order_item_id ON public.order_item_addons (order_item_id);
CREATE INDEX idx_order_item_addons_addon_id ON public.order_item_addons (addon_id);

-- ============================================================
-- ORDER_STATUS_HISTORY (FK index)
-- ============================================================
CREATE INDEX idx_order_status_history_order_id ON public.order_status_history (order_id);

-- ============================================================
-- PAYMENTS (FK + query indexes)
-- ============================================================
CREATE INDEX idx_payments_order_id ON public.payments (order_id);
CREATE INDEX idx_payments_status ON public.payments (status);

-- ============================================================
-- REFUNDS (FK index)
-- ============================================================
CREATE INDEX idx_refunds_payment_id ON public.refunds (payment_id);

-- ============================================================
-- STRIPE_WEBHOOK_EVENTS
-- ============================================================
CREATE INDEX idx_stripe_webhook_events_type ON public.stripe_webhook_events (type);
CREATE INDEX idx_stripe_webhook_events_status ON public.stripe_webhook_events (status) WHERE status != 'processed';

-- ============================================================
-- PET_REGISTRATIONS (FK + search indexes)
-- ============================================================
CREATE INDEX idx_pet_registrations_customer_id ON public.pet_registrations (customer_id);
CREATE INDEX idx_pet_registrations_order_id ON public.pet_registrations (order_id);
CREATE INDEX idx_pet_registrations_public_search ON public.pet_registrations (registration_number)
  WHERE is_public = true AND status = 'active';
CREATE INDEX idx_pet_registrations_status ON public.pet_registrations (status);

-- ============================================================
-- REVIEWS (FK + query indexes)
-- ============================================================
CREATE INDEX idx_reviews_service_published ON public.reviews (service_id, is_published) WHERE is_published = true;
CREATE INDEX idx_reviews_customer_id ON public.reviews (customer_id);

-- ============================================================
-- CONTACT_MESSAGES (query indexes)
-- ============================================================
CREATE INDEX idx_contact_messages_status ON public.contact_messages (status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX idx_contact_messages_customer_id ON public.contact_messages (customer_id) WHERE customer_id IS NOT NULL;
