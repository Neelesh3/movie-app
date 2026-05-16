/**
 * Diagnostic utility for Google OAuth debugging
 * Call from LoginScreen or other component to troubleshoot OAuth setup
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export function logGoogleAuthDiagnostics() {
  console.log('\n=== GOOGLE OAUTH DIAGNOSTICS ===\n');

  // Check environment
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  console.log('[Diagnostics] EXPO_PUBLIC_GOOGLE_CLIENT_ID:', clientId ? '✓ Set' : '✗ NOT SET');
  if (clientId) {
    console.log('[Diagnostics] Client ID:', clientId.substring(0, 20) + '...');
  }

  // Check redirect URL
  const redirectUrl = AuthSession.getRedirectUrl();
  console.log('[Diagnostics] Redirect URL:', redirectUrl);

  // Check WebBrowser
  console.log('[Diagnostics] WebBrowser available:', !!WebBrowser);
  console.log('[Diagnostics] AuthSession available:', !!AuthSession);

  // Check AuthSession version info
  console.log('[Diagnostics] AuthSession.ResponseType:', AuthSession.ResponseType);

  console.log('\n=== END DIAGNOSTICS ===\n');
}

export async function testWebBrowserOpen() {
  console.log('[WebBrowser Test] Attempting to open browser...');
  try {
    const result = await WebBrowser.openBrowserAsync(
      'https://www.google.com'
    );
    console.log('[WebBrowser Test] Result:', result);
    return result;
  } catch (error) {
    console.error('[WebBrowser Test] Error:', error);
    throw error;
  }
}
