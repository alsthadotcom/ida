-- Add github_token column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_token TEXT;

-- Create policy to allow users to update their own github_token
-- (Assuming RLS is enabled and existing policies handle update, but ensuring explicit permission for this column if needed)
-- Standard 'update own profile' policy usually covers all columns, but good to verify.
