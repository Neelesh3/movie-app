import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import PressScale from '../components/PressScale';

import {
  getAuthErrorMessage,
  signupWithEmail,
} from '../services/auth';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useSessionStore,
} from '../stores/sessionStore';

import {
  useWatchlistStore,
} from '../stores/watchlistStore';

import {
  useDownloadStore,
} from '../stores/downloadStore';

export default function SignupScreen() {

  const navigation: any =
    useNavigation();

  const { colors } =
    useTheme();

  const [
    name,
    setName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    !loading;

  async function hydrateUserSession(
    authUser: any
  ) {

    await useSessionStore
      .getState()
      .setAuthUser(authUser);

    await Promise.all([
      useWatchlistStore
        .getState()
        .hydrate(),
      useDownloadStore
        .getState()
        .hydrate(),
    ]);
  }

  async function handleSignup() {

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError('');

    try {

      const credential =
        await signupWithEmail(
          name,
          email,
          password
        );

      await hydrateUserSession(
        credential.user
      );

      navigation.replace('MainTabs');

    } catch (authError) {

setError(
  getAuthErrorMessage(
    authError
  ) || 'Authentication failed.'
);

    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colors.background,
      }}
    >
      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={[
            '#050814',
            '#0B1020',
            '#123d4a',
          ]}
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              marginBottom: 30,
            }}
          >
            <View
              style={{
                width: 66,
                height: 66,
                borderRadius: 33,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  'rgba(77,162,255,0.18)',
                borderWidth: 1,
                borderColor:
                  'rgba(77,162,255,0.38)',
              }}
            >
              <Ionicons
                name="person-add"
                size={30}
                color={colors.accent}
              />
            </View>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 34,
                fontWeight: '900',
                marginTop: 24,
              }}
            >
              Create Profile
            </Text>

            <Text
              style={{
                color: '#A8B3CF',
                fontSize: 16,
                lineHeight: 24,
                marginTop: 10,
              }}
            >
              Your account keeps CineBluish personal across restarts and devices.
            </Text>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#A8B3CF"
            style={{
              color: '#FFFFFF',
              backgroundColor:
                'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderColor:
                'rgba(255,255,255,0.12)',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 15,
              fontSize: 16,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#A8B3CF"
            style={{
              color: '#FFFFFF',
              backgroundColor:
                'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderColor:
                'rgba(255,255,255,0.12)',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 15,
              fontSize: 16,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#A8B3CF"
            secureTextEntry
            style={{
              color: '#FFFFFF',
              backgroundColor:
                'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderColor:
                'rgba(255,255,255,0.12)',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 15,
              fontSize: 16,
            }}
          />

          {!!error && (
            <Text
              style={{
                color: '#FF6B8A',
                lineHeight: 20,
                marginTop: 12,
              }}
            >
              {error}
            </Text>
          )}

          <PressScale
            onPress={handleSignup}
            disabled={!canSubmit}
            style={{
              backgroundColor:
                colors.accent,
              borderRadius: 50,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 22,
            }}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  fontWeight: '800',
                }}
              >
                Sign Up
              </Text>
            )}
          </PressScale>

          <PressScale
            onPress={() =>
              navigation.goBack()
            }
            style={{
              alignItems: 'center',
              paddingVertical: 18,
            }}
          >
            <Text
              style={{
                color: '#A8B3CF',
                fontWeight: '700',
              }}
            >
              Already have an account? Log in
            </Text>
          </PressScale>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
