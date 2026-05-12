import {
  getContinueWatching,
} from './continueWatching';

import {
  getWatchlist,
} from './watchlist';

import {
  getMoviesByGenre,
} from '../api/tmdb';

import {
  safeArray,
} from '../api/request';

function getGenreIds(
  movie: any
) {

  return safeArray<number>(
    movie?.genre_ids
  );
}

function getTopGenres(
  movies: any[],
  limit?: number
) {

  const genreMap:
    Record<number, number> = {};

  movies.forEach(
    (movie: any) => {

      getGenreIds(movie).forEach(
        (genreId: number) => {

          genreMap[genreId] =
            (genreMap[genreId] || 0) + 1;
        }
      );
    }
  );

  const genres =
    Object.entries(genreMap)

      .sort(
        (a, b) =>
          b[1] - a[1]
      )

      .map(
        ([genreId]) =>
          Number(genreId)
      );

  return typeof limit === 'number'
    ? genres.slice(0, limit)
    : genres;
}

export async function getRecommendedMovies() {

  try {

    const watchlist =
      await getWatchlist();

    const continueWatching =
      await getContinueWatching();

    const combined = [
      ...safeArray(watchlist),
      ...safeArray(continueWatching),
    ];

    if (!combined.length) {
      return [];
    }

    const sortedGenres =
      getTopGenres(combined);

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
      ...safeArray(watchlist),
      ...safeArray(continueWatching),
    ];

    return getTopGenres(
      combined,
      3
    );

  } catch (error) {

    console.log(error);

    return [];
  }
}
