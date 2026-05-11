import React from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import {
  useTheme,
} from '../context/ThemeContext';

const menuItems = [
  {
    icon: 'download-outline',
    title: 'Downloads',
  },

  {
    icon: 'heart-outline',
    title: 'Watchlist',
  },

  {
    icon: 'language-outline',
    title: 'Language',
  },

  {
    icon: 'settings-outline',
    title: 'Settings',
  },

  {
    icon: 'help-circle-outline',
    title: 'Help Center',
  },
];

export default function ProfileScreen() {

  const navigation: any = useNavigation();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          darkMode
            ? '#0B1020'
            : '#EEF2F7',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            alignItems: 'center',
            marginTop: 25,
          }}
        >
          <Image
            source={{
              uri: 'https://i.pravatar.cc/300?img=12',
            }}

            style={{
              width: 110,
              height: 110,

              borderRadius: 55,

              borderWidth: 3,
              borderColor: '#4DA2FF',
            }}
          />

          <Text
            style={{
              color:
                darkMode
                  ? '#FFFFFF'
                  : '#111111',

              fontSize: 28,
              fontWeight: 'bold',

              marginTop: 18,
            }}
          >
            Neelesh
          </Text>

          <Text
            style={{
              color: '#A8B3CF',
              marginTop: 5,
            }}
          >
            Premium Member
          </Text>
        </View>

        {/* STATS */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',

            marginTop: 35,
            marginHorizontal: 20,
          }}
        >
          {[
            {
              label: 'Watch Time',
              value: '248h',
            },

            {
              label: 'Movies',
              value: '96',
            },

            {
              label: 'Series',
              value: '18',
            },
          ].map((item, index) => (
            <View
              key={index}

              style={{
                flex: 1,

                backgroundColor:
                  darkMode
                    ? '#151C2E'
                    : '#FFFFFF',

                marginHorizontal: 6,

                paddingVertical: 20,

                borderRadius: 22,

                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color:
                    darkMode
                      ? '#FFFFFF'
                      : '#111111',

                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                {item.value}
              </Text>

              <Text
                style={{
                  color: '#A8B3CF',
                  marginTop: 6,
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* MENU */}

        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >

          {/* THEME TOGGLE */}

          <TouchableOpacity

            onPress={toggleTheme}

            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              backgroundColor:
                darkMode
                  ? '#151C2E'
                  : '#FFFFFF',

              padding: 18,

              borderRadius: 22,

              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={
                  darkMode
                    ? 'moon'
                    : 'sunny'
                }

                size={24}

                color="#4DA2FF"
              />

              <Text
                style={{
                  color:
                    darkMode
                      ? '#FFFFFF'
                      : '#111111',

                  marginLeft: 16,

                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                {darkMode
                  ? 'Dark Mode'
                  : 'Light Mode'}
              </Text>
            </View>

            <Ionicons
              name="swap-horizontal"
              size={22}
              color="#A8B3CF"
            />
          </TouchableOpacity>

          {/* MENU ITEMS */}

          {menuItems.map((item, index) => (

            <TouchableOpacity

              key={index}

              onPress={() => {

                if (item.title === 'Watchlist') {

                  navigation.navigate('Watchlist');
                }
              }}

              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',

                backgroundColor:
                  darkMode
                    ? '#151C2E'
                    : '#FFFFFF',

                padding: 18,

                borderRadius: 22,

                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color="#4DA2FF"
                />

                <Text
                  style={{
                    color:
                      darkMode
                        ? '#FFFFFF'
                        : '#111111',

                    marginLeft: 16,

                    fontSize: 16,
                    fontWeight: '500',
                  }}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#A8B3CF"
              />
            </TouchableOpacity>

          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}