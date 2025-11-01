import { Movie } from '@/types/tmdb';

export  const formatRuntime = (min: number | null | undefined): string => {
  if (!min || Number.isNaN(min)) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const getYear = (date: string | null | undefined): string => {
  if (!date) return '';
  return date.slice(0, 4);
};

export const getCertification = (movie: any): string => {
  if (movie && typeof movie.adult === 'boolean') {
    return movie.adult ? '18+' : 'PG13';
  }
  return 'PG13';
};

export const mapDetailToMovie = (d: any): Movie => {
  return {
    id: d.id,
    title: d.title ?? '',
    overview: d.overview ?? '',
    poster_path: d.poster_path ?? null,
    backdrop_path: d.backdrop_path ?? null,
    release_date: d.release_date ?? '',
    vote_average: typeof d.vote_average === 'number' ? d.vote_average : 0,
    vote_count: typeof d.vote_count === 'number' ? d.vote_count : 0,
    popularity: typeof d.popularity === 'number' ? d.popularity : 0,
  };
};
