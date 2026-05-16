import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import {
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';

import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';

export function useGoogleLogin() {
  const [request, , promptAsync] =
    Google.useIdTokenAuthRequest({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      androidClientId: GOOGLE_ANDROID_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      selectAccount: true,
    });

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    console.log('[OAuth] Starting Google login');
    console.log('[OAuth] Platform:', Platform.OS);
    console.log('[OAuth] Request redirectUri:', request?.redirectUri);
    console.log('[OAuth] Request URL prepared:', !!request?.url);
    console.log('[OAuth] Default redirect URI:', AuthSession.makeRedirectUri());

    if (Platform.OS === 'web' && !GOOGLE_WEB_CLIENT_ID) {
      console.error('[OAuth] Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
      throw new Error('Google Web Client ID not configured in .env');
    }
    if (Platform.OS === 'android' && !GOOGLE_ANDROID_CLIENT_ID) {
      console.error('[OAuth] Missing EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID');
      throw new Error('Google Android Client ID not configured in .env');
    }

    if (!request) {
      console.error('[OAuth] Auth request not ready');
      throw new Error('Google auth request is not ready yet. Please try again.');
    }

    try {
      console.log('[OAuth] Using client IDs:', {
        webClientId: GOOGLE_WEB_CLIENT_ID ? `${GOOGLE_WEB_CLIENT_ID.slice(0, 24)}...` : 'missing',
        androidClientId: GOOGLE_ANDROID_CLIENT_ID
          ? `${GOOGLE_ANDROID_CLIENT_ID.slice(0, 24)}...`
          : 'missing',
      });

      const result = await promptAsync();

      console.log('[OAuth] Auth result type:', result.type);

      if (result.type === 'cancel') {
        throw new Error('Google sign-in cancelled by user.');
      }

      if (result.type === 'dismiss') {
        throw new Error('Google sign-in dismissed.');
      }

      if (result.type !== 'success') {
        const oauthError =
          'params' in result
            ? (result.params as Record<string, string | undefined>)?.error
            : undefined;

        throw new Error(oauthError || `OAuth failed: ${result.type}`);
      }

      const idToken =
        result.authentication?.idToken ||
        result.params?.id_token;

      const accessToken =
        result.authentication?.accessToken ||
        result.params?.access_token;

      if (!idToken) {
        throw new Error('No ID token returned from Google OAuth.');
      }

      const credential =
        GoogleAuthProvider.credential(
          idToken,
          accessToken
        );

      const userCredential =
        await signInWithCredential(auth, credential);

      console.log(
        '[OAuth] Firebase Google sign-in success:',
        userCredential.user.email
      );

      return userCredential.user;
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : String(error);

      console.error('[OAuth] Google login failed:', errorMsg);
      throw new Error(errorMsg);
    }
  }, [promptAsync, request]);

  return {
    loginWithGoogle,
    googleRequestReady: !!request,
  };
}

export function debugOAuthConfig() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  console.log('\n[OAuth Debug] Google Auth Configuration');
  console.log(
    '[OAuth Debug] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:',
    webClientId ? 'Configured' : 'Missing'
  );
  console.log(
    '[OAuth Debug] EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID:',
    androidClientId ? 'Configured' : 'Missing'
  );
  console.log(
    '[OAuth Debug] Active ID for current platform:',
    Platform.OS === 'android'
      ? (androidClientId ? 'androidClientId' : 'missing androidClientId')
      : (webClientId ? 'webClientId' : 'missing webClientId')
  );

  console.log('[OAuth Debug] Flow: expo-auth-session/providers/google');
  console.log('[OAuth Debug] Hook: Google.useIdTokenAuthRequest');
  console.log('[OAuth Debug] Platform:', Platform.OS);
  console.log('[OAuth Debug] Default redirect URI:', AuthSession.makeRedirectUri());
}
