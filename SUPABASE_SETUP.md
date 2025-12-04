# Supabase Database Setup

## Step 1: Create Ideas Table

Go to your Supabase project dashboard and run this SQL:

```sql
-- Create ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  seller TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Scores
  uniqueness INTEGER DEFAULT 0,
  execution_readiness INTEGER DEFAULT 0,
  clarity_score INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  
  -- Flags
  has_mvp BOOLEAN DEFAULT FALSE,
  is_raw_idea BOOLEAN DEFAULT TRUE,
  has_detailed_roadmap BOOLEAN DEFAULT FALSE,
  investment_ready BOOLEAN DEFAULT FALSE,
  looking_for_partner BOOLEAN DEFAULT FALSE,
  
  -- Details
  target_audience TEXT,
  region_feasibility TEXT,
  market_potential TEXT,
  type_of_topic TEXT,
  
  -- Evidence
  evidence_files TEXT[],
  evidence_note TEXT,
  
  -- Metadata  
  status TEXT DEFAULT 'New',
  color TEXT DEFAULT 'primary',
  variant TEXT DEFAULT 'normal',
  badge TEXT DEFAULT 'new',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_ideas_slug ON ideas(slug);

-- Create index on created_at for sorting
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);

-- Create index on views for featured ideas
CREATE INDEX idx_ideas_views ON ideas(views DESC);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view ideas
CREATE POLICY "Ideas are viewable by everyone" 
ON ideas FOR SELECT 
USING (true);

-- Policy: Authenticated users can insert ideas
CREATE POLICY "Authenticated users can insert ideas" 
ON ideas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own ideas
CREATE POLICY "Users can update their own ideas" 
ON ideas FOR UPDATE 
USING (auth.uid() = user_id);
```

## Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **Create bucket**
3. Name it: `idea-evidence`
4. Make it **public** (so files can be accessed)
5. Click **Create bucket**

## Step 3: Set Storage Policies

Click on the `idea-evidence` bucket, then **Policies**, then add:

```sql
-- Anyone can view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'idea-evidence');

-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'idea-evidence' 
  AND auth.role() = 'authenticated'
);
```

## Step 4: Verify Setup

Your Supabase project is already configured in `src/lib/supabase.ts` with:
- URL: `https://apwxfppvaadsiiavgwxh.supabase.co`
- Anon key: Already configured

## Step 5: Test the Integration

Once the tables are created, you can:
1. Submit a test idea through the form
2. See it appear in the Marketplace  
3. Click to view details
4. Test Buy and Demo flows

The app will now use real data from Supabase instead of hardcoded values!
