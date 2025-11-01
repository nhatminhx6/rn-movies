import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useWatchlistStore } from '../features/movies/store/useWatchlistStore';
import type { Movie } from '../types/tmdb';

const WatchlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const items = useWatchlistStore(s => s.items);
  const remove = useWatchlistStore(s => s.remove);

  const handleOpenMovie = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetails' as never, { id: movie.id } as never);
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (id: number) => {
      remove(id);
    },
    [remove],
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => {
      return (
        <View className="mb-4 flex-row rounded-2xl bg-white p-3 shadow-sm">
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
            <TouchableOpacity onPress={() => handleOpenMovie(item)}>
              <Text
                className="text-base font-semibold text-slate-900"
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            <Text className="mb-1 text-xs text-slate-500">
              {item.release_date
                ? new Date(item.release_date).toLocaleDateString()
                : ''}
            </Text>
            <Text className="text-sm text-slate-600" numberOfLines={2}>
              {item.overview || ''}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              Rating: {item.vote_average?.toFixed(1)}
            </Text>
          </View>

          <View className="ml-2 items-center justify-between">
            <TouchableOpacity onPress={() => handleOpenMovie(item)}>
              <ChevronRight size={18} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRemove(item.id)}
              className="mt-3 rounded-md bg-red-100 px-3 py-1"
            >
              <Text className="text-xs font-medium text-red-700">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleOpenMovie, handleRemove],
  );

  return (
    <View className="flex-1 bg-[#f7f7f7]">
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <View className="mb-5 items-center">
            <Text className="text-2xl font-bold text-[#59af9d]">THE</Text>
            <Text className="-mt-1 text-2xl font-bold text-[#3a87b7]">
              MOVIE DB
            </Text>
            <Text className="mt-3 text-base font-semibold text-slate-900">
              Your Watchlist
            </Text>
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-base text-slate-500">
              Your watchlist is empty.
            </Text>
            <Text className="mt-1 text-xs text-slate-400">
              Go to Home and add some movies.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default WatchlistScreen;
