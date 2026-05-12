import {
  useEffect,
} from 'react';

import {
  useDownloadStore,
} from '../stores/downloadStore';

export default function DownloadTicker() {

  const tickDownloads =
    useDownloadStore(
      (state) => state.tickDownloads
    );

  useEffect(() => {

    const interval =
      setInterval(
        () => {
          tickDownloads();
        },
        1200
      );

    return () =>
      clearInterval(interval);

  }, [tickDownloads]);

  return null;
}
