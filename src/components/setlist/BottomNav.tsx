import { Book, LayoutGrid, ListMusic, Mic, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePadTheme } from '../../contexts/PadThemeContext';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = usePadTheme();
  
  const primaryColor = theme?.colors?.[0] || '#6B9EFA';

  const tabs = [
    { path: '/', label: 'Biblioteca', icon: Book },
    { path: '/culto', label: 'Culto', icon: ListMusic },
    { path: '/ao-vivo', label: 'Ao Vivo', icon: Mic },
    { path: '/pads', label: 'Pads', icon: LayoutGrid },
    { path: '/ajustes', label: 'Ajustes', icon: Settings },
  ];

  const handleTabClick = (path: string) => {
    if (location.pathname === path) {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.3)] safe-area-inset-bottom md:left-1/2 md:-translate-x-1/2 md:max-w-md md:w-full md:border-x"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex w-full items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? '' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={isActive ? { color: primaryColor } : undefined}
              >
                <Icon strokeWidth={isActive ? 2.5 : 2} size={24} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && (
                  <span 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-lg"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
