-- Enable deletion of own messages
create policy "Users can delete their own messages"
on public.messages
for delete
using (auth.uid() = sender_id);
