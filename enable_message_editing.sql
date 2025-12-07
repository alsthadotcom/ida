-- ENABLE MESSAGE EDITING
-- Allow users to update the 'content' of their own messages

create policy "Users can update their own messages"
on public.messages
for update
to authenticated
using (auth.uid() = sender_id)
with check (auth.uid() = sender_id);
