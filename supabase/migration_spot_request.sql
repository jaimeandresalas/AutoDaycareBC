-- ============================================================
-- MIGRATION: Update schema for direct spot requests
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add 'direct_request' to campaigns.campaign_type constraint
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_campaign_type_check;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_campaign_type_check
    CHECK (campaign_type IN ('initial', 'follow_up', 'direct_request'));

-- 2. Add 'requested_spot' to outreach_logs.provider_response_status constraint
ALTER TABLE outreach_logs DROP CONSTRAINT IF EXISTS outreach_logs_provider_response_status_check;
ALTER TABLE outreach_logs ADD CONSTRAINT outreach_logs_provider_response_status_check
    CHECK (provider_response_status IN (
        'pending',
        'replied_no_space',
        'replied_waitlist',
        'replied_space_available',
        'requested_spot'
    ));
