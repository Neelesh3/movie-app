import { TMDB_TOKEN } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  accept: 'application/json',
};

export async function getTrendingMovies() {

  const response = await fetch(
    `${BASE_URL}/trending/movie/week`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.results;
}

export async function getTopRatedMovies() {

  const response = await fetch(
    `${BASE_URL}/movie/top_rated`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.results;
}

export async function getPopularMovies() {

  const response = await fetch(
    `${BASE_URL}/movie/popular`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.results;
}

export async function getUpcomingMovies() {

  const response = await fetch(
    `${BASE_URL}/movie/upcoming`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.results;
}
export async function searchMovies(
  query: string,
  signal?: AbortSignal
) {

  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}`,
    {
      headers,
      signal,
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return data.results ?? [];
}

export async function getMovieVideos(
  movieId: number
) {

  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/videos`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.results;
}

export async function getGenres() {

  const response = await fetch(
    `${BASE_URL}/genre/movie/list`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.genres;
}

export async function getMovieCredits(
  movieId: number
) {

  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits`,
    {
      headers,
    }
  );

  const data = await response.json();

  return data.cast;
}

export async function getSimilarMovies(
  movieId: number
) {

  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/similar`,
    {
      headers,
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return data.results ?? [];
}