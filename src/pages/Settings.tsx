import { ChevronRight, Palette, User, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const [batteryProtection, setBatteryProtection] = useState(true);

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col overflow-y-auto pb-20 safe-area-inset-bottom">
      <header className="px-6 py-6" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
      </header>

      <main className="flex-1 px-4 max-w-md mx-auto w-full space-y-4">
        
        {/* Temas dos Pads */}
        <button 
          onClick={() => navigate('/ajustes/temas')}
          className="w-full bg-[#1A1A1E] border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mr-4 shrink-0">
            <Palette className="text-[#FF4081]" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-semibold text-foreground">Temas dos Pads</h2>
            <p className="text-[14px] text-muted-foreground mt-0.5">Toque para selecionar</p>
          </div>
          <ChevronRight className="text-muted-foreground/50 shrink-0 ml-2" size={20} />
        </button>

        {/* Minha Conta */}
        <button 
          onClick={() => navigate('/ajustes/conta')}
          className="w-full bg-[#1A1A1E] border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 shrink-0">
            <User className="text-[#448AFF]" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-semibold text-foreground">Minha Conta</h2>
            <p className="text-[14px] text-muted-foreground mt-0.5">Conexões, Informações</p>
          </div>
          <ChevronRight className="text-muted-foreground/50 shrink-0 ml-2" size={20} />
        </button>

        {/* Configurações */}
        <button 
          onClick={() => navigate('/ajustes/config')}
          className="w-full bg-[#1A1A1E] border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left transition-transform active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-500/10 flex items-center justify-center mr-4 shrink-0">
            <SettingsIcon className="text-zinc-400" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-semibold text-foreground">Configurações</h2>
            <p className="text-[14px] text-muted-foreground mt-0.5">Sobre o App, Termos de Uso</p>
          </div>
          <ChevronRight className="text-muted-foreground/50 shrink-0 ml-2" size={20} />
        </button>

        {/* Proteção de Bateria Ativa */}
        <div className="w-full bg-[#1A1A1E] border border-border/10 rounded-[1.25rem] p-4 flex items-center text-left mt-2">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4 shrink-0">
            <ShieldCheck className="text-green-500" size={24} />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-[17px] font-semibold text-foreground">Proteção de Bateria</h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-snug">Impede que o sistema suspenda os sons em 2° plano</p>
          </div>
          <button 
            onClick={() => setBatteryProtection(!batteryProtection)}
            className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${batteryProtection ? 'bg-green-500' : 'bg-[#2A2A30]'}`}
          >
            <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${batteryProtection ? 'left-[24px]' : 'left-1'}`} />
          </button>
        </div>

      </main>
    </div>
  );
}
