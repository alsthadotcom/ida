-- Add KYC and Credential columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS qualifications TEXT,
ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS kyc_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Create 'certificates' bucket (public for viewing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'certificates',
    'certificates',
    true,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Create 'kyc-documents' bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-documents',
    'kyc-documents',
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE RLS POLICIES - Certificates
-- ============================================

-- Allow authenticated users to upload their own certificates
CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'certificates' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own certificates
CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'certificates' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own certificates
CREATE POLICY "Users can delete their own certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'certificates' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to certificates (for profile viewing)
CREATE POLICY "Public can view certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');

-- ============================================
-- STORAGE RLS POLICIES - KYC Documents
-- ============================================

-- Allow authenticated users to upload their own KYC documents
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'kyc-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view only their own KYC documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'kyc-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all KYC documents (assuming 'admin' role exists)
-- Note: Adjust this policy based on your admin setup
-- CREATE POLICY "Admins can view all KYC documents"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (
--     bucket_id = 'kyc-documents' AND
--     auth.jwt() ->> 'role' = 'admin'
-- );
