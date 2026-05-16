import React, {
  useCallback,
} from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

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

  const navigation: any =
    useNavigation();

  const { colors } =
    useTheme();

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

  function handleSeeAll() {

    navigation.navigate(
      'CategoryMovies',
      {
        title,
        movies,
      }
    );
  }

  return (
    <View
      style={{
        marginTop: 44,
      }}
    >

      {/* HEADER */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',

          paddingHorizontal: 20,
          marginBottom: 22,
        }}
      >

        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>

        <Pressable
          onPress={handleSeeAll}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            See All
          </Text>
        </Pressable>

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
          paddingRight: 20,
        }}
      />

    </View>
  );
}

export default React.memo(MovieRow);