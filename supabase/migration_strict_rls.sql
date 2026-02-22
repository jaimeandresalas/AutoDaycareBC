-- ════════════════════════════════════════════════════════════
-- MIGRATION: Strict RLS Policies
-- Run this in Supabase SQL Editor to harden your live database.
-- This replaces the old permissive allow_all_* policies.
-- ════════════════════════════════════════════════════════════

-- 1. Drop old permissive policies
DROP POLICY IF EXISTS "allow_all_parents"       ON parents;
DROP POLICY IF EXISTS "allow_all_providers"     ON providers;
DROP POLICY IF EXISTS "allow_all_campaigns"     ON campaigns;
DROP POLICY IF EXISTS "allow_all_outreach_logs" ON outreach_logs;

-- 2. Enable RLS on provider_leads (if not already enabled)
ALTER TABLE provider_leads ENABLE ROW LEVEL SECURITY;

-- 3. Create strict read-only policies for the anon key
CREATE POLICY "providers_public_read"     ON providers      FOR SELECT USING (true);
CREATE POLICY "parents_public_read"       ON parents        FOR SELECT USING (true);
CREATE POLICY "campaigns_public_read"     ON campaigns      FOR SELECT USING (true);
CREATE POLICY "outreach_logs_public_read" ON outreach_logs  FOR SELECT USING (true);

-- provider_leads: NO public access at all (reads and writes blocked for anon)
-- All operations go through the service-role key in Next.js Server Actions.

-- ════════════════════════════════════════════════════════════
-- ✅ DONE! RLS is now strict.
-- Anon key = read-only on providers, parents, campaigns, outreach_logs.
-- Service Role Key = full access (used by Server Actions only).
-- ════════════════════════════════════════════════════════════
