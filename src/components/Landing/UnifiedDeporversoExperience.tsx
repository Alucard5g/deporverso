import React, { useState, useEffect } from 'react';
import { 
  Trophy, Video, Activity, Globe, Sparkles, ChevronRight, 
  ExternalLink, QrCode, FileText, CheckCircle, ShieldCheck, 
  Flame, ArrowRight, X, Cpu, Layers, Zap, Tag, Image as ImageIcon,
  Presentation, ChevronDown, CheckCircle2, Shield
} from 'lucide-react';
import { SportCode, Tenant } from '../../types';
import { DeporversoCanvas } from '../three/DeporversoCanvas';
import { ExclusiveOfferCheckoutModal } from '../Marketing/ExclusiveOfferCheckoutModal';
import { CyberSportEcosystemStage } from './CyberSportEcosystemStage';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { ClubData } from '../../data/clubs';

import deporversoDarkBg from '../../assets/images/deporverso_dark_bg_1789426720628.jpg';
import canchaTierraImg from '../../assets/images/acto1_cancha_tierra_1789418204541.jpg';
import despertarDigitalImg from '../../assets/images/acto2_despertar_digital_1789418217850.jpg';
import estadioVarImg from '../../assets/images/acto3_estadio_var_1789418234243.jpg';
import multiverseCosmicoImg from '../../assets/images/acto4_multiverso_cosmico_1789418246887.jpg';

interface UnifiedDeporversoExperienceProps {
  onNavigateTab: (tab: string) => void;
  onEnterPlatform?: () => void;
  onRequestDemo?: () => void;
  onStartNow?: () => void;
  onSelectSport?: (sport: SportCode) => void;
  onAddTenant?: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  onOpenStepTour?: (stepIndex?: number) => void;
}

const ACT_SCENE_INFO: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'ACTO 01 • EL ORIGEN',
    subtitle: 'La Cancha de Tierra Barrial'
  },
  2: {
    title: 'ACTO 02 • DESPERTAR DIGITAL',
    subtitle: 'Matriz Cloud & Subdominios'
  },
  3: {
    title: 'ACTO 03 • ECOSISTEMA PRO',
    subtitle: 'Estadio Tecnológico & VAR 4K'
  },
  4: {
    title: 'ACTO 04 • EL MULTIVERSO',
    subtitle: 'VR & Scouting Tridimensional'
  }
};

const ACT_BACKGROUND_SCENES = [
  {
    act: 1,
    img: canchaTierraImg,
    alt: 'Acto 01 • El Origen - Cancha de Tierra Barrial'
  },
  {
    act: 2,
    img: despertarDigitalImg,
    alt: 'Acto 02 • El Despertar Digital - Arquitectura Cloud y Subdominios'
  },
  {
    act: 3,
    img: estadioVarImg,
    alt: 'Acto 03 • El Ecosistema Pro - Estadio Moderno y VAR 4K'
  },
  {
    act: 4,
    img: multiverseCosmicoImg,
    alt: 'Acto 04 • El Multiverso Deportivo - Convergencia y Realidad Virtual'
  }
];

