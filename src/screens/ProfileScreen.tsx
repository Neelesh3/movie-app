import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker
from 'expo-image-picker';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  logout,
} from '../services/auth';

import {
  getAvatarUri,
  getFirstName,
} from '../services/session';

import {
  useSessionStore,
} from '../stores/sessionStore';

import {
  useDownloadStore,
} from '../stores/downloadStore';

import {
  useWatchlistStore,
} from '../stores/watchlistStore';

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
    icon: 'settings-outline',
    title: 'Settings',
  },

  {
    icon: 'help-circle-outline',
    title: 'Help Center',
  },
];

export default function ProfileScreen() {

  const navigation: any =
    useNavigation();

  const {
    darkMode,
    toggleTheme,
    colors,
  } = useTheme();

  const user =
    useSessionStore(
      (state) => state.user
    );

  const updateUser =
    useSessionStore(
      (state) => state.updateUser
    );

  const downloads =
    useDownloadStore(
      (state) => state.items
    );

  const watchlist =
    useWatchlistStore(
      (state) => state.items
    );

  const [
    draftName,
    setDraftName,
  ] = useState(user.name);

  const [
    profileImage,
    setProfileImage,
  ] = useState(
    user.avatarId
      ? getAvatarUri(
          user.avatarId
        )
      : ''
  );

  useEffect(() => {

    setDraftName(user.name);

  }, [user.name]);

  const stats =
    useMemo(() => {

      const readyOffline =
        downloads.filter(
          (item) =>
            item.status ===
            'completed'
        ).length;

      return [
        {
          label:
            'Watchlist',

          value:
            String(
              watchlist.length
            ),
        },

        {
          label:
            'Downloads',

          value:
            String(
              downloads.length
            ),
        },

        {
          label:
            'Ready',

          value:
            String(
              readyOffline
            ),
        },
      ];

    }, [
      downloads,
      watchlist.length,
    ]);

  async function
  pickProfileImage() {

    try {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          allowsEditing:
            true,

          aspect: [1, 1],

          quality: 0.8,
        });

      if (
        result.canceled
      ) {
        return;
      }

      const imageUri =
        result.assets?.[0]
          ?.uri;

      if (!imageUri) {
        return;
      }

      setProfileImage(
        imageUri
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function
  saveProfile() {

    await updateUser({
      name: draftName,
      avatarId:
    user.avatarId,
    });
  }

  async function
  handleSignOut() {

    await logout();

    navigation.reset({
      index: 0,

      routes: [
        {
          name: 'Login',
        },
      ],
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* HEADER */}

        <View
          style={{
            alignItems:
              'center',

            marginTop: 30,
          }}
        >

          <View>

            <Image
              source={{
                uri:
                  profileImage ||
                  getAvatarUri(
                    user.avatarId
                  ),
              }}

              style={{
                width: 120,
                height: 120,

                borderRadius:
                  60,

                borderWidth: 3,

                borderColor:
                  colors.accent,
              }}
            />

            <TouchableOpacity

              onPress={
                pickProfileImage
              }

              style={{
                position:
                  'absolute',

                bottom: 0,
                right: 0,

                width: 38,
                height: 38,

                borderRadius:
                  19,

                backgroundColor:
                  colors.accent,

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name="camera"

                size={20}

                color={
                  colors.onAccent
                }
              />
            </TouchableOpacity>

          </View>

          <Text
            style={{
              color:
                colors.textPrimary,

              fontSize: 30,

              fontWeight:
                'bold',

              marginTop: 20,
            }}
          >
            {getFirstName(
              draftName
            )}
          </Text>

          <Text
            style={{
              color:
                colors.textSecondary,

              marginTop: 6,

              fontSize: 15,
            }}
          >
            Premium member
          </Text>
        </View>

        {/* PROFILE CARD */}

        <View
          style={{
            marginTop: 30,

            marginHorizontal:
              20,

            backgroundColor:
              colors.surface,

            borderRadius: 26,

            padding: 20,

            borderWidth: 1,

            borderColor:
              colors.borderSubtle,
          }}
        >
          <Text
            style={{
              color:
                colors.textPrimary,

              fontSize: 20,

              fontWeight:
                '800',
            }}
          >
            Profile Identity
          </Text>

          <TextInput
            value={draftName}

            onChangeText={
              setDraftName
            }

            placeholder="Your name"

            placeholderTextColor={
              colors.textSecondary
            }

            style={{
              marginTop: 18,

              backgroundColor:
                colors.surfaceMuted,

              borderRadius: 18,

              paddingHorizontal:
                18,

              paddingVertical:
                16,

              color:
                colors.textPrimary,

              fontSize: 16,

              fontWeight:
                '600',
            }}
          />

          <TouchableOpacity

            onPress={
              saveProfile
            }

            style={{
              marginTop: 20,

              backgroundColor:
                colors.accent,

              paddingVertical:
                16,

              borderRadius: 18,

              alignItems:
                'center',
            }}
          >
            <Text
              style={{
                color:
                  colors.onAccent,

                fontWeight:
                  '800',

                fontSize: 16,
              }}
            >
              Save Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}

        <View
          style={{
            flexDirection:
              'row',

            justifyContent:
              'space-between',

            marginTop: 34,

            marginHorizontal:
              20,
          }}
        >
          {stats.map(
            (
              item,
              index
            ) => (

              <View
                key={index}

                style={{
                  flex: 1,

                  marginHorizontal:
                    5,

                  backgroundColor:
                    colors.surface,

                  borderRadius:
                    24,

                  paddingVertical:
                    22,

                  alignItems:
                    'center',

                  borderWidth: 1,

                  borderColor:
                    colors.borderSubtle,
                }}
              >
                <Text
                  style={{
                    color:
                      colors.textPrimary,

                    fontSize: 26,

                    fontWeight:
                      'bold',
                  }}
                >
                  {item.value}
                </Text>

                <Text
                  style={{
                    color:
                      colors.textSecondary,

                    marginTop: 6,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            )
          )}
        </View>

        {/* MENU */}

        <View
          style={{
            marginTop: 40,

            paddingHorizontal:
              20,
          }}
        >

          {/* THEME */}

          <TouchableOpacity

            onPress={
              toggleTheme
            }

            style={{
              flexDirection:
                'row',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              backgroundColor:
                colors.surface,

              borderRadius:
                22,

              padding: 18,

              marginBottom: 16,

              borderWidth: 1,

              borderColor:
                colors.borderSubtle,
            }}
          >
            <View
              style={{
                flexDirection:
                  'row',

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name={
                  darkMode
                    ? 'moon'
                    : 'sunny'
                }

                size={24}

                color={
                  colors.accent
                }
              />

              <Text
                style={{
                  color:
                    colors.textPrimary,

                  marginLeft: 16,

                  fontSize: 16,

                  fontWeight:
                    '600',
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

              color={
                colors.textSecondary
              }
            />
          </TouchableOpacity>

          {menuItems.map(
            (
              item,
              index
            ) => (

              <TouchableOpacity

                key={index}

                onPress={() => {

                  if (
                    item.title ===
                    'Watchlist'
                  ) {

                    navigation.navigate(
                      'Watchlist'
                    );
                  }

                  if (
                    item.title ===
                    'Downloads'
                  ) {

                    navigation.navigate(
                      'Downloads'
                    );
                  }
                }}

                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',

                  justifyContent:
                    'space-between',

                  backgroundColor:
                    colors.surface,

                  borderRadius:
                    22,

                  padding: 18,

                  marginBottom: 16,

                  borderWidth: 1,

                  borderColor:
                    colors.borderSubtle,
                }}
              >
                <View
                  style={{
                    flexDirection:
                      'row',

                    alignItems:
                      'center',
                  }}
                >
                  <Ionicons
                    name={
                      item.icon as any
                    }

                    size={24}

                    color={
                      colors.accent
                    }
                  />

                  <Text
                    style={{
                      color:
                        colors.textPrimary,

                      marginLeft: 16,

                      fontSize: 16,

                      fontWeight:
                        '600',
                    }}
                  >
                    {item.title}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"

                  size={22}

                  color={
                    colors.textSecondary
                  }
                />
              </TouchableOpacity>
            )
          )}

          {/* SIGN OUT */}

          <TouchableOpacity

            onPress={
              handleSignOut
            }

            style={{
              flexDirection:
                'row',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              backgroundColor:
                'rgba(255,77,109,0.12)',

              borderRadius:
                22,

              padding: 18,

              borderWidth: 1,

              borderColor:
                'rgba(255,77,109,0.22)',
            }}
          >
            <View
              style={{
                flexDirection:
                  'row',

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name="log-out-outline"

                size={24}

                color="#FF6B8A"
              />

              <Text
                style={{
                  color:
                    '#FFB3C1',

                  marginLeft: 16,

                  fontSize: 16,

                  fontWeight:
                    '700',
                }}
              >
                Sign Out
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"

              size={22}

              color="#FFB3C1"
            />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}