import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useMovieDetails } from '../features/movies/hooks/useMovieDetails';
import { useWatchlistStore } from '../features/movies/store/useWatchlistStore';
import {
  formatRuntime,
  getCertification,
  getYear,
  mapDetailToMovie,
} from '../utils/movie-detail';

// @ts-ignore
type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;


const MovieDetailsScreen: React.FC = () => {
  // @ts-ignore
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { data, isLoading, isError, refetch } = useMovieDetails(id);

  const items = useWatchlistStore(state => state.items);
  const add = useWatchlistStore(state => state.add);
  const remove = useWatchlistStore(state => state.remove);


  const director = useMemo(() => {
    if (!data?.credits?.crew) return null;
    return data.credits.crew.find((c: any) => c.job === 'Director') ?? null;
  }, [data]);

  const writer = useMemo(() => {
    if (!data?.credits?.crew) return null;
    return (
      data.credits.crew.find((c: any) =>
        ['Writer', 'Screenplay', 'Story', 'Author'].includes(c.job),
      ) ?? null
    );
  }, [data]);

  const cast = data?.credits?.cast ?? [];
  const recommendations = data?.recommendations?.results ?? [];

  // tính theo items để re-render liền
  const inWatchlist =
    data && items.length > 0
      ? items.some(m => m.id === data.id)
      : false;

  const handleToggleWatchlist = useCallback(() => {
    if (!data) return;
    const movie = mapDetailToMovie(data);
    if (inWatchlist) {
      remove(movie.id);
    } else {
      add(movie);
    }
  }, [data, inWatchlist, add, remove]);

  const handleOpenRecommendation = useCallback(
    (movieId: number) => {
      navigation.navigate('MovieDetails' as never, { id: movieId } as never);
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-3 text-slate-700">Loading movie...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-3 text-center text-slate-700">
          Failed to load movie.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="rounded-lg bg-sky-500 px-5 py-3"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#f7f7f7]">
      {/* top bar */}
      <View className="bg-[#0F7EA7] pb-5 pt-12 px-5 rounded-b-3xl">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-9 w-9 items-center justify-center rounded-full bg-white/20"
          >
            <ChevronLeft size={20} color="#fff" />
          </TouchableOpacity>
          <View className="items-center justify-center flex-1 -ml-9">
            <Text className="text-lg font-bold text-white tracking-[2px]">
              THE
            </Text>
            <Text className="-mt-1 text-lg font-bold text-white/90">
              MOVIE DB
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* hero */}
        <View className="flex-row">
          {data.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w185${data.poster_path}`,
              }}
              className="h-36 w-28 rounded-xl bg-slate-200"
            />
          ) : (
            <View className="h-36 w-28 rounded-xl bg-slate-200" />
          )}

          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-white" numberOfLines={2}>
              {data.title}{' '}
              {data.release_date ? `(${getYear(data.release_date)})` : ''}
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
              <View className="rounded-md border border-white/40 px-2 py-1">
                <Text className="text-xs font-semibold text-white">
                  {getCertification(data)}
                </Text>
              </View>
              <Text className="text-xs text-white/80">
                {data.release_date ? data.release_date : '-'}
              </Text>
              <Text className="text-xs text-white/80">•</Text>
              <Text className="text-xs text-white/80">
                {formatRuntime(data.runtime)}
              </Text>
            </View>
            <Text className="mt-2 text-xs text-white/90">
              {data.genres && data.genres.length > 0
                ? data.genres.map((g: any) => g.name).join(', ')
                : 'No genre'}
            </Text>
            <Text className="mt-1 text-xs text-white/90">
              Status:{' '}
              <Text className="font-semibold text-white">{data.status}</Text>
            </Text>
            <Text className="mt-1 text-xs text-white/90">
              Original Language:{' '}
              <Text className="font-semibold text-white">
                {data.original_language?.toUpperCase() || '-'}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* body */}
      <View className="mt-4 px-5">
        {/* user score + credits */}
        <View className="mb-5 flex-row items-start gap-4">
          <View className="items-center justify-center rounded-full bg-sky-600/80 px-4 py-4">
            <Text className="text-lg font-bold text-white">
              {data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0}
            </Text>
            <Text className="text-[10px] text-white/90 mt-1">User Score</Text>
          </View>

          <View className="flex-1 gap-1">
            {director ? (
              <View>
                <Text className="text-sm font-semibold text-slate-900">
                  {director.name}
                </Text>
                <Text className="text-xs text-slate-500">Director</Text>
              </View>
            ) : null}

            {writer ? (
              <View className="mt-2">
                <Text className="text-sm font-semibold text-slate-900">
                  {writer.name}
                </Text>
                <Text className="text-xs text-slate-500">Writer</Text>
              </View>
            ) : null}
          </View>
        </View>

        {data.tagline ? (
          <Text className="mb-2 text-base italic text-slate-600">
            {data.tagline}
          </Text>
        ) : null}

        <Text className="mb-2 text-base font-semibold text-slate-900">
          Overview
        </Text>
        <Text className="text-sm leading-5 text-slate-700">
          {data.overview || 'No overview.'}
        </Text>

        {/* Add / Remove Watchlist */}
        {inWatchlist ? (
          <TouchableOpacity
            onPress={handleToggleWatchlist}
            className="mt-5 rounded-xl bg-slate-500 py-3"
          >
            <Text className="text-center text-base font-semibold text-white">
              Remove from Watchlist
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleToggleWatchlist}
            className="mt-5 rounded-xl bg-sky-500 py-3"
          >
            <Text className="text-center text-base font-semibold text-white">
              Add to Watchlist
            </Text>
          </TouchableOpacity>
        )}

        {/* Cast members */}
        <Text className="mt-6 mb-3 text-base font-semibold text-slate-900">
          Cast members
        </Text>
        {cast.length > 0 ? (
          <FlatList
            data={cast}
            keyExtractor={item => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View className="w-32 rounded-2xl bg-white p-3 shadow-sm">
                {item.profile_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w185${item.profile_path}`,
                    }}
                    className="mb-2 h-24 w-full rounded-xl bg-slate-200"
                  />
                ) : (
                  <View className="mb-2 h-24 w-full rounded-xl bg-slate-200" />
                )}
                <Text
                  className="text-sm font-semibold text-slate-900"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-xs text-slate-500" numberOfLines={1}>
                  {item.character}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-sm text-slate-500">No cast info.</Text>
        )}

        {/* Recommended movies */}
        <Text className="mt-6 mb-3 text-base font-semibold text-slate-900">
          Recommended
        </Text>
        {recommendations.length > 0 ? (
          <FlatList
            data={recommendations}
            keyExtractor={item => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleOpenRecommendation(item.id)}
                className="w-32 rounded-2xl bg-white p-3 shadow-sm"
              >
                {item.poster_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
                    }}
                    className="mb-2 h-32 w-full rounded-xl bg-slate-200"
                  />
                ) : (
                  <View className="mb-2 h-32 w-full rounded-xl bg-slate-200" />
                )}
                <Text
                  className="text-sm font-semibold text-slate-900"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text className="text-xs text-slate-500 mt-1">
                  {item.release_date ? item.release_date.slice(0, 4) : ''}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="mb-8 text-sm text-slate-500">
            No recommended movies.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default MovieDetailsScreen;
