-- FORCE CLEANUP OF OLD MESSAGES
-- Run this once to clean up all existing conversations to the "5 per user" limit.

DELETE FROM public.messages m1
WHERE id NOT IN (
  SELECT id 
  FROM public.messages m2
  WHERE m2.conversation_id = m1.conversation_id 
  AND m2.sender_id = m1.sender_id
  ORDER BY m2.created_at DESC 
  LIMIT 5
);
