import React from 'react';

import {
  View,
} from 'react-native';

export default function SkeletonCard() {

  return (
    <View
      style={{
        marginRight: 14,
      }}
    >
      {/* IMAGE */}

      <View
        style={{
          width: 138,
          height: 206,

          borderRadius: 20,

          backgroundColor: '#1B2236',
        }}
      />

      {/* TITLE */}

      <View
        style={{
          width: 98,
          height: 14,

          borderRadius: 10,

          backgroundColor: '#1B2236',

          marginTop: 12,
          marginLeft: 10,
        }}
      />
    </View>
  );
}