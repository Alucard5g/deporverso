import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Play, Pause, RotateCcw, Plus, Minus, QrCode, Shield, CheckCircle, Clock, 
  AlertCircle, Save, Database, UserCheck, FileText, Check, Award, Flame,
  Share2, ArrowRight, UserPlus, Flag, Sparkles, CheckCircle2, ChevronRight,
  Camera, CheckSquare, Square, Lock, Unlock, Eye, RefreshCw, Smartphone, Users
} from 'lucide-react';
import { Match, MatchEvent, Player, Sport, Tenant, Team, PlayerMatchStat, VocalReport, RefereeReport, CaptainApproval } from '../../types';
import { TradingCardCarnet } from '../LeaguePortal/TradingCardCarnet';
import { ContinuousQrScannerModal } from './ContinuousQrScannerModal';

interface VocaliaDigitalProps {
  matches: Match[];
  tenant?: Tenant;
  teams?: Team[];
  sport?: Sport;
  players: Player[];
  events: MatchEvent[];
  onAddEvent: (event: Omit<MatchEvent, 'id' | 'created_at'>) => void;
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number, matchData?: any) => void;
  onSaveVocalia?: (params: {
    matchId: string;
    tenantId: string;
    homeScore: number;
    awayScore: number;
    playerStats: Record<string, PlayerMatchStat>;
    vocalReport: VocalReport;
    refereeReport: RefereeReport;
    homeCaptainApproval?: CaptainApproval;
    awayCaptainApproval?: CaptainApproval;
    status: 'IN_PROGRESS' | 'FINISHED';
  }) => Promise<any>;
}

