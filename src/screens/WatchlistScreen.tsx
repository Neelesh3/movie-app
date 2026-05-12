import React from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useWatchlistStore,
} from '../stores/watchlistStore';

import FadeInImage from '../components/FadeInImage';

export default function WatchlistScreen() {

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  const movies =
    useWatchlistStore((state) => state.items);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* HEADER */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',

          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.textPrimary,

            fontSize: 28,
            fontWeight: 'bold',

            marginLeft: 18,
          }}
        >
          My Watchlist
        </Text>
      </View>

      {/* EMPTY */}

      {movies.length === 0 ? (
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="heart-outline"
            size={70}
            color={colors.accent}
          />

          <Text
            style={{
              color: colors.textPrimary,

              fontSize: 22,
              fontWeight: 'bold',

              marginTop: 20,
            }}
          >
            No Saved Movies
          </Text>

          <Text
            style={{
              color: colors.textSecondary,

              marginTop: 10,
            }}
          >
            Add movies to your watchlist
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}

          keyExtractor={(item) =>
            String(item.id)
          }

          initialNumToRender={8}

          maxToRenderPerBatch={8}

          contentContainerStyle={{
            padding: 20,
            paddingBottom: 120,
          }}

          updateCellsBatchingPeriod={32}

          windowSize={7}

          renderItem={({ item }) => (
            <TouchableOpacity

              activeOpacity={0.85}

              onPress={() =>
                navigation.navigate(
                  'MovieDetail',
                  {
                    movie: item,
                  }
                )
              }

              style={{
                flexDirection: 'row',

                marginBottom: 18,

                backgroundColor: colors.surface,

                borderRadius: 20,

                overflow: 'hidden',

                borderWidth: 1,

                borderColor: colors.borderSubtle,
              }}
            >
              {/* POSTER */}

              <FadeInImage
                source={{
                  uri:
                    `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}

                placeholderColor={
                  colors.surface
                }

                style={{
                  width: 110,
                  height: 160,
                }}
              />

              {/* INFO */}

              <View
                style={{
                  flex: 1,
                  padding: 15,
                }}
              >
                <Text
                  numberOfLines={2}

                  style={{
                    color: colors.textPrimary,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {item.title}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    marginTop: 10,
                  }}
                >
                  <Ionicons
                    name="star"
                    size={16}
                    color="#FFD700"
                  />

                  <Text
                    style={{
                      color: colors.textPrimary,
                      marginLeft: 6,
                    }}
                  >
                    {item.vote_average?.toFixed(1)}
                  </Text>
                </View>

                <Text
                  numberOfLines={4}

                  style={{
                    color: colors.textSecondary,

                    marginTop: 12,

                    lineHeight: 22,
                  }}
                >
                  {item.overview}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
