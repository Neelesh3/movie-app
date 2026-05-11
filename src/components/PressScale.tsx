import React, {
  useRef,
  useCallback,
} from 'react';

import {
  Pressable,
  Animated,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type PressScaleProps = Omit<
  PressableProps,
  'style'
> & {
  style?: StyleProp<ViewStyle>;
  /** Pressed scale (1 = no change). Default 0.97 */
  scaleTo?: number;
};

/**
 * Subtle press feedback: spring scale down on press in, restore on release.
 * Uses native driver for performance.
 */
export default function PressScale({
  children,
  style,
  scaleTo = 0.97,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: PressScaleProps) {

  const scale =
    useRef(new Animated.Value(1)).current;

  const handlePressIn =
    useCallback(
      (event: Parameters<
        NonNullable<PressableProps['onPressIn']>
      >[0]>) => {

        if (!disabled) {
          Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: true,
            friction: 8,
            tension: 220,
          }).start();
        }

        onPressIn?.(event);
      },
      [
        disabled,
        onPressIn,
        scale,
        scaleTo,
      ]
    );

  const handlePressOut =
    useCallback(
      (event: Parameters<
        NonNullable<PressableProps['onPressOut']>
      >[0]>) => {

        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 220,
        }).start();

        onPressOut?.(event);
      },
      [
        onPressOut,
        scale,
      ]
    );

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                scale,
              },
            ],
          },
          style,
          disabled
            ? {
                opacity: 0.5,
              }
            : null,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
