import React, { useState } from 'react';
import { FileText, Cpu, CheckCircle, ArrowRight, Smartphone, Globe, Shield, Sparkles, Layers, Database } from 'lucide-react';
import despertarDigitalImg from '../../assets/images/acto2_despertar_digital_1789418217850.jpg';
import { CinematicActImage } from '../immersive/CinematicActImage';

interface Act02DigitalAwakeningProps {
  onNextAct: () => void;
  onOpenLightbox?: (index: number) => void;
}

export const Act02DigitalAwakening: React.FC<Act02DigitalAwakeningProps> = ({ onNextAct, onOpenLightbox }) => {
  const [transformationProgress, setTransformationProgress] = useState<number>(65); // 0 = Paper, 100 = Full Digital
  const [activeSubdomainTab, setActiveSubdomainTab] = useState<'root' | 'fanzone' | 'tienda' | 'stats'>('root');

  return (
    <section
      id="act-2"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 text-center overflow-hidden"
    >
      {/* Background cyber ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-tr from-blue-950/30 via-cyan-950/20 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Act Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md mb-8 shadow-xl shadow-cyan-950/30">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-[11px] font-mono font-black uppercase tracking-widest text-cyan-300">
          ACTO II • EL DESPERTAR DIGITAL
        </span>
      </div>

      {/* Main Title */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          El orden de las grandes ligas, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
            al alcance de tu barrio.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light">
          La tierra se convierte en datos. El acta en papel manchada de barro se transforma en una arquitectura digital en la nube, con subdominio propio para cada club y liga.
        </p>
      </div>

      {/* Hero Visual Showcase: Desmaterialización a la Nube */}
      <CinematicActImage
        id="img-act2-despertar-digital"
        actNumber="02"
        tag="LA METAMORFOSIS"
        meta="CLOUD ARCHITECTURE • LATENCIA 12MS"
        title="El Despertar Digital: De la Hoja Manchada a la Matriz Cloud"
        caption="De las hojas arrugadas a la telemetría en tiempo real: cada gol, amonestación y acta sincronizada al instante con cero pérdida de información."
        imageSrc={despertarDigitalImg}
        imageAlt="Transformación digital deportiva de la planilla física de papel a la matriz de datos en la nube"
        accent="cyan"
        onExpand={() => onOpenLightbox?.(1)}
      />

      {/* INTERACTIVE COMPARISON: Physical Paper vs Digital Subdomain */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-10">
        {/* Interactive Slider Controller */}
        <div className="bg-slate-950/80 border border-slate-800 backdrop-blur-xl p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            1980 • Papel Barrial
          </span>

          <div className="flex-1 w-full flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={transformationProgress}
              onChange={(e) => setTransformationProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-xs font-mono text-cyan-400 font-bold w-12 text-right">
              {transformationProgress}%
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            2026 • DeporVerso Cloud
          </span>
        </div>

        {/* Dual Panels Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {/* LEFT: The Physical Paper Sheet (Vintage / Barrial) */}
          <div
            className="p-6 sm:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden"
            style={{
              backgroundColor: '#fbf7ed',
              color: '#1c1917',
              borderColor: '#d6c4a8',
              opacity: Math.max(0.2, (100 - transformationProgress * 0.7) / 100),
              transform: `scale(${1 - (transformationProgress / 100) * 0.05})`
            }}
          >
            {/* Vintage stamp watermark */}
            <div className="absolute top-4 right-4 border-2 border-dashed border-red-700/60 rounded-full w-20 h-20 flex items-center justify-center rotate-12 pointer-events-none">
              <span className="text-[9px] font-black text-red-700/70 uppercase text-center font-mono leading-none">
                LIGA BARRIAL<br />OFICIAL<br />SELLO 1994
              </span>
            </div>

            <div className="border-b-2 border-stone-800/80 pb-3 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                PLANILLA FÍSICA TRADICIONAL
              </span>
              <h3 className="text-xl font-black font-serif tracking-tight text-stone-900">
                ACTA OFICIAL DE PARTIDO
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs text-stone-800">
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">Torneo:</span>
                <span className="font-bold underline decoration-stone-400">Campeonato Barrial Serie A</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">Fecha:</span>
                <span className="font-bold">Domingo, 15:00 hrs</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">Equipos:</span>
                <span className="font-bold">Atlético San Roque (2) vs Real Pinos (1)</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">Goles:</span>
                <span>M. Silva (34', 68'), C. Gómez (82')</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">Árbitro Central:</span>
                <span>Hernán Quinatoa (Firma ilegible)</span>
              </div>
              <div className="pt-2">
                <span className="text-stone-600 block text-[11px]">Observaciones del Vocal:</span>
                <p className="italic text-stone-700 text-[11px] bg-stone-200/60 p-2 rounded border border-stone-300 mt-1">
                  "El terreno presentó acumulación de agua en banda sur. Se extravió el carnet físico del #9 visitante."
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-400 flex items-center justify-between text-[10px] font-mono text-stone-500">
              <span>Riesgo: Extravío de actas</span>
              <span className="text-red-600 font-bold">Sin respaldo digital</span>
            </div>
          </div>

          {/* RIGHT: Deporverso Digital Subdomain Interface */}
          <div
            className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-2xl transition-all duration-500 relative overflow-hidden shadow-2xl shadow-cyan-950/40"
            style={{
              opacity: Math.max(0.3, transformationProgress / 100),
              transform: `scale(${0.95 + (transformationProgress / 100) * 0.05})`
            }}
          >
            {/* Live digital status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-300">
                  DEPORVERSO CLOUD v4.2
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Arquitectura Propuesta
              </span>
            </div>

            {/* Subdomain URL pill bar */}
            <div className="my-4 p-2.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-cyan-400 font-bold">https://</span>
              <span className="text-white font-bold">sanroque</span>
              <span className="text-cyan-400 font-bold">.deporverso.com</span>
              <span className="text-slate-500">
                {activeSubdomainTab === 'root'
                  ? '/'
                  : activeSubdomainTab === 'fanzone'
                  ? '/fan-zone'
                  : activeSubdomainTab === 'tienda'
                  ? '/tienda'
                  : '/estadisticas'}
              </span>
            </div>

            {/* Subdomain Router tabs */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setActiveSubdomainTab('root')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeSubdomainTab === 'root'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Panel Club
              </button>
              <button
                onClick={() => setActiveSubdomainTab('fanzone')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeSubdomainTab === 'fanzone'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                /fan-zone
              </button>
              <button
                onClick={() => setActiveSubdomainTab('tienda')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeSubdomainTab === 'tienda'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                /tienda
              </button>
              <button
                onClick={() => setActiveSubdomainTab('stats')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeSubdomainTab === 'stats'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                /estadisticas
              </button>
            </div>

            {/* Subdomain Dynamic Preview Content */}
            <div className="space-y-3 font-mono text-xs">
              {activeSubdomainTab === 'root' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Estado del Club:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> 100% Sincronizado
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Módulos Activos:</span>
                    <span className="text-white">Vocalía, VAR, Fan Zone, Carnet QR</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Jugadores Registrados:</span>
                    <span className="text-cyan-300 font-bold">24 futbolistas verificados</span>
                  </div>
                </div>
              )}

              {activeSubdomainTab === 'fanzone' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">
                    Comunidad de Aficionados
                  </span>
                  <p className="text-white text-xs">
                    Votaciones en vivo, crónicas con IA al pitazo final y galería fotográfica oficial.
                  </p>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    • 1,250 hinchas conectados este fin de semana
                  </span>
                </div>
              )}

              {activeSubdomainTab === 'tienda' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block">
                    E-Commerce del Club
                  </span>
                  <p className="text-white text-xs">
                    Venta de indumentaria oficial, bufandas y abonos de temporada sin intermediarios.
                  </p>
                  <span className="text-[10px] text-emerald-400 block">
                    • Ingresos directos a la tesorería del club
                  </span>
                </div>
              )}

              {activeSubdomainTab === 'stats' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">PJ</span>
                      <strong className="text-white text-sm">14</strong>
                    </div>
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">GF / GC</span>
                      <strong className="text-emerald-400 text-sm">36 : 14</strong>
                    </div>
                    <div className="p-2 bg-black/50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">PTS</span>
                      <strong className="text-cyan-400 text-sm">35</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Aislamiento multi-tenant en tiempo real</span>
              <span className="text-emerald-400 font-bold">Cloud Ledger Verificado</span>
            </div>
          </div>
        </div>

        {/* Next act prompt */}
        <div className="mt-8 text-center">
          <button
            onClick={onNextAct}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Explorar Acto III: El Ecosistema Profesional</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
