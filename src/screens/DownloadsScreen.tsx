import React, {
  useMemo,
} from 'react';

import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import FadeInImage from '../components/FadeInImage';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  getFirstName,
} from '../services/session';

import {
  DownloadItem,
  useDownloadStore,
} from '../stores/downloadStore';

import {
  useSessionStore,
} from '../stores/sessionStore';

function getStatusLabel(
  item: DownloadItem
) {

  if (item.status === 'completed') {
    return 'Ready Offline';
  }

  if (item.status === 'paused') {
    return 'Paused';
  }

  return `${item.progress}% downloaded`;
}

export default function DownloadsScreen() {

  const { colors } =
    useTheme();

  const user =
    useSessionStore(
      (state) => state.user
    );

  const firstName =
    getFirstName(user.name);

  const downloads =
    useDownloadStore(
      (state) => state.items
    );

  const pauseDownload =
    useDownloadStore(
      (state) => state.pauseDownload
    );

  const resumeDownload =
    useDownloadStore(
      (state) => state.resumeDownload
    );

  const removeDownload =
    useDownloadStore(
      (state) => state.removeDownload
    );

  const stats =
    useMemo(() => {

      const completed =
        downloads.filter(
          (item) =>
            item.status === 'completed'
        ).length;

      return {
        completed,
      };

    }, [downloads]);

  function renderDownload({
    item,
  }: {
    item: DownloadItem;
  }) {

    const canToggle =
      item.status !== 'completed';

    return (
      <View
        style={{
          marginBottom: 18,

          borderRadius: 8,

          overflow: 'hidden',

          borderWidth: 1,
          borderColor:
            'rgba(255,255,255,0.10)',

          backgroundColor:
            'rgba(255,255,255,0.06)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <FadeInImage
            source={{
              uri:
                `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            }}
            placeholderColor="#101826"
            style={{
              width: 104,
              height: 152,
            }}
          />

          <View
            style={{
              flex: 1,
              padding: 14,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: '#FFFFFF',
                fontSize: 17,
                fontWeight: '800',
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: '#A8B3CF',
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {item.mediaType === 'series'
                ? 'Series'
                : 'Movie'}{' '}
              - {item.sizeLabel} -{' '}
              {item.original_language
                ?.toUpperCase() || 'HD'}
            </Text>

            <View
              style={{
                height: 6,
                borderRadius: 6,
                overflow: 'hidden',
                marginTop: 18,
                backgroundColor:
                  'rgba(255,255,255,0.12)',
              }}
            >
              <View
                style={{
                  width: `${item.progress}%`,
                  height: '100%',
                  borderRadius: 6,
                  backgroundColor:
                    item.status ===
                    'completed'
                      ? '#00D26A'
                      : '#4DA2FF',
                }}
              />
            </View>

            <Text
              style={{
                color:
                  item.status ===
                  'completed'
                    ? '#00D26A'
                    : colors.accent,
                fontSize: 12,
                fontWeight: '700',
                marginTop: 8,
              }}
            >
              {getStatusLabel(item)}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 14,
              }}
            >
              {canToggle && (
                <TouchableOpacity
                  onPress={() =>
                    item.status ===
                    'paused'
                      ? resumeDownload(
                        item.id
                      )
                      : pauseDownload(
                        item.id
                      )
                  }
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      'rgba(77,162,255,0.16)',
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name={
                      item.status ===
                      'paused'
                        ? 'play'
                        : 'pause'
                    }
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() =>
                  removeDownload(item.id)
                }
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    'rgba(255,77,109,0.16)',
                }}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colors.background,
      }}
    >
      <FlatList
        data={downloads}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderDownload}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View>
            <LinearGradient
              colors={[
                'rgba(77,162,255,0.24)',
                'rgba(13,22,43,0.92)',
                'rgba(11,16,32,0)',
              ]}
              style={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 26,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 32,
                  fontWeight: '900',
                }}
              >
                {firstName}'s Downloads
              </Text>

              <Text
                style={{
                  color: '#A8B3CF',
                  marginTop: 6,
                }}
              >
                Offline titles saved to this session
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 22,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor:
                      'rgba(255,255,255,0.08)',
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: '900',
                    }}
                  >
                    {downloads.length}
                  </Text>

                  <Text
                    style={{
                      color: '#A8B3CF',
                      marginTop: 4,
                    }}
                  >
                    Saved titles
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor:
                      'rgba(255,255,255,0.08)',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: '900',
                    }}
                  >
                    {stats.completed}
                  </Text>

                  <Text
                    style={{
                      color: '#A8B3CF',
                      marginTop: 4,
                    }}
                  >
                    Ready offline
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
        ListEmptyComponent={(
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 32,
              paddingTop: 80,
            }}
          >
            <View
              style={{
                width: 74,
                height: 74,
                borderRadius: 37,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  'rgba(77,162,255,0.16)',
              }}
            >
              <Ionicons
                name="download-outline"
                size={34}
                color="#FFFFFF"
              />
            </View>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: '900',
                marginTop: 18,
                textAlign: 'center',
              }}
            >
              No downloads yet
            </Text>

            <Text
              style={{
                color: '#A8B3CF',
                lineHeight: 22,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Add movies or series to make them available in {firstName}'s offline library.
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 20,
        }}
      />
    </SafeAreaView>
  );
}
