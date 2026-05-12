import React, {
  useCallback,
  useMemo,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import FadeInImage from './FadeInImage';

function TopTenRow({
  movies,
}: any) {

  const navigation: any =
    useNavigation();

  const topMovies =
    useMemo(
      () => movies.slice(0, 10),
      [movies]
    );

  const keyExtractor =
    useCallback((item: any) =>
      item.id.toString(),
    []);

  const renderTopMovie =
    useCallback(({
      item: movie,
      index,
    }: {
      item: any;
      index: number;
    }) => (

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
          marginRight: 24,

          flexDirection: 'row',

          alignItems: 'flex-end',
        }}
      >
        {/* NUMBER */}

        <Text
          style={{
            color: '#FFFFFF',

            fontSize: 92,

            fontWeight: 'bold',

            marginRight: -18,

            zIndex: 2,

            opacity: 0.9,
          }}
        >
          {index + 1}
        </Text>

        {/* POSTER */}

        <FadeInImage
          source={{
            uri:
              `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}

          placeholderColor="#101826"

          style={{
            width: 140,

            height: 200,

            borderRadius: 18,
          }}
        />
      </TouchableOpacity>

    ), [navigation]);

  return (
    <View
      style={{
        marginTop: 35,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',

          fontSize: 24,

          fontWeight: 'bold',

          paddingHorizontal: 20,

          marginBottom: 20,
        }}
      >
        Top 10 in CineBluish Today
      </Text>

      <FlatList
        horizontal

        data={topMovies}

        initialNumToRender={5}

        keyExtractor={keyExtractor}

        maxToRenderPerBatch={5}

        renderItem={renderTopMovie}

        showsHorizontalScrollIndicator={false}

        updateCellsBatchingPeriod={32}

        windowSize={5}

        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 10,
        }}
      />
    </View>
  );
}

export default React.memo(TopTenRow);
