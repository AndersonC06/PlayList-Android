import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ArrowLeft, Save } from 'lucide-react';
import { api, SongBlock as ISongBlock } from '../api/apiClient';
import BlockTypeSelector from '../components/setlist/BlockTypeSelector';
import EditBlock from '../components/setlist/EditBlock';
import { Button } from '../components/ui/button';

export default function SongEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [songKey, setSongKey] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [blocks, setBlocks] = useState<ISongBlock[]>([]);

  const { data: songs } = useQuery({
    queryKey: ['songs'],
    queryFn: () => api.songs.list()
  });

  useEffect(() => {
    if (editId && songs) {
      const song = songs.find(s => s.id === editId);
      if (song) {
        setTitle(song.title);
        setSongKey(song.key || '');
        setReferenceUrl(song.reference_url || '');
        setBlocks(song.blocks || []);
      }
    }
  }, [editId, songs]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        key: songKey,
        reference_url: referenceUrl,
        blocks,
        in_playlist: false,
        playlist_order: 0
      };
      
      if (editId) {
        const existing = songs?.find(s => s.id === editId);
        return api.songs.update(editId, {
          ...payload,
          in_playlist: existing?.in_playlist ?? false,
          playlist_order: existing?.playlist_order ?? 0
        });
      } else {
        return api.songs.create(payload);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      navigate(-1); // Voltar
    }
  });

  const addBlock = (type: any, defaultTitle: string) => {
    setBlocks(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      title: defaultTitle,
      sub: ''
    }]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBlocks(items);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título é obrigatório');
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4"
              style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold">{editId ? 'Editar Música' : 'Nova Música'}</h1>
          </div>
          <Button onClick={handleSave} size="sm" disabled={saveMutation.isPending || !title.trim()}>
            <Save size={16} className="mr-2" /> Salvar
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full pb-32">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4 bg-card p-4 rounded-xl border border-border mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Título da Música *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Hosana"
                className="w-full bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tom</label>
                <input
                  type="text"
                  value={songKey}
                  onChange={e => setSongKey(e.target.value)}
                  placeholder="Ex: E, C#m"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Referência (URL)</label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={e => setReferenceUrl(e.target.value)}
                  placeholder="Youtube / Spotify"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold">Estrutura (Seções)</h2>
            <BlockTypeSelector onAdd={addBlock} />
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 mt-4">
                    {blocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <EditBlock
                              block={block}
                              index={index}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              onTitleChange={(v) => {
                                const newBlocks = [...blocks];
                                newBlocks[index].title = v;
                                setBlocks(newBlocks);
                              }}
                              onSubChange={(v) => {
                                const newBlocks = [...blocks];
                                newBlocks[index].sub = v;
                                setBlocks(newBlocks);
                              }}
                              onRemove={() => {
                                setBlocks(blocks.filter((_, i) => i !== index));
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </form>
      </main>
    </div>
  );
}
