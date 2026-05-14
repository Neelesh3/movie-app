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

import {
  useTheme,
} from '../context/ThemeContext';

import {
  logout,
} from '../services/auth';

import {
  PROFILE_AVATARS,
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
    draftAvatarId,
    setDraftAvatarId,
  ] = useState(user.avatarId);

  useEffect(() => {

    setDraftName(user.name);

    setDraftAvatarId(
      user.avatarId
    );
  }, [
    user.avatarId,
    user.name,
  ]);

  const stats =
    useMemo(() => {

      const readyOffline =
        downloads.filter(
          (item) =>
            item.status === 'completed'
        ).length;

      return [
        {
          label: 'Watchlist',
          value:
            String(watchlist.length),
        },

        {
          label: 'Downloads',
          value:
            String(downloads.length),
        },

        {
          label: 'Ready',
          value:
            String(readyOffline),
        },
      ];

    }, [
      downloads,
      watchlist.length,
    ]);

  const hasProfileChanges =
    draftName.trim() !==
      user.name ||
    draftAvatarId !==
      user.avatarId;

  async function saveProfile() {

    await updateUser({
      name: draftName,
      avatarId: draftAvatarId,
    });
  }

  async function handleSignOut() {

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

        backgroundColor: colors.background,
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
              uri: getAvatarUri(
                draftAvatarId
              ),
            }}

            style={{
              width: 110,
              height: 110,

              borderRadius: 55,

              borderWidth: 3,
              borderColor: colors.accent,
            }}
          />

          <Text
            style={{
              color: colors.textPrimary,

              fontSize: 28,
              fontWeight: 'bold',

              marginTop: 18,
            }}
          >
            {getFirstName(
              user.name
            )}
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              marginTop: 5,
            }}
          >
            Local session active
          </Text>
        </View>

        <View
          style={{
            marginTop: 28,
            marginHorizontal: 20,
            padding: 18,
            borderRadius: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor:
              colors.borderSubtle,
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: '800',
            }}
          >
            Profile Identity
          </Text>

          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Your name"
            placeholderTextColor={
              colors.textSecondary
            }
            style={{
              color: colors.textPrimary,
              marginTop: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor:
                colors.borderSubtle,
              backgroundColor:
                colors.surfaceMuted,
              fontSize: 16,
              fontWeight: '600',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
            }}
          >
            {PROFILE_AVATARS.map(
              (avatar) => {

                const selected =
                  avatar.id ===
                  draftAvatarId;

                return (
                  <TouchableOpacity
                    key={avatar.id}
                    onPress={() =>
                      setDraftAvatarId(
                        avatar.id
                      )
                    }
                    style={{
                      marginRight: 12,
                      borderRadius: 28,
                      borderWidth:
                        selected ? 2 : 1,
                      borderColor:
                        selected
                          ? colors.accent
                          : colors.borderSubtle,
                      padding: 2,
                    }}
                  >
                    <Image
                      source={{
                        uri: avatar.uri,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                      }}
                    />
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          <TouchableOpacity
            onPress={saveProfile}
            disabled={!hasProfileChanges}
            style={{
              marginTop: 18,
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor:
                hasProfileChanges
                  ? colors.accent
                  : colors.surfaceMuted,
            }}
          >
            <Text
              style={{
                color:
                  hasProfileChanges
                    ? colors.onAccent
                    : colors.textSecondary,
                fontWeight: '800',
              }}
            >
              Save Identity
            </Text>
          </TouchableOpacity>
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
          {stats.map((item, index) => (
            <View
              key={index}

              style={{
                flex: 1,

                backgroundColor: colors.surface,

                marginHorizontal: 6,

                paddingVertical: 20,

                borderRadius: 22,

                alignItems: 'center',

                borderWidth: 1,

                borderColor: colors.borderSubtle,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,

                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                {item.value}
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
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

              backgroundColor: colors.surface,

              padding: 18,

              borderRadius: 22,

              marginBottom: 16,

              borderWidth: 1,

              borderColor: colors.borderSubtle,
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

                color={colors.accent}
              />

              <Text
                style={{
                  color: colors.textPrimary,

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
              color={colors.textSecondary}
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

                if (item.title === 'Downloads') {

                  navigation.navigate('Downloads');
                }
              }}

              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',

                backgroundColor: colors.surface,

                padding: 18,

                borderRadius: 22,

                marginBottom: 16,

                borderWidth: 1,

                borderColor: colors.borderSubtle,
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
                  color={colors.accent}
                />

                <Text
                  style={{
                    color: colors.textPrimary,

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
                color={colors.textSecondary}
              />
            </TouchableOpacity>

          ))}

          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent:
                'space-between',

              backgroundColor:
                'rgba(255,77,109,0.12)',

              padding: 18,

              borderRadius: 22,

              marginBottom: 16,

              borderWidth: 1,

              borderColor:
                'rgba(255,77,109,0.22)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color="#FF6B8A"
              />

              <Text
                style={{
                  color: '#FFB3C1',

                  marginLeft: 16,

                  fontSize: 16,
                  fontWeight: '700',
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
