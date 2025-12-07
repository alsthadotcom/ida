-- FIX PROFILES DATA AND SCHEMA
-- Run this in Supabase SQL Editor to fix "User" showing up in chat

-- 1. Ensure email column exists in profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update existing profiles with emails from auth.users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id
AND profiles.email IS NULL;

-- 3. Insert MISSING profiles from auth.users
-- This fixes users who signed up before profiles existed or if trigger failed
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', substring(email from '^[^@]+')), -- Fallback to email username if no full_name
    'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 4. Update the trigger to auto-save email for NEW users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', substring(NEW.email from '^[^@]+')),
    NEW.email, 
    'user'
  );
  RETURN NEW;
END;
$$;
