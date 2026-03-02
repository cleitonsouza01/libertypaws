-- 00015_registration_number_v2.sql
-- Replace registration number format: LP-TYPE-YYYY-RANDOM → 7-digit numeric (first digit 2-9)

CREATE OR REPLACE FUNCTION public.generate_registration_number(reg_type TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  first_digit INTEGER;
  remaining INTEGER;
  max_attempts INTEGER := 20;
  attempt INTEGER := 0;
BEGIN
  LOOP
    attempt := attempt + 1;
    first_digit := 2 + floor(random() * 8)::INTEGER;  -- 2-9
    remaining := floor(random() * 1000000)::INTEGER;   -- 0-999999
    result := first_digit::TEXT || lpad(remaining::TEXT, 6, '0');

    IF NOT EXISTS (SELECT 1 FROM public.pet_registrations WHERE registration_number = result) THEN
      RETURN result;
    END IF;

    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique registration number after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_registration_number(TEXT) IS 'Generate unique 7-digit numeric registration number (first digit 2-9)';
