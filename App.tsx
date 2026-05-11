import 'react-native-gesture-handler';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
} from 'react-native';

import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {
  NavigationContainer,
} from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

import CineBluishSplash from './src/components/CineBluishSplash';

import {
  ThemeProvider,
} from './src/context/ThemeContext';

import {
  getOnboardingComplete,
} from './src/services/onboarding';

import {
  useWatchlistStore,
} from './src/stores/watchlistStore';

function AppNavigationRoot() {

  const [
    showSplash,
    setShowSplash,
  ] = useState(true);

  const [
    session,
    setSession,
  ] = useState<{
    showOnboarding: boolean;
  } | null>(null);

  useEffect(() => {

    let cancelled = false;

    (async () => {

      try {

        const [, done] =
          await Promise.all([
            useWatchlistStore
              .getState()
              .hydrate(),

            getOnboardingComplete(),
          ]);

        if (!cancelled) {
          setSession({
            showOnboarding: !done,
          });
        }
      } catch {

        if (!cancelled) {
          await useWatchlistStore
            .getState()
            .hydrate()
            .catch(() => {});

          setSession({
            showOnboarding: true,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSplashFinished =
    useCallback(() => {
      setShowSplash(false);
    }, []);

  if (showSplash) {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <CineBluishSplash
          dataReady={session !== null}
          onExitComplete={
            handleSplashFinished
          }
        />
      </View>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator
        initialShowOnboarding={
          session.showOnboarding
        }
      />
    </NavigationContainer>
  );
}

export default function App() {

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <ThemeProvider>
        <AppNavigationRoot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
