import React, { useState } from 'react';
import { DeporversoCanvas } from '../three/DeporversoCanvas';
import { Header } from './Header';
import { ScrollProgress } from './ScrollProgress';
import { Act01Origin } from '../acts/Act01Origin';
import { Act02DigitalAwakening } from '../acts/Act02DigitalAwakening';
import { Act03Ecosystem } from '../acts/Act03Ecosystem';
import { Act04Multiverse } from '../acts/Act04Multiverse';
import { Footer } from './Footer';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { ClubData } from '../../data/clubs';
import { X, ExternalLink, Shield, Trophy } from 'lucide-react';
import { ScrollytellingLightbox } from './ScrollytellingLightbox';
import { PresentationTourControl } from './PresentationTourControl';
import deporversoDarkBg from '../../assets/images/deporverso_dark_bg_1789426720628.jpg';
import canchaTierraImg from '../../assets/images/acto1_cancha_tierra_1789418204541.jpg';
import despertarDigitalImg from '../../assets/images/acto2_despertar_digital_1789418217850.jpg';
import estadioVarImg from '../../assets/images/acto3_estadio_var_1789418234243.jpg';
import multiverseCosmicoImg from '../../assets/images/acto4_multiverso_cosmico_1789418246887.jpg';

interface MainExperienceProps {
  onEnterPlatform: () => void;
  onOpenOnboarding?: () => void;
  onSelectTab?: (tabKey: string) => void;
}

const ACT_BACKGROUND_SCENES = [
  {
    act: 1,
    img: canchaTierraImg,
    alt: 'Acto 01 • El Origen - Cancha de Tierra Barrial',
    glowColor: 'rgba(217, 119, 6, 0.25)'
  },
  {
    act: 2,
    img: despertarDigitalImg,
    alt: 'Acto 02 • El Despertar Digital - Arquitectura Cloud y Subdominios',
    glowColor: 'rgba(6, 182, 212, 0.25)'
  },
  {
    act: 3,
    img: estadioVarImg,
    alt: 'Acto 03 • El Ecosistema Pro - Estadio Moderno y VAR 4K',
    glowColor: 'rgba(16, 185, 129, 0.25)'
  },
  {
    act: 4,
    img: multiverseCosmicoImg,
    alt: 'Acto 04 • El Multiverso Deportivo - Convergencia y Realidad Virtual',
    glowColor: 'rgba(99, 102, 241, 0.25)'
  }
];

export const MainExperience: React.FC<MainExperienceProps> = ({
  onEnterPlatform,
  onOpenOnboarding = onEnterPlatform,
  onSelectTab
}) => {
  const { progress, activeAct } = useScrollProgress();
  const [selectedClubModal, setSelectedClubModal] = useState<ClubData | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  const handleNavigateAct = (actNumber: 1 | 2 | 3 | 4) => {
    const actElement = document.getElementById(`act-${actNumber}`);
    if (actElement) {
      actElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateToSegments = () => {
    const segElement = document.getElementById('deporverso-segments-directory');
    if (segElement) {
      segElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#03060f] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 0. Dynamic Cinematic Background Scenery: Actual Modern Imagery Synchronized With Each Act */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Base dark high-tech stadium texture */}
        <img
          src={deporversoDarkBg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-20 mix-blend-screen filter brightness-75 contrast-125"
        />

        {/* Dynamic Act Scene Images with Smooth Crossfade and Slow Cinematic Zoom */}
        {ACT_BACKGROUND_SCENES.map((scene) => {
          const isActive = activeAct === scene.act;
          return (
            <div
              key={scene.act}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-30' : 'opacity-0'
              }`}
            >
              <img
                src={scene.img}
                alt={scene.alt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center filter brightness-90 contrast-125 saturate-110 transform transition-transform duration-[12000ms] ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Soft Vignette and Vignette Gradient Overlays for Flawless Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060f]/90 via-[#03060f]/80 to-[#03060f]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#03060f]/60 to-[#03060f]" />
      </div>

      {/* 1. Global Three.js / 2D Adaptive Canvas Background */}
      <DeporversoCanvas progress={progress} activeAct={activeAct} />

      {/* 2. Top Header Navigation */}
      <Header
        onNavigateAct={handleNavigateAct}
        onEnterPlatform={onEnterPlatform}
        activeAct={activeAct}
        onStartTour={() => setIsTourActive(true)}
      />

      {/* 3. Lateral / Top Progress HUD */}
      <ScrollProgress
        progress={progress}
        activeAct={activeAct}
        onNavigateAct={handleNavigateAct}
      />

      {/* Conference Presentation / Auto-Tour HUD */}
      <PresentationTourControl
        onNavigateAct={handleNavigateAct}
        onNavigateToSegments={handleNavigateToSegments}
        activeAct={activeAct}
        isActive={isTourActive}
        onToggleActive={setIsTourActive}
      />

      {/* 4. Act I: El Origen (Cancha de Tierra Barrial) */}
      <Act01Origin
        onNextAct={() => handleNavigateAct(2)}
        onOpenLightbox={(idx) => setActiveLightboxIndex(idx)}
      />

      {/* 5. Act II: El Despertar Digital (Transformación de Acta Física a Subdominios Cloud) */}
      <Act02DigitalAwakening
        onNextAct={() => handleNavigateAct(3)}
        onOpenLightbox={(idx) => setActiveLightboxIndex(idx)}
      />

      {/* 6. Act III: El Ecosistema (Clubes, VAR a la Carta, Fan Zone, Tienda) */}
      <Act03Ecosystem
        onNextAct={() => handleNavigateAct(4)}
        onSelectClubModal={(club) => setSelectedClubModal(club)}
        onOpenLightbox={(idx) => setActiveLightboxIndex(idx)}
      />

      {/* 7. Act IV: El Multiverso (Espacio 3D, Héroes del Deporte, Player Card 3D rotatoria, Cierre de Marca & Directorio) */}
      <Act04Multiverse
        onEnterPlatform={onEnterPlatform}
        onOpenOnboarding={onOpenOnboarding}
        onScrollToTop={() => handleNavigateAct(1)}
        onOpenLightbox={(idx) => setActiveLightboxIndex(idx)}
        onSelectTab={onSelectTab}
      />

      {/* 8. Editorial Premium Footer */}
      <Footer
        onNavigateAct={handleNavigateAct}
        onEnterPlatform={onEnterPlatform}
      />

      {/* Minimalist 4K Scrollytelling Lightbox */}
      <ScrollytellingLightbox
        currentIndex={activeLightboxIndex}
        onClose={() => setActiveLightboxIndex(null)}
        onSelectIndex={(idx) => setActiveLightboxIndex(idx)}
      />

      {/* Club Detail Modal */}
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
