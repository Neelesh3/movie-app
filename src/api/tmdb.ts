import { TMDB_TOKEN } from '@env';

import {
  resultsFromResponse,
  safeArray,
  safeRequest,
} from './request';

const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  accept: 'application/json',
};

function tmdbUrl(
  path: string
) {

  return `${BASE_URL}${path}`;
}

function getResults(
  path: string,
  label: string,
  signal?: AbortSignal
) {

  return safeRequest<any[]>(
    tmdbUrl(path),
    {
      fallback: [],
      headers,
      label,
      parse:
        resultsFromResponse,
      signal,
    }
  );
}

export async function getTrendingMovies() {

  return getResults(
    '/trending/movie/week',
    'getTrendingMovies'
  );
}

export async function getTopRatedMovies() {

  return getResults(
    '/movie/top_rated',
    'getTopRatedMovies'
  );
}

export async function getPopularMovies() {

  return getResults(
    '/movie/popular',
    'getPopularMovies'
  );
}

export async function getUpcomingMovies() {

  return getResults(
    '/movie/upcoming',
    'getUpcomingMovies'
  );
}

export async function searchMovies(
  query: string,
  signal?: AbortSignal
) {

  return getResults(
    `/search/movie?query=${encodeURIComponent(
      query
    )}`,
    'searchMovies',
    signal
  );
}

export async function getMovieVideos(
  movieId: number
) {

  return getResults(
    `/movie/${movieId}/videos`,
    'getMovieVideos'
  );
}

export async function getGenres() {

  return safeRequest<any[]>(
    tmdbUrl('/genre/movie/list'),
    {
      fallback: [],
      headers,
      label: 'getGenres',
      parse: (data) =>
        safeArray(data?.genres),
    }
  );
}

export async function getMovieCredits(
  movieId: number
) {

  return safeRequest<any[]>(
    tmdbUrl(`/movie/${movieId}/credits`),
    {
      fallback: [],
      headers,
      label: 'getMovieCredits',
      parse: (data) =>
        safeArray(data?.cast),
    }
  );
}

export async function getSimilarMovies(
  movieId: number
) {

  return getResults(
    `/movie/${movieId}/similar`,
    'getSimilarMovies'
  );
}

export async function getMoviesByGenre(
  genreId: number
) {

  return getResults(
    `/discover/movie?with_genres=${genreId}`,
    'getMoviesByGenre'
  );
}
