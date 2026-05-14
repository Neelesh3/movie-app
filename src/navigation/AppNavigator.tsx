import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import PlayerScreen from '../screens/PlayerScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',

          backgroundColor: 'rgba(21,28,46,0.92)',

          borderTopWidth: 0,

          height: 70,

          paddingBottom: 10,
          paddingTop: 10,

          marginHorizontal: 20,
          marginBottom: 15,

          borderRadius: 25,

          elevation: 0,
        },

        tabBarActiveTintColor: '#4DA2FF',
        tabBarInactiveTintColor: '#A8B3CF',

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Downloads') {
            iconName = 'download';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
      />

      <Tab.Screen
        name="Downloads"
        component={DownloadsScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

type AppNavigatorProps = {
  initialIsAuthenticated: boolean;
  initialShowOnboarding: boolean;
};

export default function AppNavigator({
  initialIsAuthenticated,
  initialShowOnboarding,
}: AppNavigatorProps) {

  const initialRouteName =
    initialShowOnboarding
      ? 'Onboarding'
      : initialIsAuthenticated
        ? 'MainTabs'
        : 'Login';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,

        fullScreenGestureEnabled: true,

        gestureEnabled: true,

        contentStyle: {
          backgroundColor: '#0B1020',
        },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          animation: 'fade',

          animationDuration: 420,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: 'fade',

          animationDuration: 320,
        }}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          animation: 'slide_from_right',

          animationDuration: 320,
        }}
      />

      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
      />

      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{
          animation: 'slide_from_right',

          animationDuration: 360,
        }}
      />

      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          animation: 'fade_from_bottom',

          animationDuration: 360,
        }}
      />

      <Stack.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          animation: 'fade_from_bottom',

          animationDuration: 340,
        }}
      />
    </Stack.Navigator>
  );
}
