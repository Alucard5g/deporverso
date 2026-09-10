import React, { useState } from 'react';
import { 
  Trophy, Shield, Users, Video, FileText, Zap, Cpu, Database, MessageSquare, 
  Home, ChevronLeft, ChevronRight, Menu, X, Sparkles, Award, Lock, LogOut, Glasses,
  Calendar
} from 'lucide-react';
import { UserRole, Tenant, SportCode } from '../types';

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
  onOpenSuperAdminAuth?: () => void;
  onLogoutSuperAdmin?: () => void;
}

// Sport-specific theme configurations
export const SPORT_THEMES: Record<SportCode, {
  name: string;
  icon: string;
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
    accentColor: 'emerald',
    glowClass: 'shadow-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-500 via-teal-600 to-green-700',
    label: 'Césped - FIFA 11'
  },
  BALONCESTO: {
    name: 'Baloncesto',
    icon: '🏀',
    accentColor: 'amber',
    glowClass: 'shadow-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-500 via-orange-600 to-amber-700',
    label: 'Cancha Madera - FIBA'
  },
  ECUAVOLEY: {
    name: 'Ecuavoley',
    icon: '🏐',
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
    accentColor: 'blue',
    glowClass: 'shadow-blue-500/20',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderClass: 'border-blue-500/40',
    bgGradient: 'from-blue-500 via-indigo-600 to-cyan-600',
    label: 'Piso Flotante'
  },
  BEISBOL: {
    name: 'Béisbol / Sóftbol',
    icon: '⚾',
    accentColor: 'amber',
    glowClass: 'shadow-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
    label: 'Diamante / Innings'
  },
  OTROS: {
    name: 'Artes Marciales / Otros',
    icon: '🥊',
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
  onOpenSuperAdminAuth,
  onLogoutSuperAdmin
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = SPORT_THEMES[activeSport] || SPORT_THEMES.FUTBOL;

  const navGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'welcome', label: 'Inicio / Bienvenida', icon: Home, color: 'text-emerald-400' },
      ]
    },
    {
      title: 'Competición & En Vivo',
      items: [
        { id: 'calendar', label: 'Calendario & Fixture Global', icon: Calendar, color: 'text-emerald-400' },
        { id: 'league', label: 'Portal de Liga / Tablas', icon: Trophy, color: 'text-cyan-400' },
        { id: 'vocalia', label: 'Vocalía Digital en Vivo', icon: Zap, color: 'text-amber-400' },
        { id: 'vision-ai', label: 'Visión Artificial Edge AI', icon: Cpu, color: 'text-cyan-400' },
      ]
    },
    {
      title: 'Herramientas & Gobernanza',
      items: [
        { id: 'var', label: 'VAR A la Carta', icon: Video, color: 'text-red-400' },
        { id: 'governance', label: 'Asambleas & WhatsApp', icon: MessageSquare, color: 'text-teal-400' },
      ]
    },
    {
      title: 'Scouting & Analytics',
      items: [
        { id: 'scouting', label: 'Hub de Scouting & Talentos', icon: Award, color: 'text-amber-400' },
        { id: 'tactics', label: 'Pizarra Táctica para DTs', icon: Users, color: 'text-cyan-400' },
      ]
    },
    {
      title: 'Innovación & Deporte Inmersivo',
      items: [
        { id: 'heroes-vr', label: 'Héroes VR (Próximamente)', icon: Glasses, color: 'text-cyan-400' },
      ]
    },
    ...(isSuperAdminAuth ? [
      {
        title: 'Panel Maestro SuperAdmin',
        items: [
          { id: 'master-admin', label: 'Panel Maestro SuperAdmin', icon: Shield, color: 'text-amber-400' },
          { id: 'master-admin-crm', label: 'CRM Ligas & Ventas', icon: Users, color: 'text-indigo-400' },
          { id: 'sql-viewer', label: 'Script SQL Supabase', icon: Database, color: 'text-blue-400' },
        ]
      }
    ] : [])
  ];

  return (
    <>
      {/* MOBILE TOP HEADER BAR */}
      <header className="lg:hidden bg-[#040810]/95 backdrop-blur-md border-b border-cyan-500/30 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('welcome')}>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${theme.bgGradient} p-0.5 shadow-lg`}>
            <div className="w-full h-full bg-[#060a12] rounded-[10px] flex items-center justify-center font-bold text-white text-sm">
              {theme.icon}
            </div>
          </div>
          <div>
            <span className="font-black text-lg text-white">
              Depor<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">verso</span>
            </span>
            <span className="ml-1.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-1.5 py-0.5 rounded-full">
              MULTIVERSO
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#0a0f1d] border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER (DESKTOP & MOBILE DRAWER) */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#040711] border-r border-cyan-500/20 
        flex flex-col justify-between transition-all duration-300 shadow-2xl
        ${collapsed ? 'lg:w-20' : 'lg:w-72'}
        ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* TOP SECTION: BRAND */}
        <div className="p-4 border-b border-white/10 bg-[#050914]">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer overflow-hidden" 
              onClick={() => { setActiveTab('welcome'); setMobileMenuOpen(false); }}
            >
              <div className={`w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr ${theme.bgGradient} p-0.5 shadow-lg ${theme.glowClass} relative group`}>
                <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center font-bold text-lg">
                  {theme.icon}
                </div>
              </div>
              
              {!collapsed && (
                <div className="transition-opacity duration-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl tracking-tight text-white">
                      Depor<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">verso</span>
                    </span>
                    <span className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
                      MULTIVERSO
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 font-mono tracking-wider uppercase truncate">Plataforma Inteligente</p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-xl bg-[#090e1c] hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title={collapsed ? 'Expandir Menú' : 'Colapsar Menú'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* NAVIGATION MENUS COLUMN */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/30 px-3 py-1 block">
                  {group.title}
                </span>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'master-admin-auth') {
                          onOpenSuperAdminAuth?.();
                        } else {
                          setActiveTab(item.id);
                        }
                        setMobileMenuOpen(false);
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group relative
                        ${isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/15'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}
                      `}
                    >
                      {/* Neon Active Edge Pill */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                      )}

                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400 scale-110' : item.color} transition-transform group-hover:scale-110`} />

                      {!collapsed && (
                        <span className={`truncate flex-1 text-left ${isActive ? 'font-black tracking-tight text-white' : 'font-medium'}`}>
                          {item.label}
                        </span>
                      )}

                      {isActive && !collapsed && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ACTIVO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER USER / SPORT ACCENT SUMMARY & 3D TELEMETRY */}
        {!collapsed && (
          <div className="p-3 border-t border-white/10 bg-[#06080c] space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                  WebGL 3D Active
                </span>
              </div>
              <span className="font-mono text-[9px] text-white/40">60 FPS</span>
            </div>

            {isSuperAdminAuth && (
              <button
                onClick={onLogoutSuperAdmin}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md mt-1"
                title="Cerrar panel de administrador y regresar al modo público"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Salir de Modo Admin</span>
              </button>
            )}

            <div className="text-[11px] text-white/50 flex items-center justify-between pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-white text-xs">Deporverso 2026</span>
              </div>
              {isSuperAdminAuth ? (
                <button
                  onClick={onLogoutSuperAdmin}
                  className="font-mono text-[9px] text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 cursor-pointer transition-colors"
                  title="Cerrar Sesión SuperAdmin"
                >
                  Salir Admin
                </button>
              ) : (
                <button
                  onClick={onOpenSuperAdminAuth}
                  className="font-mono text-[9px] text-white/30 hover:text-amber-400 p-1 rounded transition-colors cursor-pointer"
                  title="Acceso Administrativo"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
