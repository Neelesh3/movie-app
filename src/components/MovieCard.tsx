import React from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

interface MovieCardProps {
  movie: any;
}

export default function MovieCard({
  movie,
}: MovieCardProps) {

  const navigation: any = useNavigation();

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
          backgroundColor: '#151C2E',

          borderRadius: 22,

          overflow: 'hidden',

          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
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
              color: '#FFFFFF',
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