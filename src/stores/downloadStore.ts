import {
  create,
} from 'zustand';

import {
  getStoredDownloads,
  saveStoredDownloads,
} from '../services/downloads';

export type DownloadStatus =
  | 'downloading'
  | 'paused'
  | 'completed';

export type DownloadItem = {
  id: number;
  addedAt: number;
  backdrop_path?: string;
  mediaType: 'movie' | 'series';
  original_language?: string;
  poster_path?: string;
  progress: number;
  sizeLabel: string;
  status: DownloadStatus;
  title: string;
  updatedAt: number;
  vote_average?: number;
};

type DownloadStore = {
  hydrated: boolean;
  items: DownloadItem[];
  getItem: (
    id: number
  ) => DownloadItem | undefined;
  hydrate: () => Promise<void>;
  pauseDownload: (
    id: number
  ) => Promise<void>;
  removeDownload: (
    id: number
  ) => Promise<void>;
  resumeDownload: (
    id: number
  ) => Promise<void>;
  startDownload: (
    item: any
  ) => Promise<void>;
  tickDownloads: () => Promise<void>;
};

function getMediaType(
  item: any
): 'movie' | 'series' {

  return item?.media_type === 'tv' ||
    item?.first_air_date
    ? 'series'
    : 'movie';
}

function getTitle(
  item: any
) {

  return item?.title ||
    item?.name ||
    'Untitled';
}

function getSizeLabel(
  item: any
) {

  const voteAverage =
    typeof item?.vote_average === 'number'
      ? item.vote_average
      : 7;

  const size =
    0.9 + Math.min(
      Math.max(voteAverage, 1),
      10
    ) / 10;

  return `${size.toFixed(1)} GB`;
}

function normalizeDownload(
  item: any
): DownloadItem | null {

  if (
    typeof item?.id !== 'number'
  ) {
    return null;
  }

  const now =
    Date.now();

  return {
    id: item.id,
    addedAt: now,
    backdrop_path:
      item.backdrop_path,
    mediaType:
      getMediaType(item),
    original_language:
      item.original_language,
    poster_path:
      item.poster_path,
    progress: 0,
    sizeLabel:
      getSizeLabel(item),
    status: 'downloading',
    title:
      getTitle(item),
    updatedAt: now,
    vote_average:
      item.vote_average,
  };
}

function isDownloadItem(
  item: any
): item is DownloadItem {

  return typeof item?.id === 'number' &&
    typeof item?.title === 'string' &&
    typeof item?.progress === 'number' &&
    (
      item?.status === 'downloading' ||
      item?.status === 'paused' ||
      item?.status === 'completed'
    );
}

async function persist(
  items: DownloadItem[]
) {

  await saveStoredDownloads(items);
}

export const useDownloadStore =
  create<DownloadStore>((set, get) => ({

    hydrated: false,

    items: [],

    getItem: (id: number) =>
      get().items.find(
        (item) => item.id === id
      ),

    hydrate: async () => {

      const downloads =
        await getStoredDownloads();

      set({
        hydrated: true,
        items:
          downloads.filter(
            isDownloadItem
          ),
      });
    },

    pauseDownload: async (
      id: number
    ) => {

      const items =
        get().items.map((item) =>
          item.id === id &&
          item.status ===
            'downloading'
            ? {
              ...item,
              status: 'paused' as const,
              updatedAt: Date.now(),
            }
            : item
        );

      set({ items });

      await persist(items);
    },

    removeDownload: async (
      id: number
    ) => {

      const items =
        get().items.filter(
          (item) => item.id !== id
        );

      set({ items });

      await persist(items);
    },

    resumeDownload: async (
      id: number
    ) => {

      const items =
        get().items.map((item) =>
          item.id === id &&
          item.status === 'paused'
            ? {
              ...item,
              status: 'downloading' as const,
              updatedAt: Date.now(),
            }
            : item
        );

      set({ items });

      await persist(items);
    },

    startDownload: async (
      source: any
    ) => {

      const next =
        normalizeDownload(source);

      if (!next) {
        return;
      }

      const existing =
        get().getItem(next.id);

      let items: DownloadItem[];

      if (existing) {
        items =
          get().items.map((item) =>
            item.id === next.id
              ? {
                ...item,
                status:
                  item.status ===
                  'completed'
                    ? 'completed'
                    : 'downloading',
                updatedAt:
                  Date.now(),
              }
              : item
          );
      } else {
        items = [
          next,
          ...get().items,
        ];
      }

      set({ items });

      await persist(items);
    },

    tickDownloads: async () => {

      let changed = false;

      const items =
        get().items.map((item) => {

          if (
            item.status !==
            'downloading'
          ) {
            return item;
          }

          const nextProgress =
            Math.min(
              100,
              item.progress + 7
            );

          changed = true;

          return {
            ...item,
            progress:
              nextProgress,
            status:
              nextProgress >= 100
                ? 'completed' as const
                : 'downloading' as const,
            updatedAt: Date.now(),
          };
        });

      if (!changed) {
        return;
      }

      set({ items });

      await persist(items);
    },
  }));
