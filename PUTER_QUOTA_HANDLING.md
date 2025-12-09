# Puter.js Quota/Rate Limit Handling

## Overview

This implementation provides automatic detection and user-friendly resolution for Puter.js API quota and rate limit errors.

## What Happens When Puter.js Limit Exceeds?

### Common Puter.js Error Messages:

1. **"429 You exceeded your current quota"** - OpenAI API quota exceeded
2. **"System-wide rate limit exceeded"** - Puter platform rate limit
3. **"Error 400 from delegate `usage-limited-chat`: Permission denied"** - Usage limitation
4. **"rate limit"** - Generic rate limiting
5. **"quota exceeded"** - Quota exceeded

### How the System Detects Errors

The AI service (`aiService.ts`) automatically detects quota/rate limit errors using keyword matching:
- "quota exceeded"
- "rate limit"
- "usage-limited"
- "429"
- "permission denied"
- "system-wide rate limit"
- "exceeded your current quota"

## Implementation Details

### 1. Error Detection (`aiService.ts`)

```typescript
// Automatically detects Puter quota errors
const isPuterQuotaError = (error: any): boolean => {
  const errorMsg = error?.message || error?.toString() || "";
  const quotaKeywords = [
    "quota exceeded",
    "rate limit",
    "usage-limited",
    "429",
    "permission denied",
    "system-wide rate limit",
    "exceeded your current quota"
  ];
  return quotaKeywords.some(keyword => 
    errorMsg.toLowerCase().includes(keyword.toLowerCase())
  );
};
```

### 2. Error Storage

When a quota error is detected:
- Error details are stored in `localStorage` under the key `puter_error_state`
- Includes: error message, timestamp, and error type
- The validation process throws a user-friendly error message

### 3. Profile Page Integration

The Profile page checks for quota errors on load and displays a management card if detected.

**State Management:**
```typescript
const [puterError, setPuterError] = useState<any>(null);

useEffect(() => {
  const errorState = getPuterErrorState();
  if (errorState) {
    setPuterError(errorState);
  }
}, [user]);
```

### 4. Cookie Clearing Button

**Location:** Profile Page → Settings Tab

**Visibility:** Only appears when a Puter quota error is detected

**Appearance:** Small button with Cookie and Refresh icons

**Functionality:**
1. Clears all browser cookies (including Puter.com cookies)
2. Clears the error state from localStorage
3. Shows success toast notification
4. Automatically reloads the page after 2 seconds

## User Flow

```
1. User submits an idea
2. AI validation is triggered
3. Puter.js API is called
4. Quota limit exceeded ❌
5. Error is detected and stored
6. User sees friendly error message
7. User navigates to Profile → Settings
8. Special "Puter API Quota Exceeded" card appears
9. User clicks "Clear Puter Cookies" button
10. Cookies cleared, page reloads ✅
11. User can try again
```

## Technical Stack

- **Error Detection:** localStorage-based persistence
- **UI Framework:** React with shadcn/ui components
- **Icons:** lucide-react (Cookie, RefreshCw, AlertCircle)
- **Notifications:** Toast notifications via shadcn/ui

## Why This Works

Puter.js uses browser cookies to track individual user API usage under the "User-Pays" model. When you exceed your quota:
- The quota is tied to your browser session
- Clearing cookies effectively creates a new session
- This resets your quota tracking
- You can continue using the API

## Files Modified

1. **`src/services/aiService.ts`**
   - Added error detection functions
   - Added localStorage management
   - Added quota error checking in AI validation pipeline

2. **`src/pages/Profile.tsx`**
   - Added Puter error state management
   - Added cookie clearing handler
   - Added conditional UI card in Settings tab
   - Added Cookie and RefreshCw icons

## API Functions

### `getPuterErrorState()`
Returns the current Puter error state from localStorage, or `null` if no error exists.

```typescript
const errorState = getPuterErrorState();
// Returns: { hasError: true, errorMessage: "...", timestamp: "...", errorType: "quota_exceeded" }
```

### `clearPuterErrorState()`
Removes the Puter error state from localStorage.

```typescript
clearPuterErrorState(); // Clears error state
```

## UI Components

### Puter Cookie Management Card
- **Type:** Alert/Warning Card
- **Color:**  Accent (orange) theme
- **Size:** Responsive (full width on mobile, half width on desktop)
- **Button:** Small size with dual icons (Cookie + RefreshCw)

## Best Practices

1. **Don't Override Cookies:** The system clears ALL cookies, not just Puter ones, to ensure complete reset
2. **Page Reload:** Automatic reload ensures clean state
3. **Error Persistence:** Error state persists across page refreshes until manually cleared
4. **User Feedback:** Clear visual feedback through toasts and UI cards

## Troubleshooting

**Q: Button doesn't appear**
- Check if a Puter quota error has occurred
- Check browser console for error detection logs
- Verify localStorage contains `puter_error_state`

**Q: Cookies not clearing**
- Some browsers may block cookie clearing
- Try manually clearing browser cache and cookies
- Check for third-party cookie restrictions

**Q: Error persists after clearing**
- Wait a few minutes before trying again
- The actual Puter API quota may have a timed cooldown
- Consider using alternative AI models in the fallback chain

## Future Enhancements

1. Add automatic retry with exponential backoff
2. Display remaining quota (if Puter API provides this)
3. Add manual trigger to clear cookies without error
4. Implement client-side rate limiting to prevent quota hits
5. Add analytics to track quota usage patterns
