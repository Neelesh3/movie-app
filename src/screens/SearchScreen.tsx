import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import { searchMovies } from '../api/tmdb';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useWatchlistStore,
} from '../stores/watchlistStore';

import PressScale from '../components/PressScale';

const DEBOUNCE_MS = 500;

const MIN_QUERY_LENGTH = 2;

export default function SearchScreen() {

  const trendingSearches = [
    'Avengers',
    'Interstellar',
    'Batman',
    'Joker',
    'Breaking Bad',
    'Inception',
  ];

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  const watchlistItems =
    useWatchlistStore((state) => state.items);

  const toggleWatchlist =
    useWatchlistStore((state) => state.toggle);

  const [query, setQuery] =
    useState('');

  const [debouncedQuery, setDebouncedQuery] =
    useState('');

  const [movies, setMovies] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const trimmedQuery =
    query.trim();

  const trimmedDebounced =
    debouncedQuery.trim();

  const waitingForDebounce =
    trimmedQuery.length >=
      MIN_QUERY_LENGTH &&
    trimmedQuery !==
      trimmedDebounced;

  useEffect(() => {

    const trimmed =
      query.trim();

    if (
      trimmed.length <
      MIN_QUERY_LENGTH
    ) {
      setDebouncedQuery(query);

      return;
    }

    const timer =
      setTimeout(() => {

        setDebouncedQuery(query);

      }, DEBOUNCE_MS);

    return () =>
      clearTimeout(timer);

  }, [query]);

  useEffect(() => {

    const trimmed =
      debouncedQuery.trim();

    if (
      trimmed.length <
      MIN_QUERY_LENGTH
    ) {
      setMovies([]);

      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    setLoading(true);

    (async () => {

      try {

        const results =
          await searchMovies(
            trimmed,
            controller.signal
          );

        if (
          !controller.signal.aborted
        ) {
          setMovies(
            Array.isArray(results)
              ? results
              : []
          );
        }

      } catch (error: unknown) {

        const name =
          error &&
          typeof error === 'object' &&
          'name' in error
            ? (error as { name?: string })
                .name
            : undefined;

        if (name === 'AbortError') {
          return;
        }

        console.log(error);

        if (
          !controller.signal.aborted
        ) {
          setMovies([]);
        }

      } finally {

        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const showSearchLoading =
    waitingForDebounce ||
    (loading &&
      trimmedDebounced.length >=
        MIN_QUERY_LENGTH);

  const showIdleSuggestions =
    movies.length === 0 &&
    !showSearchLoading &&
    trimmedQuery.length <
      MIN_QUERY_LENGTH;

  const showNoResults =
    movies.length === 0 &&
    !showSearchLoading &&
    trimmedDebounced.length >=
      MIN_QUERY_LENGTH;

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
          paddingHorizontal: 20,
          paddingTop: 15,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 34,
            fontWeight: 'bold',
          }}
        >
          Search
        </Text>

        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 5,
          }}
        >
          Discover movies & series
        </Text>
      </View>

      {/* SEARCH BAR */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',

          marginTop: 25,
          marginHorizontal: 20,

          backgroundColor: colors.surface,

          borderRadius: 18,

          paddingHorizontal: 16,
          paddingVertical: 14,

          borderWidth: 1,

          borderColor: colors.borderSubtle,
        }}
      >
        <Ionicons
          name="search"
          size={22}
          color={colors.textSecondary}
        />

        <TextInput
          value={query}

          onChangeText={setQuery}

          placeholder="Search movies..."

          placeholderTextColor={colors.textSecondary}

          style={{
            color: colors.textPrimary,
            marginLeft: 12,
            flex: 1,
          }}
        />
      </View>
      {showIdleSuggestions && (

        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',

            marginTop: 120,
          }}
        >
          <Ionicons
            name="film-outline"
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
            Search Movies
          </Text>

          <Text
            style={{
              color: colors.textSecondary,

              marginTop: 10,

              textAlign: 'center',

              paddingHorizontal: 40,

              lineHeight: 24,
            }}
          >
            Find trending movies,
            actors and shows instantly
          </Text>
          <View
            style={{
              flexDirection: 'row',

              flexWrap: 'wrap',

              justifyContent: 'center',

              marginTop: 30,

              paddingHorizontal: 20,
            }}
          >
            {trendingSearches.map(
              (item, index) => (

                <TouchableOpacity

                  key={index}

                  onPress={() =>
                    setQuery(item)
                  }

                  style={{
                    backgroundColor: colors.surface,

                    paddingHorizontal: 18,
                    paddingVertical: 10,

                    borderRadius: 30,

                    margin: 6,

                    borderWidth: 1,

                    borderColor: colors.borderSubtle,
                  }}
                >
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '500',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

      )}
      {/* RESULTS */}
      {showSearchLoading && (

        <View
          style={{
            marginTop: 80,

            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />

          <Text
            style={{
              color: colors.textSecondary,

              marginTop: 16,

              fontSize: 15,
            }}
          >
            Searching movies...
          </Text>
        </View>

      )}
      {showNoResults && (

        <View
          style={{
            alignItems: 'center',

            marginTop: 100,
          }}
        >
          <Ionicons
            name="search-outline"
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
            No Results Found
          </Text>

          <Text
            style={{
              color: colors.textSecondary,

              marginTop: 10,

              textAlign: 'center',

              paddingHorizontal: 40,
            }}
          >
            Try searching with a
            different movie name
          </Text>
        </View>

      )}
      <FlatList
        data={movies}

        keyExtractor={(item) =>
          String(item.id)
        }

        showsVerticalScrollIndicator={false}

        extraData={watchlistItems}

        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}

        renderItem={({ item }) => {

          const saved =
            watchlistItems.some(
              (m: any) =>
                m?.id === item.id
            );

          return (
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

            <Image
              source={{
                uri:
                  `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}

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
              <PressScale
                onPress={() =>
                  toggleWatchlist(item)
                }
                style={{
                  marginTop: 16,

                  flexDirection: 'row',

                  alignItems: 'center',

                  justifyContent: 'center',

                  paddingVertical: 11,

                  borderRadius: 14,

                  borderWidth: 1,

                  borderColor: saved
                    ? '#FF4D6D'
                    : colors.borderSubtle,

                  backgroundColor: saved
                    ? '#FF4D6D'
                    : 'transparent',
                }}
              >
                <Ionicons
                  name={
                    saved
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={18}
                  color={
                    saved
                      ? '#FFFFFF'
                      : colors.accent
                  }
                  style={{
                    marginRight: 8,
                  }}
                />

                <Text
                  style={{
                    color: saved
                      ? '#FFFFFF'
                      : colors.textPrimary,

                    fontWeight: '600',
                  }}
                >
                  {saved
                    ? 'Saved'
                    : 'Watchlist'}
                </Text>
              </PressScale>
            </View>
          </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
