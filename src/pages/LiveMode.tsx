import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api, Song } from '../api/apiClient';
import { loadCache } from '../lib/useLocalCache';
import { useWakeLock } from '../lib/useWakeLock';
import SongBlock from '../components/setlist/SongBlock';
import { Button } from '../components/ui/button';
import EmptyState from '../components/setlist/EmptyState';

export default function LiveMode() {
  useWakeLock(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigateTo = (newIndex: number) => {
    if (newIndex > currentIndex) setDirection(1);
    else if (newIndex < currentIndex) setDirection(-1);
    else setDirection(0);
    setCurrentIndex(newIndex);
  };

  const { data: serverSongs = [], isPending } = useQuery({
    queryKey: ['songs'],
    queryFn: () => api.songs.list()
  });

  const songs = isPending ? (loadCache() || serverSongs) : serverSongs;
  const playlist = songs
    .filter(s => s.in_playlist)
    .sort((a, b) => (a.playlist_order || 0) - (b.playlist_order || 0));

  useEffect(() => {
    if (playlist.length > 0 && currentIndex >= playlist.length) {
      navigateTo(Math.max(0, playlist.length - 1));
    }
  }, [playlist.length, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateTo(Math.max(0, currentIndex - 1));
      } else if (e.key === 'ArrowRight') {
        navigateTo(Math.min(playlist.length - 1, currentIndex + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playlist.length, currentIndex]);

  if (playlist.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-screen px-4 pt-12 max-w-3xl mx-auto">
        <EmptyState message="Adicione músicas na aba Culto para usar o modo Ao Vivo." />
      </div>
    );
  }

  const currentSong = playlist[currentIndex];
  const blockCount = currentSong.blocks.length;
  
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = Math.abs(touchStart.y - touchEnd.y);

    if (Math.abs(distanceX) > distanceY) {
      if (distanceX > minSwipeDistance && currentIndex < playlist.length - 1) {
        navigateTo(currentIndex + 1);
      } else if (distanceX < -minSwipeDistance && currentIndex > 0) {
        navigateTo(currentIndex - 1);
      }
    }
  };

  const containerVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : dir < 0 ? -60 : 0,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        staggerChildren: 0.05,
      }
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 60 : dir > 0 ? -60 : 0,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  const itemVariants: Variants = {
    enter: { opacity: 0, y: 15, scale: 0.96 },
    center: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
    exit: { opacity: 0 }
  };

  return (
    <div 
      className="fixed inset-0 md:inset-y-0 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:w-full md:border-x md:border-border z-40 bg-background flex flex-col pt-4 overflow-hidden pb-16 safe-area-inset-bottom"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-6 pb-4 border-b border-border/50 shrink-0"
           style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-primary/20 text-primary w-10 h-10 flex items-center justify-center rounded-lg shadow-sm">
            {currentIndex + 1}
          </span>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{currentSong.title}</h2>
            {currentSong.key && (
              <span className="text-sm font-semibold inline-block mt-0.5 text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Tom: {currentSong.key}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-xl transition-transform active:scale-95"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateTo(Math.min(playlist.length - 1, currentIndex + 1))}
            disabled={currentIndex === playlist.length - 1}
            className="w-12 h-12 rounded-xl transition-transform active:scale-95"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 pt-0" id="live-blocks-container">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSong.id}
            custom={direction}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="live-grid gap-3 max-w-6xl mx-auto w-full h-full pb-8 pt-4"
            style={{
              '--total-blocks': blockCount,
              '--landscape-rows': Math.min(5, Math.max(1, blockCount))
            } as React.CSSProperties}
          >
            {currentSong.blocks.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                Nenhuma seção cadastrada para esta música.
              </div>
            ) : (
              currentSong.blocks.map((block, idx) => (
                <SongBlock key={block.id || idx} block={block} totalBlocks={blockCount} variants={itemVariants} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
