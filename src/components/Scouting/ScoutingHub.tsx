import React, { useState, useMemo } from 'react';
import {
  Search,
  Award,
  Sparkles,
  Download,
  FileText,
  Zap,
  Check,
  ArrowLeftRight
} from 'lucide-react';
import { Player, Team, SportCode, ScoutingMetadata } from '../../types';
import { CINEMATIC_ASSETS, getAthletePortrait } from '../../data/cinematicAssets';

interface ScoutingHubProps {
  players: Player[];
  teams: Team[];
  activeSport: SportCode;
}

const MOCK_SCOUTING_DATA: Record<string, ScoutingMetadata> = {
  p1: {
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
    scout_notes:
      'Mediocampista ofensivo con visión periférica de nivel profesional. Excelente cobro de tiros libres.',
    market_value_usd: 2500.0
  },
  p2: {
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
    scout_notes:
      'Delantero centro de alta velocidad y potencia física. Gran definición con ambas piernas.',
    market_value_usd: 1800.0
  },
  p3: {
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
    scout_notes:
      'Defensa central zurdo con salida limpia y capacidad de anticipación en duelos aéreos.',
    market_value_usd: 1200.0
  }
};

function getMetadataForPlayer(player: Player): ScoutingMetadata {
  if (MOCK_SCOUTING_DATA[player.id]) return MOCK_SCOUTING_DATA[player.id];
  const hash = player.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    id: `sc-${player.id}`,
    player_id: player.id,
    tenant_id: player.tenant_id,
    sportia_index: +(7.6 + (hash % 17) * 0.1).toFixed(1),
    pace: 70 + (hash % 23),
    shooting: 65 + ((hash * 3) % 26),
    passing: 72 + ((hash * 5) % 21),
    dribbling: 74 + ((hash * 7) % 20),
    defending: 54 + ((hash * 2) % 34),
    physical: 70 + ((hash * 4) % 22),
    goals_count: 3 + (hash % 12),
    assists_count: 2 + (hash % 8),
    matches_played: 9 + (hash % 5),
    rating_history: [7.5, 7.8, 8.1],
    scout_notes:
      'Jugador versátil con gran disciplina táctica, lectura del juego y despliegue físico constante.',
    market_value_usd: 850 + (hash % 9) * 150
  };
}

