import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  Tv, 
  Activity, 
  Camera, 
  Layers, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Wifi, 
  Server, 
  Flame, 
  Share2, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Info,
  Copy,
  Check,
  Zap,
  QrCode,
  DollarSign,
  SwitchCamera,
  AlertCircle,
  Megaphone,
  Film,
  Cloud,
  Bot
} from 'lucide-react';
import { Tenant, Sport, Match, Team, Player } from '../../types';
import { RtmpQrModal } from './streaming/RtmpQrModal';
import { SponsorOverlayBanner } from './streaming/SponsorOverlayBanner';
import { HighlightsMonetizationModal } from './streaming/HighlightsMonetizationModal';
import { VarReplayStudio } from './streaming/VarReplayStudio';
import { HighlightReelsGeneratorModal } from './streaming/HighlightReelsGeneratorModal';

export interface LiveStreamingPanelProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  defaultMode?: 'vocalia' | 'var' | 'tv';
  selectedMatchId?: string;
  onClose?: () => void;
}

// Preset real sports video IDs for reliable live demonstration
const STREAM_PRESETS = [
  { id: '1G4isv_Fylg', title: 'Transmisión Oficial de Fútbol HD', type: 'Fútbol Barrial / Amateur' },
  { id: 'jfKfPfyJRdk', title: 'Señal en Vivo - Transmisión en Cancha', type: 'Transmisión 24/7' },
  { id: 'aqz-KE-bpKQ', title: 'Cámara Táctica Estadio Central', type: 'VAR High-Angle' },
];

