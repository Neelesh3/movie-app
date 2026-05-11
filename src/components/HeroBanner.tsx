import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ImageBackground,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  useNavigation,
} from '@react-navigation/native';

import PressScale from './PressScale';

type Props = {
  movies: any[];
};

export default function HeroBanner({
  movies,
}: Props) {

  const navigation: any =
    useNavigation();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  useEffect(() => {

    if (!movies?.length) return;

    const interval =
      setInterval(() => {

        setCurrentIndex((prev) =>

          prev === movies.length - 1
            ? 0
            : prev + 1
        );

      }, 4000);

    return () =>
      clearInterval(interval);

  }, [movies]);

  const movie =
    movies[currentIndex];

  if (!movie) return null;

  return (
    <ImageBackground
      source={{
        uri:
          `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
      }}

      style={{
        height: 420,

        justifyContent: 'flex-end',
      }}
    >
      <LinearGradient

        colors={[
          'transparent',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.95)',
        ]}

        style={{
          flex: 1,

          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            padding: 20,
          }}
        >
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

              marginTop: 25,
            }}
          >
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
                backgroundColor: '#4DA2FF',

                flexDirection: 'row',
                alignItems: 'center',

                paddingHorizontal: 22,
                paddingVertical: 14,

                borderRadius: 40,

                marginRight: 14,
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
                  'rgba(255,255,255,0.2)',

                flexDirection: 'row',
                alignItems: 'center',

                paddingHorizontal: 22,
                paddingVertical: 14,

                borderRadius: 40,
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

          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'center',

              marginBottom: 18,
            }}
          >
            {movies.map((_: any, index: number) => (

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
                      : 'rgba(255,255,255,0.5)',

                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
