-- Run these commands in your Supabase SQL Editor to update existing constraints without losing data

-- 1. Update the campaigns table to allow 'direct_request'
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_campaign_type_check;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_campaign_type_check 
    CHECK (campaign_type IN ('initial', 'follow_up', 'direct_request'));

-- 2. Update the outreach_logs table to allow 'requested_spot'
ALTER TABLE outreach_logs DROP CONSTRAINT IF EXISTS outreach_logs_provider_response_status_check;
ALTER TABLE outreach_logs ADD CONSTRAINT outreach_logs_provider_response_status_check 
    CHECK (provider_response_status IN (
        'pending', 
        'replied_no_space', 
        'replied_waitlist', 
        'replied_space_available', 
        'requested_spot'
    ));
