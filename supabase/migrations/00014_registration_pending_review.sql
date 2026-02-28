-- 00014_registration_pending_review.sql
-- Add 'pending_review' status to pet_registrations for admin review workflow
-- Flow: purchase → pending_review → admin approves → active → publicly searchable

ALTER TABLE public.pet_registrations
  DROP CONSTRAINT pet_registrations_status_check;

ALTER TABLE public.pet_registrations
  ADD CONSTRAINT pet_registrations_status_check
  CHECK (status IN ('pending_review','active','expired','revoked','suspended'));

ALTER TABLE public.pet_registrations
  ALTER COLUMN status SET DEFAULT 'pending_review';
