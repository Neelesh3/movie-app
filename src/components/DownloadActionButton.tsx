import React from 'react';

import {
  Text,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import PressScale from './PressScale';

import {
  useDownloadStore,
} from '../stores/downloadStore';

type Props = {
  movie: any;
  variant?: 'compact' | 'wide';
};

function getIconName(
  status?: string
) {

  if (status === 'completed') {
    return 'checkmark-circle';
  }

  if (status === 'paused') {
    return 'play-circle-outline';
  }

  if (status === 'downloading') {
    return 'pause-circle-outline';
  }

  return 'download-outline';
}

function getLabel(
  status?: string
) {

  if (status === 'completed') {
    return 'Downloaded';
  }

  if (status === 'paused') {
    return 'Resume';
  }

  if (status === 'downloading') {
    return 'Pause';
  }

  return 'Download';
}

function DownloadActionButton({
  movie,
  variant = 'compact',
}: Props) {

  const download =
    useDownloadStore((state) =>
      state.items.find(
        (item) =>
          item.id === movie?.id
      )
    );

  const startDownload =
    useDownloadStore(
      (state) => state.startDownload
    );

  const pauseDownload =
    useDownloadStore(
      (state) => state.pauseDownload
    );

  const resumeDownload =
    useDownloadStore(
      (state) => state.resumeDownload
    );

  const status =
    download?.status;

  const handlePress =
    async () => {

      if (!movie?.id) {
        return;
      }

      if (status === 'downloading') {
        await pauseDownload(movie.id);
        return;
      }

      if (status === 'paused') {
        await resumeDownload(movie.id);
        return;
      }

      if (!status) {
        await startDownload(movie);
      }
    };

  const isWide =
    variant === 'wide';

  return (
    <PressScale
      onPress={handlePress}
      style={{
        minWidth:
          isWide
            ? 140
            : 60,
        height: 60,

        paddingHorizontal:
          isWide
            ? 18
            : 0,

        borderRadius: 30,

        backgroundColor:
          status === 'completed'
            ? 'rgba(0,210,106,0.18)'
            : 'rgba(255,255,255,0.10)',

        borderWidth: 1,

        borderColor:
          status === 'completed'
            ? 'rgba(0,210,106,0.45)'
            : 'rgba(255,255,255,0.14)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={
          getIconName(status) as any
        }
        size={24}
        color="#FFFFFF"
      />

      {isWide && (
        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: '700',
            marginLeft: 8,
          }}
        >
          {getLabel(status)}
        </Text>
      )}
    </PressScale>
  );
}

export default React.memo(DownloadActionButton);
