# Puter.js Cookie Reset - Quick Guide

## Overview

A simple manual solution for Puter.js API quota/rate limit errors. No automatic detection - just a button users can click when they encounter errors.

## When to Use

If you encounter these errors when using AI features:
- "quota exceeded"
- "rate limit" 
- "429 error"
- "usage-limited"
- "permission denied"

## How to Use

### Step 1: Encounter Error
When AI validation fails with a quota error, you'll see a message like:
```
AI validation failed. If you're experiencing quota issues, 
go to Profile → Settings and click 'Clear Puter Cookies' to reset your session.
```

### Step 2: Go to Settings
1. Click on your profile (top-right)
2. Go to **Settings** tab
3. Look for the orange **"Puter API Cookie Reset"** card

### Step 3: Clear Cookies
1. Click the **"Clear Puter Cookies"** button (small, orange, with cookie 🍪 and refresh 🔄 icons)
2. You'll see a success message
3. **Manually refresh the page** (Press F5 or Ctrl+R)

### Step 4: Try Again
Submit your idea again - the quota should be reset!

## Button Location

```
Profile → Settings Tab

┌─────────────────────────────────────────┐
│ 🍪 Puter API Cookie Reset               │
├─────────────────────────────────────────┤
│ Clear Puter cookies if you encounter    │
│ quota errors                             │
│                                          │
│ If you get "quota exceeded" or "rate    │
│ limit" errors when using AI features,   │
│ click the button below to clear         │
│ Puter.js cookies and reset your session.│
│                                          │
│ [ 🔄 🍪 Clear Puter Cookies ]           │
│     ↑ SMALL BUTTON (always visible)      │
└─────────────────────────────────────────┘
```

## Button Features

- **Always Visible** ✅ - No conditional display
- **Small Size** - Compact, unobtrusive design
- **Orange Theme** - Matches accent color for visibility
- **Manual Action** - User controls when to clear cookies
- **No Auto-Reload** - User manually refreshes after clearing

## Technical Details

### What It Does
1. Clears ALL browser cookies (including Puter.com cookies)
2. Shows success toast notification
3. Waits for user to manually refresh the page

### Why It Works
Puter.js tracks API usage via browser cookies. Clearing cookies creates a fresh session, resetting your quota counter.

### Files Modified
- `src/services/aiService.ts` - Error messages guide users to Settings
- `src/pages/Profile.tsx` - Always-visible cookie clear button

## User Flow

```
1. User submits idea
2. AI validation fails with quota error  
3. Error message says: "Go to Profile → Settings"
4. User navigates to Profile → Settings
5. User sees orange "Puter API Cookie Reset" card
6. User clicks "Clear Puter Cookies" button
7. Success toast appears
8. User manually refreshes page (F5)
9. User tries submitting again ✅
```

## No Automatic Features

This implementation is intentionally simple:
- ❌ No automatic error detection
- ❌ No error state storage in localStorage
- ❌ No conditional button display
- ❌ No automatic page reload
- ✅ Just a simple, always-available manual reset button

## Tips

- The button is small to avoid cluttering the settings page
- It's safe to click anytime, not just when you have errors
- After clicking, wait for the success toast, then refresh
- If error persists, wait a few minutes before trying again
