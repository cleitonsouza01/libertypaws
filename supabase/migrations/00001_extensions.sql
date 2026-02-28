-- 00001_extensions.sql
-- Enable required PostgreSQL extensions

CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid(), crypt(), gen_salt()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Trigram similarity for fuzzy text search
