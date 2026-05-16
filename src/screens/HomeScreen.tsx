import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import HeroBanner from '../components/HeroBanner';

import MovieRow from '../components/MovieRow';

import SkeletonCard from '../components/SkeletonCard';

import {
  getRecommendedMovies,
} from '../services/recommendations';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  getFavoriteGenres,
} from '../services/recommendations';

import {
  getMoviesByGenre,
} from '../api/tmdb';

import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getUpcomingMovies,
} from '../api/tmdb';

import {
  getContinueWatching,
} from '../services/continueWatching';

import TopTenRow from '../components/TopTenRow';

import {
  getAvatarUri,
  getFirstName,
} from '../services/session';

import {
  useSessionStore,
} from '../stores/sessionStore';

const categoryFilters = [
  'Movies',
  'Trending',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
];

export default function HomeScreen() {

  const {
    darkMode,
    colors,
  } = useTheme();

  const user =
    useSessionStore(
      (state) => state.user
    );

  const firstName =
    getFirstName(user.name);

  const [
    trendingMovies,
    setTrendingMovies,
  ] = useState<any[]>([]);

  const [
    recommendedMovies,
    setRecommendedMovies,
  ] = useState<any[]>([]);


  const [
    genreRows,
    setGenreRows,
  ] = useState<any[]>([]);

  const [
    heroMovies,
    setHeroMovies,
  ] = useState<any[]>([]);

  const [
    topRatedMovies,
    setTopRatedMovies,
  ] = useState<any[]>([]);

  const [
    popularMovies,
    setPopularMovies,
  ] = useState<any[]>([]);

  const [
    upcomingMovies,
    setUpcomingMovies,
  ] = useState<any[]>([]);

  const [
    continueWatching,
    setContinueWatching,
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {

    loadMovies();

    loadRecommendedMovies();
    async function loadGenreRows() {

      try {

        const favoriteGenres =
          await getFavoriteGenres();

        const genreMap: any = {
          28: 'Because You Like Action',
          35: 'Comedy Picks',
          27: 'Horror Nights',
          878: 'Sci-Fi Universe',
          53: 'Thriller Collection',
          80: 'Crime Stories',
          16: 'Animation World',
        };

        const rows = await Promise.all(

          favoriteGenres.map(
            async (genreId: number) => {

              const movies =
                await getMoviesByGenre(
                  genreId
                );

              return {
                title:
                  genreMap[genreId] ||
                  'Recommended Collection',

                movies:
                  movies.slice(0, 15),
              };
            }
          )
        );

        setGenreRows(rows);

      } catch (error) {

        console.log(error);
      }
    }
    loadGenreRows();
  }, []);

  async function loadMovies() {

    try {

      const trending =
        await getTrendingMovies();

      const topRated =
        await getTopRatedMovies();

      const popular =
        await getPopularMovies();

      const upcoming =
        await getUpcomingMovies();

      setTrendingMovies(trending);

      const smartHeroMovies =

        trending

          .filter(
            (movie: any) =>

              movie.vote_average >= 7
          )

          .sort(
            (a: any, b: any) =>

              b.popularity -
              a.popularity
          )

          .slice(0, 5);

      setHeroMovies(
        smartHeroMovies
      );

      setTopRatedMovies(topRated);

      setPopularMovies(popular);

      setUpcomingMovies(upcoming);

      const recent =
        await getContinueWatching();

      setContinueWatching(recent);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  }

  async function loadRecommendedMovies() {

    try {

      const data =
        await getRecommendedMovies();

      setRecommendedMovies(data);

    } catch (error) {

      console.log(error);
    }
  }

  async function handleRefresh() {

    setRefreshing(true);

    await loadMovies();

    await loadRecommendedMovies();

    setRefreshing(false);
  }

  const categoryFilterContent =
    useMemo(() => (

      categoryFilters.map((item, index) => (

        <View
          key={index}

          style={{
            backgroundColor:
              index === 0
                ? colors.accent
                : colors.surfaceMuted,

            paddingHorizontal: 18,

            paddingVertical: 10,

            borderRadius: 26,

            marginRight: 12,

            borderWidth: 1,

            borderColor:
              index === 0
                ? colors.accent
                : colors.borderSubtle,
          }}
        >
          <Text
            style={{
              color:
                index === 0
                  ? colors.onAccent
                  : colors.textPrimary,

              fontWeight: '600',

              fontSize: 13,

              letterSpacing: 0.2,
            }}
          >
            {item}
          </Text>
        </View>
      ))

    ), []);

  const movieRowsContent =
    useMemo(() => {

      if (loading) {

        return (
          <View
            style={{
              marginTop: 44,

              paddingLeft: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          </View>
        );
      }

      return (
        <>

          {continueWatching.length > 0 && (

            <MovieRow
              title="Continue Watching"
              movies={
                continueWatching
              }
            />
          )}

          {recommendedMovies.length > 0 && (

            <MovieRow
              title={
                `Recommended for ${firstName}`
              }
              movies={
                recommendedMovies
              }
            />
          )}
          {genreRows.map((row, index) => (

            <MovieRow
              key={index}

              title={row.title}

              movies={row.movies}
            />
          ))}
          <TopTenRow
            movies={trendingMovies}
          />
          <MovieRow
            title="Trending Now"
            movies={trendingMovies}
          />

          <MovieRow
            title="Top Rated"
            movies={topRatedMovies}
          />

          <MovieRow
            title="Popular Movies"
            movies={popularMovies}
          />

          <MovieRow
            title="Upcoming Releases"
            movies={upcomingMovies}
          />

        </>
      );

    }, [
      continueWatching,
      genreRows,
      loading,
      popularMovies,
      recommendedMovies,
      firstName,
      topRatedMovies,
      trendingMovies,
      upcomingMovies,
    ]);

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          colors.background,
      }}
    >
      <StatusBar
        barStyle={
          darkMode
            ? 'light-content'
            : 'dark-content'
        }
      />

      <ScrollView

        refreshControl={
          <RefreshControl
            refreshing={refreshing}

            onRefresh={
              handleRefresh
            }

            tintColor={
              colors.accent
            }
          />
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            flexDirection: 'row',

            justifyContent:
              'space-between',

            alignItems: 'center',

            paddingHorizontal: 20,

            paddingTop: 16,

            paddingBottom: 12,
          }}
        >
          <View>
            <Text
              style={{
                color:
                  colors.textPrimary,

                fontSize: 32,

                fontWeight: '800',

                letterSpacing: 0.3,
              }}
            >
              CineBluish
            </Text>

            <Text
              style={{
                color:
                  colors.textSecondary,

                marginTop: 6,

                fontSize: 12,

                fontWeight: '500',

                letterSpacing: 0.2,
              }}
            >
              Stream without limits
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              gap: 15,
            }}
          >
            <Ionicons
              name="search"

              size={24}

              color={
                colors.textPrimary
              }
            />

            <Image
              source={{
                uri:
                  getAvatarUri(
                    user.avatarId
                  ),
              }}

              style={{
                width: 42,

                height: 42,

                borderRadius: 21,
              }}
            />
          </View>
        </View>

        {/* GREETING */}

        <View
          style={{
            paddingHorizontal: 20,

            paddingTop: 28,

            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color:
                colors.textSecondary,

              fontSize: 14,

              fontWeight: '500',

              letterSpacing: 0.3,
            }}
          >
            Good evening, {firstName}
          </Text>

          <Text
            style={{
              color:
                colors.textPrimary,

              fontSize: 26,

              fontWeight: '700',

              marginTop: 8,

              letterSpacing: 0.2,
            }}
          >
            Ready to stream tonight?
          </Text>
        </View>

        {/* HERO */}

        <View style={{ marginBottom: 4 }}>
          <HeroBanner
            movies={heroMovies}
          />
        </View>

        <ScrollView
          horizontal

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={{
            paddingHorizontal: 20,

            marginTop: 36,

            marginBottom: 28,
          }}
        >
          {categoryFilterContent}
        </ScrollView>

        {movieRowsContent}

      </ScrollView>
    </SafeAreaView>
  );
}
