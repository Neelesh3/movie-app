import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Animated,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';

type Props =
  Omit<ImageProps, 'style'> & {
    fadeDurationMs?: number;
    placeholderColor?: string;
    source: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
  };

function FadeInImage({
  fadeDurationMs = 220,
  placeholderColor = '#07111F',
  resizeMode = 'cover',
  source,
  style,
  onLoad,
  ...props
}: Props) {

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const sourceKey =
    useMemo(() => {

      if (typeof source === 'number') {
        return source.toString();
      }

      if (Array.isArray(source)) {
        return source
          .map((item) => item.uri)
          .join('|');
      }

      return source.uri || '';

    }, [source]);

  useEffect(() => {

    opacity.setValue(0);

  }, [opacity, sourceKey]);

  const handleLoad =
    useCallback((event: any) => {

      Animated.timing(
        opacity,
        {
          toValue: 1,

          duration: fadeDurationMs,

          useNativeDriver: true,
        }
      ).start();

      if (onLoad) {
        onLoad(event);
      }

    }, [fadeDurationMs, onLoad, opacity]);

  return (
    <View
      style={[
        style,
        {
          backgroundColor:
            placeholderColor,

          overflow: 'hidden',
        },
      ]}
    >
      <Animated.Image
        {...props}

        fadeDuration={fadeDurationMs}

        onLoad={handleLoad}

        progressiveRenderingEnabled

        resizeMode={resizeMode}

        source={source}

        style={[
          StyleSheet.absoluteFill,
          {
            opacity,
          },
        ]}
      />
    </View>
  );
}

export default React.memo(FadeInImage);
