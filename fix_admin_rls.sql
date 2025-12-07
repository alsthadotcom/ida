-- FIX for 500 Errors caused by Infinite Recursion in RLS Policies

-- 1. Create a secure function to check admin status
-- This function runs with SECURITY DEFINER, meaning it bypasses RLS
-- preventing the infinite loop when querying the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on ideas" ON public.ideas;

-- 3. Re-create policies using the safe function

-- Policy for Profiles: Admins can do anything
CREATE POLICY "Admins can do everything on profiles"
ON public.profiles
FOR ALL
USING (
  public.is_admin()
);

-- Policy for Ideas: Admins can do anything
CREATE POLICY "Admins can do everything on ideas"
ON public.ideas
FOR ALL
USING (
  public.is_admin()
);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
