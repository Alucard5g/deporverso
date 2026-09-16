import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Globe, ExternalLink, Sparkles, Presentation } from 'lucide-react';

interface HeaderProps {
  onNavigateAct: (actNumber: 1 | 2 | 3 | 4) => void;
  onEnterPlatform: () => void;
  activeAct: 1 | 2 | 3 | 4;
  onStartTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigateAct, 
  onEnterPlatform, 
  activeAct,
  onStartTour
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/60'
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateAct(1)}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-300 text-sm tracking-tighter font-mono">
                  DV
                </span>
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-white flex items-center gap-1.5 font-sans">
                DEPORVERSO
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold uppercase tracking-normal">
                  3D
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-mono">
                deporverso.com
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <button
            onClick={() => onNavigateAct(1)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeAct === 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            01 El Origen
          </button>
          <button
            onClick={() => onNavigateAct(2)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeAct === 2
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            02 Digital
          </button>
          <button
            onClick={() => onNavigateAct(3)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeAct === 3
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            03 Ecosistema & VAR
          </button>
          <button
            onClick={() => onNavigateAct(4)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeAct === 4
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            04 Multiverso
          </button>
          <a
            href="https://heroesdeldeporte.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Héroes
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </nav>

        {/* Action Button: [ ENTRAR ] */}
        <div className="hidden sm:flex items-center gap-3">
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-md"
              title="Iniciar Modo Conferencia / Auto-Tour a Dirigentes"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Tour</span>
            </button>
          )}

          <button
            onClick={onEnterPlatform}
            className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#00e676] via-[#00d2b4] to-[#00e5ff] hover:brightness-110 active:scale-95 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer border border-emerald-300/40"
          >
            <span>ENTRA AL DEPORVERSO COMPLETO</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onEnterPlatform}
            className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00e676] to-[#00e5ff] text-slate-950 cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-900/80 rounded-xl border border-white/10"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            <button
              onClick={() => {
                onNavigateAct(1);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              01 El Origen (La Cancha de Tierra)
            </button>
            <button
              onClick={() => {
                onNavigateAct(2);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              02 El Despertar Digital
            </button>
            <button
              onClick={() => {
                onNavigateAct(3);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              03 El Ecosistema, Clubes & VAR
            </button>
            <button
              onClick={() => {
                onNavigateAct(4);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              04 El Multiverso Deportivo
            </button>
            <a
              href="https://heroesdeldeporte.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-amber-300 hover:bg-slate-900"
            >
              <span>Héroes del Deporte</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                onEnterPlatform();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
            >
              [ ENTRAR AL DEPORVERSO ]
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
