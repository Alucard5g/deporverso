import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Tv,
  Radio,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Users,
  Clock,
  Wifi,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Tenant, Sport, Match, Team, MatchEvent } from '../../../types';
import {
  PublicStudioStateSnapshot,
  createRtcPeerConnection,
  fetchPublicChannels,
  getStreamStudioWsUrl,
} from '../../../services/streamStudioClient';

interface PublicStreamingChannelsProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  events?: MatchEvent[];
  selectedMatchId?: string;
}

const PUBLIC_CHANNEL_FALLBACK_IDS = ['1G4isv_Fylg', 'jfKfPfyJRdk', 'aqz-KE-bpKQ'];

export const PublicStreamingChannels: React.FC<PublicStreamingChannelsProps> = ({
  tenant,
  sport,
  matches,
  teams,
  events = [],
  selectedMatchId: propSelectedMatchId,
}) => {
  const liveMatches = matches.filter((m) => m.status === 'IN_PROGRESS');
  const fallbackMatch =
    (propSelectedMatchId ? matches.find((m) => m.id === propSelectedMatchId) : null) ||
    liveMatches[0] ||
    matches[0] ||
    ({
      id: 'match-live-default',
      tenant_id: tenant.id,
      home_team_id: teams[0]?.id || 'team-1',
      away_team_id: teams[1]?.id || 'team-2',
      home_score: 2,
      away_score: 1,
      status: 'IN_PROGRESS',
      field_location: 'Cancha Central',
      match_date: new Date().toISOString(),
    } as Match);

  const [activeMatchId, setActiveMatchId] = useState<string>(fallbackMatch.id);
  const activeMatch = matches.find((m) => m.id === activeMatchId) || fallbackMatch;

  const homeTeam = activeMatch.home_team ||
    teams.find((t) => t.id === activeMatch.home_team_id) || {
      id: 'h1',
      name: 'Atlético Juvenil',
      primary_color: '#00e5ff',
    };
  const awayTeam = activeMatch.away_team ||
    teams.find((t) => t.id === activeMatch.away_team_id) || {
      id: 'a1',
      name: 'Sporting San Pedro',
      primary_color: '#ff0055',
    };

  const [channelDirectory, setChannelDirectory] = useState<PublicStudioStateSnapshot[]>([]);
  const [publicState, setPublicState] = useState<PublicStudioStateSnapshot | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFsControls, setShowFsControls] = useState<boolean>(true);
  const [fanReactions, setFanReactions] = useState<{ id: string; emoji: string; text: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const activeCamClientIdRef = useRef<string | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);
  const fsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync directory of active league channels from server
  useEffect(() => {
    let active = true;
    const loadChannels = async () => {
      const list = await fetchPublicChannels(tenant.id);
      if (active) setChannelDirectory(list);
    };
    loadChannels();
    const interval = setInterval(loadChannels, 12000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [tenant.id]);

  // Attach remote WebRTC MediaStream to video element cleanly
  const attachVideoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      videoElRef.current = el;
      if (el && remoteStream) {
        if (el.srcObject !== remoteStream) {
          el.srcObject = remoteStream;
        }
        if (el.paused) {
          el.play().catch(() => {});
        }
      }
    },
    [remoteStream]
  );

  useEffect(() => {
    if (videoElRef.current && remoteStream) {
      if (videoElRef.current.srcObject !== remoteStream) {
        videoElRef.current.srcObject = remoteStream;
      }
      videoElRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  // Connect to WebSocket as Spectator for the selected channel
  useEffect(() => {
    let stopped = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;

    const cleanupPeer = () => {
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch {}
        pcRef.current = null;
      }
      activeCamClientIdRef.current = null;
      setRemoteStream(null);
    };

    const connect = () => {
      if (stopped) return;
      try {
        const ws = new WebSocket(getStreamStudioWsUrl());
        wsRef.current = ws;

        ws.onopen = () => {
          attempt = 0;
          setWsConnected(true);
          ws.send(
            JSON.stringify({
              type: 'studio:join',
              tenantId: tenant.id,
              matchId: activeMatchId,
              role: 'spectator',
            })
          );
        };

        ws.onmessage = async (event) => {
          let msg: any;
          try {
            msg = JSON.parse(event.data);
          } catch {
            return;
          }
          if (!msg || typeof msg.type !== 'string') return;

          if (msg.type === 'studio:public_state') {
            setPublicState(msg as PublicStudioStateSnapshot);
            if (!msg.activeProgramCamId) {
              cleanupPeer();
            }
          } else if (msg.type === 'studio:program_changed') {
            setPublicState((prev) =>
              prev
                ? {
                    ...prev,
                    activeProgramCamId: msg.activeProgramCamId || null,
                    layoutMode: msg.layoutMode || prev.layoutMode,
                    updatedAt: msg.updatedAt || Date.now(),
                  }
                : prev
            );
            if (!msg.activeProgramCamId) {
              cleanupPeer();
            }
          } else if (msg.type === 'studio:reaction') {
            const rxId = msg.id || `rx-${Date.now()}`;
            setFanReactions((prev) => [...prev.slice(-6), { id: rxId, emoji: msg.emoji || '🔥', text: msg.text || '¡Vamos!' }]);
            setTimeout(() => {
              setFanReactions((prev) => prev.filter((r) => r.id !== rxId));
            }, 3000);
          } else if (msg.type === 'rtc:offer' && msg.fromClientId && msg.sdp) {
            try {
              if (pcRef.current) {
                try {
                  pcRef.current.close();
                } catch {}
              }
              const pc = createRtcPeerConnection();
              if (!pc) return;
              pcRef.current = pc;
              activeCamClientIdRef.current = msg.fromClientId;

              pc.ontrack = (trackEv) => {
                if (trackEv.streams && trackEv.streams[0]) {
                  setRemoteStream(trackEv.streams[0]);
                }
              };

              pc.onicecandidate = (iceEv) => {
                if (iceEv.candidate && ws.readyState === WebSocket.OPEN) {
                  ws.send(
                    JSON.stringify({
                      type: 'rtc:ice',
                      targetClientId: msg.fromClientId,
                      candidate: iceEv.candidate,
                    })
                  );
                }
              };

              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: 'rtc:answer',
                    targetClientId: msg.fromClientId,
                    sdp: answer,
                  })
                );
              }
            } catch (err) {
              console.warn('Error negociando WebRTC en canal público:', err);
            }
          } else if (msg.type === 'rtc:ice' && msg.candidate && pcRef.current) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch {}
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          if (!stopped) {
            attempt += 1;
            const delay = Math.min(8000, 1200 * Math.pow(1.4, attempt));
            reconnectTimer = setTimeout(connect, delay);
          }
        };
      } catch {
        setWsConnected(false);
      }
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      cleanupPeer();
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
    };
  }, [tenant.id, activeMatchId]);

  const resetFsTimer = useCallback(() => {
    setShowFsControls(true);
    if (fsTimerRef.current) clearTimeout(fsTimerRef.current);
    fsTimerRef.current = setTimeout(() => setShowFsControls(false), 3500);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      if (next) {
        document.body.style.overflow = 'hidden';
        resetFsTimer();
        try {
          const el = playerWrapperRef.current;
          if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
          else if ((el as any)?.webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
        } catch {}
      } else {
        document.body.style.overflow = '';
        if (fsTimerRef.current) clearTimeout(fsTimerRef.current);
        try {
          if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
          else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          }
        } catch {}
      }
      return next;
    });
  }, [resetFsTimer]);

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!active && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.body.style.overflow = '';
      if (fsTimerRef.current) clearTimeout(fsTimerRef.current);
    };
  }, [isFullscreen]);

  const handleSendReaction = (emoji: string, text: string) => {
    const localId = `rx-${Date.now()}`;
    setFanReactions((prev) => [...prev.slice(-6), { id: localId, emoji, text }]);
    setTimeout(() => {
      setFanReactions((prev) => prev.filter((r) => r.id !== localId));
    }, 3000);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'spectator:reaction',
          emoji,
          text,
        })
      );
    }
  };

  const handleRefreshFeed = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'spectator:request_feed' }));
    }
  };

  const scoreboard = publicState?.scoreboard;
  const displayHomeName = scoreboard?.homeTeam || homeTeam.name;
  const displayAwayName = scoreboard?.awayTeam || awayTeam.name;
  const displayHomeScore = scoreboard?.homeScore ?? activeMatch.home_score ?? 0;
  const displayAwayScore = scoreboard?.awayScore ?? activeMatch.away_score ?? 0;
  const displayTime = scoreboard
    ? `${String(scoreboard.minutes).padStart(2, '0')}:${String(scoreboard.seconds).padStart(2, '0')}`
    : 'EN VIVO';

  const fallbackIndex = Math.max(0, matches.findIndex((m) => m.id === activeMatch.id)) % PUBLIC_CHANNEL_FALLBACK_IDS.length;
  const youtubeVideoId = publicState?.fallbackVideoId || PUBLIC_CHANNEL_FALLBACK_IDS[fallbackIndex];
  const isShowingLiveWebRtc = Boolean(publicState?.activeProgramCamId && remoteStream);

  const matchEvents = events.filter((ev) => ev.match_id === activeMatch.id).slice(0, 8);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header de Canales Públicos de Streaming */}
      <div className="bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 font-black text-[11px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Canales Oficiales En Vivo
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono text-[11px]">
                <Users className="w-3 h-3" />
                <span>{publicState?.spectatorCount ?? 1} espectadores</span>
              </span>
              {wsConnected && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <Wifi className="w-3 h-3" />
                  Señal Sincronizada
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Tv className="w-7 h-7 text-cyan-400 shrink-0" />
              <span>Canales de Streaming · {tenant.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sigue la transmisión oficial de los encuentros de {sport?.name || tenant.sport_code} en tiempo real.
            </p>
          </div>
        </div>

        {/* Selector de Canales / Partidos */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Selecciona el Canal del Partido:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {matches.slice(0, 6).map((m, idx) => {
              const h = m.home_team?.name || teams.find((t) => t.id === m.home_team_id)?.name || 'Local';
              const a = m.away_team?.name || teams.find((t) => t.id === m.away_team_id)?.name || 'Visitante';
              const liveDirectoryInfo = channelDirectory.find((c) => c.matchId === m.id);
              const isSelected = activeMatch.id === m.id;
              const isChannelLive =
                m.status === 'IN_PROGRESS' || Boolean(liveDirectoryInfo?.activeProgramCamId);

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMatchId(m.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/15'
                      : 'bg-slate-950/70 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          isChannelLive
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {isChannelLive ? '🔴 EN VIVO' : `CANAL ${idx + 1}`}
                      </span>
                      {liveDirectoryInfo?.activeProgramCamId && (
                        <span className="text-emerald-300 font-bold">Señal Cancha HD</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">
                      {h} vs {a}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{m.field_location || 'Estadio Oficial'}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono font-black text-sm text-cyan-300 tabular-nums">
                    {m.home_score}:{m.away_score}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reproductor Principal del Canal + Línea de Eventos Pública */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          {/* Toolbar Limpio de Espectador */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#090e1a] p-2.5 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-2 px-2">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-bold text-white truncate max-w-[230px] sm:max-w-none">
                {displayHomeName} vs {displayAwayName}
              </span>
              {publicState?.activeCameraAngle && (
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Toma: {publicState.activeCameraAngle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRefreshFeed}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Sincronizar señal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sincronizar</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                title={isMuted ? 'Activar Audio' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/40 cursor-pointer"
                title="Pantalla Completa"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div
            ref={playerWrapperRef}
            onClick={resetFsTimer}
            onTouchStart={resetFsTimer}
            className={`transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 z-[99999] w-screen h-[100dvh] bg-black flex flex-col justify-center items-center'
                : 'relative aspect-video w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-black shadow-2xl'
            }`}
          >
            {isShowingLiveWebRtc ? (
              <video
                ref={attachVideoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className={`w-full h-full ${isFullscreen ? 'object-contain max-h-[100dvh]' : 'object-cover'}`}
              />
            ) : (
              <iframe
                title={`Canal en Vivo - ${displayHomeName} vs ${displayAwayName}`}
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=1&modestbranding=1&rel=0&playsinline=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {/* Marcador Oficial Superpuesto */}
            <div
              className={`absolute top-3 left-3 right-3 pointer-events-none flex items-center justify-between gap-2 z-20 ${
                isFullscreen && !showFsControls ? 'opacity-70' : 'opacity-100'
              }`}
            >
              <div className="flex items-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 px-3 py-1.5 shadow-xl text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
                <span className="font-black text-rose-400 mr-2">EN VIVO</span>
                <span className="font-bold text-white truncate max-w-[90px] sm:max-w-[150px]">{displayHomeName}</span>
                <span className="mx-1.5 px-1.5 py-0.5 rounded bg-white/10 text-amber-400 font-black tabular-nums">
                  {displayHomeScore}
                </span>
                <span className="text-white/40">-</span>
                <span className="mx-1.5 px-1.5 py-0.5 rounded bg-white/10 text-amber-400 font-black tabular-nums">
                  {displayAwayScore}
                </span>
                <span className="font-bold text-white truncate max-w-[90px] sm:max-w-[150px]">{displayAwayName}</span>
                <span className="ml-2 pl-2 border-l border-white/20 text-cyan-300 font-bold hidden sm:inline">
                  {displayTime}
                </span>
              </div>

              {isFullscreen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFullscreen();
                  }}
                  className="pointer-events-auto p-2 rounded-xl bg-black/90 text-cyan-300 border border-cyan-400 cursor-pointer"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Reacciones Flotantes */}
            <div className="absolute bottom-14 right-4 flex flex-col gap-1.5 pointer-events-none z-20">
              {fanReactions.map((r) => (
                <div
                  key={r.id}
                  className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-3"
                >
                  <span>{r.emoji}</span>
                  <span>{r.text}</span>
                </div>
              ))}
            </div>

            {/* Barra Inferior de Reacciones de Hinchada */}
            {!isFullscreen && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-20">
                <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-sm">
                  <button
                    type="button"
                    onClick={() => handleSendReaction('🔥', '¡Golazo!')}
                    className="hover:scale-125 transition-transform px-1 cursor-pointer"
                    title="Reaccionar"
                  >
                    🔥
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendReaction('👏', '¡Gran jugada!')}
                    className="hover:scale-125 transition-transform px-1 cursor-pointer"
                    title="Aplaudir"
                  >
                    👏
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendReaction('⚽', '¡Vamos equipo!')}
                    className="hover:scale-125 transition-transform px-1 cursor-pointer"
                    title="Alentar"
                  >
                    ⚽
                  </button>
                </div>

                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 text-[10px] font-mono text-cyan-300">
                  {isShowingLiveWebRtc ? 'Streaming Oficial Cancha' : 'Canal Broadcast 1080p'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Lateral Pública: Detalles y Minuto a Minuto */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#090e1a] p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Eventos del Partido
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">{activeMatch.field_location || 'Sede Oficial'}</span>
            </div>

            {matchEvents.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-cyan-400 mx-auto opacity-80" />
                <p className="text-xs text-slate-400">
                  Disfruta la transmisión oficial en vivo. Los goles e incidencias aparecerán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {matchEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] shrink-0">
                      {Math.max(1, Math.floor((ev.timestamp_seconds || 0) / 60))}'
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{ev.event_type}</p>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {teams.find((t) => t.id === ev.team_id)?.name || tenant.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
