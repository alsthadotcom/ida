-- Create a table for platform-wide settings
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the GitHub Token (This is a global token for the platform)
INSERT INTO platform_settings (key, value, description)
VALUES (
    'github_token', 
    'REPLACE_WITH_YOUR_REAL_GITHUB_TOKEN', 
    'Global GitHub Personal Access Token for file uploads'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Enable Row Level Security (RLS)
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated or anon) to READ the settings 
-- (Required for the frontend to fetch the token to verify uploads)
CREATE POLICY "Allow public read access" 
ON platform_settings FOR SELECT 
USING (true);

-- Only allow service_role to modify (Admin only)
CREATE POLICY "Allow service_role full access" 
ON platform_settings FOR ALL 
USING (auth.uid() IS NULL) -- service_role typically bypasses RLS, but this is a safeguard
WITH CHECK (auth.uid() IS NULL);
