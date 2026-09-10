import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, Shield, Award, UserCheck, CheckCircle2, 
  Share2, FileText, Search, Filter, Eye, Download, Flame, 
  AlertTriangle, Radio, Activity, ChevronRight, Check, ExternalLink,
  ChevronDown, Layers, Sparkles, Trophy, Users
} from 'lucide-react';
import { Match, Tenant, Sport, Team, Player } from '../../types';
import { SPORT_VISUAL_THEMES, SportVisualTheme } from '../../data/sportThemesData';

interface LeagueFixtureTableProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  onSelectMatchDetail?: (match: Match) => void;
  onShareMatch?: (matchTitle: string) => void;
}

export const LeagueFixtureTable: React.FC<LeagueFixtureTableProps> = ({
  tenant,
  sport,
  matches,
  teams,
  players,
  onSelectMatchDetail,
  onShareMatch
}) => {
  const sportCode = (tenant.sport_code || sport?.code || 'FUTBOL') as keyof typeof SPORT_VISUAL_THEMES;
  const theme: SportVisualTheme = SPORT_VISUAL_THEMES[sportCode] || SPORT_VISUAL_THEMES.FUTBOL;

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'LIVE' | 'SCHEDULED' | 'FINISHED'>('TODOS');
  const [roundFilter, setRoundFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derive all unique rounds / jornadas
  const availableRounds = useMemo(() => {
    const roundsSet = new Set<string>();
    matches.forEach(m => {
      if (m.match_data?.round) {
        roundsSet.add(m.match_data.round);
      }
    });
    return Array.from(roundsSet);
  }, [matches]);

  // Derive all categories
  const availableCategories = useMemo(() => {
    const cats = ['Primera Senior', 'Segunda Categoría', 'Máster 40', 'Femenino Honor'];
    if (sportCode === 'BALONCESTO') {
      return ['Primera División Basket', 'Serie de Honor', 'Juvenil U-19', 'Femenino Pro'];
    }
    if (sportCode === 'ECUAVOLEY') {
      return ['Abierta Selección Ecuavoley', 'Clásico Interprovincial', 'Máster de Oro', 'Barrial Libre'];
    }
    if (sportCode === 'PADEL') {
      return ['Open Primera Parejas', 'Segunda Categoría', 'Tercera / Cuarta', 'Mixto Pro'];
    }
    if (sportCode === 'FUTSAL') {
      return ['Serie Libre Fútsal', 'Copa Nocturna', 'Máster Parroquial'];
    }
    return cats;
  }, [sportCode]);

  // Helper to get Category Name
  const getCategoryName = (match: Match) => {
    if (match.category_id) {
      if (match.category_id === 'cat-1') return 'Primera Senior (Máxima A)';
      if (match.category_id === 'cat-2') return 'Femenino Honor';
      if (match.category_id === 'cat-3') return 'Primera División Basket';
      if (match.category_id === 'cat-4') return 'Abierta Selección Ecuavoley';
      if (match.category_id === 'cat-pad1') return 'Open Primera Parejas';
      if (match.category_id === 'cat-fut1') return 'Serie Libre Fútsal';
    }
    if (sportCode === 'BALONCESTO') return 'Primera División Basket';
    if (sportCode === 'ECUAVOLEY') return 'Abierta Selección Ecuavoley';
    if (sportCode === 'PADEL') return 'Open Primera Parejas';
    if (sportCode === 'FUTSAL') return 'Serie Libre Fútsal';
    return 'Primera Senior';
  };

  // Helper to get Vocal de Mesa Name
  const getVocalName = (match: Match) => {
    return (
      match.match_data?.vocal_report?.vocal_name ||
      match.match_data?.vocal_name ||
      'Oficial de Mesa Designado'
    );
  };

  // Helper to get Referee Name
  const getRefereeName = (match: Match) => {
    return (
      match.match_data?.referee_report?.main_referee ||
      match.match_data?.referee_name ||
      'Colegio Oficial de Árbitros'
    );
  };

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const homeTeam = m.home_team || teams.find(t => t.id === m.home_team_id);
      const awayTeam = m.away_team || teams.find(t => t.id === m.away_team_id);
      const hName = homeTeam?.name || '';
      const aName = awayTeam?.name || '';
      const vName = getVocalName(m);
      const catName = getCategoryName(m);
      const venue = m.field_location || m.match_data?.venue_name || '';

      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm ||
        hName.toLowerCase().includes(query) ||
        aName.toLowerCase().includes(query) ||
        vName.toLowerCase().includes(query) ||
        catName.toLowerCase().includes(query) ||
        venue.toLowerCase().includes(query);

      const matchesStatus = 
        statusFilter === 'TODOS' ||
        (statusFilter === 'LIVE' && m.status === 'IN_PROGRESS') ||
        (statusFilter === 'SCHEDULED' && m.status === 'SCHEDULED') ||
        (statusFilter === 'FINISHED' && m.status === 'FINISHED');

      const matchesCategory = 
        selectedCategory === 'TODAS' ||
        catName.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesRound = 
        roundFilter === 'TODAS' ||
        m.match_data?.round === roundFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesRound;
    });
  }, [matches, teams, searchTerm, statusFilter, selectedCategory, roundFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = matches.length;
    const live = matches.filter(m => m.status === 'IN_PROGRESS').length;
    const finished = matches.filter(m => m.status === 'FINISHED').length;
    const scheduled = matches.filter(m => m.status === 'SCHEDULED').length;
    const assignedVocals = matches.filter(m => !!(m.match_data?.vocal_name || m.match_data?.vocal_report)).length;
    return { total, live, finished, scheduled, assignedVocals };
  }, [matches]);

  // Handle Export to iCalendar (.ics)
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Deporverso//Fixture Oficial//ES\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
    filteredMatches.forEach(m => {
      const hName = m.home_team?.name || teams.find(t => t.id === m.home_team_id)?.name || 'Local';
      const aName = m.away_team?.name || teams.find(t => t.id === m.away_team_id)?.name || 'Visitante';
      const vName = getVocalName(m);
      const cat = getCategoryName(m);
      const startDate = new Date(m.match_date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDate = new Date(new Date(m.match_date).getTime() + 90 * 60000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:match-${m.id}@deporverso.com\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
      icsContent += `DTSTART:${startDate}\n`;
      icsContent += `DTEND:${endDate}\n`;
      icsContent += `SUMMARY:${hName} vs ${aName} [${cat}]\n`;
      icsContent += `DESCRIPTION:Torneo Oficial: ${tenant.name}\\nCategoría: ${cat}\\nVocal de Mesa: ${vName}\\nSede: ${m.field_location}\\nEstado: ${m.status}\\nSeguimiento en vivo en: https://${tenant.domain || 'deporverso.com'}\n`;
      icsContent += `LOCATION:${m.field_location || 'Estadio Central'}\n`;
      icsContent += "STATUS:CONFIRMED\n";
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `fixture-${tenant.slug || 'liga'}-${sportCode.toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Copy share link
  const handleCopyMatchShare = (m: Match) => {
    const hName = m.home_team?.name || teams.find(t => t.id === m.home_team_id)?.name || 'Local';
    const aName = m.away_team?.name || teams.find(t => t.id === m.away_team_id)?.name || 'Visitante';
    const text = `🏆 ${hName} vs ${aName} en ${tenant.name} (${getCategoryName(m)}). Vocal: ${getVocalName(m)}. Consulta el fixture oficial en vivo: https://${tenant.domain || 'deporverso.com'}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
    if (onShareMatch) {
      onShareMatch(`${hName} vs ${aName}`);
    }
  };

  // Sport color accent mappings
  const getSportAccentBg = () => {
    switch(sportCode) {
      case 'BALONCESTO': return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'ECUAVOLEY': return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      case 'PADEL': return 'border-lime-500/30 bg-lime-500/10 text-lime-300';
      case 'FUTSAL': return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      default: return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    }
  };

  const getSportBadgeGradient = () => {
    switch(sportCode) {
      case 'BALONCESTO': return 'from-amber-500 to-orange-500';
      case 'ECUAVOLEY': return 'from-cyan-500 to-sky-600';
      case 'PADEL': return 'from-lime-500 to-emerald-600';
      case 'FUTSAL': return 'from-rose-500 to-purple-600';
      default: return 'from-[#00ff66] to-[#00d2b5]';
    }
  };

  return (
    <div className="space-y-6">
      {/* SUBDOMAIN BANNER & MASTER FIXTURE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090e17] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            {/* Subdomain Active Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05111d] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SUBDOMINIO ACTIVO:</span>
              <span className="text-white font-black underline tracking-wide">
                https://{tenant.domain || `${tenant.slug || 'liga'}.sportia.app`}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-sans font-extrabold">
                OFICIAL
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ff66] to-[#00d2b5] p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#090e17] rounded-[14px] flex items-center justify-center font-black text-[#00ff66] text-xl">
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{tenant.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-white/10 text-white font-bold border border-white/10">
                    {theme.badge}
                  </span>
                </h2>
                <p className="text-xs text-[#A0A0A0] font-medium flex items-center gap-2 mt-0.5">
                  <span>Fixture y Programación Oficial de Encuentros</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Mesa de Control & Vocalía Digital Habilitada</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#050b14] border border-white/10 rounded-2xl px-4 py-2.5 text-center min-w-[90px]">
              <span className="block text-xl font-black text-white font-mono">{stats.total}</span>
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">Partidos</span>
            </div>

            <div className="bg-[#050b14] border border-rose-500/30 rounded-2xl px-4 py-2.5 text-center min-w-[90px]">
              <span className="block text-xl font-black text-rose-400 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>
                {stats.live}
              </span>
              <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider">En Vivo</span>
            </div>

            <div className="bg-[#050b14] border border-cyan-500/30 rounded-2xl px-4 py-2.5 text-center min-w-[90px]">
              <span className="block text-xl font-black text-cyan-400 font-mono">{stats.scheduled}</span>
              <span className="text-[10px] text-cyan-300 uppercase font-bold tracking-wider">Por Jugar</span>
            </div>

            <div className="bg-[#050b14] border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-center min-w-[90px]">
              <span className="block text-xl font-black text-emerald-400 font-mono">{stats.finished}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">Finalizados</span>
            </div>

            <div className="bg-[#050b14] border border-amber-500/30 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
              <span className="block text-xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <UserCheck className="w-4 h-4 text-amber-400" />
                {stats.assignedVocals}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Vocales OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & TOOLBAR CONTROLS */}
      <div className="bg-[#0d121c] rounded-2xl border border-white/10 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'TODOS', label: 'Todos los Partidos', icon: Layers },
              { id: 'LIVE', label: '🔴 En Vivo Ahora', icon: Radio },
              { id: 'SCHEDULED', label: '⏱️ Programados', icon: Clock },
              { id: 'FINISHED', label: '✅ Finalizados', icon: CheckCircle2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-gradient-to-r ' + getSportBadgeGradient() + ' text-black font-extrabold shadow-lg' 
                      : 'bg-white/5 text-[#A0A0A0] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Tools: Export ICS, View Toggle */}
          <div className="flex items-center gap-2.5 self-end lg:self-auto">
            <button
              onClick={handleExportICS}
              title="Descargar calendario compatible con Google Calendar y Apple Calendar"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sincronizar .ICS</span>
            </button>

            <div className="bg-[#070b12] p-1 rounded-xl border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white/20 text-white font-extrabold' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                Tabla Pro
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white/20 text-white font-extrabold' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                Tarjetas 3D
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filters Bar: Category, Round, Search Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#070b12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-cyan-500"
            >
              <option value="TODAS">Todas las Categorías</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Round / Jornada Dropdown */}
          <div className="relative">
            <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider mb-1">
              Jornada / Fecha
            </label>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="w-full bg-[#070b12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-cyan-500"
            >
              <option value="TODAS">Todas las Fechas</option>
              {availableRounds.map(rnd => (
                <option key={rnd} value={rnd}>{rnd}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider mb-1">
              Buscar en Fixture (Equipo, Vocal, Cancha...)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej. Deportivo Quito, Almendariz, Cancha 1, Primera Senior..."
                className="w-full bg-[#070b12] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 font-medium outline-none focus:border-cyan-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MATCH COUNT INDICATOR */}
      <div className="flex items-center justify-between text-xs text-[#A0A0A0] px-1 font-medium">
        <span>Mostrando <strong className="text-white">{filteredMatches.length}</strong> de <strong className="text-white">{matches.length}</strong> partidos programados</span>
        {copiedId && (
          <span className="text-emerald-400 font-bold animate-pulse flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> ¡Detalles del partido copiados para compartir!
          </span>
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: TABLA ESPECTACULAR PRO ACORDE AL DEPORTE       */}
      {/* ======================================================== */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f18] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#05080e] border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-[#A0A0A0]">
                  <th className="py-4 px-4 w-[160px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Fecha & Hora</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Categoría</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Partido (Local vs Visitante)</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 w-[210px]">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vocal de Mesa</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 w-[140px] text-right">
                    <span>Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-normal">
                {filteredMatches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#A0A0A0]">
                      <div className="max-w-md mx-auto space-y-2">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                        <p className="font-bold text-white text-sm">No se encontraron encuentros con los filtros seleccionados</p>
                        <p className="text-xs text-white/50">Intenta restablecer la categoría, jornada o limpiar el término de búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMatches.map((m) => {
                    const homeTeam = m.home_team || teams.find(t => t.id === m.home_team_id);
                    const awayTeam = m.away_team || teams.find(t => t.id === m.away_team_id);
                    const vocalName = getVocalName(m);
                    const categoryName = getCategoryName(m);
                    const refereeName = getRefereeName(m);
                    const venue = m.field_location || m.match_data?.venue_name || 'Estadio Central';
                    const round = m.match_data?.round || 'Jornada Regular';
                    const isLive = m.status === 'IN_PROGRESS';
                    const isFinished = m.status === 'FINISHED';
                    const isVocalSigned = m.match_data?.vocal_report?.signed;

                    // Date & Time formatting
                    const d = new Date(m.match_date);
                    const dateFormatted = d.toLocaleDateString('es-EC', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric' 
                    });
                    const timeFormatted = d.toLocaleTimeString('es-EC', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    });

                    return (
                      <tr 
                        key={m.id} 
                        className={`hover:bg-white/[0.03] transition-colors ${
                          isLive ? 'bg-rose-500/[0.04]' : ''
                        }`}
                      >
                        {/* 1. FECHA Y HORA */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="font-mono text-cyan-300 font-extrabold">{timeFormatted}</span>
                            </div>
                            <div className="text-[11px] text-[#A0A0A0] capitalize">
                              {dateFormatted}
                            </div>
                            <div className="inline-block text-[9px] bg-white/5 text-white/70 px-2 py-0.5 rounded font-mono font-bold">
                              {round}
                            </div>
                          </div>
                        </td>

                        {/* 2. CATEGORÍA */}
                        <td className="py-4 px-3 align-top">
                          <div className="space-y-1.5">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#101b2b] text-cyan-300 border border-cyan-500/30 text-[11px] font-black tracking-tight leading-tight">
                              {categoryName}
                            </span>
                            <div className="text-[10px] text-white/50 flex items-center gap-1">
                              <span>Árbitro:</span>
                              <span className="text-white/80 font-medium truncate max-w-[130px]">{refereeName}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. PARTIDO (LOCAL VS VISITANTE) CON ESTILO DEPORTE */}
                        <td className="py-4 px-6 align-top">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-full grid grid-cols-5 items-center gap-2 bg-[#060910] p-3 rounded-2xl border border-white/5 shadow-inner">
                              
                              {/* Equipo Local */}
                              <div className="col-span-2 flex items-center justify-end gap-2.5 text-right">
                                <span className="font-black text-xs text-white truncate hover:text-cyan-400 transition-colors">
                                  {homeTeam?.name || 'Local'}
                                </span>
                                <div 
                                  className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0"
                                  style={{ backgroundColor: homeTeam?.primary_color || '#3b82f6' }}
                                >
                                  {homeTeam?.name?.charAt(0) || 'L'}
                                </div>
                              </div>

                              {/* Marcador Central o VS */}
                              <div className="col-span-1 flex flex-col items-center justify-center">
                                {isLive ? (
                                  <div className="space-y-0.5 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-black border border-rose-500/30 animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                      EN VIVO
                                    </span>
                                    <div className="text-xl font-black text-white font-mono tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                                      {m.home_score} - {m.away_score}
                                    </div>
                                    <span className="text-[9px] text-amber-400 font-bold font-mono">
                                      {m.match_data?.current_period || 'En juego'}
                                    </span>
                                  </div>
                                ) : isFinished ? (
                                  <div className="space-y-0.5 text-center">
                                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                                      FINAL
                                    </span>
                                    <div className="text-lg font-black text-emerald-300 font-mono tracking-wider">
                                      {m.home_score} - {m.away_score}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#A0A0A0] text-xs font-black flex items-center justify-center mx-auto">
                                      VS
                                    </span>
                                    <span className="text-[9px] text-cyan-400 font-mono font-bold block mt-0.5">
                                      {timeFormatted}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Equipo Visitante */}
                              <div className="col-span-2 flex items-center justify-start gap-2.5 text-left">
                                <div 
                                  className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0"
                                  style={{ backgroundColor: awayTeam?.primary_color || '#ef4444' }}
                                >
                                  {awayTeam?.name?.charAt(0) || 'V'}
                                </div>
                                <span className="font-black text-xs text-white truncate hover:text-cyan-400 transition-colors">
                                  {awayTeam?.name || 'Visitante'}
                                </span>
                              </div>
                            </div>

                            {/* Información de Cancha y Especificaciones de Deporte */}
                            <div className="w-full flex flex-wrap items-center justify-between text-[10px] text-[#A0A0A0] px-2 gap-2">
                              <span className="flex items-center gap-1 truncate max-w-[320px]">
                                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>{venue}</span>
                              </span>

                              {/* Métricas específicas del deporte */}
                              {sportCode === 'ECUAVOLEY' && m.match_data?.sets_home && (
                                <span className="text-cyan-300 font-mono font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                                  Sets: [{m.match_data.sets_home.join('-')}] vs [{m.match_data.sets_away?.join('-')}] • {m.match_data.cambios_count || 0} cambios
                                </span>
                              )}

                              {sportCode === 'BALONCESTO' && m.match_data?.fouls_home !== undefined && (
                                <span className="text-amber-300 font-mono font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                                  Faltas acum: L:{m.match_data.fouls_home} | V:{m.match_data.fouls_away} • Parquet Roble
                                </span>
                              )}

                              {sportCode === 'PADEL' && m.match_data?.sets_home && (
                                <span className="text-lime-300 font-mono font-bold bg-lime-950/40 px-2 py-0.5 rounded border border-lime-800/40">
                                  Parciales: {m.match_data.sets_home.map((s, i) => `${s}-${m.match_data?.sets_away?.[i] || 0}`).join(', ')} • Cristal Templado
                                </span>
                              )}

                              {sportCode === 'FUTBOL' && (
                                <span className="text-emerald-300 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                                  {m.match_data?.court_surface || 'Césped Sintético'} • 2T × 45m
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 4. VOCAL DE MESA DESIGNADO */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-black text-xs shrink-0">
                                V
                              </div>
                              <span className="font-bold text-white text-xs leading-tight block">
                                {vocalName}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              {isVocalSigned ? (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                                  <Check className="w-2.5 h-2.5" /> Firma Conforme
                                </span>
                              ) : isLive ? (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/20">
                                  <Activity className="w-2.5 h-2.5" /> En Mesa de Control
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-white/5 text-[#A0A0A0] px-2 py-0.5 rounded font-bold">
                                  Acreditado
                                </span>
                              )}

                              {m.match_data?.vocal_report?.vocal_cedula && (
                                <span className="text-[9px] text-[#A0A0A0] font-mono">
                                  C.I: {m.match_data.vocal_report.vocal_cedula}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 5. ACCIONES & VER VOCALÍA */}
                        <td className="py-4 px-4 align-top text-right">
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => onSelectMatchDetail ? onSelectMatchDetail(m) : null}
                              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-white font-bold text-xs border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                            >
                              <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Planilla Vocalía</span>
                            </button>

                            <button
                              onClick={() => handleCopyMatchShare(m)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Compartir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* VISTA 2: TARJETAS TÁCTICAS 3D ACORDE AL DEPORTE          */
        /* ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#A0A0A0] bg-[#0a0f18] rounded-2xl border border-white/10">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">No se encontraron encuentros</p>
            </div>
          ) : (
            filteredMatches.map(m => {
              const homeTeam = m.home_team || teams.find(t => t.id === m.home_team_id);
              const awayTeam = m.away_team || teams.find(t => t.id === m.away_team_id);
              const vocalName = getVocalName(m);
              const categoryName = getCategoryName(m);
              const isLive = m.status === 'IN_PROGRESS';
              const isFinished = m.status === 'FINISHED';

              const d = new Date(m.match_date);
              const dateFormatted = d.toLocaleDateString('es-EC', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'short' 
              });
              const timeFormatted = d.toLocaleTimeString('es-EC', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              });

              return (
                <div 
                  key={m.id}
                  className="bg-[#090e17] rounded-2xl border border-white/10 p-5 space-y-4 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
                >
                  {/* Card Header: Category & Status */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                      {categoryName}
                    </span>

                    {isLive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black border border-rose-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        EN VIVO
                      </span>
                    ) : isFinished ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        FINALIZADO
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                        PROGRAMADO
                      </span>
                    )}
                  </div>

                  {/* Teams vs Score */}
                  <div className="bg-[#05080e] p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs shadow"
                          style={{ backgroundColor: homeTeam?.primary_color || '#3b82f6' }}
                        >
                          {homeTeam?.name?.charAt(0) || 'L'}
                        </div>
                        <span className="font-bold text-xs text-white truncate max-w-[140px]">{homeTeam?.name}</span>
                      </div>
                      <span className="font-mono font-black text-base text-white">
                        {isLive || isFinished ? m.home_score : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs shadow"
                          style={{ backgroundColor: awayTeam?.primary_color || '#ef4444' }}
                        >
                          {awayTeam?.name?.charAt(0) || 'V'}
                        </div>
                        <span className="font-bold text-xs text-white truncate max-w-[140px]">{awayTeam?.name}</span>
                      </div>
                      <span className="font-mono font-black text-base text-white">
                        {isLive || isFinished ? m.away_score : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Date, Time & Venue */}
                  <div className="space-y-1.5 text-xs text-[#A0A0A0]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-white font-bold">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono">{timeFormatted}</span>
                      </span>
                      <span className="text-[11px] capitalize">{dateFormatted}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{m.field_location || 'Estadio Central'}</span>
                    </div>
                  </div>

                  {/* Vocal Box & Footer Action */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#A0A0A0]">Vocal de Mesa:</span>
                      <span className="font-bold text-purple-300 truncate max-w-[140px]">{vocalName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectMatchDetail ? onSelectMatchDetail(m) : null}
                        className="flex-1 py-2 bg-gradient-to-r from-[#00ff66]/10 to-cyan-500/10 hover:from-[#00ff66]/20 hover:to-cyan-500/20 text-[#00ff66] border border-[#00ff66]/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ver Planilla</span>
                      </button>

                      <button
                        onClick={() => handleCopyMatchShare(m)}
                        title="Compartir partido"
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-cyan-400 border border-white/10 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
