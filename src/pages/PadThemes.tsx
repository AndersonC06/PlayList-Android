import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { padThemes } from '../lib/pad-themes';
import { usePadTheme } from '../contexts/PadThemeContext';

export default function PadThemes() {
  const navigate = useNavigate();
  const { theme: currentTheme, setTheme } = usePadTheme();

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C] flex flex-col overflow-y-auto pb-20 safe-area-inset-bottom">
      <header className="sticky top-0 z-20 bg-[#0A0A0C] px-4 py-4 flex items-center border-b border-border/5" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold tracking-tight">Temas dos Pads</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-3">
        {padThemes.map((t) => {
          const isSelected = currentTheme.id === t.id;
          const displayColors = t.colors.slice(0, 4); // Take up to 4 colors
          const isSolid = displayColors.every(c => c === displayColors[0]);

          return (
            <button 
              key={t.id} 
              onClick={() => setTheme(t)}
              className={`w-full flex items-center p-4 rounded-[1.25rem] border text-left transition-all active:scale-[0.98] ${
                isSelected 
                  ? 'bg-card/60 border-primary/50 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]' 
                  : 'bg-card/20 border-border/10 hover:border-border/30 hover:bg-card/40'
              }`}
            >
              {/* Overlapping Color Circles Preview */}
              <div className="flex -space-x-3 mr-5 shrink-0">
                {(isSolid ? [displayColors[0]] : displayColors).map((color, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-10 rounded-full border-2 border-background shadow-sm`}
                    style={{ backgroundColor: color, zIndex: 10 - i }}
                  />
                ))}
              </div>
              
              <div className="flex-1 flex flex-col min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[16px] text-foreground truncate">{t.name}</span>
                </div>
                <span className="text-[13px] text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {isSolid ? 'Cor Sólida' : 'Paleta Dinâmica'}
                </span>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground/30 bg-background/50'
              }`}>
                {isSelected && <Check size={14} className="text-primary-foreground font-bold" />}
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
