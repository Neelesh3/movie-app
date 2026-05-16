import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';


import { auth } from '../config/firebase';

import { useGoogleLogin } from './googleAuth';



export function listenToAuthState(
  callback: (user: User | null) => void
) {

  return onAuthStateChanged(
    auth,
    callback
  );
}

export async function loginWithEmail(
  email: string,
  password: string
) {

  return signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

export async function signupWithEmail(
  name: string,
  email: string,
  password: string
) {

  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  const displayName =
    name.trim();

  if (displayName) {
    await updateProfile(
      credential.user,
      {
        displayName,
      }
    );
  }

  return credential;
}

export async function logout() {

  await signOut(auth);
}

export function getAuthErrorMessage(
  error: any
) {

  // Handle string errors from Google Sign-In
  if (typeof error === 'string') {
    if (
      error.includes('cancelled') ||
      error.includes('cancelled')
    ) {
      return 'Google sign-in was cancelled.';
    }
    if (error.includes('network')) {
      return 'Network error. Check your connection and try again.';
    }
    return error;
  }

  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/missing-password':
      return 'Enter your password.';
    case 'auth/network-request-failed':
      return 'Network unavailable. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled for this Firebase project.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment, then try again.';
    case 'auth/weak-password':
      return 'Use a password with at least 6 characters.';

  }
}

export { useGoogleLogin };
