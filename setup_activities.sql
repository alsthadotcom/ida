-- ============================================
-- USER ACTIVITIES TRACKING SETUP
-- ============================================
-- This creates the activities table and triggers
-- to automatically track user actions
-- ============================================

-- 1. CREATE ACTIVITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'submitted', 'purchased', 'liked', 'viewed'
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  idea_title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON user_activities;

-- Create policies
CREATE POLICY "Users can view their own activities"
  ON user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. CREATE TRIGGER FUNCTION FOR IDEA SUBMISSION
-- ============================================

CREATE OR REPLACE FUNCTION log_idea_submission()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_activities (user_id, activity_type, idea_id, idea_title, description)
  VALUES (
    NEW.user_id,
    'submitted',
    NEW.id,
    NEW.title,
    'Submitted a new idea: ' || NEW.title
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_idea_submitted ON ideas;

-- Create trigger
CREATE TRIGGER on_idea_submitted
  AFTER INSERT ON ideas
  FOR EACH ROW EXECUTE FUNCTION log_idea_submission();

-- 3. HELPER FUNCTION TO LOG ACTIVITIES MANUALLY
-- ============================================

CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_idea_id UUID DEFAULT NULL,
  p_idea_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activities (user_id, activity_type, idea_id, idea_title, description)
  VALUES (p_user_id, p_activity_type, p_idea_id, p_idea_title, p_description)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_activities'
ORDER BY ordinal_position;

-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_idea_submitted';

-- ============================================
-- DONE! 
-- ============================================
-- Activities tracking is now set up!
-- 
-- Activities will be automatically logged when:
-- - User submits an idea (automatic via trigger)
-- 
-- You can manually log activities using:
-- SELECT log_user_activity(
--   auth.uid(),
--   'purchased',
--   idea_id,
--   'Idea Title',
--   'Purchased: Idea Title'
-- );
-- ============================================
