import { useEffect, useRef } from 'react';

export function useWakeLock(active: boolean) {
  const wakeLock = useRef<any>(null);

  useEffect(() => {
    async function requestLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }

    function releaseLock() {
      if (wakeLock.current !== null) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
    }

    if (active) {
      requestLock();
    } else {
      releaseLock();
    }

    const handleVisibilityChange = () => {
      if (active && wakeLock.current === null && document.visibilityState === 'visible') {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [active]);
}
