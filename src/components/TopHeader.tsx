import React, { useState } from 'react';
import { 
  Trophy, Shield, UserCheck, Plus, Sparkles, ChevronDown, 
  Building2, QrCode, Globe, Check, Zap, AlertCircle, Lock, LogOut, Flame
} from 'lucide-react';
import { UserRole, Tenant, SportCode } from '../types';
import { SPORT_THEMES } from './Navbar';

interface TopHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  tenants: Tenant[];
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  activeSport: SportCode;
  setActiveSport: (sport: SportCode) => void;
  onOpenOnboarding: () => void;
  isSuperAdminAuth?: boolean;
  onOpenSuperAdminAuth?: () => void;
  onLogoutSuperAdmin?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  welcome: { title: 'Plataforma Global Deporverso', subtitle: 'Gestión Multideporte con IA, VAR, Vocalía Digital & Héroes VR' },
  calendar: { title: 'Calendario & Fixture Multideporte Cuántico', subtitle: 'Cronograma oficial de fechas, designaciones arbitrales, sedes y sincronización .ICS' },
  league: { title: 'Portal de Competición & Tablas', subtitle: 'Estadísticas, posiciones, fixture y sanciones en tiempo real' },
  vocalia: { title: 'Vocalía Digital en Vivo (Mesa de Control)', subtitle: 'PWA adaptable a las reglas de cada disciplina deportiva' },
  'vision-ai': { title: 'Visión Artificial Edge AI', subtitle: 'Inferencia local con WebAssembly para detección de eventos' },
  ingestion: { title: 'Ingesta Inteligente de Datos', subtitle: 'Parsing automático con Gemini Flash & Migración Asistida' },
  var: { title: 'VAR A la Carta', subtitle: 'Transmisión local de ultra baja latencia con replays' },
  chronicle: { title: 'IA Periodística Autogenerada', subtitle: 'Crónicas deportivas automáticas impulsadas por Gemini' },
  governance: { title: 'Asambleas Virtuales & Notificaciones', subtitle: 'Votaciones virtuales con Jitsi & Alertas por WhatsApp' },
  scouting: { title: 'Hub de Scouting & Talent Discovery', subtitle: 'Evaluación Deporverso Index (1-10) y Fichas Técnicas PDF' },
  tactics: { title: 'Pizarra Táctica & Analítica para DTs', subtitle: 'Simulador de formaciones con análisis táctico asistido por IA' },
  'heroes-vr': { title: 'Héroes VR (Próximamente)', subtitle: 'Simulador de carrera y deporte en casa en asociación con heroesdeldeporte.com' },
  'master-admin': { title: 'Panel Maestro SuperAdmin', subtitle: 'Gestión global de ligas, sincronización y auditoría' },
  'sql-viewer': { title: 'Consola SQL Supabase RLS', subtitle: 'Esquema empresarial de base de datos relacional' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  tenants,
  activeTenantId,
  setActiveTenantId,
  activeSport,
  setActiveSport,
  onOpenOnboarding,
  isSuperAdminAuth,
  onOpenSuperAdminAuth,
  onLogoutSuperAdmin
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);

  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Deporverso Engine', subtitle: 'Plataforma Multideporte Global' };
  const currentTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const currentSportTheme = SPORT_THEMES[activeSport] || SPORT_THEMES.FUTBOL;

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    SUPER_ADMIN: { label: 'SuperAdmin Maestro', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    LEAGUE_ADMIN: { label: 'Admin de Liga', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    TEAM_DELEGATE: { label: 'Delegado de Club', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    REFEREE: { label: 'Árbitro / Vocal', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    PLAYER: { label: 'Jugador / Aficionado', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#06080c]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
      {/* TÍTULO & BREADCRUMB CONTEXTUAL */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-transparent border border-emerald-500/30 items-center justify-center text-emerald-400 font-extrabold text-sm shadow-inner shadow-emerald-500/10">
          {currentSportTheme.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
              {currentTabInfo.title}
            </h1>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border hidden md:inline-flex items-center gap-1 ${currentSportTheme.badgeClass}`}>
              <span>{currentSportTheme.icon}</span>
              <span>{currentSportTheme.name}</span>
            </span>
          </div>
          <p className="text-[11px] text-white/50 truncate max-w-md hidden sm:block font-medium">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* TELEMETRÍA EN VIVO Y BARRA DE ACCIONES RÁPIDAS */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* TELEMETRY HUD PILL */}
        <div className="hidden xl:flex items-center gap-2 bg-[#0a0f16] border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono shadow-sm">
          <span className="flex items-center gap-1.5 text-emerald-400 font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE STREAM
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/50">PING <span className="text-cyan-400 font-bold">12ms</span></span>
          <span className="text-white/20">|</span>
          <span className="text-white/50">VAR <span className="text-emerald-400 font-bold">EDGE 4K</span></span>
        </div>

        {/* SELECTOR DE DEPORTE RÁPIDO */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSportDropdown(!showSportDropdown);
              setShowRoleDropdown(false);
              setShowTenantDropdown(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121212] border border-white/10 text-xs text-white hover:border-white/20 transition-all cursor-pointer font-bold"
          >
            <span>{currentSportTheme.icon}</span>
            <span className="hidden md:inline">{currentSportTheme.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
          </button>

          {showSportDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0c0c0c] border border-white/15 rounded-2xl shadow-2xl p-2 space-y-1 z-50">
              <span className="text-[10px] font-bold text-white/40 px-2 uppercase tracking-wider block mb-1">
                Seleccionar Disciplina
              </span>
              {Object.entries(SPORT_THEMES).map(([code, st]) => (
                <button
                  key={code}
                  onClick={() => {
                    setActiveSport(code as SportCode);
                    setShowSportDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSport === code
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{st.icon}</span>
                    <span>{st.name}</span>
                  </span>
                  {activeSport === code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SELECTOR DE LIGA / TENANT */}
        {tenants.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowTenantDropdown(!showTenantDropdown);
                setShowRoleDropdown(false);
                setShowSportDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121212] border border-[#00ff66]/40 text-xs text-[#00ff66] hover:border-[#00ff66] transition-all cursor-pointer font-black uppercase tracking-wider shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="truncate max-w-[130px] uppercase font-black text-[#00ff66]">{currentTenant?.name || 'LIGA'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#00ff66]/70" />
            </button>

            {showTenantDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0c0c0c] border border-[#00ff66]/30 rounded-2xl shadow-2xl p-2 space-y-1 z-50">
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/10">
                  <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                    Ligas Registradas
                  </span>
                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      onOpenOnboarding();
                    }}
                    className="text-[10px] font-bold text-[#00ff66] hover:underline cursor-pointer"
                  >
                    + Nueva Liga
                  </button>
                </div>
                {tenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTenantId(t.id);
                      setShowTenantDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTenantId === t.id
                        ? 'bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="text-left truncate">
                      <span className="block truncate uppercase font-bold text-[#00ff66]">{t.name}</span>
                      <span className="text-[9px] text-[#A0A0A0] font-mono block">{t.domain}</span>
                    </div>
                    {activeTenantId === t.id && <Check className="w-3.5 h-3.5 shrink-0 text-[#00ff66]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SELECTOR DE ROL DE USUARIO */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowTenantDropdown(false);
              setShowSportDropdown(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${roleLabels[userRole].color}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{roleLabels[userRole].label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0c0c0c] border border-white/15 rounded-2xl shadow-2xl p-2 space-y-1 z-50">
              <span className="text-[10px] font-bold text-white/40 px-2 uppercase tracking-wider block mb-1">
                Cambiar Perfil de Usuario
              </span>
              {(Object.keys(roleLabels) as UserRole[])
                .filter(r => r !== 'SUPER_ADMIN' || isSuperAdminAuth)
                .map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRole === r
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {userRole === r && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}

              {!isSuperAdminAuth && (
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenSuperAdminAuth?.();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer mt-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Acceso de Administración</span>
                  </span>
                  <Lock className="w-3 h-3 text-amber-400" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* INDICADOR Y BOTÓN DE SALIDA MODO ADMIN */}
        {isSuperAdminAuth && (
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 px-2.5 py-1.5 rounded-xl shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide hidden sm:inline">
              Modo Admin
            </span>
            {onLogoutSuperAdmin && (
              <button
                onClick={onLogoutSuperAdmin}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                title="Salir del Modo Administrador"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Salir</span>
              </button>
            )}
          </div>
        )}

        {/* INSIGNIA FIREBASE FIRESTORE EN VIVO */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-sm" title="Base de datos en tiempo real Google Firebase Firestore activa">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-white/70">Firestore:</span>
          <span className="text-amber-400 font-mono text-[10px]">thin-aloe-bbndl</span>
        </div>

        {/* BOTÓN CREAR LIGA DIRECTO */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Crear Mi Liga</span>
          <span className="lg:hidden">Crear Liga</span>
        </button>
      </div>
    </header>
  );
};
