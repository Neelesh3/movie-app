import {
  getContinueWatching,
} from './continueWatching';

import {
  getWatchlist,
} from './watchlist';

import {
  getMoviesByGenre,
} from '../api/tmdb';

export async function getRecommendedMovies() {

  try {

    const watchlist =
      await getWatchlist();

    const continueWatching =
      await getContinueWatching();

    const combined = [
      ...watchlist,
      ...continueWatching,
    ];

    if (!combined.length) {
      return [];
    }

    const genreMap:
      Record<number, number> = {};

    combined.forEach(
      (movie: any) => {

        movie.genre_ids?.forEach(
          (genreId: number) => {

            genreMap[genreId] =
              (genreMap[genreId] || 0) + 1;
          }
        );
      }
    );

    const sortedGenres =
      Object.entries(genreMap)

        .sort(
          (a, b) =>
            b[1] - a[1]
        )

        .map(
          ([genreId]) =>
            Number(genreId)
        );

    const topGenre =
      sortedGenres[0];

    if (!topGenre) {
      return [];
    }

    const movies =
      await getMoviesByGenre(
        topGenre
      );

    return movies.slice(0, 15);

  } catch (error) {

    console.log(error);

    return [];
  }
}


export async function getFavoriteGenres() {

  try {

    const watchlist =
      await getWatchlist();

    const continueWatching =
      await getContinueWatching();

    const combined = [
      ...watchlist,
      ...continueWatching,
    ];

    const genreMap:
      Record<number, number> = {};

    combined.forEach(
      (movie: any) => {

        movie.genre_ids?.forEach(
          (genreId: number) => {

            genreMap[genreId] =
              (genreMap[genreId] || 0) + 1;
          }
        );
      }
    );

    return Object.entries(genreMap)

      .sort(
        (a, b) =>
          b[1] - a[1]
      )

      .map(
        ([genreId]) =>
          Number(genreId)
      )

      .slice(0, 3);

  } catch (error) {

    console.log(error);

    return [];
  }
}