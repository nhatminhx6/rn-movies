import axios, { AxiosResponse } from 'axios';
import { TMDB_TOKEN } from '@env';
import type {
  TMDBListResponse,
  Movie,
  TMDBCreditsResponse,
  TMDBMovieDetailsFull,
} from '@/types/tmdb';

// Axios client setup
// -------------------------
const BASE_URL = 'https://api.themoviedb.org/3';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN.trim()}`,
  },
  timeout: 20000,
  maxRedirects: 0,
});

// -------------------------
// Base fetch
// -------------------------
export async function fetchFromTMDB<T = any>(
  endpoint: string,
): Promise<T> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const res: AxiosResponse<T> = await client.get(path);
    console.log('MERA fetchFromTMDB ->', res.status, path);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error('MERA TMDB API Error:', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        url: err.config?.url,
      });
    } else {
      console.error('MERA UNKNOWN API Error:', err);
    }
    return { results: [] } as T;
  }
}

// -------------------------
// Movie endpoints
// -------------------------
export function getNowPlaying(): Promise<TMDBListResponse> {
  return fetchFromTMDB<TMDBListResponse>(
    '/movie/now_playing?language=en-US&page=1',
  );
}

export function getPopular(): Promise<TMDBListResponse> {
  return fetchFromTMDB<TMDBListResponse>(
    '/movie/popular?language=en-US&page=1',
  );
}

export function getUpcoming(): Promise<TMDBListResponse> {
  return fetchFromTMDB<TMDBListResponse>(
    '/movie/upcoming?language=en-US&page=1',
  );
}

export function getMovieDetails(id: number): Promise<Movie> {
  return fetchFromTMDB<Movie>(`/movie/${id}?language=en-US`);
}

export function getMovieCredits(id: number): Promise<TMDBCreditsResponse> {
  return fetchFromTMDB<TMDBCreditsResponse>(`/movie/${id}/credits`);
}

export function getMovieRecommendations(
  id: number,
): Promise<TMDBListResponse> {
  return fetchFromTMDB<TMDBListResponse>(
    `/movie/${id}/recommendations?language=en-US&page=1`,
  );
}

export function searchMovies(query: string): Promise<TMDBListResponse> {
  const encoded = encodeURIComponent(query);
  const url = `/search/movie?query=${encoded}&include_adult=false&language=en-US&page=1`;
  return fetchFromTMDB<TMDBListResponse>(url);
}

// -------------------------
// FULL movie detail (details + credits + recommendations)
// -------------------------

export function getMovieDetailsFull(
  id: number,
): Promise<TMDBMovieDetailsFull> {
  return fetchFromTMDB<TMDBMovieDetailsFull>(
    `/movie/${id}?language=en-US&append_to_response=credits,recommendations`,
  );
}

