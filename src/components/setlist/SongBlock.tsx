import { motion, Variants } from 'motion/react';
import { SongBlock as ISongBlock } from '../../api/apiClient';

const BLOCK_COLORS: Record<string, string> = {
  intro: '#06b6d4',
  estrofe: '#10b981',
  refrao: '#ef4444',
  ponte: '#f59e0b'
};

export default function SongBlock({ block, totalBlocks, variants }: { block: ISongBlock, totalBlocks: number, variants?: Variants }) {
  const color = BLOCK_COLORS[block.type] || '#888';
  
  return (
    <motion.div 
      variants={variants}
      className="live-block-item relative w-full shadow-sm rounded-2xl flex flex-col justify-center overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm"
      style={{
        flex: 1,
        borderColor: color,
      }}
    >
      <div 
         className="absolute left-0 top-0 bottom-0 w-[6px] opacity-90" 
         style={{ backgroundColor: color }} 
      />
      
      <div 
         className="absolute left-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none" 
         style={{ background: `linear-gradient(to right, ${color}, transparent)` }} 
      />
      
      <div className="relative z-10 flex flex-col justify-center">
        <div className="font-bold tracking-tight uppercase drop-shadow-sm fluid-title">
          {block.title}
        </div>
        {block.sub && (
          <div className="text-muted-foreground/80 truncate fluid-sub">
            {block.sub}
          </div>
        )}
      </div>
    </motion.div>
  );
}
