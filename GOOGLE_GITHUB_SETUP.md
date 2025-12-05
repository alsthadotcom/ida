# 🚀 Google OAuth + GitHub Integration Setup Guide

## Part 1: Google OAuth Setup (Supabase)

### Step 1: Enable Google Provider in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Authentication → Providers
4. **Find Google** in the list
5. **Toggle ON** the Google provider
6. **Copy the Redirect URL** (you'll need this for Google Console)
   - Example: `https://apwxfppvaadsiiavgwxh.supabase.co/auth/v1/callback`

### Step 2: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable APIs**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. **Create OAuth Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - **Name**: "IDA Marketplace" (or your app name)
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:5173` (for development)
     - Add: `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - Add the Supabase callback URL from Step 1
     - Example: `https://apwxfppvaadsiiavgwxh.supabase.co/auth/v1/callback`
   - Click **Create**
5. **Copy**:
   - Client ID
   - Client Secret

### Step 3: Configure Supabase with Google Credentials

1. **Return to Supabase Dashboard** → Authentication → Providers → Google
2. **Paste**:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
3. **Click Save**

### Step 4: Test Google Login

1. Run your app: `npm run dev`
2. Go to `/login` or `/signup`
3. Click "Sign in with Google" button
4. Should redirect to Google login
5. After successful login, redirects back to your app
6. ✅ **Done!** User is authenticated

---

## Part 2: GitHub Integration Setup

### Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. **Token name**: "IDA Marketplace MVP Storage"
4. **Expiration**: No expiration (or set custom)
5. **Select scopes**:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
6. **Click**: Generate token
7. **Copy the token** (You won't be able to see it again!)
8. **IMPORTANT**: Store it securely!

### Step 2: Add Token to Environment Variables

1. **Create/Edit** `.env.local` in your project root:
   ```
   VITE_GITHUB_TOKEN=ghp_your_token_here
   ```
2. ⚠️ **NEVER commit this file to Git!**
3. Check that `.env.local` is in your `.gitignore`

### Step 3: Install Octokit Package

Run this command:
```bash
npm install @octokit/rest
```

If you get a PowerShell execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry the npm install.

### Step 4: How GitHub Integration Works

When a user submits an idea with MVP files:

1. **Repo Creation**: A GitHub repo is created with the user's UID as the name
   - Example: `https://github.com/idaaz/abc123-user-uid`
2. **File Upload**: MVP files are uploaded to the repo under `/mvp-files/`
3. **Storage in Supabase**: The GitHub repo URL is saved to the `ideas` table
4. **Access**: Buyers can clone/download the repo after purchase

---

## Part 3: Integration with Submit Idea Page

### How to Use GitHub Service

```typescript
import { uploadMVPFilesToGitHub } from '@/services/githubService';

// In your submit handler
const { repoUrl, fileUrls } = await uploadMVPFilesToGitHub(
  user.id,  // User's UID (will be repo name)
  formData.title,  // Idea title (repo description)
  mvpFiles  // Array of File objects
);

// Save to Supabase
await supabase.from('ideas').insert({
  ...ideaData,
  github_repo_url: repoUrl,
  mvp_file_urls: fileUrls.join(',')
});
```

---

## 📝 Database Schema Update

Add this column to your `ideas` table:

```sql
-- Add GitHub repo URL column
ALTER TABLE ideas ADD COLUMN github_repo_url TEXT;

-- Optionally add file URLs column
ALTER TABLE ideas ADD COLUMN mvp_file_urls TEXT;
```

---

## ✅ Verification Checklist

### Google OAuth:
- [ ] Google provider enabled in Supabase
- [ ] OAuth credentials created in Google Cloud Console
- [ ] Redirect URL configured correctly
- [ ] Client ID and Secret added to Supabase
- [ ] Tested login/signup with Google button
- [ ] User data appears in Supabase Auth

### GitHub Integration:
- [ ] Personal Access Token created with `repo` scope
- [ ] Token added to `.env.local` as `VITE_GITHUB_TOKEN`
- [ ] Octokit package installed (`@octokit/rest`)
- [ ] GitHub service file created (`src/services/githubService.ts`)
- [ ] Database column `github_repo_url` added
- [ ] Test repo creation works

---

## 🎯 Current Architecture

```
┌─────────────────────────────────────┐
│         User Authentication         │
│    ✅ Supabase Auth + Google OAuth  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Idea Metadata Storage       │
│      ✅ Supabase Database (ideas)   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│       MVP File Storage (Large)      │
│  ✅ GitHub Repos (Named by User UID)│
└─────────────────────────────────────┘
```

---

## 🚨 Important Notes

1. **Rate Limits**: GitHub API has rate limits (5,000 requests/hour for authenticated users)
2. **File Size**: Each GitHub repo should stay under 1GB total
3. **Privacy**: Repos are public by default. Set `private: true` in `createGitHubRepo()` for private repos (requires paid GitHub account for unlimited private repos)
4. **Security**: Never expose your GitHub token in client-side code or commit it to Git

---

## 🛠 Troubleshooting

### Google OAuth not working?
- Check redirect URL matches exactly between Google Console and Supabase
- Ensure Google+ API is enabled
- Check browser console for errors
- Try in incognito mode (clears cache)

### GitHub Integration not working?
- Verify token has `repo` scope
- Check token is correctly set in `.env.local` with `VITE_` prefix
- Ensure Octokit is installed
- Check GitHub username is correct in `githubService.ts` (currently set to 'idaaz')
- Verify your token hasn't expired

### Files not uploading?
- Check file encoding (must be base64)
- Verify file path doesn't have invalid characters
- Check GitHub API response in browser console
- Ensure repo exists before uploading files

---

**Everything is set up! You can now:**
1. ✅ Login with Google
2. ✅ Store MVP files in GitHub repos named by user UID
3. ✅ Keep metadata in Supabase

**All for FREE!** 🎉
