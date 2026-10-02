import React, { useState, useEffect } from 'react';
import { 
  Trophy, Video, Activity, Globe, Sparkles, ChevronRight, 
  ExternalLink, QrCode, FileText, CheckCircle, ShieldCheck, 
  Flame, ArrowRight, X, Cpu, Layers, Zap, Tag, Image as ImageIcon,
  Presentation, ChevronDown, CheckCircle2, Shield
} from 'lucide-react';
import { SportCode, Tenant } from '../../types';
import { DeporversoCanvas } from '../three/DeporversoCanvas';
import { ScrollProgress } from '../immersive/ScrollProgress';
import { Act01Origin } from '../acts/Act01Origin';
import { Act02DigitalAwakening } from '../acts/Act02DigitalAwakening';
import { Act03Ecosystem } from '../acts/Act03Ecosystem';
import { Act04Multiverse } from '../acts/Act04Multiverse';
import { ScrollytellingLightbox } from '../immersive/ScrollytellingLightbox';
import { PresentationTourControl } from '../immersive/PresentationTourControl';
import { ExclusiveOfferCheckoutModal } from '../Marketing/ExclusiveOfferCheckoutModal';
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
  onAddTenant
}) => {
  const { progress, activeAct } = useScrollProgress();
  const [showTechModal, setShowTechModal] = useState<boolean>(false);
  const [showCheckoutOfferModal, setShowCheckoutOfferModal] = useState<boolean>(false);
  const [selectedClubModal, setSelectedClubModal] = useState<ClubData | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeDiscipline, setActiveDiscipline] = useState<string>('futbol');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateAct = (actNumber: 1 | 2 | 3 | 4) => {
    const actElement = document.getElementById(`act-${actNumber}`);
    if (actElement) {
      actElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

      {/* BANNER PROMOCIONAL SUPERIOR: OFERTA 50% OFF PRIMERAS 10 LIGAS */}
      <div className="relative z-50 w-full bg-gradient-to-r from-[#0066FF] via-[#00F0FF] to-[#0066FF] p-[1px] shadow-[0_4px_25px_rgba(0,102,255,0.4)]">
        <div className="bg-[#030712]/95 px-4 py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            SUPER OFERTA PRIMERAS 10 LIGAS:
          </span>
          <span className="text-slate-200">
            Precio oficial <span className="line-through text-slate-400 font-mono">$70</span> • Ahora con <strong className="text-[#00F0FF] font-bold">50% DE DESCUENTO: solo $35 por equipo</strong>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold border border-red-500/40 animate-pulse">
            ¡Solo 4 de 10 cupos restantes!
          </span>
          <button
            onClick={() => setShowCheckoutOfferModal(true)}
            className="px-3.5 py-1 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,102,255,0.7)] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span>Reclamar $35/Equipo</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]" />
          </button>
        </div>
      </div>

      {/* CABECERA FLOTANTE GLASSMORPHIC UNIFICADA */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#030712]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          
          {/* LOGOTIPO */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00F0FF] p-[1.5px] shadow-[0_0_20px_rgba(0,102,255,0.6)]">
              <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00F0FF] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m4.93 4.93 4.24 4.24"/>
                  <path d="m14.83 9.17 4.24-4.24"/>
                  <path d="m14.83 14.83 4.24 4.24"/>
                  <path d="m9.17 14.83-4.24 4.24"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                DEPORVERSO
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              </span>
              <p className="text-[10px] text-[#00F0FF]/80 font-mono tracking-widest uppercase">Multi-Sport Platform</p>
            </div>
          </div>

          {/* ACTIVE SCENE INDICATOR (Visible en desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080F24]/80 border border-[#00F0FF]/30 backdrop-blur-xl text-xs font-mono text-slate-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="text-[#00F0FF] font-bold">{currentScene.title}:</span>
            <span className="text-white font-medium">{currentScene.subtitle}</span>
          </div>

          {/* MENÚ CÁPSULA GLASSMORPHIC UNIFICADO */}
          <nav className="hidden md:flex items-center gap-1 bg-[#080F24]/75 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleScrollToSection('capacidades')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Capacidades
            </button>
            <button
              onClick={() => onNavigateTab('league')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Portal de Liga
            </button>
            <button
              onClick={() => onNavigateTab('vocalia')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Vocalía Digital
            </button>
            <button
              onClick={() => onNavigateTab('var')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Sistema VAR
            </button>
          </nav>

          {/* ACCIONES TOP */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCheckoutOfferModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 hover:text-white hover:bg-amber-500/20 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>50% OFF ($35/Eq)</span>
            </button>

            <button
              onClick={onEnterPlatform}
              className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-white tracking-wide bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_20px_rgba(0,102,255,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Entrar a Plataforma</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
            </button>
          </div>

        </div>
      </header>

      {/* HUD DE PROGRESO LATERAL FLOTANTE */}
      <ScrollProgress
        progress={progress}
        activeAct={activeAct}
        onNavigateAct={handleNavigateAct}
      />

      {/* CONTROL DE PRESENTACIÓN AUTOMÁTICA */}
      <PresentationTourControl
        onNavigateAct={handleNavigateAct}
        onNavigateToSegments={() => handleScrollToSection('deporverso-segments-directory')}
        activeAct={activeAct}
        isActive={isTourActive}
        onToggleActive={setIsTourActive}
      />

      {/* CONTENIDO PRINCIPAL FUSIONADO */}
      <div className="relative z-10 flex flex-col">
        
        {/* ======================================================== */}
        {/* PARTE 1: HERO SECTION (LANDING FUTURISTA)               */}
        {/* ======================================================== */}
        <section id="hero-section" className="flex flex-col justify-center px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto w-full min-h-[90vh]">
          
          <div className="text-center max-w-4xl mx-auto pt-6 pb-4">
            
            {/* Píldora Superior: Badge Plataforma de Fútbol */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F172A]/80 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-xs font-semibold text-emerald-300 tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LANZAMIENTO OFICIAL • FÚTBOL 11, INDOR 9, INDOR 7 Y FÚTSAL 5</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              La Evolución Digital del <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-[#00F0FF]">
                Fútbol Organizado
              </span>
            </h1>

            {/* Párrafo Descriptivo Secundario */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Orquestación integral de torneos de fútbol en sus 4 modalidades oficiales: <strong>Fútbol 11</strong> (Once jugadores), <strong>Indor 9</strong> y <strong>Indor 7</strong> (Siete y Nueve jugadores) y <strong>Fútsal 5</strong> (Cinco jugadores). Vocalía digital sin papel, sistema VAR oficial y carnets QR antifraude.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => setShowCheckoutOfferModal(true)}
                className="px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white tracking-wide bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.7)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Tag className="w-4 h-4 text-[#00F0FF]" />
                <span>Oferta 50% OFF ($35/Eq)</span>
              </button>

              <button
                onClick={() => handleScrollToSection('capacidades')}
                className="px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900/90 hover:bg-slate-800 border border-[#00F0FF]/40 hover:border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Shield className="w-4 h-4 text-[#00F0FF]" />
                <span>Ver Módulos del Sistema</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#00F0FF]" />
              </button>
              
              <button
                onClick={() => setShowTechModal(true)}
                className="px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                Documentación Técnica
              </button>
            </div>
          </div>

          {/* ESCENARIO CENTRAL 3D / VÓRTICE CON PÍLDORAS FLOTANTES DE DISCIPLINAS */}
          <div className="relative w-full max-w-5xl mx-auto h-[440px] md:h-[500px] flex items-center justify-center mt-2">
            
            {/* Piso con Ondas y Reflejos Concéntricos */}
            <div 
              className="absolute bottom-6 w-[340px] md:w-[580px] h-[150px] rounded-[100%] border border-[#00F0FF]/30 flex items-center justify-center"
              style={{
                background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(0, 102, 255, 0.25), rgba(3, 7, 18, 0.95) 75%)'
              }}
            >
              <div className="w-4 h-4 rounded-full bg-[#00F0FF] shadow-[0_0_30px_#00F0FF] z-10" />
            </div>

            {/* Píldoras Flotantes Alrededor del Vórtice: 4 MODALIDADES DE FÚTBOL */}
            
            {/* 1. Fútbol 11 (Once vs Once) */}
            <div 
              onClick={() => {
                setActiveDiscipline('futbol');
                if (onSelectSport) onSelectSport('FUTBOL');
                onNavigateTab('league');
              }}
              className="absolute top-12 left-4 sm:left-10 lg:left-16 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  ⚽
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Fútbol 11</p>
                  <p className="text-[10px] text-emerald-300/80 font-mono">11 vs 11 • Reglamentario</p>
                </div>
              </div>
            </div>

            {/* 2. Indor Fútbol 9 (Nueve vs Nueve) */}
            <div 
              onClick={() => {
                setActiveDiscipline('futbol');
                if (onSelectSport) onSelectSport('FUTBOL');
                onNavigateTab('league');
              }}
              className="absolute bottom-24 left-4 sm:left-16 lg:left-24 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  ⚽
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Indor Fútbol 9</p>
                  <p className="text-[10px] text-cyan-300/80 font-mono">9 vs 9 • Cancha Sintética</p>
                </div>
              </div>
            </div>

            {/* 3. Indor Fútbol 7 (Siete vs Siete) */}
            <div 
              onClick={() => {
                setActiveDiscipline('futbol');
                if (onSelectSport) onSelectSport('FUTBOL');
                onNavigateTab('league');
              }}
              className="absolute top-10 right-4 sm:right-10 lg:right-16 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-teal-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                  ⚽
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Indor Fútbol 7</p>
                  <p className="text-[10px] text-teal-300/80 font-mono">7 vs 7 • Formato Rápido</p>
                </div>
              </div>
            </div>

            {/* 4. Fútsal 5 (Cinco vs Cinco) */}
            <div 
              onClick={() => {
                setActiveDiscipline('futbol');
                if (onSelectSport) onSelectSport('FUTBOL');
                onNavigateTab('league');
              }}
              className="absolute bottom-24 right-4 sm:right-16 lg:right-24 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  ⚽
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Fútsal 5</p>
                  <p className="text-[10px] text-amber-300/80 font-mono">5 vs 5 • Coliseo / Sala</p>
                </div>
              </div>
            </div>

            {/* 5. Centro: Píldora de Estado Central */}
            <div className="absolute z-30 bottom-10">
              <div className="px-5 py-2 rounded-full bg-[#080F24]/80 backdrop-blur-xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white font-bold">DEPORVERSO CORE v2.4</span>
                <span className="text-slate-500">|</span>
                <span className="text-[11px] text-[#00F0FF] font-medium">99.99% Uptime</span>
              </div>
            </div>

          </div>

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
                <span>FFMPEG + YOLOv8</span>
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
            Únete a la plataforma multideporte de alta precisión: sistema VAR oficial, vocalía digital en vivo, subdominio propio y carnets QR con un 50% de descuento ($35 por equipo en vez de $70) para las primeras 10 ligas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowCheckoutOfferModal(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-bold shadow-[0_0_25px_rgba(0,102,255,0.7)] transition-all cursor-pointer active:scale-95"
            >
              <Tag className="w-4 h-4 text-[#00F0FF]" />
              <span>Asegurar 50% OFF ($35/Equipo)</span>
            </button>
            <button
              onClick={onEnterPlatform}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-white text-sm font-semibold border border-white/15 transition-all cursor-pointer"
            >
              <span>Entrar a Plataforma</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
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
                  <li>
                    <button
                      onClick={() => setShowTechModal(true)}
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      Documentación Técnica CIG
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

      {/* MODAL DOCUMENTACIÓN TÉCNICA CIG */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#090F1E] border border-[#00F0FF]/30 rounded-3xl p-7 shadow-[0_0_50px_rgba(0,102,255,0.4)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Especificaciones Técnicas DeporVerso</h3>
                  <p className="text-xs font-mono text-[#00F0FF]">Arquitectura Escalable de Misión Crítica</p>
                </div>
              </div>
              <button
                onClick={() => setShowTechModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
                  <span>Aislamiento Multi-Tenant & RLS en Base de Datos</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Arquitectura con políticas de seguridad a nivel de fila (Row Level Security) y aislamiento de datos por liga, garantizando confidencialidad absoluta de socios, contratos y finanzas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Pipeline VAR en Tiempo Real & Procesamiento de Video</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Motor de transcodificación FFmpeg de baja latencia acoplado a modelos de visión por computador (YOLOv8 + EasyOCR) para detección automatizada de jugadas polémicas y cronometraje oficial.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Sellado Criptográfico CIG Core (RFC 8032 Ed25519)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Cada acta digital, resolución de asamblea y registro de puntuación cuenta con sellado pericial de integridad hash SHA-256 inmutable.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowTechModal(false)}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MINIMALIST 4K SCROLLYTELLING LIGHTBOX */}
      <ScrollytellingLightbox
        currentIndex={activeLightboxIndex}
        onClose={() => setActiveLightboxIndex(null)}
        onSelectIndex={(idx) => setActiveLightboxIndex(idx)}
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
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
