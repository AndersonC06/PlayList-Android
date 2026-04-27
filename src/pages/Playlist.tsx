import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import { api, Song } from '../api/apiClient';
import SongCard from '../components/setlist/SongCard';
import EmptyState from '../components/setlist/EmptyState';

export default function Playlist() {
  const queryClient = useQueryClient();
  const { data: songs = [] } = useQuery({ queryKey: ['songs'], queryFn: () => api.songs.list() });
  
  const [ordered, setOrdered] = useState<Song[]>([]);

  useEffect(() => {
    const playlistSongs = songs
      .filter(s => s.in_playlist)
      .sort((a, b) => (a.playlist_order || 0) - (b.playlist_order || 0));
    setOrdered(playlistSongs);
  }, [songs]);

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string, playlist_order: number }[]) => {
      // Update each item
      return Promise.all(updates.map(u => api.songs.update(u.id, { playlist_order: u.playlist_order })));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['songs'] })
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => api.songs.update(id, { in_playlist: false, playlist_order: 0 }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['songs'] })
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(ordered);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setOrdered(items);

    const updates = items.map((item, index) => ({
      id: item.id,
      playlist_order: index + 1
    }));

    reorderMutation.mutate(updates);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4"
              style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Culto de Hoje</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        {ordered.length === 0 ? (
          <EmptyState message="A playlist do culto está vazia. Adicione músicas da Biblioteca." />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {ordered.map((song, index) => (
                    <Draggable key={song.id} draggableId={song.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 ${snapshot.isDragging ? 'opacity-80' : ''}`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground touch-none bg-card border border-border rounded-lg"
                          >
                            <span className="text-[10px] font-bold mb-1">{index + 1}</span>
                            <GripVertical size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <SongCard
                              song={song}
                              mode="playlist"
                              onTogglePlaylist={() => toggleMutation.mutate(song.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}
