import 'react-native-gesture-handler';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  ActivityIndicator,
} from 'react-native';

import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {
  NavigationContainer,
} from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

import {
  ThemeProvider,
  useTheme,
} from './src/context/ThemeContext';

import {
  getOnboardingComplete,
} from './src/services/onboarding';

function AppNavigationRoot() {

  const { colors } = useTheme();

  const [
    bootstrap,
    setBootstrap,
  ] = useState<{
    ready: boolean;
    showOnboarding: boolean;
  } | null>(null);

  useEffect(() => {

    let cancelled = false;

    (async () => {

      const done =
        await getOnboardingComplete();

      if (!cancelled) {
        setBootstrap({
          ready: true,
          showOnboarding: !done,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!bootstrap?.ready) {
    return (
      <View
        style={{
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',

          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator
        initialShowOnboarding={
          bootstrap.showOnboarding
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
