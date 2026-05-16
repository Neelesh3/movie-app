# Google OAuth Flow Diagnostics & Troubleshooting

## ✅ Changes Made

### 1. **Restructured OAuth Flow with Step-by-Step Logging**

[src/services/googleAuth.ts](src/services/googleAuth.ts) now includes:
- 7 detailed steps with logging at each stage
- Explicit error catching at browser open and token exchange
- Better error messages that show exactly where flow breaks
- Status codes from token endpoint

**Log format:**
```
[OAuth] ► Step 1: Getting redirect URI
[OAuth]   Redirect URI: https://auth.expo.io/@username/cinebluish
[OAuth] ► Step 2: Creating AuthRequest
[OAuth] ► Step 3: Opening browser for authorization
```

### 2. **Fixed LoginScreen Error Handling**

[src/screens/LoginScreen.tsx](src/screens/LoginScreen.tsx):
- ✅ Fixed bug: Now uses `authError` instead of undefined `error` variable
- ✅ Added logging when button is pressed
- ✅ Logs at each stage (button press → OAuth call → navigation)

### 3. **Created Debug Utilities**

[src/utils/googleAuthDebug.ts](src/utils/googleAuthDebug.ts):
- `logGoogleAuthDiagnostics()` - Check Client ID, redirect URL, versions
- `testWebBrowserOpen()` - Test if browser can actually open

### 4. **Enhanced Error Messages**

Now shows:
- Token endpoint HTTP status and error text
- Browser open failures with specific reason
- Network errors vs OAuth errors
- Missing ID token details

---

## 🧪 Testing & Troubleshooting

### **Step 1: Check Console Logs**

Clear cache and start fresh:
```bash
npx expo start --clear
```

Press "Continue with Google" button and check console for output like:

```
[LoginScreen] Google button pressed
[OAuth] ► Starting loginWithGoogle
[OAuth] Client ID configured: true
[OAuth] ► Step 1: Getting redirect URI
[OAuth]   Redirect URI: https://auth.expo.io/@your_username/cinebluish
[OAuth] ► Step 2: Creating AuthRequest
[OAuth] ► Step 3: Opening browser for authorization
```

### **Step 2: Identify Where It Fails**

**If you see nothing after button press:**
- Button handler not being called
- Check: Is the button `disabled` prop true?
- Check: Is `googleLoading` state working?

**If you see logs but browser doesn't open:**
- Log stops at: `[OAuth] ► Step 3: Opening browser for authorization`
- Likely issue: `promptAsync()` not launching browser
- Check: Is `expo-web-browser` configured in `app.json`?

**If browser opens then closes instantly:**
- Log shows: `[OAuth]   Result type: dismiss`
- User cancelled or flow broken
- Check: Redirect URI matches Google Console config

**If you see token endpoint error:**
- Log shows: `[OAuth] ✗ Token endpoint error: ...`
- Check: Authorization code is valid
- Check: Client ID matches token endpoint expectations
- Check: Network connection

### **Step 3: Common Issues & Fixes**

#### Issue: Nothing happens when clicking button

**Diagnostics:**
1. Add breakpoint or manual test:
```typescript
// In LoginScreen, temporarily add this:
onPress={async () => {
  const config = logGoogleAuthDiagnostics();
}}
```

2. Check if function is exported correctly:
```typescript
import { loginWithGoogle } from '../services/auth';
```

**Fixes:**
- Restart: `npx expo start -c` (clear cache)
- Verify `.env` has `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
- Check that `loginWithGoogle` is imported in LoginScreen

#### Issue: Browser won't open

**Check these:**
```bash
# Verify expo-web-browser is in package.json
cat package.json | grep expo-web-browser

# Check app.json has the plugin
grep -A5 "plugins" app.json

# Try opening Google directly to test browser
```

**Quick test in console:**
```javascript
// Add temporarily to googleAuth.ts after AuthRequest creation:
console.log('[OAuth] Testing WebBrowser...');
await WebBrowser.openBrowserAsync('https://www.google.com');
```

#### Issue: "Invalid redirect URI" from Google

**This means:**
- Redirect URI doesn't match Google Console config
- Expo Go uses: `https://auth.expo.io/@your_username/appname`

