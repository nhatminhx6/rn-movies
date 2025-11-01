import { create } from 'zustand';

export type MovieCategory = 'now_playing' | 'upcoming' | 'popular';
export type MovieSort = 'alphabet' | 'rating' | 'release';

type MovieFilterState = {
  category: MovieCategory;
  sort: MovieSort;
  search: string;
  setCategory: (c: MovieCategory) => void;
  setSort: (s: MovieSort) => void;
  setSearch: (v: string) => void;
  selectedMovieId: number | null;
  setSelectedMovieId: (id: number) => void;
};

export const useMovieFilterStore = create<MovieFilterState>((set) => ({
  category: 'now_playing',
  sort: 'alphabet',
  search: '',
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
  selectedMovieId: null,
  setSelectedMovieId: (id) => set({ selectedMovieId: id }),
}));
