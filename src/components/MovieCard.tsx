import React from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  useTheme,
} from '../context/ThemeContext';

interface MovieCardProps {
  movie: any;
}

export default function MovieCard({
  movie,
}: MovieCardProps) {

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  if (!movie) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}

      onPress={() =>
        navigation.navigate(
          'MovieDetail',
          {
            movie,
          }
        )
      }

      style={{
        marginRight: 16,
        width: 140,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,

          borderRadius: 22,

          overflow: 'hidden',

          borderWidth: 1,
          borderColor: colors.borderSubtle,
        }}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}

          style={{
            width: '100%',
            height: 210,
          }}
        />

        <View
          style={{
            paddingVertical: 14,
            paddingHorizontal: 10,

            alignItems: 'center',
          }}
        >
          <Text
            numberOfLines={1}

            style={{
              color: colors.textPrimary,
              fontSize: 15,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {movie.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}