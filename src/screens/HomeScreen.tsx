import React, {
  useEffect,
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
  useTheme,
} from '../context/ThemeContext';

import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getUpcomingMovies,
} from '../api/tmdb';

import {
  getContinueWatching,
} from '../services/continueWatching';

export default function HomeScreen() {

  const { darkMode } =
    useTheme();

  const [trendingMovies, setTrendingMovies] =
    useState<any[]>([]);

  const [heroMovies, setHeroMovies] =
    useState<any[]>([]);

  const [topRatedMovies, setTopRatedMovies] =
    useState<any[]>([]);

  const [popularMovies, setPopularMovies] =
    useState<any[]>([]);

  const [upcomingMovies, setUpcomingMovies] =
    useState<any[]>([]);

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

      setHeroMovies(
        trending.slice(0, 5)
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

  async function handleRefresh() {

    setRefreshing(true);

    await loadMovies();

    setRefreshing(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          darkMode
            ? '#0B1020'
            : '#F5F7FB',
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
            onRefresh={handleRefresh}
            tintColor="#4DA2FF"
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
            justifyContent: 'space-between',
            alignItems: 'center',

            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <View>
            <Text
              style={{
                color:
                  darkMode
                    ? '#FFFFFF'
                    : '#111111',

                fontSize: 30,
                fontWeight: 'bold',

                letterSpacing: 1,
              }}
            >
              CineBluish
            </Text>

            <Text
              style={{
                color: '#A8B3CF',
                marginTop: 2,
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
                darkMode
                  ? '#FFFFFF'
                  : '#111111'
              }
            />

            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}

              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
              }}
            />
          </View>
        </View>

        {/* HERO */}

        <HeroBanner
          movies={heroMovies}
        />

        {loading ? (

          <View
            style={{
              marginTop: 35,
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

        ) : (

          <>

            {continueWatching.length > 0 && (

              <MovieRow
                title="Continue Watching"
                movies={continueWatching}
              />

            )}

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

        )}

      </ScrollView>
    </SafeAreaView>
  );
}