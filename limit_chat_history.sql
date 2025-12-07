-- LIMIT CHAT HISTORY TRIGGER
-- Keeps only the last 10 messages per conversation (approx. 5 exchanges)
-- Automatically deletes older messages when a new one is sent.

-- 1. Create the function to delete old messages
CREATE OR REPLACE FUNCTION public.maintain_message_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Limit: Keep last 5 messages PER USER in this conversation
  -- This ensures "5 from sender, 5 from receiver" (Total 10 max)
  
  DELETE FROM public.messages 
  WHERE conversation_id = NEW.conversation_id 
  AND sender_id = NEW.sender_id -- Only delete for the person who just sent a message
  AND id NOT IN (
    SELECT id 
    FROM public.messages 
    WHERE conversation_id = NEW.conversation_id 
    AND sender_id = NEW.sender_id
    ORDER BY created_at DESC 
    LIMIT 5
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trigger_maintain_message_limit ON public.messages;

CREATE TRIGGER trigger_maintain_message_limit
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.maintain_message_limit();
