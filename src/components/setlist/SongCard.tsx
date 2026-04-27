import { Headphones, Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import { Song } from '../../api/apiClient';
import { Button } from '../ui/button';

interface SongCardProps {
  song: Song;
  mode: 'library' | 'playlist';
  onTogglePlaylist?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SongCard({ song, mode, onTogglePlaylist, onEdit, onDelete }: SongCardProps) {
  return (
    <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg truncate whitespace-nowrap overflow-hidden">{song.title}</h3>
          {song.key && (
            <span className="px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary rounded-md shrink-0">
              {song.key}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="bg-secondary px-2 py-0.5 rounded-full">{song.blocks.length} seções</span>
          {song.reference_url && (
            <a 
              href={song.reference_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Headphones size={14} className="mr-1" /> Referência
            </a>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        {mode === 'library' && onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} className="text-muted-foreground hover:text-foreground">
            <Pencil size={18} />
          </Button>
        )}
        
        {mode === 'library' && onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={18} />
          </Button>
        )}
        
        {onTogglePlaylist && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onTogglePlaylist}
            className={song.in_playlist ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : "text-green-500 hover:bg-green-500/10 hover:text-green-500"}
          >
            {song.in_playlist ? <Minus size={20} /> : <Plus size={20} />}
          </Button>
        )}
      </div>
    </div>
  );
}
