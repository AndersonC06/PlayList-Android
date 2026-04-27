import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppConfig() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto pb-20 safe-area-inset-bottom">
      <header className="sticky top-0 z-20 bg-background px-4 py-4 flex items-center border-b border-border/5" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold tracking-tight">Configurações</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-4">
        
        <button className="w-full bg-[#1A1A1E] hover:bg-card/40 border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]">
          <div className="w-10 h-10 rounded-full bg-zinc-500/10 flex items-center justify-center mr-4 shrink-0">
            <FileText className="text-zinc-400" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-medium text-foreground">Termos de Uso</h2>
          </div>
        </button>

        <button className="w-full bg-[#1A1A1E] hover:bg-card/40 border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]">
          <div className="w-10 h-10 rounded-full bg-zinc-500/10 flex items-center justify-center mr-4 shrink-0">
            <Shield className="text-zinc-400" size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-medium text-foreground">Política de Privacidade</h2>
          </div>
        </button>
        
        <div className="pt-8 text-center">
          <p className="text-xs text-muted-foreground">Versão do App: 1.0.0</p>
        </div>

      </main>
    </div>
  );
}
