import { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation, useRoute } from '@react-navigation/native';
import MovieRow from '../components/MovieRow';

import {
  useWatchlistStore,
} from '../stores/watchlistStore';
import {
  getGenres,
  getMovieCredits,
  getSimilarMovies,
} from '../api/tmdb';

import {
  useTheme,
} from '../context/ThemeContext';

import PressScale from '../components/PressScale';

export default function MovieDetailScreen() {

  const navigation: any = useNavigation();
  const route: any = useRoute();

  const { movie } = route.params;
  const { colors } = useTheme();

  const isWatchlisted =
    useWatchlistStore((state) =>
      state.items.some(
        (m: any) => m?.id === movie?.id
      )
    );

  const toggleWatchlist =
    useWatchlistStore((state) => state.toggle);


  const [genres, setGenres] =
    useState<any[]>([]);

  const [cast, setCast] =
    useState<any[]>([]);

  const [
    similarMovies,
    setSimilarMovies,
  ] = useState<any[]>([]);

  const [
    similarLoading,
    setSimilarLoading,
  ] = useState(false);

  useEffect(() => {
    loadGenres();
    loadCast();
  }, []);

  useEffect(() => {

    const movieId = movie?.id;

    if (typeof movieId !== 'number') {
      return;
    }

    let cancelled = false;

    setSimilarMovies([]);

    setSimilarLoading(true);

    async function loadSimilar() {

      try {

        const results =
          await getSimilarMovies(movieId);

        if (!cancelled) {
          const list =
            Array.isArray(results)
              ? results
              : [];

          setSimilarMovies(
            list.filter(
              (item: any) =>
                item?.id !== movieId
            )
          );
        }

      } catch (error) {

        console.log(error);

        if (!cancelled) {
          setSimilarMovies([]);
        }

      } finally {

        if (!cancelled) {
          setSimilarLoading(false);
        }
      }
    }

    loadSimilar();

    return () => {
      cancelled = true;
    };
  }, [movie?.id]);

  async function loadGenres() {

    try {

      const data =
        await getGenres();

      setGenres(data);

    } catch (error) {
      console.log(error);
    }
  }

  async function loadCast() {

    try {

      const data =
        await getMovieCredits(movie.id);

      setCast(data);

    } catch (error) {
      console.log(error);
    }
  }

  const movieGenres =
    movie.genre_ids
      ?.map((id: number) => {

        const found =
          genres.find(
            (genre: any) =>
              genre.id === id
          );

        return found?.name;
      })
      .filter(Boolean)
      .join(' • ');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* BACKDROP */}

        <View>
          <Image
            source={{
              uri:
                `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
            }}

            style={{
              width: '100%',
              height: 260,
            }}
          />

          {/* BACK BUTTON */}

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }

            style={{
              position: 'absolute',
              top: 50,
              left: 20,

              backgroundColor: colors.overlayScrim,

              width: 42,
              height: 42,

              borderRadius: 21,

              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.onAccent}
            />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}

        <View
          style={{
            padding: 20,

            backgroundColor: colors.background,
          }}
        >
          {/* TITLE */}

          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 30,
              fontWeight: 'bold',
            }}
          >
            {movie.title}
          </Text>

          {/* RATING */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              marginTop: 10,
            }}
          >
            <Ionicons
              name="star"
              size={20}
              color="#FFD700"
            />

            <Text
              style={{
                color: colors.textPrimary,
                marginLeft: 6,
                fontSize: 16,
              }}
            >
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>

          {/* GENRES */}

          <Text
            style={{
              color: colors.accent,

              marginTop: 14,

              fontSize: 15,

              fontWeight: '600',
            }}
          >
            {movieGenres}
          </Text>
          {/* META INFO */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              marginTop: 18,

              flexWrap: 'wrap',
            }}
          >
            {/* YEAR */}

            <View
              style={{
                backgroundColor: colors.chipBackground,

                paddingHorizontal: 14,
                paddingVertical: 8,

                borderRadius: 20,

                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.chipText,
                  fontWeight: '600',
                }}
              >
                {movie.release_date?.slice(0, 4)}
              </Text>
            </View>

            {/* LANGUAGE */}

            <View
              style={{
                backgroundColor: colors.chipBackground,

                paddingHorizontal: 14,
                paddingVertical: 8,

                borderRadius: 20,

                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.chipText,
                  fontWeight: '600',
                }}
              >
                {movie.original_language?.toUpperCase()}
              </Text>
            </View>

            {/* POPULARITY */}

            <View
              style={{
                backgroundColor: colors.chipBackground,

                paddingHorizontal: 14,
                paddingVertical: 8,

                borderRadius: 20,

                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.chipText,
                  fontWeight: '600',
                }}
              >
                🔥 {Math.round(movie.popularity)}
              </Text>
            </View>
          </View>
          {/* OVERVIEW */}

          <Text
            style={{
              color: colors.textSecondary,

              marginTop: 20,

              lineHeight: 26,

              fontSize: 15,
            }}
          >
            {movie.overview}
          </Text>

          {/* CAST */}

          <Text
            style={{
              color: colors.textPrimary,

              fontSize: 22,
              fontWeight: 'bold',

              marginTop: 35,
              marginBottom: 20,
            }}
          >
            Cast
          </Text>

          <ScrollView
            horizontal

            showsHorizontalScrollIndicator={false}
          >
            {(cast ?? [])
              .slice(0, 10)
              .map((actor: any) => (

                <View
                  key={actor.id}

                  style={{
                    alignItems: 'center',

                    marginRight: 18,

                    width: 80,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        `https://image.tmdb.org/t/p/w500${actor.profile_path}`,
                    }}

                    style={{
                      width: 72,
                      height: 72,

                      borderRadius: 36,
                    }}
                  />

                  <Text
                    numberOfLines={2}

                    style={{
                      color: colors.textPrimary,

                      fontSize: 12,

                      textAlign: 'center',

                      marginTop: 8,
                    }}
                  >
                    {actor.name}
                  </Text>
                </View>
              )
              )}
          </ScrollView>

          {similarLoading && (
            <View
              style={{
                marginTop: 35,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,

                  fontSize: 22,
                  fontWeight: 'bold',

                  marginBottom: 20,
                }}
              >
                Similar Movies
              </Text>

              <View
                style={{
                  alignItems: 'center',

                  paddingVertical: 28,
                }}
              >
                <ActivityIndicator
                  color={colors.accent}
                  size="small"
                />
              </View>
            </View>
          )}

          {!similarLoading &&
            similarMovies.length > 0 && (
              <MovieRow
                title="Similar Movies"
                movies={similarMovies}
              />
            )}

          {/* BUTTONS */}

          <View
            style={{
              flexDirection: 'row',

              marginTop: 30,

              gap: 15,
            }}
          >
            {/* WATCH NOW */}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Player',
                  {
                    movie,
                  }
                )
              }
              style={{
                backgroundColor: colors.accent,

                flex: 1,

                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

                paddingVertical: 16,

                borderRadius: 50,
              }}
            >
              <Ionicons
                name="play"
                size={22}
                color={colors.onAccent}
              />

              <Text
                style={{
                  color: colors.onAccent,
                  marginLeft: 8,
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                Watch Now
              </Text>
            </TouchableOpacity>

            {/* WATCHLIST */}

            <PressScale
              onPress={() =>
                toggleWatchlist(movie)
              }
              style={{
                width: 60,
                height: 60,

                borderRadius: 30,

                backgroundColor: isWatchlisted
                  ? '#FF4D6D'
                  : colors.surface,

                justifyContent: 'center',
                alignItems: 'center',

                borderWidth: 1,

                borderColor: isWatchlisted
                  ? '#FF4D6D'
                  : colors.borderSubtle,
              }}
            >
              <Ionicons
                name={
                  isWatchlisted
                    ? 'heart'
                    : 'heart-outline'
                }
                size={24}
                color={
                  isWatchlisted
                    ? '#FFFFFF'
                    : colors.textSecondary
                }
              />
            </PressScale>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}