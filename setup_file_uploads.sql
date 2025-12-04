-- ============================================
-- FILE UPLOAD SETUP - RUN THIS IN SUPABASE
-- ============================================
-- This SQL sets up storage buckets and policies
-- for avatar and evidence file uploads
-- ============================================

-- 1. CREATE STORAGE BUCKETS
-- ============================================

-- Create avatars bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create idea-files bucket for evidence documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('idea-files', 'idea-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. AVATAR STORAGE POLICIES
-- ============================================
-- Drop existing policies if they exist, then recreate

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. IDEA FILES STORAGE POLICIES
-- ============================================
-- Drop existing policies if they exist, then recreate

DROP POLICY IF EXISTS "Idea files are publicly accessible" ON storage.objects;
CREATE POLICY "Idea files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'idea-files');

DROP POLICY IF EXISTS "Users can upload idea files" ON storage.objects;
CREATE POLICY "Users can upload idea files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'idea-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

DROP POLICY IF EXISTS "Users can update their idea files" ON storage.objects;
CREATE POLICY "Users can update their idea files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'idea-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

DROP POLICY IF EXISTS "Users can delete their idea files" ON storage.objects;
CREATE POLICY "Users can delete their idea files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'idea-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- 4. DATABASE SCHEMA UPDATES
-- ============================================

-- Add evidence_files column to ideas table
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS evidence_files TEXT;

-- Add comment for documentation
COMMENT ON COLUMN ideas.evidence_files IS 'Comma-separated URLs of uploaded evidence files (PDF, DOCX, PPT, MP4, etc.)';

-- Add views and likes columns if they don't exist (for profile stats)
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly

-- Check storage buckets
SELECT * FROM storage.buckets WHERE id IN ('avatars', 'idea-files');

-- Check storage policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%avatar%' OR policyname LIKE '%idea%';

-- Check ideas table columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'ideas' 
AND column_name IN ('evidence_files', 'views', 'likes', 'status');

-- ============================================
-- DONE! 
-- ============================================
-- Your file upload system is now ready to use!
-- 
-- Test it:
-- 1. Go to /profile and upload an avatar
-- 2. Go to /submit-idea and upload evidence files
-- 
-- Storage paths:
-- - Avatars: avatars/{user_id}/{filename}
-- - Evidence: idea-files/evidence/{user_id}/{filename}
-- ============================================
