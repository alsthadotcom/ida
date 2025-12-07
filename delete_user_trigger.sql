-- Trigger to automatically delete the auth user when their public profile is deleted.
-- This ensures "True Deletion" from the database.

-- 1. Create the function
create or replace function public.handle_profile_deletion()
returns trigger as $$
begin
  -- Delete the user from the auth.users table
  -- This requires the function to be SECURITY DEFINER to bypass RLS/privileges
  delete from auth.users where id = old.id;
  return old;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_profile_delete ON public.profiles;

create trigger on_profile_delete
  after delete on public.profiles
  for each row execute procedure public.handle_profile_deletion();
