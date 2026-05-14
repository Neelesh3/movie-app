import {
  create,
} from 'zustand';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../services/watchlist';

import {
  syncWatchlistToCloud,
  getCloudWatchlist,
} from '../services/cloudWatchlist';

export type WatchlistStore = {

  items: any[];

  hydrated: boolean;

  hydrate: () => Promise<void>;

  toggle: (
    movie: any
  ) => Promise<void>;

  isSaved: (
    movieId: number
  ) => boolean;
};

export const useWatchlistStore =
  create<WatchlistStore>((
    set,
    get
  ) => ({

    items: [],

    hydrated: false,

    hydrate: async () => {

      try {

        const local =
          await getWatchlist();

        const cloud =
          await getCloudWatchlist();

        const finalList =
          cloud.length
            ? cloud
            : local;

        set({

          items:
            Array.isArray(
              finalList
            )
              ? finalList
              : [],

          hydrated: true,
        });

      } catch (error) {

        console.log(error);

        set({
          hydrated: true,
        });
      }
    },

    isSaved: (
      movieId: number
    ) => {

      return get().items.some(
        (m: any) =>
          m?.id === movieId
      );
    },

    toggle: async (
      movie: any
    ) => {

      try {

        const movieId =
          movie?.id;

        if (
          typeof movieId !==
          'number'
        ) {
          return;
        }

        const alreadySaved =
          get().isSaved(
            movieId
          );

        /* REMOVE */

        if (alreadySaved) {

          await removeFromWatchlist(
            movieId
          );

          const updatedItems =
            get().items.filter(
              (m: any) =>
                m?.id !== movieId
            );

          set({
            items:
              updatedItems,
          });

          await syncWatchlistToCloud(
            updatedItems
          );

          return;
        }

        /* ADD */

        await addToWatchlist(
          movie
        );

        const fresh =
          await getWatchlist();

        const updatedItems =
          Array.isArray(fresh)
            ? fresh
            : [];

        set({
          items:
            updatedItems,
        });

        await syncWatchlistToCloud(
          updatedItems
        );

      } catch (error) {

        console.log(error);
      }
    },
  }));