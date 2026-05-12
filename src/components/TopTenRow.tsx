import React from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

export default function TopTenRow({
  movies,
}: any) {

  const navigation: any =
    useNavigation();

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

      <ScrollView
        horizontal

        showsHorizontalScrollIndicator={false}

        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 10,
        }}
      >
        {movies
          .slice(0, 10)
          .map(
            (
              movie: any,
              index: number
            ) => (

              <TouchableOpacity

                key={movie.id}

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

                <Image
                  source={{
                    uri:
                      `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}

                  style={{
                    width: 140,

                    height: 200,

                    borderRadius: 18,
                  }}
                />
              </TouchableOpacity>
            )
          )}
      </ScrollView>
    </View>
  );
}