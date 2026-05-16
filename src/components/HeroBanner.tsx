import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  Animated,
  ImageBackground,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { LinearGradient } from 'expo-linear-gradient';

import {
  useNavigation,
} from '@react-navigation/native';

import PressScale from './PressScale';

const { width } =
  Dimensions.get('window');

type Props = {
  movies: any[];
};

function HeroBanner({
  movies,
}: Props) {

  const navigation: any =
    useNavigation();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const fadeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const scrollRef =
    useRef<any>(null);

  /* AUTO SLIDER */

  useEffect(() => {

    if (!movies?.length) {
      return;
    }

    const interval =
      setInterval(() => {

        setCurrentIndex((prev) => {

          const nextIndex =
            prev === movies.length - 1
              ? 0
              : prev + 1;

          scrollRef.current?.scrollTo({
            x: nextIndex * width,

            animated: true,
          });

          return nextIndex;
        });

      }, 12000);

    return () =>
      clearInterval(interval);

  }, [movies]);

  /* CINEMATIC ZOOM */

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          scaleAnim,
          {
            toValue: 1.04,

            duration: 9000,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scaleAnim,
          {
            toValue: 1,

            duration: 9000,

            useNativeDriver: true,
          }
        ),
      ])
    ).start();

  }, []);

  /* FADE */

  useEffect(() => {

    fadeAnim.setValue(0);

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,

        duration: 700,

        useNativeDriver: true,
      }
    ).start();

  }, [currentIndex]);

  const movie =
    movies[currentIndex];

  if (!movie) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView

        ref={scrollRef}

        horizontal

        pagingEnabled

        bounces={false}

        scrollEventThrottle={16}

        decelerationRate="fast"

        snapToInterval={width}

        snapToAlignment="center"

        showsHorizontalScrollIndicator={false}

        onMomentumScrollEnd={(e) => {

          const index =
            Math.round(
              e.nativeEvent.contentOffset.x /
              width
            );

          setCurrentIndex(index);
        }}
      >
        {movies.map(
          (movie: any, index: number) => (

            <Animated.View
              key={movie.id}

              style={{
                width,

                height: 540,

                transform: [
                  {
                    scale:
                      currentIndex === index
                        ? scaleAnim
                        : 1,
                  },
                ],
              }}
            >
              <ImageBackground
                source={{
                  uri:
                    `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
                }}

                resizeMode="cover"

                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <LinearGradient

                  colors={[
                    'rgba(0,0,0,0.15)',
                    'rgba(0,0,0,0.58)',
                    'rgba(0,0,0,1)',
                  ]}

                  style={{
                    flex: 1,

                    justifyContent: 'flex-end',
                  }}
                >
                  <Animated.View
                    style={{
                      paddingHorizontal: 20,

                      paddingBottom: 48,

                      opacity:
                        currentIndex === index
                          ? fadeAnim
                          : 1,
                    }}
                  >
                    {/* TITLE */}

                    <Text
                      style={{
                        color: '#FFFFFF',

                        fontSize: 36,

                        fontWeight: '900',

                        letterSpacing: 0.3,

                        width: '70%',

                        lineHeight: 42,
                      }}
                    >
                      {movie.title}
                    </Text>

                    {/* OVERVIEW */}

                    <Text
                      numberOfLines={2}

                      style={{
                        color: '#D9D9D9',

                        marginTop: 16,

                        lineHeight: 22,

                        fontSize: 14,

                        width: '75%',

                        letterSpacing: 0.1,
                      }}
                    >
                      {movie.overview}
                    </Text>

                    {/* META */}

                    <View
                      style={{
                        flexDirection: 'row',

                        marginTop: 20,

                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor:
                            'rgba(255,255,255,0.15)',

                          paddingHorizontal: 12,

                          paddingVertical: 7,

                          borderRadius: 18,

                          borderWidth: 1,

                          borderColor:
                            'rgba(255,255,255,0.1)',
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',

                            fontWeight: '700',

                            fontSize: 12,

                            letterSpacing: 0.3,
                          }}
                        >
                          HD
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor:
                            'rgba(255,255,255,0.15)',

                          paddingHorizontal: 12,

                          paddingVertical: 7,

                          borderRadius: 18,

                          borderWidth: 1,

                          borderColor:
                            'rgba(255,255,255,0.1)',
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',

                            fontWeight: '700',

                            fontSize: 12,

                            letterSpacing: 0.3,
                          }}
                        >
                          IMDb {movie.vote_average?.toFixed(1)}
                        </Text>
                      </View>
                    </View>

                    {/* BUTTONS */}

                    <View
                      style={{
                        flexDirection: 'row',

                        marginTop: 24,

                        gap: 12,
                      }}
                    >
                      {/* PLAY */}

                      <PressScale

                        onPress={() =>
                          navigation.navigate(
                            'Player',
                            {
                              movie,
                            }
                          )
                        }

                        style={{
                          backgroundColor:
                            '#FFFFFF',

                          flexDirection: 'row',

                          alignItems: 'center',

                          justifyContent: 'center',

                          paddingHorizontal: 28,

                          height: 52,

                          borderRadius: 26,
                        }}
                      >
                        <Ionicons
                          name="play"

                          size={20}

                          color="#000000"
                        />

                        <Text
                          style={{
                            color: '#000000',

                            marginLeft: 10,

                            fontWeight: '800',

                            fontSize: 15,

                            letterSpacing: 0.2,
                          }}
                        >
                          Play
                        </Text>
                      </PressScale>

                      {/* DETAILS */}

                      <PressScale

                        onPress={() =>
                          navigation.navigate(
                            'MovieDetail',
                            {
                              movie,
                            }
                          )
                        }

                        style={{
                          backgroundColor:
                            'rgba(255,255,255,0.12)',

                          flexDirection: 'row',

                          alignItems: 'center',

                          justifyContent: 'center',

                          paddingHorizontal: 22,

                          height: 52,

                          borderRadius: 26,

                          borderWidth: 1.5,

                          borderColor:
                            'rgba(255,255,255,0.18)',
                        }}
                      >
                        <Ionicons
                          name="information-circle-outline"

                          size={20}

                          color="#FFFFFF"
                        />

                        <Text
                          style={{
                            color: '#FFFFFF',

                            marginLeft: 10,

                            fontWeight: '800',

                            fontSize: 15,

                            letterSpacing: 0.2,
                          }}
                        >
                          Details
                        </Text>
                      </PressScale>
                    </View>

                    {/* INDICATORS */}

                    <View
                      style={{
                        flexDirection: 'row',

                        justifyContent: 'center',

                        marginTop: 28,

                        paddingBottom: 4,
                      }}
                    >
                      {movies.map(
                        (_: any, dotIndex: number) => (

                          <View
                            key={dotIndex}

                            style={{
                              width:
                                currentIndex === dotIndex
                                  ? 26
                                  : 6,

                              height: 6,

                              borderRadius: 3,

                              backgroundColor:
                                currentIndex === dotIndex
                                  ? '#4DA2FF'
                                  : 'rgba(255,255,255,0.28)',

                              marginHorizontal: 5,
                            }}
                          />
                        )
                      )}
                    </View>
                  </Animated.View>
                </LinearGradient>
              </ImageBackground>
            </Animated.View>
          )
        )}
      </ScrollView>
    </>
  );
}

export default React.memo(HeroBanner);