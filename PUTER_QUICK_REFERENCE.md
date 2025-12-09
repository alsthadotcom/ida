# Quick Reference: Puter.js Quota Error Handling

## What You Need to Know

### When Puter.js Limit Exceeds:

**Error Messages You'll See:**
- "429 You exceeded your current quota"
- "System-wide rate limit exceeded"  
- "Usage-limited-chat permission denied"
- Any error containing "quota", "rate limit", or "429"

### The Solution: Clear Cookies Button

**Location:** Profile Page → Settings Tab

**When It Appears:** Automatically shows when Puter API quota is exceeded

**What It Does:**
1. Clears all browser cookies
2. Resets your Puter session
3. Reloads the page
4. Allows you to use the AI validation again

### How to Use:

```
1. Try to submit an idea
2. Get quota error ❌
3. Go to your Profile page
4. Click Settings tab
5. See orange "Puter API Quota Exceeded" card
6. Click "Clear Puter Cookies" button ✅
7. Page reloads automatically
8. Try submitting again!
```

## Technical Details (For Developers)

**Modified Files:**
- `src/services/aiService.ts` - Error detection and storage
- `src/pages/Profile.tsx` - UI and cookie clearing

**New Functions:**
- `getPuterErrorState()` - Check for quota errors
- `clearPuterErrorState()` - Clear error state
- `handleClearPuterCookies()` - Clear cookies & reload

**Button Specs:**
- Size: `sm` (small)
- Icons: RefreshCw + Cookie (lucide-react)
- Visibility: Conditional (only when `puterError` exists)
- Style: Accent color theme (orange)

## Why This Works

Puter.js's "User-Pays" model tracks API usage via browser cookies. Clearing cookies creates a fresh session, effectively resetting your quota counter.

## Read More

- `PUTER_QUOTA_HANDLING.md` - Full documentation
- `PUTER_FLOW_DIAGRAM.md` - Visual flowcharts

---

**Note:** If the error persists after clearing cookies, wait a few minutes before trying again. The Puter API may have a timed cooldown period.
