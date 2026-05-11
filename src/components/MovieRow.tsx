import React from 'react';

import {
  View,
  Text,
  FlatList,
} from 'react-native';

import MovieCard from './MovieCard';

import {
  useTheme,
} from '../context/ThemeContext';

interface Props {
  title: string;
  movies: any[];
}

export default function MovieRow({
  title,
  movies,
}: Props) {

  const { colors } = useTheme();

  return (
    <View
      style={{
        marginTop: 35,
      }}
    >
      {/* HEADER */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',

          paddingHorizontal: 20,
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.accent,
          }}
        >
          See All
        </Text>
      </View>

      {/* MOVIES */}

      <FlatList
        horizontal

        data={movies}

        keyExtractor={(item, index) =>
          index.toString()
        }

        renderItem={({ item }) => (
          <MovieCard movie={item} />
        )}

        showsHorizontalScrollIndicator={false}

        contentContainerStyle={{
          paddingLeft: 20,
        }}
      />
    </View>
  );
}