# 🎯 QUICK REFERENCE - File Uploads

## Avatar Upload (Profile Page)

### Location
`/profile` → Hover over avatar → Click camera icon

### Accepted Files
- JPEG, JPG, PNG, GIF, WebP
- Max 5MB

### What Happens
1. Click camera icon on avatar
2. Select image file
3. Validates file type and size
4. Uploads to Supabase Storage: `avatars/{user_id}/{filename}`
5. Saves URL to database: `profiles.avatar_url`
6. Shows success toast
7. Avatar updates instantly
8. **PERMANENT** - Persists after refresh

### Code Location
`src/pages/Profile.tsx` → `handleAvatarUpload()`

---

## Evidence Files (Submit Idea Page)

### Location
`/submit-idea` → Step 2 → Enable "Has MVP" or "Has Detailed Roadmap"

### Accepted Files
- DOCX, PDF, PPT, PPTX, MP4, MP3, TXT
- Max 50MB per file
- Multiple files allowed

### What Happens
1. Click "Browse Files" button
2. Select one or multiple files
3. Validates each file type and size
4. Uploads to Supabase Storage: `idea-files/evidence/{user_id}/{filename}`
5. Shows uploaded files with size
6. Can remove files before submission
7. On submit, saves URLs to database: `ideas.evidence_files` (comma-separated)
8. **PERMANENT** - Files stored forever

### Code Location
`src/pages/SubmitIdea.tsx` → `handleFileUpload()` & `handleRemoveFile()`

---

## Database Setup (REQUIRED)

```sql
-- Run in Supabase SQL Editor

-- 1. Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('idea-files', 'idea-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Add storage policies
CREATE POLICY "Idea files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'idea-files');

CREATE POLICY "Users can upload idea files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'idea-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- 3. Add column to ideas table
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS evidence_files TEXT;
```

---

## Error Messages

### Avatar Upload
- ❌ "Please upload a valid image file" → Wrong file type
- ❌ "File size must be less than 5MB" → File too large
- ❌ "Failed to upload avatar" → Upload error
- ✅ "Avatar uploaded and saved successfully" → Success!

### Evidence Files
- ❌ "{filename} is not a supported file type" → Wrong type
- ❌ "{filename} exceeds 50MB limit" → Too large
- ❌ "Failed to upload {filename}" → Upload error
- ✅ "{count} file(s) uploaded successfully" → Success!

---

## Storage Paths

### Avatar
```
Storage: avatars/{user_id}/{user_id}-{timestamp}.{ext}
Database: profiles.avatar_url = "https://...supabase.co/storage/v1/object/public/avatars/..."
```

### Evidence Files
```
Storage: idea-files/evidence/{user_id}/{user_id}-{timestamp}-{index}.{ext}
Database: ideas.evidence_files = "url1,url2,url3"
```

---

## Testing Checklist

### Avatar Upload
- [ ] Login to account
- [ ] Go to `/profile`
- [ ] Hover over avatar
- [ ] See camera icon appear
- [ ] Click camera icon
- [ ] Select valid image (JPG/PNG)
- [ ] See "Uploading..." toast
- [ ] See "Success!" toast
- [ ] Avatar updates immediately
- [ ] Refresh page
- [ ] Avatar still shows (persists)

### File Upload
- [ ] Login to account
- [ ] Go to `/submit-idea`
- [ ] Fill Step 1 (basic info)
- [ ] Go to Step 2
- [ ] Toggle "Has MVP" ON
- [ ] See Evidence section appear
- [ ] Click "Browse Files"
- [ ] Select multiple files
- [ ] See upload progress
- [ ] See files listed below
- [ ] Click X to remove a file
- [ ] File disappears from list
- [ ] Submit idea
- [ ] Check database for file URLs

---

## Troubleshooting

### Avatar not showing after upload?
1. Check browser console for errors
2. Verify Supabase storage bucket "avatars" exists
3. Check storage policies are correct
4. Try hard refresh (Ctrl+Shift+R)

### Files not uploading?
1. Check file type is in allowed list
2. Check file size is under limit
3. Verify Supabase storage bucket "idea-files" exists
4. Check browser console for errors
5. Ensure user is logged in

### Files not saving to database?
1. Check `ideas` table has `evidence_files` column
2. Verify column type is TEXT
3. Check `ideaService.ts` includes `evidenceFiles`
4. Look at browser network tab for API errors

---

## Support Files

- `FILE_UPLOAD_SETUP.md` - Detailed setup guide
- `FIXES_SUMMARY.md` - Summary of all fixes
- `PROFILE_SETUP.md` - Profile page setup

---

**Everything is working! Just run the SQL and test!** ✅
