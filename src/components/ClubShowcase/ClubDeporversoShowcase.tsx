import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Shield,
  Users,
  Calendar,
  MapPin,
  Flame,
  QrCode,
  Sparkles,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Share2,
  X,
  Camera,
  SlidersHorizontal
} from 'lucide-react';
import {
  DEPORVERSO_CLUB_DATA,
  DEPORVERSO_FUTBOL_PLAYERS,
  DEPORVERSO_BASKET_PLAYERS,
  DEPORVERSO_MATCHES,
  DeporversoPlayer
} from '../../data/deporversoClubData';
import { CINEMATIC_ASSETS, getAthletePortrait } from '../../data/cinematicAssets';

interface ClubDeporversoShowcaseProps {
  onUnlockFullPortal?: () => void;
  onOpenCheckout?: () => void;
  isUnlocked?: boolean;
  userEmail?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenStepTour?: (stepIndex?: number) => void;
}

type HeroSceneMode = 'PORTADA' | 'TUNEL' | 'ESTADIO';

export const ClubDeporversoShowcase: React.FC<ClubDeporversoShowcaseProps> = ({
  onUnlockFullPortal,
  onOpenCheckout,
  isUnlocked = false,
  userEmail = '',
  onNavigateTab
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<'FUTBOL' | 'BALONCESTO'>('FUTBOL');
  const [selectedPlayer, setSelectedPlayer] = useState<DeporversoPlayer | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [matchStatusFilter, setMatchStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'FINISHED'>('ALL');
  const [heroScene, setHeroScene] = useState<HeroSceneMode>('TUNEL');
  const [showCompareLeader, setShowCompareLeader] = useState<boolean>(true);
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<string | null>(null);

  const club = DEPORVERSO_CLUB_DATA;

  const disciplinePlayers = useMemo(
    () => (activeDiscipline === 'FUTBOL' ? DEPORVERSO_FUTBOL_PLAYERS : DEPORVERSO_BASKET_PLAYERS),
    [activeDiscipline]
  );

  const positionOptions = useMemo(() => {
    if (activeDiscipline === 'FUTBOL') {
      return [
        { id: 'ALL', label: 'Todos' },
        { id: 'POR', label: 'Portero' },
        { id: 'DEF', label: 'Defensa' },
        { id: 'MED', label: 'Medio' },
        { id: 'DEL', label: 'Delantero' }
      ];
    }
    return [
      { id: 'ALL', label: 'Todos' },
      { id: 'BASE', label: 'Base' },
      { id: 'ESCOLTA', label: 'Escolta' },
      { id: 'ALERO', label: 'Alero' },
      { id: 'ALA_PIVOT', label: 'Ala-Pívot' },
      { id: 'PIVOT', label: 'Pívot' }
    ];
  }, [activeDiscipline]);

  const currentPlayers = useMemo(() => {
    return disciplinePlayers.filter((player) => {
      const q = searchFilter.trim().toLowerCase();
      const matchSearch =
        !q ||
        player.name.toLowerCase().includes(q) ||
        player.position.toLowerCase().includes(q) ||
        player.nickname.toLowerCase().includes(q) ||
        String(player.dorsal).includes(q);
      const matchPos = positionFilter === 'ALL' || player.positionCategory === positionFilter;
      return matchSearch && matchPos;
    });
  }, [disciplinePlayers, searchFilter, positionFilter]);

  const currentMatches = useMemo(() => {
    return DEPORVERSO_MATCHES.filter((m) => {
      if (m.discipline !== activeDiscipline) return false;
      if (matchStatusFilter !== 'ALL' && m.status !== matchStatusFilter) return false;
      return true;
    });
  }, [activeDiscipline, matchStatusFilter]);

  const activeCard = selectedPlayer && selectedPlayer.discipline === activeDiscipline
    ? selectedPlayer
    : currentPlayers[0] || disciplinePlayers[0];

  const teamCaptain = useMemo(
    () => disciplinePlayers.find((p) => p.status === 'CAPITÁN') || disciplinePlayers[0],
    [disciplinePlayers]
  );

  const heroImageUrl =
    heroScene === 'TUNEL'
      ? CINEMATIC_ASSETS.clubTunnel
      : heroScene === 'ESTADIO'
      ? CINEMATIC_ASSETS.stadiumBroadcast
      : club.portadaUrl;

  const handleShareCarnet = (player: DeporversoPlayer) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Carnet Oficial ${club.shortName} · ${player.name} (#${player.dorsal}) · ${window.location.href}`
      );
      setShowShareToast(`Enlace de carnet copiado: ${player.name} (#${player.dorsal})`);
      setTimeout(() => setShowShareToast(null), 3000);
    }
  };

  // SVG 6-axis radar helper for Futbol / Basket spotlight
  const radarMetrics = useMemo(() => {
    if (!activeCard) return [];
    if (activeCard.discipline === 'FUTBOL' && activeCard.futbolStats) {
      const cap = teamCaptain?.futbolStats;
      return [
        { label: 'RIT', value: activeCard.futbolStats.ritmo, cap: cap?.ritmo ?? 82 },
        { label: 'TIR', value: activeCard.futbolStats.tiro, cap: cap?.tiro ?? 80 },
        { label: 'PAS', value: activeCard.futbolStats.pase, cap: cap?.pase ?? 85 },
        { label: 'REG', value: activeCard.futbolStats.regif, cap: cap?.regif ?? 84 },
        { label: 'DEF', value: activeCard.futbolStats.defensa, cap: cap?.defensa ?? 68 },
        { label: 'FÍS', value: activeCard.futbolStats.fisico, cap: cap?.fisico ?? 80 }
      ];
    }
    if (activeCard.basketStats) {
      const b = activeCard.basketStats;
      const cap = teamCaptain?.basketStats;
      return [
        { label: 'PTS', value: Math.min(99, Math.round(b.ppg * 4)), cap: Math.min(99, Math.round((cap?.ppg ?? 18) * 4)) },
        { label: 'REB', value: Math.min(99, Math.round(b.rpg * 8.5)), cap: Math.min(99, Math.round((cap?.rpg ?? 7) * 8.5)) },
        { label: 'AST', value: Math.min(99, Math.round(b.apg * 11)), cap: Math.min(99, Math.round((cap?.apg ?? 6) * 11)) },
        { label: '%FG', value: Math.min(99, Math.round(b.fgPct * 1.4)), cap: Math.min(99, Math.round((cap?.fgPct ?? 50) * 1.4)) },
        { label: '%3P', value: Math.min(99, Math.round(b.threePct * 2)), cap: Math.min(99, Math.round((cap?.threePct ?? 38) * 2)) },
        { label: '%TL', value: Math.min(99, Math.round(b.ftPct)), cap: Math.min(99, Math.round(cap?.ftPct ?? 82)) }
      ];
    }
    return [];
  }, [activeCard, teamCaptain]);

  const buildPolygonPoints = (values: number[], cx = 90, cy = 85, r = 62) =>
    values
      .map((v, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const dist = (Math.max(20, Math.min(100, v)) / 100) * r;
        return `${(cx + Math.cos(angle) * dist).toFixed(1)},${(cy + Math.sin(angle) * dist).toFixed(1)}`;
      })
      .join(' ');

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black">
      {/* BARRA SUPERIOR DE MODO DEMO OFICIAL */}
      <section className="w-full border-b border-white/[0.08] bg-[#070c1a]/95 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                <span className="font-bold">Demo Oficial del Club</span>
                <span className="text-white/25">·</span>
                <span className="text-white font-semibold truncate">{club.name}</span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {userEmail ? `${userEmail} · ` : ''}
                Plantilla interactiva, radar de rendimiento y carnet digital CIG 2026.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => (onNavigateTab ? onNavigateTab('league') : null)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Liga Pichincha</span>
            </button>

            {!isUnlocked ? (
              <button
                onClick={onOpenCheckout || onUnlockFullPortal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>Suscribirse 50% OFF</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-bold whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Portal Completo Activo
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* HERO PORTADA CINEMATOGRÁFICA */}
        <div className="cine-stage-frame bg-[#03060f]">
          <div className="relative h-72 sm:h-88 md:h-[420px] w-full overflow-hidden">
            <img
              src={heroImageUrl}
              alt="Escenario Club Deportivo Deporverso"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-700"
            />
            <div className="cine-scrim-hero" />
            <div className="cine-vignette" />

            {/* Metadata sin ruido visual + Switcher de Escenario */}
            <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-cyan-300 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Club Insignia CIG {new Date().getFullYear()}</span>
                <span className="text-white/30">·</span>
                <span className="text-slate-200">Fundado {club.foundedYear}</span>
                <span className="hidden sm:inline text-white/30">·</span>
                <span className="hidden sm:inline text-slate-300">{club.city}, {club.country}</span>
              </div>

              <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/15">
                <Camera className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5 hidden sm:block" />
                {(
                  [
                    { id: 'TUNEL', label: 'Túnel' },
                    { id: 'ESTADIO', label: 'Estadio' },
                    { id: 'PORTADA', label: 'Oficial' }
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setHeroScene(mode.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      heroScene === mode.id
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bloque Inferior Superpuesto al Hero */}
            <div className="absolute bottom-5 inset-x-4 sm:bottom-7 sm:inset-x-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#040914] border-2 border-cyan-400/75 shadow-[0_12px_35px_rgba(0,0,0,0.75)] overflow-hidden p-1">
                    <img
                      src={club.logoUrl}
                      alt="Escudo Club Deportivo Deporverso"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-cyan-300">
                    {club.acronym} · {club.motto}
                  </p>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    {club.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {club.stadiumFutbol.split('(')[0].trim()}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {club.membershipCount.toLocaleString()} Socios Activos
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-emerald-300 font-mono text-xs">
                      Licencia {club.cigLicenseId}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowTrophyModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-black/65 hover:bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Vitrina de Trofeos ({club.trophies.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTOR DE DISCIPLINA + MÉTRICAS TABULARES */}
        <div className="mt-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Disciplinas Oficiales del Club
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveDiscipline('FUTBOL');
                  setPositionFilter('ALL');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeDiscipline === 'FUTBOL'
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
                }`}
              >
                <Flame className={`w-4 h-4 ${activeDiscipline === 'FUTBOL' ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>Fútbol 11 & Fútsal</span>
                <span className={`text-[10px] font-mono font-bold ${activeDiscipline === 'FUTBOL' ? 'text-slate-900' : 'text-cyan-300'}`}>
                  · 1° Lugar
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDiscipline('BALONCESTO');
                  setPositionFilter('ALL');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeDiscipline === 'BALONCESTO'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeDiscipline === 'BALONCESTO' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Baloncesto Oficial</span>
                <span className={`text-[10px] font-mono font-bold ${activeDiscipline === 'BALONCESTO' ? 'text-slate-900' : 'text-amber-300'}`}>
                  · Serie Oro
                </span>
              </button>
            </div>
          </div>

          {/* Métricas de rendimiento tabular-nums */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
            {activeDiscipline === 'FUTBOL' ? (
              <>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Partidos</span>
                  <span className="text-lg font-black text-white">{club.statsFutbol.pj} PJ</span>
                </div>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-cyan-400 uppercase">Invicto</span>
                  <span className="text-lg font-black text-cyan-300">
                    {club.statsFutbol.pg}G · {club.statsFutbol.pe}E
                  </span>
                </div>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Balance Goles</span>
                  <span className="text-lg font-black text-white">
                    {club.statsFutbol.gf} : {club.statsFutbol.gc}
                  </span>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-cyan-300 uppercase">Puntuación</span>
                  <span className="text-lg font-black text-cyan-300">{club.statsFutbol.pts} PTS</span>
                </div>
              </>
            ) : (
              <>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Partidos</span>
                  <span className="text-lg font-black text-white">{club.statsBasket.pj} PJ</span>
                </div>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-amber-400 uppercase">Récord V-D</span>
                  <span className="text-lg font-black text-amber-300">
                    {club.statsBasket.pg} - {club.statsBasket.pp}
                  </span>
                </div>
                <div className="cine-surface px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Promedio</span>
                  <span className="text-lg font-black text-white">{club.statsBasket.avgPoints} PPG</span>
                </div>
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-4 py-2.5 text-left">
                  <span className="block text-[10px] font-mono text-amber-300 uppercase">Diferencial</span>
                  <span className="text-lg font-black text-amber-300">+{club.statsBasket.diff}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: PLANTILLA + SPOTLIGHT RADAR + FIXTURE */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUMNA IZQUIERDA: PLANTILLA */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Plantilla Oficial · {activeDiscipline === 'FUTBOL' ? 'Fútbol' : 'Baloncesto'}
                  <span className="ml-2 text-xs font-mono font-normal text-slate-400 tabular-nums">
                    ({currentPlayers.length} deportistas)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona cualquier deportista para inspeccionar su carnet QR y radar biométrico.
                </p>
              </div>

              <input
                type="text"
                placeholder="Buscar jugador, apodo o dorsal..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none w-full sm:w-56"
              />
            </div>

            {/* Filtros por Posición */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
              {positionOptions.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPositionFilter(pos.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    positionFilter === pos.id
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            {/* Grid de Jugadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentPlayers.map((player) => {
                const isSelected = activeCard?.id === player.id;
                return (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 border ${
                      isSelected
                        ? 'border-cyan-400 ring-1 ring-cyan-400/40 bg-[#0b1529] shadow-[0_12px_36px_rgba(0,229,255,0.18)]'
                        : 'border-white/10 hover:border-cyan-400/50 bg-[#080e1c]'
                    }`}
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                      <img
                        src={player.photoUrl || getAthletePortrait(player.id)}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = getAthletePortrait(player.id);
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="cine-scrim-card" />

                      <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-11 h-12 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400/50 tabular-nums">
                        <span className="text-base font-black text-cyan-300 font-mono leading-none">
                          {player.ovr}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                          OVR
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 tabular-nums">
                        <span className="bg-black/75 backdrop-blur-md text-white border border-white/15 font-mono text-xs font-black px-2 py-0.5 rounded-lg">
                          #{player.dorsal}
                        </span>
                        {player.status === 'CAPITÁN' && (
                          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg font-mono">
                            CAP
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
                        <span className="truncate font-semibold">
                          {player.positionCategory} · {player.position.split('/')[0]}
                        </span>
                        <span className="text-cyan-300 font-bold shrink-0">CIG OK</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 tabular-nums">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-cyan-400 font-semibold uppercase truncate">
                            {player.nickname ? `"${player.nickname}"` : player.nationality}
                          </span>
                          <span className="text-slate-300 font-bold shrink-0">{player.marketValue}</span>
                        </div>
                        <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors truncate mt-0.5">
                          {player.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">
                          {player.age} años · {player.height} · {player.footOrHand}
                        </p>
                      </div>

                      {activeDiscipline === 'FUTBOL' && player.futbolStats ? (
                        <div className="pt-2.5 border-t border-white/10 space-y-2 text-xs font-mono">
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">RIT</span>
                              <span className="font-bold text-white">{player.futbolStats.ritmo}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">TIR</span>
                              <span className="font-bold text-cyan-300">{player.futbolStats.tiro}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">PAS</span>
                              <span className="font-bold text-amber-300">{player.futbolStats.pase}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">FÍS</span>
                              <span className="font-bold text-emerald-400">{player.futbolStats.fisico}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                            <span>
                              Goles: <strong className="text-white">{player.futbolStats.goles}</strong>
                            </span>
                            <span>
                              Rating: <strong className="text-amber-400">{player.futbolStats.rating} ★</strong>
                            </span>
                          </div>
                        </div>
                      ) : player.basketStats ? (
                        <div className="pt-2.5 border-t border-white/10 space-y-2 text-xs font-mono">
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">PTS</span>
                              <span className="font-bold text-white">{player.basketStats.ppg}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">REB</span>
                              <span className="font-bold text-amber-300">{player.basketStats.rpg}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">AST</span>
                              <span className="font-bold text-cyan-300">{player.basketStats.apg}</span>
                            </div>
                            <div className="bg-black/45 rounded-lg p-1.5 border border-white/5">
                              <span className="text-[9px] text-slate-400 block">%3P</span>
                              <span className="font-bold text-emerald-400">{player.basketStats.threePct}%</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                            <span>
                              Campo: <strong className="text-white">{player.basketStats.fgPct}% FG</strong>
                            </span>
                            <span>
                              Rating: <strong className="text-amber-400">{player.basketStats.rating} ★</strong>
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                        <span className="flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" /> Inspeccionar Carnet
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner Comercial de Conversión del Club */}
            <div className="cine-stage-frame bg-[#081020] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Digitalización Integral de Clubes
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  Activa esta infraestructura oficial para tu club o torneo
                </h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Vocalía Digital QR, Sistema VAR, Cronista IA y Carnets Verificados CIG desde $35/club mayores o $25 formativas (50% OFF lanzamiento).
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenCheckout || onUnlockFullPortal}
                className="px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-cyan-400/20 shrink-0 cursor-pointer transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Activar Portal Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: SPOTLIGHT CARNET + RADAR SVG + FIXTURE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 space-y-6">
              {activeCard && (
                <div className="cine-surface p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Carnet Digital Oficial
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      VERIFICADO CIG
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-[#081020] border border-cyan-400/35 p-4 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span className="text-cyan-300 font-bold">{club.shortName}</span>
                      <span className="text-slate-400">DORSAL #{activeCard.dorsal}</span>
                    </div>

                    <div className="relative w-full h-60 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                      <img
                        src={activeCard.photoUrl || getAthletePortrait(activeCard.id)}
                        alt={activeCard.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = getAthletePortrait(activeCard.id);
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="cine-scrim-card" />

                      <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-cyan-300 font-mono text-xs font-black border border-cyan-400/50 flex items-center gap-1 tabular-nums">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{activeCard.ovr} OVR</span>
                      </div>
                      <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] font-mono text-white">
                        <span className="font-bold">{activeCard.status}</span>
                        <span className="text-cyan-300">{activeCard.positionCategory}</span>
                      </div>
                    </div>

                    <div className="space-y-1 tabular-nums">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-400 font-bold uppercase">
                          {activeCard.nickname ? `"${activeCard.nickname}"` : activeCard.nationality}
                        </span>
                        <span className="text-amber-300 font-bold">{activeCard.marketValue}</span>
                      </div>
                      <h4 className="text-lg font-black text-white tracking-tight">{activeCard.name}</h4>
                      <p className="text-xs text-slate-300">{activeCard.position}</p>
                    </div>

                    {/* SVG 6-AXIS RADAR & COMPARATIVA CON CAPITÁN */}
                    {radarMetrics.length === 6 && (
                      <div className="bg-black/45 rounded-xl border border-white/10 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                            Radar de Rendimiento
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCompareLeader(!showCompareLeader)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                              showCompareLeader
                                ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                                : 'bg-white/5 text-slate-400 border-white/10'
                            }`}
                          >
                            {showCompareLeader ? `vs ${teamCaptain.name.split(' ')[0]} ✓` : '+ Comparar Capitán'}
                          </button>
                        </div>

                        <div className="flex items-center justify-center">
                          <svg viewBox="0 0 180 170" className="w-44 h-40">
                            {[0.33, 0.66, 1].map((scale) => (
                              <polygon
                                key={scale}
                                points={buildPolygonPoints(radarMetrics.map(() => Math.round(100 * scale)))}
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                              />
                            ))}
                            {showCompareLeader && teamCaptain.id !== activeCard.id && (
                              <polygon
                                points={buildPolygonPoints(radarMetrics.map((m) => m.cap))}
                                fill="rgba(245, 158, 11, 0.14)"
                                stroke="#f59e0b"
                                strokeWidth="1.5"
                                strokeDasharray="3 2"
                              />
                            )}
                            <polygon
                              points={buildPolygonPoints(radarMetrics.map((m) => m.value))}
                              fill="rgba(34, 211, 238, 0.25)"
                              stroke="#22d3ee"
                              strokeWidth="2"
                            />
                            {radarMetrics.map((m, i) => {
                              const angle = (Math.PI * 2 * i) / radarMetrics.length - Math.PI / 2;
                              const lx = 90 + Math.cos(angle) * 75;
                              const ly = 85 + Math.sin(angle) * 75;
                              return (
                                <text
                                  key={m.label}
                                  x={lx}
                                  y={ly + 3}
                                  textAnchor="middle"
                                  className="fill-slate-300 text-[9px] font-mono font-bold"
                                >
                                  {m.label}
                                </text>
                              );
                            })}
                          </svg>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                      {activeCard.bio}
                    </p>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase">
                          Token Criptográfico CIG
                        </span>
                        <span className="text-[11px] font-mono font-bold text-cyan-300 truncate block">
                          {activeCard.qrCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleShareCarnet(activeCard)}
                        className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer shrink-0"
                        title="Copiar enlace de carnet"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showShareToast && (
                    <div className="p-2.5 text-center text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-xl">
                      {showShareToast}
                    </div>
                  )}
                </div>
              )}

              {/* FIXTURE OFICIAL DEL CLUB CON FILTRO */}
              <div className="cine-surface p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Fixture {activeDiscipline === 'FUTBOL' ? 'Fútbol' : 'Baloncesto'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    {(['ALL', 'SCHEDULED', 'FINISHED'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setMatchStatusFilter(st)}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          matchStatusFilter === st
                            ? 'bg-cyan-400/20 text-cyan-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st === 'ALL' ? 'Todos' : st === 'SCHEDULED' ? 'Próx.' : 'Fin.'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 tabular-nums">
                  {currentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2 hover:border-cyan-400/35 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate">{match.competition}</span>
                        <span
                          className={`font-bold shrink-0 ${
                            match.status === 'SCHEDULED' ? 'text-cyan-300' : 'text-emerald-300'
                          }`}
                        >
                          {match.status === 'SCHEDULED' ? 'PRÓXIMO' : 'FINALIZADO'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-black text-cyan-300 shrink-0">{club.shortName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">vs</span>
                          <span className="text-xs font-bold text-white truncate">{match.opponent}</span>
                        </div>

                        {match.status === 'FINISHED' ? (
                          <div className="text-xs font-black font-mono text-emerald-400 shrink-0">
                            {match.scoreDeporverso} - {match.scoreOpponent}
                          </div>
                        ) : (
                          <div className="text-xs font-bold font-mono text-amber-300 shrink-0">
                            {match.time}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-white/5">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          {match.venue}
                        </span>
                        <span className="font-mono text-slate-300 shrink-0">{match.date}</span>
                      </div>

                      {match.highlights && (
                        <p className="text-[11px] text-slate-400 italic bg-black/35 p-2 rounded-lg">
                          {match.highlights}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL VITRINA DE TROFEOS */}
      {showTrophyModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTrophyModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#090e1c] border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={CINEMATIC_ASSETS.goalMoment}
                alt="Palmarés Oficial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="cine-scrim-hero" />
              <div className="absolute inset-x-6 bottom-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-black text-white">Vitrina de Trofeos Oficial</h3>
                    <p className="text-[11px] text-slate-300">{club.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTrophyModal(false)}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3 max-h-80 overflow-y-auto tabular-nums">
              {club.trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Star className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{trophy.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {trophy.category} · {trophy.discipline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-300 shrink-0">
                    {trophy.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => setShowTrophyModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Cerrar Vitrina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

