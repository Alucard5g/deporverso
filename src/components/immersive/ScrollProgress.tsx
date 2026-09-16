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
    { num: 1 as const, title: 'EL ORIGEN', subtitle: 'La Cancha de Tierra' },
    { num: 2 as const, title: 'DESPERTAR DIGITAL', subtitle: 'Tecnología Barrial' },
    { num: 3 as const, title: 'EL ECOSISTEMA', subtitle: 'Clubes, VAR & Fan Zone' },
    { num: 4 as const, title: 'EL MULTIVERSO', subtitle: 'VR & Héroes' }
  ];

  return (
    <>
      {/* Top Thin Progress Bar on all viewports */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-900 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Desktop Vertical Progress HUD (Right Side) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-6 pointer-events-auto">
        <div className="flex flex-col gap-5 bg-slate-950/60 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shadow-2xl shadow-black/80">
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 text-center pb-1 border-b border-slate-800/80">
            {Math.round(progress * 100)}% EXPLORADO
          </div>

          {acts.map((act) => {
            const isActive = activeAct === act.num;
            return (
              <button
                key={act.num}
                onClick={() => onNavigateAct(act.num)}
                className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
              >
                {/* Visual marker */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                      : 'bg-slate-700 group-hover:bg-slate-400'
                  }`}
                />

                {/* Text descriptor */}
                <div className="transition-all duration-300 opacity-70 group-hover:opacity-100">
                  <div
                    className={`text-[11px] font-black tracking-wider font-mono ${
                      isActive
                        ? 'text-white font-bold drop-shadow'
                        : 'text-slate-400'
                    }`}
                  >
                    0{act.num} {act.title}
                  </div>
                  <div className="text-[9px] text-slate-500 tracking-tight hidden group-hover:block">
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
