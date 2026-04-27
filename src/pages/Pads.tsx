import { usePadTheme } from '../contexts/PadThemeContext';
import { usePads } from '../contexts/PadsContext';

export default function Pads() {
  const { scale, setScale, activePad, setActivePad, volume, setVolume, fade, setFade } = usePads();
  const { theme } = usePadTheme();

  const baseNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const notes = scale === 'MAIOR' ? baseNotes : baseNotes.map(n => n + 'm');
  
  const defaultCol = theme.colors[0] || '#6B9EFA';
  
  return (
    <div className="fixed inset-0 md:inset-y-0 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:w-full md:border-x md:border-border z-40 bg-background flex flex-col overflow-hidden pb-16 safe-area-inset-bottom">
      <style>{`
        .slider-thumb-custom::-webkit-slider-thumb {
          appearance: none; width: 16px; height: 28px; border-radius: 8px;
          background: ${defaultCol}; cursor: pointer;
          box-shadow: 0 0 8px ${defaultCol}80;
        }
        .slider-thumb-custom::-moz-range-thumb {
          width: 16px; height: 28px; border: none; border-radius: 8px;
          background: ${defaultCol}; cursor: pointer;
          box-shadow: 0 0 8px ${defaultCol}80;
        }
      `}</style>
      <header className="flex justify-between items-center px-6 py-4 shrink-0"
              style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <h1 className="text-2xl font-bold tracking-tight">Pads Contínuos</h1>
      </header>

      <div className="flex-1 flex flex-col px-4 pb-4 max-w-sm mx-auto w-full gap-5">
        
        {/* Toggle Maior/Menor */}
        <div className="flex justify-center shrink-0">
          <div className="bg-card border border-border/40 rounded-full p-1 flex w-full max-w-[240px]">
            <button 
              className={`flex-1 py-2 text-[13px] tracking-wide font-bold rounded-full transition-all`}
              style={scale === 'MAIOR' ? {
                backgroundColor: `${defaultCol}33`,
                color: defaultCol,
                boxShadow: `0 0 12px ${defaultCol}20`
              } : {
                color: 'var(--muted-foreground)'
              }}
              onClick={() => setScale('MAIOR')}
            >
              MAIOR
            </button>
            <button 
              className={`flex-1 py-2 text-[13px] tracking-wide font-bold rounded-full transition-all`}
              style={scale === 'MENOR' ? {
                backgroundColor: `${defaultCol}33`,
                color: defaultCol,
                boxShadow: `0 0 12px ${defaultCol}20`
              } : {
                color: 'var(--muted-foreground)'
              }}
              onClick={() => setScale('MENOR')}
            >
              MENOR
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 grid grid-cols-3 grid-rows-4 gap-3 min-h-0">
          {notes.map((note, index) => {
            const padColor = theme.colors[index % 12];
            const isActive = activePad === note;
            
            return (
              <button
                key={note}
                onClick={() => setActivePad(isActive ? null : note)}
                className={`relative overflow-hidden rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200
                  ${isActive ? 'bg-card/10 border-2' : 'bg-card/30 border border-transparent'}
                `}
                style={{
                  backgroundColor: isActive ? `${padColor}22` : `${padColor}11`,
                  borderColor: isActive ? padColor : `${padColor}66`,
                  color: padColor,
                  textShadow: isActive ? `0 0 10px ${padColor}80` : 'none',
                  boxShadow: isActive ? `0 0 15px ${padColor}4d` : 'none'
                }}
              >
                {/* Active Pulse Animation Backdrop */}
                {isActive && (
                  <div 
                    className="absolute inset-0 animate-pulse rounded-xl" 
                    style={{ backgroundColor: `${padColor}33` }}
                  />
                )}
                <span className="relative z-10">{note}</span>
              </button>
            );
          })}
        </div>
        
        {/* Bottom Cards - Fixed Height */}
        <div className="flex gap-4 shrink-0 h-36 w-full mt-2">
          {/* Volume Card */}
          <div className="bg-card/40 border border-border rounded-3xl p-3 flex flex-col items-center flex-1 relative shadow-sm h-full">
            <span className="font-semibold text-sm mt-1 mb-2">Volume</span>
            
            <div className="relative flex-1 w-full flex justify-center items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer -rotate-90 origin-center slider-thumb-custom"
              />
            </div>
            <span className="text-xs font-medium mt-3 text-muted-foreground">{volume}%</span>
          </div>

          {/* Fade Card */}
          <div className="bg-card/40 border border-border rounded-3xl p-3 flex flex-col items-center flex-1 relative shadow-sm h-full">
            <span className="font-semibold text-sm mt-1 mb-2">Fade</span>
            
            <div className="relative flex-1 w-full flex justify-center items-center">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={fade}
                onChange={(e) => setFade(Number(e.target.value))}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer -rotate-90 origin-center slider-thumb-custom"
              />
            </div>
            <span className="text-xs font-medium mt-3 text-muted-foreground">{fade}s</span>
          </div>
        </div>

      </div>
    </div>
  );
}
