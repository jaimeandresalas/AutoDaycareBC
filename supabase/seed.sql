-- ============================================================
-- FULL RESET + SEED: AutoDayCare BC
-- Fixes ALL type mismatches and loads provider data
-- Run this in Supabase SQL Editor (replaces all previous migrations)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── DROP EVERYTHING (clean slate) ───────────────────────────
DROP TABLE IF EXISTS outreach_logs CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS providers CASCADE;
DROP TABLE IF EXISTS parents CASCADE;

-- ════════════════════════════════════════════════════════════
-- 1. PARENTS (Clerk User ID = TEXT, not UUID)
-- ════════════════════════════════════════════════════════════
CREATE TABLE parents (
    id                  TEXT PRIMARY KEY,
    child_name          TEXT NOT NULL,
    child_dob           DATE NOT NULL,
    care_type_needed    TEXT NOT NULL CHECK (care_type_needed IN ('full-time', 'part-time', 'both')),
    expected_start_date DATE NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ════════════════════════════════════════════════════════════
-- 2. PROVIDERS (ID = TEXT to match local app IDs like "d1")
-- ════════════════════════════════════════════════════════════
CREATE TABLE providers (
    id                      TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    phone                   TEXT NOT NULL,
    email                   TEXT,
    city                    TEXT NOT NULL,
    address                 TEXT,
    lat                     NUMERIC(10, 7),
    lng                     NUMERIC(10, 7),
    is_verified             BOOLEAN NOT NULL DEFAULT false,
    total_capacity          INTEGER NOT NULL DEFAULT 0,
    available_spots         INTEGER NOT NULL DEFAULT 0,
    waitlist_length_months  INTEGER,
    care_type_offered       TEXT[] DEFAULT '{}',
    educational_approach    TEXT,
    last_updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ════════════════════════════════════════════════════════════
-- 3. CAMPAIGNS
-- ════════════════════════════════════════════════════════════
CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    campaign_type   TEXT NOT NULL CHECK (campaign_type IN ('initial', 'follow_up')),
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'completed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_parent_id ON campaigns(parent_id);

-- ════════════════════════════════════════════════════════════
-- 4. OUTREACH_LOGS (now with proper TEXT FK to providers)
-- ════════════════════════════════════════════════════════════
CREATE TABLE outreach_logs (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id                 UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    provider_id                 TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    provider_response_status    TEXT NOT NULL DEFAULT 'pending'
                                CHECK (provider_response_status IN (
                                    'pending',
                                    'replied_no_space',
                                    'replied_waitlist',
                                    'replied_space_available'
                                )),
    sent_at                     TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at                TIMESTAMPTZ
);

CREATE INDEX idx_outreach_logs_campaign_id ON outreach_logs(campaign_id);
CREATE INDEX idx_outreach_logs_provider_id ON outreach_logs(provider_id);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════
ALTER TABLE parents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns      ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_logs  ENABLE ROW LEVEL SECURITY;

-- Permissive policies (auth handled by Clerk, not Supabase Auth)
CREATE POLICY "allow_all_parents"        ON parents        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_providers"      ON providers      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_campaigns"      ON campaigns      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_outreach_logs"  ON outreach_logs  FOR ALL USING (true) WITH CHECK (true);

-- ════════════════════════════════════════════════════════════
-- SEED DATA: 20 PROVIDERS (matches lib/data.ts exactly)
-- ════════════════════════════════════════════════════════════

-- ── VERIFIED (4) ────────────────────────────────────────────
INSERT INTO providers (id, name, phone, email, city, lat, lng, is_verified, total_capacity, available_spots, care_type_offered) VALUES
('d1',  'Little Explorers Coquitlam',       '+1-604-555-0101', 'hello@littleexplorers.ca',       'Coquitlam',  49.2838000, -122.7932000, true,  25, 3, '{"full-time","part-time"}'),
('d2',  'Burnaby Montessori Academy',        '+1-604-555-0202', 'admissions@burnabymontessori.ca', 'Burnaby',    49.2488000, -122.9805000, true,  40, 5, '{"full-time"}'),
('d3',  'Port Moody Play & Learn',           '+1-604-555-0303', 'info@pmplaylearn.ca',            'Port Moody', 49.2831000, -122.8317000, true,  15, 1, '{"full-time","part-time"}'),
('d4',  'Metrotown Tiny Tots',               '+1-604-555-0404', 'enroll@metrotowntinytots.ca',    'Burnaby',    49.2263000, -122.9995000, true,  35, 0, '{"full-time"}');

-- ── UNVERIFIED (16) ─────────────────────────────────────────
INSERT INTO providers (id, name, phone, city, lat, lng, is_verified, total_capacity, care_type_offered) VALUES
('d5',  'Coquitlam Centre Childcare',        '+1-604-555-0505', 'Coquitlam',  49.2811000, -122.7963000, false, 20, '{"full-time"}'),
('d6',  'Happy Hearts Burnaby',              '+1-604-555-0606', 'Burnaby',    49.2558000, -122.9723000, false, 12, '{"full-time","part-time"}'),
('d7',  'Heritage Mountain Daycare',         '+1-604-555-0707', 'Port Moody', 49.2991000, -122.8441000, false,  8, '{"full-time"}'),
('d8',  'Brentwood Early Learning',          '+1-604-555-0808', 'Burnaby',    49.2670000, -123.0012000, false, 30, '{"full-time","part-time"}'),
('d9',  'Westwood Plateau Kids',             '+1-604-555-0909', 'Coquitlam',  49.3050000, -122.7840000, false, 10, '{"full-time"}'),
('d10', 'Edmonds Child Care',                '+1-604-555-1010', 'Burnaby',    49.2140000, -122.9490000, false, 22, '{"full-time"}'),
('d11', 'Inlet Centre Preschool',            '+1-604-555-1111', 'Port Moody', 49.2801000, -122.8220000, false, 18, '{"full-time","part-time"}'),
('d12', 'Pinetree Way Daycare',              '+1-604-555-1212', 'Coquitlam',  49.2880000, -122.7830000, false, 16, '{"full-time"}'),
('d13', 'Capitol Hill Playgroup',            '+1-604-555-1313', 'Burnaby',    49.2860000, -123.0030000, false, 14, '{"full-time"}'),
('d14', 'Glenayre Early Childhood',          '+1-604-555-1414', 'Port Moody', 49.2780000, -122.8710000, false, 25, '{"full-time","part-time"}'),
('d15', 'Maillardville French Immersion',    '+1-604-555-1515', 'Coquitlam',  49.2370000, -122.8630000, false, 35, '{"full-time"}'),
('d16', 'Central Park Tots',                 '+1-604-555-1616', 'Burnaby',    49.2310000, -123.0180000, false, 15, '{"full-time"}'),
('d17', 'Newport Village Daycare',           '+1-604-555-1717', 'Port Moody', 49.2830000, -122.8330000, false, 12, '{"full-time","part-time"}'),
('d18', 'Burquitlam Learning Center',        '+1-604-555-1818', 'Coquitlam',  49.2560000, -122.8940000, false, 45, '{"full-time"}'),
('d19', 'Lougheed Town Childcare',           '+1-604-555-1919', 'Burnaby',    49.2530000, -122.8910000, false, 28, '{"full-time"}'),
('d20', 'Austin Heights Kindergarten',       '+1-604-555-2020', 'Coquitlam',  49.2510000, -122.8710000, false, 20, '{"full-time"}');

-- ════════════════════════════════════════════════════════════
-- ✅ DONE! 20 providers seeded. All IDs match lib/data.ts.
-- The full chain now works:
--   parents.id (TEXT) ← Clerk user ID
--   campaigns.parent_id (TEXT) → parents.id
--   outreach_logs.campaign_id (UUID) → campaigns.id
--   outreach_logs.provider_id (TEXT) → providers.id ← ✅ matches "d1","d2",...
-- ════════════════════════════════════════════════════════════
