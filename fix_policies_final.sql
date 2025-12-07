-- Final Admin Policy Fixes
-- This script ensures the admin user (idamarketplace@gmail.com) has full access to ALL tables.

-- 1. Create or Replace the is_admin function to be absolutely secure
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) OR (
    auth.jwt() ->> 'email' = 'idamarketplace@gmail.com'
  );
$$;

-- 2. Grant permissions to is_admin function
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated, service_role, anon;

-- 3. Reset RLS policies for Ideas table
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access" ON public.ideas;
DROP POLICY IF EXISTS "Admins can do everything on ideas" ON public.ideas;

CREATE POLICY "Admins can do everything on ideas"
ON public.ideas
FOR ALL
TO authenticated
USING (public.is_admin());

-- 4. Reset RLS policies for Profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;

CREATE POLICY "Admins can do everything on profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin());

-- 5. User Activities Table policies
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything on activities" ON public.user_activities;

CREATE POLICY "Admins can do everything on activities"
ON public.user_activities
FOR ALL
TO authenticated
USING (public.is_admin());

-- 6. Ensure Storage Bucket policies exist (for Evidence bucket)
-- Final Admin Policy Fixes
-- This script ensures the admin user (idamarketplace@gmail.com) has full access to ALL tables.

-- 1. Create or Replace the is_admin function to be absolutely secure
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) OR (
    auth.jwt() ->> 'email' = 'idamarketplace@gmail.com'
  );
$$;

-- 2. Grant permissions to is_admin function
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated, service_role, anon;

-- 3. Reset RLS policies for Ideas table
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access" ON public.ideas;
DROP POLICY IF EXISTS "Admins can do everything on ideas" ON public.ideas;

CREATE POLICY "Admins can do everything on ideas"
ON public.ideas
FOR ALL
TO authenticated
USING (public.is_admin());

-- 4. Reset RLS policies for Profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;

CREATE POLICY "Admins can do everything on profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin());

-- 5. User Activities Table policies
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything on activities" ON public.user_activities;

CREATE POLICY "Admins can do everything on activities"
ON public.user_activities
FOR ALL
TO authenticated
USING (public.is_admin());

-- 6. Ensure Storage Bucket policies exist (for Evidence bucket)
-- Note: Storage policies are often separate, but here is a reminder.
-- You can run this in storage SQL editor if needed, but usually table policies are enough for logic.

-- 7. Grant Role 'admin' to idamarketplace@gmail.com in profiles table explicitly
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'idamarketplace@gmail.com');
