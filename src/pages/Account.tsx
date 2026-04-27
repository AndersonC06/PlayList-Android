import { ArrowLeft, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto pb-20 safe-area-inset-bottom">
      <header className="sticky top-0 z-20 bg-background px-4 py-4 flex items-center border-b border-border/5" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold tracking-tight">Minha Conta</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-6">
        <div className="bg-[#1A1A1E] border border-border/10 rounded-[1.25rem] p-5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-foreground">Usuário</h2>
              <p className="text-[14px] text-muted-foreground mt-0.5">usuario@example.com</p>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-border/10">
            <p className="text-[14px] text-muted-foreground">Conectado via Google</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-[#1A1A1E] hover:bg-card/40 border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]">
            <LogOut className="text-muted-foreground mr-3" size={20} />
            <span className="text-[16px] font-medium text-foreground">Sair da Conta</span>
          </button>
          
          <button className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]">
            <Trash2 className="text-red-500 mr-3" size={20} />
            <span className="text-[16px] font-medium text-red-500">Excluir Conta</span>
          </button>
        </div>
      </main>
    </div>
  );
}
