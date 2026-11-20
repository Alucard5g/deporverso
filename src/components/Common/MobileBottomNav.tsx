import React from 'react';
import { Home, Trophy, Star, Calendar, Zap, Menu, Lock } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMenu: () => void;
  isSuperAdminAuth?: boolean;
  isAuthenticated?: boolean;
  hasPaidFullAccess?: boolean;
  onOpenAuthModal?: (mode?: 'register' | 'login') => void;
  onOpenCheckout?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu,
  isSuperAdminAuth = false,
  isAuthenticated = false,
  hasPaidFullAccess = false,
  onOpenAuthModal,
  onOpenCheckout
}) => {
  const isFullDeployed = hasPaidFullAccess || isSuperAdminAuth;

  const handleAction = (item: {
    id: string;
    requiresAuth?: boolean;
    requiresSub?: boolean;
  }) => {
    if (item.requiresAuth && !isAuthenticated && !isSuperAdminAuth) {
      if (onOpenAuthModal) {
        onOpenAuthModal('register');
      } else {
        onSelectTab('welcome');
      }
      return;
    }
    if (item.requiresSub && !isFullDeployed) {
      if (onOpenCheckout) {
        onOpenCheckout();
      } else {
        onSelectTab('exclusive-offer');
      }
      return;
    }
    onSelectTab(item.id);
  };

  const items = [
    { id: 'welcome', label: 'Inicio', icon: Home, locked: false },
    {
      id: 'league',
      label: 'Liga',
      icon: Trophy,
      requiresAuth: true,
      locked: !isAuthenticated && !isSuperAdminAuth
    },
    {
      id: 'club-deporverso',
      label: 'Club',
      icon: Star,
      requiresAuth: true,
      locked: !isAuthenticated && !isSuperAdminAuth
    },
    isSuperAdminAuth
      ? { id: 'vocalia', label: 'Vocalía', icon: Zap, locked: false }
      : {
          id: 'calendar',
          label: 'Fixture',
          icon: Calendar,
          requiresAuth: true,
          requiresSub: true,
          locked: !isFullDeployed
        }
  ];

  return (
    <nav
      aria-label="Navegación rápida móvil"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#050914]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(0,0,0,0.75)]"
    >
      <div className="grid grid-cols-5 h-14 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAction(item)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-cyan-300' : item.locked ? 'text-slate-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
              )}
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.locked && (
                  <Lock className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1.5" />
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Más módulos y herramientas"
          className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-semibold tracking-tight leading-none">Más</span>
        </button>
      </div>
    </nav>
  );
};
