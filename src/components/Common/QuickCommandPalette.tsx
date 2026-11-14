import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Trophy,
  Star,
  Calendar,
  Award,
  Users,
  MessageSquare,
  Shield,
  Video,
  Zap,
  Cpu,
  FileText,
  Database,
  ArrowRight,
  Lock,
  Building2,
  PlayCircle
} from 'lucide-react';
import { Match, Team, Tenant } from '../../types';

interface QuickCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectTenant: (tenantId: string) => void;
  tenants: Tenant[];
  teams: Team[];
  matches: Match[];
  isSuperAdminAuth: boolean;
  hasPaidFullAccess: boolean;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Módulos' | 'Ligas' | 'Clubes' | 'Partidos';
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
  badge?: string;
  action: () => void;
}

export const QuickCommandPalette: React.FC<QuickCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectTenant,
  tenants,
  teams,
  matches,
  isSuperAdminAuth,
  hasPaidFullAccess
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFullUnlocked = isSuperAdminAuth || hasPaidFullAccess;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const items = useMemo<PaletteItem[]>(() => {
    const modules: PaletteItem[] = [
      {
        id: 'mod-league',
        title: 'Portal de Liga & Tablas en Vivo',
        subtitle: 'Posiciones, goleadores, fair play y fixture',
        category: 'Módulos',
        icon: Trophy,
        badge: isFullUnlocked ? undefined : 'DEMO',
        action: () => onNavigateTab('league')
      },
      {
        id: 'mod-club',
        title: 'Club Deportivo Deporverso',
        subtitle: 'Plantilla oficial, carnets QR y vitrina de trofeos',
        category: 'Módulos',
        icon: Star,
        badge: isFullUnlocked ? undefined : 'DEMO',
        action: () => onNavigateTab('club-deporverso')
      },
      {
        id: 'mod-calendar',
        title: 'Calendario & Fixture Multideporte',
        subtitle: 'Jornadas programadas, sedes y exportación .ICS',
        category: 'Módulos',
        icon: Calendar,
        locked: !isFullUnlocked,
        action: () => onNavigateTab('calendar')
      },
      {
        id: 'mod-scouting',
        title: 'Hub de Scouting & Talentos',
        subtitle: 'Índice Deporverso (1-10) y fichas de jugadores',
        category: 'Módulos',
        icon: Award,
        locked: !isFullUnlocked,
        action: () => onNavigateTab('scouting')
      },
      {
        id: 'mod-tactics',
        title: 'Pizarra Táctica para DTs',
        subtitle: 'Formaciones, alineaciones y estrategia',
        category: 'Módulos',
        icon: Users,
        locked: !isFullUnlocked,
        action: () => onNavigateTab('tactics')
      },
      {
        id: 'mod-governance',
        title: 'Asambleas & Resoluciones',
        subtitle: 'Gobernanza virtual y notificaciones oficiales',
        category: 'Módulos',
        icon: MessageSquare,
        locked: !isFullUnlocked,
        action: () => onNavigateTab('governance')
      },
      {
        id: 'mod-offer',
        title: 'Planes & Licencias CIG (50% OFF)',
        subtitle: '$35/club mayores · $25/club formativas por torneo',
        category: 'Módulos',
        icon: Shield,
        action: () => onNavigateTab('exclusive-offer')
      }
    ];

    if (isSuperAdminAuth) {
      modules.push(
        {
          id: 'mod-vocalia',
          title: 'Vocalía Digital en Vivo',
          subtitle: 'Mesa de control, cronómetro y acta cero papel',
          category: 'Módulos',
          icon: Zap,
          badge: 'ADMIN',
          action: () => onNavigateTab('vocalia')
        },
        {
          id: 'mod-var',
          title: 'Sistema VAR Oficial',
          subtitle: 'Revisión multicámara y dictámenes arbitrales',
          category: 'Módulos',
          icon: Video,
          badge: 'ADMIN',
          action: () => onNavigateTab('var')
        },
        {
          id: 'mod-vision',
          title: 'Cámaras & Visión Computacional',
          subtitle: 'Tracking en cancha y clips 9:16',
          category: 'Módulos',
          icon: Cpu,
          badge: 'ADMIN',
          action: () => onNavigateTab('vision-ai')
        },
        {
          id: 'mod-master',
          title: 'Panel Maestro SuperAdmin',
          subtitle: 'Métricas SaaS, ligas multi-tenant y auditoría',
          category: 'Módulos',
          icon: Shield,
          badge: 'ADMIN',
          action: () => onNavigateTab('master-admin')
        },
        {
          id: 'mod-chronicle',
          title: 'Generador de Crónicas IA',
          subtitle: 'Redacción editorial automatizada por encuentro',
          category: 'Módulos',
          icon: FileText,
          badge: 'ADMIN',
          action: () => onNavigateTab('chronicle')
        },
        {
          id: 'mod-ingestion',
          title: 'Ingesta de Planillas & Datos',
          subtitle: 'Importación inteligente de calendarios y equipos',
          category: 'Módulos',
          icon: Database,
          badge: 'ADMIN',
          action: () => onNavigateTab('ingestion')
        }
      );
    }

    const tenantItems: PaletteItem[] = (tenants || []).map((t) => ({
      id: `tenant-${t.id}`,
      title: t.name,
      subtitle: `${t.domain} · ${t.sport_code}`,
      category: 'Ligas',
      icon: Building2,
      action: () => {
        onSelectTenant(t.id);
        onNavigateTab('league');
      }
    }));

    const teamItems: PaletteItem[] = (teams || []).slice(0, 12).map((team) => ({
      id: `team-${team.id}`,
      title: team.name,
      subtitle: `Club federado · ${team.city || team.stadium_name || 'CIG'}`,
      category: 'Clubes',
      icon: Shield,
      action: () => onNavigateTab('league')
    }));

    const matchItems: PaletteItem[] = (matches || []).slice(0, 8).map((m) => {
      const home = m.home_team?.name || teams.find((t) => t.id === m.home_team_id)?.name || m.home_team_id;
      const away = m.away_team?.name || teams.find((t) => t.id === m.away_team_id)?.name || m.away_team_id;
      return {
        id: `match-${m.id}`,
        title: `${home} (${m.home_score}) vs (${m.away_score}) ${away}`,
        subtitle: `${m.field_location} · ${m.status === 'IN_PROGRESS' ? 'En juego' : m.status === 'FINISHED' ? 'Finalizado' : 'Programado'}`,
        category: 'Partidos',
        icon: PlayCircle,
        action: () => onNavigateTab('league')
      };
    });

    return [...modules, ...tenantItems, ...teamItems, ...matchItems];
  }, [tenants, teams, matches, isSuperAdminAuth, isFullUnlocked, onNavigateTab, onSelectTenant]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        filteredItems[selectedIndex].action();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Buscador rápido de módulos, ligas y clubes"
    >
      <div
        className="w-full max-w-xl bg-[#070b14] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#0b1120]">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar módulo, liga, club o partido..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar buscador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[58vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No se encontraron coincidencias para "<span className="text-white font-semibold">{query}</span>".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/35 text-white'
                      : 'border border-transparent text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                          : 'bg-white/[0.04] border-white/10 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">{item.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      {item.category}
                    </span>
                    {item.locked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2 border-t border-white/10 bg-[#050914] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>↑↓ Navegar · Enter Seleccionar</span>
          <span>DeporVerso Quick Jump</span>
        </div>
      </div>
    </div>
  );
};
