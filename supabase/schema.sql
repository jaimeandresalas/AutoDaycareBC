-- ============================================================
-- AutoDayCare BC — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. PARENTS (User Profile, linked to Clerk User ID)
-- ────────────────────────────────────────────────────────────
CREATE TABLE parents (
    id                  TEXT PRIMARY KEY,                         -- Maps to Clerk user_id (string, not UUID)
    child_name          TEXT NOT NULL,
    child_dob           DATE NOT NULL,
    care_type_needed    TEXT NOT NULL CHECK (care_type_needed IN ('full-time', 'part-time', 'both')),
    expected_start_date DATE NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. PROVIDERS (Daycare Profile)
-- ────────────────────────────────────────────────────────────
CREATE TABLE providers (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    care_type_offered       TEXT[] DEFAULT '{}',                  -- Array: {'full-time','part-time'}
    educational_approach    TEXT,
    last_updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. CAMPAIGNS (Parent's Outreach Action)
-- ────────────────────────────────────────────────────────────
CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    campaign_type   TEXT NOT NULL CHECK (campaign_type IN ('initial', 'follow_up')),
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'completed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_parent_id ON campaigns(parent_id);

-- ────────────────────────────────────────────────────────────
-- 4. OUTREACH_LOGS (Individual messages per campaign)
-- ────────────────────────────────────────────────────────────
CREATE TABLE outreach_logs (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id                 UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    provider_id                 UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
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

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ── Enable RLS on all tables ────────────────────────────────
ALTER TABLE parents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns      ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_logs  ENABLE ROW LEVEL SECURITY;

-- ── PARENTS: Users can only manage their own profile ────────
CREATE POLICY "Users can view own profile"
    ON parents FOR SELECT
    USING (id = auth.uid()::text);

CREATE POLICY "Users can insert own profile"
    ON parents FOR INSERT
    WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Users can update own profile"
    ON parents FOR UPDATE
    USING (id = auth.uid()::text)
    WITH CHECK (id = auth.uid()::text);

-- ── PROVIDERS: All authenticated users can read providers ───
CREATE POLICY "Authenticated users can read providers"
    ON providers FOR SELECT
    TO authenticated
    USING (true);

-- Providers can update their own listing (when claimed via verification)
CREATE POLICY "Verified providers can update own listing"
    ON providers FOR UPDATE
    TO authenticated
    USING (is_verified = true)
    WITH CHECK (is_verified = true);

-- ── CAMPAIGNS: Users manage their own campaigns ─────────────
CREATE POLICY "Users can view own campaigns"
    ON campaigns FOR SELECT
    USING (parent_id = auth.uid()::text);

CREATE POLICY "Users can create own campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (parent_id = auth.uid()::text);

CREATE POLICY "Users can update own campaigns"
    ON campaigns FOR UPDATE
    USING (parent_id = auth.uid()::text)
    WITH CHECK (parent_id = auth.uid()::text);

-- ── OUTREACH_LOGS: Users can read logs for their campaigns ──
CREATE POLICY "Users can view own outreach logs"
    ON outreach_logs FOR SELECT
    USING (
        campaign_id IN (
            SELECT id FROM campaigns WHERE parent_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create outreach logs for own campaigns"
    ON outreach_logs FOR INSERT
    WITH CHECK (
        campaign_id IN (
            SELECT id FROM campaigns WHERE parent_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own outreach logs"
    ON outreach_logs FOR UPDATE
    USING (
        campaign_id IN (
            SELECT id FROM campaigns WHERE parent_id = auth.uid()::text
        )
    )
    WITH CHECK (
        campaign_id IN (
            SELECT id FROM campaigns WHERE parent_id = auth.uid()::text
        )
    );
