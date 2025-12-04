-- ============================================
-- FIX EVIDENCE_FILES COLUMN TYPE
-- ============================================
-- This fixes the "malformed array literal" error
-- by changing evidence_files from array to TEXT
-- ============================================

-- Check current type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ideas' 
AND column_name = 'evidence_files';

-- Drop the column if it exists as wrong type
ALTER TABLE ideas DROP COLUMN IF EXISTS evidence_files;

-- Re-add as TEXT type
ALTER TABLE ideas ADD COLUMN evidence_files TEXT;

-- Add comment
COMMENT ON COLUMN ideas.evidence_files IS 'Comma-separated URLs of uploaded evidence files (PDF, DOCX, PPT, MP4, etc.)';

-- Verify the change
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'ideas' 
AND column_name = 'evidence_files';

-- ============================================
-- DONE!
-- ============================================
-- The evidence_files column is now TEXT type
-- and will accept comma-separated URLs
-- ============================================
