-- 1. Add 'role' column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Update the specific user to be admin
-- Note: This assumes the user 'idamarketplace@gmail.com' already exists in auth.users and public.profiles.
-- If the user signs up AFTER this script is run, they will get the default 'user' role.
-- You might need to run the UPDATE part again after signing up.

UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'idamarketplace@gmail.com'
);

-- 3. Verify
SELECT * FROM public.profiles WHERE role = 'admin';
