import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Trophy, Shield, Users, 
  Download, Search, Eye, Radio, CheckCircle2, ChevronRight, 
  Sparkles, Zap, Video, Share2, Compass, AlertCircle, Printer
} from 'lucide-react';
import { Match, SportCode, Team, Tenant } from '../../types';
import { SPORT_THEMES } from '../Navbar';

interface MultiSportCalendarProps {
  matches: Match[];
  teams: Team[];
  tenants: Tenant[];
  activeSport: SportCode;
  onSelectSport: (sport: SportCode) => void;
  onNavigateTab: (tab: string) => void;
}

export const MultiSportCalendar: React.FC<MultiSportCalendarProps> = ({
  matches,
  teams,
  tenants,
  activeSport,
  onSelectSport,
  onNavigateTab
}) => {
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'SCHEDULED' | 'FINISHED'>('ALL');
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda' | 'month'>('grid');
  const [selectedMatchModal, setSelectedMatchModal] = useState<Match | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Helper to get Team
  const getTeam = (teamId: string): Team | undefined => {
    return teams.find(t => t.id === teamId);
  };

  // Helper to get Tenant name
  const getTenantName = (tenantId: string): string => {
    const t = tenants.find(item => item.id === tenantId);
    return t ? t.name : 'Liga General';
  };

  // Extract unique rounds from matches
  const uniqueRounds = useMemo(() => {
    const rounds = new Set<string>();
    matches.forEach(m => {
      if (m.match_data?.round) {
        rounds.add(m.match_data.round);
      }
    });
    return Array.from(rounds);
  }, [matches]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Sport filter
      if (selectedSportFilter !== 'ALL' && match.sport_code !== selectedSportFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'ALL' && match.status !== selectedStatusFilter) {
        return false;
      }
      // Round filter
      if (selectedRoundFilter !== 'ALL' && match.match_data?.round !== selectedRoundFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const home = getTeam(match.home_team_id)?.name.toLowerCase() || '';
        const away = getTeam(match.away_team_id)?.name.toLowerCase() || '';
        const venue = match.field_location.toLowerCase();
        const ref = (match.match_data?.referee_name || '').toLowerCase();
        const round = (match.match_data?.round || '').toLowerCase();
        return home.includes(query) || away.includes(query) || venue.includes(query) || ref.includes(query) || round.includes(query);
      }
      return true;
    }).sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  }, [matches, selectedSportFilter, selectedStatusFilter, selectedRoundFilter, searchQuery, teams]);

  // Generate and Download .ics iCalendar file for filtered matches
  const handleExportICS = () => {
    if (filteredMatches.length === 0) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Deporverso//Fixture Multideporte Global//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Deporverso - Fixture de Partidos',
      'X-WR-TIMEZONE:America/Guayaquil'
    ];

    filteredMatches.forEach(m => {
      const home = getTeam(m.home_team_id)?.name || 'Local';
      const away = getTeam(m.away_team_id)?.name || 'Visitante';
      const dt = new Date(m.match_date);
      const dtEnd = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const summary = `[${m.sport_code}] ${home} vs ${away}`;
      const description = `Jornada: ${m.match_data?.round || 'Fase Regular'}\\nSede: ${m.field_location}\\nSuperficie: ${m.match_data?.court_surface || 'Oficial'}\\nÁrbitro: ${m.match_data?.referee_name || 'Designado por Colegio'}\\nPlataforma: Deporverso.com`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:deporverso-match-${m.id}@deporverso.com`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(dt)}`,
        `DTEND:${formatICSDate(dtEnd)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${m.field_location}`,
        `STATUS:${m.status === 'FINISHED' ? 'COMPLETED' : 'CONFIRMED'}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Recordatorio de Partido Deporverso: ${home} vs ${away}`,
        'END:VALARM',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `deporverso-fixture-${selectedSportFilter.toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopySuccess('¡Calendario .ICS descargado! Ábrelo con Google Calendar, Apple o Outlook.');
    setTimeout(() => setCopySuccess(null), 4500);
  };

  // Helper format date
  const formatMatchDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-EC', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Stats
  const liveCount = matches.filter(m => m.status === 'IN_PROGRESS').length;
  const schedCount = matches.filter(m => m.status === 'SCHEDULED').length;
  const finishCount = matches.filter(m => m.status === 'FINISHED').length;

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICACIÓN */}
      {copySuccess && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{copySuccess}</span>
        </div>
      )}

      {/* 3D CYBER BANNER PRINCIPAL */}
      <div className="bg-gradient-to-r from-[#03101d] via-[#051829] to-[#040813] p-6 sm:p-8 rounded-3xl border border-cyan-500/35 shadow-2xl relative overflow-hidden card-3d-interactive cyber-sheen-effect">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-mono font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <CalendarIcon className="w-3 h-3" />
                <span>Calendario Cuántico Multideporte</span>
              </span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs px-3 py-0.5 rounded-full font-bold">
                Temporada Oficial 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Fixture Global & Programación de Partidos
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
              Consulta en tiempo real los encuentros de todas las fechas y ligas en <strong>Fútbol 11, Baloncesto, Ecuavoley, Pádel y Fútsal</strong>. Designaciones arbitrales, sedes georreferenciadas y sincronización universal con Google Calendar y iCal.
            </p>

            {/* QUICK STATS CHIPS */}
            <div className="flex items-center gap-2.5 mt-4 flex-wrap">
              <div className="bg-black/60 border border-red-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[11px] font-mono text-white/70">En Vivo:</span>
                <strong className="text-xs font-mono font-black text-red-400">{liveCount}</strong>
              </div>
              <div className="bg-black/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono text-white/70">Programados:</span>
                <strong className="text-xs font-mono font-black text-cyan-400">{schedCount}</strong>
              </div>
              <div className="bg-black/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono text-white/70">Finalizados:</span>
                <strong className="text-xs font-mono font-black text-emerald-400">{finishCount}</strong>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleExportICS}
              className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Descargar archivo .ics compatible con Google Calendar, Apple y Outlook"
            >
              <Download className="w-4 h-4" />
              <span>Sincronizar a Google/iCal (.ics)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-black/60 hover:bg-white/10 text-white border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              title="Imprimir o guardar cronograma en PDF"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Imprimir Cronograma</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & VIEW CONTROLS */}
      <div className="bg-[#080d16] rounded-2xl border border-white/10 p-4 space-y-4 shadow-xl">
        {/* SPORT SELECTOR CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSportFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedSportFilter === 'ALL'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-black/40 text-white/70 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Todos los Deportes ({matches.length})</span>
          </button>

          {(['FUTBOL', 'BALONCESTO', 'ECUAVOLEY', 'PADEL', 'FUTSAL'] as SportCode[]).map(code => {
            const theme = SPORT_THEMES[code];
            const count = matches.filter(m => m.sport_code === code).length;
            const isSelected = selectedSportFilter === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedSportFilter(code)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-lg scale-105'
                    : 'bg-black/40 text-white/70 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/30 text-black' : 'bg-white/10 text-white/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* STATUS, ROUND & SEARCH CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por equipo, estadio, árbitro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* STATUS SELECTOR */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="IN_PROGRESS">🔴 En Vivo Ahora</option>
            <option value="SCHEDULED">⏳ Programados / Próximos</option>
            <option value="FINISHED">✅ Finalizados</option>
          </select>

          {/* ROUND / JORNADA SELECTOR */}
          <select
            value={selectedRoundFilter}
            onChange={(e) => setSelectedRoundFilter(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            <option value="ALL">Todas las Jornadas / Fechas</option>
            {uniqueRounds.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* VIEW SWITCHER */}
          <div className="flex items-center bg-black/60 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                viewMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Cuadrícula 3D
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                viewMode === 'agenda' ? 'bg-cyan-500 text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                viewMode === 'month' ? 'bg-cyan-500 text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT & FILTER FEEDBACK */}
      <div className="flex items-center justify-between text-xs text-white/50 px-1">
        <span>Mostrando <strong>{filteredMatches.length}</strong> partidos coincidentes</span>
        {(selectedSportFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || selectedRoundFilter !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSportFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSelectedRoundFilter('ALL');
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:underline cursor-pointer font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* VISTA 1: CUADRÍCULA 3D HOLOGRÁFICA */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMatches.map(match => {
            const home = getTeam(match.home_team_id);
            const away = getTeam(match.away_team_id);
            const theme = SPORT_THEMES[match.sport_code] || SPORT_THEMES.FUTBOL;
            const isLive = match.status === 'IN_PROGRESS';
            const isFinished = match.status === 'FINISHED';

            return (
              <div 
                key={match.id}
                className="bg-gradient-to-b from-[#09111c] to-[#040810] rounded-3xl border border-white/10 hover:border-cyan-500/40 p-5 space-y-4 shadow-xl transition-all card-3d-interactive relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-br"></div>

                <div>
                  {/* TOP CARD HEADER */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{theme.icon}</span>
                      <span className="text-[11px] font-mono font-bold text-white/70">
                        {match.match_data?.round || 'Fase Regular'}
                      </span>
                    </div>

                    {isLive ? (
                      <span className="bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                        <span>EN VIVO {match.match_data?.current_period ? `• ${match.match_data.current_period}` : ''}</span>
                      </span>
                    ) : isFinished ? (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                        FINALIZADO
                      </span>
                    ) : (
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>PROGRAMADO</span>
                      </span>
                    )}
                  </div>

                  {/* SCOREBOARD / TEAMS */}
                  <div className="py-4 space-y-3">
                    {/* HOME TEAM */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md shrink-0"
                          style={{ backgroundColor: home?.primary_color || '#334155' }}
                        >
                          {home?.name.substring(0, 2).toUpperCase() || 'L'}
                        </div>
                        <span className="font-extrabold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                          {home?.name || 'Equipo Local'}
                        </span>
                      </div>

                      {(isLive || isFinished) ? (
                        <span className="font-mono text-xl font-black text-white px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/10">
                          {match.home_score}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-white/30 font-bold">--</span>
                      )}
                    </div>

                    {/* AWAY TEAM */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md shrink-0"
                          style={{ backgroundColor: away?.primary_color || '#475569' }}
                        >
                          {away?.name.substring(0, 2).toUpperCase() || 'V'}
                        </div>
                        <span className="font-extrabold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                          {away?.name || 'Equipo Visitante'}
                        </span>
                      </div>

                      {(isLive || isFinished) ? (
                        <span className="font-mono text-xl font-black text-white px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/10">
                          {match.away_score}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-white/30 font-bold">--</span>
                      )}
                    </div>

                    {/* SETS DETAIL (Ecuavoley / Pádel) */}
                    {(match.sport_code === 'ECUAVOLEY' || match.sport_code === 'PADEL') && match.match_data?.sets_home && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                        <span>Sets:</span>
                        <div className="flex items-center gap-2">
                          {match.match_data.sets_home.map((s, idx) => (
                            <span key={idx} className="bg-black/50 px-1.5 py-0.5 rounded border border-white/10 text-white font-bold">
                              {s}-{match.match_data?.sets_away?.[idx] ?? 0}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VENUE & TIME DETAILS */}
                  <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-mono font-medium text-white/80">{formatMatchDate(match.match_date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{match.field_location}</span>
                    </div>

                    {match.match_data?.referee_name && (
                      <div className="flex items-center gap-2 text-[11px] text-white/40">
                        <Shield className="w-3 h-3 text-cyan-300 shrink-0" />
                        <span className="truncate">Árbitro: {match.match_data.referee_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMatchModal(match)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ficha Completa</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <button
                        onClick={() => onNavigateTab('vocalia')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Mesa Vocalía</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const homeName = home?.name || 'Local';
                          const awayName = away?.name || 'Visitante';
                          const dt = new Date(match.match_date);
                          const dtEnd = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
                          const formatICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                          const ics = [
                            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Deporverso//ES',
                            'BEGIN:VEVENT',
                            `UID:match-${match.id}@deporverso.com`,
                            `DTSTAMP:${formatICSDate(new Date())}`,
                            `DTSTART:${formatICSDate(dt)}`,
                            `DTEND:${formatICSDate(dtEnd)}`,
                            `SUMMARY:[${match.sport_code}] ${homeName} vs ${awayName}`,
                            `LOCATION:${match.field_location}`,
                            'END:VEVENT',
                            'END:VCALENDAR'
                          ].join('\r\n');
                          const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                          const link = document.createElement('a');
                          link.href = window.URL.createObjectURL(blob);
                          link.setAttribute('download', `partido-${match.id}.ics`);
                          link.click();
                          setCopySuccess(`Recordatorio guardado para ${homeName} vs ${awayName}`);
                          setTimeout(() => setCopySuccess(null), 3500);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Guardar evento en calendario"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>iCal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 2: AGENDA CRONOLÓGICA */}
      {viewMode === 'agenda' && (
        <div className="bg-[#080e18] rounded-3xl border border-white/10 p-6 space-y-6 shadow-2xl">
          <div className="space-y-4">
            {filteredMatches.map((match, idx) => {
              const home = getTeam(match.home_team_id);
              const away = getTeam(match.away_team_id);
              const theme = SPORT_THEMES[match.sport_code] || SPORT_THEMES.FUTBOL;
              const isLive = match.status === 'IN_PROGRESS';
              const isFinished = match.status === 'FINISHED';

              return (
                <div 
                  key={match.id}
                  className="bg-black/50 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/[0.02]"
                >
                  {/* FECHA Y DEPORTE */}
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[10px] text-cyan-300 font-bold uppercase">
                        {new Date(match.match_date).toLocaleDateString('es-EC', { month: 'short' })}
                      </span>
                      <strong className="text-base text-white font-black">
                        {new Date(match.match_date).getDate()}
                      </strong>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{theme.icon}</span>
                        <span className="text-xs font-extrabold text-white">{theme.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        {new Date(match.match_date).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* PARTIDO / EQUIPOS */}
                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 justify-end w-44 text-right">
                      <span className="text-xs font-extrabold text-white truncate">{home?.name || 'Local'}</span>
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] text-white shrink-0"
                        style={{ backgroundColor: home?.primary_color || '#334155' }}
                      >
                        {home?.name.substring(0, 1) || 'L'}
                      </div>
                    </div>

                    <div className="px-3 py-1 bg-black/80 rounded-xl border border-white/10 font-mono font-black text-sm text-center min-w-[70px]">
                      {(isLive || isFinished) ? `${match.home_score} - ${match.away_score}` : 'VS'}
                    </div>

                    <div className="flex items-center gap-2 justify-start w-44">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] text-white shrink-0"
                        style={{ backgroundColor: away?.primary_color || '#475569' }}
                      >
                        {away?.name.substring(0, 1) || 'V'}
                      </div>
                      <span className="text-xs font-extrabold text-white truncate">{away?.name || 'Visitante'}</span>
                    </div>
                  </div>

                  {/* SEDE & ESTADO */}
                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                    <div className="text-left md:text-right text-[11px] text-white/50">
                      <span className="block truncate max-w-[160px] text-white/80">{match.field_location}</span>
                      <span className="block font-mono text-amber-400/80">{match.match_data?.round || 'Fase Regular'}</span>
                    </div>

                    <button
                      onClick={() => setSelectedMatchModal(match)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 transition-colors cursor-pointer"
                      title="Ver detalles"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 3: CALENDARIO MENSUAL / MATRIZ */}
      {viewMode === 'month' && (
        <div className="bg-[#080e18] rounded-3xl border border-white/10 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <span>Matriz de Fechas • Temporada Julio / Agosto 2026</span>
            </h3>
            <span className="text-xs text-white/40 font-mono">Zona Horaria: UTC-5 (Ecuador)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-xs font-mono font-bold text-white/40 pb-2">
                {d}
              </div>
            ))}

            {/* Días destacados con partidos */}
            {Array.from({ length: 28 }).map((_, i) => {
              const dayNumber = i + 15; // Días de julio/agosto
              // Buscar si hay partidos en este día
              const dayMatches = filteredMatches.filter(m => {
                const d = new Date(m.match_date).getDate();
                return d === dayNumber;
              });

              return (
                <div 
                  key={i}
                  className={`min-h-[90px] p-2.5 rounded-2xl border transition-all ${
                    dayMatches.length > 0 
                      ? 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-400 shadow-md' 
                      : 'bg-black/30 border-white/5 text-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-white/70">{dayNumber}</span>
                    {dayMatches.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayMatches.map(dm => {
                      const sportTheme = SPORT_THEMES[dm.sport_code];
                      return (
                        <div 
                          key={dm.id}
                          onClick={() => setSelectedMatchModal(dm)}
                          className="text-[10px] p-1 bg-black/80 rounded border border-white/10 hover:border-cyan-400 truncate cursor-pointer transition-colors"
                          title={`${dm.sport_code}: ${dm.field_location}`}
                        >
                          <span>{sportTheme?.icon}</span>
                          <span className="ml-1 text-white font-semibold">
                            {getTeam(dm.home_team_id)?.name.substring(0, 8)}..
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DETALLE EXPANDIDO DEL PARTIDO */}
      {selectedMatchModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedMatchModal(null)}
        >
          <div 
            className="bg-gradient-to-b from-[#0a1424] to-[#040810] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden card-3d-interactive"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>

            {/* HEADER MODAL */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-black tracking-widest block">
                  Ficha Oficial del Encuentro • Deporverso
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedMatchModal.match_data?.round || 'Jornada Oficial'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatchModal(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* SCOREBOARD GRANDE */}
            <div className="p-4 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-around gap-4 text-center">
              <div className="space-y-1 max-w-[140px]">
                <strong className="text-sm font-black text-white block">
                  {getTeam(selectedMatchModal.home_team_id)?.name || 'Local'}
                </strong>
                <span className="text-[10px] text-white/50 block">Local</span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-mono font-black text-cyan-400 bg-black/80 px-4 py-1 rounded-xl border border-white/10">
                  {selectedMatchModal.status === 'SCHEDULED' 
                    ? 'VS' 
                    : `${selectedMatchModal.home_score} - ${selectedMatchModal.away_score}`}
                </div>
                <span className="text-[9px] font-mono text-white/40 block uppercase">
                  {selectedMatchModal.status}
                </span>
              </div>

              <div className="space-y-1 max-w-[140px]">
                <strong className="text-sm font-black text-white block">
                  {getTeam(selectedMatchModal.away_team_id)?.name || 'Visitante'}
                </strong>
                <span className="text-[10px] text-white/50 block">Visitante</span>
              </div>
            </div>

            {/* DETALLES LOGÍSTICOS & REGLAMENTARIOS */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 block">Fecha y Hora</span>
                <strong className="text-white font-mono">{formatMatchDate(selectedMatchModal.match_date)}</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 block">Superficie de Juego</span>
                <strong className="text-emerald-400">{selectedMatchModal.match_data?.court_surface || 'Césped Reglamentario'}</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 block">Árbitro / Juez Principal</span>
                <strong className="text-white">{selectedMatchModal.match_data?.referee_name || 'Designación Oficial'}</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 block">Vocalía de Mesa</span>
                <strong className="text-cyan-300">{selectedMatchModal.match_data?.vocal_name || 'Mesa Deporverso'}</strong>
              </div>

              <div className="col-span-2 p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 block">Escenario / Cancha</span>
                <strong className="text-white">{selectedMatchModal.field_location}</strong>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedMatchModal(null);
                  onNavigateTab('vocalia');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>Abrir en Vocalía Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
