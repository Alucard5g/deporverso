import React, { useState } from 'react';
import { 
  Trophy, Calendar, Users, QrCode, Shield, CheckCircle, CheckCircle2, Share2, 
  Heart, Sparkles, MessageCircle, Search, Filter, Award, Flame, 
  AlertTriangle, Check, ArrowRight, Eye, Star, Zap, Clock, MapPin, 
  ChevronRight, ExternalLink, Download, FileText, Activity, ChevronDown,
  Globe, Radio, Play, RefreshCw, Send, ThumbsUp
} from 'lucide-react';
import { Tenant, Match, Team, Player, Sport, AiChronicle } from '../../types';
import { FanAuthModal } from '../Fan/FanAuthModal';
import { TradingCardCarnet } from './TradingCardCarnet';
import { LeagueFixtureTable } from './LeagueFixtureTable';
import { SPORT_VISUAL_THEMES } from '../../data/sportThemesData';
import { Sport3DExperience } from '../ThreeD/Sport3DExperience';
import heroBannerImg from '../../assets/images/soccer_hero_banner_1785853921446.jpg';
import basketballHeroImg from '../../assets/images/basketball_hero_bg_1785854264293.jpg';
import volleyballHeroImg from '../../assets/images/volleyball_hero_bg_1785854282070.jpg';

