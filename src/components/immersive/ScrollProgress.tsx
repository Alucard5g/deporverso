import React from 'react';

interface ScrollProgressProps {
  progress: number;
  activeAct: 1 | 2 | 3 | 4;
  onNavigateAct: (actNumber: 1 | 2 | 3 | 4) => void;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  progress,
  activeAct,
  onNavigateAct
}) => {
  const acts = [
    { num: 1 as const, title: 'EL ORIGEN', subtitle: 'La Raíz del Deporte' },
    { num: 2 as const, title: 'DESPERTAR DIGITAL', subtitle: 'Matriz SaaS Multi-Tenant' },
    { num: 3 as const, title: 'ECOSISTEMA PRO', subtitle: 'Estadio Tecnológico & VAR' },
    { num: 4 as const, title: 'EL MULTIVERSO', subtitle: 'VR & Scouting 3D' }
  ];

  return (
    <>
      {/* Barra de Progreso Superior con Resplandor Neón Cian */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-950/80 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#0066FF] via-[#00F0FF] to-white shadow-[0_0_15px_#00F0FF] transition-all duration-150 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* HUD Lateral Derecho Glassmorphic (Estilo Video) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-6 pointer-events-auto">
        <div className="flex flex-col gap-4 bg-[#080F24]/80 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] text-center pb-2 border-b border-white/10 flex items-center justify-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            {Math.round(progress * 100)}% HUD
          </div>

          {acts.map((act) => {
            const isActive = activeAct === act.num;
            return (
              <button
                key={act.num}
                onClick={() => onNavigateAct(act.num)}
                className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
              >
                {/* Marcador de Resplandor Neón */}
                <div
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'w-6 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]'
                      : 'w-2 h-2 rounded-full bg-slate-700 group-hover:bg-[#00F0FF]/50'
                  }`}
                />

                {/* Texto Descriptivo */}
                <div className="transition-all duration-300">
                  <div
                    className={`text-[11px] font-mono tracking-wider transition-colors ${
                      isActive
                        ? 'text-white font-bold drop-shadow'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    0{act.num} {act.title}
                  </div>
                  <div className="text-[9px] text-slate-500 tracking-tight hidden group-hover:block font-sans">
                    {act.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
