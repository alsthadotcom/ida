# 📧 Email Confirmation Redirect Setup

## Configure Supabase Email Redirects

### Step 1: Add Redirect URLs in Supabase Dashboard

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Authentication → URL Configuration
4. **Add Redirect URLs**:

   In the **"Redirect URLs"** section, add BOTH:
   ```
   http://localhost:8080/*
   https://ida-bay.vercel.app/*
   ```

   **Important**: Include the `/*` wildcard at the end!

5. **Click "Save"**

---

### Step 2: Configure Site URL

In the same page (URL Configuration):

1. **Site URL** (Production):
   ```
   https://ida-bay.vercel.app
   ```

2. **Additional Redirect URLs** (if not already added):
   ```
   http://localhost:8080
   http://localhost:5173
   https://ida-bay.vercel.app
   ```

3. **Click "Save"**

---

### Step 3: Update Email Templates (Optional)

If you want to customize the confirmation email:

1. **Navigate to**: Authentication → Email Templates
2. **Select**: "Confirm signup"
3. **Find** the redirect URL in the template:
   ```html
   {{ .ConfirmationURL }}
   ```
4. This will automatically use the correct redirect URL based on where the user signed up

---

### Step 4: Configure Vite Dev Server Port (Local Development)

If you want to use port 8080 for local development instead of 5173:

**Update `vite.config.ts`**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,  // Change from default 5173 to 8080
    host: true,
  },
  // ... rest of config
});
```

Then run:
```bash
npm run dev
```

Now your app will run on `http://localhost:8080`

---

### Step 5: Test Email Confirmation

1. **Sign up** with a new email
2. **Check your email** for confirmation link
3. **Click the confirmation link**
4. **Should redirect to**:
   - `http://localhost:8080` (if you signed up locally)
   - `https://ida-bay.vercel.app` (if you signed up on Vercel)

---

## Configure Environment-Specific Redirects

If you want to explicitly set redirect URLs in your code (for Google OAuth and other providers):

**Update `src/pages/Signup.tsx` and `Login.tsx`**:

```typescript
const handleGoogleSignup = async () => {
  try {
    // Determine redirect URL based on environment
    const redirectTo = import.meta.env.DEV 
      ? 'http://localhost:8080'
      : 'https://ida-bay.vercel.app';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      }
    });

    if (error) throw error;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign up with Google");
  }
};
```

---

## Environment Variables (Optional)

Create `.env.local` for development:
```
VITE_APP_URL=http://localhost:8080
```

Create `.env.production` for production:
```
VITE_APP_URL=https://ida-bay.vercel.app
```

Then use in code:
```typescript
const redirectTo = import.meta.env.VITE_APP_URL || window.location.origin;
```

---

## Vercel Deployment Configuration

When deploying to Vercel, add environment variables:

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add**:
   - Name: `VITE_APP_URL`
   - Value: `https://ida-bay.vercel.app`
   - Environments: Production

---

## Summary

**For Email Confirmation to work on both URLs:**

✅ **Supabase Dashboard** → Authentication → URL Configuration:
- Add `http://localhost:8080/*`
- Add `https://ida-bay.vercel.app/*`

✅ **Local Development**:
- Update `vite.config.ts` to use port 8080
- Or keep 5173 and add it to Supabase redirects

✅ **Production**:
- Deploy to Vercel at `ida-bay.vercel.app`
- Confirmation emails will automatically redirect there

---

## Troubleshooting

### Email confirmation redirects to wrong URL:
- Check Site URL in Supabase matches your production domain
- Ensure redirect URLs include `/*` wildcard
- Clear browser cache and test in incognito

### "Invalid Redirect URL" error:
- URL must be EXACTLY as configured in Supabase
- Check for trailing slashes
- Ensure protocol (http/https) matches

### Localhost port mismatch:
- Update `vite.config.ts` server port to 8080
- Or add `http://localhost:5173/*` to Supabase redirects

---

**Done!** Now email confirmations will work on both local and production environments. 📧✅
