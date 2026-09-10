import React, { useState } from 'react';
import { 
  Search, Award, Sparkles, Download, FileText, Filter, Star, 
  TrendingUp, Shield, Zap, User, ExternalLink, Check, Lock, DollarSign
} from 'lucide-react';
import { Player, Team, SportCode, ScoutingMetadata } from '../../types';

interface ScoutingHubProps {
  players: Player[];
  teams: Team[];
  activeSport: SportCode;
}

// Sample scouting dataset for rich talent hub experience
const MOCK_SCOUTING_DATA: Record<string, ScoutingMetadata> = {
  'p1': {
    id: 'sc1',
    player_id: 'p1',
    tenant_id: 't-pichincha',
    sportia_index: 9.2,
    pace: 88,
    shooting: 85,
    passing: 90,
    dribbling: 92,
    defending: 55,
    physical: 76,
    goals_count: 14,
    assists_count: 9,
    matches_played: 12,
    rating_history: [8.5, 8.8, 9.0, 9.2],
    scout_notes: 'Mediocampista ofensivo con visión periférica de nivel profesional. Excelente cobro de tiros libres.',
    market_value_usd: 2500.00
  },
  'p2': {
    id: 'sc2',
    player_id: 'p2',
    tenant_id: 't-pichincha',
    sportia_index: 8.7,
    pace: 92,
    shooting: 89,
    passing: 74,
    dribbling: 84,
    defending: 40,
    physical: 82,
    goals_count: 18,
    assists_count: 3,
    matches_played: 12,
    rating_history: [8.0, 8.4, 8.6, 8.7],
    scout_notes: 'Delantero centro de alta velocidad y potencia física. Gran definición con ambas piernas.',
    market_value_usd: 1800.00
  },
  'p3': {
    id: 'sc3',
    player_id: 'p3',
    tenant_id: 't-pichincha',
    sportia_index: 8.4,
    pace: 75,
    shooting: 60,
    passing: 82,
    dribbling: 78,
    defending: 88,
    physical: 86,
    goals_count: 3,
    assists_count: 5,
    matches_played: 11,
    rating_history: [7.9, 8.1, 8.3, 8.4],
    scout_notes: 'Defensa central zurdo con salida limpia y capacidad de anticipación en duelos aéreos.',
    market_value_usd: 1200.00
  }
};

