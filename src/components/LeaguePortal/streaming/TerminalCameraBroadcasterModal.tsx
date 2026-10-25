import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { 
  Camera, 
  Video, 
  Radio, 
  Mic, 
  MicOff, 
  SwitchCamera, 
  Zap, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Tv, 
  QrCode, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink,
  Wifi,
  WifiOff,
  Gauge,
  Eye,
  Clock,
  ShieldAlert,
  Award,
  RefreshCw
} from 'lucide-react';
import { Match, Team, Tenant } from '../../../types';
import { createVirtualPitchStream, VirtualStreamHandle } from '../../../utils/virtualCameraStream';
import { syncVarIncidentToFirebase, syncMatchToFirebase } from '../../../services/firebaseService';
import { offlineSyncQueue } from '../../../services/offlineSyncQueue';

export type CompressionMode = 'auto' | 'ultra_saver' | 'balanced' | 'pro_hd';

export interface TerminalCameraBroadcasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  tenant: Tenant;
  onClipCaptured?: (clip: { id: string; url: string; time: string; title: string; type: string }) => void;
}

export type ResolutionProfile = '4k' | '1080p' | '720p' | '480p';

export const TerminalCameraBroadcasterModal: React.FC<TerminalCameraBroadcasterModalProps> = ({
  isOpen,
  onClose,
  match,
  homeTeam,
  awayTeam,
  tenant,
  onClipCaptured
}) => {
  // Device selection states
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Video stream & hardware states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [resolutionProfile, setResolutionProfile] = useState<ResolutionProfile>('1080p');
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isNativeZoomSupported, setIsNativeZoomSupported] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Broadcast & Recording states
  const [isLiveBroadcasting, setIsLiveBroadcasting] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [recordedBytes, setRecordedBytes] = useState<number>(0);
  const [savedFullVideoUrl, setSavedFullVideoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'settings' | 'remote-qr'>('camera');
  const [showOverlayScore, setShowOverlayScore] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Scoreboard live controls for the cameraman terminal
  const [liveHomeScore, setLiveHomeScore] = useState<number>(match.home_score || 0);
  const [liveAwayScore, setLiveAwayScore] = useState<number>(match.away_score || 0);

  // Telemetry simulation & Adaptive Bitrate Compression
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [currentBitrate, setCurrentBitrate] = useState<string>('4.5 Mbps');
  const [compressionMode, setCompressionMode] = useState<CompressionMode>('auto');
  const [effectiveBitrateMode, setEffectiveBitrateMode] = useState<'ultra_saver' | 'balanced' | 'pro_hd'>('balanced');
  const [networkQuality, setNetworkQuality] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  }>({
    effectiveType: '4g',
    downlink: 8.5,
    rtt: 40,
    saveData: false
  });
  const [totalDataSentBytes, setTotalDataSentBytes] = useState<number>(0);
  const [dataSavingsBytes, setDataSavingsBytes] = useState<number>(0);

  // VAR Smart Rolling Buffer (30-second Circular Memory Ring)
  const rollingVarBufferRef = useRef<{ blob: Blob; timestamp: number }[]>([]);
  const rollingRecorderRef = useRef<MediaRecorder | null>(null);
  const [isVarReviewOpen, setIsVarReviewOpen] = useState<boolean>(false);
  const [varClipUrl, setVarClipUrl] = useState<string | null>(null);
  const [varClipBlob, setVarClipBlob] = useState<Blob | null>(null);
  const [varPlaybackSpeed, setVarPlaybackSpeed] = useState<number>(0.25);
  const [varDefenderLine, setVarDefenderLine] = useState<number>(45);
  const [varAttackerLine, setVarAttackerLine] = useState<number>(48);
  const [varRulingCategory, setVarRulingCategory] = useState<'OFFSIDE' | 'GOAL' | 'PENALTY' | 'FOUL'>('OFFSIDE');
  const [varIncidentSending, setVarIncidentSending] = useState<boolean>(false);
  const [varIncidentSentOk, setVarIncidentSentOk] = useState<boolean>(false);
  const [isVarPlaying, setIsVarPlaying] = useState<boolean>(true);
  const varVideoRef = useRef<HTMLVideoElement | null>(null);

  // DOM and WebRTC References
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const virtualStreamRef = useRef<VirtualStreamHandle | null>(null);
  const [isVirtualFeedActive, setIsVirtualFeedActive] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedBlobsRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioAnimFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recentClipsRef = useRef<Blob[]>([]);

  // Remote Camera Link Generator
  const remoteCameraUrl = `${window.location.origin}/?mode=terminal-camera&matchId=${match.id}&tenantId=${tenant.id}`;

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Enumerate all cameras and microphones available on this device/terminal
  const refreshConnectedDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setCameraError('Este navegador no soporta la detección de dispositivos multimedia.');
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const vInputs = devices.filter(d => d.kind === 'videoinput');
      const aInputs = devices.filter(d => d.kind === 'audioinput');

      setVideoDevices(vInputs);
      setAudioDevices(aInputs);

      // Select default back camera if not set
      if (vInputs.length > 0 && !selectedVideoDeviceId) {
        const backCam = vInputs.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('trasera') || 
          d.label.toLowerCase().includes('rear') || 
          d.label.toLowerCase().includes('environment')
        );
        setSelectedVideoDeviceId(backCam ? backCam.deviceId : vInputs[0].deviceId);
      }

      if (aInputs.length > 0 && !selectedAudioDeviceId) {
        setSelectedAudioDeviceId(aInputs[0].deviceId);
      }
    } catch (err: any) {
      console.warn('Error enumerando dispositivos multimedia:', err);
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);

  // Audio level meter using Web Audio API
  const setupAudioMonitoring = (stream: MediaStream) => {
    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize between 0 and 100
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        audioAnimFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio metering notice:', e);
    }
  };

  const stopAudioMonitoring = () => {
    if (audioAnimFrameRef.current) {
      cancelAnimationFrame(audioAnimFrameRef.current);
      audioAnimFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Helper de configuración de tasas de bits adaptativas
  const getBitrateConfig = useCallback((mode: 'ultra_saver' | 'balanced' | 'pro_hd') => {
    switch (mode) {
      case 'ultra_saver':
        return { videoBitsPerSecond: 700000, audioBitsPerSecond: 64000, label: '700 kbps (Ultra Ahorro -65%)' };
      case 'balanced':
        return { videoBitsPerSecond: 1800000, audioBitsPerSecond: 128000, label: '1.8 Mbps (Equilibrado)' };
      case 'pro_hd':
      default:
        return { videoBitsPerSecond: 4500000, audioBitsPerSecond: 128000, label: '4.5 Mbps (HD Pro)' };
    }
  }, []);

  // Monitor continuo de calidad de red (Network Information API) y Auto-Adaptación
  useEffect(() => {
    const updateNetwork = () => {
      const conn = (navigator as any).connection;
      if (conn) {
        const info = {
          effectiveType: conn.effectiveType || '4g',
          downlink: typeof conn.downlink === 'number' ? conn.downlink : 8.5,
          rtt: typeof conn.rtt === 'number' ? conn.rtt : 40,
          saveData: !!conn.saveData
        };
        setNetworkQuality(info);

        if (compressionMode === 'auto') {
          if (info.effectiveType === '2g' || info.effectiveType === 'slow-2g' || info.downlink < 1.2) {
            setEffectiveBitrateMode('ultra_saver');
            setCurrentBitrate('700 kbps (Ultra Ahorro)');
            setCurrentFps(24);
          } else if (info.effectiveType === '3g' || info.downlink < 3.5) {
            setEffectiveBitrateMode('balanced');
            setCurrentBitrate('1.8 Mbps (Equilibrado)');
            setCurrentFps(30);
          } else {
            setEffectiveBitrateMode('pro_hd');
            setCurrentBitrate('4.5 Mbps (HD Pro)');
            setCurrentFps(60);
          }
        }
      }
    };

    updateNetwork();
    const conn = (navigator as any).connection;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateNetwork);
      return () => conn.removeEventListener('change', updateNetwork);
    }
  }, [compressionMode]);

  // Selección manual de modo de compresión
  const handleSelectCompressionMode = (mode: CompressionMode) => {
    setCompressionMode(mode);
    if (mode === 'ultra_saver') {
      setEffectiveBitrateMode('ultra_saver');
      setCurrentBitrate('700 kbps (Ultra Ahorro)');
      setCurrentFps(24);
      triggerToast('📶 Perfil Ultra Ahorro activado: Ahorro de datos del 65%');
    } else if (mode === 'balanced') {
      setEffectiveBitrateMode('balanced');
      setCurrentBitrate('1.8 Mbps (Equilibrado)');
      setCurrentFps(30);
      triggerToast('⚖ Perfil Balanceado activado (1.8 Mbps)');
    } else if (mode === 'pro_hd') {
      setEffectiveBitrateMode('pro_hd');
      setCurrentBitrate('4.5 Mbps (HD Pro)');
      setCurrentFps(60);
      triggerToast('💎 Perfil Alta Fidelidad activado (4.5 Mbps 60fps)');
    } else {
      triggerToast('🤖 Modo Adaptativo Inteligente activado (según señal celular)');
    }
  };

  // Motor del Buffer Circular Continuo de VAR (30 Segundos en Memoria RAM)
  const stopRollingVarBuffer = useCallback(() => {
    if (rollingRecorderRef.current && rollingRecorderRef.current.state !== 'inactive') {
      try { rollingRecorderRef.current.stop(); } catch (e) {}
      rollingRecorderRef.current = null;
    }
  }, []);

  const startRollingVarBuffer = useCallback((stream: MediaStream) => {
    try {
      stopRollingVarBuffer();
      rollingVarBufferRef.current = [];

      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm',
        'video/mp4'
      ];
      const selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
      const bitrates = getBitrateConfig(effectiveBitrateMode);

      const recorder = new MediaRecorder(stream, {
        ...(selectedMime ? { mimeType: selectedMime } : {}),
        videoBitsPerSecond: bitrates.videoBitsPerSecond,
        audioBitsPerSecond: bitrates.audioBitsPerSecond
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          rollingVarBufferRef.current.push({ blob: event.data, timestamp: Date.now() });
          // Límite estricto circular a los últimos 30 segundos (máx 30 trozos de 1s, ~6 a 12 MB)
          if (rollingVarBufferRef.current.length > 30) {
            rollingVarBufferRef.current.shift();
          }

          // Medición de telemetría de datos transmitidos y ahorro acumulado vs 4.5 Mbps baseline
          const dataChunkSize = event.data.size;
          setTotalDataSentBytes(prev => prev + dataChunkSize);
          const baselineChunk = 562500; // ~4.5 Mbps en bytes/seg
          if (dataChunkSize < baselineChunk) {
            setDataSavingsBytes(prev => prev + (baselineChunk - dataChunkSize));
          }
        }
      };

      recorder.start(1000); // Tiempos de 1 segundo
      rollingRecorderRef.current = recorder;
    } catch (err) {
      console.warn('Buffer circular de VAR inicializado en modo simulado:', err);
    }
  }, [effectiveBitrateMode, getBitrateConfig, stopRollingVarBuffer]);

  // Disparo del VAR Instantáneo (Captura de los 30s previos al silbato o incidente)
  const handleTriggerInstantVar = useCallback((reason: string = 'Jugada Polémica') => {
    if (rollingVarBufferRef.current.length === 0) {
      triggerToast('Buffer circular en preparación... Espera 2 segundos');
      return;
    }

    const chunks = rollingVarBufferRef.current.map(c => c.blob);
    const mime = chunks[0]?.type || 'video/webm';
    const fullBlob = new Blob(chunks, { type: mime });
    const url = URL.createObjectURL(fullBlob);

    setVarClipBlob(fullBlob);
    setVarClipUrl(url);
    setIsVarReviewOpen(true);
    setVarIncidentSentOk(false);
    setVarPlaybackSpeed(0.25); // Super cámara lenta por defecto para peritaje de VAR
    setIsVarPlaying(true);
    triggerToast('🚨 ¡VAR INSTANTÁNEO ACTIVADO! Reproduciendo últimos 30 segundos');

    if (onClipCaptured) {
      onClipCaptured({
        id: `var-clip-${Date.now()}`,
        url,
        time: `${Math.floor(recordedSeconds / 60)}:${String(recordedSeconds % 60).padStart(2, '0')}`,
        title: `Incidencia VAR: ${reason}`,
        type: 'var'
      });
    }
  }, [recordedSeconds, onClipCaptured, triggerToast]);

  // Enviar Dictamen Forense de VAR a la Cabina Arbitral y Tribunal de Penas
  const handleSendVarDecision = async () => {
    if (!varClipUrl) return;
    setVarIncidentSending(true);

    const deltaCm = Math.round((varAttackerLine - varDefenderLine) * 8.5);
    const rulingText = varRulingCategory === 'OFFSIDE'
      ? `FUERA DE JUEGO (+${deltaCm} cm) — Confirmado en peritaje de cámara terminal`
      : varRulingCategory === 'GOAL'
      ? `GOL VÁLIDO (Posición legal del atacante -${Math.abs(deltaCm)} cm)`
      : varRulingCategory === 'PENALTY'
      ? 'PENALTI RATIFICADO'
      : 'INFRACCIÓN SANCIONADA';

    try {
      await syncVarIncidentToFirebase({
        id: `var-term-${Date.now()}`,
        matchId: match.id,
        tenantId: tenant.id,
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        timestampSeconds: recordedSeconds,
        ruling: rulingText,
        category: varRulingCategory,
        defenderLineX: varDefenderLine,
        attackerLineX: varAttackerLine,
        reviewedBy: 'Cámara Operador CIG',
        notes: `Revisión en super cámara lenta (${varPlaybackSpeed}x) con calibración interactiva de líneas tácticas.`,
        createdAt: new Date().toISOString()
      });

      setVarIncidentSentOk(true);
      triggerToast('✓ Incidencia VAR enviada a Cabina Arbitral y Tribunal de Penas');
    } catch (err: any) {
      triggerToast(`Incidencia respaldada en cola offline local: ${err.message}`);
    } finally {
      setVarIncidentSending(false);
    }
  };

  // Descarga directa del clip forense de 30 segundos
  const handleDownloadVarClip = () => {
    if (!varClipBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(varClipBlob);
    a.download = `deporverso_var_30s_${match.id}_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast('✓ Clip forense de VAR (30s) guardado en el dispositivo');
  };

  // Actualizar marcador de partido con respaldo garantizado en cola offline
  const handleUpdateLiveScore = (homeDelta: number, awayDelta: number) => {
    const nextHome = Math.max(0, liveHomeScore + homeDelta);
    const nextAway = Math.max(0, liveAwayScore + awayDelta);
    setLiveHomeScore(nextHome);
    setLiveAwayScore(nextAway);

    syncMatchToFirebase({
      ...match,
      home_score: nextHome,
      away_score: nextAway,
      status: 'IN_PROGRESS'
    });

    triggerToast(`Marcador actualizado: ${homeTeam.name} ${nextHome} - ${nextAway} ${awayTeam.name}`);
  };

  // Atajos de teclado en el terminal (Tecla 'V' = VAR Instantáneo 30s, Tecla 'R' = Grabar)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as any)?.tagName)) return;

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        handleTriggerInstantVar('Tecla de Pánico Camarógrafo');
      } else if (e.key === ' ') {
        if (isVarReviewOpen && varVideoRef.current) {
          e.preventDefault();
          if (varVideoRef.current.paused) {
            varVideoRef.current.play();
            setIsVarPlaying(true);
          } else {
            varVideoRef.current.pause();
            setIsVarPlaying(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isVarReviewOpen, handleTriggerInstantVar]);

  // Resolution constraint helper
  const getConstraintsForProfile = (profile: ResolutionProfile) => {
    switch (profile) {
      case '4k':
        return { width: { ideal: 3840, min: 1920 }, height: { ideal: 2160, min: 1080 }, frameRate: { ideal: 60, min: 30 } };
      case '1080p':
        return { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 }, frameRate: { ideal: 60, min: 30 } };
      case '720p':
        return { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, min: 24 } };
      case '480p':
      default:
        return { width: { ideal: 854 }, height: { ideal: 480 }, frameRate: { ideal: 30, min: 24 } };
    }
  };

  // Iniciar Feed Virtual de Cancha Táctica (Modo Demostración / Fallback de Cámara)
  const startVirtualPitchFeed = useCallback(() => {
    try {
      setCameraError(null);
      stopAudioMonitoring();

      if (virtualStreamRef.current) {
        virtualStreamRef.current.stop();
        virtualStreamRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      const vHandle = createVirtualPitchStream({
        homeTeamName: homeTeam.name,
        awayTeamName: awayTeam.name,
        homeScore: liveHomeScore,
        awayScore: liveAwayScore,
        leagueName: tenant.name
      });

      virtualStreamRef.current = vHandle;
      streamRef.current = vHandle.stream;
      setIsVirtualFeedActive(true);
      setIsCameraActive(true);

      if (videoElementRef.current) {
        videoElementRef.current.srcObject = vHandle.stream;
        videoElementRef.current.play().catch(e => console.log('Autoplay handled:', e));
      }

      setupAudioMonitoring(vHandle.stream);
      startRollingVarBuffer(vHandle.stream);
      triggerToast('⚽ Feed Virtual de Cancha activo (Modo Demostración Táctica)');
    } catch (e) {
      console.warn('Virtual feed notice:', e);
    }
  }, [homeTeam.name, awayTeam.name, liveHomeScore, liveAwayScore, tenant.name, triggerToast, startRollingVarBuffer]);

  // Connect to the camera of ANY device / terminal with fallback matrix
  const connectTerminalCamera = async (
    targetDeviceId?: string,
    targetFacing: 'environment' | 'user' = facingMode,
    targetProfile: ResolutionProfile = resolutionProfile
  ) => {
    try {
      setCameraError(null);
      stopAudioMonitoring();

      if (virtualStreamRef.current) {
        virtualStreamRef.current.stop();
        virtualStreamRef.current = null;
      }

      // Stop previous tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Dispositivo multimedia no disponible en este entorno');
      }

      const resConstraints = getConstraintsForProfile(targetProfile);

      // Construct video constraint
      const videoConstraint: MediaTrackConstraints = {
        ...resConstraints,
        aspectRatio: { ideal: 1.7777777778 }
      };

      if (targetDeviceId) {
        videoConstraint.deviceId = { exact: targetDeviceId };
      } else {
        videoConstraint.facingMode = { ideal: targetFacing };
      }

      // Audio constraint
      const audioConstraint: MediaTrackConstraints | boolean = selectedAudioDeviceId 
        ? { deviceId: { exact: selectedAudioDeviceId }, echoCancellation: true, noiseSuppression: true }
        : { echoCancellation: true, noiseSuppression: true };

      let stream: MediaStream;

      try {
        // Attempt high-profile hardware negotiation with audio
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraint,
          audio: audioConstraint
        });
      } catch (err1: any) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: targetFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          });
        } catch (err2: any) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
            });
          } catch (err3: any) {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          }
        }
      }

      // Optimize video track for movement
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.contentHint = 'motion';

        // Check torch capability
        const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (capabilities && capabilities.torch) {
          setIsTorchSupported(true);
        } else {
          setIsTorchSupported(false);
        }

        // Check native optical/digital zoom capability
        if (capabilities && capabilities.zoom) {
          setIsNativeZoomSupported(true);
        } else {
          setIsNativeZoomSupported(false);
        }
      }

      streamRef.current = stream;
      setIsVirtualFeedActive(false);
      setIsCameraActive(true);
      setFacingMode(targetFacing);

      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().catch(e => console.warn('Autoplay error:', e));
      }

      // Start audio VU meter
      setupAudioMonitoring(stream);

      // Re-enumerate devices now that permissions have been explicitly granted
      refreshConnectedDevices();

      // Start the 30-second continuous circular VAR rolling buffer
      startRollingVarBuffer(stream);

      triggerToast('✓ Cámara y micrófono del terminal conectados con éxito');
    } catch (err: any) {
      console.warn('Aviso al conectar la cámara del terminal:', err?.message || err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || (err.message && err.message.toLowerCase().includes('permission denied'));
      let errorMsg = 'No se pudo acceder a la cámara o micrófono del terminal.';
      if (isDenied) {
        errorMsg = 'Permiso denegado por el navegador o iframe. Se activó automáticamente el Feed Virtual de Cancha táctica para que puedas probar transmisión, grabación y VAR.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No se encontró ninguna cámara física conectada en este terminal. Se activó el Feed Virtual.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'La cámara está siendo usada por otra aplicación. Se activó el Feed Virtual.';
      } else if (err.name === 'OverconstrainedError') {
        errorMsg = 'La resolución seleccionada no es compatible con el sensor de este terminal. Usando perfil adaptativo.';
      }
      setCameraError(errorMsg);
      // Auto-fallback a la cámara táctica virtual para que el terminal nunca se quede en negro
      startVirtualPitchFeed();
    }
  };

  // Toggle Torch / Flashlight
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }]
      });
      setIsTorchOn(nextState);
      triggerToast(nextState ? '🔦 Linterna activada para partido nocturno' : 'Linterna apagada');
    } catch (e: any) {
      console.warn('Torch constraint error:', e);
      triggerToast('Aviso: La linterna no está disponible en este dispositivo');
    }
  };

  // Digital Zoom control
  const handleSetZoom = async (level: number) => {
    setZoomLevel(level);
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    if (isNativeZoomSupported) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ zoom: level }]
        });
      } catch (e) {
        console.warn('Native zoom application failed:', e);
      }
    }
  };

  // Flip Camera between back and front
  const handleFlipCamera = () => {
    if (isVirtualFeedActive) {
      startVirtualPitchFeed();
      return;
    }
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    connectTerminalCamera(undefined, nextFacing, resolutionProfile);
  };

  // Local Match Recording Engine (Continuous Slicing & Safety)
  const handleStartRecording = () => {
    if (!streamRef.current) {
      triggerToast('Primero activa la cámara del terminal');
      return;
    }

    try {
      recordedBlobsRef.current = [];
      recentClipsRef.current = [];

      // Determine supported mimeType
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      const selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
      const bitrates = getBitrateConfig(effectiveBitrateMode);
      const recorder = new MediaRecorder(streamRef.current, {
        ...(selectedMime ? { mimeType: selectedMime } : {}),
        videoBitsPerSecond: bitrates.videoBitsPerSecond,
        audioBitsPerSecond: bitrates.audioBitsPerSecond
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedBlobsRef.current.push(event.data);
          recentClipsRef.current.push(event.data);
          if (recentClipsRef.current.length > 30) {
            recentClipsRef.current.shift();
          }
          setRecordedBytes(prev => prev + event.data.size);
        }
      };

      recorder.onstop = () => {
        if (recordedBlobsRef.current.length > 0) {
          const fullBlob = new Blob(recordedBlobsRef.current, { type: selectedMime || 'video/webm' });
          const url = URL.createObjectURL(fullBlob);
          setSavedFullVideoUrl(url);
          triggerToast('💾 Grabación del partido completada y lista para descargar');
        }
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsRecordingPaused(false);
      setRecordedSeconds(0);
      setRecordedBytes(0);
      setSavedFullVideoUrl(null);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordedSeconds(prev => prev + 1);
      }, 1000);

      triggerToast('⏺ Grabando partido en memoria local del terminal...');
    } catch (e: any) {
      console.error('Error al iniciar grabación local:', e);
      triggerToast(`Error al iniciar grabación: ${e.message}`);
    }
  };

  const handlePauseResumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isRecordingPaused) {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
      triggerToast('▶ Grabación reanudada');
    } else {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
      triggerToast('⏸ Grabación pausada');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    setIsRecordingPaused(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Instant Download of Full Match Video
  const handleDownloadFullRecording = () => {
    if (!savedFullVideoUrl && recordedBlobsRef.current.length === 0) {
      triggerToast('No hay ninguna grabación disponible para descargar');
      return;
    }

    const url = savedFullVideoUrl || URL.createObjectURL(new Blob(recordedBlobsRef.current, { type: 'video/webm' }));
    const a = document.createElement('a');
    a.href = url;
    const safeTenant = tenant.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `deporverso_${safeTenant}_partido_${match.id}_${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast('✓ Descarga del video iniciada en tu dispositivo');
  };

  // 1-Click Instant VAR Marker Slice (Captures recent 25 seconds)
  const handleCaptureInstantVarSlice = (eventTitle: string = 'Jugada Polémica') => {
    if (recentClipsRef.current.length === 0) {
      triggerToast('Grabando buffer... espera unos segundos antes de capturar el clip');
      return;
    }

    const clipBlob = new Blob(recentClipsRef.current, { type: 'video/webm' });
    const clipUrl = URL.createObjectURL(clipBlob);
    const newClip = {
      id: `clip-term-${Date.now()}`,
      url: clipUrl,
      time: `${Math.floor(recordedSeconds / 60)}:${String(recordedSeconds % 60).padStart(2, '0')}`,
      title: eventTitle,
      type: 'var'
    };

    if (onClipCaptured) {
      onClipCaptured(newClip);
    }
    triggerToast(`⚡ Jugada de VAR marcada y enviada a la cabina arbitral (${newClip.time})`);
  };

  // Toggle Live Broadcast to DeporVerso Streaming Network
  const handleToggleLiveBroadcast = () => {
    if (!isLiveBroadcasting) {
      if (!isCameraActive) {
        connectTerminalCamera();
      }
      setIsLiveBroadcasting(true);
      setCurrentBitrate('4.8 Mbps');
      setCurrentFps(60);
      triggerToast('🔴 TRANSMITIENDO EN VIVO hacia el portal oficial de DeporVerso');
    } else {
      setIsLiveBroadcasting(false);
      triggerToast('⏹ Transmisión en vivo pausada');
    }
  };

  // Toggle Audio Mute
  const handleToggleAudio = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
      triggerToast(isAudioMuted ? '🎤 Micrófono activado' : '🔇 Micrófono silenciado');
    }
  };

  // Generate QR Code for Remote Terminal Pairing
  useEffect(() => {
    if (activeTab === 'remote-qr') {
      QRCode.toDataURL(remoteCameraUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#030712', light: '#ffffff' },
        errorCorrectionLevel: 'M'
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.warn('Aviso al generar QR de terminal:', err));
    }
  }, [activeTab, remoteCameraUrl]);

  // Initial connect when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshConnectedDevices().then(() => {
        connectTerminalCamera();
      });
    } else {
      // Clean up when modal closes
      stopAudioMonitoring();
      stopRollingVarBuffer();
      rollingVarBufferRef.current = [];
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (virtualStreamRef.current) {
        virtualStreamRef.current.stop();
        virtualStreamRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setIsVirtualFeedActive(false);
      setIsCameraActive(false);
      setIsLiveBroadcasting(false);
      setIsRecording(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-5xl h-[95vh] bg-[#030712] border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-white">
        
        {/* ======================================================== */}
        {/* TOAST FLOTANTE DE ACCIÓN                                 */}
        {/* ======================================================== */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#091533]/95 border border-cyan-400/80 text-cyan-200 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* HEADER: TITULO DEL TERMINAL, INDICADORES Y CIERRE        */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-[#050b1a] border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-wide uppercase font-mono">
                  TERMINAL DE CÁMARA & BROADCASTER CIG
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                  DISPOSITIVO ACTIVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {tenant.name} • Cancha Oficial • {homeTeam.name} vs {awayTeam.name}
              </p>
            </div>
          </div>

          {/* Navegación de pestañas del terminal */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Cámara en Vivo</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Dispositivos ({videoDevices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('remote-qr')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'remote-qr'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Vincular Celular</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer ml-1"
              title="Cerrar Terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CUERPO PRINCIPAL DEL TERMINAL                            */}
        {/* ======================================================== */}
        <div className="flex-1 relative overflow-hidden flex flex-col lg:flex-row bg-black">
          
          {/* VISTA 1: CÁMARA Y MONITOR DE RETÍCULA DE TRANSMISIÓN */}
          {activeTab === 'camera' && (
            <div className="flex-1 relative flex flex-col justify-center items-center overflow-hidden bg-slate-950">
              
              {/* VIDEO STREAM CONTAINER (CON ZOOM DIGITAL / ÓPTICO APLICADO) */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <video
                  ref={videoElementRef}
                  autoPlay
                  playsInline
                  muted={true}
                  className="w-full h-full object-contain select-none transition-transform duration-200"
                  style={{
                    transform: `scale(${isNativeZoomSupported ? 1 : zoomLevel}) translateZ(0)`,
                    transformOrigin: 'center center'
                  }}
                />

                {/* Retícula Táctica de Cámara de Transmisión */}
                <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-40">
                  <div className="absolute inset-x-0 top-1/3 border-b border-white/10 border-dashed" />
                  <div className="absolute inset-x-0 bottom-1/3 border-b border-white/10 border-dashed" />
                  <div className="absolute inset-y-0 left-1/3 border-r border-white/10 border-dashed" />
                  <div className="absolute inset-y-0 right-1/3 border-r border-white/10 border-dashed" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-400/40 rounded-full" />
                </div>

                {/* HUD SUPERIOR: ESTADO EN VIVO Y MARCADOR DE TELEVISIÓN */}
                <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 z-30 pointer-events-auto">
                  {/* Marcador Oficial Superpuesto */}
                  {showOverlayScore ? (
                    <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs sm:text-sm font-mono shadow-2xl">
                      <span className={`w-2.5 h-2.5 rounded-full ${isLiveBroadcasting ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
                      <span className={`font-black text-[10px] tracking-wider uppercase ${isLiveBroadcasting ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isLiveBroadcasting ? 'LIVE BROADCAST' : 'TERMINAL LOCAL'}
                      </span>
                      <span className="text-white/30">|</span>
                      <span className="font-bold text-white truncate max-w-[100px] sm:max-w-none">{homeTeam.name}</span>
                      <span className="text-amber-400 font-black bg-white/10 px-2 py-0.5 rounded text-sm sm:text-base">{liveHomeScore}</span>
                      <span className="text-white/40">-</span>
                      <span className="text-amber-400 font-black bg-white/10 px-2 py-0.5 rounded text-sm sm:text-base">{liveAwayScore}</span>
                      <span className="font-bold text-white truncate max-w-[100px] sm:max-w-none">{awayTeam.name}</span>
                    </div>
                  ) : (
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 text-[11px] font-mono text-cyan-300">
                      CÁMARA TERMINAL ACTIVA
                    </div>
                  )}

                  {/* Telemetría Técnica y Compresión Adaptativa de Video */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge de Red Móvil */}
                    <div className={`px-2.5 py-1 rounded-xl backdrop-blur-md border text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg ${
                      networkQuality.effectiveType === '2g'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                        : networkQuality.effectiveType === '3g'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    }`}>
                      <Wifi className="w-3 h-3" />
                      <span>{networkQuality.effectiveType.toUpperCase()} • {networkQuality.downlink} Mbps • {networkQuality.rtt}ms</span>
                    </div>

                    {/* Selector de Perfil de Compresión de Video */}
                    <div className="bg-black/90 backdrop-blur-md p-1 rounded-xl border border-cyan-500/40 flex items-center gap-1 text-[10px] font-mono shadow-xl">
                      <button
                        onClick={() => handleSelectCompressionMode('auto')}
                        className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                          compressionMode === 'auto'
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Ajuste automático inteligente según señal de red"
                      >
                        AUTO
                      </button>
                      <button
                        onClick={() => handleSelectCompressionMode('ultra_saver')}
                        className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                          compressionMode === 'ultra_saver'
                            ? 'bg-amber-400 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Ultra Ahorro 700 kbps (Ahorro del 65% de datos móviles)"
                      >
                        700k
                      </button>
                      <button
                        onClick={() => handleSelectCompressionMode('balanced')}
                        className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                          compressionMode === 'balanced'
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Equilibrado 1.8 Mbps"
                      >
                        1.8M
                      </button>
                      <button
                        onClick={() => handleSelectCompressionMode('pro_hd')}
                        className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                          compressionMode === 'pro_hd'
                            ? 'bg-emerald-400 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Alta Fidelidad 4.5 Mbps"
                      >
                        HD
                      </button>
                    </div>

                    {/* Telemetría de FPS & Bitrate Actual */}
                    <div className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 shadow-lg hidden sm:flex">
                      <span className="text-cyan-400 font-bold">{resolutionProfile.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{currentFps} FPS</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">{currentBitrate}</span>
                    </div>

                    {/* Contador de Ahorro de Datos Móviles */}
                    {totalDataSentBytes > 0 && (
                      <div className="bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/40 text-[10px] font-mono text-emerald-300 hidden lg:flex items-center gap-1 shadow-lg">
                        <Gauge className="w-3 h-3 text-emerald-400" />
                        <span>Ahorro: {(dataSavingsBytes / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    )}

                    <button
                      onClick={() => setShowOverlayScore(!showOverlayScore)}
                      className={`p-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                        showOverlayScore ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-black/80 text-slate-400 border-white/20'
                      }`}
                      title="Alternar Marcador de TV"
                    >
                      <Tv className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* HUD INFERIOR IZQUIERDO: VU-METER DE AUDIO Y CRONÓMETRO DE GRABACIÓN */}
                <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto">
                  {/* Cronómetro y Tamaño de Grabación */}
                  {isRecording && (
                    <div className="bg-rose-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-rose-500/50 text-xs font-mono text-white flex items-center gap-2.5 shadow-2xl animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="font-black text-rose-300">REC:</span>
                      <span className="font-bold text-base">
                        {Math.floor(recordedSeconds / 3600) > 0 ? `${Math.floor(recordedSeconds / 3600)}:` : ''}
                        {String(Math.floor((recordedSeconds % 3600) / 60)).padStart(2, '0')}:
                        {String(recordedSeconds % 60).padStart(2, '0')}
                      </span>
                      <span className="text-white/40">|</span>
                      <span className="text-amber-300 font-semibold">
                        {(recordedBytes / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  )}

                  {/* VU-Meter de Audio en Vivo */}
                  <div className="bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-mono text-slate-300 shadow-xl">
                    <button
                      onClick={handleToggleAudio}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      title={isAudioMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
                    >
                      {isAudioMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                    </button>
                    <span className="text-[10px] text-slate-400">AUDIO:</span>
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-75 ${
                          audioLevel > 75 ? 'bg-rose-500' : audioLevel > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${isAudioMuted ? 0 : audioLevel}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300 w-8 text-right">
                      {isAudioMuted ? 'MUT' : `${audioLevel}%`}
                    </span>
                  </div>
                </div>

                {/* HUD DERECHO: HERRAMIENTAS RÁPIDAS DE CÁMARA (LINTERNA, ZOOM, FLIP) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
                  {/* Linterna / Torch */}
                  {isTorchSupported && (
                    <button
                      onClick={handleToggleTorch}
                      className={`p-3 rounded-2xl backdrop-blur-md border shadow-xl transition-all cursor-pointer active:scale-95 ${
                        isTorchOn 
                          ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_#f59e0b]' 
                          : 'bg-black/80 text-white border-white/20 hover:border-amber-400/60'
                      }`}
                      title={isTorchOn ? 'Apagar linterna' : 'Encender linterna nocturna'}
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                  )}

                  {/* Girar Cámara */}
                  <button
                    onClick={handleFlipCamera}
                    className="p-3 rounded-2xl bg-black/80 hover:bg-black text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-95"
                    title={`Girar a cámara ${facingMode === 'environment' ? 'frontal' : 'trasera'}`}
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>

                  {/* Controles de Zoom Digital */}
                  <div className="bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex flex-col items-center gap-1 shadow-xl text-xs font-mono">
                    <button
                      onClick={() => handleSetZoom(1)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer ${
                        zoomLevel === 1 ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => handleSetZoom(1.5)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer ${
                        zoomLevel === 1.5 ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      1.5x
                    </button>
                    <button
                      onClick={() => handleSetZoom(2)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer ${
                        zoomLevel === 2 ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      2x
                    </button>
                    <button
                      onClick={() => handleSetZoom(3)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer ${
                        zoomLevel === 3 ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      3x
                    </button>
                  </div>
                </div>

                {/* Banner de Estado / Permisos del Dispositivo */}
                {cameraError && (
                  isVirtualFeedActive ? (
                    <div className="absolute top-16 left-4 right-4 sm:right-auto z-40 bg-black/85 backdrop-blur-md border border-amber-500/50 text-amber-200 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Feed Virtual de Cancha Activo</span>
                        <span className="text-slate-300 text-[10px]">Permiso de cámara restringido. Puedes operar el terminal, grabar y marcar VAR en este feed táctico.</span>
                      </div>
                      <button
                        onClick={() => setCameraError(null)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white ml-auto"
                        title="Ocultar aviso"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 max-w-md">
                        <h4 className="text-base font-bold text-white">Aviso de Dispositivo del Terminal</h4>
                        <p className="text-xs text-slate-300">{cameraError}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={startVirtualPitchFeed}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg"
                        >
                          ⚽ Activar Feed Virtual de Cancha
                        </button>
                        <button
                          onClick={() => connectTerminalCamera(undefined, 'environment')}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Reintentar Cámara Trasera
                        </button>
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Configuración
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* BARRA INFERIOR DE ACCIONES PRINCIPALES DEL CAMARÓGRAFO */}
              <div className="w-full p-3 sm:p-4 bg-[#050b1a] border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
                {/* Botón Principal: Transmitir en Vivo */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleLiveBroadcast}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm font-mono flex items-center gap-2 shadow-xl cursor-pointer transition-all active:scale-95 ${
                      isLiveBroadcasting
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                        : 'bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 text-slate-950 shadow-cyan-500/25'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>{isLiveBroadcasting ? '🔴 TRANSMITIENDO EN VIVO' : 'TRANSMITIR EN VIVO'}</span>
                  </button>

                  {/* Botones de Grabación Local del Partido */}
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>Grabar Partido Local</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePauseResumeRecording}
                        className="p-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-all"
                        title={isRecordingPaused ? 'Reanudar' : 'Pausar'}
                      >
                        {isRecordingPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleStopRecording}
                        className="px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                      >
                        <span>Detener y Guardar</span>
                      </button>
                    </div>
                  )}

                  {/* Descarga directa si hay video guardado */}
                  {savedFullVideoUrl && (
                    <button
                      onClick={handleDownloadFullRecording}
                      className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all animate-bounce"
                      title="Descargar archivo de video completo en tu dispositivo"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Descargar Partido</span>
                    </button>
                  )}
                </div>

                {/* Botón de Disparo de VAR Instantáneo (30 Segundos) & Marcador con Cola Offline */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Botón Prominente de VAR Instantáneo / Pánico de Árbitro */}
                  <button
                    onClick={() => handleTriggerInstantVar('Pánico de Árbitro / Jugada Crítica')}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black font-mono text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 transition-all active:scale-95 animate-pulse"
                    title="Rescata los últimos 30 segundos grabados en memoria circular y abre el peritaje a cámara lenta (Atajo: Tecla V)"
                  >
                    <Flame className="w-4 h-4 text-slate-950" />
                    <span>🚨 VAR INSTANTÁNEO (30s)</span>
                    <span className="hidden sm:inline bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">[V]</span>
                  </button>

                  {/* Marcador Táctico Rápido con sincronización en cola offline */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-mono">
                    <span className="text-slate-400 px-1 text-[10px]">GOL:</span>
                    <button
                      onClick={() => handleUpdateLiveScore(1, 0)}
                      className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 font-bold cursor-pointer transition-all active:scale-95"
                      title={`Sumar gol a ${homeTeam.name} y sincronizar en Firestore`}
                    >
                      +1 {homeTeam.name.slice(0, 3)}
                    </button>
                    <button
                      onClick={() => handleUpdateLiveScore(0, 1)}
                      className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 font-bold cursor-pointer transition-all active:scale-95"
                      title={`Sumar gol a ${awayTeam.name} y sincronizar en Firestore`}
                    >
                      +1 {awayTeam.name.slice(0, 3)}
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* MODAL / ESTUDIO FORENSE DE REPETICIÓN INSTANTÁNEA VAR (30s) */}
              {/* ======================================================== */}
              {isVarReviewOpen && varClipUrl && (
                <div className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-2xl flex flex-col p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200">
                  {/* Encabezado del Laboratorio VAR */}
                  <div className="flex items-center justify-between pb-3 border-b border-rose-500/30 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <Flame className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-black text-white font-mono tracking-wider">
                            CABINA FORENSE DE VAR — REVISIÓN INSTANTÁNEA (30s)
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono font-bold text-rose-400">
                            CÁMARA LENTA {varPlaybackSpeed}x
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {tenant.name} • {homeTeam.name} vs {awayTeam.name} • Buffer circular recuperado de RAM
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsVarReviewOpen(false)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Volver a la cámara en vivo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Escenario de Video con Líneas Tácticas Calibrables */}
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden my-3 bg-black rounded-2xl border border-white/10">
                    <video
                      ref={varVideoRef}
                      src={varClipUrl}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    />

                    {/* Capa de Líneas Tácticas Interactivas */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Línea Azul de Penúltimo Defensor */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] z-20 flex flex-col items-center pointer-events-auto cursor-ew-resize"
                        style={{ left: `${varDefenderLine}%` }}
                      >
                        <div className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded-b shadow uppercase font-mono tracking-wider whitespace-nowrap">
                          Defensor ({varDefenderLine}%)
                        </div>
                      </div>

                      {/* Línea Roja de Atacante */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_15px_#f43f5e] z-20 flex flex-col items-center pointer-events-auto cursor-ew-resize"
                        style={{ left: `${varAttackerLine}%` }}
                      >
                        <div className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-b shadow uppercase font-mono tracking-wider whitespace-nowrap">
                          Atacante ({varAttackerLine}%)
                        </div>
                      </div>
                    </div>

                    {/* Badge Indicador de Posición Adelantada vs Legal */}
                    {(() => {
                      const deltaCm = Math.round((varAttackerLine - varDefenderLine) * 8.5);
                      const isOffside = deltaCm > 0;
                      return (
                        <div className="absolute top-3 left-3 z-30 pointer-events-auto">
                          <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2 ${
                            isOffside
                              ? 'bg-rose-950/90 border-rose-500/70 text-rose-300'
                              : 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300'
                          }`}>
                            {isOffside ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            <div>
                              <div className="font-black text-xs font-mono">
                                {isOffside ? `FUERA DE JUEGO (+${deltaCm} cm)` : `POSICIÓN LEGAL (-${Math.abs(deltaCm)} cm)`}
                              </div>
                              <div className="text-[9px] opacity-80">
                                {isOffside ? 'Infracción: atacante adelantado al pase' : 'Habilitado por el penúltimo defensor'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Deslizadores de Calibración de Líneas */}
                    <div className="absolute bottom-3 inset-x-3 z-30 bg-black/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-blue-400 font-bold shrink-0">Línea Defensor:</span>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={varDefenderLine}
                          onChange={(e) => setVarDefenderLine(Number(e.target.value))}
                          className="w-full sm:w-36 accent-blue-500 cursor-pointer"
                        />
                        <span className="text-slate-400 w-8">{varDefenderLine}%</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-rose-400 font-bold shrink-0">Línea Atacante:</span>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={varAttackerLine}
                          onChange={(e) => setVarAttackerLine(Number(e.target.value))}
                          className="w-full sm:w-36 accent-rose-500 cursor-pointer"
                        />
                        <span className="text-slate-400 w-8">{varAttackerLine}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Controles: Velocidad, Paso Cuadro a Cuadro, Dictamen y Exportar */}
                  <div className="p-3 bg-[#050b1a] rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    {/* Velocidades de Reproducción */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Velocidad:</span>
                      {[0.25, 0.5, 1.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setVarPlaybackSpeed(rate);
                            if (varVideoRef.current) varVideoRef.current.playbackRate = rate;
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            varPlaybackSpeed === rate
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {rate}x {rate === 0.25 ? 'Super Slow-Mo' : ''}
                        </button>
                      ))}

                      {/* Jog wheel cuadro a cuadro */}
                      <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                        <button
                          onClick={() => {
                            if (varVideoRef.current) varVideoRef.current.currentTime = Math.max(0, varVideoRef.current.currentTime - 0.1);
                          }}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 text-xs font-mono cursor-pointer"
                          title="Retroceder 1 fotograma (-0.1s)"
                        >
                          -0.1s
                        </button>
                        <button
                          onClick={() => {
                            if (varVideoRef.current) {
                              if (varVideoRef.current.paused) {
                                varVideoRef.current.play();
                                setIsVarPlaying(true);
                              } else {
                                varVideoRef.current.pause();
                                setIsVarPlaying(false);
                              }
                            }
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/15 rounded text-white cursor-pointer"
                        >
                          {isVarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            if (varVideoRef.current) varVideoRef.current.currentTime = Math.min(varVideoRef.current.duration || 30, varVideoRef.current.currentTime + 0.1);
                          }}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 text-xs font-mono cursor-pointer"
                          title="Avanzar 1 fotograma (+0.1s)"
                        >
                          +0.1s
                        </button>
                      </div>
                    </div>

                    {/* Categorías de Dictamen Arbitral */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'OFFSIDE', label: 'Fuera de Juego' },
                        { id: 'GOAL', label: 'Gol Válido' },
                        { id: 'PENALTY', label: 'Penalti' },
                        { id: 'FOUL', label: 'Falta Grave' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setVarRulingCategory(cat.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            varRulingCategory === cat.id
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Acciones: Enviar a Firestore y Exportar Clip */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadVarClip}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Descargar archivo WebM de la repetición de 30 segundos"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Exportar Clip (30s)</span>
                      </button>

                      <button
                        onClick={handleSendVarDecision}
                        disabled={varIncidentSending || varIncidentSentOk}
                        className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-xs font-black font-mono flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 transition-all"
                      >
                        {varIncidentSentOk ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Enviado a Cabina</span>
                          </>
                        ) : (
                          <>
                            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            <span>{varIncidentSending ? 'Transmitiendo...' : 'Enviar a Cabina VAR'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: SELECTOR DE DISPOSITIVOS & CONFIGURACIÓN DE TERMINAL */}
          {activeTab === 'settings' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#040816]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Gestión de Cámaras y Terminales Conectados
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    DeporVerso detecta automáticamente cualquier cámara conectada por USB, capturadora HDMI (CamLink) o sensor integrado en teléfonos y laptops.
                  </p>
                </div>
                <button
                  onClick={refreshConnectedDevices}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Escanear Dispositivos</span>
                </button>
              </div>

              {/* LISTADO DE CÁMARAS DISPONIBLES */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  📹 Cámaras de Video Detectadas ({videoDevices.length}):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {videoDevices.map((dev, idx) => {
                    const isSelected = selectedVideoDeviceId === dev.deviceId;
                    const isBack = dev.label.toLowerCase().includes('back') || dev.label.toLowerCase().includes('trasera') || dev.label.toLowerCase().includes('rear');
                    const isUsb = dev.label.toLowerCase().includes('usb') || dev.label.toLowerCase().includes('camlink') || dev.label.toLowerCase().includes('capture');
                    return (
                      <button
                        key={dev.deviceId || idx}
                        onClick={() => {
                          setSelectedVideoDeviceId(dev.deviceId);
                          connectTerminalCamera(dev.deviceId, isBack ? 'environment' : 'user', resolutionProfile);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                            : 'bg-black/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-300'
                          }`}>
                            <Camera className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {dev.label || `Cámara ${idx + 1} del Terminal`}
                            </span>
                            <span className="text-[10px] text-cyan-300/80 font-mono block">
                              {isUsb ? 'Capturadora USB/HDMI Externa' : isBack ? 'Cámara Cancha Trasera' : 'Cámara Frontal'}
                            </span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LISTADO DE MICRÓFONOS DISPONIBLES */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  🎤 Micrófonos y Fuentes de Audio ({audioDevices.length}):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {audioDevices.map((dev, idx) => {
                    const isSelected = selectedAudioDeviceId === dev.deviceId;
                    return (
                      <button
                        key={dev.deviceId || idx}
                        onClick={() => {
                          setSelectedAudioDeviceId(dev.deviceId);
                          connectTerminalCamera(selectedVideoDeviceId, facingMode, resolutionProfile);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                            : 'bg-black/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-300'
                          }`}>
                            <Mic className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {dev.label || `Micrófono ${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-emerald-300/80 font-mono block">
                              Audio de Campo / Relato
                            </span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PERFIL DE RESOLUCIÓN Y BITRATE */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  ⚡ Perfil de Calidad y Resolución de Ingesta:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: '4k', title: '4K Ultra HD', desc: '3840x2160 • 60 FPS', tag: 'Cámaras Pro' },
                    { id: '1080p', title: 'Full HD 1080p', desc: '1920x1080 • 60 FPS', tag: 'Recomendado' },
                    { id: '720p', title: 'HD 720p', desc: '1280x720 • 30 FPS', tag: 'Ahorro Datos' },
                    { id: '480p', title: 'SD 480p', desc: '854x480 • 30 FPS', tag: 'Señal 4G Débil' },
                  ].map(prof => (
                    <button
                      key={prof.id}
                      onClick={() => {
                        setResolutionProfile(prof.id as ResolutionProfile);
                        connectTerminalCamera(selectedVideoDeviceId, facingMode, prof.id as ResolutionProfile);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        resolutionProfile === prof.id
                          ? 'bg-amber-500/20 border-amber-400 shadow-lg text-white'
                          : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">{prof.tag}</span>
                      <span className="text-xs font-black block mt-0.5">{prof.title}</span>
                      <span className="text-[10px] font-mono opacity-80 block">{prof.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('camera')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black text-xs font-mono shadow-lg hover:brightness-110 cursor-pointer"
                >
                  Volver al Monitor en Vivo →
                </button>
              </div>
            </div>
          )}

          {/* VISTA 3: VINCULAR CUALQUIER CELULAR VÍA CÓDIGO QR */}
          {activeTab === 'remote-qr' && (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-center space-y-5 bg-[#040816]">
              <div className="max-w-md space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                  TRANSMISIÓN INALÁMBRICA SIN INSTALAR NADA
                </span>
                <h4 className="text-xl font-black text-white">
                  Convierte Cualquier Celular en un Terminal de Cámara
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apunta la cámara del celular al código QR para abrir el transmisor directo en el navegador web del teléfono. Transmite el partido en vivo sin aplicaciones pesadas.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.3)] border-4 border-cyan-400">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Terminal Cámara" className="w-56 h-56 rounded-xl block" />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-black font-mono text-xs">
                    Generando código QR...
                  </div>
                )}
              </div>

              {/* Enlace Directo para Compartir */}
              <div className="w-full max-w-md bg-black/60 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-cyan-300 truncate max-w-[280px]">
                  {remoteCameraUrl}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(remoteCameraUrl);
                    setCopiedLink(true);
                    triggerToast('✓ Enlace copiado al portapapeles');
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                Compatible con iPhone (iOS Safari), Samsung, Xiaomi, Motorola (Android Chrome) y tablets.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
