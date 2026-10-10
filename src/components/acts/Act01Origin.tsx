import React from 'react';
import { ArrowDown, Flame, Sparkles, MapPin, ChevronRight } from 'lucide-react';
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
      {/* Luz Ambiental Azul Cobalto y Niebla Lumínica */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#0066FF]/20 via-[#00F0FF]/15 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Píldora Superior: Badge Inteligencia Deportiva (Estilo Video) */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#080F24]/80 border border-[#00F0FF]/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,102,255,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00F0FF]">
            ACTO 01 • EL ORIGEN DEL JUEGO
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300">
          <Sparkles className="w-3 h-3 text-[#00F0FF]" />
          <span>Raíz Comunitaria • Semillero Global</span>
        </div>
      </div>

      {/* Título Principal Tipográfico de Gran Impacto */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.06] font-sans">
          Todo gran héroe <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-[#00F0FF] drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            empieza en el barro.
          </span>
        </h1>

        <div className="max-w-2xl mx-auto space-y-2 pt-1">
          <p className="text-lg sm:text-2xl text-slate-200 font-light tracking-wide leading-relaxed">
            Antes de los estadios y las luces, estuvieron las canchas de barrio.
          </p>
          <p className="text-sm sm:text-base text-slate-400 font-light italic">
            "Donde no hay césped sintético, la pasión se forja en el corazón de la comunidad."
          </p>
        </div>

        {/* Video Embed */}
        <div className="relative max-w-4xl mx-auto my-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
          <iframe
            className="w-full h-full"
            src="https://docs.google.com/videos/d/1iuuXLfwDlk56MnlzZLTfMzqjsRmy3r374VT7LeiXLLw/preview"
            title="Video del Acto 1"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        {/* Cuadrícula de 4 Tarjetas Numeradas (01, 02, 03, 04) - Estilo Video */}
        <div className="pt-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Card 01 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <span className="text-2xl font-mono font-bold text-white/30 block mb-3">01</span>
              <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">EL SUELO</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Tierra apisonada, líneas de cal trazadas a mano y zapatos que cargan el peso de la ilusión comunitaria.
              </p>
            </div>

            {/* Card 02 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <span className="text-2xl font-mono font-bold text-white/30 block mb-3">02</span>
              <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">LA IDENTIDAD</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Camisetas cosidas en casa, hinchadas a pie de campo y un sentido de pertenencia inquebrantable.
              </p>
            </div>

            {/* Card 03 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <span className="text-2xl font-mono font-bold text-white/30 block mb-3">03</span>
              <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">LA PLANILLA</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Cuadernos con marcas de lápiz y actas manuscritas que hoy trascienden a registros inmutables en la nube.
              </p>
            </div>

            {/* Card 04 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <span className="text-2xl font-mono font-bold text-white/30 block mb-3">04</span>
              <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">EL SUEÑO</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                El impulso primario que demuestra que desde cualquier rincón del mundo puede nacer una estrella mundial.
              </p>
            </div>

          </div>
        </div>

        {/* Botón de Avance Suave */}
        <div className="pt-8">
          <button
            onClick={onNextAct}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all cursor-pointer"
          >
            <span>Avanzar al Despertar Digital</span>
            <ChevronRight className="w-4 h-4 text-[#00F0FF]" />
          </button>
        </div>

      </div>
    </section>
  );
};
