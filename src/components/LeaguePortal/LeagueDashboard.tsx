import React, { useState } from 'react';
import { 
  Trophy, Calendar, Users, QrCode, Shield, CheckCircle, CheckCircle2, Share2, 
  Heart, Sparkles, MessageCircle, Search, Filter, Award, Flame, 
  AlertTriangle, Check, ArrowRight, Eye, Star, Zap, Clock, MapPin, 
  ChevronRight, ExternalLink, Download, FileText, Activity, ChevronDown,
  Globe, Radio, Play, RefreshCw, Send, ThumbsUp, X, ArrowRightLeft, Tv,
  ShieldCheck, Video, Tag, DollarSign
} from 'lucide-react';
import { Tenant, Match, Team, Player, Sport, AiChronicle, MatchEvent } from '../../types';
import { FanAuthModal } from '../Fan/FanAuthModal';
import { TradingCardCarnet } from './TradingCardCarnet';
import { LeagueFixtureTable } from './LeagueFixtureTable';
import { ClubAndRosterDetail } from './ClubAndRosterDetail';
import { PlayerTransfersManager } from './PlayerTransfersManager';
import { LeagueAnalytics } from './LeagueAnalytics';
import { SPORT_VISUAL_THEMES } from '../../data/sportThemesData';
import { Sport3DExperience } from '../ThreeD/Sport3DExperience';
import { InscriptionsAndStreaming } from './InscriptionsAndStreaming';
import { LiveStreamingPanel } from './LiveStreamingPanel';
import { PublicStreamingChannels } from './streaming/PublicStreamingChannels';
import pichinchaPortadaImg from '../../assets/images/pichincha_portada.jpg';
import ligaBarrialPichinchaHero from '../../assets/images/liga_barrial_pichincha_hero_1791927900990.jpg';
import heroBannerImg from '../../assets/images/league_cover_premium_1791927270491.jpg';
import basketballHeroImg from '../../assets/images/basketball_hero_bg_1785854264293.jpg';
import volleyballHeroImg from '../../assets/images/volleyball_hero_bg_1785854282070.jpg';
import { PichinchaExecutiveDemo } from './PichinchaExecutiveDemo';
import { CINEMATIC_ASSETS } from '../../data/cinematicAssets';
import { copyTextSafely } from '../../utils/safeClipboard';

interface LeagueDashboardProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  events?: MatchEvent[];
  publishedChronicles?: AiChronicle[];
  onPlayerTransferred?: (playerId: string, newTeamId: string, newJerseyNumber?: number) => void;
  isSuperAdminAuth?: boolean;
  onOpenStepTour?: (stepIndex?: number) => void;
  onNavigateTab?: (tabId: string) => void;
  hasPaidFullAccess?: boolean;
  onOpenCheckout?: () => void;
  userEmail?: string;
}

const getSportHeroBg = (sportCode?: string, sportName?: string) => {
  const code = (sportCode || sportName || 'FUTBOL').toUpperCase() as keyof typeof SPORT_VISUAL_THEMES;
  if (SPORT_VISUAL_THEMES[code]?.heroImage) {
    return SPORT_VISUAL_THEMES[code].heroImage;
  }
  if (code.includes('BASKET') || code.includes('BALONCESTO')) {
    return SPORT_VISUAL_THEMES.BALONCESTO?.heroImage || basketballHeroImg;
  }
  if (code.includes('ECUA')) {
    return SPORT_VISUAL_THEMES.ECUAVOLEY?.heroImage || volleyballHeroImg;
  }
  if (code.includes('PADEL')) {
    return SPORT_VISUAL_THEMES.PADEL?.heroImage || heroBannerImg;
  }
  if (code.includes('FUTSAL')) {
    return SPORT_VISUAL_THEMES.FUTSAL?.heroImage || heroBannerImg;
  }
  if (code.includes('VOLEI') || code.includes('VOLLEY')) {
    return SPORT_VISUAL_THEMES.VOLEIBOL?.heroImage || volleyballHeroImg;
  }
  if (code.includes('BEIS')) {
    return SPORT_VISUAL_THEMES.BEISBOL?.heroImage || heroBannerImg;
  }
  return heroBannerImg;
};

