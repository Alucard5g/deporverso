import React from 'react';
import { UnifiedDeporversoExperience } from './UnifiedDeporversoExperience';
import { Tenant, UserRole } from '../../types';
import { 
  ArrowRight, UserPlus, Tag, Flame, CheckCircle2, Shield, Sparkles
} from 'lucide-react';

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
  isAuthenticated = false,
  hasPaidFullAccess = false
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
      {/* 1. BANNER PROMOCIONAL SUPERIOR: 50% OFF LANZAMIENTO           */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0066FF] via-[#00F0FF] to-[#0066FF] p-[1px] shadow-[0_4px_25px_rgba(0,102,255,0.4)]">
        <div className="bg-[#030712]/95 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 font-black text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              OFERTA DE LANZAMIENTO (50% OFF):
            </span>
            <span className="text-slate-200">
              Solo <strong className="text-cyan-300 font-black text-sm">$35 por club y por torneo</strong>
              <span className="text-slate-400 ml-1.5 line-through font-mono">(Precio real: $70)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold border border-red-500/40 animate-pulse">
              ¡Cupos con 50% de descuento activos!
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated && onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shadow transition-all cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3 text-slate-950" />
                <span>Registrarse en la App</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('exclusive-offer')}
              className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:opacity-90 text-slate-950 font-black text-[11px] shadow-[0_0_15px_rgba(0,240,255,0.6)] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <span>Suscríbete y accede al 50% descuento</span>
              <ArrowRight className="w-3 h-3 text-slate-950" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SUB-BARRA DE NAVEGACIÓN RÁPIDA EN INICIO                   */}
      {/* ============================================================== */}
      <div className="bg-[#050B1B]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white tracking-tight">
              Depor<span className="text-cyan-400">Verso</span>
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono px-2 py-0.5 rounded-full font-bold">
              INICIO
            </span>
          </div>
        </div>

        {/* Accesos rápidos dentro de la página */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              if (!isAuthenticated && onOpenAuthModal) {
                onOpenAuthModal('register');
              } else {
                handleEnter('league');
              }
            }}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transform hover:scale-105 active:scale-95"
            title="Acceder a la demo de la Liga Pichincha y el Club Deporverso"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAuthenticated ? 'Demo Liga Pichincha & Club Deporverso' : 'Registrarse para Ver Demo'}</span>
          </button>

          <button
            onClick={() => scrollToElement('ecosistema')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ecosistema Multideporte</span>
          </button>

          <button
            onClick={() => onNavigateTab('exclusive-offer')}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all cursor-pointer flex items-center gap-1.5 transform hover:scale-105 active:scale-95"
          >
            <Tag className="w-3.5 h-3.5 text-slate-950" />
            <span>Suscríbete y accede al 50% descuento</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CONTENIDO PRINCIPAL: ECOSISTEMA                             */}
      {/* ============================================================== */}
      <div className="space-y-16 pb-12">

        {/* ------------------------------------------------------------ */}
        {/* SECCIÓN A: MANIFIESTO, LOS 4 ACTOS Y ECOSISTEMA DEPORTIVO   */}
        {/* ------------------------------------------------------------ */}
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
