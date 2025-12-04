# 🚀 COMPLETE SETUP GUIDE - Run in Order

## ⚠️ IMPORTANT: Run SQL Files in This Order!

### Step 1: Create Profiles Table
**File:** `setup_database.sql`

This creates:
- ✅ `profiles` table
- ✅ Row Level Security policies
- ✅ Auto-creation trigger for new users
- ✅ Profiles for existing users

**Run this FIRST in Supabase SQL Editor**

---

### Step 2: Setup File Uploads
**File:** `setup_file_uploads.sql`

This creates:
- ✅ Storage buckets (avatars, idea-files)
- ✅ Storage policies
- ✅ `evidence_files` column in ideas table
- ✅ Additional columns (views, likes, status)

**Run this SECOND in Supabase SQL Editor**

---

### Step 3: Setup Activities Tracking
**File:** `setup_activities.sql`

This creates:
- ✅ `user_activities` table
- ✅ Automatic activity logging trigger
- ✅ Row Level Security policies
- ✅ Helper function for manual logging

**Run this THIRD in Supabase SQL Editor**

---

## 📋 Quick Start Checklist

- [ ] **Step 1:** Open Supabase Dashboard
- [ ] **Step 2:** Go to SQL Editor
- [ ] **Step 3:** Copy entire `setup_database.sql`
- [ ] **Step 4:** Paste and run it
- [ ] **Step 5:** Wait for success ✅
- [ ] **Step 6:** Copy entire `setup_file_uploads.sql`
- [ ] **Step 7:** Paste and run it
- [ ] **Step 8:** Wait for success ✅
- [ ] **Step 9:** Test avatar upload at `/profile`
- [ ] **Step 10:** Test file upload at `/submit-idea`

---

## 🧪 Testing After Setup

### Test 1: Avatar Upload
1. Login to your app
2. Go to `/profile`
3. Hover over avatar
4. Click camera icon
5. Upload an image
6. Should see success toast ✅
7. Avatar should update immediately ✅
8. Refresh page - avatar persists ✅

### Test 2: File Upload
1. Login to your app
2. Go to `/submit-idea`
3. Fill Step 1 (basic info)
4. Go to Step 2
5. Toggle "Has MVP" ON
6. Evidence section appears
7. Click "Browse Files"
8. Select files (PDF, DOCX, etc.)
9. Should see files listed ✅
10. Can remove files with X button ✅
11. Submit idea
12. Files saved to database ✅

---

## 🗄️ What Gets Created

### Tables:
```sql
profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  occupation TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

ideas (
  ... existing columns ...
  evidence_files TEXT,  -- NEW
  views INTEGER,        -- NEW
  likes INTEGER,        -- NEW
  status TEXT          -- NEW
)
```

### Storage Buckets:
```
avatars/
  └── {user_id}/
      └── {filename}

idea-files/
  └── evidence/
      └── {user_id}/
          └── {filename}
```

### Policies:
- ✅ Profiles: Public read, users can update own
- ✅ Avatars: Public read, users can upload/update/delete own
- ✅ Idea Files: Public read, users can upload/update/delete own

---

## ❌ Common Errors & Fixes

### Error: "relation 'profiles' does not exist"
**Fix:** Run `setup_database.sql` first!

### Error: "syntax error at or near 'NOT'"
**Fix:** Use the updated `setup_file_uploads.sql` (already fixed)

### Error: "bucket 'avatars' does not exist"
**Fix:** Run `setup_file_uploads.sql`

### Error: "column 'evidence_files' does not exist"
**Fix:** Run `setup_file_uploads.sql`

---

## 🎯 What Works After Setup

✅ Avatar upload on profile page
✅ Avatar saves permanently to database
✅ Evidence file upload on submit idea page
✅ Multiple file upload support
✅ File validation (type and size)
✅ Files save permanently to database
✅ Profile background is subtle and professional
✅ Toast notifications for feedback
✅ Error handling for invalid files

---

## 📁 File Reference

### SQL Files (Run in Order):
1. `setup_database.sql` - Creates profiles table
2. `setup_file_uploads.sql` - Creates storage and columns

### Documentation:
- `FIXES_SUMMARY.md` - What was fixed
- `FILE_UPLOAD_SETUP.md` - Detailed setup guide
- `QUICK_REFERENCE.md` - Quick testing guide
- `PROFILE_SETUP.md` - Profile page setup

### Code Files (Already Updated):
- `src/pages/Profile.tsx` - Avatar upload
- `src/pages/SubmitIdea.tsx` - File upload

---

## 🚀 Ready to Go!

1. **Run `setup_database.sql`** in Supabase
2. **Run `setup_file_uploads.sql`** in Supabase
3. **Test avatar upload** at `/profile`
4. **Test file upload** at `/submit-idea`

Everything will work perfectly! 🎉

---

## 💡 Pro Tips

- **Avatar uploads:** Just hover and click camera icon
- **File uploads:** Can upload multiple files at once
- **File removal:** Click X button to remove before submitting
- **File size:** Avatars max 5MB, Evidence files max 50MB each
- **Supported types:** 
  - Avatars: JPEG, PNG, GIF, WebP
  - Evidence: DOCX, PDF, PPT, PPTX, MP4, MP3, TXT

---

**Everything is ready! Just run the SQL files in order and test!** ✅
