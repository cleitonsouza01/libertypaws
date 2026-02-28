-- 00009_functions.sql
-- Database functions: order numbers, registration numbers, triggers, auth hooks

-- ============================================================
-- Generic updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at() IS 'Generic trigger function to auto-set updated_at on row update';

-- ============================================================
-- Auto-create profile on auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, locale)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'locale', 'en')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-create profile row when a new auth user signs up';

-- ============================================================
-- Sync profile email when auth.users email changes
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles
    SET email = NEW.email, updated_at = now()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.sync_profile_email() IS 'Keep profiles.email in sync when auth.users.email changes';

-- ============================================================
-- Generate order number (sequence-based, atomic)
-- Format: LP-{YEAR}-{PADDED_SEQ} e.g. LP-2026-00001
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  seq_val := nextval('public.order_number_seq');
  RETURN 'LP-' || EXTRACT(YEAR FROM now())::TEXT || '-' || lpad(seq_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_order_number() IS 'Atomic order number generation: LP-YYYY-NNNNN';

-- ============================================================
-- Generate registration number (random with collision retry)
-- Format: LP-{TYPE}-{YEAR}-{RANDOM6} e.g. LP-ESA-2026-A1B2C3
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_registration_number(reg_type TEXT)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no I/O/0/1 to avoid confusion
  result TEXT;
  random_part TEXT;
  i INTEGER;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  LOOP
    attempt := attempt + 1;
    random_part := '';
    FOR i IN 1..6 LOOP
      random_part := random_part || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    result := 'LP-' || upper(reg_type) || '-' || EXTRACT(YEAR FROM now())::TEXT || '-' || random_part;

    -- Check for collision
    IF NOT EXISTS (SELECT 1 FROM public.pet_registrations WHERE registration_number = result) THEN
      RETURN result;
    END IF;

    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique registration number after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_registration_number(TEXT) IS 'Generate unique registration number with collision retry: LP-TYPE-YYYY-RANDOM';

-- ============================================================
-- Validate order status transitions (state machine)
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  valid_transitions JSONB := '{
    "pending":    ["paid", "cancelled", "failed"],
    "paid":       ["processing", "cancelled", "refunded"],
    "processing": ["shipped", "completed", "cancelled", "refunded"],
    "shipped":    ["delivered", "completed"],
    "delivered":  ["completed"],
    "completed":  ["refunded"],
    "cancelled":  [],
    "refunded":   [],
    "failed":     ["pending"]
  }'::jsonb;
  allowed JSONB;
BEGIN
  -- Skip validation on INSERT
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Skip if status hasn't changed
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  allowed := valid_transitions -> OLD.status;

  IF allowed IS NULL OR NOT (allowed ? NEW.status) THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  END IF;

  -- Auto-set completed_at
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.validate_order_status_transition() IS 'Enforce valid order status state machine transitions';

-- ============================================================
-- Log order status changes to history
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.log_order_status_change() IS 'Auto-insert into order_status_history on status change';
