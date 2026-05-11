import React, {
  useRef,
  useEffect,
  useState,
} from 'react';

import { getMovieVideos } from '../api/tmdb';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import * as WebBrowser from 'expo-web-browser';

import {
  Video,
  ResizeMode,
} from 'expo-av';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  saveContinueWatching,
} from '../services/continueWatching';

import {
  useTheme,
} from '../context/ThemeContext';

export default function PlayerScreen() {

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  const route: any = useRoute();

  const { movie } = route.params;

  const video = useRef<any>(null);
  const [trailerKey, setTrailerKey] =
    useState('');

  useEffect(() => {
    loadTrailer();
    saveContinueWatching(movie);
  }, []);

  async function loadTrailer() {

    try {

      const videos =
        await getMovieVideos(movie.id);

      const trailer =
        videos.find(
          (item: any) =>
            item.type === 'Trailer'
        );

      if (trailer) {
        setTrailerKey(trailer.key);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* VIDEO PLAYER */}

      <Video

        ref={video}

        source={{
          uri:
            'https://www.w3schools.com/html/mov_bbb.mp4',
        }}

        style={{
          width: '100%',
          height: 260,

          backgroundColor: colors.videoBackdrop,
        }}

        useNativeControls

        resizeMode={ResizeMode.CONTAIN}

        shouldPlay
      />

      {/* CONTENT */}

      <View
        style={{
          padding: 20,
        }}
      >
        {/* TITLE */}

        <Text
          style={{
            color: colors.textPrimary,

            fontSize: 28,
            fontWeight: 'bold',
          }}
        >
          {movie.title}
        </Text>

        {/* STREAM STATUS */}
        {/* WATCH TRAILER BUTTON */}

        {trailerKey ? (

          <TouchableOpacity

            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://www.youtube.com/watch?v=${trailerKey}`
              )
            }

            style={{
              marginTop: 25,

              backgroundColor: '#FF0000',

              paddingVertical: 14,

              borderRadius: 40,

              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Watch Official Trailer
            </Text>
          </TouchableOpacity>

        ) : null}

        <Text
          style={{
            color: colors.accent,

            marginTop: 10,

            fontSize: 15,
          }}
        >
          Streaming now...
        </Text>

        {/* OVERVIEW */}

        <Text
          style={{
            color: colors.textSecondary,

            marginTop: 20,

            lineHeight: 24,

            fontSize: 15,
          }}
        >
          {movie.overview}
        </Text>
      </View>

      {/* BACK BUTTON */}

      <TouchableOpacity

        onPress={() =>
          navigation.goBack()
        }

        style={{
          position: 'absolute',

          top: 55,
          left: 20,

          width: 42,
          height: 42,

          borderRadius: 21,

          backgroundColor: colors.overlayScrim,

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.onAccent}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}