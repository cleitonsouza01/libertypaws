-- 00011_rls_policies.sql
-- Row Level Security policies for all tables
--
-- Admin check: auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
-- Owner check: table.customer_id = auth.uid()
-- Orders/payments/registrations are INSERTED only by Edge Functions (service_role bypasses RLS)

-- ============================================================
-- Helper: is_admin() for cleaner policy definitions
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================
-- PROFILES
-- ============================================================
-- Users can read their own profile (non-deleted)
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() AND deleted_at IS NULL);

-- Users can update their own profile
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (id = auth.uid());

-- Admins: full access
CREATE POLICY profiles_admin_all ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- CATEGORIES
-- ============================================================
-- Anyone can read active categories
CREATE POLICY categories_select_active ON public.categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Admins: full access
CREATE POLICY categories_admin_all ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- TAGS
-- ============================================================
-- Anyone can read tags
CREATE POLICY tags_select_all ON public.tags
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admins: full access
CREATE POLICY tags_admin_all ON public.tags
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICES
-- ============================================================
-- Anyone can read active services
CREATE POLICY services_select_active ON public.services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Admins: full access
CREATE POLICY services_admin_all ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICE_MEDIA
-- ============================================================
-- Anyone can read service media
CREATE POLICY service_media_select_all ON public.service_media
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admins: full access
CREATE POLICY service_media_admin_all ON public.service_media
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICE_ADDONS
-- ============================================================
-- Anyone can read active addons
CREATE POLICY service_addons_select_active ON public.service_addons
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Admins: full access
CREATE POLICY service_addons_admin_all ON public.service_addons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICE_CATEGORIES (junction)
-- ============================================================
-- Anyone can read
CREATE POLICY service_categories_select_all ON public.service_categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admins: full access
CREATE POLICY service_categories_admin_all ON public.service_categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- SERVICE_TAGS (junction)
-- ============================================================
-- Anyone can read
CREATE POLICY service_tags_select_all ON public.service_tags
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admins: full access
CREATE POLICY service_tags_admin_all ON public.service_tags
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- COUPONS
-- ============================================================
-- Authenticated users can read active coupons (for validation)
CREATE POLICY coupons_select_active ON public.coupons
  FOR SELECT TO authenticated
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Admins: full access
CREATE POLICY coupons_admin_all ON public.coupons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
-- Users can read their own orders
CREATE POLICY orders_select_own ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Admins: full access
CREATE POLICY orders_admin_all ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- ORDER_ITEMS
-- ============================================================
-- Users can read order items for their own orders
CREATE POLICY order_items_select_own ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Admins: full access
CREATE POLICY order_items_admin_all ON public.order_items
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- ORDER_ITEM_ADDONS
-- ============================================================
-- Users can read addons for their own order items
CREATE POLICY order_item_addons_select_own ON public.order_item_addons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.order_items
      JOIN public.orders ON orders.id = order_items.order_id
      WHERE order_items.id = order_item_addons.order_item_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Admins: full access
CREATE POLICY order_item_addons_admin_all ON public.order_item_addons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- ORDER_STATUS_HISTORY
-- ============================================================
-- Users can read history for their own orders
CREATE POLICY order_status_history_select_own ON public.order_status_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_status_history.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Admins: full access
CREATE POLICY order_status_history_admin_all ON public.order_status_history
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- PAYMENTS
-- ============================================================
-- Users can read payments for their own orders
CREATE POLICY payments_select_own ON public.payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Admins: full access
CREATE POLICY payments_admin_all ON public.payments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- REFUNDS
-- ============================================================
-- Users can read refunds for their own payments/orders
CREATE POLICY refunds_select_own ON public.refunds
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.payments
      JOIN public.orders ON orders.id = payments.order_id
      WHERE payments.id = refunds.payment_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Admins: full access
CREATE POLICY refunds_admin_all ON public.refunds
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- STRIPE_WEBHOOK_EVENTS
-- ============================================================
-- No public access — only service_role (Edge Functions)
CREATE POLICY stripe_webhook_events_admin_all ON public.stripe_webhook_events
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- PET_REGISTRATIONS
-- ============================================================
-- Public: anyone can read active + public registrations (for search)
CREATE POLICY pet_registrations_select_public ON public.pet_registrations
  FOR SELECT TO anon, authenticated
  USING (is_public = true AND status = 'active');

-- Users can read all their own registrations
CREATE POLICY pet_registrations_select_own ON public.pet_registrations
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Admins: full access
CREATE POLICY pet_registrations_admin_all ON public.pet_registrations
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- REVIEWS
-- ============================================================
-- Anyone can read published reviews
CREATE POLICY reviews_select_published ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- Users can read their own reviews (even unpublished)
CREATE POLICY reviews_select_own ON public.reviews
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Users can insert reviews
CREATE POLICY reviews_insert_own ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY reviews_update_own ON public.reviews
  FOR UPDATE TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Admins: full access
CREATE POLICY reviews_admin_all ON public.reviews
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- CONTACT_MESSAGES
-- ============================================================
-- Anyone can insert (contact form)
CREATE POLICY contact_messages_insert_anon ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Users can read their own messages
CREATE POLICY contact_messages_select_own ON public.contact_messages
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Admins: full access
CREATE POLICY contact_messages_admin_all ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
