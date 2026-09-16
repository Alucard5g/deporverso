import React from 'react';
import { ArrowDown, Flame, Sparkles, MapPin } from 'lucide-react';
import canchaTierraImg from '../../assets/images/acto1_cancha_tierra_1789418204541.jpg';
import { CinematicActImage } from '../immersive/CinematicActImage';

interface Act01OriginProps {
  onNextAct: () => void;
  onOpenLightbox?: (index: number) => void;
}

export const Act01Origin: React.FC<Act01OriginProps> = ({ onNextAct, onOpenLightbox }) => {
  return (
    <section
      id="act-1"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 text-center overflow-hidden"
    >
      {/* Visual atmospheric aura: Warm earth, dusk dust glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-t from-amber-950/40 via-amber-900/10 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Hero Badge & Multiverse Sports Tag */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 backdrop-blur-md shadow-xl shadow-amber-950/30">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono font-black uppercase tracking-widest text-amber-300">
            ACTO I • EL ORIGEN
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 backdrop-blur-md text-[10px] font-mono text-amber-200/90 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Multiverso 3D: 24 Disciplinas Deportivas WebP</span>
        </div>
      </div>

      {/* Main Cinematic Typography */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] font-sans">
          Todo gran héroe <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_30px_rgba(217,119,6,0.3)]">
            empieza en el barro.
          </span>
        </h1>

        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <p className="text-lg sm:text-2xl text-amber-100/90 font-light tracking-wide leading-relaxed">
            Antes de los estadios, estuvieron las calles.
          </p>
          <p className="text-base sm:text-xl text-amber-200/70 font-light italic">
            "Antes de las grandes ligas, existió un sueño."
          </p>
        </div>

        {/* Cinematic Photographic Hero Visual: La Cancha de Tierra */}
        <CinematicActImage
          id="img-act1-cancha-tierra"
          actNumber="01"
          tag="LA GÉNESIS"
          meta="CANCHA EL TRÉBOL • 18:30 HRS"
          title="La Cancha de Tierra: El Suelo Sagrado del Fútbol Barrial"
          caption="El polvo suspendido bajo el sol poniente: el terreno donde la pasión no necesita alfombra verde para ser eterna. Todo ecosistema digital nace honrando esta raíz."
          imageSrc={canchaTierraImg}
          imageAlt="Cancha de fútbol barrial de tierra al atardecer con polvo dorado y jugadores con pasión pura"
          accent="amber"
          onExpand={() => onOpenLightbox?.(0)}
        />

        {/* Minimalist Narrative Columns (Flattens depth, removes nested noise) */}
        <div className="pt-2 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400/80 block">
                01 / EL SUELO
              </span>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Tierra apisonada, líneas de cal trazadas a mano y zapatos que cargan el peso de la ilusión comunitaria.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400/80 block">
                02 / LA IDENTIDAD
              </span>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Camisetas cosidas en casa, hinchadas a pie de campo y un sentido de pertenencia inquebrantable.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400/80 block">
                03 / EL SALTO
              </span>
              <p className="text-xs text-amber-300/90 leading-relaxed font-light">
                El barro no es un límite, sino el cimiento sobre el cual erigimos la mayor plataforma digital deportiva.
              </p>
            </div>
          </div>

          {/* Minimalist scroll prompt */}
          <div className="mt-8 flex items-center justify-center">
            <button
              id="btn-act1-discover-act2"
              onClick={onNextAct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold text-amber-300/90 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer backdrop-blur-sm"
            >
              <span>Continuar al Acto II • El Despertar Digital</span>
              <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
