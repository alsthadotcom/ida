# 🔧 GitHub Upload Troubleshooting Guide

## The Problem:
When submitting an idea, it says "Uploading to GitHub" but redirects without actually uploading files or saving to database.

---

## ✅ Step-by-Step Fix:

### Step 1: Open Browser Console
1. **Open your browser** (Chrome/Edge/Firefox)
2. **Press F12** to open Developer Tools
3. **Click on "Console" tab**
4. **Keep it open** while submitting an idea

### Step 2: Submit an Idea
1. Go to `/submit-idea`
2. Fill out the form
3. Upload MVP files
4. Submit the idea
5. **Watch the console messages**

---

## 🔍 What to Look For in Console:

### If You See:
```
VITE_GITHUB_TOKEN is not set in environment variables
```
**FIX:** Your GitHub token is missing!  
**Action:**
1. Open `.env.local` file
2. Make sure it has: `VITE_GITHUB_TOKEN=ghp_your_token_here`
3. **IMPORTANT:** Restart the dev server (`npm run dev`)

---

### If You See:
```
GitHub upload error: Request failed with status code 401
```
**FIX:** Invalid GitHub token!  
**Action:**
1. Create a new token at: https://github.com/settings/tokens
2. Select scope: `repo` (full control)
3. Copy the token
4. Update `.env.local`: `VITE_GITHUB_TOKEN=ghp_NEW_TOKEN_HERE`
5. **Restart dev server**

---

### If You See:
```
GitHub upload error: Request failed with status code 404
```
**FIX:** GitHub username might be wrong or repo already exists!  
**Action:**
1. Check `githubService.ts` line 7
2. Verify `GITHUB_OWNER = 'idaaz'` is correct
3. Try deleting the existing repo if it exists

---

### If You See:
```
Cannot find module '@octokit/rest'
```
**FIX:** Package not installed!  
**Action:**
```bash
npm install @octokit/rest
```

---

## 📝 Expected Console Output (Success):

```
Starting idea submission...
User ID: abc123-def456-...
Uploaded files count: 2
Preparing to upload to GitHub...
Importing GitHub service...
Calling uploadMVPFilesToGitHub...
GitHub repo created: https://github.com/idaaz/abc123-def456-...
File uploaded to GitHub: test.pdf
File uploaded to GitHub: mvp.zip
GitHub upload result: { repoUrl: "...", fileUrls: ["..."] }
GitHub repo URL: https://github.com/idaaz/abc123-def456-...
Creating idea data...
Idea data: { title: "...", githubRepoUrl: "..." }
Saving to Supabase...
Idea created successfully!
Redirecting to marketplace...
```

---

## 🛠️ Quick Fixes:

### Fix 1: Restart Dev Server
After changing `.env.local`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Fix 2: Check Environment Variable
In console, type:
```javascript
console.log(import.meta.env.VITE_GITHUB_TOKEN)
```
Should show your token (starting with `ghp_`)

### Fix 3: Verify Database Columns
Run in Supabase SQL Editor:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'ideas' 
AND column_name IN ('github_repo_url', 'mvp_file_urls');
```
Should return 2 rows.

---

## 🎯 Common Causes:

1. **GitHub token not set** → Most common
2. **Forgot to restart dev server** → After changing .env
3. **Wrong GitHub username** → Check githubService.ts
4. **Database columns missing** → Run the SQL script
5. **Octokit not installed** → Run npm install

---

## 📸 Screenshot the Console!

If it still doesn't work:
1. Open browser console
2. Submit the idea
3. Take a screenshot of the console errors
4. You'll see exactly what's failing!

---

**The detailed logging will show you EXACTLY where it's failing!** 🔍
