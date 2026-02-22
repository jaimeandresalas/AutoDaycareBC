-- ============================================================
-- MIGRATION: Add price_month and next_opening to providers
-- Run this in Supabase SQL Editor AFTER seed.sql
-- ============================================================

ALTER TABLE providers ADD COLUMN IF NOT EXISTS price_month INTEGER NOT NULL DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS next_opening DATE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS contact_method TEXT NOT NULL DEFAULT 'phone_only';

-- Update all 20 providers with price, next_opening, and contact_method
UPDATE providers SET price_month = 1200, next_opening = '2026-08-01', contact_method = 'email'     WHERE id = 'd1';
UPDATE providers SET price_month = 1450, next_opening = '2026-09-01', contact_method = 'email'     WHERE id = 'd2';
UPDATE providers SET price_month = 1100, next_opening = '2026-07-15', contact_method = 'email'     WHERE id = 'd3';
UPDATE providers SET price_month = 1350, next_opening = NULL,         contact_method = 'email'     WHERE id = 'd4';
UPDATE providers SET price_month = 1150, next_opening = '2026-07-01', contact_method = 'phone_only' WHERE id = 'd5';
UPDATE providers SET price_month = 1300, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd6';
UPDATE providers SET price_month = 1100, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd7';
UPDATE providers SET price_month = 1500, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd8';
UPDATE providers SET price_month = 1250, next_opening = '2026-08-01', contact_method = 'phone_only' WHERE id = 'd9';
UPDATE providers SET price_month = 1200, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd10';
UPDATE providers SET price_month = 1050, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd11';
UPDATE providers SET price_month = 1180, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd12';
UPDATE providers SET price_month = 1350, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd13';
UPDATE providers SET price_month = 1150, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd14';
UPDATE providers SET price_month = 1400, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd15';
UPDATE providers SET price_month = 1280, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd16';
UPDATE providers SET price_month = 1220, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd17';
UPDATE providers SET price_month = 1190, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd18';
UPDATE providers SET price_month = 1300, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd19';
UPDATE providers SET price_month = 1150, next_opening = NULL,         contact_method = 'phone_only' WHERE id = 'd20';
