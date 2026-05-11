import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  type ListRenderItemInfo,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  setOnboardingComplete,
} from '../services/onboarding';

type SlideModel = {
  id: string;
  title: string;
  subtitle: string;
  gradient: readonly string[];
  icon: React.ComponentProps<
    typeof Ionicons
  >['name'];
};

function buildSlides(
  darkMode: boolean
): SlideModel[] {

  if (darkMode) {
    return [
      {
        id: '1',
        title: 'Welcome to CineBluish',
        subtitle:
          'Your personal cinema — thousands of stories, one beautiful home.',
        gradient: [
          '#050814',
          '#0B1020',
          '#152a52',
        ],
        icon: 'film',
      },

      {
        id: '2',
        title: 'Made for how you watch',
        subtitle:
          'Pick up where you left off, curate a watchlist, and discover what is trending.',
        gradient: [
          '#060a12',
          '#0f1c32',
          '#123d4a',
        ],
        icon: 'heart-circle-outline',
      },

      {
        id: '3',
        title: 'Lights dim. Curtain up.',
        subtitle:
          'Trailers, rich detail pages, and playback tuned for a premium living-room feel.',
        gradient: [
          '#04060c',
          '#0B1020',
          '#1a3d6e',
        ],
        icon: 'play-circle',
      },
    ];
  }

  return [
    {
      id: '1',
      title: 'Welcome to CineBluish',
      subtitle:
        'Your personal cinema — thousands of stories, one beautiful home.',
      gradient: [
        '#c9d4e8',
        '#dce4f0',
        '#b8c9e4',
      ],
      icon: 'film',
    },

    {
      id: '2',
      title: 'Made for how you watch',
      subtitle:
        'Pick up where you left off, curate a watchlist, and discover what is trending.',
      gradient: [
        '#c0cee4',
        '#d5e0ef',
        '#aec4de',
      ],
      icon: 'heart-circle-outline',
    },

    {
      id: '3',
      title: 'Lights dim. Curtain up.',
      subtitle:
        'Trailers, rich detail pages, and playback tuned for a premium living-room feel.',
      gradient: [
        '#bccae2',
        '#d8e4f4',
        '#a8c0dc',
      ],
      icon: 'play-circle',
    },
  ];
}

export default function OnboardingScreen() {

  const navigation: any =
    useNavigation();

  const {
    darkMode,
    colors,
  } = useTheme();

  const { width } =
    useWindowDimensions();

  const insets =
    useSafeAreaInsets();

  const listRef =
    useRef<FlatList<SlideModel>>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const slides =
    buildSlides(darkMode);

  const isLast =
    activeIndex === slides.length - 1;

  const finishOnboarding =
    useCallback(async () => {

      await setOnboardingComplete();

      navigation.replace('MainTabs');

    }, [navigation]);

  const goNext =
    useCallback(() => {

      if (isLast) {
        finishOnboarding();

        return;
      }

      const next =
        activeIndex + 1;

      listRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    }, [
      activeIndex,
      isLast,
      finishOnboarding,
      width,
    ]);

  const onMomentumScrollEnd =
    useCallback(
      (
        event: NativeSyntheticEvent<NativeScrollEvent>
      ) => {

        const offsetX =
          event.nativeEvent
            .contentOffset.x;

        const nextIndex =
          Math.round(offsetX / width);

        setActiveIndex(
          Math.min(
            Math.max(nextIndex, 0),
            slides.length - 1
          )
        );
      },
      [
        width,
        slides.length,
      ]
    );

  const renderItem = ({
    item,
  }: ListRenderItemInfo<SlideModel>) => (

    <View
      style={{
        width,
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[...item.gradient]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={{
          flex: 1,

          paddingHorizontal: 28,

          justifyContent: 'flex-end',

          paddingBottom: 36,
        }}
      >
        {/* Decorative glow orbs */}

        <View
          style={{
            position: 'absolute',

            top: '12%',
            right: '-8%',

            width: 220,
            height: 220,

            borderRadius: 110,

            backgroundColor:
              `${colors.accent}22`,
          }}
        />

        <View
          style={{
            position: 'absolute',

            top: '28%',
            left: '-12%',

            width: 160,
            height: 160,

            borderRadius: 80,

            backgroundColor:
              `${colors.accent}18`,
          }}
        />

        <View
          style={{
            alignItems: 'center',

            marginBottom: 48,
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,

              borderRadius: 44,

              backgroundColor:
                `${colors.accent}33`,

              borderWidth: 1,

              borderColor:
                `${colors.accent}55`,

              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name={item.icon}
              size={40}
              color={colors.accent}
            />
          </View>
        </View>

        <Text
          style={{
            color: colors.textPrimary,

            fontSize: 32,

            fontWeight: '800',

            letterSpacing: 0.3,

            lineHeight: 40,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            color: colors.textSecondary,

            marginTop: 16,

            fontSize: 17,

            lineHeight: 26,

            maxWidth: 340,
          }}
        >
          {item.subtitle}
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: colors.background,
      }}
    >
      <StatusBar
        barStyle={
          darkMode
            ? 'light-content'
            : 'dark-content'
        }
      />

      <TouchableOpacity
        onPress={finishOnboarding}
        hitSlop={{
          top: 12,
          bottom: 12,
          left: 16,
          right: 16,
        }}
        style={{
          position: 'absolute',

          top: insets.top + 8,
          right: 20,

          zIndex: 10,

          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            color: colors.textSecondary,

            fontSize: 16,

            fontWeight: '600',
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          ref={listRef}

          data={slides}

          keyExtractor={(item) =>
            item.id
          }

          horizontal

          pagingEnabled

          bounces={false}

          showsHorizontalScrollIndicator={false}

          renderItem={renderItem}

          onMomentumScrollEnd={
            onMomentumScrollEnd
          }

          onScrollToIndexFailed={({
            index,
          }) => {

            listRef.current?.scrollToOffset(
              {
                offset: index * width,
                animated: true,
              }
            );
          }}

          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}

          style={{
            flex: 1,
          }}

          extraData={width}
        />
      </View>

      <View
        style={{
          paddingHorizontal: 24,

          paddingBottom: 28,

          paddingTop: 12,

          backgroundColor: colors.background,

          borderTopWidth: 1,

          borderTopColor: colors.borderSubtle,
        }}
      >
        <View
          style={{
            flexDirection: 'row',

            justifyContent: 'center',

            alignItems: 'center',

            marginBottom: 22,
          }}
        >
          {slides.map((dot, index) => (

            <View
              key={dot.id}

              style={{
                width:
                  activeIndex === index
                    ? 26
                    : 8,

                height: 8,

                borderRadius: 4,

                marginHorizontal: 5,

                backgroundColor:
                  activeIndex === index
                    ? colors.accent
                    : `${colors.textSecondary}55`,
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}

          onPress={goNext}

          style={{
            backgroundColor: colors.accent,

            paddingVertical: 17,

            borderRadius: 50,

            alignItems: 'center',

            flexDirection: 'row',

            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: colors.onAccent,

              fontSize: 17,

              fontWeight: '700',

              marginRight: 8,
            }}
          >
            {isLast
              ? 'Get Started'
              : 'Next'}
          </Text>

          <Ionicons
            name={
              isLast
                ? 'checkmark-circle'
                : 'arrow-forward'
            }
            size={22}
            color={colors.onAccent}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