export const ScoutingHub: React.FC<ScoutingHubProps> = ({ players, teams, activeSport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || 'p1');
  const [comparePlayerId, setComparePlayerId] = useState<string>('');
  const [scoutProUnlocked, setScoutProUnlocked] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.full_name.toLowerCase().includes(q) ||
        (p.position || '').toLowerCase().includes(q) ||
        String(p.jersey_number || '').includes(q);
      const matchesPos = selectedPosition === 'ALL' || p.position === selectedPosition;
      return matchesSearch && matchesPos;
    });
  }, [players, searchQuery, selectedPosition]);

  const selectedPlayer =
    players.find((p) => p.id === selectedPlayerId) ||
    players[0] || {
      id: 'p1',
      full_name: 'Esteban Guerra',
      jersey_number: 10,
      position: 'Mediocampista',
      qr_code: 'qr-p1',
      team_id: 'team-1',
      tenant_id: 't-pichincha',
      is_active: true
    };

  const comparePlayer = players.find((p) => p.id === comparePlayerId && p.id !== selectedPlayer.id) || null;
  const selectedTeam = teams.find((t) => t.id === selectedPlayer.team_id) || { name: 'Deportivo Quito Barrial' };
  const metadata = getMetadataForPlayer(selectedPlayer);
  const compareMeta = comparePlayer ? getMetadataForPlayer(comparePlayer) : null;

  const radarAxes = [
    { label: 'RIT', a: metadata.pace, b: compareMeta?.pace ?? 0 },
    { label: 'TIR', a: metadata.shooting, b: compareMeta?.shooting ?? 0 },
    { label: 'PAS', a: metadata.passing, b: compareMeta?.passing ?? 0 },
    { label: 'REG', a: metadata.dribbling, b: compareMeta?.dribbling ?? 0 },
    { label: 'DEF', a: metadata.defending, b: compareMeta?.defending ?? 0 },
    { label: 'FÍS', a: metadata.physical, b: compareMeta?.physical ?? 0 }
  ];

  const toPolygon = (vals: number[], cx = 95, cy = 88, r = 64) =>
    vals
      .map((v, i) => {
        const ang = (Math.PI * 2 * i) / vals.length - Math.PI / 2;
        const d = (Math.max(15, Math.min(100, v)) / 100) * r;
        return `${(cx + Math.cos(ang) * d).toFixed(1)},${(cy + Math.sin(ang) * d).toFixed(1)}`;
      })
      .join(' ');

  const handleExportPdfSheet = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      const content =
        `FICHA TÉCNICA UNIVERSAL DEPORVERSO - SCOUTING PRO\n` +
        `Deporte: ${activeSport}\n` +
        `Jugador: ${selectedPlayer.full_name}\n` +
        `Equipo: ${selectedTeam.name}\n` +
        `Dorsal: #${selectedPlayer.jersey_number || 'N/A'}\n` +
        `Posición: ${selectedPlayer.position || 'Polivalente'}\n` +
        `Deporverso Index Rating: ${metadata.sportia_index}/10.0\n` +
        `Estadísticas: ${metadata.goals_count} Goles | ${metadata.assists_count} Asistencias | ${metadata.matches_played} PJ\n` +
        `Atributos: Ritmo ${metadata.pace} | Tiro ${metadata.shooting} | Pase ${metadata.passing} | Regate ${metadata.dribbling} | Defensa ${metadata.defending} | Físico ${metadata.physical}\n` +
        `Informe Scout: ${metadata.scout_notes}\n` +
        `Valor de Mercado Estimado: $${metadata.market_value_usd} USD\n\n` +
        `Certificado por Deporverso Intelligence Engine`;

      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Ficha_Scout_${selectedPlayer.full_name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* SCOUTING HUB BANNER CINEMÁTICO */}
      <div className="cine-stage-frame bg-[#080d1a]">
        <div className="relative p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <img
            src={CINEMATIC_ASSETS.clubTunnel}
            alt="Scouting Profesional"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="cine-scrim-hero" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap text-xs font-mono">
              <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Scouting & Talent Discovery
              </span>
              <span className="text-white/25">·</span>
              <span className="text-slate-300 font-semibold">$12.99 USD / mes</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hub de Scouting Biomecánico & Comparativa
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Evaluación <strong>Deporverso Index (1-10)</strong>, radares comparativos cara a cara y exportación de fichas técnicas para ojeadores y directores técnicos.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            {!scoutProUnlocked ? (
              <button
                type="button"
                onClick={() => setScoutProUnlocked(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap text-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Activar Scout PRO ($12.99/mes)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-amber-400/15 border border-amber-400/35 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">Plan Scout PRO Activo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRID DE BUSCADOR Y FICHA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: LISTA CON RETRATOS FOTORREALISTAS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="cine-surface p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, posición o dorsal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-amber-400/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="deporverso-segmented-nav no-scrollbar flex items-center gap-1 overflow-x-auto text-xs">
              {['ALL', 'Mediocampista', 'Delantero', 'Defensa', 'Arquero'].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setSelectedPosition(pos)}
                  className={`whitespace-nowrap transition-all cursor-pointer ${
                    selectedPosition === pos ? 'deporverso-tab-pill-active font-semibold' : 'deporverso-tab-pill-inactive'
                  }`}
                >
                  {pos === 'ALL' ? 'Todos' : pos}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1 tabular-nums">
            {filteredPlayers.map((p) => {
              const meta = getMetadataForPlayer(p);
              const isSelected = p.id === selectedPlayer.id;
              const tm = teams.find((t) => t.id === p.team_id) || { name: 'Equipo' };

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/45 shadow-sm'
                      : 'bg-[#080d1a]/75 border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.photo_url || getAthletePortrait(p.id)}
                      alt={p.full_name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = getAthletePortrait(p.id);
                      }}
                      className="w-10 h-10 rounded-xl object-cover object-top border border-white/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-white block truncate">
                        #{p.jersey_number || '10'} · {p.full_name}
                      </strong>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {tm.name} · {p.position || 'Jugador'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400 font-mono block">
                      {meta.sportia_index} <span className="text-[9px] font-normal text-white/40">/10</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">{meta.goals_count} Goles</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: FICHA DETALLADA + RADAR COMPARATIVO */}
        <div className="lg:col-span-7 space-y-4">
          <div className="cine-surface p-6 sm:p-7 space-y-6 tabular-nums">
            {/* HEADER JUGADOR CON FOTO DE ESTUDIO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={selectedPlayer.photo_url || getAthletePortrait(selectedPlayer.id)}
                  alt={selectedPlayer.full_name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = getAthletePortrait(selectedPlayer.id);
                  }}
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-amber-400/60 shadow-lg shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                      {selectedPlayer.full_name}
                    </h2>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      · QR VERIFICADO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    #{selectedPlayer.jersey_number || '10'} · {selectedTeam.name} ·{' '}
                    <strong className="text-amber-300">{selectedPlayer.position || 'Mediocampista'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right bg-black/55 border border-amber-400/35 px-3.5 py-2 rounded-xl font-mono">
                  <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">Deporverso Index</span>
                  <strong className="text-2xl font-black text-amber-400">{metadata.sportia_index}</strong>
                  <span className="text-[10px] text-slate-400 ml-1">/10</span>
                </div>

                <button
                  type="button"
                  onClick={handleExportPdfSheet}
                  disabled={downloadingPdf}
                  className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl border border-white/10 transition-colors cursor-pointer text-xs font-bold flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{downloadingPdf ? 'Exportando...' : 'Ficha TXT'}</span>
                </button>
              </div>
            </div>

            {/* RADAR SVG + COMPARADOR DE JUGADORES */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-black/35 rounded-2xl border border-white/10 p-4">
              <div className="md:col-span-5 flex flex-col items-center">
                <svg viewBox="0 0 190 176" className="w-48 h-44">
                  {[0.33, 0.66, 1].map((s) => (
                    <polygon
                      key={s}
                      points={toPolygon(radarAxes.map(() => Math.round(100 * s)))}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  {compareMeta && (
                    <polygon
                      points={toPolygon(radarAxes.map((ax) => ax.b))}
                      fill="rgba(34, 211, 238, 0.16)"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}
                  <polygon
                    points={toPolygon(radarAxes.map((ax) => ax.a))}
                    fill="rgba(251, 191, 36, 0.25)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  {radarAxes.map((ax, i) => {
                    const ang = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
                    return (
                      <text
                        key={ax.label}
                        x={95 + Math.cos(ang) * 76}
                        y={88 + Math.sin(ang) * 76 + 3}
                        textAnchor="middle"
                        className="fill-slate-300 text-[9px] font-mono font-bold"
                      >
                        {ax.label}
                      </text>
                    );
                  })}
                </svg>

                {/* Selector Comparar Jugador B */}
                <div className="w-full pt-1">
                  <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mb-1">
                    <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                    Comparar en Radar vs:
                  </label>
                  <select
                    value={comparePlayerId}
                    onChange={(e) => setComparePlayerId(e.target.value)}
                    className="w-full bg-[#090f1d] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white cursor-pointer outline-none focus:border-cyan-400"
                  >
                    <option value="">Sin comparación</option>
                    {players
                      .filter((p) => p.id !== selectedPlayer.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.jersey_number || '-'} {p.full_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Atributos Detallados */}
              <div className="md:col-span-7 grid grid-cols-2 gap-2.5 font-mono">
                {[
                  { label: 'Ritmo', val: metadata.pace, cmp: compareMeta?.pace, color: 'bg-emerald-400' },
                  { label: 'Tiro', val: metadata.shooting, cmp: compareMeta?.shooting, color: 'bg-amber-400' },
                  { label: 'Pase', val: metadata.passing, cmp: compareMeta?.passing, color: 'bg-cyan-400' },
                  { label: 'Regate', val: metadata.dribbling, cmp: compareMeta?.dribbling, color: 'bg-purple-400' },
                  { label: 'Defensa', val: metadata.defending, cmp: compareMeta?.defending, color: 'bg-blue-400' },
                  { label: 'Físico', val: metadata.physical, cmp: compareMeta?.physical, color: 'bg-rose-400' }
                ].map((attr) => (
                  <div key={attr.label} className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">{attr.label}</span>
                      <strong className="text-white">
                        {attr.val}
                        {attr.cmp !== undefined && (
                          <span className="text-cyan-300 font-normal ml-1">/ {attr.cmp}</span>
                        )}
                      </strong>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${attr.color}`} style={{ width: `${attr.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMPACTO EN LA TEMPORADA */}
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-black/45 border border-emerald-500/20 text-center">
                <span className="text-[10px] text-slate-400 block">Goles Marcados</span>
                <strong className="text-xl font-black text-emerald-400">{metadata.goals_count}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-black/45 border border-cyan-500/20 text-center">
                <span className="text-[10px] text-slate-400 block">Asistencias</span>
                <strong className="text-xl font-black text-cyan-400">{metadata.assists_count}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-black/45 border border-amber-500/20 text-center">
                <span className="text-[10px] text-slate-400 block">Valor Estimado</span>
                <strong className="text-xl font-black text-amber-400">${metadata.market_value_usd}</strong>
              </div>
            </div>

            {/* REPORTE SCOUT PRO */}
            <div className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4" />
                  <span>Informe Táctico Oficial de Ojeador</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> Certificado
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                &quot;{metadata.scout_notes}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

