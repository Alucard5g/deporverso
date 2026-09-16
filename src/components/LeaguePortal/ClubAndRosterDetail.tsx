import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Award, 
  QrCode, 
  Search, 
  ShieldCheck, 
  Trophy, 
  Activity, 
  Filter, 
  ArrowUpDown, 
  UserCheck, 
  Sparkles, 
  FileText, 
  Printer, 
  Share2, 
  Calendar, 
  MapPin, 
  Flame, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X,
  Zap,
  ArrowRightLeft
} from 'lucide-react';
import { Player, Team, Tenant, Sport, Match } from '../../types';
import { TradingCardCarnet } from './TradingCardCarnet';
import { getPlayerFullData, getTeamCompleteSummary, PlayerFullData } from '../../utils/playerStatsHelper';

interface ClubAndRosterDetailProps {
  tenant: Tenant;
  sport?: Sport;
  teams: Team[];
  players: Player[];
  matches: Match[];
  searchQuery?: string;
  onSharePlayer?: (playerName: string, teamName: string) => void;
  onRequestTransfer?: (player: Player) => void;
  onOpenTransfers?: () => void;
}

export const ClubAndRosterDetail: React.FC<ClubAndRosterDetailProps> = ({
  tenant,
  sport,
  teams,
  players,
  matches,
  searchQuery: externalSearchQuery = '',
  onSharePlayer,
  onRequestTransfer,
  onOpenTransfers
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'leaders'>('cards');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'ovr' | 'jersey' | 'name'>('goals');
  const [internalSearch, setInternalSearch] = useState<string>('');
  const [activePlayerDetail, setActivePlayerDetail] = useState<PlayerFullData | null>(null);
  const [printSuccessMsg, setPrintSuccessMsg] = useState<string>('');

  const activeSearch = (externalSearchQuery || internalSearch).toLowerCase().trim();

  // Active selected team or null for all
  const activeTeam = useMemo(() => {
    if (selectedTeamId === 'ALL') return null;
    return teams.find(t => t.id === selectedTeamId) || null;
  }, [selectedTeamId, teams]);

  // Summaries for all teams
  const teamSummaries = useMemo(() => {
    return teams.map(t => getTeamCompleteSummary(t, players, matches));
  }, [teams, players, matches]);

  // Active team summary
  const activeTeamSummary = useMemo(() => {
    if (!activeTeam) return null;
    return teamSummaries.find(s => s.team.id === activeTeam.id) || null;
  }, [activeTeam, teamSummaries]);

  // Enriched players with full statistics
  const enrichedPlayers = useMemo(() => {
    return players.map(p => {
      const pTeam = teams.find(t => t.id === p.team_id);
      return getPlayerFullData(p, pTeam, matches);
    });
  }, [players, teams, matches]);

  // Filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let list = enrichedPlayers;

    // Team filter
    if (selectedTeamId !== 'ALL') {
      list = list.filter(item => item.player.team_id === selectedTeamId);
    }

    // Position filter
    if (positionFilter !== 'ALL') {
      list = list.filter(item => {
        const pos = (item.player.position || '').toUpperCase();
        if (positionFilter === 'POR') return pos.includes('PORT') || pos.includes('ARQU') || item.player.jersey_number === 1;
        if (positionFilter === 'DEF') return pos.includes('DEF') || pos.includes('LAT') || pos.includes('CENT');
        if (positionFilter === 'MED') return pos.includes('MED') || pos.includes('VOL') || pos.includes('CREAT');
        if (positionFilter === 'DEL') return pos.includes('DEL') || pos.includes('EXTR') || pos.includes('PIV') || pos.includes('PÍV');
        return true;
      });
    }

    // Search query
    if (activeSearch) {
      list = list.filter(item => 
        item.player.full_name.toLowerCase().includes(activeSearch) ||
        item.general.cedula.toLowerCase().includes(activeSearch) ||
        (item.player.position || '').toLowerCase().includes(activeSearch) ||
        (item.team?.name || '').toLowerCase().includes(activeSearch) ||
        item.player.jersey_number?.toString() === activeSearch
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'goals') return b.stats.goals_total - a.stats.goals_total;
      if (sortBy === 'assists') return b.stats.assists_total - a.stats.assists_total;
      if (sortBy === 'ovr') return b.stats.rating_ovr - a.stats.rating_ovr;
      if (sortBy === 'jersey') return (a.player.jersey_number || 99) - (b.player.jersey_number || 99);
      if (sortBy === 'name') return a.player.full_name.localeCompare(b.player.full_name);
      return 0;
    });
  }, [enrichedPlayers, selectedTeamId, positionFilter, activeSearch, sortBy]);

  // Leaders for podio
  const topScorers = useMemo(() => {
    let pool = selectedTeamId === 'ALL' 
      ? enrichedPlayers 
      : enrichedPlayers.filter(p => p.player.team_id === selectedTeamId);
    return [...pool].sort((a, b) => b.stats.goals_total - a.stats.goals_total).slice(0, 5);
  }, [enrichedPlayers, selectedTeamId]);

  const topAssistants = useMemo(() => {
    let pool = selectedTeamId === 'ALL' 
      ? enrichedPlayers 
      : enrichedPlayers.filter(p => p.player.team_id === selectedTeamId);
    return [...pool].sort((a, b) => b.stats.assists_total - a.stats.assists_total).slice(0, 5);
  }, [enrichedPlayers, selectedTeamId]);

  const handlePrintCarnet = (playerName: string) => {
    setPrintSuccessMsg(`Carnet de ${playerName} listo para impresión/descarga en alta resolución.`);
    setTimeout(() => setPrintSuccessMsg(''), 4000);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {printSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#00d2b5] text-black px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{printSuccessMsg}</span>
        </div>
      )}

      {/* TOP HEADER: TÍTULO INSTITUCIONAL & BADGES */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Nómina y Carnetización QR Oficial
              </span>
              <span className="bg-white/5 text-slate-300 border border-white/10 text-[10px] font-medium px-2 py-0.5 rounded-full font-mono">
                {tenant.sport_code} • {sport?.name || 'Deporte Federado'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              Carnets Coleccionables & Información Detallada del Club
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-1 max-w-3xl">
              Consulta la ficha institucional de cada club, su nómina oficial de jugadores, estadísticas verificadas de goles y asistencias, expedientes técnicos y carnets digitales QR con validez arbitral.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenTransfers && (
              <button
                onClick={onOpenTransfers}
                className="bg-slate-950/70 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 rounded-2xl px-4 py-2 text-left cursor-pointer transition-all flex items-center gap-2.5 shadow-sm"
                title="Abrir módulo de Pases & Transferencias de Jugadores"
              >
                <ArrowRightLeft className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase font-medium">Libro de Pases</span>
                  <span className="text-xs font-bold text-white">Transferencias</span>
                </div>
              </button>
            )}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-2 text-left">
              <span className="text-[10px] text-slate-400 font-mono block uppercase font-medium">Carnets Habilitados</span>
              <span className="text-lg font-black text-cyan-400 font-mono leading-none">{players.length}</span>
            </div>
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-2 text-left">
              <span className="text-[10px] text-slate-400 font-mono block uppercase font-medium">Clubes Inscritos</span>
              <span className="text-lg font-black text-emerald-400 font-mono leading-none">{teams.length}</span>
            </div>
          </div>
        </div>

        {/* SELECTOR DE CLUBES (CLUB SWITCHER) */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Seleccionar Club / Plantilla:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {selectedTeamId === 'ALL' ? 'Mostrando todos los clubes' : `Club: ${activeTeam?.name}`}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedTeamId('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 border ${
                selectedTeamId === 'ALL'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 border-cyan-400/50 shadow-md font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Todos los Clubes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                selectedTeamId === 'ALL' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-white/10 text-white/70'
              }`}>
                {players.length}
              </span>
            </button>

            {teamSummaries.map((summary) => {
              const isSelected = selectedTeamId === summary.team.id;
              return (
                <button
                  key={summary.team.id}
                  onClick={() => setSelectedTeamId(summary.team.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 shrink-0 border ${
                    isSelected
                      ? 'bg-slate-800 text-white border-cyan-400/60 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm flex items-center justify-center text-[9px] font-black text-white"
                    style={{ backgroundColor: summary.team.primary_color }}
                  >
                    {summary.team.name[0]}
                  </div>
                  <span>{summary.team.name}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="text-emerald-400 font-medium" title="Goles del Club">⚽ {summary.totalGoals}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-cyan-300 font-medium">{summary.playersCount} jug.</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FICHA INSTITUCIONAL DEL CLUB SELECCIONADO */}
      {activeTeamSummary && (
        <div className="bg-gradient-to-r from-[#121218] via-[#0d0d12] to-[#0a0a0e] rounded-2xl border border-amber-500/30 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Club Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-2xl shrink-0 border-2 border-amber-400/50"
                style={{
                  background: `linear-gradient(135deg, ${activeTeamSummary.team.primary_color}, ${activeTeamSummary.team.secondary_color})`
                }}
              >
                {activeTeamSummary.team.name[0]}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {activeTeamSummary.team.name}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {activeTeamSummary.meta.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#A0A0A0]">
                  <span className="flex items-center gap-1 text-white/80">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {activeTeamSummary.meta.stadiumName}
                  </span>
                  <span>•</span>
                  <span>DT: <strong className="text-white">{activeTeamSummary.meta.coachName}</strong></span>
                  <span>•</span>
                  <span>Fundación: <strong className="text-white">{activeTeamSummary.meta.foundedYear}</strong></span>
                </div>
              </div>
            </div>

            {/* Club Competitive Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/50 block uppercase font-bold">Goles Plantel</span>
                <span className="text-xl font-black text-emerald-400">⚽ {activeTeamSummary.totalGoals}</span>
                <span className="text-[9px] text-white/40 block mt-0.5">Asist: {activeTeamSummary.totalAssists}</span>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/50 block uppercase font-bold">Puntos Liga</span>
                <span className="text-xl font-black text-cyan-400">{activeTeamSummary.standings.pts} PTS</span>
                <span className="text-[9px] text-white/40 block mt-0.5">PJ: {activeTeamSummary.standings.played} • PG: {activeTeamSummary.standings.won}</span>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/50 block uppercase font-bold">Diferencia Gol</span>
                <span className={`text-xl font-black ${activeTeamSummary.standings.diff >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {activeTeamSummary.standings.diff > 0 ? `+${activeTeamSummary.standings.diff}` : activeTeamSummary.standings.diff}
                </span>
                <span className="text-[9px] text-white/40 block mt-0.5">GF {activeTeamSummary.standings.gf} : GC {activeTeamSummary.standings.ga}</span>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/50 block uppercase font-bold">Plantilla</span>
                <span className="text-xl font-black text-white">{activeTeamSummary.playersCount} Jug.</span>
                <span className="text-[9px] text-white/40 block mt-0.5">Prom. edad: {activeTeamSummary.avgAge}a</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE FILTROS, BUSCADOR Y MODO DE VISTA */}
      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Buscador de Jugador */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por jugador, cédula, dorsal..."
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400/80 transition-colors font-medium"
          />
        </div>

        {/* Filtros de Posición y Ordenamiento */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Posición */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-[10px] text-slate-400 px-2 font-mono uppercase font-bold">Pos:</span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'POR', label: 'POR' },
              { id: 'DEF', label: 'DEF' },
              { id: 'MED', label: 'MED' },
              { id: 'DEL', label: 'DEL' }
            ].map(pos => (
              <button
                key={pos.id}
                onClick={() => setPositionFilter(pos.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  positionFilter === pos.id
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>

          {/* Ordenar Por */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="goals" className="bg-slate-900 text-white">Más Goles ⚽</option>
              <option value="assists" className="bg-slate-900 text-white">Más Asistencias 👟</option>
              <option value="ovr" className="bg-slate-900 text-white">Mayor OVR ⭐</option>
              <option value="jersey" className="bg-slate-900 text-white">Por Dorsal #</option>
              <option value="name" className="bg-slate-900 text-white">Nombre (A-Z)</option>
            </select>
          </div>

          {/* Selector de Modo de Vista */}
          <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Carnets Coleccionables 3D"
            >
              <QrCode className="w-3.5 h-3.5" /> Carnets 3D
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Ficha Técnica y Nómina Completa"
            >
              <FileText className="w-3.5 h-3.5" /> Ficha Técnica
            </button>
            <button
              onClick={() => setViewMode('leaders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'leaders'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Podio de Goleadores y Asistencias"
            >
              <Trophy className="w-3.5 h-3.5" /> Líderes
            </button>
          </div>
        </div>
      </div>

      {/* RESULTADOS DEL FILTRADO */}
      <div className="flex items-center justify-between text-xs text-[#A0A0A0] px-1 font-mono">
        <span>Mostrando {filteredPlayers.length} de {enrichedPlayers.length} jugadores habilitados</span>
        {activeSearch && <span>Filtro activo: "{activeSearch}"</span>}
      </div>

      {/* ===================== VISTA 1: CARNETS COLECCIONABLES 3D ===================== */}
      {viewMode === 'cards' && (
        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
          {filteredPlayers.length === 0 ? (
            <div className="w-full text-center py-12 text-[#A0A0A0]">
              <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="text-sm font-bold text-white">No se encontraron jugadores con los filtros seleccionados.</p>
              <p className="text-xs text-white/50 mt-1">Prueba cambiando el club o el criterio de búsqueda.</p>
            </div>
          ) : (
            filteredPlayers.map((item) => (
              <div key={item.player.id} className="flex flex-col items-center gap-2.5">
                <TradingCardCarnet 
                  player={item.player}
                  team={item.team}
                  tenant={tenant}
                  sport={sport}
                  size="md"
                  fullData={item}
                />
                <button
                  onClick={() => setActivePlayerDetail(item)}
                  className="py-2 px-4 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver Ficha Completa & QR
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===================== VISTA 2: FICHA TÉCNICA / TABLA COMPLETA ===================== */}
      {viewMode === 'table' && (
        <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#141414] text-white/60 border-b border-white/10 font-bold uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-3 px-4"># Dorsal</th>
                  <th className="py-3 px-4">Jugador / Cédula</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center">Posición</th>
                  <th className="py-3 px-4 text-center">Edad / Perfil</th>
                  <th className="py-3 px-4 text-center">PJ</th>
                  <th className="py-3 px-4 text-center text-emerald-400 font-black">Goles ⚽</th>
                  <th className="py-3 px-4 text-center text-cyan-400 font-black">Asist 👟</th>
                  <th className="py-3 px-4 text-center">Minutos</th>
                  <th className="py-3 px-4 text-center">🟨 / 🟥</th>
                  <th className="py-3 px-4 text-center text-amber-400">OVR ⭐</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal text-white/90">
                {filteredPlayers.map((item) => (
                  <tr 
                    key={item.player.id} 
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setActivePlayerDetail(item)}
                  >
                    {/* Dorsal */}
                    <td className="py-3 px-4 font-mono font-black text-amber-400 text-sm">
                      #{item.player.jersey_number || '10'}
                    </td>

                    {/* Jugador con foto miniatura */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.player.photo_url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100'} 
                          alt={item.player.full_name} 
                          className="w-9 h-9 rounded-xl object-cover border border-amber-400/40 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.player.full_name}</span>
                            {item.general.is_captain && (
                              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 rounded" title="Capitán">C</span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/50 font-mono">C.I: {item.general.cedula}</span>
                        </div>
                      </div>
                    </td>

                    {/* Club */}
                    <td className="py-3 px-4 font-bold text-white/90">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.team?.primary_color || '#f59e0b' }} 
                        />
                        <span className="truncate max-w-[140px]">{item.team?.name || 'Club'}</span>
                      </div>
                    </td>

                    {/* Posición */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-white/10 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase font-mono">
                        {item.player.position || 'Jugador'}
                      </span>
                    </td>

                    {/* Edad y Perfil */}
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-white/70">
                      {item.general.age} años • {item.general.dominant_foot[0]}
                    </td>

                    {/* PJ */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {item.stats.matches_played}
                    </td>

                    {/* Goles */}
                    <td className="py-3 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                      {item.stats.goals_total}
                    </td>

                    {/* Asistencias */}
                    <td className="py-3 px-4 text-center font-mono font-black text-cyan-400 text-sm">
                      {item.stats.assists_total}
                    </td>

                    {/* Minutos */}
                    <td className="py-3 px-4 text-center font-mono text-white/60">
                      {item.stats.minutes_played}'
                    </td>

                    {/* Tarjetas */}
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className="text-yellow-400 font-bold">{item.stats.yellow_cards}</span> / <span className="text-red-500 font-bold">{item.stats.red_cards}</span>
                    </td>

                    {/* OVR */}
                    <td className="py-3 px-4 text-center font-mono font-black text-amber-300 text-sm">
                      {item.stats.rating_ovr}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Habilitado
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlayerDetail(item);
                        }}
                        className="py-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-500/30 flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <QrCode className="w-3 h-3" /> Carnet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== VISTA 3: PODIO & LÍDERES ===================== */}
      {viewMode === 'leaders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goleadores del Club / Liga */}
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-400" />
                Máximos Goleadores {selectedTeamId === 'ALL' ? 'de la Liga' : 'del Club'}
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">⚽ Tabla de Goleo</span>
            </div>

            <div className="space-y-3">
              {topScorers.map((item, idx) => (
                <div 
                  key={item.player.id}
                  onClick={() => setActivePlayerDetail(item)}
                  className="bg-black/60 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/40 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm font-mono ${
                      idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      #{idx + 1}
                    </div>
                    <img 
                      src={item.player.photo_url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100'} 
                      alt={item.player.full_name} 
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{item.player.full_name}</h4>
                      <p className="text-[11px] text-white/50">{item.team?.name} • #{item.player.jersey_number}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-2xl font-black text-emerald-400 block leading-none">{item.stats.goals_total}</span>
                    <span className="text-[9px] text-white/50 uppercase font-bold">Goles</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Máximos Asistentes */}
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Líderes de Asistencias {selectedTeamId === 'ALL' ? 'de la Liga' : 'del Club'}
              </h3>
              <span className="text-xs text-cyan-400 font-mono font-bold">👟 Pases Gol</span>
            </div>

            <div className="space-y-3">
              {topAssistants.map((item, idx) => (
                <div 
                  key={item.player.id}
                  onClick={() => setActivePlayerDetail(item)}
                  className="bg-black/60 p-3.5 rounded-xl border border-white/5 hover:border-cyan-500/40 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm font-mono ${
                      idx === 0 ? 'bg-cyan-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      #{idx + 1}
                    </div>
                    <img 
                      src={item.player.photo_url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100'} 
                      alt={item.player.full_name} 
                      className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{item.player.full_name}</h4>
                      <p className="text-[11px] text-white/50">{item.team?.name} • #{item.player.jersey_number}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-2xl font-black text-cyan-400 block leading-none">{item.stats.assists_total}</span>
                    <span className="text-[9px] text-white/50 uppercase font-bold">Asistencias</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL DE EXPEDIENTE & CARNET QR DEL JUGADOR ===================== */}
      {activePlayerDetail && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#0b0b0f] border border-amber-500/50 rounded-3xl p-6 max-w-4xl w-full my-6 max-h-[92vh] overflow-y-auto shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ficha Técnica & Carnet Oficial Federado
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                  Habilitado para la Fecha
                </span>
              </div>
              <button
                onClick={() => setActivePlayerDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 2 Columns (Left: Interactive 3D Carnet, Right: Full Dossier) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Columna Izquierda: Carnet Coleccionable */}
              <div className="lg:col-span-5 flex flex-col items-center gap-3">
                <span className="text-[11px] text-amber-400 font-mono font-bold uppercase flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" /> Carnet Digital Oficial (Haz clic en QR Reverso)
                </span>
                <TradingCardCarnet 
                  player={activePlayerDetail.player}
                  team={activePlayerDetail.team}
                  tenant={tenant}
                  sport={sport}
                  size="lg"
                  fullData={activePlayerDetail}
                />
                <div className="flex flex-col gap-2 w-full max-w-xs mt-1">
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handlePrintCarnet(activePlayerDetail.player.full_name)}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" /> Imprimir Carnet
                    </button>
                    {onSharePlayer && (
                      <button
                        onClick={() => onSharePlayer(activePlayerDetail.player.full_name, activePlayerDetail.team?.name || 'Club')}
                        className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        title="Compartir Ficha"
                      >
                        <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    )}
                  </div>
                  {onRequestTransfer && (
                    <button
                      onClick={() => {
                        const targetPlayer = activePlayerDetail.player;
                        setActivePlayerDetail(null);
                        onRequestTransfer(targetPlayer);
                      }}
                      className="w-full py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                      title="Solicitar Pase / Transferencia a otro club"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Tramitar Solicitud de Pase</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Expediente Técnico, Goles, Asistencias e Información General */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Cabecera del Jugador */}
                <div className="bg-[#121218] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">
                      {activePlayerDetail.team?.name || 'Club Federado'}
                    </span>
                    <h3 className="text-xl font-black text-white">{activePlayerDetail.player.full_name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Dorsal #{activePlayerDetail.player.jersey_number} • {activePlayerDetail.player.position}
                    </p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-amber-300 to-yellow-600 text-black p-2 rounded-2xl shadow-lg min-w-[55px]">
                    <span className="text-2xl font-black font-mono block leading-none">{activePlayerDetail.stats.rating_ovr}</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider block">OVR</span>
                  </div>
                </div>

                {/* Bloque Estadístico: Goles y Asistencias en Detalle */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Activity className="w-3.5 h-3.5" /> Rendimiento en la Temporada:
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                    {/* Goles */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Goles Totales</span>
                      <span className="text-2xl font-black text-emerald-300">⚽ {activePlayerDetail.stats.goals_total}</span>
                      <span className="text-[9px] text-white/50 block mt-1">
                        {activePlayerDetail.stats.goals_open_play} jugada • {activePlayerDetail.stats.goals_penalty} pen
                      </span>
                    </div>

                    {/* Asistencias */}
                    <div className="bg-cyan-950/30 border border-cyan-500/30 p-3 rounded-xl">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">Asistencias</span>
                      <span className="text-2xl font-black text-cyan-300">👟 {activePlayerDetail.stats.assists_total}</span>
                      <span className="text-[9px] text-white/50 block mt-1">
                        {activePlayerDetail.stats.key_passes} pases clave
                      </span>
                    </div>

                    {/* Partidos */}
                    <div className="bg-black/60 border border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] text-white/50 font-bold uppercase block">Partidos (PJ)</span>
                      <span className="text-2xl font-black text-white font-mono">{activePlayerDetail.stats.matches_played}</span>
                      <span className="text-[9px] text-white/50 block mt-1">
                        {activePlayerDetail.stats.matches_starter} titular
                      </span>
                    </div>

                    {/* Minutos */}
                    <div className="bg-black/60 border border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] text-white/50 font-bold uppercase block">Minutos</span>
                      <span className="text-2xl font-black text-amber-400 font-mono">{activePlayerDetail.stats.minutes_played}'</span>
                      <span className="text-[9px] text-white/50 block mt-1">
                        {Math.round(activePlayerDetail.stats.minutes_played / (activePlayerDetail.stats.matches_played || 1))}' / pj
                      </span>
                    </div>
                  </div>
                </div>

                {/* Atributos Físicos & Disciplina */}
                <div className="bg-[#121218] p-4 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-white/80 uppercase tracking-wider flex items-center justify-between font-mono">
                    <span>Atributos Deportivos OVR:</span>
                    <span className="text-amber-400">Fair Play: 🟨 {activePlayerDetail.stats.yellow_cards} | 🟥 {activePlayerDetail.stats.red_cards}</span>
                  </h4>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.pace}</span>
                      <span className="text-[9px] text-white/50 block">RITMO</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.shooting}</span>
                      <span className="text-[9px] text-white/50 block">TIRO</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.passing}</span>
                      <span className="text-[9px] text-white/50 block">PASE</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.dribbling}</span>
                      <span className="text-[9px] text-white/50 block">REGATE</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.defense}</span>
                      <span className="text-[9px] text-white/50 block">DEFENSA</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-amber-400 block">{activePlayerDetail.stats.physical}</span>
                      <span className="text-[9px] text-white/50 block">FÍSICO</span>
                    </div>
                  </div>
                </div>

                {/* Información General del Jugador (Ficha Federativa y Médica) */}
                <div className="bg-[#121218] p-4 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-white/80 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Información General & Estado Federativo:
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Cédula Oficial (C.I.):</span>
                      <span className="font-bold text-white font-mono">{activePlayerDetail.general.cedula}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Edad / Nacimiento:</span>
                      <span className="font-bold text-white">{activePlayerDetail.general.age} años ({activePlayerDetail.general.birth_date})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Estatura / Peso:</span>
                      <span className="font-bold text-white">{activePlayerDetail.general.height_cm} cm • {activePlayerDetail.general.weight_kg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Pierna Hábil:</span>
                      <span className="font-bold text-white">{activePlayerDetail.general.dominant_foot}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Nacionalidad:</span>
                      <span className="font-bold text-white">{activePlayerDetail.general.nationality}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Ficha Médica:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> APROBADA 2026
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-white/40 block font-mono">Seguro Deportivo:</span>
                      <span className="font-bold text-cyan-300 font-mono">{activePlayerDetail.general.insurance_policy}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">Rol en el Club:</span>
                      <span className="font-bold text-amber-300">{activePlayerDetail.general.role_description}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Cierre */}
                <button
                  onClick={() => setActivePlayerDetail(null)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer transition-all border border-white/10"
                >
                  Cerrar Ficha
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
