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
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import { searchMovies } from '../api/tmdb';

import {
  addToWatchlist,
} from '../services/watchlist';

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
        backgroundColor: '#0B1020',
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
            color: '#FFFFFF',
            fontSize: 34,
            fontWeight: 'bold',
          }}
        >
          Search
        </Text>

        <Text
          style={{
            color: '#A8B3CF',
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

          backgroundColor: '#151C2E',

          borderRadius: 18,

          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <Ionicons
          name="search"
          size={22}
          color="#A8B3CF"
        />

        <TextInput
          value={query}

          onChangeText={setQuery}

          placeholder="Search movies..."

          placeholderTextColor="#A8B3CF"

          style={{
            color: '#FFFFFF',
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
            color="#4DA2FF"
          />

          <Text
            style={{
              color: '#FFFFFF',

              fontSize: 22,
              fontWeight: 'bold',

              marginTop: 20,
            }}
          >
            Search Movies
          </Text>

          <Text
            style={{
              color: '#A8B3CF',

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
                    backgroundColor: '#151C2E',

                    paddingHorizontal: 18,
                    paddingVertical: 10,

                    borderRadius: 30,

                    margin: 6,
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
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
            color="#4DA2FF"
          />

          <Text
            style={{
              color: '#A8B3CF',

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
            color="#4DA2FF"
          />

          <Text
            style={{
              color: '#FFFFFF',

              fontSize: 22,
              fontWeight: 'bold',

              marginTop: 20,
            }}
          >
            No Results Found
          </Text>

          <Text
            style={{
              color: '#A8B3CF',

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

        keyExtractor={(item, index) =>
          index.toString()
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}

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

              backgroundColor: '#151C2E',

              borderRadius: 20,

              overflow: 'hidden',
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
                  color: '#FFFFFF',
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
                    color: '#FFFFFF',
                    marginLeft: 6,
                  }}
                >
                  {item.vote_average?.toFixed(1)}
                </Text>
              </View>

              <Text
                numberOfLines={4}

                style={{
                  color: '#A8B3CF',

                  marginTop: 12,

                  lineHeight: 22,
                }}
              >
                {item.overview}
              </Text>
              <TouchableOpacity

                onPress={async () => {

                  await addToWatchlist(item);

                  Alert.alert(
                    'Added',
                    'Movie added to Watchlist'
                  );
                }}

                style={{
                  marginTop: 16,

                  backgroundColor: '#4DA2FF',

                  paddingVertical: 10,

                  borderRadius: 14,

                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  + Watchlist
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