**Fix:**
1. Get exact redirect URI from logs:
   ```
   [OAuth] Redirect URI: https://auth.expo.io/@you/cinebluish
   ```
2. Add this exact URI to Google Console:
   - Project: Go to Credentials
   - Web OAuth credential
   - Authorized Redirect URIs
   - Click "Add URI" and paste the exact URL

#### Issue: "No authorization code received"

**This means:**
- Browser closed without authorization
- Authorization failed
- Or redirect didn't complete properly

**Check:**
```
[OAuth] Result keys: [type, params]
```

If `params` is empty, the OAuth flow didn't complete. Verify:
- Google account selection worked
- Scopes were approved
- Browser returned to app properly

---

## 🔍 Advanced Debugging

### **Enable Full OAuth Logging Manually**

Replace `promptAsync()` call temporarily:
```typescript
// In googleAuth.ts after AuthRequest creation
console.log('[OAuth] Full request object:', JSON.stringify({
  clientId: GOOGLE_CLIENT_ID,
  scopes: ['openid', 'profile', 'email'],
  redirectUri,
  responseType: AuthSession.ResponseType.Code,
  usePKCE: true,
}));
```

### **Test With Debug Function**

Add button in LoginScreen:
```typescript
import { debugOAuthConfig } from '../services/googleAuth';

<PressScale onPress={() => debugOAuthConfig()}>
  <Text>Debug OAuth Config</Text>
</PressScale>
```

Output will show:
```
╔═══════════════════════════════════╗
║  GOOGLE OAUTH DEBUG INFO          ║
╚═══════════════════════════════════╝
Client ID: ✓ Configured
Redirect URI: https://auth.expo.io/@user/cinebluish
Discovery Config:
├─ authorizationEndpoint: https://accounts.google.com/o/oauth2/v2/auth
├─ tokenEndpoint: https://oauth2.googleapis.com/token
└─ revocationEndpoint: https://oauth2.googleapis.com/revoke
```

---

## ✅ Verification Checklist

- [ ] Console shows `[OAuth] ► Starting loginWithGoogle`
- [ ] Redirect URI shown in logs
- [ ] AuthRequest created successfully
- [ ] Browser opens (check notification/overlay)
- [ ] Google sign-in screen appears in browser
- [ ] After selecting account, you see `[OAuth]   Browser returned`
- [ ] Token exchange shows HTTP 200
- [ ] ID token present in response
- [ ] Firebase credential created
- [ ] User signed in: `[OAuth] ✓ Success! User: xxx@gmail.com`
- [ ] App navigates to MainTabs

---

## 📋 Next Steps If Still Not Working

1. **Verify Client ID is correct:**
   - Should be: `XXX-abcd.apps.googleusercontent.com`
   - Check Google Cloud Console

2. **Verify Redirect URI registered:**
   - Must match EXACTLY what logs show
   - Include `https://` and exact path

3. **Check firestore/auth config:**
   - Firebase must have Google auth method enabled
   - Go to Firebase Console → Authentication → Sign-in method
   - Make sure "Google" provider is enabled

4. **Test email auth still works:**
   - If email/password broken, verify `auth.ts` not damaged
   - Run: `npm run android` to test on real device

5. **Last resort: Clean build**
   ```bash
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

---

## 🎯 What These Logs Tell You

| Log Message | Meaning | Action |
|---|---|---|
| `Client ID configured: false` | .env not loaded | Restart with `npx expo start -c` |
| `✗ Browser error:` | Browser won't open | Check expo-web-browser in app.json |
| `Result type: dismiss` | User cancelled | Try again or check Google auth state |
| `✗ OAuth error:` | Google auth failed | Check account permissions |
| `✗ Token endpoint returned 400:` | Invalid code/params | Redirect URI probably wrong in Google |
| `✗ No ID token in response` | Google didn't return token | Check token endpoint response |
| `✓ Success! User:` | Everything worked! | App will navigate to MainTabs |

