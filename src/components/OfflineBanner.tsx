import React, {
  useEffect,
  useRef,
} from 'react';

import {
  Animated,
  Text,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  useNetwork,
} from '../context/NetworkContext';

function OfflineBanner() {

  const { isOffline } =
    useNetwork();

  const translateY =
    useRef(
      new Animated.Value(-90)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {

    Animated.parallel([

      Animated.timing(
        translateY,
        {
          toValue:
            isOffline
              ? 0
              : -90,

          duration:
            isOffline
              ? 420
              : 260,

          useNativeDriver: true,
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue:
            isOffline
              ? 1
              : 0,

          duration:
            isOffline
              ? 420
              : 220,

          useNativeDriver: true,
        }
      ),
    ]).start();

  }, [isOffline, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',

        top: 0,
        left: 0,
        right: 0,

        zIndex: 100,

        opacity,

        transform: [
          {
            translateY,
          },
        ],
      }}
    >
      <LinearGradient
        colors={[
          'rgba(5,12,28,0.98)',
          'rgba(10,21,43,0.94)',
          'rgba(6,12,24,0.82)',
        ]}
        style={{
          paddingTop: 52,
          paddingBottom: 14,
          paddingHorizontal: 18,

          borderBottomWidth: 1,
          borderBottomColor:
            'rgba(77,162,255,0.22)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,

              borderRadius: 17,

              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor:
                'rgba(77,162,255,0.18)',
            }}
          >
            <Ionicons
              name="cloud-offline"
              size={18}
              color="#FFFFFF"
            />
          </View>

          <View
            style={{
              marginLeft: 12,
              flex: 1,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              You are offline
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: '#A8B3CF',
                fontSize: 12,
                marginTop: 2,
              }}
            >
              CineBluish will reconnect automatically.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default React.memo(OfflineBanner);
