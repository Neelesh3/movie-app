import {
  create,
} from 'zustand';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../services/watchlist';

export type WatchlistStore = {
  items: any[];

  hydrated: boolean;

  hydrate: () => Promise<void>;

  toggle: (movie: any) => Promise<void>;

  isSaved: (movieId: number) => boolean;
};

export const useWatchlistStore =
  create<WatchlistStore>((set, get) => ({

    items: [],

    hydrated: false,

    hydrate: async () => {

      try {

        const list =
          await getWatchlist();

        set({
          items:
            Array.isArray(list)
              ? list
              : [],

          hydrated: true,
        });

      } catch (error) {

        console.log(error);

        set({
          items: [],

          hydrated: true,
        });
      }
    },

    isSaved: (movieId: number) => {

      return get().items.some(
        (m: any) =>
          m?.id === movieId
      );
    },

    toggle: async (movie: any) => {

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
          get().isSaved(movieId);

        if (alreadySaved) {

          await removeFromWatchlist(
            movieId
          );

          set({
            items:
              get().items.filter(
                (m: any) =>
                  m?.id !== movieId
              ),
          });

          return;
        }

        await addToWatchlist(movie);

        const updatedList =
          await getWatchlist();

        set({
          items:
            Array.isArray(updatedList)
              ? updatedList
              : [],
        });

      } catch (error) {

        console.log(error);
      }
    },
  }));