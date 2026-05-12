import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  ImageBackground,
  Animated,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { LinearGradient } from 'expo-linear-gradient';

import {
  useNavigation,
} from '@react-navigation/native';

import YoutubePlayer from 'react-native-youtube-iframe';

import PressScale from './PressScale';

import {
  getMovieVideos,
} from '../api/tmdb';

type Props = {
  movies: any[];
};

export default function HeroBanner({
  movies,
}: Props) {

  const navigation: any =
    useNavigation();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    trailerKey,
    setTrailerKey,
  ] = useState('');

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const fadeAnim =
  useRef(
    new Animated.Value(0)
  ).current;


  /* AUTO SLIDER */

  useEffect(() => {

    if (!movies?.length) {
      return;
    }

    const interval =
      setInterval(() => {

        setCurrentIndex((prev) =>

          prev === movies.length - 1
            ? 0
            : prev + 1
        );

      }, 12000);

    return () =>
      clearInterval(interval);

  }, [movies]);

  /* LOAD TRAILER */

  useEffect(() => {

    async function loadTrailer() {

      try {

        const movie =
          movies[currentIndex];

        if (!movie?.id) {
          return;
        }

        const videos =
          await getMovieVideos(
            movie.id
          );

        const trailer =
          videos.find(
            (item: any) =>
              item.type ===
              'Trailer'
          );

        if (trailer?.key) {

          setTrailerKey(
            trailer.key
          );

        } else {

          setTrailerKey('');
        }

      } catch (error) {

        console.log(error);

        setTrailerKey('');
      }
    }

    loadTrailer();

  }, [currentIndex, movies]);

  /* CINEMATIC ZOOM */

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          scaleAnim,
          {
            toValue: 1.08,

            duration: 8000,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scaleAnim,
          {
            toValue: 1,

            duration: 8000,

            useNativeDriver: true,
          }
        ),
      ])
    ).start();

  }, []);

  useEffect(() => {

  fadeAnim.setValue(0);

  Animated.timing(
    fadeAnim,
    {
      toValue: 1,

      duration: 1200,

      useNativeDriver: true,
    }
  ).start();

}, [currentIndex]);


  const movie =
    movies[currentIndex];

  if (!movie) {
    return null;
  }

  return (

    <Animated.View
      style={{
        height: 520,

        transform: [
          {
            scale: scaleAnim,
          },
        ],
      }}
    >
      {/* VIDEO PREVIEW */}

      {trailerKey ? (

        <YoutubePlayer
          height={520}

          play

          mute

          initialPlayerParams={{
            controls: false,

            modestbranding: true,

            rel: false,

            loop: true,
          }}

          videoId={trailerKey}
        />

      ) : (

        <ImageBackground
          source={{
            uri:
              `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
          }}

          style={{
            height: 520,
          }}
        />
      )}

      {/* OVERLAY */}

      <LinearGradient

        colors={
          trailerKey
            ? [
              'rgba(0,0,0,0.05)',
              'rgba(0,0,0,0.35)',
              'rgba(0,0,0,0.98)',
            ]
            : [
              'rgba(0,0,0,0.18)',
              'rgba(0,0,0,0.52)',
              'rgba(0,0,0,0.98)',
            ]}

        style={{
          position: 'absolute',

          width: '100%',
          height: '100%',

          justifyContent: 'flex-end',
        }}
      >
<Animated.View
  style={{
    padding: 20,

    opacity: fadeAnim,
  }}
>
          {/* TITLE */}

          <Text
            style={{
              color: '#FFFFFF',

              fontSize: 34,

              fontWeight: 'bold',

              width: '80%',
            }}
          >
            {movie.title}
          </Text>

          {/* OVERVIEW */}

          <Text
            numberOfLines={2}


            style={{
              color: '#D6D6D6',

              marginTop: 12,

              lineHeight: 22,
            }}
          >
            {movie.overview}
          </Text>
          <View
            style={{
              flexDirection: 'row',

              flexWrap: 'wrap',

              marginTop: 16,
            }}
          >
            {/* HD */}

            <View
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.14)',

                paddingHorizontal: 12,

                paddingVertical: 6,

                borderRadius: 20,

                marginRight: 10,

                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',

                  fontWeight: '600',

                  fontSize: 12,
                }}
              >
                HD
              </Text>
            </View>

            {/* RATING */}

            <View
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.14)',

                paddingHorizontal: 12,

                paddingVertical: 6,

                borderRadius: 20,

                marginRight: 10,

                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',

                  fontWeight: '600',

                  fontSize: 12,
                }}
              >
                IMDb {movie.vote_average?.toFixed(1)}
              </Text>
            </View>

            {/* ADULT */}

            {movie.adult ? (

              <View
                style={{
                  backgroundColor:
                    'rgba(255,80,80,0.18)',

                  paddingHorizontal: 12,

                  paddingVertical: 6,

                  borderRadius: 20,

                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',

                    fontWeight: '600',

                    fontSize: 12,
                  }}
                >
                  18+
                </Text>
              </View>

            ) : null}
          </View>

          {/* BUTTONS */}

          <View
            style={{
              flexDirection: 'row',

              marginTop: 25,
            }}
          >
            {/* PLAY */}

            <PressScale

              onPress={() =>
                navigation.navigate(
                  'Player',
                  {
                    movie,
                  }
                )
              }

              style={{
                backgroundColor:
                  'rgba(77,162,255,0.22)',

                borderWidth: 1,

                borderColor:
                  'rgba(255,255,255,0.15)',

                shadowColor: '#4DA2FF',

                shadowOpacity: 0.45,

                shadowRadius: 12,

                shadowOffset: {
                  width: 0,
                  height: 4,
                },

                elevation: 8,
              }}
            >
              <Ionicons
                name="play"

                size={22}

                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',

                  marginLeft: 8,

                  fontWeight: '600',
                }}
              >
                Play
              </Text>
            </PressScale>

            {/* DETAILS */}

            <PressScale

              onPress={() =>
                navigation.navigate(
                  'MovieDetail',
                  {
                    movie,
                  }
                )
              }

              style={{
                backgroundColor:
                  'rgba(255,255,255,0.12)',

                borderWidth: 1,

                borderColor:
                  'rgba(255,255,255,0.12)',



              }}
            >
              <Ionicons
                name="information-circle-outline"

                size={22}

                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',

                  marginLeft: 8,

                  fontWeight: '600',
                }}
              >
                Details
              </Text>
            </PressScale>
          </View>

          {/* INDICATORS */}

          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'center',

              marginTop: 30,

              marginBottom: 18,
            }}
          >
            {movies.map(
              (_: any, index: number) => (

                <View
                  key={index}

                  style={{
                    width:
                      currentIndex === index
                        ? 24
                        : 8,

                    height: 8,

                    borderRadius: 4,

                    backgroundColor:
                      currentIndex === index
                        ? '#4DA2FF'
                        : 'rgba(255,255,255,0.45)',

                    marginHorizontal: 4,
                  }}
                />
              )
            )}
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}