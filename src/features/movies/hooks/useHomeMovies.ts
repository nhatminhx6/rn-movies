import { useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import {
    useMovieFilterStore,
    MovieCategory,
    MovieSort,
} from '../store/useMovieFilterStore';
import {
    getNowPlaying,
    getPopular,
    getUpcoming,
    searchMovies,
} from '../../../api/tmdb';
import type { Movie, TMDBListResponse } from '@/types/tmdb';

const STORAGE_CATEGORY_KEY = 'movie.category';
const STORAGE_SORT_KEY = 'movie.sort';

// -------------------------
// get movies by category
// -------------------------
async function getMoviesByCategory(
    category: MovieCategory,
    search: string,
): Promise<Movie[]> {
    let data: TMDBListResponse;

    if (search.trim().length > 0) {
        data = await searchMovies(search);
    } else if (category === 'popular') {
        data = await getPopular();
    } else if (category === 'upcoming') {
        data = await getUpcoming();
    } else {
        data = await getNowPlaying();
    }

    return data.results ?? [];
}

// -------------------------
// local sorting
// -------------------------
function sortMovies(list: Movie[], sort: MovieSort): Movie[] {
    const cloned = [...list];
    switch (sort) {
        case 'alphabet':
            return cloned.sort((a, b) =>
                (a.title || '').localeCompare(b.title || ''),
            );
        case 'rating':
            return cloned.sort(
                (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
            );
        case 'release':
            return cloned.sort(
                (a, b) =>
                    new Date(b.release_date ?? '1970-01-01').getTime() -
                    new Date(a.release_date ?? '1970-01-01').getTime(),
            );
        default:
            return list;
    }
}

// -------------------------
//  main hook
// -------------------------
export function useHomeMovies() {
    const { category, sort, search, setCategory, setSort, setSearch } =
        useMovieFilterStore();

    const [hasRestored, setHasRestored] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(0);

    // restore persisted filters
    useEffect(() => {
        (async () => {
            try {
                const savedCategory = await AsyncStorage.getItem(STORAGE_CATEGORY_KEY);
                const savedSort = await AsyncStorage.getItem(STORAGE_SORT_KEY);

                if (
                    savedCategory === 'now_playing' ||
                    savedCategory === 'popular' ||
                    savedCategory === 'upcoming'
                ) {
                    setCategory(savedCategory);
                }

                if (
                    savedSort === 'alphabet' ||
                    savedSort === 'rating' ||
                    savedSort === 'release'
                ) {
                    setSort(savedSort);
                }
            } finally {
                setHasRestored(true);
            }
        })();
    }, [setCategory, setSort]);

    // persist category
    useEffect(() => {
        if (!hasRestored) return;
        AsyncStorage.setItem(STORAGE_CATEGORY_KEY, category).catch(() => {});
    }, [category, hasRestored]);

    // persist sort
    useEffect(() => {
        if (!hasRestored) return;
        AsyncStorage.setItem(STORAGE_SORT_KEY, sort).catch(() => {});
    }, [sort, hasRestored]);

    // fetch movies via react-query
    const { data, isLoading, isError, refetch } = useQuery<Movie[]>({
        queryKey: ['movies', category, triggerSearch],
        queryFn: () => getMoviesByCategory(category, search),
        enabled: hasRestored,
    });

    // memoized sorted list
    const movies = useMemo(() => {
        if (!data) return [];
        return sortMovies(data, sort);
    }, [data, sort]);

    const onPressSearch = useCallback(() => {
        setTriggerSearch((n) => n + 1);
    }, []);

    return {
        category,
        sort,
        search,
        movies,
        isLoading,
        isError,
        hasRestored,
        setCategory,
        setSort,
        setSearch,
        onPressSearch,
        refetch,
    };
}
