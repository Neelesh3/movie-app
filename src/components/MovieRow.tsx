import React from 'react';

import {
  View,
  Text,
  FlatList,
} from 'react-native';

import MovieCard from './MovieCard';

interface Props {
  title: string;
  movies: any[];
}

export default function MovieRow({
  title,
  movies,
}: Props) {

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
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: '#4DA2FF',
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