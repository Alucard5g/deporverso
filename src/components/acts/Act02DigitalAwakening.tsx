import React, { useState } from 'react';
import { FileText, Cpu, CheckCircle, ArrowRight, Smartphone, Globe, Shield, Sparkles, Layers, Database, ChevronRight } from 'lucide-react';
import despertarDigitalImg from '../../assets/images/acto2_despertar_digital_1789418217850.jpg';
import { CinematicActImage } from '../immersive/CinematicActImage';

interface Act02DigitalAwakeningProps {
  onNextAct: () => void;
  onOpenLightbox?: (index: number) => void;
}

export const Act02DigitalAwakening: React.FC<Act02DigitalAwakeningProps> = ({ onNextAct, onOpenLightbox }) => {
  const [transformationProgress, setTransformationProgress] = useState<number>(75);
  const [activeSubdomainTab, setActiveSubdomainTab] = useState<'root' | 'fanzone' | 'tienda' | 'stats'>('root');

  return (
    <section
      id="act-2"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 text-center overflow-hidden"
    >
      {/* Luz Ambiental Azul Neón y Cobalto */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-tr from-[#0066FF]/20 via-[#00F0FF]/15 to-transparent rounded-full blur-[110px]" />
      </div>

      {/* Píldora Superior: Badge de Inteligencia */}
      <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#080F24]/80 border border-[#00F0FF]/30 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(0,102,255,0.3)]">
        <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00F0FF]">
          ACTO 02 • EL DESPERTAR DIGITAL
        </span>
      </div>

      {/* Título Principal Tipográfico */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] font-sans">
          El orden de las grandes ligas, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-[#00F0FF] drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            al alcance de tu barrio.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          La tierra se convierte en datos. El acta en papel manchada de barro se transforma en una arquitectura cloud distribuida, con subdominio y vocalía digital en vivo para cada club.
        </p>
      </div>

      {/* Imagen Cinematográfica */}
      <div className="relative max-w-4xl mx-auto my-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#0066FF] to-[#00F0FF] rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000" />
        <CinematicActImage
          id="img-act2-despertar-digital"
          actNumber="02"
          tag="LA METAMORFOSIS CLOUD"
          meta="CLOUD ARCHITECTURE • LATENCIA 12MS"
          title="El Despertar Digital: De la Hoja Manchada a la Matriz Cloud"
          caption="De las hojas arrugadas a la telemetría en tiempo real: cada gol, amonestación y acta sincronizada al instante con cero pérdida de información."
          imageSrc={despertarDigitalImg}
          imageAlt="Transformación digital deportiva de la planilla física de papel a la matriz de datos en la nube"
          accent="cyan"
          onExpand={() => onOpenLightbox?.(1)}
        />
      </div>

      {/* COMPARADOR INTERACTIVO CON SLIDER: De Papel a Cloud */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-6">
        
        {/* Controlador del Slider Glassmorphic */}
        <div className="bg-[#080F24]/80 border border-white/10 backdrop-blur-2xl p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto shadow-2xl">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Planilla de Papel (0%)
          </span>

          <div className="flex-1 w-full flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={transformationProgress}
              onChange={(e) => setTransformationProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
            <span className="text-xs font-mono text-[#00F0FF] font-bold w-12 text-right">
              {transformationProgress}%
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            Nube SaaS (100%)
          </span>
        </div>

        {/* Cuadrícula de 4 Tarjetas Numeradas (01, 02, 03, 04) - Estilo Video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          {/* Card 01 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
            <span className="text-2xl font-mono font-bold text-white/30 block mb-3">01</span>
            <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">SUBDOMINIO PROPIO</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Cada club obtiene <span className="font-mono text-[#00F0FF]">tunombre.deporverso.app</span> con identidad visual, patrocinadores y tablas exclusivas.
            </p>
          </div>

          {/* Card 02 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
            <span className="text-2xl font-mono font-bold text-white/30 block mb-3">02</span>
            <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">VOCALÍA DIGITAL</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Cero papeles mojados o perdidos. Los vocales registran cambios, amonestaciones y goles desde cualquier teléfono móvil en tiempo real.
            </p>
          </div>

          {/* Card 03 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
            <span className="text-2xl font-mono font-bold text-white/30 block mb-3">03</span>
            <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">CARNETS QR BLINDADOS</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Elimina la suplantación de jugadores con credenciales digitales dinámicas con verificación pericial de identidad en cancha.
            </p>
          </div>

          {/* Card 04 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#00F0FF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
            <span className="text-2xl font-mono font-bold text-white/30 block mb-3">04</span>
            <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">TABLAS AL INSTANTE</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Goles a favor, diferencia de gol, tarjetas acumuladas y sanciones calculadas automáticamente al sonar el pitazo final.
            </p>
          </div>

        </div>

        {/* Botón de Avance */}
        <div className="pt-8">
          <button
            onClick={onNextAct}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all cursor-pointer"
          >
            <span>Avanzar al Ecosistema Pro & VAR</span>
            <ChevronRight className="w-4 h-4 text-[#00F0FF]" />
          </button>
        </div>

      </div>
    </section>
  );
};
