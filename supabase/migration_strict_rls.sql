-- ════════════════════════════════════════════════════════════
-- MIGRATION: Strict Privacy Posture (RLS Hardening)
-- Run this in Supabase SQL Editor to lock down your live database.
-- This removes the old permissive policies and enforces strict RLS.
-- ════════════════════════════════════════════════════════════

-- 1. Drop ALL old permissive policies
DROP POLICY IF EXISTS "allow_all_parents"       ON parents;
DROP POLICY IF EXISTS "allow_all_providers"     ON providers;
DROP POLICY IF EXISTS "allow_all_campaigns"     ON campaigns;
DROP POLICY IF EXISTS "allow_all_outreach_logs" ON outreach_logs;

-- 2. Drop the previous "public read" policies (if they exist from a prior migration)
DROP POLICY IF EXISTS "parents_public_read"       ON parents;
DROP POLICY IF EXISTS "campaigns_public_read"     ON campaigns;
DROP POLICY IF EXISTS "outreach_logs_public_read" ON outreach_logs;
DROP POLICY IF EXISTS "providers_public_read"     ON providers;

-- 3. Enable RLS on provider_leads (safe — ignores if already enabled)
ALTER TABLE provider_leads ENABLE ROW LEVEL SECURITY;

-- 4. Create the ONLY public read policy: providers (map/search data)
CREATE POLICY "providers_public_read" ON providers FOR SELECT USING (true);

-- ════════════════════════════════════════════════════════════
-- RESULT:
-- ✅ providers  → public read (map/search)
-- 🔒 parents    → locked (child PII)
-- 🔒 campaigns  → locked (outreach history)
-- 🔒 outreach_logs → locked (contact records)
-- 🔒 provider_leads → locked (business PII)
--
-- All reads/writes on locked tables go through Server Actions
-- using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS safely).
-- ════════════════════════════════════════════════════════════
