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

import DownloadActionButton from '../components/DownloadActionButton';

export default function PlayerScreen() {

  const navigation: any = useNavigation();

  const { colors } = useTheme();

  const route: any = useRoute();

  const { movie } = route.params;

  const video = useRef<any>(null);
  const [trailerKey, setTrailerKey] =
    useState('');


  const [isPlaying, setIsPlaying] =
    useState(true);

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

      <View
        style={{
          width: '100%',
          height: 260,

          backgroundColor:
            colors.videoBackdrop,
        }}
      >
        <Video
          ref={video}

          source={{
            uri:
              'https://www.w3schools.com/html/mov_bbb.mp4',
          }}

          style={{
            width: '100%',
            height: '100%',
          }}

          resizeMode={
            ResizeMode.CONTAIN
          }

          shouldPlay
        />

        {/* OVERLAY */}

        <View
          style={{
            position: 'absolute',

            width: '100%',
            height: '100%',

            backgroundColor:
              'rgba(0,0,0,0.25)',

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* CONTROLS */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
            }}
          >
            {/* BACKWARD */}

            <TouchableOpacity
              style={{
                marginRight: 35,
              }}
            >
              <Ionicons
                name="play-back"
                size={34}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* PLAY */}

            <TouchableOpacity

              onPress={async () => {

                if (isPlaying) {

                  await video.current.pauseAsync();

                  setIsPlaying(false);

                } else {

                  await video.current.playAsync();

                  setIsPlaying(true);
                }
              }}

              style={{
                width: 74,
                height: 74,

                borderRadius: 37,

                backgroundColor:
                  'rgba(255,255,255,0.2)',

                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={
                  isPlaying
                    ? 'pause'
                    : 'play'
                }

                size={40}

                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* FORWARD */}

            <TouchableOpacity
              style={{
                marginLeft: 35,
              }}
            >
              <Ionicons
                name="play-forward"
                size={34}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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

              backgroundColor: '#E50914',

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
              ▶ Watch Official Trailer
            </Text>
          </TouchableOpacity>

        ) : null}

        <View
          style={{
            marginTop: 16,
            alignItems: 'flex-start',
          }}
        >
          <DownloadActionButton
            movie={movie}
            variant="wide"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 16,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,

              borderRadius: 5,

              backgroundColor: '#00D26A',

              marginRight: 8,
            }}
          />

          <Text
            style={{
              color: colors.accent,

              fontSize: 15,

              fontWeight: '600',
            }}
          >
            Live Streaming Available
          </Text>
        </View>


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
