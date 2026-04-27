import { GripVertical, Trash2 } from 'lucide-react';
import { SongBlock as ISongBlock } from '../../api/apiClient';
import { Button } from '../ui/button';

const BLOCK_COLORS: Record<string, string> = {
  intro: '#06b6d4',
  estrofe: '#10b981',
  refrao: '#ef4444',
  ponte: '#f59e0b'
};

interface EditBlockProps {
  block: ISongBlock;
  index: number;
  onTitleChange: (v: string) => void;
  onSubChange: (v: string) => void;
  onRemove: () => void;
  dragHandleProps: any;
  isDragging: boolean;
}

export default function EditBlock({ block, index, onTitleChange, onSubChange, onRemove, dragHandleProps, isDragging }: EditBlockProps) {
  const color = BLOCK_COLORS[block.type] || '#888';

  return (
    <div 
      className={`flex bg-card rounded-xl shadow-sm border border-border p-3 gap-3 transition-colors ${
        isDragging ? 'opacity-50 border-primary bg-secondary' : ''
      }`}
      style={{ borderLeftColor: color, borderLeftWidth: '6px' }}
    >
      <div 
        {...dragHandleProps} 
        className="flex items-center justify-center -ml-1 text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 space-y-2 min-w-0">
        <input 
          type="text" 
          value={block.title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Ex: REFRÃO"
          className="w-full bg-transparent font-bold text-lg focus:outline-none placeholder:text-muted-foreground/50 uppercase"
        />
        <input 
          type="text" 
          value={block.sub}
          onChange={e => onSubChange(e.target.value)}
          placeholder="Observação (opcional)"
          className="w-full bg-transparent text-sm text-muted-foreground focus:outline-none placeholder:text-muted-foreground/50"
        />
      </div>
      
      <div className="flex items-start">
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="text-muted-foreground hover:text-destructive -mr-1 -mt-1 h-8 w-8">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
