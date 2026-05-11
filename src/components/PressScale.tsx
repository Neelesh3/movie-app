import React, {
  useRef,
} from 'react';

import {
  Animated,
  Pressable,
  PressableProps,
} from 'react-native';

type Props =
  PressableProps & {

    children:
      React.ReactNode;

    scaleTo?: number;
  };

export default function PressScale({

  children,

  scaleTo = 0.97,

  style:
    incomingStyle,

  disabled,

  onPressIn,
  onPressOut,

  ...props

}: Props) {

  const scale =
    useRef(
      new Animated.Value(1)
    ).current;

  function handlePressIn(
    event: any
  ) {

    if (!disabled) {

      Animated.spring(scale, {

        toValue:
          scaleTo,

        useNativeDriver: true,

        speed: 30,

        bounciness: 6,

      }).start();
    }

    if (onPressIn) {
      onPressIn(event);
    }
  }

  function handlePressOut(
    event: any
  ) {

    Animated.spring(scale, {

      toValue: 1,

      useNativeDriver: true,

      speed: 30,

      bounciness: 6,

    }).start();

    if (onPressOut) {
      onPressOut(event);
    }
  }

  return (

    <Pressable
      {...props}

      disabled={disabled}

      onPressIn={
        handlePressIn
      }

      onPressOut={
        handlePressOut
      }
    >
      <Animated.View
        style={[

          typeof incomingStyle ===
          'function'
            ? undefined
            : incomingStyle,

          {
            transform: [
              { scale },
            ],

            opacity:
              disabled
                ? 0.6
                : 1,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}