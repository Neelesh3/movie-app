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

      const list =
        await getWatchlist();

      set({
        items: Array.isArray(list)
          ? list
          : [],
        hydrated: true,
      });
    },

    isSaved: (movieId: number) => {

      return get().items.some(
        (m: any) => m?.id === movieId
      );
    },

    toggle: async (movie: any) => {

      const id = movie?.id;

      if (typeof id !== 'number') {
        return;
      }

      if (get().isSaved(id)) {

        await removeFromWatchlist(id);

        set({
          items: get().items.filter(
            (m: any) => m?.id !== id
          ),
        });

        return;
      }

      await addToWatchlist(movie);

      const fresh =
        await getWatchlist();

      set({
        items: Array.isArray(fresh)
          ? fresh
          : [],
      });
    },
  }));
