import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Globe, ExternalLink, Sparkles, Presentation, QrCode } from 'lucide-react';

interface HeaderProps {
  onNavigateAct: (actNumber: 1 | 2 | 3 | 4) => void;
  onEnterPlatform: () => void;
  activeAct: 1 | 2 | 3 | 4;
  onStartTour?: () => void;
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

export const Header: React.FC<HeaderProps> = ({ 
  onNavigateAct, 
  onEnterPlatform, 
  activeAct,
  onStartTour
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentScene = ACT_SCENE_INFO[activeAct] || ACT_SCENE_INFO[1];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[#030712]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* LOGO: Deporverso con estética neón del video */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateAct(1)}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
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
              <p className="text-[10px] text-[#00F0FF]/80 font-mono tracking-widest uppercase">Scrollytelling Experience</p>
            </div>
          </button>

          {/* ACTIVE SCENE BADGE (Idéntico a la píldora informativa del video) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080F24]/80 border border-[#00F0FF]/30 backdrop-blur-xl text-xs font-mono text-slate-300 shadow-lg shadow-[#0066FF]/10">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="text-[#00F0FF] font-bold">{currentScene.title}:</span>
            <span className="text-white font-medium">{currentScene.subtitle}</span>
          </div>
        </div>

        {/* MENÚ CENTRAL EN CÁPSULA GLASSMORPHIC (Estilo exacto del video) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#080F24]/75 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
          <button
            onClick={() => onNavigateAct(1)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAct === 1
                ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.7)] border border-[#00F0FF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            01 Origen
          </button>
          <button
            onClick={() => onNavigateAct(2)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAct === 2
                ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.7)] border border-[#00F0FF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            02 Digital
          </button>
          <button
            onClick={() => onNavigateAct(3)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAct === 3
                ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.7)] border border-[#00F0FF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            03 Ecosistema & VAR
          </button>
          <button
            onClick={() => onNavigateAct(4)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAct === 4
                ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.7)] border border-[#00F0FF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            04 Multiverso
          </button>
          <a
            href="https://heroesdeldeporte.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-[#00F0FF] flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            Héroes
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </nav>

        {/* ACCIONES DERECHA: QR BADGE Y BOTÓN GLOW DE ACCIÓN */}
        <div className="flex items-center gap-3">
          {/* Badge estilo QR "Easy to Start with Our App" del video */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#080F24]/75 backdrop-blur-xl border border-white/10 text-xs">
            <div className="w-6 h-6 bg-white rounded p-0.5 flex items-center justify-center">
              <QrCode className="w-full h-full text-black" />
            </div>
            <div className="leading-tight text-left">
              <p className="font-semibold text-white text-[11px]">App Oficial</p>
              <p className="text-[9px] text-slate-400">Escanea y Juega</p>
            </div>
          </div>

          {onStartTour && (
            <button
              onClick={onStartTour}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-bold text-cyan-300 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 transition-all cursor-pointer shadow-md whitespace-nowrap"
              title="Iniciar Modo Conferencia / Auto-Tour a Dirigentes"
            >
              <Presentation className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Auto-Tour</span>
            </button>
          )}

          {/* Botón Primario con Resplandor Neón */}
          <button
            onClick={onEnterPlatform}
            className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white tracking-wide bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Entrar a Plataforma</span>
            <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
          </button>

          {/* Menú Móvil Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 py-4 bg-[#080F24]/95 backdrop-blur-2xl border-b border-white/10 space-y-2">
          <button
            onClick={() => { onNavigateAct(1); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeAct === 1 ? 'bg-[#0066FF] text-white' : 'text-slate-300'}`}
          >
            01 • El Origen Barrial
          </button>
          <button
            onClick={() => { onNavigateAct(2); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeAct === 2 ? 'bg-[#0066FF] text-white' : 'text-slate-300'}`}
          >
            02 • Despertar Digital
          </button>
          <button
            onClick={() => { onNavigateAct(3); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeAct === 3 ? 'bg-[#0066FF] text-white' : 'text-slate-300'}`}
          >
            03 • Ecosistema Pro & VAR
          </button>
          <button
            onClick={() => { onNavigateAct(4); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeAct === 4 ? 'bg-[#0066FF] text-white' : 'text-slate-300'}`}
          >
            04 • Multiverso Deportivo
          </button>
        </div>
      )}
    </header>
  );
};
