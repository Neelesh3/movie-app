import React, {
  useCallback,
} from 'react';

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

function MovieRow({
  title,
  movies,
}: Props) {

  const { colors } = useTheme();

  const keyExtractor =
    useCallback((
      item: any,
      index: number
    ) =>
      item?.id
        ? item.id.toString()
        : index.toString(),
    []);

  const getItemLayout =
    useCallback((
      _data: any,
      index: number
    ) => ({
      length: 156,
      offset: 156 * index,
      index,
    }), []);

  const renderMovie =
    useCallback(({ item }: {
      item: any;
    }) => (
      <MovieCard movie={item} />
    ), []);

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

        keyExtractor={keyExtractor}

        renderItem={renderMovie}

        getItemLayout={getItemLayout}

        initialNumToRender={6}

        maxToRenderPerBatch={6}

        showsHorizontalScrollIndicator={false}

        updateCellsBatchingPeriod={32}

        windowSize={5}

        contentContainerStyle={{
          paddingLeft: 20,
        }}
      />
    </View>
  );
}

export default React.memo(MovieRow);
