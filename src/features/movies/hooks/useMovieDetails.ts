import { useQuery } from '@tanstack/react-query';
import { getMovieDetailsFull }  from '../../../api/tmdb';

export const useMovieDetails = (id: number) => {
  return useQuery({
    queryKey: ['movie-detail', id],
    queryFn: () => getMovieDetailsFull(id),
  });
};