export const LiveStreamingPanel: React.FC<LiveStreamingPanelProps> = ({
  tenant,
  sport,
  matches,
  teams,
  players,
  defaultMode = 'vocalia',
  selectedMatchId: propSelectedMatchId,
  onClose
}) => {
  // Current active mode: 'vocalia' (Vocalía Digital Live), 'var' (Transmisión VAR Local), or 'tv' (Streaming TV Oficial)
  const [streamMode, setStreamMode] = useState<'vocalia' | 'var' | 'tv'>(defaultMode);

  // Match selection
  const liveMatches = matches.filter(m => m.status === 'IN_PROGRESS');
  const initialMatch = (propSelectedMatchId ? matches.find(m => m.id === propSelectedMatchId) : null)
    || liveMatches[0] 
    || matches[0] 
    || {
      id: 'match-live-default',
      home_team_id: teams[0]?.id || 'team-1',
      away_team_id: teams[1]?.id || 'team-2',
      home_score: 2,
      away_score: 1,
      status: 'IN_PROGRESS',
      match_date: new Date().toISOString()
    } as Match;

  const [activeMatchId, setActiveMatchId] = useState<string>(initialMatch.id);
  const activeMatch = matches.find(m => m.id === activeMatchId) || initialMatch;

  const homeTeam = teams.find(t => t.id === activeMatch.home_team_id) || {
    id: 'h1',
    name: 'Atlético Juvenil',
    primary_color: '#00e5ff'
  } as Team;

  const awayTeam = teams.find(t => t.id === activeMatch.away_team_id) || {
    id: 'a1',
    name: 'Sporting San Pedro',
    primary_color: '#ff0055'
  } as Team;

  // Stream Player Configuration
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'webcam'>('youtube');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>('1G4isv_Fylg');
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [showScoreOverlay, setShowScoreOverlay] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeCameraAngle, setActiveCameraAngle] = useState<'cam1' | 'cam2' | 'cam3'>('cam1');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // VAR & Replay Simulation State
  const [varPlaybackRate, setVarPlaybackRate] = useState<number>(1.0);
  const [varDecision, setVarDecision] = useState<string | null>(null);
  const [isReviewingVar, setIsReviewingVar] = useState<boolean>(false);
  const [varDecisionMessage, setVarDecisionMessage] = useState<string>('');

  // Device Camera (WebRTC) Ingestion & Multi-Camera Facing
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Synchronized VAR Stream Buffer (MediaRecorder for real-time risk plays analysis)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const headerChunkRef = useRef<Blob | null>(null);
  const recordedClustersRef = useRef<Blob[]>([]);
  const recordedChunksRef = useRef<Blob[]>([]);
  const activeMimeTypeRef = useRef<string>('video/webm');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isRecordingLive, setIsRecordingLive] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Auto-captured Risk Plays & Clips Slices for instant VAR & Highlights Store
  const [capturedClips, setCapturedClips] = useState<{
    id: string;
    minute: number;
    title: string;
    type: 'goal' | 'var' | 'card' | 'risk';
    url: string;
    timestamp: string;
  }[]>([]);
  const [clipSavedToast, setClipSavedToast] = useState<string | null>(null);

  // Modals & Overlays
  const [showRtmpQrModal, setShowRtmpQrModal] = useState<boolean>(false);
  const [showMonetizationModal, setShowMonetizationModal] = useState<boolean>(false);
  const [showHighlightReelsModal, setShowHighlightReelsModal] = useState<boolean>(false);
  const [showSponsorOverlay, setShowSponsorOverlay] = useState<boolean>(true);

  // Dynamic Match Timer & Scores
  const [matchMinutes, setMatchMinutes] = useState<number>(73);
  const [matchSeconds, setMatchSeconds] = useState<number>(45);
  const [homeScore, setHomeScore] = useState<number>(activeMatch.home_score ?? 2);
  const [awayScore, setAwayScore] = useState<number>(activeMatch.away_score ?? 1);

  // Live Chat & Reactions
  const [fanReactions, setFanReactions] = useState<{ id: string; emoji: string; text: string }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: 'c1', user: 'Carlos M. (Delegado)', text: '¡Tremenda definición en el segundo tiempo!', time: '14:28' },
    { id: 'c2', user: 'Andrea P. (Vocal)', text: 'Marcador verificado en acta digital oficial.', time: '14:29' },
    { id: 'c3', user: 'Hincha Fiel', text: 'Vamos San Pedro con garra los últimos 15 min 🔥', time: '14:31' }
  ]);
  const [newComment, setNewComment] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Live Events Stream
  const [liveEvents, setLiveEvents] = useState<{ id: string; minute: number; type: 'goal' | 'yellow' | 'red' | 'sub' | 'var'; title: string; team: string }[]>([
    { id: 'e1', minute: 23, type: 'goal', title: 'Golazo de tiro libre', team: homeTeam.name },
    { id: 'e2', minute: 41, type: 'yellow', title: 'Falta táctica en medio campo', team: awayTeam.name },
    { id: 'e3', minute: 58, type: 'goal', title: 'Remate cruzado al ángulo', team: awayTeam.name },
    { id: 'e4', minute: 68, type: 'goal', title: 'Cabezazo tras centro de esquina', team: homeTeam.name },
  ]);

  // Sync with prop when changed
  useEffect(() => {
    setStreamMode(defaultMode);
  }, [defaultMode]);

  // Dynamic Clock incrementing & Recording seconds counter (Stable timer without re-triggering video pipeline)
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchSeconds(prev => {
        if (prev >= 59) {
          setMatchMinutes(m => m + 1);
          return 0;
        }
        return prev + 1;
      });

      if (isRecordingLive) {
        setRecordingSeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecordingLive]);

  // STABILIZED callback ref for the video element:
  // Strictly checks element identity and prevents resetting srcObject during periodic state updates (ZERO FLICKERING)
  const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      if (element.srcObject !== streamRef.current) {
        element.srcObject = streamRef.current;
      }
      if (element.paused) {
        element.play().catch(e => {
          console.log('Autoplay handled safely:', e);
        });
      }
    }
  }, []);

  // Re-attach video stream ONLY if missing or changed, never on normal timer re-renders
  useEffect(() => {
    if (videoSourceType === 'webcam' && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [videoSourceType, cameraActive]);

  // Continuous High-Fidelity MediaRecorder with Header Preservation:
  // Retains EBML metadata in chunk 0 so subsequent slices remain 100% valid and glitch-free
  const startMediaRecording = (stream: MediaStream) => {
    try {
      if (typeof MediaRecorder === 'undefined') return;

      let mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }
      activeMimeTypeRef.current = mimeType;

      const recorder = mimeType 
        ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 }) 
        : new MediaRecorder(stream);

      headerChunkRef.current = null;
      recordedClustersRef.current = [];
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          if (!headerChunkRef.current) {
            // First chunk contains EBML file header and codec descriptors
            headerChunkRef.current = event.data;
          } else {
            recordedClustersRef.current.push(event.data);
            // Retain rolling 180 seconds without losing the header chunk
            if (recordedClustersRef.current.length > 180) {
              recordedClustersRef.current.shift();
            }
          }
          recordedChunksRef.current = headerChunkRef.current 
            ? [headerChunkRef.current, ...recordedClustersRef.current] 
            : recordedClustersRef.current;
        }
      };

      recorder.start(1000); // 1-second continuous slices
      mediaRecorderRef.current = recorder;
      setIsRecordingLive(true);
      setRecordingSeconds(0);
    } catch (err) {
      console.warn('MediaRecorder notice:', err);
    }
  };

  // WebRTC Device Camera Handler with smooth anti-jitter hardware negotiation
  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      let mediaStream: MediaStream;
      try {
        // High Definition 1080p / 720p 30fps with motion optimization and no audio echo feedback
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 30, min: 24, max: 60 },
            aspectRatio: { ideal: 1.7777777778 }
          },
          audio: false
        });
      } catch (err1) {
        console.warn('Fallback 1: trying 720p with facingMode', err1);
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        } catch (err2) {
          console.warn('Fallback 2: trying any default camera', err2);
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      // Mark video track for motion smoothness
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.contentHint = 'motion';
      }

      streamRef.current = mediaStream;
      setCameraFacingMode(facing);
      setCameraActive(true);
      setVideoSourceType('webcam');

      if (videoRef.current) {
        if (videoRef.current.srcObject !== mediaStream) {
          videoRef.current.srcObject = mediaStream;
        }
        videoRef.current.play().catch(e => console.log('Autoplay error:', e));
      }

      // Automatically start continuous recording for synchronized VAR inspection
      startMediaRecording(mediaStream);
    } catch (err: any) {
      console.error('Error al acceder a la cámara:', err);
      setCameraError(
        `No se pudo inicializar la cámara: ${err.message || 'Verifica permisos del navegador'}. Puedes usar la señal RTMP o YouTube de prueba.`
      );
      setCameraActive(false);
    }
  };

  const flipCamera = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  const stopCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsRecordingLive(false);
    setVideoSourceType('youtube');
  };

  // Instant VAR Replay Jump: extracts current live buffer and switches to VAR
  const handleOpenVarInstantReplay = () => {
    const allChunks = headerChunkRef.current
      ? [headerChunkRef.current, ...recordedClustersRef.current]
      : recordedClustersRef.current;

    if (allChunks.length > 0) {
      const blob = new Blob(allChunks, { type: activeMimeTypeRef.current || 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
    }
    setStreamMode('var');
    setIsReviewingVar(true);
  };

  // Auto-Clipping: extracts 15-30s slice of controversial or key play and links to VAR & Highlights
  const handleCaptureRiskClip = (title: string, type: 'goal' | 'var' | 'card' | 'risk' = 'risk') => {
    const allChunks = headerChunkRef.current
      ? [headerChunkRef.current, ...recordedClustersRef.current]
      : recordedClustersRef.current;

    if (allChunks.length > 0) {
      const recentClusters = recordedClustersRef.current.slice(-25);
      const clipChunks = headerChunkRef.current ? [headerChunkRef.current, ...recentClusters] : recentClusters;
      const clipBlob = new Blob(clipChunks, { type: activeMimeTypeRef.current || 'video/webm' });
      const clipUrl = URL.createObjectURL(clipBlob);

      const newClip = {
        id: `clip-${Date.now()}`,
        minute: matchMinutes,
        title: title || `Jugada de Riesgo Min ${matchMinutes}`,
        type,
        url: clipUrl,
        timestamp: `${String(matchMinutes).padStart(2, '0')}:${String(matchSeconds).padStart(2, '0')}`
      };

      setCapturedClips(prev => [newClip, ...prev]);
      setRecordedVideoUrl(clipUrl);
      setClipSavedToast(`⚡ Jugada "${newClip.title}" cortada y sincronizada al instante con el VAR y Tienda de Highlights.`);
      setTimeout(() => setClipSavedToast(null), 4500);
      return clipUrl;
    }
    return null;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Play synthetic Web Audio sound effect for Goal or Whistle
  const playSoundEffect = (type: 'whistle' | 'cheer' | 'var') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'whistle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'var') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      }
    } catch (e) {
      // Ignore audio policy errors
    }
  };

  // Add custom event from vocalía
  const handleAddLiveEvent = (type: 'goal' | 'yellow' | 'red', team: 'home' | 'away') => {
    const targetTeam = team === 'home' ? homeTeam : awayTeam;
    if (type === 'goal') {
      if (team === 'home') setHomeScore(s => s + 1);
      else setAwayScore(s => s + 1);
      playSoundEffect('whistle');
    }

    const newEv = {
      id: `ev-${Date.now()}`,
      minute: matchMinutes,
      type,
      title: type === 'goal' ? `¡GOL de ${targetTeam.name}!` : type === 'yellow' ? 'Tarjeta Amarilla' : 'Tarjeta Roja Directa',
      team: targetTeam.name
    };

    setLiveEvents(prev => [newEv, ...prev]);

    // Automatically trigger risk/incident clip slice from live buffer
    handleCaptureRiskClip(newEv.title, type === 'goal' ? 'goal' : 'card');
  };

  // Trigger VAR Decision
  const handleTriggerVar = (decision: string) => {
    playSoundEffect('var');
    setIsReviewingVar(true);
    setVarDecision(decision);
    setVarDecisionMessage(`Resolución Arbitral: ${decision.toUpperCase()}`);
    setTimeout(() => {
      setIsReviewingVar(false);
    }, 6000);
  };

  // Send Chat message
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        id: `cm-${Date.now()}`,
        user: 'Aficionado en Vivo',
        text: newComment.trim(),
        time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
      }
    ]);
    setNewComment('');
  };

  // Send Floating Reaction
  const handleAddReaction = (emoji: string, text: string) => {
    const id = `rx-${Date.now()}`;
    setFanReactions(prev => [...prev, { id, emoji, text }]);
    setTimeout(() => {
      setFanReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  // Extract ID from URL if entered
  const handleApplyCustomUrl = () => {
    if (!customInputUrl.trim()) return;
    let videoId = customInputUrl.trim();
    if (customInputUrl.includes('v=')) {
      videoId = customInputUrl.split('v=')[1]?.split('&')[0] || videoId;
    } else if (customInputUrl.includes('youtu.be/')) {
      videoId = customInputUrl.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }
    setYoutubeVideoId(videoId);
    setVideoSourceType('youtube');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ============================================================ */}
      {/* HEADER DE CONTROL: MODOS EN VIVO SEGÚN EL PANEL DE LA IMAGEN */}
      {/* ============================================================ */}
      <div className="bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Título & Badge de Transmisión Activa */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 font-black text-[11px] tracking-wider uppercase shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>SEÑAL EN VIVO REAL</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                1080p 60fps • 4.2 Mbps
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {tenant.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {streamMode === 'vocalia' && <Radio className="w-7 h-7 text-emerald-400" />}
              {streamMode === 'var' && <Activity className="w-7 h-7 text-rose-400" />}
              {streamMode === 'tv' && <Tv className="w-7 h-7 text-cyan-400" />}
              <span>
                {streamMode === 'vocalia' && 'Vocalía Digital Live en Cancha'}
                {streamMode === 'var' && 'Transmisión & Sala VAR Local'}
                {streamMode === 'tv' && 'Streaming TV Abierta & RTMP Broadcast'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {streamMode === 'vocalia' && 'Control de incidencias en vivo, cronómetro oficial y acta digital sincronizada con la mesa de control.'}
              {streamMode === 'var' && 'Sistema de repetición multicanal en cancha, cámara lenta 0.25x/0.5x y dictamen de jugadas polémicas.'}
              {streamMode === 'tv' && 'Transmisión comunitaria de costo cero mediante SRS + YouTube Live con gráficos de televisión superpuestos.'}
            </p>
          </div>

          {/* Selector de Modos & Acciones Rápidas */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <div className="flex items-center gap-1.5 bg-[#05070d] p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setStreamMode('vocalia')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  streamMode === 'vocalia'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Vocalía Live</span>
              </button>

              <button
                onClick={() => setStreamMode('var')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  streamMode === 'var'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Sala VAR</span>
              </button>

              <button
                onClick={() => setStreamMode('tv')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  streamMode === 'tv'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Streaming TV</span>
              </button>
            </div>

            {/* Quick Action Tools: Tarea 1 QR, Tarea 2 Monetization & Tarea 1 Reels */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowHighlightReelsModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-pink-300 border border-pink-500/40 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Generar Resumen de Video y Reels en 1 Clic (Tarea 1)"
              >
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">🎬 Resumen Reels (1 Clic)</span>
                <span className="sm:hidden">Reels</span>
              </button>

              <button
                onClick={() => setShowRtmpQrModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Configuración RTMP con QR para Celular (Tarea 1)"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">QR Celular (Tarea 1)</span>
              </button>

              <button
                onClick={() => setShowMonetizationModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Monetizar Highlights & Pases PPV (Tarea 2)"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monetizar (Tarea 2)</span>
              </button>
            </div>
          </div>
        </div>

        {/* SELECTOR DE ENCUENTRO DE LA FECHA */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">Partido en Emisión:</span>
            <div className="flex items-center gap-2 font-bold">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {homeTeam.name} ({homeScore})
              </span>
              <span className="text-slate-500">vs</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {awayTeam.name} ({awayScore})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400 font-medium">Cambiar Partido:</label>
            <select
              value={activeMatchId}
              onChange={(e) => setActiveMatchId(e.target.value)}
              className="bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {matches.map(m => {
                const h = teams.find(t => t.id === m.home_team_id)?.name || 'Local';
                const a = teams.find(t => t.id === m.away_team_id)?.name || 'Visitante';
                return (
                  <option key={m.id} value={m.id}>
                    {h} vs {a} ({m.status === 'IN_PROGRESS' ? '🔴 EN VIVO' : 'Programado'})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* CINTILLO OPERATIVO: LAS TRES TAREAS PRINCIPALES (REELS, FIRESTORE VAR, IA) */}
        <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TAREA 1 */}
          <button
            onClick={() => setShowHighlightReelsModal(true)}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-purple-950/40 border border-pink-500/30 hover:border-pink-400 text-left transition-all cursor-pointer group shadow-lg shadow-pink-500/5 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-pink-400 block tracking-wider font-mono">Tarea 1 • Producción 1-Clic</span>
                <span className="text-xs font-black text-white truncate block">🎬 Resumen Reels y Redes</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-1">Ensambla goles, transiciones y placas en 16:9 y 9:16 en un solo clic.</p>
          </button>

          {/* TAREA 2 */}
          <button
            onClick={() => setStreamMode('var')}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all cursor-pointer group shadow-lg shadow-emerald-500/5 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider font-mono">Tarea 2 • Tribunal de Penas</span>
                <span className="text-xs font-black text-white truncate block">☁️ Sincronizar VAR a Firestore</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-1">Sincroniza el acta forense en tiempo real con la nube para el Tribunal.</p>
          </button>

          {/* TAREA 3 */}
          <button
            onClick={() => setStreamMode('var')}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group shadow-lg shadow-cyan-500/5 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-cyan-400 block tracking-wider font-mono">Tarea 3 • Visión Computacional</span>
                <span className="text-xs font-black text-white truncate block">🤖 Auto-Calibrar IA (&lt;20s)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-1">Calibra automáticamente las líneas de fuera de juego en menos de 20 segundos.</p>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ÁREA CENTRAL: REPRODUCTOR REAL + CONTROLES INTERACTIVOS */}
      {/* ============================================================ */}
      {streamMode === 'var' ? (
        /* CONSOLA DEDICADA VAR FULL-WIDTH DE ALTA DEFINICIÓN */
        <VarReplayStudio
          recordedVideoUrl={recordedVideoUrl}
          capturedClips={capturedClips}
          onSelectClipUrl={(url) => setRecordedVideoUrl(url)}
          match={activeMatch}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onEmitDecision={(decision) => handleTriggerVar(decision)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA PRINCIPAL DEL STREAM (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          {/* BARRA SUPERIOR DE HERRAMIENTAS DE VIDEO */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#090e1a] p-2.5 rounded-2xl border border-white/10 text-xs">
            {/* Fuente de Video & Control de Cámara */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { stopCamera(); setVideoSourceType('youtube'); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  videoSourceType === 'youtube'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Señal YouTube / RTMP</span>
              </button>

              <button
                onClick={() => {
                  if (cameraActive) stopCamera();
                  else startCamera();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{cameraActive ? '🔴 Detener Cámara Cancha' : '📹 Activar Cámara Celular/Webcam'}</span>
              </button>

              {cameraActive && (
                <>
                  <button
                    onClick={flipCamera}
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl cursor-pointer transition-colors"
                    title={`Girar Cámara (Actualmente: ${cameraFacingMode === 'environment' ? 'Trasera/Cancha' : 'Frontal/Selfie'})`}
                  >
                    <SwitchCamera className="w-4 h-4 text-cyan-300" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2 py-1 bg-red-950/80 border border-red-500/40 rounded-xl text-[10px] font-mono text-red-300 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>REC VAR BUFFER: {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}</span>
                  </div>

                  <button
                    onClick={handleOpenVarInstantReplay}
                    className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-md cursor-pointer transition-all animate-pulse"
                    title="Cargar el buffer grabado en tiempo real para análisis en la Sala VAR"
                  >
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>⚡ Revisar en VAR</span>
                  </button>

                  <button
                    onClick={() => handleCaptureRiskClip('Jugada de Riesgo Inmediata', 'risk')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[11px] font-black flex items-center gap-1 shadow-md cursor-pointer transition-all"
                    title="Cortar los últimos 25 segundos y guardarlos como evidencia clave en el VAR y Tienda"
                  >
                    <Flame className="w-3 h-3 text-red-700" />
                    <span>⚡ Cortar Clip Riesgo</span>
                  </button>
                </>
              )}
            </div>

            {/* Opciones de Marcador, Auspiciantes, Sonido y Pantalla */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowScoreOverlay(!showScoreOverlay)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  showScoreOverlay ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'
                }`}
                title="Superponer Marcador de Televisión"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Overlay TV</span>
              </button>

              <button
                onClick={() => setShowSponsorOverlay(!showSponsorOverlay)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  showSponsorOverlay ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400'
                }`}
                title="Auspiciantes & Publicidad Dinámica (Tarea 3)"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auspiciantes (T3)</span>
              </button>

              <button
                onClick={() => setShowHighlightReelsModal(true)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30"
                title="Generar Resumen de Video / Reels en 1 Clic"
              >
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">Reels (1-Clic)</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl cursor-pointer"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl cursor-pointer"
                title="Pantalla Completa"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-300" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
              </button>
            </div>
          </div>

          {/* CONTENEDOR DEL REPRODUCTOR EN VIVO REAL */}
          <div 
            className={`relative aspect-video w-full rounded-3xl overflow-hidden border-2 shadow-2xl bg-black transition-all ${
              streamMode === 'vocalia' ? 'border-emerald-500/30 shadow-emerald-500/10' : 'border-cyan-500/30 shadow-cyan-500/10'
            }`}
          >
            {/* NOTIFICACIÓN EN TIEMPO REAL: JUGADA CORTADA & GUARDADA EN VAR */}
            {clipSavedToast && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/95 border border-emerald-400/60 text-emerald-200 text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{clipSavedToast}</span>
              </div>
            )}

            {/* REPRODUCTOR REAL 1: WEBCAM / CÁMARA CELULAR EN CANCHA (CON ACELERACIÓN GPU AISLADA) */}
            {videoSourceType === 'webcam' ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <video
                  ref={setVideoRef}
                  autoPlay
                  playsInline
                  muted={true}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                />

                {/* Live indicators */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                  <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-rose-500/40 text-[11px] font-mono text-rose-400 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>WEBRTC EN CANCHA ({cameraFacingMode === 'environment' ? 'CAM TRASERA' : 'CAM FRONTAL'})</span>
                  </div>
                  {isRecordingLive && (
                    <div className="bg-red-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-red-500/50 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span>BUFFER VAR ACTIVO</span>
                    </div>
                  )}
                </div>

                {/* Error Banner with clear recovery actions */}
                {cameraError && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                    <AlertCircle className="w-12 h-12 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Aviso de Dispositivo de Cámara</h4>
                    <p className="text-xs text-slate-300 max-w-md">{cameraError}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => startCamera('environment')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reintentar Cámara Trasera
                      </button>
                      <button
                        onClick={() => startCamera('user')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Probar Cámara Frontal
                      </button>
                      <button
                        onClick={() => setVideoSourceType('youtube')}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Ver Señal Demo YouTube
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* REPRODUCTOR REAL 2: IFRAME EMBEBIDO YOUTUBE LIVE (CON VIDEO REAL) */
              <div className="w-full h-full relative">
                <iframe
                  title="Transmisión en Vivo del Partido"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=1&modestbranding=1&rel=0`}
                  className="w-full h-full object-cover border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* AUSPICIANTE Y PUBLICIDAD DINÁMICA ROTATIVA (TAREA 3) */}
            <SponsorOverlayBanner
              isVisible={showSponsorOverlay}
              onToggleVisibility={() => setShowSponsorOverlay(!showSponsorOverlay)}
            />

            {/* MARCADOR GRÁFICO SUPERPUESTO (LIVE BROADCAST TV OVERLAY) */}
            {showScoreOverlay && (
              <div className="absolute top-4 left-4 right-4 pointer-events-none flex flex-col gap-2 z-20">
                {/* Marcador Principal */}
                <div className="self-start flex items-center bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-2xl">
                  {/* Badge LIVE */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 rounded-xl text-white font-black text-[10px] tracking-wider uppercase mr-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>LIVE</span>
                  </div>

                  {/* Equipo Local */}
                  <div className="flex items-center gap-2 px-2">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: homeTeam.primary_color }}></span>
                    <span className="text-white font-black text-xs sm:text-sm tracking-tight">{homeTeam.name}</span>
                    <span className="text-amber-400 font-mono font-black text-base sm:text-lg bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                      {homeScore}
                    </span>
                  </div>

                  <span className="text-white/40 font-mono text-xs px-1">-</span>

                  {/* Equipo Visitante */}
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-amber-400 font-mono font-black text-base sm:text-lg bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                      {awayScore}
                    </span>
                    <span className="text-white font-black text-xs sm:text-sm tracking-tight">{awayTeam.name}</span>
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: awayTeam.primary_color }}></span>
                  </div>

                  {/* Periodo y Tiempo */}
                  <div className="border-l border-white/20 pl-2.5 ml-1 flex items-center gap-1.5 font-mono text-xs text-cyan-300 font-bold">
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-sans">2T</span>
                    <span>{matchMinutes.toString().padStart(2, '0')}:{matchSeconds.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Banner de Resolución VAR si está activo */}
                {isReviewingVar && (
                  <div className="self-start animate-in slide-in-from-top-3 duration-200 bg-rose-600/95 backdrop-blur-md rounded-xl border border-white/30 px-4 py-2 text-white font-black text-xs flex items-center gap-2 shadow-2xl">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                    <span className="tracking-wider uppercase">{varDecisionMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* REACCIONES FLOTANTES DE AFICIONADOS */}
            <div className="absolute bottom-16 right-4 flex flex-col gap-2 pointer-events-none z-20">
              {fanReactions.map(r => (
                <div 
                  key={r.id} 
                  className="animate-in fade-in slide-in-from-bottom-5 duration-300 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                >
                  <span className="text-base">{r.emoji}</span>
                  <span>{r.text}</span>
                </div>
              ))}
            </div>

            {/* CONTROLES INFERIORES SUPERPUESTOS */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
              {/* Botones de Reacción Rápida para la Hinchada */}
              <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
                <button
                  onClick={() => handleAddReaction('🔥', '¡Golazo!')}
                  className="hover:scale-125 transition-transform px-1 cursor-pointer"
                  title="Reaccionar Golazo"
                >
                  🔥
                </button>
                <button
                  onClick={() => handleAddReaction('👏', '¡Buena Jugada!')}
                  className="hover:scale-125 transition-transform px-1 cursor-pointer"
                  title="Aplaudir"
                >
                  👏
                </button>
                <button
                  onClick={() => handleAddReaction('⚠️', '¡Falta!')}
                  className="hover:scale-125 transition-transform px-1 cursor-pointer"
                  title="Reclamar Falta"
                >
                  ⚠️
                </button>
                <button
                  onClick={() => handleAddReaction('⚽', '¡Vamos!')}
                  className="hover:scale-125 transition-transform px-1 cursor-pointer"
                  title="Alentar"
                >
                  ⚽
                </button>
              </div>

              {/* Parámetros Técnicos de Ingesta */}
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-3 h-3" />
                  <span>4.2 Mbps</span>
                </span>
                <span>|</span>
                <span className="text-cyan-400">1080p</span>
                <span>|</span>
                <span className="text-amber-400">SRS RTMP</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PANEL SEGÚN EL MODO: VOCALÍA O VAR O CONFIGURACIÓN TV */}
          {/* ============================================================ */}

          {/* MODO 1: CONTROLES DE VOCALÍA DIGITAL EN VIVO */}
          {streamMode === 'vocalia' && (
            <div className="bg-[#090e1a] p-5 rounded-2xl border border-emerald-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Consola de Vocalía de Mesa en Vivo</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Vocal Activo: Lic. Patricio Vallejo
                </span>
              </div>

              {/* Botones de Registro Inmediato de Incidencias */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => handleAddLiveEvent('goal', 'home')}
                  className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-300 font-bold flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">⚽</span>
                  <span>+1 Gol {homeTeam.name}</span>
                </button>

                <button
                  onClick={() => handleAddLiveEvent('goal', 'away')}
                  className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-300 font-bold flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">⚽</span>
                  <span>+1 Gol {awayTeam.name}</span>
                </button>

                <button
                  onClick={() => handleAddLiveEvent('yellow', 'home')}
                  className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-bold flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <span className="w-3.5 h-4.5 bg-amber-400 rounded-xs inline-block"></span>
                  <span>Tarjeta Amarilla</span>
                </button>

                <button
                  onClick={() => handleAddLiveEvent('red', 'away')}
                  className="p-3 rounded-xl bg-rose-600/15 border border-rose-600/30 hover:bg-rose-600/25 text-rose-400 font-bold flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <span className="w-3.5 h-4.5 bg-rose-500 rounded-xs inline-block"></span>
                  <span>Tarjeta Roja Directa</span>
                </button>
              </div>

              {/* Botón Adicional de Captura Rápida para Vocal */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10">
                <span className="text-xs text-slate-400">¿Ocurrió una jugada dudosa o de alto riesgo?</span>
                <button
                  onClick={() => handleCaptureRiskClip('Revisión Solicitada por Vocalía', 'risk')}
                  className="px-3.5 py-1.5 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>⚡ Cortar Clip de Jugada para el VAR</span>
                </button>
              </div>
            </div>
          )}

          {/* MODO 2: CONFIGURACIÓN STREAMING TV & ENLACE PERSONALIZADO */}
          {streamMode === 'tv' && (
            <div className="bg-[#090e1a] p-5 rounded-2xl border border-cyan-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">Configuración de Transmisión Comunitaria</h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  YouTube Live API + SRS
                </span>
              </div>

              {/* Entrada de URL de YouTube o ID de transmisión propia */}
              <div className="space-y-2 text-xs">
                <label className="text-slate-300 font-semibold block">
                  Conectar tu Propio Canal de YouTube / URL de Transmisión:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    placeholder="Pega el enlace de YouTube Live (ej: https://www.youtube.com/watch?v=...)"
                    className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cargar Stream
                  </button>
                </div>
              </div>

              {/* Presets Rápidos */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400">Señales de Prueba Rápidas:</span>
                {STREAM_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    onClick={() => { setYoutubeVideoId(preset.id); setVideoSourceType('youtube'); }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      youtubeVideoId === preset.id && videoSourceType === 'youtube'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Canal {idx + 1}: {preset.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA LATERAL (4 COLS): CRONOLOGÍA, CHAT Y PARÁMETROS RTMP */}
        <div className="lg:col-span-4 space-y-4">
          {/* LÍNEA DE TIEMPO EN VIVO (EVENTOS MINUTO A MINUTO) */}
          <div className="bg-[#090e1a] p-5 rounded-2xl border border-white/10 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Minuto a Minuto Oficial
              </h4>
              <span className="text-[10px] text-slate-400">Acta Digital</span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {liveEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-2.5 text-xs p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                    {ev.minute}'
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{ev.title}</p>
                    <span className="text-[10px] text-slate-400">{ev.team}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT DE AFICIONADOS EN VIVO */}
          <div className="bg-[#090e1a] p-5 rounded-2xl border border-white/10 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Tribuna Virtual en Directo
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {chatMessages.map(cm => (
                <div key={cm.id} className="text-xs p-2 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-300">{cm.user}</span>
                    <span className="text-slate-500 font-mono">{cm.time}</span>
                  </div>
                  <p className="text-slate-200">{cm.text}</p>
                </div>
              ))}
            </div>

            {/* Input para Enviar Mensaje */}
            <form onSubmit={handleSendComment} className="flex gap-2 pt-1 text-xs">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario a la transmisión..."
                className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors cursor-pointer"
              >
                Enviar
              </button>
            </form>
          </div>

          {/* DATOS DE INGESTA RTMP PARA EMITIR DESDE EL CELULAR */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                Ingesta RTMP (Larix / OBS / Prism):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('rtmp://live.deporverso.com:1935/live');
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey ? 'Copiado' : 'Copiar URL'}</span>
              </button>
            </div>

            <div className="p-2 bg-slate-900 rounded-xl space-y-1 font-mono text-[10px] text-slate-300">
              <div className="truncate">
                <strong className="text-amber-300">Servidor:</strong> rtmp://live.deporverso.com:1935/live
              </div>
              <div className="truncate">
                <strong className="text-amber-300">Clave:</strong> dpv_live_{activeMatch.id}_x79a
              </div>
            </div>

            <button
              onClick={() => setShowRtmpQrModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Escanear Código QR para Celular (Larix / OBS)</span>
            </button>

            <p className="text-[10px] text-slate-400 leading-tight">
              Instala <strong className="text-white">Larix Broadcaster</strong> en Android/iOS o abre tu app de cámara y escanea el QR para vincular automáticamente.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* MODAL 1: CONFIGURACIÓN RTMP CON CÓDIGO QR (TAREA 1) */}
      {showRtmpQrModal && (
        <RtmpQrModal
          isOpen={showRtmpQrModal}
          onClose={() => setShowRtmpQrModal(false)}
          matchId={activeMatch.id}
          matchTitle={`${homeTeam.name} vs ${awayTeam.name}`}
          tenantName={tenant.name}
        />
      )}

      {/* MODAL 2: MONETIZACIÓN DE HIGHLIGHTS CON IA & PPV (TAREA 2) */}
      {showMonetizationModal && (
        <HighlightsMonetizationModal
          isOpen={showMonetizationModal}
          onClose={() => setShowMonetizationModal(false)}
          match={activeMatch}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          tenantName={tenant.name}
        />
      )}

      {/* MODAL 3: GENERADOR AUTOMÁTICO DE RESÚMENES & REELS 1-CLIC (TAREA 1) */}
      {showHighlightReelsModal && (
        <HighlightReelsGeneratorModal
          isOpen={showHighlightReelsModal}
          onClose={() => setShowHighlightReelsModal(false)}
          match={activeMatch}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeScore={homeScore}
          awayScore={awayScore}
          capturedClips={capturedClips}
        />
      )}
    </div>
  );
};
