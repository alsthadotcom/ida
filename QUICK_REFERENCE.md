# 🚀 Quick Reference Card

## What You Got

### ✅ Google OAuth Login
**Files**: `Login.tsx`, `Signup.tsx`  
**Button**: "Sign in with Google" (with Google logo)  
**Provider**: Supabase Auth → Google OAuth

### ✅ GitHub MVP Storage
**File**: `src/services/githubService.ts`  
**Username**: `idaaz`  
**Repo Naming**: User UID (e.g., `abc123-user-id`)  
**Folder Structure**: `/mvp-files/filename.ext`

---

## Setup Checklist

### Google OAuth (5 minutes):
1. [ ] Open Supabase Dashboard
2. [ ] Auth → Providers → Enable Google
3. [ ] Copy callback URL
4. [ ] Google Cloud Console → Create OAuth Client
5. [ ] Paste Client ID + Secret in Supabase
6. [ ] Test: Click Google button

### GitHub Integration (3 minutes):
1. [ ] GitHub Settings → Tokens → Create new
2. [ ] Select scope: `repo`
3. [ ] Copy token
4. [ ] Add to `.env.local`: `VITE_GITHUB_TOKEN=ghp_...`
5. [ ] Run: `npm install @octokit/rest`
6. [ ] Run SQL: `add_github_columns.sql`

---

## Code Snippets

### Upload Files to GitHub:
```typescript
import { uploadMVPFilesToGitHub } from '@/services/githubService';

const { repoUrl, fileUrls } = await uploadMVPFilesToGitHub(
  user.id,           // Repo name
  'Idea Title',      // Repo description
  [file1, file2]     // Files array
);
```

### Save to Database:
```typescript
await supabase.from('ideas').insert({
  ...ideaData,
  github_repo_url: repoUrl,
  mvp_file_urls: fileUrls.join(',')
});
```

---

## Environment Variables

Create `.env.local`:
```
VITE_GITHUB_TOKEN=ghp_your_token_here
```

---

## SQL Commands

Run in Supabase SQL Editor:
```sql
ALTER TABLE ideas ADD COLUMN github_repo_url TEXT;
ALTER TABLE ideas ADD COLUMN mvp_file_urls TEXT;
```

---

## Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **GitHub Token Settings**: https://github.com/settings/tokens

---

## File Locations

```
src/
├── services/
│   └── githubService.ts          ← GitHub integration
├── pages/
│   ├── Login.tsx                 ← Google OAuth button
│   └── Signup.tsx                ← Google OAuth button
└── .env.local                    ← GitHub token (create this)

Documentation:
├── GOOGLE_GITHUB_SETUP.md        ← Full setup guide
├── GITHUB_INTEGRATION_EXAMPLE.md ← Code examples
├── IMPLEMENTATION_SUMMARY.md     ← What was done
└── add_github_columns.sql        ← Database update
```

---

## Common Commands

```bash
# Install packages
npm install @octokit/rest

# Fix PowerShell (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run dev server
npm run dev

# Test login  
# Go to: http://localhost:5173/login
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| npm won't run | Run PowerShell as Admin → `Set-ExecutionPolicy` |
| Google login fails | Check redirect URL in Google Console |
| GitHub upload fails | Verify token has `repo` scope |
| Octokit not found | Run `npm install @octokit/rest` |

---

**Done!** Now follow `GOOGLE_GITHUB_SETUP.md` for detailed instructions.
