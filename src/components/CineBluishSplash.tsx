import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import { StatusBar } from 'expo-status-bar';

import {
  useTheme,
} from '../context/ThemeContext';

const INTRO_DURATION_MS = 700;

/** Minimum time from mount until exit fade begins */
const MIN_VISIBLE_MS = 1680;

const EXIT_DURATION_MS = 400;

type Props = {
  dataReady: boolean;
  onExitComplete: () => void;
};

export default function CineBluishSplash({
  dataReady,
  onExitComplete,
}: Props) {

  const { colors } = useTheme();

  const logoOpacity =
    useRef(new Animated.Value(0)).current;

  const logoScale =
    useRef(new Animated.Value(0.88)).current;

  const glowOpacity =
    useRef(new Animated.Value(0.2)).current;

  const shellOpacity =
    useRef(new Animated.Value(1)).current;

  const [
    introDone,
    setIntroDone,
  ] = useState(false);

  const exitStartedRef =
    useRef(false);

  const startTimeRef =
    useRef(Date.now());

  const handleExit =
    useCallback(() => {

      Animated.timing(shellOpacity, {
        toValue: 0,
        duration: EXIT_DURATION_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onExitComplete();
      });
    }, [
      onExitComplete,
      shellOpacity,
    ]);

  useEffect(() => {

    startTimeRef.current = Date.now();

    const glowLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.48,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.18,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

    glowLoop.start();

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: INTRO_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 78,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIntroDone(true);
    });

    return () => {
      glowLoop.stop();
    };
  }, [
    glowOpacity,
    logoOpacity,
    logoScale,
  ]);

  useEffect(() => {

    if (
      !introDone ||
      !dataReady ||
      exitStartedRef.current
    ) {
      return;
    }

    exitStartedRef.current = true;

    const elapsed =
      Date.now() -
      startTimeRef.current;

    const waitBeforeExit =
      Math.max(
        0,
        MIN_VISIBLE_MS - elapsed
      );

    const timer =
      setTimeout(() => {
        handleExit();
      }, waitBeforeExit);

    return () =>
      clearTimeout(timer);
  }, [
    introDone,
    dataReady,
    handleExit,
  ]);

  return (
    <Animated.View
      style={[
        styles.shell,
        {
          opacity: shellOpacity,
        },
      ]}
    >
      <StatusBar style="light" />

      <LinearGradient
        colors={[
          '#03050c',
          '#0B1020',
          '#0a1428',
        ]}
        start={{
          x: 0.2,
          y: 0,
        }}
        end={{
          x: 0.85,
          y: 1,
        }}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={styles.glowStack}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.glowBlob,
            {
              backgroundColor: colors.accent,

              opacity: glowOpacity,
            },
          ]}
        />

        <View
          style={[
            styles.glowBlob,
            styles.glowOuter,
            {
              borderColor: `${colors.accent}55`,
            },
          ]}
        />
      </View>

      <View
        style={styles.centerContent}
      >
        <Animated.View
          style={{
            opacity: logoOpacity,

            transform: [
              {
                scale: logoScale,
              },
            ],

            alignItems: 'center',
          }}
        >
          <Text
            style={styles.logoText}
          >
            CineBluish
          </Text>

          <Text style={styles.tagline}>
            Stream without limits
          </Text>
        </Animated.View>

        {!dataReady && introDone ? (
          <Text style={styles.loadingHint}>
            Loading…
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 1000,

    justifyContent: 'center',
    alignItems: 'center',
  },

  glowStack: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',
    alignItems: 'center',
  },

  glowBlob: {
    position: 'absolute',

    width: 300,
    height: 300,

    borderRadius: 150,
  },

  glowOuter: {
    width: 360,
    height: 360,

    borderRadius: 180,

    borderWidth: 1,

    backgroundColor: 'transparent',

    opacity: 0.28,
  },

  centerContent: {
    alignItems: 'center',

    paddingHorizontal: 32,
  },

  logoText: {
    color: '#FFFFFF',

    fontSize: 40,

    fontWeight: '800',

    letterSpacing: 2,

    textShadowColor: 'rgba(77,162,255,0.5)',

    textShadowOffset: {
      width: 0,
      height: 0,
    },

    textShadowRadius: 20,
  },

  tagline: {
    marginTop: 14,

    fontSize: 16,

    fontWeight: '500',

    letterSpacing: 0.4,

    color: '#A8B3CF',
  },

  loadingHint: {
    marginTop: 36,

    fontSize: 14,

    fontWeight: '500',

    opacity: 0.85,

    color: '#A8B3CF',
  },
});
