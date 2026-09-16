import React, { useState, useRef } from 'react';
import { 
  Sparkles, ExternalLink, ArrowRight, Rotate3d, Compass, 
  Activity, Shield, Award, CheckCircle2, ChevronRight, Eye, Orbit
} from 'lucide-react';
import { HERO_PLAYER } from '../../data/players';
import multiverseCosmicoImg from '../../assets/images/acto4_multiverso_cosmico_1789418246887.jpg';
import { CinematicActImage } from '../immersive/CinematicActImage';
import { DeporversoSegmentsDirectory } from '../immersive/DeporversoSegmentsDirectory';

interface Act04MultiverseProps {
  onEnterPlatform: () => void;
  onOpenOnboarding: () => void;
  onScrollToTop: () => void;
  onOpenLightbox?: (index: number) => void;
  onSelectTab?: (tabKey: string) => void;
}

export const Act04Multiverse: React.FC<Act04MultiverseProps> = ({
  onEnterPlatform,
  onOpenOnboarding,
  onScrollToTop,
  onOpenLightbox,
  onSelectTab = (tab) => onEnterPlatform()
}) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -12;
    const tiltY = (x / (rect.width / 2)) * 12;
    setCardTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="act-4"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 text-center overflow-hidden"
    >
      {/* Deep cosmic nebula background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[800px] bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-cyan-950/30 blur-3xl opacity-60" />
      </div>

      {/* Act Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-md mb-8 shadow-xl shadow-indigo-950/30">
        <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span className="text-[11px] font-mono font-black uppercase tracking-widest text-indigo-300">
          ACTO IV • EL MULTIVERSO
        </span>
      </div>

      {/* Main Title */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
          El universo deportivo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            no tiene límites.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light">
          La convergencia total: Deporte de barrio, ligas profesionales, Héroes del Deporte, telemetría VR y entrenamiento en casa en un único multiverso conectado.
        </p>
      </div>

      {/* Hero Visual Showcase: Multiverso Cósmico y Realidad Virtual */}
      <CinematicActImage
        id="img-act4-multiverse-cosmic"
        actNumber="04"
        tag="EL MULTIVERSO"
        meta="CONVERGENCIA CÓSMICA • REALIDAD VIRTUAL"
        title="El Multiverso Deportivo: Trascendencia y Scouting Global"
        caption="De la tierra a las estrellas: telemetría biométrica, inmersión VR y el puente directo hacia la élite mundial del deporte sin barreras geográficas ni de presupuesto."
        imageSrc={multiverseCosmicoImg}
        imageAlt="Multiverso deportivo cósmico con atleta en realidad virtual conectando constelaciones de telemetría deportiva"
        accent="indigo"
        onExpand={() => onOpenLightbox?.(3)}
      />

      {/* TWO CORE EXPERIENCES: PLAYER CARD 3D + ECOSISTEMA HÉROES */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-left">
        {/* 1. PLAYER CARD 3D INTERACTIVE */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-sm mb-3 text-xs font-mono text-slate-400">
            <span>TARJETA 3D BIOMÉTRICA</span>
            <button
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Rotate3d className="w-4 h-4" />
              <span>{isCardFlipped ? 'Ver Frente (OVR)' : 'Ver Reverso (VR)'}</span>
            </button>
          </div>

          {/* 3D Tilted Card Container */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="w-full max-w-sm h-[480px] cursor-pointer transition-transform duration-200 perspective-1000 select-none"
            style={{
              perspective: '1000px',
              transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`
            }}
          >
            <div
              className={`w-full h-full duration-700 relative preserve-3d transition-transform ${
                isCardFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isCardFlipped ? 'rotateY(180deg)' : 'none'
              }}
            >
              {/* FRONT OF THE CARD */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Header: Code + OVR */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block">
                      {HERO_PLAYER.code}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{HERO_PLAYER.team}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-[#00ff66] font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                      {HERO_PLAYER.ovr}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">GLOBAL OVR</span>
                  </div>
                </div>

                {/* Center Visual Mock with Athlete Portrait */}
                <div className="my-auto text-center space-y-2">
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-2xl shadow-cyan-500/30 relative group/avatar overflow-hidden">
                    <img
                      id="img-player-card-avatar"
                      src={multiverseCosmicoImg}
                      alt={HERO_PLAYER.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[14px] filter brightness-105 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent rounded-[14px] pointer-events-none" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">{HERO_PLAYER.name}</h3>
                    <p className="text-xs text-amber-300 font-mono italic">"{HERO_PLAYER.nickname}"</p>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      {HERO_PLAYER.position}
                    </span>
                  </div>
                </div>

                {/* Bottom Stats: VEL, PAS, DEF, TEC, FIS */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="grid grid-cols-5 gap-1 text-center font-mono">
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">VEL</span>
                      <strong className="text-white text-sm">{HERO_PLAYER.stats.vel}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">PAS</span>
                      <strong className="text-white text-sm">{HERO_PLAYER.stats.pas}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">DEF</span>
                      <strong className="text-white text-sm">{HERO_PLAYER.stats.def}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-emerald-400 block">TEC</span>
                      <strong className="text-emerald-300 text-sm">{HERO_PLAYER.stats.tec}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-white block">FIS</span>
                      <strong className="text-cyan-300 text-sm">{HERO_PLAYER.stats.fis}</strong>
                    </div>
                  </div>

                  <div className="mt-3 text-center text-[10px] text-slate-500 font-mono">
                    Mueve el cursor para inclinar en 3D • Clic para girar
                  </div>
                </div>
              </div>

              {/* BACK OF THE CARD (REVERSO: DEPORTE EN CASA & VR) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between border border-indigo-500/40 bg-gradient-to-bl from-slate-900 via-indigo-950 to-slate-950 shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl rotate-y-180"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {/* Header Reverso */}
                <div className="border-b border-indigo-500/30 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase block">
                    PROGRAMA BIOMÉTRICO
                  </span>
                  <h4 className="text-base font-black text-white">DEPORTE EN CASA</h4>
                </div>

                {/* Back content metrics */}
                <div className="space-y-4 my-auto text-xs font-mono">
                  <div className="p-3 bg-black/50 rounded-2xl border border-indigo-500/20 space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Progreso de Entrenamiento:</span>
                      <strong className="text-emerald-400">{HERO_PLAYER.backside.progressPercentage}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{ width: `${HERO_PLAYER.backside.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Horas Acumuladas</span>
                      <strong className="text-white text-base">{HERO_PLAYER.backside.trainingHours} hrs</strong>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Sesiones VR</span>
                      <strong className="text-indigo-300 text-base">{HERO_PLAYER.backside.sessionsCompleted}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase block">Objetivo Vigente</span>
                    <p className="text-white text-[11px] font-sans">
                      {HERO_PLAYER.backside.targetGoals}
                    </p>
                  </div>

                  <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-500/30 text-center">
                    <span className="text-[10px] text-indigo-300 font-bold block">
                      ⚡ {HERO_PLAYER.backside.vrStatus}
                    </span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-mono pt-3 border-t border-slate-800">
                  Clic para volver al frente
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ECOSISTEMA HÉROES DEL DEPORTE */}
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ECOSISTEMA INTEGRADO
              </span>
              <span className="text-xs text-slate-400 font-mono">• Alianza Digital</span>
            </div>

            <h3 className="text-2xl font-black text-white">
              Conexión con Héroes del Deporte
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              DeporVerso no es solo una plataforma de partidos: es el puente que une al talento de base con la vitrina de <strong className="text-amber-300">Héroes del Deporte</strong>, permitiendo seguimiento de rendimiento, visibilidad de ojeadores y experiencias inmersivas de realidad virtual.
            </p>

            {/* Architecture Node Diagram */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-center space-y-3">
              <div className="p-2 bg-indigo-950/80 rounded-xl border border-indigo-500/40 text-indigo-300 font-bold">
                DEPORVERSO (Core Engine)
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300">
                  CLUBES & LIGAS
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300">
                  FAN ZONE
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-300 font-bold">
                  HÉROES DEL DEPORTE
                </div>
              </div>

              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-[11px]">
                EXPERIENCIAS MULTIVERSO • VR • DATOS TELEMÉTRICOS
              </div>
            </div>

            {/* Link to heroesdeldeporte.com */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Visita el portal oficial
              </span>
              <a
                href="https://heroesdeldeporte.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>heroesdeldeporte.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CINEMATIC CONVERGENCE & MAIN CTAs */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-20 pt-16 border-t border-slate-800/80 space-y-8">
        {/* Converging Brand Logo & Message */}
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-1 shadow-2xl shadow-emerald-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center font-black text-white text-2xl font-mono">
              DV
            </div>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            DEPORVERSO
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-light italic max-w-xl mx-auto">
            "El universo deportivo no tiene límites."
          </p>
        </div>

        {/* Culmination of Scrollytelling: Directory of all Segments and Tabs */}
        <div className="w-full">
          <DeporversoSegmentsDirectory
            onSelectTab={onSelectTab}
            onEnterFullPlatform={onEnterPlatform}
            onOpenOnboarding={onOpenOnboarding}
          />
        </div>

        {/* 3 Main Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-8">
          <button
            id="btn-act4-enter-deporverso-main"
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#00e676] via-[#00d2b4] to-[#00e5ff] hover:brightness-110 active:scale-95 text-slate-950 flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer border border-emerald-300/40"
          >
            <span>ENTRA AL DEPORVERSO COMPLETO</span>
            <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </button>

          <button
            onClick={onOpenOnboarding}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>AFILIAR MI LIGA AL DEPORVERSO</span>
          </button>

          <button
            onClick={onScrollToTop}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-mono text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            ↑ Volver al Origen
          </button>
        </div>
      </div>
    </section>
  );
};
