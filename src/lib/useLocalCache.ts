import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Song } from '../api/apiClient';

const CACHE_KEY = 'setlistpro_songs_cache';

export function saveCache(songs: Song[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(songs));
}

export function loadCache(): Song[] | null {
  const data = localStorage.getItem(CACHE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function useSongsCacheSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.query?.queryKey?.[0] === 'songs' &&
        event?.query?.state?.data
      ) {
        saveCache(event.query.state.data as Song[]);
      }
    });
    return () => unsubscribe();
  }, [queryClient]);
}
