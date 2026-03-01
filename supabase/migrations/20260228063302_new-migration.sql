-- Migration: Map old rental-focused statuses to new flipping-focused statuses
-- Date: 2026-02-28
-- Description: Handles the architectural pivot from rental management to flipping workflow

-- Step 1: Add a temporary column to store old values
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status_old TEXT;

-- Step 2: Copy current status values to temp column
UPDATE properties SET status_old = status;

-- Step 3: Map old statuses to new statuses
-- Old (rental) → New (flipping):
--   AVAILABLE → NEW_LEAD
--   UNDER_RENOVATION → ACTIVE_REHAB  
--   SOLD → CLOSED
--   OFF_MARKET → ARCHIVED
UPDATE properties SET status = CASE 
    WHEN status_old = 'AVAILABLE' THEN 'NEW_LEAD'
    WHEN status_old = 'UNDER_RENOVATION' THEN 'ACTIVE_REHAB'
    WHEN status_old = 'SOLD' THEN 'CLOSED'
    WHEN status_old = 'OFF_MARKET' THEN 'ARCHIVED'
    WHEN status_old IS NULL OR status_old = '' THEN 'NEW_LEAD'
    ELSE status_old  -- Keep value if already using new enum
END;

-- Step 4: Drop the temporary column
ALTER TABLE properties DROP COLUMN status_old;

-- Step 5: Add comment documenting the change
COMMENT ON TABLE properties IS 'Property status enum migrated from rental-focused (AVAILABLE, UNDER_RENOVATION, SOLD, OFF_MARKET) to flipping-focused (NEW_LEAD, UNDERWRITING, OFFER_PENDING, UNDER_CONTRACT, ACTIVE_REHAB, LISTED, CLOSED, ARCHIVED) on 2026-02-28';