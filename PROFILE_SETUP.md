# Profile Page Setup Guide

## Database Setup

You need to create a `profiles` table in your Supabase database. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to automatically create a profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    LOWER(SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add views and likes columns to ideas table if they don't exist
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Create avatar storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Features Included

### ✅ Profile Management
- **Edit Profile**: Update name, username, bio, location, occupation, and website
- **Avatar Upload**: Upload and manage profile pictures with Supabase Storage
- **Profile Stats**: Track ideas submitted, purchased, earnings, views, and likes

### ✅ Ideas Management
- **My Ideas**: View all submitted ideas with status badges (Approved, Pending, Rejected)
- **Purchased Ideas**: Track ideas you've purchased from the marketplace
- **Idea Stats**: See views, likes, and earnings for each idea

### ✅ Activity Timeline
- **Recent Activity**: Track your latest actions (submissions, purchases, likes)
- **Achievements**: Unlock badges for milestones

### ✅ Settings
- **Notification Preferences**: Control email, push, and marketing notifications
- **Account Security**: Change password and manage security settings
- **Sign Out**: Securely log out of your account

### ✅ Responsive Design
- **Mobile-Friendly**: Fully responsive layout that works on all devices
- **Dark Mode**: Seamless dark mode support
- **Smooth Animations**: Framer Motion animations for a premium feel

## Profile Page Sections

### 1. **Profile Header**
- Large avatar with upload functionality
- Name, username, and email
- Bio and personal information
- Join date
- Quick stats (Ideas, Purchases, Earnings, Views, Likes)

### 2. **Overview Tab**
- Recent activity timeline
- Achievements and milestones
- Quick stats overview

### 3. **My Ideas Tab**
- Grid of submitted ideas
- Status badges (Approved/Pending/Rejected)
- View and like counts
- Price and category information

### 4. **Purchased Ideas Tab**
- List of purchased ideas
- Access to purchased content
- Purchase history

### 5. **Settings Tab**
- Notification preferences
- Password change
- Account security
- Sign out option

## Design Features

- **Glassmorphism**: Modern glass-effect cards
- **Gradient Accents**: Purple, teal, and orange color scheme
- **Bento Grid Layout**: Asymmetric, visually interesting layouts
- **Smooth Transitions**: Hover effects and animations
- **Status Badges**: Color-coded status indicators
- **Avatar System**: Fallback initials when no avatar is set

## Navigation

The profile page is accessible from:
1. **User Menu Dropdown** (top right when logged in)
2. **Direct URL**: `/profile`
3. **Mobile Menu**: Profile link in mobile navigation

The profile page is protected - users must be logged in to access it.

## Next Steps

1. Run the SQL commands in your Supabase SQL Editor
2. Test the profile page by logging in and navigating to `/profile`
3. Try editing your profile information
4. Upload an avatar image
5. Submit some ideas to see them appear in "My Ideas"

Enjoy your new comprehensive profile page! 🎉
