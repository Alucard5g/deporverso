import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Maximize2, Minimize2, 
  X, Sparkles, Compass, Clock, Sliders, Presentation 
} from 'lucide-react';

interface PresentationTourControlProps {
  onNavigateAct: (actNumber: 1 | 2 | 3 | 4) => void;
  onNavigateToSegments?: () => void;
  activeAct: 1 | 2 | 3 | 4;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
}

const ACT_TITLES = {
  1: { num: '01', name: 'El Origen Barrial', desc: 'La Cancha de Tierra' },
  2: { num: '02', name: 'El Despertar Digital', desc: 'De la Hoja a la Nube' },
  3: { num: '03', name: 'El Ecosistema Pro', desc: 'Estadio y VAR Oficial' },
  4: { num: '04', name: 'El Multiverso Cósmico', desc: 'VR y Scouting Global' }
};

export const PresentationTourControl: React.FC<PresentationTourControlProps> = ({
  onNavigateAct,
  onNavigateToSegments,
  activeAct,
  isActive,
  onToggleActive
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5 | 2>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(12);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(1); // 1, 2, 3, 4, 5 (5 = Directorio)

  const BASE_SECONDS_PER_ACT = 12;
  const targetSeconds = Math.round(BASE_SECONDS_PER_ACT / speedMultiplier);
  const timerRef = useRef<any>(null);

  // Sync current slide with activeAct when tour is launched
  useEffect(() => {
    if (isActive) {
      setCurrentSlideIndex(activeAct);
      setSecondsRemaining(targetSeconds);
      setIsPlaying(true);
    }
  }, [isActive]);

  // Handle auto-scroll timer
  useEffect(() => {
    if (!isActive || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next act
          handleStepForward();
          return targetSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPlaying, currentSlideIndex, speedMultiplier]);

  const handleStepForward = () => {
    if (currentSlideIndex < 4) {
      const nextAct = (currentSlideIndex + 1) as 1 | 2 | 3 | 4;
      setCurrentSlideIndex(nextAct);
      onNavigateAct(nextAct);
      setSecondsRemaining(targetSeconds);
    } else if (currentSlideIndex === 4) {
      // Step to the final Segments directory
      setCurrentSlideIndex(5);
      if (onNavigateToSegments) {
        onNavigateToSegments();
      } else {
        const segElement = document.getElementById('deporverso-segments-directory');
        if (segElement) {
          segElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      setSecondsRemaining(targetSeconds);
    } else {
      // Loop back or finish
      setCurrentSlideIndex(1);
      onNavigateAct(1);
      setSecondsRemaining(targetSeconds);
    }
  };

  const handleStepBack = () => {
    if (currentSlideIndex > 1) {
      const prevAct = (currentSlideIndex - 1) as 1 | 2 | 3 | 4;
      setCurrentSlideIndex(prevAct);
      onNavigateAct(prevAct);
      setSecondsRemaining(targetSeconds);
    } else {
      onNavigateAct(1);
      setSecondsRemaining(targetSeconds);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isActive) {
    return (
      <button
        id="btn-open-presentation-tour"
        onClick={() => onToggleActive(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 hover:border-amber-400 transition-all shadow-lg shadow-amber-950/40 cursor-pointer group"
        title="Iniciar Presentación Automática para Asambleas y Dirigentes"
      >
        <Presentation className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Presentación a Dirigentes</span>
        <span className="sm:hidden">Auto-Tour</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </button>
    );
  }

  const currentInfo = currentSlideIndex <= 4 ? ACT_TITLES[currentSlideIndex as 1 | 2 | 3 | 4] : {
    num: '05',
    name: 'Directorio Ecosistema',
    desc: 'Todos los Segmentos y Pestañas'
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[94%] max-w-2xl animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/80 text-white flex flex-col gap-2">
        {/* Top Progress & Title Bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  MODO CONFERENCIA • ASAMBLEA DIRECTIVA
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                  Paso {currentSlideIndex} de 5
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {currentInfo.num}. {currentInfo.name} — <span className="text-slate-400 font-normal">{currentInfo.desc}</span>
              </h4>
            </div>
          </div>

          <button
            onClick={() => onToggleActive(false)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Salir del Modo Presentación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Linear progress bar for the current slide */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
            style={{
              width: `${((targetSeconds - secondsRemaining) / targetSeconds) * 100}%`
            }}
          />
        </div>

        {/* Bottom Remote Control Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          {/* Act Jumpers */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  if (idx <= 4) onNavigateAct(idx as 1 | 2 | 3 | 4);
                  else if (onNavigateToSegments) onNavigateToSegments();
                  setSecondsRemaining(targetSeconds);
                }}
                className={`w-7 h-7 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer border ${
                  currentSlideIndex === idx
                    ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-md'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
                title={idx <= 4 ? `Saltar al Acto ${idx}` : 'Saltar al Directorio de Segmentos'}
              >
                {idx === 5 ? 'DIR' : `0${idx}`}
              </button>
            ))}
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Acto anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
              title={isPlaying ? 'Pausar auto-scroll' : 'Reanudar auto-scroll'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>

            <button
              onClick={handleStepForward}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Siguiente acto"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Tools */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              onClick={() => {
                const nextSpeed = speedMultiplier === 1 ? 1.5 : speedMultiplier === 1.5 ? 2 : 1;
                setSpeedMultiplier(nextSpeed as 1 | 1.5 | 2);
                setSecondsRemaining(Math.round(BASE_SECONDS_PER_ACT / nextSpeed));
              }}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              title="Velocidad del recorrido"
            >
              {speedMultiplier}x
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Alternar pantalla completa para proyector"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