interface LeagueDashboardProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  publishedChronicles?: AiChronicle[];
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
  matches,
  teams,
  players,
  publishedChronicles = []
}) => {
  const currentSportBg = getSportHeroBg(tenant.sport_code, sport?.name);
  const [activeTab, setActiveTab] = useState<'inicio' | 'standings' | 'matches' | 'teams' | 'blog' | 'online' | 'rules' | '3d-stadium'>('inicio');
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
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
        }
      } catch (e) {
        console.warn('Clipboard write error:', e);
      }
      setShareSuccessMsg('¡Enlace de partido copiado para compartir por WhatsApp!');
      setTimeout(() => setShareSuccessMsg(''), 4000);
    });
  };

  const handleShareStandings = () => {
    handleRequireFanAction('Compartir Tabla de Posiciones', async () => {
      const shareText = `🏆 Tabla de Posiciones Oficial - ${tenant?.name || 'Liga'} (${selectedCategory}). Revisa los puntos en tiempo real: https://${tenant?.domain || 'deporverso.com'}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
        }
      } catch (e) {
        console.warn('Clipboard write error:', e);
      }
      setShareSuccessMsg('¡Enlace de la tabla de posiciones copiado!');
      setTimeout(() => setShareSuccessMsg(''), 4000);
    });
  };

  const handleGenerateAiStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      setIsGeneratingStory(false);
      setAiStoryText(
        `🤖 CRÓNICA IA GEMINI 1.5 FLASH: ¡Épica jornada futbolística en la categoría ${selectedCategory}! El torneo vibró con encuentros de altísima intensidad táctica. Destacamos el rendimiento impecable de los líderes en la tabla, quienes mantienen un promedio ofensivo devastador con despliegues rápidos en las bandas. La mesa de vocalía digital registró un récord de efectividad del 99.8% con escaneo QR de carnets. ¡Sigue la próxima fecha en vivo por Deporverso!`
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

  // Mock Top Scorers
  const topScorers = players.slice(0, 8).map((p, idx) => {
    const pTeam = teams.find(t => t.id === p.team_id);
    const goalsCount = Math.max(1, 14 - idx * 2 + (idx % 2));
    return {
      player: p,
      team: pTeam,
      goals: goalsCount,
      matchesPlayed: Math.min(8, 6 + (idx % 3)),
      avgPerMatch: (goalsCount / Math.min(8, 6 + (idx % 3))).toFixed(2)
    };
  }).sort((a, b) => b.goals - a.goals);

  // Mock Fair Play Table
  const fairPlayTeams = teams.map((t, idx) => {
    const yellowCards = (idx * 2 + 1) % 7;
    const redCards = idx % 3 === 0 ? 1 : 0;
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

      {/* ==================== SADCAF TOP NAVIGATION BAR ==================== */}
      <header className="bg-black/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#00ff66]/30 shrink-0">
            {tenant.name ? tenant.name.charAt(0).toUpperCase() : 'L'}
          </div>
          <div className="flex items-center">
            <span className="text-xl md:text-2xl font-black uppercase tracking-wider text-[#00ff66] drop-shadow-[0_0_14px_rgba(0,255,102,0.5)]">
              {tenant.name || 'LIGA DEPORTIVA'}
            </span>
          </div>
        </div>

        {/* Right Menu Items (SADCAF Style) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`relative py-2 transition-all cursor-pointer ${
              activeTab === 'inicio' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            INICIO
            {activeTab === 'inicio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d2b5]"></span>
            )}
          </button>

          {/* Categorías Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1.5 py-2 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <span>CATEGORÍAS</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                      setActiveTab('standings');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat ? 'bg-[#00d2b5] text-black' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('blog')}
            className={`relative py-2 transition-all cursor-pointer ${
              activeTab === 'blog' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            BLOG & CRÓNICAS
            {activeTab === 'blog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d2b5]"></span>
            )}
          </button>

          {/* En Línea Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOnlineDropdown(!showOnlineDropdown)}
              className="flex items-center gap-1.5 py-2 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                EN LÍNEA
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showOnlineDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                <button
                  onClick={() => { setActiveTab('online'); setShowOnlineDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white/90 hover:bg-white/10 flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400" /> Vocalía Digital Live
                </button>
                <button
                  onClick={() => { setActiveTab('matches'); setMatchdayFilter('LIVE'); setShowOnlineDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white/90 hover:bg-white/10 flex items-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-400" /> Transmisión VAR Local
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setActiveTab('inicio')}
            className="p-2 bg-white/5 rounded-xl text-xs text-white font-bold"
          >
            Menú
          </button>
        </div>
      </header>

      {/* ==================== SADCAF HERO BANNER SECTION ==================== */}
      <div className="relative bg-[#050505] py-20 md:py-28 px-4 overflow-hidden border-b border-white/10">
        {/* Dynamic Sport Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 scale-105 transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${currentSportBg})` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505]"></div>

        {/* Center Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-[0.25em] text-white uppercase font-sans">
            INICIO
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl font-black tracking-[0.2em] text-[#00ff66] uppercase drop-shadow-[0_0_18px_rgba(0,255,102,0.55)]">
            {tenant.name || 'CAMPEÓN DE CAMPEONES'}
          </p>

          {/* SADCAF Central Search Input */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-2xl overflow-hidden p-1 border border-white/20">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar equipos, jugadores, estadísticas..."
                className="w-full px-4 py-3 text-black text-sm outline-none placeholder-gray-500 font-medium"
              />
              <button 
                onClick={() => setActiveTab('standings')}
                className="bg-[#00d2b5] hover:bg-[#00bda3] text-black p-3 rounded-md transition-all cursor-pointer font-bold flex items-center justify-center shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            {searchQuery && (
              <p className="text-xs text-cyan-400 font-bold mt-2">
                Filtrando resultados para "{searchQuery}"...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ==================== MAIN PORTAL DASHBOARD CONTENT ==================== */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inicio' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Globe className="w-4 h-4" /> Resumen Portal
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'standings' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Trophy className="w-4 h-4" /> Posiciones
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'matches' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Calendar className="w-4 h-4" /> Calendario & Marcadores
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'teams' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Users className="w-4 h-4" /> Equipos & Carnets QR
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'blog' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <FileText className="w-4 h-4" /> Blog & Crónicas
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'rules' ? 'bg-[#00d2b5] text-black font-extrabold shadow-lg shadow-cyan-500/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Shield className="w-4 h-4" /> Reglamento
          </button>

          <button
            onClick={() => setActiveTab('3d-stadium')}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === '3d-stadium' ? 'bg-[#00ff66] text-black font-extrabold shadow-lg shadow-[#00ff66]/20' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> Experiencia 3D
          </button>
        </div>

        {/* SECTION: INICIO (SUMMARY OVERVIEW) */}
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            {/* Top Stat Cards with Increased Numerical Metrics & 3D Interactive Cybernetic Styling */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-3d-interactive cyber-sheen-effect neon-border-cyan bg-gradient-to-b from-[#091522] to-[#040911] p-6 rounded-3xl space-y-1.5 shadow-xl relative overflow-hidden">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>
                <span className="text-white/60 text-xs font-mono font-bold uppercase tracking-wider block">Equipos Registrados</span>
                <span className="text-4xl sm:text-5xl font-black text-white block tracking-tight font-mono">{teams.length}</span>
                <span className="text-xs text-cyan-400 font-bold block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  100% Verificados
                </span>
              </div>

              <div className="card-3d-interactive cyber-sheen-effect neon-border-gold bg-gradient-to-b from-[#181308] to-[#080603] p-6 rounded-3xl space-y-1.5 shadow-xl relative overflow-hidden">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>
                <span className="text-white/60 text-xs font-mono font-bold uppercase tracking-wider block">Partidos Jugados</span>
                <span className="text-4xl sm:text-5xl font-black text-amber-400 block tracking-tight font-mono">{matches.length}</span>
                <span className="text-xs text-amber-400 font-bold block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Fase de Grupos
                </span>
              </div>

              <div className="card-3d-interactive cyber-sheen-effect neon-border-emerald bg-gradient-to-b from-[#091811] to-[#040a07] p-6 rounded-3xl space-y-1.5 shadow-xl relative overflow-hidden">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>
                <span className="text-white/60 text-xs font-mono font-bold uppercase tracking-wider block">Jugadores Carnetizados</span>
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 block tracking-tight font-mono">{players.length}</span>
                <span className="text-xs text-emerald-400 font-bold block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Carnet QR 3D
                </span>
              </div>

              <div className="card-3d-interactive cyber-sheen-effect bg-gradient-to-b from-[#120a1c] to-[#060309] border border-purple-500/30 p-6 rounded-3xl space-y-1.5 shadow-xl relative overflow-hidden">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>
                <span className="text-white/60 text-xs font-mono font-bold uppercase tracking-wider block">Liga / Torneo</span>
                <span className="text-xl sm:text-2xl font-black text-[#00ff66] uppercase truncate block tracking-tight drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]">{tenant.name}</span>
                <span className="text-xs text-purple-300/80 font-bold block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                  Licencia Deporverso
                </span>
              </div>
            </div>

            {/* Quick Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Top Standings Preview */}
              <div className="lg:col-span-2 bg-gradient-to-b from-[#09111c] to-[#040810] rounded-3xl border border-cyan-500/30 p-7 space-y-5 shadow-2xl relative overflow-hidden card-3d-interactive">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Líderes de Clasificación — {selectedCategory}
                  </h3>
                  <button
                    onClick={() => setActiveTab('standings')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Ver Tabla Completa <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-white/50 border-b border-white/10 font-bold uppercase tracking-wider font-mono">
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
                          <td className="py-3.5 font-bold text-white flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: row.team.primary_color, color: row.team.primary_color }}></span>
                            <span>{row.team.name}</span>
                          </td>
                          <td className="py-3.5 text-center font-medium font-mono text-white/90">{row.played}</td>
                          <td className="py-3.5 text-center text-emerald-400 font-bold font-mono">{row.won}</td>
                          <td className="py-3.5 text-center font-medium font-mono text-white">{row.diff > 0 ? `+${row.diff}` : row.diff}</td>
                          <td className="py-3.5 text-right font-black text-cyan-400 text-base font-mono">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Live Match Widget & Fan Registration */}
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-[#160a0a] to-[#070303] p-7 rounded-3xl border border-red-500/30 space-y-4 shadow-2xl relative overflow-hidden card-3d-interactive">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-br"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Próximo Encuentro
                    </span>
                    <span className="text-[11px] text-white/50 font-mono">Cancha Principal</span>
                  </div>

                  <div className="bg-black/60 p-5 rounded-2xl border border-white/10 text-center space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-white truncate">{teams[0]?.name || 'Barcelona S.C.'}</span>
                      <span className="text-amber-400 font-black text-base font-mono bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">15:30</span>
                      <span className="text-white truncate">{teams[1]?.name || 'Liga de Quito'}</span>
                    </div>
                    <p className="text-xs text-white/50 font-normal">Vocalía asignada por mesa de control digital Deporverso.</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('matches')}
                    className="w-full py-3 bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 font-bold text-xs rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Ver Todo el Calendario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fan Action Card */}
                <div className="bg-gradient-to-br from-[#0c1825] via-[#07101a] to-[#04080e] p-7 rounded-3xl border border-cyan-500/40 space-y-3 shadow-2xl relative overflow-hidden card-3d-interactive cyber-sheen-effect">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-br"></div>
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
                    ¿Eres Hinchada de la Liga?
                  </h4>
                  <p className="text-xs text-white/60 font-normal leading-relaxed">
                    Regístrate como Fan Oficial para interactuar, votar por el jugador del partido y compartir resultados por WhatsApp.
                  </p>
                  <button
                    onClick={() => {
                      setFanModalAction('Registrarse como Hinchada Oficial');
                      setShowFanAuthModal(true);
                    }}
                    className="w-full py-3 bg-[#00d2b5] hover:bg-[#00bda3] text-black font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
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
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Tabla de Clasificación & Estadísticas — {selectedCategory}
                </h2>
                <p className="text-xs text-[#A0A0A0] font-normal mt-1">Criterios: Puntos &gt; Gol Diferencia &gt; Goles a Favor</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStandingsSubTab('table')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    standingsSubTab === 'table' ? 'bg-[#00d2b5] text-black font-extrabold shadow-md' : 'bg-white/5 text-[#A0A0A0] hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  Tabla General
                </button>
                <button
                  onClick={() => setStandingsSubTab('scorers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    standingsSubTab === 'scorers' ? 'bg-[#00d2b5] text-black font-extrabold shadow-md' : 'bg-white/5 text-[#A0A0A0] hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  Goleadores
                </button>
                <button
                  onClick={() => setStandingsSubTab('fairplay')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    standingsSubTab === 'fairplay' ? 'bg-[#00d2b5] text-black font-extrabold shadow-md' : 'bg-white/5 text-[#A0A0A0] hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  Fair Play
                </button>

                <button
                  onClick={handleShareStandings}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs cursor-pointer transition-all"
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
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-7 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  Carnets Coleccionables & Nómina Digital de Jugadores
                </h2>
                <p className="text-xs text-[#A0A0A0] font-normal mt-1">Tarjetas coleccionables con fotografía, atributos, C.I. y código QR de verificación.</p>
              </div>

              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-amber-500/30 self-start sm:self-auto">
                {players.length} Carnets Habilitados
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 py-4">
              {players.filter(p => p.full_name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => {
                const pTeam = teams.find(t => t.id === p.team_id);
                return (
                  <div key={p.id} className="flex flex-col items-center gap-3">
                    <TradingCardCarnet 
                      player={p}
                      team={pTeam}
                      tenant={tenant}
                      sport={sport}
                      size="md"
                    />
                    <button
                      onClick={() => setSelectedPlayerForQr(p)}
                      className="py-2 px-4 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Ver QR / Ampliar Carnet
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: BLOG & CRÓNICAS IA */}
        {activeTab === 'blog' && (
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                  Blog Deportivo & Crónicas IA (Gemini 1.5 Flash)
                </h2>
                <p className="text-xs text-[#A0A0A0] font-normal mt-1">Resúmenes periodísticos oficiales y artículos de la jornada redactados por la IA Periodística.</p>
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
                        <Sparkles className="w-3 h-3" /> Crónica Oficial Gemini 1.5 Flash
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

        {/* SECTION: REGLAMENTO */}
        {activeTab === 'rules' && (
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-7 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-amber-400" />
                Reglamento Oficial de Torneo
              </h2>
              <p className="text-xs text-[#A0A0A0] font-normal mt-1">Estructura de sanciones y reglas para {tenant.sport_code}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 space-y-2 shadow-md">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">Sistema Puntos</span>
                <p className="text-white/80 font-normal">Victoria: 3 Puntos</p>
                <p className="text-white/80 font-normal">Empate: 1 Punto</p>
                <p className="text-white/80 font-normal">Derrota: 0 Puntos</p>
              </div>

              <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 space-y-2 shadow-md">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">Multas Disciplinarias</span>
                <p className="text-white/80 font-normal">Tarjeta Amarilla: $1.00 USD</p>
                <p className="text-white/80 font-normal">Tarjeta Roja Directa: $5.00 USD</p>
                <p className="text-white/80 font-normal">Ausencia Vocalía: $20.00 USD</p>
              </div>

              <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 space-y-2 shadow-md">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">Acreditación</span>
                <p className="text-white/80 font-normal">Carnet QR Obligatorio</p>
                <p className="text-white/80 font-normal">Hasta 5 cambios por partido</p>
              </div>
            </div>
          </div>
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
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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
