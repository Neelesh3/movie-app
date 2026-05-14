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

import OfflineBanner from './src/components/OfflineBanner';

import DownloadTicker from './src/components/DownloadTicker';

import {
  ThemeProvider,
} from './src/context/ThemeContext';

import {
  NetworkProvider,
} from './src/context/NetworkContext';

import {
  getOnboardingComplete,
} from './src/services/onboarding';

import {
  useWatchlistStore,
} from './src/stores/watchlistStore';

import {
  useDownloadStore,
} from './src/stores/downloadStore';

import {
  useSessionStore,
} from './src/stores/sessionStore';

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

        await useSessionStore
          .getState()
          .hydrate();

        const [, , done] =
          await Promise.all([
            useWatchlistStore
              .getState()
              .hydrate(),

            useDownloadStore
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
          await useSessionStore
            .getState()
            .hydrate()
            .catch(() => {});

          await useWatchlistStore
            .getState()
            .hydrate()
            .catch(() => {});

          await useDownloadStore
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
        <NetworkProvider>
          <AppNavigationRoot />
          <OfflineBanner />
          <DownloadTicker />
        </NetworkProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
