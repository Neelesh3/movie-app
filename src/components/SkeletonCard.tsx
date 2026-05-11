import React from 'react';

import {
  View,
} from 'react-native';

export default function SkeletonCard() {

  return (
    <View
      style={{
        marginRight: 16,
      }}
    >
      {/* IMAGE */}

      <View
        style={{
          width: 140,
          height: 210,

          borderRadius: 22,

          backgroundColor: '#1B2236',
        }}
      />

      {/* TITLE */}

      <View
        style={{
          width: 100,
          height: 16,

          borderRadius: 10,

          backgroundColor: '#1B2236',

          marginTop: 14,
          marginLeft: 10,
        }}
      />
    </View>
  );
}