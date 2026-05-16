import React from 'react';

import {
    View,
    Text,
    FlatList,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import PressScale from '../components/PressScale';

import MovieCard from '../components/MovieCard';

import {
    useTheme,
} from '../context/ThemeContext';

export default function CategoryMoviesScreen() {

    const navigation: any =
        useNavigation();

    const route: any =
        useRoute();

    const { colors } =
        useTheme();

    const title =
        route.params?.title ||
        'Movies';

    const movies =
        Array.isArray(
            route.params?.movies
        )
            ? route.params.movies
            : [];

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    colors.background,
            }}
        >

            {/* HEADER */}

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    paddingHorizontal: 20,
                    paddingVertical: 16,
                }}
            >

                <PressScale
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={{
                        marginRight: 14,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.textPrimary}
                    />
                </PressScale>

                <Text
                    style={{
                        color:
                            colors.textPrimary,

                        fontSize: 24,

                        fontWeight: '900',
                    }}
                >
                    {title}
                </Text>

            </View>

            {/* MOVIES */}

            <FlatList
                data={movies}

                numColumns={2}

                keyExtractor={(
                    item: any,
                    index
                ) =>
                    item?.id
                        ? item.id.toString()
                        : index.toString()
                }

                renderItem={({ item }) => (
                    <View
                        style={{
                            marginBottom: 22,
                             width: '48%',
                        }}
                    >
                        <MovieCard movie={item} />
                    </View>
                )}

                showsVerticalScrollIndicator={false}

                columnWrapperStyle={{
                    justifyContent:
                        'space-between',

                    paddingHorizontal: 20,
                }}

                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 120,
                }}
            />

        </SafeAreaView>
    );
}