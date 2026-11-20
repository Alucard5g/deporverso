import React, { useState } from 'react';
import { 
  Trophy, Shield, Users, Video, FileText, Zap, Cpu, Database, MessageSquare, 
  Home, ChevronLeft, ChevronRight, Menu, X, Sparkles, Award, Lock, LogOut, Glasses,
  Calendar, Presentation, Tag, Image as ImageIcon, Star, CheckCircle2
} from 'lucide-react';
import { UserRole, Tenant, SportCode } from '../types';
import { Search, Building2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  tenants: Tenant[];
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  activeSport: SportCode;
  setActiveSport: (sport: SportCode) => void;
  isSuperAdminAuth?: boolean;
  onLogoutSuperAdmin?: () => void;
  hasPaidFullAccess?: boolean;
  onOpenCheckout?: () => void;
  isAuthenticated?: boolean;
  onOpenAuthModal?: (mode?: 'register' | 'login') => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  onOpenCommandPalette?: () => void;
  hideMobileHeader?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

// Sport-specific theme configurations
export const SPORT_THEMES: Record<SportCode, {
  name: string;
  icon: string;
  imageIcon?: string;
  accentColor: string;
  glowClass: string;
  badgeClass: string;
  borderClass: string;
  bgGradient: string;
  label: string;
}> = {
  FUTBOL: {
    name: 'Fútbol 11',
    icon: '⚽',
    imageIcon: '/sports/drive/futbol_sq.webp',
    accentColor: 'emerald',
    glowClass: 'shadow-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-500 via-teal-600 to-green-700',
    label: 'Césped - Cancha Oficial 11'
  },
  BALONCESTO: {
    name: 'Baloncesto',
    icon: '🏀',
    imageIcon: '/sports/drive/baloncesto_sq.webp',
    accentColor: 'amber',
    glowClass: 'shadow-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-500 via-orange-600 to-amber-700',
    label: 'Cancha Madera - Reglamentaria'
  },
  ECUAVOLEY: {
    name: 'Ecuavoley',
    icon: '🏐',
    imageIcon: '/sports/drive/voleibol_sq.webp',
    accentColor: 'cyan',
    glowClass: 'shadow-cyan-500/20',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderClass: 'border-cyan-500/40',
    bgGradient: 'from-cyan-500 via-blue-600 to-teal-600',
    label: 'Red Alta - 3 vs 3'
  },
  PADEL: {
    name: 'Pádel',
    icon: '🎾',
    imageIcon: '/sports/drive/tennis_sq.webp',
    accentColor: 'lime',
    glowClass: 'shadow-lime-500/20',
    badgeClass: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    borderClass: 'border-lime-500/40',
    bgGradient: 'from-lime-400 via-emerald-600 to-teal-700',
    label: 'Cristal Panorámico'
  },
  FUTSAL: {
    name: 'Fútsal / Indor',
    icon: '👟',
    imageIcon: '/sports/drive/futbol_sq.webp',
    accentColor: 'rose',
    glowClass: 'shadow-rose-500/20',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500/40',
    bgGradient: 'from-rose-500 via-pink-600 to-red-700',
    label: 'Pista Rápida AMF'
  },
  VOLEIBOL: {
    name: 'Voleibol / Tenis',
    icon: '🏐',
    imageIcon: '/sports/drive/voleibol_sq.webp',
    accentColor: 'blue',
    glowClass: 'shadow-blue-500/20',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderClass: 'border-blue-500/40',
    bgGradient: 'from-blue-500 via-indigo-600 to-cyan-600',
    label: 'Piso Flotante'
  },
  BEISBOL: {
    name: 'Béisbol',
    icon: '⚾',
    imageIcon: '/sports/drive/beisbol_sq.webp',
    accentColor: 'amber',
    glowClass: 'shadow-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
    label: 'Diamante / 9 Innings'
  },
  SOFTBOL: {
    name: 'Sóftbol',
    icon: '🥎',
    imageIcon: '/sports/drive/beisbol_sq.webp',
    accentColor: 'yellow',
    glowClass: 'shadow-yellow-500/20',
    badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    borderClass: 'border-yellow-500/40',
    bgGradient: 'from-yellow-500 via-amber-600 to-orange-600',
    label: 'Molinete & Slowpitch'
  },
  FUTBOL_AMERICANO: {
    name: 'Fútbol Americano',
    icon: '🏈',
    imageIcon: '/sports/drive/futbol_americano_sq.webp',
    accentColor: 'orange',
    glowClass: 'shadow-orange-500/20',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    borderClass: 'border-orange-500/40',
    bgGradient: 'from-orange-600 via-red-600 to-amber-700',
    label: 'Downs & Tackle / Flag'
  },
  ARTES_MARCIALES: {
    name: 'Artes Marciales / MMA',
    icon: '🥋',
    imageIcon: '/sports/drive/artes_marciales_sq.webp',
    accentColor: 'rose',
    glowClass: 'shadow-rose-500/20',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500/40',
    bgGradient: 'from-rose-600 via-red-600 to-purple-700',
    label: 'Octágono & Tatami'
  },
  TENNIS: {
    name: 'Tenis',
    icon: '🎾',
    imageIcon: '/sports/drive/tennis_sq.webp',
    accentColor: 'emerald',
    glowClass: 'shadow-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-500 via-teal-600 to-green-700',
    label: 'Pista Abierta & ATP'
  },
  OTROS: {
    name: 'Multideporte / Otros',
    icon: '🏆',
    imageIcon: '/sports/drive/cig_game_sq.webp',
    accentColor: 'purple',
    glowClass: 'shadow-purple-500/20',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderClass: 'border-purple-500/40',
    bgGradient: 'from-purple-500 via-indigo-600 to-pink-700',
    label: 'Reglamento Adaptable'
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  tenants,
  activeTenantId,
  setActiveTenantId,
  activeSport,
  setActiveSport,
  isSuperAdminAuth,
  onLogoutSuperAdmin,
  hasPaidFullAccess = false,
  onOpenCheckout,
  isAuthenticated = false,
  onOpenAuthModal,
  mobileMenuOpen: controlledMobileMenuOpen,
  setMobileMenuOpen: setControlledMobileMenuOpen,
  onOpenCommandPalette,
  hideMobileHeader = false,
  collapsed: controlledCollapsed,
  onToggleCollapsed
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const toggleCollapsed = onToggleCollapsed ?? (() => setInternalCollapsed((prev) => !prev));
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = controlledMobileMenuOpen ?? internalMobileMenuOpen;
  const setMobileMenuOpen = setControlledMobileMenuOpen ?? setInternalMobileMenuOpen;

  const theme = SPORT_THEMES[activeSport] || SPORT_THEMES.FUTBOL;
  const isFullDeployed = hasPaidFullAccess || isSuperAdminAuth;

  const navGroups = [
    {
      title: 'Módulos de la Plataforma',
      items: [
        { id: 'welcome', label: 'Inicio', icon: Home, color: 'text-slate-400', isDemo: false },
        { 
          id: 'league', 
          label: 'Liga Barrial Pichincha', 
          icon: Trophy, 
          color: 'text-emerald-400',
          badge: isFullDeployed ? undefined : 'DEMO',
          isDemo: true
        },
        { 
          id: 'club-deporverso', 
          label: 'Club Deportivo Deporverso', 
          icon: Star, 
          color: 'text-cyan-400',
          badge: isFullDeployed ? undefined : 'DEMO',
          isDemo: true
        },
        { 
          id: 'calendar', 
          label: 'Calendario & Fixture', 
          icon: Calendar, 
          color: 'text-emerald-400',
          requiresSubscription: true 
        },
      ]
    },
    ...(isSuperAdminAuth ? [
      {
        title: 'Operación & Arbitraje (Admin)',
        items: [
          { id: 'vocalia', label: 'Vocalía Digital en Vivo', icon: Zap, color: 'text-amber-400' },
          { id: 'var', label: 'Sistema VAR Oficial', icon: Video, color: 'text-red-400' },
          { id: 'vision-ai', label: 'Cámaras & Visión de Cancha', icon: Cpu, color: 'text-cyan-400' },
        ]
      }
    ] : []),
    {
      title: 'Dirección & Gobernanza',
      items: [
        { id: 'scouting', label: 'Hub de Scouting & Talentos', icon: Award, color: 'text-amber-400', requiresSubscription: true },
        { id: 'tactics', label: 'Pizarra Táctica para DTs', icon: Users, color: 'text-cyan-400', requiresSubscription: true },
        { id: 'governance', label: 'Asambleas & Resoluciones', icon: MessageSquare, color: 'text-teal-400', requiresSubscription: true },
      ]
    },
    {
      title: isFullDeployed ? 'Licencias' : 'Activación Completa',
      items: [
        { 
          id: 'exclusive-offer', 
          label: isFullDeployed ? 'Planes & Licencias CIG' : 'Desplegar DeporVerso ($35/Club y Torneo)', 
          icon: Tag, 
          color: 'text-amber-400' 
        },
      ]
    },
    ...(isSuperAdminAuth ? [
      {
        title: 'Panel Maestro SuperAdmin',
        items: [
          { id: 'master-admin', label: 'Panel Maestro SuperAdmin', icon: Shield, color: 'text-amber-400' },
          { id: 'chronicle', label: 'Generación de Crónicas IA', icon: FileText, color: 'text-emerald-400' },
          { id: 'ingestion', label: 'Ingesta de Planillas & Datos', icon: Database, color: 'text-cyan-400' },
          { id: 'campaign-banners', label: 'Banners Publicitarios', icon: ImageIcon, color: 'text-purple-400' },
          { id: 'master-admin-crm', label: 'CRM Ligas & Ventas', icon: Users, color: 'text-indigo-400' },
          { id: 'sql-viewer', label: 'Script SQL Supabase', icon: Database, color: 'text-blue-400' },
        ]
      }
    ] : [])
  ];

  return (
    <>
      {/* MOBILE / TABLET SINGLE-ROW HEADER BAR (h-14 = 56px, respects 15% sticky budget) */}
      {!hideMobileHeader && (
      <header className="lg:hidden bg-[#050914]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 h-14 px-3 flex items-center justify-between gap-2 shadow-lg">
        <div
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
          onClick={() => {
            setActiveTab('welcome');
            setMobileMenuOpen(false);
          }}
        >
          <div className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr ${theme.bgGradient} p-0.5 shadow-md`}>
            <div className="w-full h-full bg-[#060a12] rounded-[10px] flex items-center justify-center p-1 overflow-hidden">
              {theme.imageIcon ? (
                <img src={theme.imageIcon} alt={theme.name} className="w-full h-full object-contain" />
              ) : (
                <span className="font-bold text-white text-sm">{theme.icon}</span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-white tracking-tight truncate">
                Depor<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">verso</span>
              </span>
              {isSuperAdminAuth && (
                <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase shrink-0">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Buscar módulos, ligas o clubes"
              className="w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          {!isAuthenticated && !isSuperAdminAuth && onOpenAuthModal && (
            <button
              type="button"
              onClick={() => onOpenAuthModal('register')}
              className="min-h-[40px] px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs whitespace-nowrap cursor-pointer"
            >
              Demo
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
            className="w-11 h-11 rounded-xl bg-[#0a0f1d] border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>
      )}

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER (DESKTOP & MOBILE DRAWER) */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-[100dvh] lg:h-screen bg-[#070b14] border-r border-white/[0.07] 
        flex flex-col justify-between transition-all duration-300 shadow-2xl backdrop-blur-xl overscroll-contain pb-[env(safe-area-inset-bottom)]
        ${collapsed ? 'lg:w-20' : 'lg:w-72'}
        ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* TOP SECTION: BRAND */}
        <div className={`border-b border-white/[0.06] bg-[#090e1a]/70 ${collapsed ? 'px-2.5 py-3' : 'p-4'}`}>
          <div className={`flex ${collapsed ? 'flex-col items-center gap-2.5' : 'items-center justify-between gap-2'}`}>
            <div 
              className="flex items-center gap-3 cursor-pointer overflow-hidden group" 
              onClick={() => { setActiveTab('welcome'); setMobileMenuOpen(false); }}
            >
              <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr ${theme.bgGradient} p-[1.5px] shadow-md relative`}>
                <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105">
                  {theme.imageIcon ? (
                    <img src={theme.imageIcon} alt={theme.name} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                  ) : (
                    <span className="font-bold text-base">{theme.icon}</span>
                  )}
                </div>
              </div>
              
              {!collapsed && (
                <div className="transition-opacity duration-200 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-white">
                      Depor<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">verso</span>
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate">Plataforma Multideporte</p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className={`hidden lg:flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 ${
                collapsed ? 'w-9 h-7' : 'p-1.5'
              }`}
              title={collapsed ? 'Expandir Menú' : 'Colapsar Menú'}
              aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* NAVIGATION MENUS COLUMN */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
          {!collapsed && isSuperAdminAuth && tenants.length > 0 && (
            <div className="lg:hidden px-1 pb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span>Liga Activa</span>
              </label>
              <select
                value={activeTenantId}
                onChange={(e) => {
                  const t = tenants.find((item) => item.id === e.target.value);
                  setActiveTenantId(e.target.value);
                  if (t) setActiveSport(t.sport_code);
                }}
                className="w-full bg-[#0d1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-cyan-400"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#090e1a] text-white">
                    {t.name} ({t.sport_code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80 px-3 py-1 block">
                  {group.title}
                </span>
              )}

              <div className="space-y-0.5">
                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  // Lógica de acceso:
                  // 1. Invitado no registrado: bloqueado en demos y módulos de pago.
                  // 2. Registrado (Modo Demo): libre acceso a 'league' y 'club-deporverso' con badge DEMO. Bloqueado en módulos completos.
                  // 3. Suscriptor pagado / SuperAdmin: libre acceso total a toda la plataforma.
                  const isLockedForGuest = !isAuthenticated && !isSuperAdminAuth && item.id !== 'welcome' && item.id !== 'exclusive-offer';
                  const isLockedForSubscriberOnly = !isFullDeployed && item.requiresSubscription;
                  const isItemLocked = isLockedForGuest || isLockedForSubscriberOnly;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        // Si el módulo requiere Administrador y el usuario no está autenticado como tal,
                        // pasamos a setActiveTab para que App.tsx abra el modal de Clave Maestra o Correo/Clave
                        if (item.requiresAdmin && !isSuperAdminAuth) {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                          return;
                        }
                        if (isLockedForGuest) {
                          if (onOpenAuthModal) {
                            onOpenAuthModal('register');
                          }
                          setMobileMenuOpen(false);
                          return;
                        }
                        if (isLockedForSubscriberOnly) {
                          if (onOpenCheckout) {
                            onOpenCheckout();
                          } else {
                            setActiveTab('exclusive-offer');
                          }
                          setMobileMenuOpen(false);
                          return;
                        }
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      title={collapsed ? (isItemLocked ? `${item.label} (Requiere Desbloqueo)` : item.label) : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 lg:py-2 min-h-[42px] lg:min-h-0 rounded-xl text-xs transition-all cursor-pointer group relative
                        ${isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-transparent text-white font-semibold border border-cyan-500/25 shadow-sm'
                          : isItemLocked
                          ? 'text-slate-500 hover:text-amber-300 hover:bg-amber-500/5 font-medium border border-transparent'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] font-medium border border-transparent'}
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-emerald-400"></div>
                      )}

                      <Icon className={`w-4 h-4 shrink-0 transition-all ${isActive ? 'text-cyan-300 scale-105' : isItemLocked ? 'text-slate-500 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />

                      {!collapsed && (
                        <span className="truncate flex-1 text-left tracking-normal flex items-center justify-between gap-1.5">
                          <span className={isItemLocked ? 'opacity-80' : ''}>{item.label}</span>
                          
                          {item.badge && isAuthenticated && !isFullDeployed && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold shrink-0">
                              {item.badge}
                            </span>
                          )}

                          {isItemLocked && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400/90 shrink-0">
                              <Lock className="w-3 h-3 text-amber-400/80" />
                              {isLockedForSubscriberOnly && !isLockedForGuest && (
                                <span className="hidden xl:inline text-[9px]">$35</span>
                              )}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* WIDGET DE ESTADO: MODO DEMO VS DESPLEGADO */}
        {!collapsed && (
          <div className="px-3 pb-2">
            {!isAuthenticated && !isSuperAdminAuth ? (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0c162b] to-[#060b17] border border-cyan-500/30 text-center space-y-2 shadow-lg">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-cyan-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MODO INVITADO</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Regístrate gratis para acceder a la demo de la Liga Pichincha y el Club Deporverso.
                </p>
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : setActiveTab('welcome')}
                  className="w-full py-1.5 px-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-[10px] rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wide transform hover:scale-[1.02] active:scale-95"
                >
                  Registrarse para Ver Demo
                </button>
              </div>
            ) : !hasPaidFullAccess && !isSuperAdminAuth ? (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0c162b] to-[#060b17] border border-amber-500/40 text-center space-y-2 shadow-lg">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>MODO DEMO ACTIVO</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Acceso de demostración. Activa el portal completo ($35 mayores / $25 formativas, 50% OFF).
                </p>
                <button
                  onClick={onOpenCheckout || (() => setActiveTab('exclusive-offer'))}
                  className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[10px] rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wide active:scale-95"
                >
                  Suscribirse 50% OFF
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DeporVerso Desplegado</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Portal Completo Activo</span>
              </div>
            )}
          </div>
        )}

        {/* FOOTER USER / STATUS CAPSULE */}
        {!collapsed && (
          <div className="p-3 border-t border-white/[0.06] bg-[#090e1a]/60 space-y-2">
            {isSuperAdminAuth && (
              <button
                onClick={onLogoutSuperAdmin}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap"
                title="Cerrar panel de administrador y regresar al modo público"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Salir de Modo Admin</span>
              </button>
            )}

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium text-slate-300 text-xs">DeporVerso 2026</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {isSuperAdminAuth ? 'SuperAdmin' : hasPaidFullAccess ? 'Plan CIG Pro' : 'Edición Demo'}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
