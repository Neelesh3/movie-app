import React, {
  useCallback,
} from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
} from 'react-native';

import {
  useTheme,
} from '../context/ThemeContext';

import PressScale from './PressScale';

import FadeInImage from './FadeInImage';

interface MovieCardProps {
  movie: any;
}

function MovieCard({
  movie,
}: MovieCardProps) {

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  const handlePress =
    useCallback(() => {

      if (!movie) {
        return;
      }

      navigation.navigate(
        'MovieDetail',
        {
          movie,
        }
      );

    }, [navigation, movie]);

  if (!movie) {
    return null;
  }

  const posterUri =
    `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <PressScale
      onPress={handlePress}
      style={{
        marginRight: 14,
        width: 138,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,

          borderRadius: 20,

          overflow: 'hidden',

          borderWidth: 1,
          borderColor: colors.borderSubtle,
        }}
      >
        <FadeInImage
          source={{
            uri: posterUri,
          }}

          placeholderColor={
            colors.surface
          }

          style={{
            width: '100%',
            height: 206,
          }}
        />

        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 10,

            alignItems: 'center',
          }}
        >
          <Text
            numberOfLines={1}

            style={{
              color: colors.textPrimary,
              fontSize: 13,
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: 0.1,
            }}
          >
            {movie.title}
          </Text>
        </View>
      </View>
    </PressScale>
  );
}

export default React.memo(MovieCard);
