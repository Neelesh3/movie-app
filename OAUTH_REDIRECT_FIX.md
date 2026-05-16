# Google OAuth Redirect URI Fix for CineBluish

## Problem Fixed

**Error**: `Error 400: invalid_request` from Google OAuth
**Root Cause**: Redirect URI mismatch between app code and Google Cloud Console configuration

The previous implementation used a hardcoded custom scheme (`cinebluish://oauth-redirect`) which wasn't registered in Google Cloud Console. This caused Google to reject the token exchange request.

## The Fix

Changed from:
```typescript
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'cinebluish',
  path: 'oauth-redirect',
});
```

To:
```typescript
const redirectUri = AuthSession.getDefaultReturnUrl();
```

### Why This Works

`AuthSession.getDefaultReturnUrl()` automatically:
- Returns the correct Expo auth proxy URL when running in Expo Go
- Returns the custom scheme URL when running as a native build
- Handles all environment detection automatically

## What You Must Do in Google Cloud Console

### 1. Get Your Redirect URI

Run this in your terminal to see the exact redirect URI:

```bash
cd d:\2\ PROJECT\CineBluish
npx expo --version
```

Then run the debug command to log the redirect URI:

```bash
npm run android  # or ios, or start for Expo Go
```

Watch for this in console:

```
🔗 Redirect URI (for Google Console):
   [YOUR_REDIRECT_URI_WILL_APPEAR_HERE]

⚠️  IMPORTANT: Register this EXACT URL in Google Cloud Console
```

### 2. Register in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **CineBluish** (or create if missing)
3. Go to **Credentials** → Find your **OAuth 2.0 Client** (Web type)
4. Click the client ID: `490985825755-hjssta890a0cvn47ortm3t7n538kpj5b.apps.googleusercontent.com`
5. Under **Authorized redirect URIs**, click **+ Add URI**
6. Paste the redirect URI from Step 1
7. Click **Save**

### 3. Expected Redirect URIs

You should have **ALL** of these registered:

```
# For Expo Go (development)
https://auth.expo.io/@your-username/your-app-slug

# For native build (production - if using custom scheme)
cinebluish://oauth-redirect
```

## Verification Steps

### Step 1: Check Console Output

When testing OAuth, look for:

```
[OAuth] ► Step 1: Creating redirect URI
[OAuth]   Redirect URI: [your_redirect_uri]
[OAuth]   Make sure this exact URI is registered in Google Console!
```

The redirect URI in the console **must exactly match** what's in Google Cloud Console.

### Step 2: Debug OAuth Config

Add this to your LoginScreen or test it in a debug screen:

```typescript
import { debugOAuthConfig } from '../services/googleAuth';

// Call this once on app startup to verify configuration
useEffect(() => {
  debugOAuthConfig();
}, []);
```

Check console for output like:

```
╔════════════════════════════════════════════╗
║   GOOGLE OAUTH CONFIGURATION DEBUG      ║
╚════════════════════════════════════════════╝

📋 Client ID Configuration:
   Status: ✓ Configured
   Value: 490985825755-hjssta...

🔗 Redirect URI (for Google Console):
      https://auth.expo.io/@your-username/your-slug

   ⚠️  IMPORTANT: Register this EXACT URL in Google Cloud Console
      under: Credentials → OAuth 2.0 Client → Authorized Redirect URIs

🌐 Google OAuth Endpoints:
   Auth: https://accounts.google.com/o/oauth2/v2/auth
   Token: https://oauth2.googleapis.com/token

✓ Firebase Configuration (verify in Firebase Console):
   - Google Auth Provider: MUST be enabled
   - Project ID: cinebluish
```

### Step 3: Test the Flow

1. Press **Continue with Google** button in LoginScreen
2. Watch console for:
   - `[OAuth] ► Step 1: Creating redirect URI` (with actual URI)
   - `[OAuth] ► Step 2: Creating AuthRequest`
   - `[OAuth] ► Step 3: Opening browser`
3. Browser should open with Google sign-in
4. Select your Google account
5. After successful redirect:
   - `[OAuth] ► Step 4: Extracting auth code` (should succeed)
   - `[OAuth] ► Step 5: Exchanging code for tokens` with status 200
   - `[OAuth] ► Step 6: Signing in to Firebase`
   - `[OAuth] ✓ SUCCESS - User: your-email@gmail.com`

## If Still Getting Error 400

### Check 1: Exact URI Match

The URI logged in console **must be byte-for-byte identical** to the URI in Google Cloud Console.

Common issues:
- Extra spaces: `https://auth.expo.io/@user/app ` (trailing space)
- Different casing: URIs are case-sensitive
- Wrong client ID: Verify you're using the Web OAuth client, not Android/iOS

### Check 2: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **cinebluish**
3. Go to **Authentication** → **Sign-in method**
4. Check **Google** is **Enabled**
5. Verify **Web Client ID** field contains your Web OAuth Client ID

### Check 3: Google Cloud Project

1. Verify OAuth 2.0 client ID is **type: Web**
2. Not Android or iOS (those won't work)
3. Authorized redirect URIs has your exact URI (case-sensitive)

## Enhanced Debugging

The updated code now logs detailed error information:

```
[OAuth] ► Step 5: Exchanging code for tokens
[OAuth]   Token response status: 400
[OAuth]   Token error response: {"error":"invalid_request","error_description":"..."}
[OAuth] ✗ FINAL ERROR: Token exchange error 400: {"error":"invalid_request",...}
```

This tells you:
- Exactly which step failed
- The HTTP status code
- The full error response from Google

## Session Persistence

The Google sign-in flow:
1. Gets ID token from Google
2. Creates Firebase credential
3. Signs in to Firebase
4. Session store auto-hydrates (same as email auth)
5. User persists across app restarts

All session functionality (watchlist, continue watching, downloads) works identically for Google and email auth.

## Testing Checklist

- [ ] Redirect URI from console matches Google Cloud Console
- [ ] Google OAuth client is **type: Web**
- [ ] Firebase Google provider is **Enabled**
- [ ] Firebase Web OAuth Client ID is set
- [ ] No extra spaces or case mismatches in URIs
- [ ] Test button press opens browser
- [ ] Account select screen appears
- [ ] After selection, no 400 error in console
- [ ] User successfully authenticated and redirected to home screen

## Contact Google Support

If still failing after verification:

- Create a new OAuth 2.0 Web client in Google Cloud Console
- Register all redirect URIs fresh
- Delete old/unused OAuth clients
- Restart Expo with `expo start --clear`
