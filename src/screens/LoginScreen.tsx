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
  loginWithEmail,
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

export default function LoginScreen() {

  const navigation: any =
    useNavigation();

  const { colors } =
    useTheme();

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

  async function handleLogin() {

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError('');

    try {

      const credential =
        await loginWithEmail(
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
        )
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
            '#122447',
          ]}
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              marginBottom: 34,
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
                name="film"
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
              Welcome Back
            </Text>

            <Text
              style={{
                color: '#A8B3CF',
                fontSize: 16,
                lineHeight: 24,
                marginTop: 10,
              }}
            >
              Sign in to restore your CineBluish profile, downloads, and recommendations.
            </Text>
          </View>

          <View>
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
              onPress={handleLogin}
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
                  Log In
                </Text>
              )}
            </PressScale>

            <PressScale
              onPress={() =>
                navigation.navigate(
                  'Signup'
                )
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
                New to CineBluish? Create an account
              </Text>
            </PressScale>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
