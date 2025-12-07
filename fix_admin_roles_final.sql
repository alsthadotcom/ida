-- STRICTLY FIX ADMIN ROLES
-- Goal: Make 'idamarketplace@gmail.com' the ONLY admin. Demote or Delete others.

-- 1. Promote 'idamarketplace@gmail.com' to 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'idamarketplace@gmail.com');

-- 2. Demote EVERYONE ELSE to 'user' who is currently 'admin'
UPDATE public.profiles
SET role = 'user'
WHERE role = 'admin' 
AND id != (SELECT id FROM auth.users WHERE email = 'idamarketplace@gmail.com');

-- 3. (Optional) If you specifically want to DELETE the old 'ida' user entirely:
-- Uncomment the lines below if you want to completely remove the user 'ida@gmail.com' or 'ida@ida.com'
-- DELETE FROM auth.users WHERE email = 'ida@gmail.com';
-- DELETE FROM auth.users WHERE email = 'ida@ida.com'; 

SELECT auth.users.email, profiles.role FROM profiles 
JOIN auth.users ON profiles.id = auth.users.id;
