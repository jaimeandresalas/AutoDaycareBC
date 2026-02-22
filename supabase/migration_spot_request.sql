-- ============================================================
-- MIGRATION: Update outreach_logs for direct spot requests
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Make campaign_id nullable (direct requests don't belong to a campaign)
ALTER TABLE outreach_logs ALTER COLUMN campaign_id DROP NOT NULL;

-- 2. Drop the old CHECK constraint and add a new one with 'requested_spot'
ALTER TABLE outreach_logs DROP CONSTRAINT IF EXISTS outreach_logs_provider_response_status_check;
ALTER TABLE outreach_logs ADD CONSTRAINT outreach_logs_provider_response_status_check
    CHECK (provider_response_status IN (
        'pending',
        'replied_no_space',
        'replied_waitlist',
        'replied_space_available',
        'requested_spot'
    ));
