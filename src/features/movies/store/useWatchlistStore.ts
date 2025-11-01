
import { create } from 'zustand';
import type { Movie } from '../../../types/tmdb';

type WatchlistState = {
    items: Movie[];
    add: (movie: Movie) => void;
    remove: (id: number) => void;
    has: (id: number) => boolean;
};

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
    items: [],
    add: (movie: Movie) => {
        const exists = get().items.some(m => m.id === movie.id);
        if (exists) return;
        set(state => ({
            items: [...state.items, movie],
        }));
    },
    remove: (id: number) => {
        set(state => ({
            items: state.items.filter(m => m.id !== id),
        }));
    },
    has: (id: number) => {
        return get().items.some(m => m.id === id);
    },
}));