export const ScoutingHub: React.FC<ScoutingHubProps> = ({ players, teams, activeSport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || 'p1');
  const [scoutProUnlocked, setScoutProUnlocked] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Filter players
  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPosition === 'ALL' || p.position === selectedPosition;
    return matchesSearch && matchesPos;
  });

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0] || {
    id: 'p1',
    full_name: 'Esteban Guerra',
    jersey_number: 10,
    position: 'Mediocampista',
    qr_code: 'qr-p1',
    team_id: 'team-1',
    tenant_id: 't-pichincha',
    is_active: true
  };

  const selectedTeam = teams.find(t => t.id === selectedPlayer.team_id) || { name: 'Deportivo Quito Barrial' };
  const metadata = MOCK_SCOUTING_DATA[selectedPlayer.id] || {
    id: `sc-${selectedPlayer.id}`,
    player_id: selectedPlayer.id,
    tenant_id: selectedPlayer.tenant_id,
    sportia_index: 8.1,
    pace: 78,
    shooting: 75,
    passing: 80,
    dribbling: 82,
    defending: 65,
    physical: 74,
    goals_count: 6,
    assists_count: 4,
    matches_played: 9,
    rating_history: [7.5, 7.8, 8.1],
    scout_notes: 'Jugador versátil con gran disciplina táctica y capacidad de lectura del juego.',
    market_value_usd: 850.00
  };

  const handleExportPdfSheet = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      const content = `FICHA TÉCNICA UNIVERSAL DEPORVERSO - SCOUTING PRO\n` +
        `Jugador: ${selectedPlayer.full_name}\n` +
        `Equipo: ${selectedTeam.name}\n` +
        `Dorsal: #${selectedPlayer.jersey_number || 'N/A'}\n` +
        `Posición: ${selectedPlayer.position || 'Polivalente'}\n` +
        `Deporverso Index Rating: ${metadata.sportia_index}/10.0\n` +
        `Estadísticas: ${metadata.goals_count} Goles | ${metadata.assists_count} Asistencias | ${metadata.matches_played} PJ\n` +
        `Atributos: Ritmo ${metadata.pace} | Tiro ${metadata.shooting} | Pase ${metadata.passing} | Regate ${metadata.dribbling} | Defensa ${metadata.defending} | Físico ${metadata.physical}\n` +
        `Informe Scout: ${metadata.scout_notes}\n` +
        `Valor de Mercado Estimado: $${metadata.market_value_usd} USD\n\n` +
        `Certificado por Deporverso Intelligence Engine (Rolando Guerra)`;
      
      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Ficha_Scout_${selectedPlayer.full_name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* SCOUTING HUB BANNER */}
      <div className="bg-gradient-to-r from-[#1c1204] via-[#0d0903] to-[#040910] p-6 sm:p-8 rounded-3xl border border-amber-500/35 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden card-3d-interactive">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3" />
              <span>Scouting Cuántico B2C</span>
            </span>
            <span className="text-amber-400/90 text-xs font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">$12.99 USD / mes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Hub de Scouting & Talent Discovery
          </h1>
          <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
            Buscador universal de talentos comunitarios e interclubes con evaluación <strong>Deporverso Index (1-10)</strong>, radares biomecánicos y exportación de Fichas Técnicas para ojeadores y DTs.
          </p>
        </div>

        {!scoutProUnlocked ? (
          <button
            onClick={() => setScoutProUnlocked(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-5 py-3 rounded-2xl shadow-xl shadow-amber-500/25 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto text-xs hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Suscribirse a Scout PRO ($12.99/mes)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-amber-500/10">
            <Check className="w-4 h-4 text-amber-400" />
            <span className="font-mono">Plan Scout PRO Activo</span>
          </div>
        )}
      </div>

      {/* GRID DE BUSCADOR Y FICHA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: LISTA DE JUGADORES Y FILTROS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre, posición o dorsal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {['ALL', 'Mediocampista', 'Delantero', 'Defensa', 'Arquero'].map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedPosition === pos
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
                  }`}
                >
                  {pos === 'ALL' ? 'Todos' : pos}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredPlayers.map((p) => {
              const meta = MOCK_SCOUTING_DATA[p.id] || { sportia_index: 7.8, goals_count: 2 };
              const isSelected = p.id === selectedPlayerId;
              const tm = teams.find(t => t.id === p.team_id) || { name: 'Equipo' };

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/50 shadow-lg'
                      : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-black text-amber-400 text-sm">
                      #{p.jersey_number || '10'}
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">{p.full_name}</strong>
                      <span className="text-[10px] text-white/50 block">{tm.name} • {p.position || 'Jugador'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20 block">
                      {meta.sportia_index} <span className="text-[9px] font-normal text-white/40">/10</span>
                    </span>
                    <span className="text-[9px] text-white/40 block mt-0.5">{meta.goals_count} Goles</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: FICHA DETALLADA DEL JUGADOR */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-b from-[#09101a] to-[#04070c] rounded-3xl border border-cyan-500/35 p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden card-3d-interactive cyber-sheen-effect">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER JUGADOR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 text-black font-black text-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 font-mono">
                  #{selectedPlayer.jersey_number || '10'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedPlayer.full_name}</h2>
                    <span className="text-[10px] font-mono font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      VERIFICADO QR
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">
                    {selectedTeam.name} | <strong className="text-amber-400">{selectedPlayer.position || 'Mediocampista'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right bg-black/60 border border-amber-400/40 p-3 rounded-2xl shadow-inner font-mono">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Deporverso Index</span>
                  <strong className="text-2xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">{metadata.sportia_index}</strong>
                  <span className="text-[9px] text-white/40 block">/ 10.0 Rating</span>
                </div>

                <button
                  onClick={handleExportPdfSheet}
                  disabled={downloadingPdf}
                  className="p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-colors cursor-pointer text-xs font-bold flex items-center gap-2 shadow-lg"
                  title="Descargar Ficha Técnica"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline font-mono">{downloadingPdf ? 'Exportando...' : 'Ficha PDF'}</span>
                </button>
              </div>
            </div>

            {/* GRID DE ATRIBUTOS TIPO FIFA / FOOTBALL MANAGER */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Radares Biomecánicos & Atributos Clave</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                {[
                  { label: 'Ritmo / Aceleración', val: metadata.pace, color: 'bg-emerald-400' },
                  { label: 'Tiro & Definición', val: metadata.shooting, color: 'bg-amber-400' },
                  { label: 'Pase & Visión', val: metadata.passing, color: 'bg-cyan-400' },
                  { label: 'Regate & Control', val: metadata.dribbling, color: 'bg-purple-400' },
                  { label: 'Defensa & Duelos', val: metadata.defending, color: 'bg-blue-400' },
                  { label: 'Físico & Resistencia', val: metadata.physical, color: 'bg-rose-400' },
                ].map((attr) => (
                  <div key={attr.label} className="p-3.5 bg-black/60 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white/60 text-[10px]">{attr.label}</span>
                      <strong className="text-white font-bold">{attr.val}</strong>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${attr.color} shadow-sm`} style={{ width: `${attr.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMPACTO EN LA TEMPORADA */}
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/20 text-center shadow-md">
                <span className="text-[10px] text-white/50 block">Goles Marcados</span>
                <strong className="text-xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{metadata.goals_count}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/20 text-center shadow-md">
                <span className="text-[10px] text-white/50 block">Asistencias</span>
                <strong className="text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{metadata.assists_count}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/20 text-center shadow-md">
                <span className="text-[10px] text-white/50 block">Valor Estimado</span>
                <strong className="text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">${metadata.market_value_usd}</strong>
              </div>
            </div>

            {/* REPORTE SCOUT PRO */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black/80 to-black/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4" />
                  <span>Informe Táctico de Ojeador (Gemini Flash)</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono">Actualizado en vivo</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans italic">
                "{metadata.scout_notes}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
