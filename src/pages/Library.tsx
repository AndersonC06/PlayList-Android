import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api, Song } from '../api/apiClient';
import { useSongsCacheSync } from '../lib/useLocalCache';
import SongCard from '../components/setlist/SongCard';
import { Button } from '../components/ui/button';
import EmptyState from '../components/setlist/EmptyState';

export default function Library() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useSongsCacheSync();

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: () => api.songs.list()
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, in_playlist, playlist_order }: { id: string, in_playlist: boolean, playlist_order: number }) => {
      return api.songs.update(id, { in_playlist, playlist_order });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['songs'] });
      const previousSongs = queryClient.getQueryData<Song[]>(['songs']);
      if (previousSongs) {
        queryClient.setQueryData<Song[]>(['songs'], old => 
          old?.map(s => s.id === variables.id ? { ...s, in_playlist: variables.in_playlist, playlist_order: variables.playlist_order } : s)
        );
      }
      return { previousSongs };
    },
    onError: (err, variables, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(['songs'], context.previousSongs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.songs.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['songs'] });
      const previousSongs = queryClient.getQueryData<Song[]>(['songs']);
      if (previousSongs) {
        queryClient.setQueryData<Song[]>(['songs'], old => old?.filter(s => s.id !== id));
      }
      return { previousSongs };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['songs'] })
  });

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4"
              style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca</h1>
          <Button onClick={() => navigate('/editor')} size="sm">
            <Plus className="mr-2" size={16} /> Nova Música
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4">
        {isLoading && songs.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">Carregando músicas...</div>
        ) : songs.length === 0 ? (
          <EmptyState message="Nenhuma música cadastrada. Adicione sua primeira música!" />
        ) : (
          songs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              mode="library"
              onTogglePlaylist={() => {
                const maxOrder = Math.max(0, ...songs.filter(s => s.in_playlist).map(s => s.playlist_order || 0));
                const nextOrder = song.in_playlist ? 0 : maxOrder + 1;
                toggleMutation.mutate({ id: song.id, in_playlist: !song.in_playlist, playlist_order: nextOrder });
              }}
              onEdit={() => navigate(`/editor?id=${song.id}`)}
              onDelete={() => {
                if (window.confirm("Deseja realmente excluir esta música?")) {
                  deleteMutation.mutate(song.id);
                }
              }}
            />
          ))
        )}
      </main>
    </div>
  );
}
