import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

interface PadsContextType {
  scale: 'MAIOR' | 'MENOR';
  setScale: (s: 'MAIOR' | 'MENOR') => void;
  activePad: string | null;
  setActivePad: (p: string | null) => void;
  volume: number;
  setVolume: (v: number) => void;
  fade: number;
  setFade: (v: number) => void;
}

const PadsContext = createContext<PadsContextType | undefined>(undefined);

export function PadsProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<'MAIOR' | 'MENOR'>('MAIOR');
  const [activePad, setActivePad] = useState<string | null>(null);
  
  const [volume, setVolumeState] = useState(100);
  const [fade, setFadeState] = useState(3);

  const volumeRef = useRef(volume);
  const fadeRef = useRef(fade);
  
  const activeHowlRef = useRef<Howl | null>(null);
  const fadingHowlsRef = useRef<Howl[]>([]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    volumeRef.current = v;
    Howler.volume(v / 100);
  };

  const setFade = (v: number) => {
    setFadeState(v);
    fadeRef.current = v;
  };

  // Initial global volume setup
  useEffect(() => {
    Howler.volume(volumeRef.current / 100);
  }, []);

  useEffect(() => {
    if (!activePad) {
      if (activeHowlRef.current) {
        const howl = activeHowlRef.current;
        const currentFade = fadeRef.current * 1000;
        
        howl.fade(howl.volume(), 0, currentFade);
        setTimeout(() => {
          howl.stop();
          howl.unload();
        }, currentFade);
        
        activeHowlRef.current = null;
      }
      return;
    }

    const noteName = activePad;
    const safeNoteName = encodeURIComponent(noteName);
    const currentFade = fadeRef.current * 1000;
    let isCancelled = false;

    // Helper to start playback once we know the extension
    const startPlayback = (ext: string) => {
      if (isCancelled) return;

      const audioUrl = `/audio/${safeNoteName}.${ext}`;
      const newHowl = new Howl({
        src: [audioUrl],
        loop: true,
        volume: 0,
        autoplay: true,
      });

      if (activeHowlRef.current) {
        const oldHowl = activeHowlRef.current;
        oldHowl.fade(oldHowl.volume(), 0, currentFade);
        fadingHowlsRef.current.push(oldHowl);
        
        setTimeout(() => {
          oldHowl.stop();
          oldHowl.unload();
          fadingHowlsRef.current = fadingHowlsRef.current.filter((h) => h !== oldHowl);
        }, currentFade);
      }

      newHowl.fade(0, 1, currentFade);
      activeHowlRef.current = newHowl;
    };

    // Check if .mp3 exists, otherwise fallback to .wav
    fetch(`/audio/${safeNoteName}.mp3`, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          startPlayback('mp3');
        } else {
          startPlayback('wav');
        }
      })
      .catch(() => {
        startPlayback('wav');
      });

    return () => {
      isCancelled = true;
    };
  }, [activePad]);

  return (
    <PadsContext.Provider value={{ scale, setScale, activePad, setActivePad, volume, setVolume, fade, setFade }}>
      {children}
    </PadsContext.Provider>
  );
}

export function usePads() {
  const context = useContext(PadsContext);
  if (context === undefined) {
    throw new Error('usePads must be used within a PadsProvider');
  }
  return context;
}
