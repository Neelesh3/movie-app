# Expo Proxy Authentication Fix for Google Sign-In

## Problem Fixed

**Before**: OAuth flow was generating `exp://...` redirect URIs that Google OAuth rejects
**Error**: `Error 400: invalid_request` from Google OAuth endpoint

## The Solution

Changed from custom scheme approach to **Expo Proxy Authentication** which generates the proper Expo proxy URL:
```
https://auth.expo.io/@your-username/your-app-slug
```

This URL is compatible with Google OAuth and properly handles the OAuth callback.

## Technical Details

### What Changed

**Previous Code** (Failed):
```typescript
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'cinebluish',
  path: 'oauth-redirect',
});
// Generated: exp://127.0.0.1:8081/--/oauth-redirect ❌ Google rejects this
```

**Current Code** (Works):
```typescript
const redirectUri = AuthSession.getRedirectUrl('oauth-redirect');
// Generated: https://auth.expo.io/@username/slug ✓ Google accepts this
```

### How Expo Proxy Works

1. `AuthSession.getRedirectUrl('oauth-redirect')` generates the Expo proxy URL
2. User selects Google account in browser
3. Google redirects back to `https://auth.expo.io/@username/slug`
4. Expo's proxy service receives the redirect
5. Expo forwards the OAuth callback back to your app via WebBrowser
6. Your app receives the authorization code
7. App exchanges code for ID token
8. Firebase signs in user

### Why This Works

- **Expo Proxy** is a trusted service that Google recognizes
- Generated URL format: `https://auth.expo.io/@YOUR_USERNAME/YOUR_APP_SLUG`
- Works in both **Expo Go** (development) and **native builds** (production)
- No custom scheme registration needed in Expo Go
- Still supports custom scheme for native standalone builds

## Setup in Google Cloud Console

### 1. Find Your Exact Redirect URI

The debug function logs your exact redirect URI. Add this to your LoginScreen or a debug screen:

```typescript
import { debugOAuthConfig } from '../services/googleAuth';

useEffect(() => {
  debugOAuthConfig();
}, []);
```

Console output will show:
```
🔗 Expo Proxy Redirect URI:
   https://auth.expo.io/@your-username/your-app-slug

⚠️  IMPORTANT: Register this EXACT URL in Google Cloud Console
```

### 2. Register in Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your CineBluish project
3. Go to **Credentials** (left sidebar)
4. Find your **OAuth 2.0 Client ID** (Web type)
5. Click it to edit
6. Under **Authorized redirect URIs**, click **+ Add URI**
7. Paste your exact redirect URI from Step 1
8. Click **Save**

Example:
```
https://auth.expo.io/@your-username/cinebluish
```

### 3. For Native Builds (Production)

After setup for Expo Go, also add the native scheme:
```
cinebluish://oauth-redirect
```

This ensures the redirect works both in development (Expo Go) and production (native builds).

## Verification

### Check 1: Debug Output

When you start the app, the OAuth initialization logs:
```
[OAuth] ✓ WebBrowser initialized
```

When you press the Google button, watch for:
```
[OAuth] ► Step 1: Getting Expo proxy redirect URI
[OAuth]   Redirect URI: https://auth.expo.io/@...
[OAuth]   ✓ Using Expo proxy: https://auth.expo.io/@...
```

### Check 2: Successful OAuth Flow

After selecting a Google account, you should see:
```
[OAuth] ► Step 2: Creating AuthRequest
[OAuth]   AuthRequest created

[OAuth] ► Step 3: Opening browser
[OAuth]   Browser returned
[OAuth]   Result type: success

[OAuth] ► Step 4: Extracting auth code
[OAuth]   Auth code received

[OAuth] ► Step 5: Exchanging code for tokens
[OAuth]   Token response status: 200
[OAuth]   ID token present: true

[OAuth] ► Step 6: Signing in to Firebase
[OAuth] ✓ SUCCESS - User: your-email@gmail.com
```

If you see `Token response status: 400`, the redirect URI isn't registered correctly in Google Cloud Console.

### Check 3: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **cinebluish** project
3. Go to **Authentication** → **Sign-in method**
4. Verify **Google** is **Enabled**
5. Verify **Web Client ID** field has a value

## Troubleshooting

### Issue: Still Getting `Error 400: invalid_request`

**Solution**:
1. Verify the redirect URI in your console matches exactly what's in Google Cloud Console
2. URIs are case-sensitive
3. No trailing spaces allowed
4. Wait 2-3 minutes after saving in Google Console (caching)
5. Try refreshing the page and restarting the app

### Issue: `Got here, but no error` or blank screen after Google account selection

**Solution**:
1. Check Firebase Console has Google provider enabled
2. Check Web OAuth Client ID is set in Firebase
3. Verify the token endpoint is responding (check Step 5 in console)

### Issue: Redirect URI changes each time

**Solution**:
- `getRedirectUrl()` generates the same URI based on your username and app slug
- If you changed your Expo username or app slug, register the new URI in Google Cloud Console

## Code Architecture

```
loginWithGoogle()
├─ STEP 1: Get Expo proxy redirect URI
│  └─ AuthSession.getRedirectUrl('oauth-redirect')
│     → https://auth.expo.io/@username/slug
│
├─ STEP 2: Create AuthRequest with Expo proxy redirect
│  └─ new AuthSession.AuthRequest({ redirectUri, ... })
│
├─ STEP 3: Launch browser for user consent
│  └─ authRequest.promptAsync(DISCOVERY_CONFIG)
│     → User sees Google sign-in, selects account
│     → Browser redirects to Expo proxy URL with auth code
│
├─ STEP 4: Extract authorization code
│  └─ const { code } = result.params
│
├─ STEP 5: Exchange code for tokens with Google OAuth
│  └─ POST to https://oauth2.googleapis.com/token
│     → Google returns id_token (JWT)
│
└─ STEP 6: Sign in to Firebase with ID token
   └─ signInWithCredential(auth, credential)
      → Session established, user logged in
```

## Session Management

Google sign-in flows through the same session system as email/password auth:

```typescript
// Both email and Google auth use same session flow:
1. Get Firebase user from auth
2. Load session store (watchlist, continue watching, downloads)
3. Navigate to MainTabs home screen
```

Session persistence automatically hydrates on app restart for both auth methods.

## Security Notes

- ID tokens are validated by Firebase (secure)
- Authorization code is exchanged server-side by Google (secure)
- Custom scheme URIs (`exp://`) are less secure than Expo proxy URLs
- Expo proxy uses HTTPS with proper certificate validation
- Never expose Client Secret in client code (only on backend)

## Environment

- **Expo SDK**: 54.0.33
- **expo-auth-session**: 7.0.11
- **Firebase Auth**: 12.13.0
- **Redirect Method**: Expo proxy authentication
- **Compatibility**: Expo Go + native builds

## References

- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth 2.0 for Mobile & Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Firebase Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [Expo Linking Documentation](https://docs.expo.dev/versions/latest/sdk/linking/)