export const LeagueDashboard: React.FC<LeagueDashboardProps> = ({
  tenant,
  sport,
  matches = [],
  teams = [],
  players = [],
  events = [],
  publishedChronicles = [],
  onPlayerTransferred,
  isSuperAdminAuth = false,
  onOpenStepTour,
  onNavigateTab,
  hasPaidFullAccess = false,
  onOpenCheckout,
  userEmail = ''
}) => {
  const currentSportBg = getSportHeroBg(tenant.sport_code, sport?.name);
  
  // Google Drive Synced Icon
  const sportDriveIcon = React.useMemo(() => {
    const code = (tenant.sport_code || sport?.name || 'FUTBOL').toUpperCase();
    if (code.includes('BASKET') || code.includes('BALONCESTO')) {
      return '/sports/drive/baloncesto_sq.webp';
    }
    if (code.includes('TENIS') || code.includes('TENNIS') || code.includes('PADEL')) {
      return '/sports/drive/tennis_sq.webp';
    }
    if (code.includes('MARCIAL') || code.includes('MMA') || code.includes('TAEKWONDO') || code.includes('BOXEO') || code.includes('COMBATE') || code.includes('JUDO') || code.includes('KARATE')) {
      return '/sports/drive/artes_marciales_sq.webp';
    }
    return '/sports/drive/futbol_sq.webp';
  }, [tenant.sport_code, sport?.name]);

  const [activeTab, setActiveTab] = useState<'inicio' | 'standings' | 'matches' | 'teams' | 'analytics' | 'transfers' | 'blog' | 'online' | 'rules' | '3d-stadium' | 'dossier-directorio'>('inicio');
  const [streamingMode, setStreamingMode] = useState<'vocalia' | 'var' | 'tv'>('vocalia');
  const [playerForTransfer, setPlayerForTransfer] = useState<Player | null>(null);
  const [standingsSubTab, setStandingsSubTab] = useState<'table' | 'scorers' | 'fairplay'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('Primera Senior');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showOnlineDropdown, setShowOnlineDropdown] = useState(false);
  const [matchdayFilter, setMatchdayFilter] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayerForQr, setSelectedPlayerForQr] = useState<Player | null>(null);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);

  // State for Fan Auth
  const [fanUser, setFanUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('sportia_fan_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [showFanAuthModal, setShowFanAuthModal] = useState(false);
  const [fanModalAction, setFanModalAction] = useState('Compartir e interactuar con la liga');
  const [shareSuccessMsg, setShareSuccessMsg] = useState('');

  // AI Chronicles state
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [aiStoryText, setAiStoryText] = useState<string | null>(null);

  const categories = ['Primera Senior', 'Segunda Categoría', 'Máster 40', 'Femenino', 'Infantil'];

  const handleRequireFanAction = (actionTitle: string, callback: () => void) => {
    if (!fanUser) {
      setFanModalAction(actionTitle);
      setShowFanAuthModal(true);
    } else {
      callback();
    }
  };

  const handleFanAuthSuccess = (userData: { name: string; email: string }) => {
    setFanUser(userData);
    try {
      localStorage.setItem('sportia_fan_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('Unable to write to localStorage:', e);
    }
    setShareSuccessMsg('¡Registro completado! Bienvenido al Portal Oficial.');
    setTimeout(() => setShareSuccessMsg(''), 4000);
  };

  const handleShareMatch = (matchTitle: string) => {
    handleRequireFanAction(`Compartir partido: ${matchTitle}`, async () => {
      const shareText = `⚽ ${matchTitle} en ${tenant?.name || 'Liga'}. Sigue el marcador en vivo en Deporverso: https://${tenant?.domain || 'deporverso.com'}`;
      await copyTextSafely(shareText);
      setShareSuccessMsg('¡Enlace de partido copiado para compartir por WhatsApp!');
      setTimeout(() => setShareSuccessMsg(''), 4000);
    });
  };

  const handleShareStandings = () => {
    handleRequireFanAction('Compartir Tabla de Posiciones', async () => {
      const shareText = `🏆 Tabla de Posiciones Oficial - ${tenant?.name || 'Liga'} (${selectedCategory}). Revisa los puntos en tiempo real: https://${tenant?.domain || 'deporverso.com'}`;
      await copyTextSafely(shareText);
      setShareSuccessMsg('¡Enlace de la tabla de posiciones copiado!');
      setTimeout(() => setShareSuccessMsg(''), 4000);
    });
  };

  const handleGenerateAiStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      setIsGeneratingStory(false);
      setAiStoryText(
        `📰 RESUMEN OFICIAL DE LA JORNADA: ¡Épica jornada deportiva en la categoría ${selectedCategory}! El torneo vibró con encuentros de altísima intensidad táctica. Destacamos el rendimiento impecable de los líderes en la tabla, quienes mantienen un promedio ofensivo devastador con despliegues rápidos en las bandas. La mesa de vocalía digital registró un récord de efectividad del 99.8% con escaneo QR de carnets. ¡Sigue la próxima fecha en vivo por Deporverso!`
      );
    }, 1200);
  };

  // Compute standings per team
  const standings = teams.map((team) => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let gf = 0;
    let ga = 0;
    let form: ('W' | 'D' | 'L')[] = [];

    matches.forEach((m) => {
      if (m.status === 'FINISHED') {
        if (m.home_team_id === team.id) {
          played++;
          gf += m.home_score;
          ga += m.away_score;
          if (m.home_score > m.away_score) { won++; form.push('W'); }
          else if (m.home_score === m.away_score) { drawn++; form.push('D'); }
          else { lost++; form.push('L'); }
        } else if (m.away_team_id === team.id) {
          played++;
          gf += m.away_score;
          ga += m.home_score;
          if (m.away_score > m.home_score) { won++; form.push('W'); }
          else if (m.away_score === m.home_score) { drawn++; form.push('D'); }
          else { lost++; form.push('L'); }
        }
      }
    });

    const pts = (won * 3) + (drawn * 1);
    const diff = gf - ga;
    const recentForm = form.slice(-5);

    return { team, played, won, drawn, lost, gf, ga, diff, pts, form: recentForm };
  }).sort((a, b) => b.pts - a.pts || b.diff - a.diff || b.gf - a.gf);

  // Filtered Teams based on search
  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aggregate real goals and disciplinary cards from live match events + Vocalía player_stats
  const realStatsMap = React.useMemo(() => {
    const playerGoals = new Map<string, number>();
    const playerMatches = new Map<string, Set<string>>();
    const teamYellows = new Map<string, number>();
    const teamReds = new Map<string, number>();

    events.forEach((ev) => {
      const evType = (ev.event_type || '').toUpperCase();
      if (ev.player_id && (evType === 'GOAL' || evType === 'PENALTY_GOAL' || evType === 'GOL')) {
        playerGoals.set(ev.player_id, (playerGoals.get(ev.player_id) || 0) + 1);
      }
      if (ev.player_id && ev.match_id) {
        if (!playerMatches.has(ev.player_id)) playerMatches.set(ev.player_id, new Set());
        playerMatches.get(ev.player_id)!.add(ev.match_id);
      }
      if (ev.team_id) {
        if (evType === 'YELLOW_CARD' || evType === 'TARJETA_AMARILLA') {
          teamYellows.set(ev.team_id, (teamYellows.get(ev.team_id) || 0) + 1);
        } else if (evType === 'RED_CARD' || evType === 'TARJETA_ROJA') {
          teamReds.set(ev.team_id, (teamReds.get(ev.team_id) || 0) + 1);
        }
      }
    });

    matches.forEach((m) => {
      const pStats = m.match_data?.player_stats;
      if (pStats && typeof pStats === 'object') {
        Object.entries(pStats).forEach(([pid, stat]: [string, any]) => {
          if (stat && typeof stat.goals === 'number' && stat.goals > 0) {
            playerGoals.set(pid, Math.max(playerGoals.get(pid) || 0, stat.goals));
          }
          const playerTeam = players.find((p) => p.id === pid)?.team_id;
          if (playerTeam && stat) {
            if (typeof stat.yellow === 'number' && stat.yellow > 0) {
              teamYellows.set(playerTeam, Math.max(teamYellows.get(playerTeam) || 0, stat.yellow));
            }
            if (typeof stat.red === 'number' && stat.red > 0) {
              teamReds.set(playerTeam, Math.max(teamReds.get(playerTeam) || 0, stat.red));
            }
          }
        });
      }
    });

    return { playerGoals, playerMatches, teamYellows, teamReds };
  }, [events, matches, players]);

  // Top Scorers combining recorded event goals with clean deterministic baseline fallback
  const topScorers = players.slice(0, 8).map((p, idx) => {
    const pTeam = teams.find(t => t.id === p.team_id);
    const realGoals = realStatsMap.playerGoals.get(p.id) || 0;
    const baselineGoals = Math.max(1, 10 - idx * 1);
    const goalsCount = realGoals > 0 ? realGoals : baselineGoals;
    const recordedMatches = realStatsMap.playerMatches.get(p.id)?.size || 0;
    const matchesPlayed = recordedMatches > 0 ? recordedMatches : Math.min(8, 5 + (idx % 3));
    return {
      player: p,
      team: pTeam,
      goals: goalsCount,
      matchesPlayed,
      avgPerMatch: (goalsCount / Math.max(1, matchesPlayed)).toFixed(2)
    };
  }).sort((a, b) => b.goals - a.goals);

  // Fair Play Table aggregating recorded yellow & red cards with baseline fallback
  const fairPlayTeams = teams.map((t, idx) => {
    const realYellow = realStatsMap.teamYellows.get(t.id);
    const realRed = realStatsMap.teamReds.get(t.id);
    const yellowCards = realYellow !== undefined ? realYellow : (idx * 2 + 1) % 6;
    const redCards = realRed !== undefined ? realRed : (idx % 4 === 0 ? 1 : 0);
    const penaltyPoints = (yellowCards * 1) + (redCards * 3);
    return { team: t, yellowCards, redCards, penaltyPoints };
  }).sort((a, b) => a.penaltyPoints - b.penaltyPoints);

  // Filtered matches
  const filteredMatches = matches.filter(m => {
    const homeName = m.home_team?.name || teams.find(t => t.id === m.home_team_id)?.name || '';
    const awayName = m.away_team?.name || teams.find(t => t.id === m.away_team_id)?.name || '';
    const matchText = `${homeName} ${awayName} ${m.field_location}`.toLowerCase();
    
    const matchesSearch = searchQuery === '' || matchText.includes(searchQuery.toLowerCase());
    const matchesMatchday = matchdayFilter === 'TODAS' || 
      (matchdayFilter === 'LIVE' && m.status === 'IN_PROGRESS') ||
      (matchdayFilter === 'FINISHED' && m.status === 'FINISHED');

    return matchesSearch && matchesMatchday;
  });

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black">
      <FanAuthModal
        isOpen={showFanAuthModal}
        onClose={() => setShowFanAuthModal(false)}
        onSuccess={handleFanAuthSuccess}
        actionTitle={fanModalAction}
      />

      {/* Toast Notification */}
      {shareSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-cyan-500 text-black px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{shareSuccessMsg}</span>
        </div>
      )}

      {/* ==================== LEAGUE CONTEXT TOOLBAR (NO NESTED STICKY HEADER) ==================== */}
      <div className="bg-slate-950/75 border-b border-white/10 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 transition-all">
        {/* Brand Logo & League Identification */}
        <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('inicio')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#050b14] rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
              <img 
                src={sportDriveIcon} 
                alt={tenant.sport_code} 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {tenant.name || 'LIGA DEPORTIVA'}
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {sport?.name?.toUpperCase() || tenant.sport_code || 'FÚTBOL 11'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">
              Portal Oficial de Competición
            </span>
          </div>
        </div>

        {/* Right Menu Items (Minimalist & Refined Segmented Bar) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inicio' 
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analítica</span>
          </button>

          {/* Categorías Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer font-medium whitespace-nowrap"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider block">Categoría</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                      setActiveTab('standings');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' 
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-white font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'transfers' 
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Pases & Fichajes
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blog' 
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Blog & Crónicas
          </button>

          {/* En Vivo: Creador (Vocalía/VAR/Director Multicámara) vs Usuario Normal (Solo Canales de Streaming) */}
          {isSuperAdminAuth ? (
            <div className="relative">
              <button
                onClick={() => setShowOnlineDropdown(!showOnlineDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium whitespace-nowrap ${
                  activeTab === 'online'
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>En Vivo</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showOnlineDropdown && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 space-y-0.5">
                  <button
                    onClick={() => { 
                      setActiveTab('online'); 
                      setStreamingMode('vocalia'); 
                      setShowOnlineDropdown(false); 
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      activeTab === 'online' && streamingMode === 'vocalia'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="block">Vocalía Digital Live</span>
                      <span className="text-[10px] text-slate-400 font-normal">Marcador y acta en vivo</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { 
                      setActiveTab('online'); 
                      setStreamingMode('var'); 
                      setShowOnlineDropdown(false); 
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      activeTab === 'online' && streamingMode === 'var'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="block">Transmisión VAR Local</span>
                      <span className="text-[10px] text-slate-400 font-normal">Repetición & señales de cancha</span>
                    </div>
                  </button>
                  <div className="pt-1 mt-1 border-t border-white/5">
                    <button
                      onClick={() => { 
                        setActiveTab('online'); 
                        setStreamingMode('tv'); 
                        setShowOnlineDropdown(false); 
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                        activeTab === 'online' && streamingMode === 'tv'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Director Multicámara & TV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveTab('online');
                setShowOnlineDropdown(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'online'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/35'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Canales En Vivo</span>
            </button>
          )}
        </nav>

        {/* Mobile Quick Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          <button 
            onClick={() => setActiveTab('standings')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'standings' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/10 border-white/15 text-white'
            }`}
          >
            Tabla
          </button>
          <button 
            onClick={() => setActiveTab('online')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'online' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/10 border-white/15 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>En Vivo</span>
          </button>
          <button 
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="px-2.5 py-1.5 bg-white/10 border border-white/15 rounded-lg text-xs text-white font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>{selectedCategory.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* BANNER OFICIAL DE MODO DEMO (REGISTRADO) */}
      {!hasPaidFullAccess && !isSuperAdminAuth && (
        <div className="bg-gradient-to-r from-[#030919] via-[#091533] to-[#030919] border-b border-cyan-500/30 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Modo Demo Oficial
                </span>
                <span className="text-xs font-bold text-white">
                  Liga Barrial Pichincha & Club Deportivo Deporverso
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {userEmail ? <span className="font-semibold text-white">{userEmail} · </span> : ''}
                Acceso demo. Suscríbete con 50% OFF ($35 mayores / $25 formativas) para activar Vocalía Digital, VAR a la Carta, Crónicas IA y Scouting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('club-deporverso')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title="Explorar la demo del Club Deportivo Deporverso"
              >
                <Star className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ver Demo Club Deporverso</span>
              </button>
            )}

            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>Suscribirse 50% OFF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== MAIN PORTAL DASHBOARD CONTENT ==================== */}
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-5 py-6 space-y-6">

        {/* Minimalist Segmented Navigation Tabs Bar */}
        <div className="deporverso-segmented-nav no-scrollbar flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inicio' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Resumen Portal
          </button>

          <button
            onClick={() => setActiveTab('dossier-directorio')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dossier-directorio' 
                ? 'deporverso-tab-pill-active font-semibold text-cyan-300' 
                : 'deporverso-tab-pill-inactive text-amber-300/90 hover:text-amber-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Dossier Directorio & ROI
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'standings' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Posiciones
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'matches' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Calendario & Marcadores
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'teams' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Clubes, Jugadores & Carnets
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analytics' 
                ? 'deporverso-tab-pill-active font-semibold text-cyan-300' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Analítica & Tendencias
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'transfers' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" /> Pases & Transferencias
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'blog' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" /> Blog & Crónicas
          </button>

          <button
            onClick={() => {
              setActiveTab('online');
              if (isSuperAdminAuth) setStreamingMode('tv');
            }}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'online' 
                ? 'deporverso-tab-pill-active font-semibold text-emerald-300' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {isSuperAdminAuth
              ? `En Vivo (${streamingMode === 'var' ? 'VAR' : streamingMode === 'tv' ? 'Multicámara' : 'Vocalía'})`
              : 'Canales En Vivo'}
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'rules' 
                ? 'deporverso-tab-pill-active font-semibold' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Inscripciones & Reglamento
          </button>

          <button
            onClick={() => setActiveTab('3d-stadium')}
            className={`whitespace-nowrap flex items-center gap-2 ${
              activeTab === '3d-stadium' 
                ? 'deporverso-tab-pill-active font-semibold text-emerald-300' 
                : 'deporverso-tab-pill-inactive'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Experiencia 3D
          </button>
        </div>

        {/* SECTION: INICIO (SUMMARY OVERVIEW) */}
        {activeTab === 'inicio' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* ================================================================ */}
            {/* PORTADA OFICIAL CINEMATOGRÁFICA DE LA LIGA BARRIAL PICHINCHA      */}
            {/* ================================================================ */}
            <div className="cine-stage-frame">
              <div className="relative min-h-[380px] md:min-h-[430px] w-full overflow-hidden flex items-end">
                <img
                  src={tenant.id === 't-pichincha' ? CINEMATIC_ASSETS.stadiumBroadcast : (currentSportBg || ligaBarrialPichinchaHero)}
                  alt={`Estadio Oficial — ${tenant.name || 'Liga Barrial Pichincha'}`}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.82] contrast-[1.08] transition-transform duration-700"
                />
                <div className="absolute inset-0 cine-scrim-hero" />
                <div className="absolute inset-0 cine-vignette pointer-events-none" />

                {/* Contenido Split: Narrativa + Tarjeta de Partido en Vivo */}
                <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
                      <span className="text-cyan-300 font-semibold">{tenant.name || 'Liga Barrial Pichincha'}</span>
                      <span aria-hidden="true" className="text-white/30">·</span>
                      <span>Serie A &amp; Serie B · Quito 2026</span>
                      <span aria-hidden="true" className="text-white/30">·</span>
                      <span className="text-amber-300 font-semibold">{teams.length} Clubes Federados</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.05]">
                      El Deporte Barrial de Pichincha en Señal Cinematográfica
                    </h1>

                    <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
                      Automatización integral desde <strong className="text-white tabular-nums">$35 USD/club</strong> en mayores y <strong className="text-white tabular-nums">$25 USD/club</strong> en formativas. La Liga conserva su margen de inscripción, reduce garantías al 50% con streaming + VAR incluidos y comisiona el 2% en <strong className="text-cyan-300">heroesdeldeporte.com</strong>.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('dossier-directorio')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap shrink-0"
                      >
                        <DollarSign className="w-4 h-4 text-slate-950" />
                        <span>Modelo Financiero &amp; Directorio</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          type="button"
                          onClick={() => onNavigateTab('club-deporverso')}
                          className="px-4 py-2.5 rounded-xl bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Star className="w-4 h-4 text-cyan-400" />
                          <span>Demo Club Deporverso</span>
                        </button>
                      )}

                      {onOpenStepTour && (
                        <button
                          type="button"
                          onClick={() => onOpenStepTour(0)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 text-amber-300" />
                          <span>Tour Guiado</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tarjeta Live Match Broadcast sobre el estadio */}
                  {matches[0] && (() => {
                    const liveM = matches.find((m) => m.status === 'IN_PROGRESS') || matches[0];
                    const hTeam = liveM.home_team || teams.find((t) => t.id === liveM.home_team_id);
                    const aTeam = liveM.away_team || teams.find((t) => t.id === liveM.away_team_id);
                    return (
                      <div className="lg:col-span-5">
                        <div className="bg-[#060b16]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xl">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              {liveM.status === 'IN_PROGRESS' ? 'EN JUEGO · SEÑAL OFICIAL' : 'PRÓXIMO ENCUENTRO'}
                            </span>
                            <span className="text-slate-400 truncate max-w-[160px]">{liveM.match_data?.round || 'Jornada Oficial'}</span>
                          </div>

                          <div className="grid grid-cols-7 items-center gap-2 py-2 border-y border-white/10">
                            <div className="col-span-3 text-left">
                              <p className="text-xs sm:text-sm font-bold text-white truncate">{hTeam?.name || 'Local'}</p>
                              <span className="text-[10px] font-mono text-slate-400">Local</span>
                            </div>
                            <div className="col-span-1 text-center font-mono font-black text-lg sm:text-xl text-cyan-300 tabular-nums">
                              {liveM.home_score}:{liveM.away_score}
                            </div>
                            <div className="col-span-3 text-right">
                              <p className="text-xs sm:text-sm font-bold text-white truncate">{aTeam?.name || 'Visitante'}</p>
                              <span className="text-[10px] font-mono text-slate-400">Visitante</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-slate-400 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                              {liveM.field_location}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedMatchForDetail(liveM)}
                              className="text-cyan-300 hover:text-cyan-200 font-mono font-bold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
                            >
                              <span>Ver Ficha</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Franja Inferior de Métricas Cuantitativas */}
              <div className="bg-[#060b16] border-t border-white/10 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Margen Inscripción Liga</span>
                  <span className="font-black text-emerald-400 text-sm tabular-nums">+$15 a $65 USD / Club</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Fondo de Garantía</span>
                  <span className="font-black text-amber-300 text-sm tabular-nums">-50% Reducción Riesgo</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Tienda Oficial (2% Liga)</span>
                  <span className="font-black text-cyan-300 text-sm">heroesdeldeporte.com</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">VAR &amp; Transmisión HD</span>
                  <span className="font-black text-white text-sm tabular-nums">100% Provisto por App</span>
                </div>
              </div>
            </div>

            {/* Minimalist Glass Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 tabular-nums">
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 p-5 rounded-2xl space-y-2 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium">Equipos Registrados</span>
                  <Shield className="w-4 h-4 text-cyan-400 opacity-80" />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-white block tracking-tight font-mono">{teams.length}</span>
                <span className="text-xs text-cyan-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Planteles Oficiales
                </span>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-amber-500/30 p-5 rounded-2xl space-y-2 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium">Partidos Jugados</span>
                  <Trophy className="w-4 h-4 text-amber-400 opacity-80" />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-amber-400 block tracking-tight font-mono">{matches.length}</span>
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Fase de Grupos
                </span>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 p-5 rounded-2xl space-y-2 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium">Jugadores Carnetizados</span>
                  <Award className="w-4 h-4 text-emerald-400 opacity-80" />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block tracking-tight font-mono">{players?.length || 0}</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Carnet QR 3D
                </span>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-purple-500/30 p-5 rounded-2xl space-y-2 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium">Liga / Torneo</span>
                  <Globe className="w-4 h-4 text-purple-400 opacity-80" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white truncate block tracking-tight">{tenant.name}</span>
                <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Licencia Deporverso
                </span>
              </div>
            </div>

            {/* ACCESO RÁPIDO A ANALÍTICA RECHARTS */}
            <div 
              onClick={() => setActiveTab('analytics')}
              className="bg-gradient-to-r from-[#050B1A] via-[#081534] to-[#050B1A] border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform shrink-0">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                      RECHARTS BIOMETRIC ENGINE
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      NUEVO
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    Tendencia de Goles & Rendimiento de Equipos
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visualiza curvas de efectividad por fecha, histograma de minutos 1-90+, balance ofensivo/defensivo y estadísticas en vivo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 group-hover:translate-x-1 transition-transform shrink-0">
                <span>Abrir Analítica Completa</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Top Standings Preview */}
              <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Líderes de Clasificación — {selectedCategory}
                  </h3>
                  <button
                    onClick={() => setActiveTab('standings')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Ver Tabla Completa <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10 font-bold uppercase tracking-wider font-mono">
                        <th className="pb-3">Pos</th>
                        <th className="pb-3">Equipo</th>
                        <th className="pb-3 text-center">PJ</th>
                        <th className="pb-3 text-center">PG</th>
                        <th className="pb-3 text-center">DIF</th>
                        <th className="pb-3 text-right font-black text-cyan-400">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-normal text-white/90">
                      {standings.slice(0, 5).map((row, idx) => (
                        <tr key={row.team.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-bold font-mono text-cyan-400">#{idx + 1}</td>
                          <td className="py-3.5 font-bold text-white flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: row.team.primary_color }}></span>
                            <span>{row.team.name}</span>
                          </td>
                          <td className="py-3.5 text-center font-medium font-mono text-slate-300">{row.played}</td>
                          <td className="py-3.5 text-center text-emerald-400 font-bold font-mono">{row.won}</td>
                          <td className="py-3.5 text-center font-medium font-mono text-slate-300">{row.diff > 0 ? `+${row.diff}` : row.diff}</td>
                          <td className="py-3.5 text-right font-black text-cyan-400 text-base font-mono">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Live Match Widget & Fan Registration */}
              <div className="space-y-6">
                <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-rose-400 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Próximo Encuentro
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Cancha Principal</span>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-center space-y-2.5">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-white truncate max-w-[110px]">{teams[0]?.name || 'Barcelona S.C.'}</span>
                      <span className="text-amber-400 font-bold text-xs font-mono bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/25">15:30</span>
                      <span className="text-white truncate max-w-[110px]">{teams[1]?.name || 'Liga de Quito'}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-normal">Vocalía asignada por mesa de control digital Deporverso.</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('matches')}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Ver Todo el Calendario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fan Action Card */}
                <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 rounded-3xl border border-cyan-500/30 space-y-3.5 shadow-xl relative overflow-hidden">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                    ¿Eres Hinchada de la Liga?
                  </h4>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">
                    Regístrate como Fan Oficial para interactuar, votar por el jugador del partido y compartir resultados.
                  </p>
                  <button
                    onClick={() => {
                      setFanModalAction('Registrarse como Hinchada Oficial');
                      setShowFanAuthModal(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/15 transition-all cursor-pointer"
                  >
                    {fanUser ? `Iniciado como ${fanUser.name}` : 'Unirse como Fan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: STANDINGS */}
        {activeTab === 'standings' && (
          <div className="bg-[#080d1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Tabla de Clasificación & Estadísticas — {selectedCategory}
                </h2>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Criterios: Puntos &gt; Gol Diferencia &gt; Goles a Favor</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="deporverso-segmented-nav flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setStandingsSubTab('table')}
                    className={`transition-all cursor-pointer ${
                      standingsSubTab === 'table' ? 'deporverso-tab-pill-active font-semibold' : 'deporverso-tab-pill-inactive'
                    }`}
                  >
                    Tabla General
                  </button>
                  <button
                    onClick={() => setStandingsSubTab('scorers')}
                    className={`transition-all cursor-pointer ${
                      standingsSubTab === 'scorers' ? 'deporverso-tab-pill-active font-semibold' : 'deporverso-tab-pill-inactive'
                    }`}
                  >
                    Goleadores
                  </button>
                  <button
                    onClick={() => setStandingsSubTab('fairplay')}
                    className={`transition-all cursor-pointer ${
                      standingsSubTab === 'fairplay' ? 'deporverso-tab-pill-active font-semibold' : 'deporverso-tab-pill-inactive'
                    }`}
                  >
                    Fair Play
                  </button>
                </div>

                <button
                  onClick={handleShareStandings}
                  className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-lg border border-white/[0.08] text-xs cursor-pointer transition-all"
                  title="Compartir Tabla"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

            {standingsSubTab === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#A0A0A0] uppercase font-bold bg-[#050505]">
                      <th className="py-4 px-4">Pos</th>
                      <th className="py-4 px-4">Equipo</th>
                      <th className="py-4 px-3 text-center">PJ</th>
                      <th className="py-4 px-3 text-center">PG</th>
                      <th className="py-4 px-3 text-center">PE</th>
                      <th className="py-4 px-3 text-center">PP</th>
                      <th className="py-4 px-3 text-center">GF</th>
                      <th className="py-4 px-3 text-center">GC</th>
                      <th className="py-4 px-3 text-center">DIF</th>
                      <th className="py-4 px-4 text-right font-black text-cyan-400 text-sm">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-normal text-white/90">
                    {standings.map((row, idx) => (
                      <tr key={row.team.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#A0A0A0]">#{idx + 1}</td>
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: row.team.primary_color }}></span>
                          <span>{row.team.name}</span>
                        </td>
                        <td className="py-4 px-3 text-center font-medium">{row.played}</td>
                        <td className="py-4 px-3 text-center text-emerald-400 font-bold">{row.won}</td>
                        <td className="py-4 px-3 text-center text-[#A0A0A0] font-normal">{row.drawn}</td>
                        <td className="py-4 px-3 text-center text-rose-400 font-medium">{row.lost}</td>
                        <td className="py-4 px-3 text-center font-medium">{row.gf}</td>
                        <td className="py-4 px-3 text-center font-medium">{row.ga}</td>
                        <td className="py-4 px-3 text-center font-bold text-white">{row.diff > 0 ? `+${row.diff}` : row.diff}</td>
                        <td className="py-4 px-4 text-right font-black text-cyan-400 text-base">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {standingsSubTab === 'scorers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topScorers.map((item, idx) => (
                  <div key={item.player.id} className="bg-[#050505] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 font-black text-base flex items-center justify-center border border-amber-500/30">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.player.full_name}</h4>
                        <p className="text-xs text-cyan-400 font-medium mt-0.5">{item.team?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-amber-400 block tracking-tight">{item.goals}</span>
                      <span className="block text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">Goles</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {standingsSubTab === 'fairplay' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#A0A0A0] uppercase font-bold bg-[#050505]">
                      <th className="py-4 px-4">Posición Fair Play</th>
                      <th className="py-4 px-4">Equipo</th>
                      <th className="py-4 px-3 text-center">🟨 Amarillas</th>
                      <th className="py-4 px-3 text-center">🟥 Rojas</th>
                      <th className="py-4 px-4 text-right font-bold text-emerald-400">Puntos Penalización</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-normal">
                    {fairPlayTeams.map((item, idx) => (
                      <tr key={item.team.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#A0A0A0]">#{idx + 1}</td>
                        <td className="py-4 px-4 font-bold text-white">{item.team.name}</td>
                        <td className="py-4 px-3 text-center text-amber-400 font-bold text-sm">{item.yellowCards}</td>
                        <td className="py-4 px-3 text-center text-rose-400 font-bold text-sm">{item.redCards}</td>
                        <td className="py-4 px-4 text-right font-black text-emerald-400 text-sm">{item.penaltyPoints} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION: MATCHES - FIXTURE CUÁNTICO MULTIDEPORTE */}
        {activeTab === 'matches' && (
          <LeagueFixtureTable
            tenant={tenant}
            sport={sport}
            matches={matches}
            teams={teams}
            players={players}
            onSelectMatchDetail={(m) => setSelectedMatchForDetail(m)}
            onShareMatch={(title) => handleShareMatch(title)}
          />
        )}

        {/* SECTION: TEAMS & CARNETIZACIÓN QR */}
        {activeTab === 'teams' && (
          <ClubAndRosterDetail
            tenant={tenant}
            sport={sport}
            teams={teams}
            players={players}
            matches={matches}
            searchQuery={searchQuery}
            onSharePlayer={(pName, tName) => handleShareMatch(`Ficha de ${pName} (${tName}) en ${tenant.name}`)}
            onRequestTransfer={(player) => {
              setPlayerForTransfer(player);
              setActiveTab('transfers');
            }}
            onOpenTransfers={() => setActiveTab('transfers')}
          />
        )}

        {/* SECTION: ANALÍTICA DE LIGA & TENDENCIA DE GOLES (RECHARTS) */}
        {activeTab === 'analytics' && (
          <LeagueAnalytics
            tenant={tenant}
            sport={sport}
            matches={matches}
            teams={teams}
            events={events}
            isSuperAdminAuth={isSuperAdminAuth}
          />
        )}

        {/* SECTION: GESTIÓN DE PASES Y TRANSFERENCIAS DIGITALES */}
        {activeTab === 'transfers' && (
          <PlayerTransfersManager
            tenant={tenant}
            sport={sport}
            teams={teams}
            players={players}
            onPlayerTransferred={onPlayerTransferred}
            onRequestTransferForPlayer={playerForTransfer}
            onCloseRequestModal={() => setPlayerForTransfer(null)}
          />
        )}

        {/* SECTION: BLOG & CRÓNICAS IA */}
        {activeTab === 'blog' && (
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                  Blog Deportivo & Crónicas Oficiales de Liga
                </h2>
                <p className="text-xs text-[#A0A0A0] font-normal mt-1">Resúmenes periodísticos oficiales y artículos de la jornada generados automáticamente por el sistema.</p>
              </div>

              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> {publishedChronicles.length + 2} Artículos Publicados
              </span>
            </div>

            {/* LIST OF PUBLISHED AI CHRONICLES */}
            {publishedChronicles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4" /> Crónicas Periodísticas Destacadas:
                </h3>

                {publishedChronicles.map((c, i) => (
                  <article key={i} className="bg-[#050505] p-7 rounded-2xl border border-cyan-500/30 space-y-4 shadow-xl hover:border-cyan-400 transition-all">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Crónica Oficial del Torneo
                      </span>
                      <span className="text-xs text-[#A0A0A0] font-normal">
                        {new Date(c.generated_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {c.headline}
                    </h3>

                    <div className="text-xs text-white/80 leading-relaxed space-y-2 font-serif border-l-2 border-cyan-500/50 pl-3">
                      {c.body.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                      {c.key_moments && c.key_moments.length > 0 && (
                        <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 space-y-1.5">
                          <span className="font-bold text-amber-400 text-[10px] uppercase tracking-wider block">⚡ Momentos Clave:</span>
                          <ul className="list-disc list-inside text-white/70 space-y-1 text-xs">
                            {c.key_moments.map((km, idx) => (
                              <li key={idx}>{km}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {c.tactical_notes && (
                        <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 space-y-1.5">
                          <span className="font-bold text-cyan-400 text-[10px] uppercase tracking-wider block">📊 Análisis Táctico IA:</span>
                          <p className="text-white/70 text-xs leading-normal">{c.tactical_notes}</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* OFFICIAL LEAGUE ANNOUNCEMENTS */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Comunicados Oficiales de la Liga:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 space-y-3 shadow-md">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Aviso Oficial</span>
                  <h3 className="font-bold text-white text-base">Inscripciones abiertas para el Torneo Clausura</h3>
                  <p className="text-xs text-[#A0A0A0] font-normal leading-relaxed">
                    La comisión directiva de {tenant.name} informa que las inscripciones de equipos para la nueva temporada están habilitadas en mesa directiva.
                  </p>
                  <span className="text-[10px] text-[#A0A0A0] block font-normal">Publicado hace 2 horas</span>
                </div>

                <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 space-y-3 shadow-md">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Resumen de Fecha</span>
                  <h3 className="font-bold text-white text-base">Récord de asistencia en la cancha principal</h3>
                  <p className="text-xs text-[#A0A0A0] font-normal leading-relaxed">
                    Más de 500 aficionados disfrutaron del clásico de la categoría {selectedCategory}. La vocalía digital transmitió el marcador en tiempo real.
                  </p>
                  <span className="text-[10px] text-[#A0A0A0] block font-normal">Publicado ayer</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: EN VIVO - DIRECTOR MULTICÁMARA & VAR (SOLO CREADOR) vs CANALES DE STREAMING (PÚBLICO) */}
        {activeTab === 'online' && (
          isSuperAdminAuth ? (
            <LiveStreamingPanel
              tenant={tenant}
              sport={sport}
              matches={matches}
              teams={teams}
              players={players}
              defaultMode={streamingMode}
              isSuperAdminAuth={isSuperAdminAuth}
            />
          ) : (
            <PublicStreamingChannels
              tenant={tenant}
              sport={sport}
              matches={matches}
              teams={teams}
              events={events}
            />
          )
        )}

        {/* SECTION: INSCRIPCIONES & REGLAMENTO (STREAMING ESTUDIO SOLO CREADOR) */}
        {activeTab === 'rules' && (
          <InscriptionsAndStreaming
            tenant={tenant}
            sport={sport}
            matches={matches}
            teams={teams}
            players={players}
            isSuperAdminAuth={isSuperAdminAuth}
          />
        )}

        {/* SECTION: 3D STADIUM & TROPHY EXPERIENCE */}
        {activeTab === '3d-stadium' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#0a0c10] border border-white/10 rounded-3xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00ff66]">
                  Renderizado WebGL de Alto Rendimiento
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Estadio, Balón y Trofeo 3D Oficial
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Interactúa con el escenario virtual de tu liga ({tenant.name}). Arrastra con el mouse o dedo para rotar en 360°.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 tabular-nums">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  60 FPS Estable
                </span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Sport3DExperience
                sportCode={tenant.sport_code || 'FUTBOL'}
                height={550}
                interactive={true}
                initialMode="STADIUM"
              />
            </div>
          </div>
        )}

        {/* SECTION: DOSSIER EJECUTIVO PARA DIRECTORIO & PRESIDENTES */}
        {activeTab === 'dossier-directorio' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <PichinchaExecutiveDemo
              tenant={tenant}
              sport={sport}
              matches={matches}
              teams={teams}
              players={players}
              isSuperAdminAuth={isSuperAdminAuth}
              onLaunchTour={onOpenStepTour ? () => onOpenStepTour(0) : undefined}
              onNavigateSubTab={(tab) => {
                if (tab === 'standings') setActiveTab('standings');
                else if (tab === 'matches') setActiveTab('matches');
                else if (tab === 'teams') setActiveTab('teams');
                else if (tab === 'var') { if (isSuperAdminAuth) { setActiveTab('online'); setStreamingMode('var'); } }
                else if (tab === 'vocalia') { if (isSuperAdminAuth) { setActiveTab('online'); setStreamingMode('vocalia'); } }
              }}
            />
          </div>
        )}

      </main>

      {/* QR DIGITAL ID CARNET MODAL */}
      {selectedPlayerForQr && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 text-center relative shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
              <span className="text-[10px] font-black text-black bg-amber-400 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3" /> Credencial Oficial Deporverso
              </span>
              <button 
                onClick={() => setSelectedPlayerForQr(null)}
                className="text-white/60 hover:text-white font-black text-lg px-2 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <TradingCardCarnet 
              player={selectedPlayerForQr}
              team={teams.find(t => t.id === selectedPlayerForQr.team_id)}
              tenant={tenant}
              sport={sport}
              size="lg"
            />

            <button
              onClick={() => setSelectedPlayerForQr(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer transition-all border border-white/10"
            >
              Cerrar Carnet
            </button>
          </div>
        </div>
      )}

      {/* PUBLIC MATCH & VOCALIA DETAILS MODAL */}
      {selectedMatchForDetail && (() => {
        const m = selectedMatchForDetail;
        const hTeam = m.home_team || teams.find(t => t.id === m.home_team_id);
        const aTeam = m.away_team || teams.find(t => t.id === m.away_team_id);
        const playerStats = m.match_data?.player_stats || {};
        const vReport = m.match_data?.vocal_report;
        const rReport = m.match_data?.referee_report;

        const homeStats = Object.values(playerStats).filter(s => s.team_id === m.home_team_id);
        const awayStats = Object.values(playerStats).filter(s => s.team_id === m.away_team_id);

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-[#0d0d0d] border border-[#00ff66]/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-[#00ff66] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Acta Oficial de Partido
                    </span>
                    <span className="text-[#00ff66] text-xs font-black uppercase tracking-wider drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
                      {tenant.name}
                    </span>
                    <span className="text-[#A0A0A0] text-xs">| {m.field_location || 'Estadio Central'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {hTeam?.name || 'Local'} vs {aTeam?.name || 'Visitante'}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedMatchForDetail(null)}
                  className="text-white/60 hover:text-white font-black text-xl p-2 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Score banner */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 flex items-center justify-between text-center">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{hTeam?.name || 'Local'}</h4>
                  <span className="text-xs text-cyan-400 font-bold">Local</span>
                </div>

                <div className="px-6 space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-[#00ff66] font-mono tracking-wider drop-shadow-[0_0_12px_rgba(0,255,102,0.3)]">
                    {m.home_score} - {m.away_score}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase inline-block ${
                    m.status === 'FINISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {m.status === 'FINISHED' ? 'Finalizado Oficial' : 'En Curso'}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{aTeam?.name || 'Visitante'}</h4>
                  <span className="text-xs text-teal-400 font-bold">Visitante</span>
                </div>
              </div>

              {/* Firebase sync badge */}
              <div className="bg-[#00ff66]/10 border border-[#00ff66]/30 p-3 rounded-xl flex items-center justify-between text-xs text-[#00ff66]">
                <span className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Acta Digital Sincronizada con Firebase Firestore (Segmento: {tenant.name})
                </span>
                <span className="text-[10px] font-mono text-white/60">
                  {m.match_data?.last_synced_at ? new Date(m.match_data.last_synced_at).toLocaleTimeString() : 'En Línea'}
                </span>
              </div>

              {/* Player Rosters Format: Número, Nombre, Goles, Tarjetas */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00ff66]" />
                  Detalle de Planillas & Estadísticas Individuales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Team Roster */}
                  <div className="bg-[#141414] p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-black text-xs text-cyan-400 uppercase">{hTeam?.name}</h4>
                      <span className="text-[11px] text-[#A0A0A0] font-mono font-bold">{m.home_score} Goles</span>
                    </div>

                    <div className="space-y-2">
                      {homeStats.length === 0 ? (
                        <p className="text-xs text-[#A0A0A0] py-4 text-center">Nómina por registrar en mesa.</p>
                      ) : (
                        homeStats.map((s, idx) => (
                          <div key={`${s.player_id || 'home-stat'}-${idx}`} className="flex items-center justify-between bg-[#0a0a0a] p-2.5 rounded-xl border border-white/5 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#1e1e1e] font-mono font-black text-[11px] flex items-center justify-center text-white">
                                {s.jersey_number}
                              </span>
                              <span className="font-bold text-white">{s.player_name}</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              {s.goals > 0 && (
                                <span className="text-[#00ff66] font-black bg-[#00ff66]/10 px-2 py-0.5 rounded">
                                  ⚽ {s.goals}
                                </span>
                              )}
                              {s.yellow_cards > 0 && (
                                <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  🟨 {s.yellow_cards}
                                </span>
                              )}
                              {s.red_cards > 0 && (
                                <span className="text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded">
                                  🟥 {s.red_cards}
                                </span>
                              )}
                              {s.goals === 0 && s.yellow_cards === 0 && s.red_cards === 0 && (
                                <span className="text-[#A0A0A0] text-[10px]">Sin tarjetas</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Away Team Roster */}
                  <div className="bg-[#141414] p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-black text-xs text-teal-400 uppercase">{aTeam?.name}</h4>
                      <span className="text-[11px] text-[#A0A0A0] font-mono font-bold">{m.away_score} Goles</span>
                    </div>

                    <div className="space-y-2">
                      {awayStats.length === 0 ? (
                        <p className="text-xs text-[#A0A0A0] py-4 text-center">Nómina por registrar en mesa.</p>
                      ) : (
                        awayStats.map((s, idx) => (
                          <div key={`${s.player_id || 'away-stat'}-${idx}`} className="flex items-center justify-between bg-[#0a0a0a] p-2.5 rounded-xl border border-white/5 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#1e1e1e] font-mono font-black text-[11px] flex items-center justify-center text-white">
                                {s.jersey_number}
                              </span>
                              <span className="font-bold text-white">{s.player_name}</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              {s.goals > 0 && (
                                <span className="text-[#00ff66] font-black bg-[#00ff66]/10 px-2 py-0.5 rounded">
                                  ⚽ {s.goals}
                                </span>
                              )}
                              {s.yellow_cards > 0 && (
                                <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  🟨 {s.yellow_cards}
                                </span>
                              )}
                              {s.red_cards > 0 && (
                                <span className="text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded">
                                  🟥 {s.red_cards}
                                </span>
                              )}
                              {s.goals === 0 && s.yellow_cards === 0 && s.red_cards === 0 && (
                                <span className="text-[#A0A0A0] text-[10px]">Sin tarjetas</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aprobación de Capitanes */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-black text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Ratificación & Aprobación de Capitanes de Club
                  </span>
                  <span className="text-[10px] text-[#A0A0A0] font-mono">Reglamento Oficial</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Home Captain */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    m.match_data?.home_captain_approval?.approved 
                      ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-white' 
                      : 'bg-[#0a0a0a] border-white/10 text-white/80'
                  }`}>
                    <div>
                      <p className="font-bold text-cyan-400 text-xs">{hTeam?.name || 'Equipo Local'}</p>
                      <p className="text-[11px] text-[#A0A0A0]">
                        {m.match_data?.home_captain_approval?.captain_name || 'Capitán Local'} 
                        {m.match_data?.home_captain_approval?.captain_number ? ` (#${m.match_data.home_captain_approval.captain_number})` : ''}
                      </p>
                      {m.match_data?.home_captain_approval?.comments && (
                        <p className="text-[10px] text-white/60 italic mt-0.5">"{m.match_data.home_captain_approval.comments}"</p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono ${
                      m.match_data?.home_captain_approval?.approved 
                        ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {m.match_data?.home_captain_approval?.approved ? '✅ APROBADO' : '⏳ PENDIENTE'}
                    </span>
                  </div>

                  {/* Away Captain */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    m.match_data?.away_captain_approval?.approved 
                      ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-white' 
                      : 'bg-[#0a0a0a] border-white/10 text-white/80'
                  }`}>
                    <div>
                      <p className="font-bold text-teal-400 text-xs">{aTeam?.name || 'Equipo Visitante'}</p>
                      <p className="text-[11px] text-[#A0A0A0]">
                        {m.match_data?.away_captain_approval?.captain_name || 'Capitán Visitante'} 
                        {m.match_data?.away_captain_approval?.captain_number ? ` (#${m.match_data.away_captain_approval.captain_number})` : ''}
                      </p>
                      {m.match_data?.away_captain_approval?.comments && (
                        <p className="text-[10px] text-white/60 italic mt-0.5">"{m.match_data.away_captain_approval.comments}"</p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono ${
                      m.match_data?.away_captain_approval?.approved 
                        ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {m.match_data?.away_captain_approval?.approved ? '✅ APROBADO' : '⏳ PENDIENTE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informes Oficiales: Vocal & Arbitro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Vocal Report Box */}
                <div className="bg-[#121212] p-5 rounded-2xl border border-amber-500/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-black text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Informe del Vocal de Mesa
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {vReport?.status || 'CONFORME'}
                    </span>
                  </div>

                  <p className="text-white/90">
                    <strong className="text-[#A0A0A0]">Vocal:</strong> {vReport?.vocal_name || 'Rodrigo Almendariz'}
                  </p>
                  {vReport?.vocal_cedula && (
                    <p className="text-[#A0A0A0] font-mono text-[11px]">
                      <strong>Cédula:</strong> {vReport.vocal_cedula}
                    </p>
                  )}
                  <p className="text-white/80 leading-relaxed bg-[#0a0a0a] p-3 rounded-xl border border-white/5">
                    {vReport?.observations || 'Cancha y balones reglamentarios entregados a tiempo. Credenciales verificadas.'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Firma del vocal ratificada
                  </div>
                </div>

                {/* Referee Report Box */}
                <div className="bg-[#121212] p-5 rounded-2xl border border-cyan-500/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-black text-cyan-400 uppercase text-[11px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Informe Arbitral
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Colegio Oficial
                    </span>
                  </div>

                  <p className="text-white/90">
                    <strong className="text-[#A0A0A0]">Árbitro Central:</strong> {rReport?.main_referee || 'Jorge Benítez'}
                  </p>
                  <p className="text-white/80 leading-relaxed bg-[#0a0a0a] p-3 rounded-xl border border-white/5">
                    {rReport?.disciplinary_notes || 'Partido disputado con intensidad deportiva. Amonestaciones registradas en acta.'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Firma y validación arbitral confirmada
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <button
                  onClick={() => handleShareMatch(`${hTeam?.name} vs ${aTeam?.name}`)}
                  className="px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartir Acta Oficial</span>
                </button>

                <button
                  onClick={() => setSelectedMatchForDetail(null)}
                  className="px-6 py-2.5 bg-[#00ff66] hover:bg-[#00ff66]/90 text-black font-black text-xs rounded-xl cursor-pointer transition-all shadow-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
