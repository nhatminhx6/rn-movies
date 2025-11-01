import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useHomeMovies } from '../features/movies/hooks/useHomeMovies';
import { useMovieFilterStore } from '../features/movies/store/useMovieFilterStore';
import { Movie } from '@/types/tmdb';

type SimpleOption = {
    label: string;
    value: string;
};

const CATEGORY_OPTIONS: SimpleOption[] = [
    { label: 'Now Playing', value: 'now_playing' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Popular', value: 'popular' },
];

const SORT_OPTIONS: SimpleOption[] = [
    { label: 'By alphabetical order', value: 'alphabet' },
    { label: 'By rating', value: 'rating' },
    { label: 'By release date', value: 'release' },
];

interface DropdownProps {
    label: string;
    value: string;
    options: SimpleOption[];
    onSelect: (v: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
                                               label,
                                               value,
                                               options,
                                               onSelect,
                                           }) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label ?? label;

    return (
        <View className="mb-3 rounded-2xl bg-white shadow-sm">
            <TouchableOpacity
                className="flex-row items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
                onPress={() => setOpen(p => !p)}
                activeOpacity={0.7}
            >
                <Text className="text-base font-semibold text-slate-900">
                    {selectedLabel}
                </Text>
                <ChevronDown size={18} color="#000" />
            </TouchableOpacity>

            {open ? (
                <View className="mt-2 rounded-xl border border-gray-100 bg-white pb-2">
                    {options.map(opt => {
                        const isActive = opt.value === value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                className={`mx-2 mt-2 rounded-lg px-3 py-2 ${
                                    isActive ? 'bg-sky-500' : 'bg-slate-50'
                                }`}
                                onPress={() => {
                                    onSelect(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    className={`text-sm ${
                                        isActive ? 'text-white font-semibold' : 'text-slate-900'
                                    }`}
                                >
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
};

const PAGE_SIZE = 10;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { movies, isLoading, isError, refetch, hasRestored, onPressSearch } =
        useHomeMovies();

    const {
        category,
        sort,
        search,
        setCategory,
        setSort,
        setSearch,
        selectedMovieId,
        setSelectedMovieId,
    } = useMovieFilterStore();

    const [refreshing, setRefreshing] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch();
            setVisibleCount(PAGE_SIZE);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    const handleSelectMovie = useCallback(
        (movie: Movie) => {
            setSelectedMovieId(movie.id);
            navigation.navigate('MovieDetails' as never, { id: movie.id } as never);
        },
        [navigation, setSelectedMovieId],
    );

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<Movie>) => {
            const isSelected = item.id === selectedMovieId;
            return (
                <TouchableOpacity
                    onPress={() => handleSelectMovie(item)}
                    className={`mb-4 flex-row rounded-2xl bg-white p-3 shadow-sm ${
                        isSelected ? 'border border-slate-900 bg-slate-50' : ''
                    }`}
                >
                    {item.poster_path ? (
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
                            }}
                            className="mr-4 h-24 w-20 rounded-lg"
                        />
                    ) : (
                        <View className="mr-4 h-24 w-20 rounded-lg bg-gray-300" />
                    )}
                    <View className="flex-1 justify-between">
                        <Text
                            className="text-base font-semibold text-slate-900"
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                        <Text className="mb-1 text-xs text-slate-500">
                            {item.release_date
                                ? new Date(item.release_date).toLocaleDateString()
                                : ''}
                        </Text>
                        <Text className="text-sm text-slate-600" numberOfLines={2}>
                            {item.overview || ''}
                        </Text>
                    </View>
                    <View className="ml-2 justify-center">
                        <ChevronRight size={18} color="#555" />
                    </View>
                </TouchableOpacity>
            );
        },
        [handleSelectMovie, selectedMovieId],
    );

    const canLoadMore = movies.length > visibleCount;
    const data = movies.slice(0, visibleCount);

    return (
        <View className="flex-1 bg-[#f7f7f7]">
            <FlatList
                data={data}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                keyboardDismissMode="on-drag"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 80,
                }}
                ListHeaderComponent={
                    <View className="pt-10 pb-5">
                        <View className="mb-6 items-center">
                            <Text className="text-2xl font-bold text-[#59af9d]">THE</Text>
                            <Text className="-mt-1 text-2xl font-bold text-[#3a87b7]">
                                MOVIE DB
                            </Text>
                        </View>

                        <Dropdown
                            label="Category"
                            value={category}
                            options={CATEGORY_OPTIONS}
                            onSelect={v => {
                                setCategory(v as any);
                                setVisibleCount(PAGE_SIZE);
                            }}
                        />

                        <Dropdown
                            label="Sort by"
                            value={sort}
                            options={SORT_OPTIONS}
                            onSelect={v => {
                                setSort(v as any);
                                setVisibleCount(PAGE_SIZE);
                            }}
                        />

                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search..."
                            placeholderTextColor="#999"
                            className="mb-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900"
                        />

                        <TouchableOpacity
                            onPress={() => {
                                onPressSearch();
                                setVisibleCount(PAGE_SIZE);
                            }}
                            className="rounded-2xl bg-[#d9d9d9] py-3"
                        >
                            <Text className="text-center text-base font-semibold text-slate-800">
                                Search
                            </Text>
                        </TouchableOpacity>

                        {(isLoading || !hasRestored) && (
                            <View className="mt-3 flex-row items-center gap-2">
                                <ActivityIndicator />
                                <Text className="text-slate-800">Loading movies...</Text>
                            </View>
                        )}

                        {isError && (
                            <TouchableOpacity
                                onPress={() => {
                                    refetch();
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                className="mt-3 rounded-md bg-red-100 px-3 py-2"
                            >
                                <Text className="text-sm font-medium text-red-700">
                                    Failed to load. Tap to retry.
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                ListFooterComponent={
                    canLoadMore ? (
                        <View className="mt-4 mb-6">
                            <TouchableOpacity
                                onPress={() => setVisibleCount(c => c + PAGE_SIZE)}
                                className="rounded-lg bg-[#56AEE1] py-3"
                                activeOpacity={0.8}
                            >
                                <Text className="text-center text-base font-semibold text-white">
                                    Load More
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="mb-6" />
                    )
                }
            />
        </View>
    );
};

export default HomeScreen;
