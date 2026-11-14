import React from 'react';
import { UnifiedDeporversoExperience } from './UnifiedDeporversoExperience';
import { Tenant, UserRole } from '../../types';
import { ArrowRight, Sparkles, UserPlus } from 'lucide-react';

interface WelcomePageProps {
  onNavigateTab: (tab: string) => void;
  onEnterFullPlatform?: (tabKey?: string) => void;
  onOpenAffiliation?: () => void;
  onAddTenant?: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  setUserRole?: (role: UserRole) => void;
  onOpenStepTour?: (stepIndex?: number) => void;
  onOpenAuthModal?: (mode?: 'register' | 'login') => void;
  isAuthenticated?: boolean;
  hasPaidFullAccess?: boolean;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateTab,
  onEnterFullPlatform,
  onOpenAffiliation,
  onAddTenant,
  onOpenStepTour,
  onOpenAuthModal,
  isAuthenticated = false
}) => {
  const handleEnter = (tabKey: string = 'league') => {
    if (onEnterFullPlatform) {
      onEnterFullPlatform(tabKey);
    } else {
      onNavigateTab(tabKey);
    }
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#030611] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* ============================================================== */}
      {/* HEADER ÚNICO DE NAVEGACIÓN (3 ZONAS LIMPIAS Y EN UNA LÍNEA)     */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* ZONA 1: IDENTIDAD DE MARCA + INFO DE LANZAMIENTO COMPACTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] p-[1.5px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#050A18] rounded-[10px] flex items-center justify-center font-mono font-black text-xs text-white">
                  DV
                </div>
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                Depor<span className="text-[#00F0FF]">Verso</span>
              </span>
            </button>
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300/95 pl-3 border-l border-white/10 whitespace-nowrap">
              50% OFF Lanzamiento · $35 mayores / $25 formativas
            </span>
          </div>

          {/* ZONA 2: ENLACES DE NAVEGACIÓN DE UNA LÍNEA */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => scrollToElement('hero-section')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Ecosistema
            </button>
            <button
              type="button"
              onClick={() => scrollToElement('video-broadcast')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Broadcast & VAR
            </button>
            <button
              type="button"
              onClick={() => scrollToElement('capacidades')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Capacidades
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated && onOpenAuthModal) {
                  onOpenAuthModal('register');
                } else {
                  handleEnter('league');
                }
              }}
              className="px-3 py-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/10 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{isAuthenticated ? 'Ir al Portal Demo' : 'Ver Demo en Vivo'}</span>
            </button>
          </nav>

          {/* ZONA 3: AUTENTICACIÓN + CTA PRINCIPAL ÚNICO */}
          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated && onOpenAuthModal && (
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ingresar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigateTab('exclusive-offer')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:opacity-95 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Suscribirse 50% OFF</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* CONTENIDO PRINCIPAL: ECOSISTEMA DEPORVERSO                     */}
      {/* ============================================================== */}
      <div className="w-full">
        <section id="ecosistema" className="w-full">
          <UnifiedDeporversoExperience
            onNavigateTab={handleEnter}
            onEnterPlatform={() => handleEnter('league')}
            onAddTenant={onAddTenant}
            onOpenStepTour={onOpenStepTour}
            onRequestDemo={onOpenStepTour ? () => onOpenStepTour(0) : () => handleEnter('league')}
            onStartNow={() => {
              if (onOpenAffiliation) {
                onOpenAffiliation();
              } else {
                onNavigateTab('exclusive-offer');
              }
            }}
          />
        </section>
      </div>
    </div>
  );
};
