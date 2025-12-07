-- Add 'banned' column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false;

-- Add 'status' check constraint to ideas if not exists (or just rely on text)
-- If status is just text, we don't strictly need a constraint, but good to know standard values: 
-- 'New', 'Approved', 'Rejected', 'Featured'

-- RLS Policies to allow Admins full access
-- Note: You might need to enable RLS first if not enabled: ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Policy for Ideas: Admins can do anything
CREATE POLICY "Admins can do everything on ideas"
ON public.ideas
FOR ALL
USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Policy for Profiles: Admins can delete/update other profiles
CREATE POLICY "Admins can do everything on profiles"
ON public.profiles
FOR ALL
USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
