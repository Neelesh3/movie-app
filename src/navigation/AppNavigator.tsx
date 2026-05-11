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
import MovieDetailScreen from '../screens/MovieDetailScreen';
import PlayerScreen from '../screens/PlayerScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

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
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

type AppNavigatorProps = {
  initialShowOnboarding: boolean;
};

export default function AppNavigator({
  initialShowOnboarding,
}: AppNavigatorProps) {

  return (
    <Stack.Navigator
      initialRouteName={
        initialShowOnboarding
          ? 'Onboarding'
          : 'MainTabs'
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />

      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
      />

      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
      />

      <Stack.Screen
        name="Player"
        component={PlayerScreen}
      />

      <Stack.Screen
        name="Watchlist"
        component={WatchlistScreen}
      />
    </Stack.Navigator>
  );
}