export const VocaliaDigital: React.FC<VocaliaDigitalProps> = ({
  matches,
  tenant,
  teams = [],
  sport,
  players,
  events,
  onAddEvent,
  onUpdateScore,
  onSaveVocalia
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  // View layout mode for player panels: 'DUAL' (both teams side-by-side) or 'TABS' (toggle tabs)
  const [panelViewMode, setPanelViewMode] = useState<'DUAL' | 'TABS'>('DUAL');
  const [activeTeamTab, setActiveTeamTab] = useState<'HOME' | 'AWAY'>('HOME');

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 mins default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<string>(activeMatch?.match_data?.current_period || '1ST_HALF');

  // Search player inside roster
  const [playerSearchQueryHome, setPlayerSearchQueryHome] = useState('');
  const [playerSearchQueryAway, setPlayerSearchQueryAway] = useState('');

  // Manual QR input state & scanned card preview
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scannedPlayer, setScannedPlayer] = useState<Player | null>(null);

  // Continuous Camera QR Scanner Modal
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [scannerTargetTeam, setScannerTargetTeam] = useState<'AUTO' | 'HOME' | 'AWAY'>('AUTO');

  const handleOpenQrScannerForTeam = (targetTeam: 'AUTO' | 'HOME' | 'AWAY') => {
    setScannerTargetTeam(targetTeam);
    setIsCameraScannerOpen(true);
  };

  // Quick Add Player modal states for Home and Away
  const [showAddPlayerHome, setShowAddPlayerHome] = useState(false);
  const [showAddPlayerAway, setShowAddPlayerAway] = useState(false);
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');

  // Player stats state map: playerId -> PlayerMatchStat
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerMatchStat>>({});

  // Verified QR players set (player_ids who have scanned their carnet)
  const [verifiedQrPlayers, setVerifiedQrPlayers] = useState<Set<string>>(new Set());

  // Captain Approvals State
  const [homeCaptainApproval, setHomeCaptainApproval] = useState<CaptainApproval>({
    captain_name: 'Capitán Juan Carlos Paredes',
    captain_number: 10,
    approved: false,
    approved_at: '',
    comments: 'Planilla revisada y conforme al inicio del encuentro.'
  });

  const [awayCaptainApproval, setAwayCaptainApproval] = useState<CaptainApproval>({
    captain_name: 'Capitán Christian Noboa',
    captain_number: 8,
    approved: false,
    approved_at: '',
    comments: 'Nómina de jugadores verificada con carnets digitales.'
  });

  // Vocal Report State
  const [vocalReport, setVocalReport] = useState<VocalReport>({
    vocal_name: 'Ing. Rodrigo Almendariz',
    vocal_cedula: '1712498231',
    observations: 'Cancha y balones reglamentarios Nº 5 entregados por ambos delegados a tiempo. Credenciales QR verificadas sin irregularidades.',
    status: 'CONFORME',
    start_time: '10:05',
    end_time: '11:55',
    signed: true,
    ball_conditions: 'Excelente (2 balones oficiales entregados)',
    uniforms_status: 'Uniformes reglamentarios completos',
    saved_at: ''
  });

  // Referee Report State
  const [refereeReport, setRefereeReport] = useState<RefereeReport>({
    main_referee: 'Árbitro Jorge Benítez',
    assistant_1: 'Marco Vinicio Guayasamín',
    assistant_2: 'Luis Morales',
    fourth_official: 'Patricio Córdova',
    disciplinary_notes: 'Partido disputado con intensidad deportiva. Se exhibieron tarjetas reglamentarias sin incidentes mayores.',
    incidents: 'Sin reclamos anómalos de las bancas ni invasión de público.',
    signatures_verified: true,
    pitch_conditions: 'Césped sintético seco en óptimas condiciones',
    saved_at: ''
  });

  // Match status to save
  const [matchStatusToSave, setMatchStatusToSave] = useState<'IN_PROGRESS' | 'FINISHED'>('IN_PROGRESS');

  // Confirmation Modal & Save state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSavingFirebase, setIsSavingFirebase] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<string | null>(null);

  // Sync state when activeMatch changes
  useEffect(() => {
    if (!activeMatch) return;

    setCurrentPeriod(activeMatch.match_data?.current_period || '1ST_HALF');

    // Load initial player stats from match_data or initialize from roster
    const homeTeamId = activeMatch.home_team_id;
    const awayTeamId = activeMatch.away_team_id;

    const initialStats: Record<string, PlayerMatchStat> = { ...(activeMatch.match_data?.player_stats || {}) };

    // Initialize players for both teams
    const matchPlayers = players.filter(p => p.team_id === homeTeamId || p.team_id === awayTeamId);
    matchPlayers.forEach(p => {
      if (!initialStats[p.id]) {
        initialStats[p.id] = {
          player_id: p.id,
          jersey_number: p.jersey_number || 0,
          player_name: p.full_name,
          team_id: p.team_id || (p.team_id === awayTeamId ? awayTeamId : homeTeamId),
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          is_starter: true
        };
      }
    });

    setPlayerStats(initialStats);

    // Initialize reports and captain approvals
    if (activeMatch.match_data?.vocal_report) {
      setVocalReport(activeMatch.match_data.vocal_report);
    }
    if (activeMatch.match_data?.referee_report) {
      setRefereeReport(activeMatch.match_data.referee_report);
    }
    if (activeMatch.match_data?.home_captain_approval) {
      setHomeCaptainApproval(activeMatch.match_data.home_captain_approval);
    }
    if (activeMatch.match_data?.away_captain_approval) {
      setAwayCaptainApproval(activeMatch.match_data.away_captain_approval);
    }
    setMatchStatusToSave(activeMatch.status === 'FINISHED' ? 'FINISHED' : 'IN_PROGRESS');
  }, [activeMatch?.id]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!activeMatch) {
    return (
      <div className="p-12 text-center text-white bg-[#0a0a0a] rounded-2xl border border-white/10">
        <p className="text-base font-medium">No hay partidos disponibles para la liga seleccionada.</p>
      </div>
    );
  }

  const homeTeam = activeMatch.home_team || teams.find(t => t.id === activeMatch.home_team_id);
  const awayTeam = activeMatch.away_team || teams.find(t => t.id === activeMatch.away_team_id);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute calculated scores from player stats
  const homeGoalsFromStats = Object.values(playerStats)
    .filter(s => s.team_id === activeMatch.home_team_id)
    .reduce((sum, s) => sum + s.goals, 0);

  const awayGoalsFromStats = Object.values(playerStats)
    .filter(s => s.team_id === activeMatch.away_team_id)
    .reduce((sum, s) => sum + s.goals, 0);

  // Total cards
  const totalYellowCards = Object.values(playerStats).reduce((sum, s) => sum + s.yellow_cards, 0);
  const totalRedCards = Object.values(playerStats).reduce((sum, s) => sum + s.red_cards, 0);

  // Increments & Decrements for Player Stats
  const updatePlayerGoals = (playerId: string, delta: number) => {
    const current = playerStats[playerId];
    if (!current) return;
    const newGoals = Math.max(0, current.goals + delta);
    const updated = { ...playerStats, [playerId]: { ...current, goals: newGoals } };
    
    const newHomeScore = Object.values(updated)
      .filter(s => s.team_id === activeMatch.home_team_id)
      .reduce((sum, s) => sum + s.goals, 0);
    const newAwayScore = Object.values(updated)
      .filter(s => s.team_id === activeMatch.away_team_id)
      .reduce((sum, s) => sum + s.goals, 0);

    setPlayerStats(updated);
    onUpdateScore(activeMatch.id, newHomeScore, newAwayScore);

    if (delta > 0) {
      onAddEvent({
        tenant_id: activeMatch.tenant_id,
        match_id: activeMatch.id,
        team_id: current.team_id,
        player_id: playerId,
        event_type: 'GOAL',
        period: currentPeriod,
        timestamp_seconds: timerSeconds,
        player_name: current.player_name,
        team_name: current.team_id === activeMatch.home_team_id ? homeTeam?.name : awayTeam?.name,
        details: { jersey_number: current.jersey_number, points: 1 }
      });
    }
  };

  const updatePlayerYellowCards = (playerId: string, delta: number) => {
    const current = playerStats[playerId];
    if (!current) return;
    const newYellow = Math.max(0, current.yellow_cards + delta);
    
    let newRed = current.red_cards;
    if (newYellow >= 2 && current.yellow_cards < 2) {
      newRed = Math.max(1, newRed);
    }

    const updated = { ...playerStats, [playerId]: { ...current, yellow_cards: newYellow, red_cards: newRed } };
    setPlayerStats(updated);

    if (delta > 0) {
      onAddEvent({
        tenant_id: activeMatch.tenant_id,
        match_id: activeMatch.id,
        team_id: current.team_id,
        player_id: playerId,
        event_type: 'YELLOW_CARD',
        period: currentPeriod,
        timestamp_seconds: timerSeconds,
        player_name: current.player_name,
        team_name: current.team_id === activeMatch.home_team_id ? homeTeam?.name : awayTeam?.name,
        details: { jersey_number: current.jersey_number }
      });
    }
  };

  const updatePlayerRedCards = (playerId: string, delta: number) => {
    const current = playerStats[playerId];
    if (!current) return;
    const newRed = Math.max(0, current.red_cards + delta);
    const updated = { ...playerStats, [playerId]: { ...current, red_cards: newRed } };
    setPlayerStats(updated);

    if (delta > 0) {
      onAddEvent({
        tenant_id: activeMatch.tenant_id,
        match_id: activeMatch.id,
        team_id: current.team_id,
        player_id: playerId,
        event_type: 'RED_CARD',
        period: currentPeriod,
        timestamp_seconds: timerSeconds,
        player_name: current.player_name,
        team_name: current.team_id === activeMatch.home_team_id ? homeTeam?.name : awayTeam?.name,
        details: { jersey_number: current.jersey_number }
      });
    }
  };

  // Add custom player on the fly
  const handleAddNewPlayer = (targetTeamId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !newPlayerNumber) return;

    const newId = `pl-custom-${Date.now()}`;
    const newStat: PlayerMatchStat = {
      player_id: newId,
      jersey_number: parseInt(newPlayerNumber, 10) || 0,
      player_name: newPlayerName.trim(),
      team_id: targetTeamId,
      goals: 0,
      yellow_cards: 0,
      red_cards: 0,
      is_starter: false
    };

    setPlayerStats(prev => ({
      ...prev,
      [newId]: newStat
    }));

    setNewPlayerName('');
    setNewPlayerNumber('');
    setShowAddPlayerHome(false);
    setShowAddPlayerAway(false);
  };

  // Continuous QR Scanner Handlers
  const handlePlayerScannedContinuous = (scannedP: Player, targetTeamId: string) => {
    setScannedPlayer(scannedP);
    setVerifiedQrPlayers(prev => new Set(prev).add(scannedP.id));

    setPlayerStats(prev => {
      if (prev[scannedP.id]) {
        return {
          ...prev,
          [scannedP.id]: {
            ...prev[scannedP.id],
            team_id: targetTeamId
          }
        };
      }

      return {
        ...prev,
        [scannedP.id]: {
          player_id: scannedP.id,
          jersey_number: scannedP.jersey_number || 0,
          player_name: scannedP.full_name,
          team_id: targetTeamId,
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          is_starter: true
        }
      };
    });
  };

  const handleRegisterCustomScanned = (data: { jerseyNumber: number; name: string; teamId: string; qrCode: string }) => {
    const customId = `pl-qr-${data.qrCode.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || Date.now()}`;
    setVerifiedQrPlayers(prev => new Set(prev).add(customId));

    setPlayerStats(prev => ({
      ...prev,
      [customId]: {
        player_id: customId,
        jersey_number: data.jerseyNumber,
        player_name: data.name,
        team_id: data.teamId,
        goals: 0,
        yellow_cards: 0,
        red_cards: 0,
        is_starter: true
      }
    }));
  };

  // Manual QR input verification
  const handleVerifyQrManual = (e: React.FormEvent) => {
    e.preventDefault();
    const found = players.find(p => p.qr_code.toLowerCase() === qrCodeInput.trim().toLowerCase());
    if (found) {
      handlePlayerScannedContinuous(found, found.team_id || activeMatch.home_team_id);
    } else {
      alert('Carnet QR no encontrado en la base de datos de esta liga.');
    }
  };

  // Toggle Captain Approval for Local or Away
  const toggleHomeCaptainApproval = () => {
    setHomeCaptainApproval(prev => ({
      ...prev,
      approved: !prev.approved,
      approved_at: !prev.approved ? new Date().toISOString() : ''
    }));
  };

  const toggleAwayCaptainApproval = () => {
    setAwayCaptainApproval(prev => ({
      ...prev,
      approved: !prev.approved,
      approved_at: !prev.approved ? new Date().toISOString() : ''
    }));
  };

  // Confirm and Save Vocalia to Firebase
  const handleConfirmSaveFirebase = async () => {
    setIsSavingFirebase(true);

    const payload = {
      matchId: activeMatch.id,
      tenantId: activeMatch.tenant_id,
      homeScore: homeGoalsFromStats,
      awayScore: awayGoalsFromStats,
      playerStats,
      vocalReport: {
        ...vocalReport,
        saved_at: new Date().toISOString()
      },
      refereeReport: {
        ...refereeReport,
        saved_at: new Date().toISOString()
      },
      homeCaptainApproval: {
        ...homeCaptainApproval,
        approved_at: homeCaptainApproval.approved ? (homeCaptainApproval.approved_at || new Date().toISOString()) : ''
      },
      awayCaptainApproval: {
        ...awayCaptainApproval,
        approved_at: awayCaptainApproval.approved ? (awayCaptainApproval.approved_at || new Date().toISOString()) : ''
      },
      status: matchStatusToSave
    };

    try {
      if (onSaveVocalia) {
        await onSaveVocalia(payload);
      } else {
        onUpdateScore(activeMatch.id, homeGoalsFromStats, awayGoalsFromStats, {
          player_stats: playerStats,
          vocal_report: payload.vocalReport,
          referee_report: payload.refereeReport,
          home_captain_approval: payload.homeCaptainApproval,
          away_captain_approval: payload.awayCaptainApproval,
          is_public_published: true,
          firebase_doc_id: `firestore://tenants/${activeMatch.tenant_id}/matches/${activeMatch.id}`,
          last_synced_at: new Date().toISOString()
        });
      }

      setIsConfirmModalOpen(false);
      setSaveSuccessNotification(`¡Acta Oficial y Aprobaciones de Capitanes guardadas en Firebase para ${tenant?.name || 'la liga'}!`);
      setTimeout(() => setSaveSuccessNotification(null), 6000);
    } catch (err) {
      console.error(err);
      alert('Error al sincronizar con Firebase. Intente nuevamente.');
    } finally {
      setIsSavingFirebase(false);
    }
  };

  // Filtered player lists for both teams
  const homePlayersList = Object.values(playerStats)
    .filter(stat => stat.team_id === activeMatch.home_team_id)
    .filter(stat => 
      stat.player_name.toLowerCase().includes(playerSearchQueryHome.toLowerCase()) || 
      stat.jersey_number.toString().includes(playerSearchQueryHome)
    )
    .sort((a, b) => a.jersey_number - b.jersey_number);

  const awayPlayersList = Object.values(playerStats)
    .filter(stat => stat.team_id === activeMatch.away_team_id)
    .filter(stat => 
      stat.player_name.toLowerCase().includes(playerSearchQueryAway.toLowerCase()) || 
      stat.jersey_number.toString().includes(playerSearchQueryAway)
    )
    .sort((a, b) => a.jersey_number - b.jersey_number);

  const matchEvents = events.filter(e => e.match_id === activeMatch.id);

  // Helper component to render a single team's player table
  const renderTeamPlayerTable = (
    teamType: 'HOME' | 'AWAY',
    team: Team | undefined,
    teamId: string,
    playerList: PlayerMatchStat[],
    searchQuery: string,
    setSearchQuery: (val: string) => void,
    showAddForm: boolean,
    setShowAddForm: (val: boolean) => void,
    colorAccent: 'cyan' | 'teal'
  ) => {
    const isCyan = colorAccent === 'cyan';
    const accentClass = isCyan ? 'text-cyan-400 border-cyan-500/30' : 'text-teal-400 border-teal-500/30';
    const btnPlusClass = isCyan ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-teal-500 hover:bg-teal-400 text-black';

    return (
      <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex-1">
        {/* Header of team panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isCyan ? 'bg-cyan-400' : 'bg-teal-400'} shadow-[0_0_8px_currentColor]`}></div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-white truncate">{team?.name || (teamType === 'HOME' ? 'Local' : 'Visitante')}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${accentClass} bg-white/5`}>
                  {teamType === 'HOME' ? 'LOCAL' : 'VISITANTE'}
                </span>
              </div>
              <p className="text-[11px] text-[#A0A0A0]">
                {playerList.length} Jugadores en Nómina • {teamType === 'HOME' ? homeGoalsFromStats : awayGoalsFromStats} Goles Totales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
            {/* Team Specific QR Camera Scanner Button */}
            <button
              type="button"
              onClick={() => handleOpenQrScannerForTeam(teamType)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                teamType === 'HOME'
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
                  : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border-teal-500/40 hover:border-teal-400'
              }`}
              title={`Escanear carnets QR asignando a ${team?.name || (teamType === 'HOME' ? 'Local' : 'Visitante')}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>📷 QR {teamType === 'HOME' ? 'Local' : 'Visitante'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-[#181818] hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>+ Inscribir</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder={`Buscar por número o nombre en ${team?.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00ff66]"
          />
        </div>

        {/* Quick Add Player Form */}
        {showAddForm && (
          <form onSubmit={(e) => handleAddNewPlayer(teamId, e)} className="bg-[#141414] p-3.5 rounded-xl border border-[#00ff66]/30 space-y-2.5 animate-fade-in text-xs">
            <h5 className="font-black uppercase text-[11px] text-[#00ff66]">Inscribir Jugador en Mesa ({team?.name})</h5>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Dorsal (Ej. 10)"
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                  required
                  className="w-full bg-[#080808] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#00ff66]"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Nombre Completo"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  required
                  className="w-full bg-[#080808] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#00ff66]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-xs text-[#A0A0A0] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 bg-[#00ff66] text-black font-black text-xs rounded-lg cursor-pointer hover:bg-[#00ff66]/90"
              >
                Guardar en Planilla
              </button>
            </div>
          </form>
        )}

        {/* Player Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase font-black tracking-wider text-[#A0A0A0] bg-[#141414]">
                <th className="py-2.5 px-2 text-center w-12">Nº</th>
                <th className="py-2.5 px-3">JUGADOR</th>
                <th className="py-2.5 px-2 text-center">GOLES (⚽)</th>
                <th className="py-2.5 px-2 text-center">AMARILLA (🟨)</th>
                <th className="py-2.5 px-2 text-center">ROJA (🟥)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {playerList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#A0A0A0] text-xs">
                    Sin jugadores registrados. Escanea sus carnets QR o inscríbelos manualmente.
                  </td>
                </tr>
              ) : (
                playerList.map((stat) => {
                  const hasRed = stat.red_cards > 0;
                  const isVerified = verifiedQrPlayers.has(stat.player_id);

                  return (
                    <tr 
                      key={stat.player_id}
                      className={`hover:bg-white/5 transition-colors ${hasRed ? 'bg-red-500/5' : ''}`}
                    >
                      {/* Dorsal */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/10 text-white font-mono font-black text-xs flex items-center justify-center mx-auto shadow-sm">
                          {stat.jersey_number || '-'}
                        </div>
                      </td>

                      {/* Nombre & Badge */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold block text-xs ${hasRed ? 'text-red-300 line-through' : 'text-white'}`}>
                            {stat.player_name}
                          </span>
                          {isVerified && (
                            <span className="px-1.5 py-0.2 rounded bg-[#00ff66]/15 text-[#00ff66] text-[9px] font-bold border border-[#00ff66]/30 flex items-center gap-0.5" title="Carnet QR Verificado por Cámara">
                              <CheckCircle className="w-2.5 h-2.5" /> QR OK
                            </span>
                          )}
                          {hasRed && (
                            <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-black border border-red-500/30">
                              EXPULSADO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* GOLES +/- */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg border border-white/10">
                          <button
                            disabled={stat.goals <= 0}
                            onClick={() => updatePlayerGoals(stat.player_id, -1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-black cursor-pointer transition-all"
                            title="Restar gol"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-6 text-center font-mono font-black text-xs text-[#00ff66]">
                            {stat.goals}
                          </span>

                          <button
                            onClick={() => updatePlayerGoals(stat.player_id, 1)}
                            className={`w-6 h-6 rounded ${btnPlusClass} flex items-center justify-center font-black cursor-pointer shadow-sm transition-all`}
                            title="Sumar gol"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* AMARILLAS +/- */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg border border-white/10">
                          <button
                            disabled={stat.yellow_cards <= 0}
                            onClick={() => updatePlayerYellowCards(stat.player_id, -1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-black cursor-pointer transition-all"
                            title="Restar tarjeta amarilla"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-6 text-center font-mono font-black text-xs text-amber-400">
                            {stat.yellow_cards}
                          </span>

                          <button
                            disabled={stat.yellow_cards >= 2}
                            onClick={() => updatePlayerYellowCards(stat.player_id, 1)}
                            className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center font-black cursor-pointer shadow-sm transition-all disabled:opacity-30"
                            title="Sumar tarjeta amarilla"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* ROJAS +/- */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg border border-white/10">
                          <button
                            disabled={stat.red_cards <= 0}
                            onClick={() => updatePlayerRedCards(stat.player_id, -1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-black cursor-pointer transition-all"
                            title="Restar tarjeta roja"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-6 text-center font-mono font-black text-xs text-red-400">
                            {stat.red_cards}
                          </span>

                          <button
                            disabled={stat.red_cards >= 1}
                            onClick={() => updatePlayerRedCards(stat.player_id, 1)}
                            className="w-6 h-6 rounded bg-red-500 hover:bg-red-400 text-white flex items-center justify-center font-black cursor-pointer shadow-sm transition-all disabled:opacity-30"
                            title="Sumar tarjeta roja (expulsión)"
                          >
                            <Plus className="w-3 h-3" />
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessNotification && (
        <div className="bg-[#00ff66]/15 border border-[#00ff66] p-4 rounded-2xl flex items-center justify-between shadow-2xl animate-fade-in text-[#00ff66]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-black uppercase tracking-wider text-sm">Sincronización Firebase Exitosa</h4>
              <p className="text-xs text-white/90 font-medium mt-0.5">{saveSuccessNotification}</p>
            </div>
          </div>
          <button 
            onClick={() => setSaveSuccessNotification(null)}
            className="text-xs text-[#00ff66] underline font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Continuous Camera QR Scanner Modal */}
      <ContinuousQrScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        players={players}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamId={activeMatch.home_team_id}
        awayTeamId={activeMatch.away_team_id}
        initialTargetTeam={scannerTargetTeam}
        onPlayerScanned={handlePlayerScannedContinuous}
        onRegisterCustomScanned={handleRegisterCustomScanned}
      />

      {/* Top Banner & League Header */}
      <div className="bg-gradient-to-r from-[#0a1524] via-[#050d17] to-[#040c0f] p-6 sm:p-8 rounded-3xl border border-cyan-500/35 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xl relative overflow-hidden card-3d-interactive">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="bg-amber-500 text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Vocalía Digital Cuántica
            </span>
            <span className="text-[#00ff66] text-xs font-black uppercase tracking-wider drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
              {tenant?.name || 'LIGA DEPORTIVA'}
            </span>
            <span className="text-xs text-white/50 font-mono">| {activeMatch.field_location}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Mesa de Control & Vocalía Automatizada</h1>
          <p className="text-xs text-white/60 font-normal max-w-2xl leading-relaxed">
            Panel dual de jugadores para ambos equipos, lectura QR continua por cámara para cada club, aprobación biométrica de capitanes y actas oficiales sincronizadas con Firebase.
          </p>
        </div>

        {/* Quick Action Buttons & Match Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* DUAL CAMERA CONTINUOUS QR BUTTONS (FOR BOTH TEAMS) */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* QR Local Button */}
            <button
              type="button"
              onClick={() => handleOpenQrScannerForTeam('HOME')}
              className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-[1.02]"
              title={`Escanear carnets asignando directamente a ${homeTeam?.name || 'Equipo Local'}`}
            >
              <Camera className="w-4 h-4 text-black stroke-[2.5]" />
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-mono opacity-80">CÁMARA QR</span>
                <span>🔵 LOCAL: {homeTeam?.name || 'Local'}</span>
              </div>
            </button>

            {/* QR Visitante Button */}
            <button
              type="button"
              onClick={() => handleOpenQrScannerForTeam('AWAY')}
              className="px-4 py-3 bg-teal-500 hover:bg-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-[1.02]"
              title={`Escanear carnets asignando directamente a ${awayTeam?.name || 'Equipo Visitante'}`}
            >
              <Camera className="w-4 h-4 text-black stroke-[2.5]" />
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-mono opacity-80">CÁMARA QR</span>
                <span>🟢 VISITANTE: {awayTeam?.name || 'Visitante'}</span>
              </div>
            </button>
          </div>

          {/* Match Selector */}
          <div className="bg-black/60 p-2.5 rounded-2xl border border-white/10 min-w-[240px]">
            <label className="block text-[9px] font-bold text-white/50 uppercase tracking-widest px-1 mb-1 flex items-center justify-between font-mono">
              <span>Partido en Mesa</span>
              <span className="text-[#00ff66] font-mono text-[9px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
                EN VIVO
              </span>
            </label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full bg-[#080808] text-white font-bold text-xs p-2 rounded-xl outline-none border border-white/10 cursor-pointer focus:border-[#00ff66]"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0a0a0a] text-white font-medium">
                  {m.home_team?.name || 'Local'} vs {m.away_team?.name || 'Visitante'} ({m.status === 'FINISHED' ? 'Finalizado' : 'En Curso'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Scoreboard & Timer */}
      <div className="bg-gradient-to-b from-[#0a121e] to-[#040810] border border-cyan-500/35 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden card-3d-interactive cyber-sheen-effect">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#00ff66]/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto relative z-10">
          {/* Home Team Score */}
          <div className="space-y-2 flex-1 text-center w-full">
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider block font-mono">EQUIPO LOCAL</span>
            <h3 className="text-xl font-black text-white truncate">{homeTeam?.name || 'Local'}</h3>
            <div className="text-6xl sm:text-7xl font-black text-[#00ff66] font-mono bg-black/70 py-4 rounded-3xl border border-white/10 shadow-inner tracking-tight drop-shadow-[0_0_18px_rgba(0,255,102,0.4)]">
              {homeGoalsFromStats}
            </div>
            <span className="text-[11px] text-white/50 font-mono block">Goles acumulados</span>
          </div>

          {/* Center Timer & Match Controls */}
          <div className="px-4 text-center space-y-3 shrink-0">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {['1ST_HALF', 'HALF_TIME', '2ND_HALF', 'EXTRA_TIME', 'FINISHED'].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPeriod(p)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer font-mono ${
                    currentPeriod === p 
                      ? 'bg-[#00ff66] text-black shadow-lg shadow-[#00ff66]/30' 
                      : 'bg-black/50 text-white/50 hover:text-white border border-white/10'
                  }`}
                >
                  {p === '1ST_HALF' ? '1T' : p === 'HALF_TIME' ? 'ET' : p === '2ND_HALF' ? '2T' : p === 'EXTRA_TIME' ? 'PR' : 'FIN'}
                </button>
              ))}
            </div>

            <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-wider bg-black/70 px-7 py-2.5 rounded-3xl border border-amber-500/30 inline-block shadow-inner">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                  isTimerRunning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/20' : 'bg-[#00ff66] text-black hover:bg-[#00ff66]/90 shadow-[#00ff66]/20'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isTimerRunning ? 'Pausar Reloj' : 'Iniciar Reloj'}
              </button>

              <button
                onClick={() => setTimerSeconds(0)}
                title="Reiniciar cronómetro"
                className="p-2.5 bg-black/50 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl border border-white/10 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Away Team Score */}
          <div className="space-y-2 flex-1 text-center w-full">
            <span className="text-xs uppercase font-extrabold text-teal-400 tracking-wider block font-mono">EQUIPO VISITANTE</span>
            <h3 className="text-xl font-black text-white truncate">{awayTeam?.name || 'Visitante'}</h3>
            <div className="text-6xl sm:text-7xl font-black text-[#00ff66] font-mono bg-black/70 py-4 rounded-3xl border border-white/10 shadow-inner tracking-tight drop-shadow-[0_0_18px_rgba(0,255,102,0.4)]">
              {awayGoalsFromStats}
            </div>
            <span className="text-[11px] text-white/50 font-mono block">Goles acumulados</span>
          </div>
        </div>

        {/* Global summary badge bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#A0A0A0] gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span>⚽ Total Goles: <strong className="text-white font-bold">{homeGoalsFromStats + awayGoalsFromStats}</strong></span>
            <span>🟨 Tarjetas Amarillas: <strong className="text-amber-400 font-bold">{totalYellowCards}</strong></span>
            <span>🟥 Tarjetas Rojas: <strong className="text-red-400 font-bold">{totalRedCards}</strong></span>
            <span className="text-cyan-400 font-bold">📷 Carnets QR Verificados: <strong className="text-white">{verifiedQrPlayers.size}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenQrScannerForTeam('HOME')}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title={`Escanear QR para ${homeTeam?.name || 'Equipo Local'}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>QR {homeTeam?.name || 'Local'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenQrScannerForTeam('AWAY')}
              className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title={`Escanear QR para ${awayTeam?.name || 'Equipo Visitante'}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>QR {awayTeam?.name || 'Visitante'}</span>
            </button>

            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-5 py-2 bg-gradient-to-r from-[#00ff66] to-emerald-400 hover:from-[#00ff66]/90 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#00ff66]/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Guardar Acta en Firebase</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: PANEL DE JUGADORES PARA LOS DOS EQUIPOS (DUAL / SIMULTÁNEO O PESTAÑAS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00ff66]" />
            <h3 className="text-lg font-black text-white">Panel de Jugadores para Ambos Equipos</h3>
          </div>

          {/* View Mode Toggle: Dual side-by-side or Tabs */}
          <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setPanelViewMode('DUAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                panelViewMode === 'DUAL' ? 'bg-[#00ff66] text-black shadow-md' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vista Dual (Dos Equipos)</span>
            </button>
            <button
              type="button"
              onClick={() => setPanelViewMode('TABS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                panelViewMode === 'TABS' ? 'bg-cyan-500 text-black shadow-md' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista por Pestañas</span>
            </button>
          </div>
        </div>

        {panelViewMode === 'DUAL' ? (
          /* Dual side-by-side grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Local Panel */}
            {renderTeamPlayerTable(
              'HOME',
              homeTeam,
              activeMatch.home_team_id,
              homePlayersList,
              playerSearchQueryHome,
              setPlayerSearchQueryHome,
              showAddPlayerHome,
              setShowAddPlayerHome,
              'cyan'
            )}

            {/* Team Away Panel */}
            {renderTeamPlayerTable(
              'AWAY',
              awayTeam,
              activeMatch.away_team_id,
              awayPlayersList,
              playerSearchQueryAway,
              setPlayerSearchQueryAway,
              showAddPlayerAway,
              setShowAddPlayerAway,
              'teal'
            )}
          </div>
        ) : (
          /* Tabs mode */
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTeamTab('HOME')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTeamTab === 'HOME' ? 'bg-cyan-500 text-black shadow-md' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                <span>{homeTeam?.name || 'Local'} ({homeGoalsFromStats} Goles)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTeamTab('AWAY')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTeamTab === 'AWAY' ? 'bg-teal-500 text-black shadow-md' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
                <span>{awayTeam?.name || 'Visitante'} ({awayGoalsFromStats} Goles)</span>
              </button>
            </div>

            {activeTeamTab === 'HOME' ? (
              renderTeamPlayerTable(
                'HOME',
                homeTeam,
                activeMatch.home_team_id,
                homePlayersList,
                playerSearchQueryHome,
                setPlayerSearchQueryHome,
                showAddPlayerHome,
                setShowAddPlayerHome,
                'cyan'
              )
            ) : (
              renderTeamPlayerTable(
                'AWAY',
                awayTeam,
                activeMatch.away_team_id,
                awayPlayersList,
                playerSearchQueryAway,
                setPlayerSearchQueryAway,
                showAddPlayerAway,
                setShowAddPlayerAway,
                'teal'
              )
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: BOTONES DE APROBADO PARA LOS CAPITANES DE LOS EQUIPOS */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-black text-white">Aprobación & Firma Digital de Capitanes</h3>
              <p className="text-xs text-[#A0A0A0]">
                Los capitanes de ambos clubes deben revisar y aprobar el acta oficial de vocalía antes del cierre del compromiso.
              </p>
            </div>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-500/30 self-start sm:self-auto">
            Reglamento Oficial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HOME CAPTAIN APPROVAL */}
          <div className={`p-5 rounded-2xl border transition-all ${
            homeCaptainApproval.approved 
              ? 'bg-[#00ff66]/5 border-[#00ff66]/40 shadow-lg shadow-[#00ff66]/10' 
              : 'bg-[#121212] border-white/10'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <h4 className="font-black text-sm text-white">Capitán: {homeTeam?.name || 'Equipo Local'}</h4>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                homeCaptainApproval.approved 
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {homeCaptainApproval.approved ? 'APROBADO Y FIRMADO' : 'PENDIENTE DE FIRMA'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Nombre del Capitán</label>
                  <input
                    type="text"
                    value={homeCaptainApproval.captain_name}
                    onChange={(e) => setHomeCaptainApproval({ ...homeCaptainApproval, captain_name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Dorsal / Nº</label>
                  <input
                    type="number"
                    value={homeCaptainApproval.captain_number || ''}
                    onChange={(e) => setHomeCaptainApproval({ ...homeCaptainApproval, captain_number: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Observaciones del Capitán Local</label>
                <input
                  type="text"
                  value={homeCaptainApproval.comments || ''}
                  onChange={(e) => setHomeCaptainApproval({ ...homeCaptainApproval, comments: e.target.value })}
                  placeholder="Sin observaciones o comentarios..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Approval Button & Status */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={toggleHomeCaptainApproval}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                    homeCaptainApproval.approved
                      ? 'bg-[#00ff66] text-black hover:bg-[#00ff66]/90'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                  }`}
                >
                  {homeCaptainApproval.approved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acta Aprobada por Capitán Local (Clic para Modificar)</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      <span>Aprobar Acta Oficial (Capitán {homeTeam?.name || 'Local'})</span>
                    </>
                  )}
                </button>
              </div>

              {homeCaptainApproval.approved && (
                <div className="bg-[#00ff66]/10 border border-[#00ff66]/30 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-[#00ff66]">
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Firma Electrónica Ratificada
                  </span>
                  <span className="font-mono text-[10px] text-white/70">
                    {homeCaptainApproval.approved_at ? new Date(homeCaptainApproval.approved_at).toLocaleTimeString() : 'Registrado'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AWAY CAPTAIN APPROVAL */}
          <div className={`p-5 rounded-2xl border transition-all ${
            awayCaptainApproval.approved 
              ? 'bg-[#00ff66]/5 border-[#00ff66]/40 shadow-lg shadow-[#00ff66]/10' 
              : 'bg-[#121212] border-white/10'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                <h4 className="font-black text-sm text-white">Capitán: {awayTeam?.name || 'Equipo Visitante'}</h4>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                awayCaptainApproval.approved 
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {awayCaptainApproval.approved ? 'APROBADO Y FIRMADO' : 'PENDIENTE DE FIRMA'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Nombre del Capitán</label>
                  <input
                    type="text"
                    value={awayCaptainApproval.captain_name}
                    onChange={(e) => setAwayCaptainApproval({ ...awayCaptainApproval, captain_name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Dorsal / Nº</label>
                  <input
                    type="number"
                    value={awayCaptainApproval.captain_number || ''}
                    onChange={(e) => setAwayCaptainApproval({ ...awayCaptainApproval, captain_number: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#A0A0A0] uppercase font-bold mb-1">Observaciones del Capitán Visitante</label>
                <input
                  type="text"
                  value={awayCaptainApproval.comments || ''}
                  onChange={(e) => setAwayCaptainApproval({ ...awayCaptainApproval, comments: e.target.value })}
                  placeholder="Sin observaciones o comentarios..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Approval Button & Status */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={toggleAwayCaptainApproval}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                    awayCaptainApproval.approved
                      ? 'bg-[#00ff66] text-black hover:bg-[#00ff66]/90'
                      : 'bg-teal-500 hover:bg-teal-400 text-black'
                  }`}
                >
                  {awayCaptainApproval.approved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acta Aprobada por Capitán Visitante (Clic para Modificar)</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      <span>Aprobar Acta Oficial (Capitán {awayTeam?.name || 'Visitante'})</span>
                    </>
                  )}
                </button>
              </div>

              {awayCaptainApproval.approved && (
                <div className="bg-[#00ff66]/10 border border-[#00ff66]/30 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-[#00ff66]">
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Firma Electrónica Ratificada
                  </span>
                  <span className="font-mono text-[10px] text-white/70">
                    {awayCaptainApproval.approved_at ? new Date(awayCaptainApproval.approved_at).toLocaleTimeString() : 'Registrado'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INFORMES OFICIALES (INFORME DEL VOCAL & INFORME DEL ÁRBITRO) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INFORME DEL VOCAL DE MESA */}
        <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Informe Oficial del Vocal de Mesa</h3>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-amber-500/30">
              Mesa de Control
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Nombre del Vocal de Mesa</label>
                <input
                  type="text"
                  value={vocalReport.vocal_name}
                  onChange={(e) => setVocalReport({ ...vocalReport, vocal_name: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">C.I. / Identificación Vocal</label>
                <input
                  type="text"
                  value={vocalReport.vocal_cedula || ''}
                  onChange={(e) => setVocalReport({ ...vocalReport, vocal_cedula: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Hora Inicio</label>
                <input
                  type="time"
                  value={vocalReport.start_time || '10:05'}
                  onChange={(e) => setVocalReport({ ...vocalReport, start_time: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Hora Cierre</label>
                <input
                  type="time"
                  value={vocalReport.end_time || '11:55'}
                  onChange={(e) => setVocalReport({ ...vocalReport, end_time: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Dictamen</label>
                <select
                  value={vocalReport.status}
                  onChange={(e: any) => setVocalReport({ ...vocalReport, status: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="CONFORME">CONFORME (Sin Novedad)</option>
                  <option value="CON_NOVEDAD">CON NOVEDADES</option>
                  <option value="OBSERVADO">OBSERVADO</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Balones y Accesorios</label>
              <input
                type="text"
                value={vocalReport.ball_conditions || ''}
                onChange={(e) => setVocalReport({ ...vocalReport, ball_conditions: e.target.value })}
                placeholder="Ej. 2 balones oficiales FIFA en óptimo estado"
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Novedades y Observaciones de Mesa</label>
              <textarea
                rows={3}
                value={vocalReport.observations}
                onChange={(e) => setVocalReport({ ...vocalReport, observations: e.target.value })}
                placeholder="Detalle de incidencias, puntualidad, estado del terreno..."
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={vocalReport.signed}
                onChange={(e) => setVocalReport({ ...vocalReport, signed: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-white/90 font-bold">Ratificación y Firma Digitalizada del Vocal de Mesa</span>
            </label>
          </div>
        </div>

        {/* INFORME DEL ÁRBITRO */}
        <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Informe Arbitral & Disciplinario</h3>
            </div>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-cyan-500/30">
              Colegio de Árbitros
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Árbitro Central Principal</label>
                <input
                  type="text"
                  value={refereeReport.main_referee}
                  onChange={(e) => setRefereeReport({ ...refereeReport, main_referee: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Asistente 1 (Línea)</label>
                <input
                  type="text"
                  value={refereeReport.assistant_1 || ''}
                  onChange={(e) => setRefereeReport({ ...refereeReport, assistant_1: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Asistente 2 (Línea)</label>
                <input
                  type="text"
                  value={refereeReport.assistant_2 || ''}
                  onChange={(e) => setRefereeReport({ ...refereeReport, assistant_2: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">4to Árbitro / Asistente VAR</label>
                <input
                  type="text"
                  value={refereeReport.fourth_official || ''}
                  onChange={(e) => setRefereeReport({ ...refereeReport, fourth_official: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Informe Disciplinario, Expulsiones y Amonestaciones</label>
              <textarea
                rows={2}
                value={refereeReport.disciplinary_notes}
                onChange={(e) => setRefereeReport({ ...refereeReport, disciplinary_notes: e.target.value })}
                placeholder="Motivos de tarjetas amarillas y rojas, desglosado por jugador..."
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A0A0A0] font-bold uppercase mb-1">Incidentes de Terreno, Bancas o Público</label>
              <textarea
                rows={2}
                value={refereeReport.incidents || ''}
                onChange={(e) => setRefereeReport({ ...refereeReport, incidents: e.target.value })}
                placeholder="Conducta de directores técnicos, barras, tiempo adicional adicionado..."
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={refereeReport.signatures_verified}
                onChange={(e) => setRefereeReport({ ...refereeReport, signatures_verified: e.target.checked })}
                className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-white/90 font-bold">Validación Electrónica del Cuerpo Arbitral</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4: ESCÁNER QR & BITÁCORA EN VIVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Verification Desk */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              Lector QR de Carnets Físicos o Digitales
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenQrScannerForTeam('HOME')}
                className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] rounded-xl flex items-center gap-1 cursor-pointer shadow-md transition-all"
                title={`Abrir cámara para ${homeTeam?.name || 'Local'}`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>QR Local</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenQrScannerForTeam('AWAY')}
                className="px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-black font-black text-[11px] rounded-xl flex items-center gap-1 cursor-pointer shadow-md transition-all"
                title={`Abrir cámara para ${awayTeam?.name || 'Visitante'}`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>QR Visitante</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleVerifyQrManual} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. SPORTIA-QR-PL-101 o código de carnet..."
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer hover:bg-cyan-400"
            >
              Verificar
            </button>
          </form>

          {scannedPlayer ? (
            <div className="bg-[#08080c] border border-amber-500/30 p-5 rounded-2xl flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold w-full justify-between">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> ACREDITACIÓN VERIFICADA</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium">HABILITADO EN MESA</span>
              </div>

              <TradingCardCarnet 
                player={scannedPlayer} 
                sport={sport}
                size="sm"
              />
            </div>
          ) : (
            <p className="text-xs text-[#A0A0A0] font-normal italic">
              Abre la cámara para escanear en cadena los carnets físicos o digitales de todos los jugadores de ambos equipos.
            </p>
          )}
        </div>

        {/* Real-time Event Log */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-3 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            Bitácora de Eventos Registrados en Vivo
          </h3>

          <div className="space-y-2.5 max-h-60 overflow-y-auto">
            {matchEvents.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#A0A0A0]">
                Aún no hay incidencias registradas en este compromiso.
              </div>
            ) : (
              matchEvents.map((e, idx) => (
                <div key={`${e.id || 'evt'}-${idx}`} className="bg-[#121212] p-3.5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-cyan-400">{e.event_type}</span> - <span className="font-medium text-white">{e.player_name}</span>
                    <p className="text-[11px] text-[#A0A0A0] font-normal mt-0.5">{e.team_name} | {e.period}</p>
                  </div>
                  <span className="font-mono text-[#A0A0A0] text-xs font-medium">{formatTimer(e.timestamp_seconds)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL TO SAVE TO FIREBASE */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0d0d0d] border border-[#00ff66]/40 rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Confirmar Acta Oficial en Firebase</h3>
                  <span className="text-[11px] text-[#00ff66] font-bold uppercase tracking-wider block">
                    Segmentación: {tenant?.name || 'Liga Deportiva'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-[#A0A0A0] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Summary Details */}
            <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Partido:</span>
                <span className="font-black text-white">{homeTeam?.name} vs {awayTeam?.name}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Marcador Final:</span>
                <span className="text-xl font-black text-[#00ff66] font-mono">
                  {homeGoalsFromStats} - {awayGoalsFromStats}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Tarjetas Totales:</span>
                <span className="font-bold text-white">
                  🟨 {totalYellowCards} Amarillas | 🟥 {totalRedCards} Rojas
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Aprobación Capitán Local:</span>
                <span className={`font-bold ${homeCaptainApproval.approved ? 'text-[#00ff66]' : 'text-amber-400'}`}>
                  {homeCaptainApproval.approved ? '✅ APROBADO' : '⏳ PENDIENTE'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Aprobación Capitán Visitante:</span>
                <span className={`font-bold ${awayCaptainApproval.approved ? 'text-[#00ff66]' : 'text-amber-400'}`}>
                  {awayCaptainApproval.approved ? '✅ APROBADO' : '⏳ PENDIENTE'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Vocal de Mesa:</span>
                <span className="font-bold text-amber-400">{vocalReport.vocal_name || 'Vocal Registrado'}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[#A0A0A0]">Árbitro Central:</span>
                <span className="font-bold text-cyan-400">{refereeReport.main_referee || 'Árbitro Registrado'}</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] text-[#A0A0A0] uppercase font-bold block">Estado del Partido:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMatchStatusToSave('IN_PROGRESS')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      matchStatusToSave === 'IN_PROGRESS' 
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' 
                        : 'bg-[#181818] text-[#A0A0A0] border-white/10'
                    }`}
                  >
                    🟡 Mantener En Curso
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchStatusToSave('FINISHED')}
                    className={`py-2 px-3 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                      matchStatusToSave === 'FINISHED' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                        : 'bg-[#181818] text-[#A0A0A0] border-white/10'
                    }`}
                  >
                    🟢 Finalizar Partido
                  </button>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#A0A0A0] font-mono">
                Ruta Firestore: <span className="text-white/80">/tenants/{activeMatch.tenant_id}/matches/{activeMatch.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3 bg-[#181818] hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSavingFirebase}
                onClick={handleConfirmSaveFirebase}
                className="flex-1 py-3 bg-gradient-to-r from-[#00ff66] to-emerald-400 hover:from-[#00ff66]/90 hover:to-emerald-300 text-black font-black text-xs rounded-xl shadow-lg shadow-[#00ff66]/30 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isSavingFirebase ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando en Firebase...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sí, Guardar y Publicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
