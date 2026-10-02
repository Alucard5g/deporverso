import React, { useState } from 'react';
import { 
  Trophy, Shield, Plus, Sparkles, ChevronDown, 
  Building2, QrCode, Globe, Check, Zap, LogOut, Flame
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
  onLogoutSuperAdmin?: () => void;
  onElevateToSuperAdmin?: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  welcome: { title: 'Plataforma Global Deporverso', subtitle: 'Gestión Multideporte con Sistema VAR, Vocalía Digital y Analítica Oficial' },
  calendar: { title: 'Calendario & Fixture Multideporte', subtitle: 'Cronograma oficial de fechas, sedes y sincronización .ICS' },
  league: { title: 'Portal de Competición & Tablas', subtitle: 'Estadísticas, posiciones, fixture y sanciones en tiempo real' },
  vocalia: { title: 'Vocalía Digital en Vivo (Mesa de Control)', subtitle: 'PWA adaptable a las reglas de cada disciplina deportiva' },
  'vision-ai': { title: 'Cámaras & Visión Computacional', subtitle: 'Procesamiento de video de baja latencia para eventos en cancha' },
  ingestion: { title: 'Digitalización de Planillas y Datos', subtitle: 'Procesamiento automatizado de formatos y migración asistida' },
  var: { title: 'Sistema VAR Oficial', subtitle: 'Transmisión local de ultra baja latencia con repeticiones multicámara' },
  chronicle: { title: 'Sala de Prensa & Crónicas Oficiales', subtitle: 'Generación automatizada de resúmenes periodísticos de partidos' },
  governance: { title: 'Asambleas & Notificaciones Oficiales', subtitle: 'Votaciones virtuales con Jitsi y avisos oficiales por WhatsApp' },
  scouting: { title: 'Hub de Scouting & Talent Discovery', subtitle: 'Evaluación Deporverso Index (1-10) y Fichas Técnicas Oficiales' },
  tactics: { title: 'Pizarra Táctica & Simulador para DTs', subtitle: 'Simulador de formaciones con análisis táctico automatizado del sistema' },
  'exclusive-offer': { title: 'Oferta Especial de Afiliación', subtitle: '50% de descuento ($35 por equipo) para las 10 primeras ligas' },
  'campaign-banners': { title: 'Generador de Banners Publicitarios', subtitle: 'Material gráfico de alta conversión para redes sociales' },
  'heroes-vr': { title: 'Héroes VR (Próximamente)', subtitle: 'Simulador de carrera y deporte en casa en asociación con heroesdeldeporte.com' },
  'master-admin': { title: 'Panel Maestro SuperAdmin', subtitle: 'Gestión global de ligas, sincronización y auditoría CIG' },
  'sql-viewer': { title: 'Consola SQL Supabase RLS', subtitle: 'Esquema empresarial de base de datos relacional' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  tenants = [],
  activeTenantId,
  setActiveTenantId,
  activeSport,
  setActiveSport,
  onOpenOnboarding,
  isSuperAdminAuth,
  onLogoutSuperAdmin,
  onElevateToSuperAdmin,
  userEmail,
  onLogout
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);

  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Deporverso Engine', subtitle: 'Plataforma Multideporte Global' };
  
  // Enfoque exclusivo en fútbol para lanzamiento (Fútbol 11, Indoor 7 y 9, Futsal 5)
  const visibleTenants = isSuperAdminAuth 
    ? tenants 
    : (tenants || []).filter(t => t.sport_code === 'FUTBOL' || t.sport_code === 'FUTSAL');

  const currentTenant = visibleTenants.find(t => t.id === activeTenantId) || visibleTenants[0] || tenants[0];
  const currentSportTheme = SPORT_THEMES[activeSport] || SPORT_THEMES.FUTBOL;

  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
      {/* TÍTULO & BREADCRUMB CONTEXTUAL */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] items-center justify-center text-emerald-400 font-extrabold text-sm shadow-inner">
          {currentSportTheme.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {currentTabInfo.title}
            </h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border hidden md:inline-flex items-center gap-1 ${currentSportTheme.badgeClass}`}>
              <span>{currentSportTheme.icon}</span>
              <span>{currentSportTheme.name}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-md hidden sm:block font-normal">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* TELEMETRÍA EN VIVO Y BARRA DE ACCIONES RÁPIDAS */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* TELEMETRY HUD PILL */}
        <div className="hidden xl:flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-sm">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </span>
          <span className="text-white/15">|</span>
          <span className="text-slate-400">LATENCIA <span className="text-cyan-400 font-semibold">12ms</span></span>
          <span className="text-white/15">|</span>
          <span className="text-slate-400">VAR <span className="text-emerald-400 font-semibold">4K EDGE</span></span>
        </div>

        {/* SELECTOR DE MODALIDAD FÚTBOL (LANZAMIENTO EXCLUSIVO) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSportDropdown(!showSportDropdown);
              setShowRoleDropdown(false);
              setShowTenantDropdown(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:border-emerald-500/50 transition-all cursor-pointer font-bold shadow-xs"
            title="Disciplina activa para el lanzamiento: Fútbol (11, Indor 9, Indor 7 y Futsal 5)"
          >
            <span className="text-sm">⚽</span>
            <span className="font-extrabold tracking-wide">FÚTBOL</span>
            <span className="hidden lg:inline text-[10px] text-emerald-400/80 font-mono bg-emerald-500/15 px-1.5 py-0.5 rounded">11 • 9 • 7 • 5</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {showSportDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#090e1a]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 border-b border-white/10 mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                  Fútbol por Lanzamiento
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Formatos oficiales activos en DeporVerso:
                </span>
              </div>

              {[
                { name: 'Fútbol 11', players: '11 Jugadores', desc: 'Cancha reglamentaria • Torneos federados y barriales' },
                { name: 'Indor Fútbol 9', players: '9 Jugadores', desc: 'Césped sintético / tierra • Formato intermedio 9 vs 9' },
                { name: 'Indor Fútbol 7', players: '7 Jugadores', desc: 'Cancha sintética • Formato rápido 7 vs 7' },
                { name: 'Fútsal 5', players: '5 Jugadores', desc: 'Coliseo / sala / cemento • Formato 5 vs 5' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveSport('FUTBOL');
                    setShowSportDropdown(false);
                  }}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/[0.06] hover:border-emerald-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5 group-hover:text-emerald-300">
                      <span>⚽</span>
                      <span>{m.name}</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                      {m.players}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SELECTOR DE LIGA / TENANT */}
        {(visibleTenants?.length || 0) > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowTenantDropdown(!showTenantDropdown);
                setShowRoleDropdown(false);
                setShowSportDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer font-semibold"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[130px] font-medium">{currentTenant?.name || 'LIGA'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400/70" />
            </button>

            {showTenantDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 z-50">
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/[0.06]">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Ligas Registradas
                  </span>
                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      onOpenOnboarding();
                    }}
                    className="text-[10px] font-semibold text-cyan-400 hover:underline cursor-pointer"
                  >
                    + Nueva Liga
                  </button>
                </div>
                {visibleTenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTenantId(t.id);
                      setActiveSport(t.sport_code);
                      setShowTenantDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      activeTenantId === t.id
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-white font-medium'
                    }`}
                  >
                    <div className="text-left truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="block truncate font-medium text-white">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-cyan-400/90 font-mono font-medium block">{t.domain}</span>
                        <span className="text-[8px] bg-white/10 text-slate-300 px-1 rounded uppercase">{t.sport_code}</span>
                      </div>
                    </div>
                    {activeTenantId === t.id && <Check className="w-3.5 h-3.5 shrink-0 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INDICADOR Y BOTÓN DE SALIDA MODO ADMIN */}
        {isSuperAdminAuth ? (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide hidden sm:inline">
              Super Admin
            </span>
            {(onLogoutSuperAdmin || onLogout) && (
              <button
                onClick={onLogoutSuperAdmin || onLogout}
                className="flex items-center gap-1 text-[10px] font-medium text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                title="Cerrar sesión de administrador y bloquear plataforma"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Salir</span>
              </button>
            )}
          </div>
        ) : (
          onLogout && (
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-lg">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{userEmail || 'Usuario'}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-[10px] font-medium text-slate-300 hover:text-rose-300 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-2 py-0.5 rounded transition-colors cursor-pointer"
                title="Cerrar sesión y bloquear plataforma"
              >
                <LogOut className="w-3 h-3 text-slate-400 group-hover:text-rose-400" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )
        )}

        {/* INSIGNIA FIREBASE FIRESTORE EN VIVO */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] text-slate-300" title="Base de datos en tiempo real Google Firebase Firestore activa">
          <Flame className="w-3 h-3 text-amber-400" />
          <span className="text-slate-400">Cloud Sync:</span>
          <span className="text-amber-400/90 font-mono text-[9px]">En Línea</span>
        </div>

        {/* BOTÓN CREAR LIGA DIRECTO */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Crear Mi Liga</span>
          <span className="lg:hidden">Crear Liga</span>
        </button>
      </div>
    </header>
  );
};