export const UnifiedDeporversoExperience: React.FC<UnifiedDeporversoExperienceProps> = ({
  onNavigateTab,
  onEnterPlatform = () => onNavigateTab('league'),
  onRequestDemo = () => onNavigateTab('league'),
  onStartNow = () => onNavigateTab('league'),
  onSelectSport,
  onAddTenant,
  onOpenStepTour
}) => {
  const { progress, activeAct } = useScrollProgress();
  const [showCheckoutOfferModal, setShowCheckoutOfferModal] = useState<boolean>(false);
  const [selectedClubModal, setSelectedClubModal] = useState<ClubData | null>(null);
  const [activeDiscipline, setActiveDiscipline] = useState<string>('futbol');

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentScene = ACT_SCENE_INFO[activeAct] || ACT_SCENE_INFO[1];

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden selection:bg-[#00F0FF] selection:text-black">
      
      {/* 0. FONDO AMBIENTAL: Canvas de Vórtice 3D y Escenas Cinemáticas de los 4 Actos */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Base dark high-tech stadium texture */}
        <img
          src={deporversoDarkBg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-15 mix-blend-screen filter brightness-75 contrast-125"
        />

        {/* Resplandor Cósmico */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#0066FF]/25 via-[#00F0FF]/15 to-transparent rounded-full blur-[90px] animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[400px] bg-[#0066FF]/15 rounded-full blur-[110px]" />
        
        {/* Dynamic Act Scene Images with Smooth Crossfade */}
        {ACT_BACKGROUND_SCENES.map((scene) => {
          const isActive = activeAct === scene.act && window.scrollY > 600;
          return (
            <div
              key={scene.act}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-25' : 'opacity-0'
              }`}
            >
              <img
                src={scene.img}
                alt={scene.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-125 saturate-110"
              />
            </div>
          );
        })}

        {/* Canvas de Partículas 3D y Ondas Concéntricas */}
        <DeporversoCanvas progress={progress} activeAct={activeAct} />

        {/* Grilla Holográfica Sutil */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/85 to-[#020617]" />
      </div>

      {/* CONTENIDO PRINCIPAL FUSIONADO */}
      <div className="relative z-10 flex flex-col">
        
        {/* ======================================================== */}
        {/* PARTE 1: HERO SECTION (LANDING FUTURISTA)               */}
        {/* ======================================================== */}
        <section id="hero-section" className="flex flex-col justify-center px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto w-full min-h-[90vh]">
          
          <div className="text-center max-w-4xl mx-auto pt-6 pb-4">
            
            {/* Píldora Superior: Badge Ecosistema Multideporte */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F172A]/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.25)] text-xs font-semibold text-cyan-300 tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ECOSISTEMA OFICIAL • FÚTBOL PRO, BALONCESTO, PÁDEL & C.I.G DEPORVERSO GAME</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              La Evolución Digital del <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-[#00F0FF]">
                Deporte Organizado
              </span>
            </h1>

            {/* Párrafo Descriptivo Secundario */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Orquestación integral de torneos y disciplinas deportivas: <strong>Fútbol Pro</strong> (11v11, Indor 7 y 9), <strong>Baloncesto Oficial</strong>, <strong>Tenis & Pádel</strong> y <strong>C.I.G Deporverso game</strong>. Vocalía digital sin papel, sistema VAR oficial y carnets QR antifraude.
            </p>

            {/* Botones de Acción Oficial Deporverso */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => setShowCheckoutOfferModal(true)}
                className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-slate-950 tracking-wider uppercase bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00F0FF] hover:from-[#0052cc] hover:to-[#00d0dd] shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:shadow-[0_0_40px_rgba(0,240,255,0.95)] border border-[#00F0FF]/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Tag className="w-4 h-4 text-slate-950" />
                <span>Suscríbete y accede al 50% descuento</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenStepTour) {
                    onOpenStepTour(0);
                  } else if (onRequestDemo) {
                    onRequestDemo();
                  } else {
                    handleScrollToSection('capacidades');
                  }
                }}
                className="px-6 sm:px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#00F0FF] bg-[#050B1A]/90 hover:bg-[#08122B] border-2 border-[#00F0FF]/60 hover:border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] text-cyan-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer active:scale-95 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                <span>Ver Demo Multiverso</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* ESCENARIO CYBERPUNK HIGH-TECH INTERACTIVO (DISCIPLINAS FLOTANTES Y DEPORVERSO CORE V2.4) */}
          <CyberSportEcosystemStage
            onSelectSport={(sport) => {
              setActiveDiscipline(sport.toLowerCase());
              if (onSelectSport) onSelectSport(sport);
            }}
            onNavigateTab={onNavigateTab}
            onOpenCheckout={() => setShowCheckoutOfferModal(true)}
          />

        </section>

        {/* ======================================================== */}
        {/* PARTE 2: SECCIÓN DE CAPACIDADES (GRID DE 4 TARJETAS)     */}
        {/* ======================================================== */}
        <section id="capacidades" className="py-20 px-6 max-w-7xl mx-auto w-full relative z-20">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00F0FF] tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                ARQUITECTURA DE MISIÓN CRÍTICA
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Tecnología con Propósito Deportivo
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
              Una suite integrada de motores computacionales diseñada para ligas profesionales, federaciones y clubes que exigen máxima precisión operativa y escalabilidad global.
            </p>
          </div>

          {/* Cuadrícula de 4 Tarjetas Numeradas (01, 02, 03, 04) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* TARJETA 01 */}
            <div 
              onClick={() => onNavigateTab('league')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Gestión de Torneos en Vivo
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Sincronización instantánea de fixture dinámico, vocalía digital remota y control automatizado de amonestaciones y tablas de posiciones en tiempo real.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>MOTOR MULTI-TENANT</span>
                <span className="flex items-center gap-1 font-semibold">VER PORTAL <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 02 */}
            <div 
              onClick={() => onNavigateTab('var')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Video className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Sistema VAR y Video Arbitraje
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Repetición multicámara a la carta, calibración de líneas de fuera de juego, corte vertical asistido para redes y actas arbitrales selladas con hash de seguridad.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>MULTICÁMARA AUTOMÁTICA</span>
                <span className="flex items-center gap-1 font-semibold">VAR A LA CARTA <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 03 */}
            <div 
              onClick={() => onNavigateTab('scouting')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Analítica Avanzada de Rendimiento
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Métricas biomecánicas, mapas de calor interactivos, scouting de talentos y generación automática de crónicas y actas oficiales del torneo.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>MOTOR DE ANALÍTICA AVANZADA</span>
                <span className="flex items-center gap-1 font-semibold">SCOUTING <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 04 */}
            <div 
              onClick={() => onNavigateTab('calendar')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Fútbol Integral: 11, Indor 9, Indor 7 y Fútsal 5
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Soporte oficial y actas digitales para Fútbol 11 (Once), Indor 9 (Nueve), Indor 7 (Siete) y Fútsal 5 (Cinco jugadores) con control dinámico de tiempos, faltas y sanciones.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>FÚTBOL 11 • 9 • 7 • 5</span>
                <span className="flex items-center gap-1 font-semibold">CALENDARIO <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

          </div>

        </section>

        {/* ======================================================== */}
        {/* PARTE 3: PUENTE CINEMÁTICO HACIA LA HISTORIA EN 4 ACTOS */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* PARTE 3: SECCIÓN DE CONVERSIÓN Y ACCIÓN DE SOFTWARE      */}
        {/* ======================================================== */}
        <div className="relative py-16 px-6 max-w-7xl mx-auto w-full text-center border-t border-b border-white/10 my-10 bg-gradient-to-r from-transparent via-[#0066FF]/10 to-transparent">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080F24] border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF] mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>LANZAMIENTO OFICIAL LATAM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Transforma la Operación de Tu Liga Hoy
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Únete a la plataforma multideporte de alta precisión: sistema VAR oficial, vocalía digital en vivo, subdominio propio y carnets QR con un 50% de descuento ($35 por club y por torneo en vez de precio real $70) para las primeras 10 ligas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowCheckoutOfferModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00F0FF] hover:from-[#0052cc] hover:to-[#00d0dd] text-slate-950 text-sm font-black uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:shadow-[0_0_40px_rgba(0,240,255,0.95)] border border-[#00F0FF]/50 transition-all cursor-pointer active:scale-95"
            >
              <Tag className="w-4 h-4 text-slate-950" />
              <span>Suscríbete y accede al 50% descuento</span>
            </button>
            <button
              onClick={() => onNavigateTab('league')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#050B1A]/90 hover:bg-[#08122B] text-cyan-200 hover:text-white text-sm font-bold border-2 border-[#00F0FF]/60 hover:border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Trophy className="w-4 h-4 text-[#00F0FF]" />
              <span>Ver Portal de Liga</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PARTE 4: FOOTER UNIFICADO DE ALTA GAMA                  */}
        {/* ======================================================== */}
        <footer className="relative z-10 bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
              
              {/* Col 1: Brand */}
              <div className="space-y-3 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-white text-xs font-mono">
                      DV
                    </div>
                  </div>
                  <span className="text-base font-black text-white tracking-wider font-sans">
                    DEPORVERSO
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  "El universo digital donde cada club, jugador y aficionado tiene su lugar."
                </p>
                <div className="pt-1 text-[11px] font-mono text-cyan-400">
                  Dominio principal: <strong>deporverso.com</strong>
                </div>
              </div>

              {/* Col 2: Módulos de la Plataforma */}
              <div className="space-y-3">
                <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
                  Módulos de la Plataforma
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => onNavigateTab('league')}
                      className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                    >
                      Portal de Liga & Tablas en Vivo
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('vocalia')}
                      className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                    >
                      Vocalía Digital (Sin Papel)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('var')}
                      className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                    >
                      Sistema VAR Oficial
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('calendar')}
                      className="hover:text-indigo-300 transition-colors text-left cursor-pointer"
                    >
                      Calendario & Fixture Dinámico
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 3: Promoción & Marketing */}
              <div className="space-y-3">
                <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
                  Oferta & Recursos
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setShowCheckoutOfferModal(true)}
                      className="text-amber-400 hover:text-amber-300 font-bold transition-colors text-left cursor-pointer"
                    >
                      🔥 50% OFF (10 Primeras Ligas - $35/Eq)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 4: Seguridad y Autoría */}
              <div className="space-y-3">
                <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
                  Certificación Criptográfica
                </h4>
                <p className="text-slate-400 text-xs">
                  Plataforma protegida con sellado pericial de propiedad intelectual RFC 8032 Ed25519 y timestamps en blockchain pública.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CIG SECURITY CORE CERTIFIED</span>
                </div>
              </div>

            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <p>© 2026 DeporVerso • CORPORACIÓN E INNOVACIÓN GUERRA (CIG). Todos los derechos reservados.</p>
              <div className="flex items-center gap-4">
                <span>Quito • Guayaquil • Cuenca • LATAM</span>
                <span>Soporte: 0958610578</span>
              </div>
            </div>

          </div>
        </footer>

      </div>

      {/* MODAL CHECKOUT OFERTA EXCLUSIVA 50% OFF ($35/EQUIPO) */}
      <ExclusiveOfferCheckoutModal
        isOpen={showCheckoutOfferModal}
        onClose={() => setShowCheckoutOfferModal(false)}
        onAddTenant={onAddTenant}
      />

      {/* CLUB DETAIL MODAL */}
      {selectedClubModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedClubModal.badgeColor} p-1`}>
                  <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center font-black text-white text-xs font-mono">
                    {selectedClubModal.shortName}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedClubModal.name}</h3>
                  <span className="text-xs text-cyan-400 font-mono">https://{selectedClubModal.subdomain}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedClubModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Categoría:</span>
                <span className="text-white font-bold">{selectedClubModal.category}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ciudad / Sede:</span>
                <span className="text-white">{selectedClubModal.city}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Posición en Tabla:</span>
                <span className="text-emerald-400 font-bold">#{selectedClubModal.position} de 16 clubes</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Próximo Partido:</span>
                <span className="text-amber-300">vs {selectedClubModal.nextMatch.opponent} ({selectedClubModal.nextMatch.date})</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Subdominio oficial aislado
              </span>
              <button
                onClick={() => {
                  setSelectedClubModal(null);
                  onEnterPlatform();
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052cc] hover:to-[#00d0dd] text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.6)] border border-[#00F0FF]/40 transition-all active:scale-95"
              >
                <span>Entrar al Portal del Club</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
