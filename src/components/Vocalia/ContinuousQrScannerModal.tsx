import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, X, CheckCircle, AlertCircle, Volume2, VolumeX, RefreshCw, 
  UserCheck, Shield, Sparkles, Layers, QrCode, ArrowRight, UserPlus
} from 'lucide-react';
import jsQR from 'jsqr';
import { Player, Team, PlayerMatchStat } from '../../types';

interface ContinuousQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  homeTeam?: Team;
  awayTeam?: Team;
  homeTeamId: string;
  awayTeamId: string;
  initialTargetTeam?: 'AUTO' | 'HOME' | 'AWAY';
  onPlayerScanned: (player: Player, targetTeamId: string) => void;
  onRegisterCustomScanned: (data: { jerseyNumber: number; name: string; teamId: string; qrCode: string }) => void;
}

interface ScannedRecord {
  id: string;
  rawCode: string;
  timestamp: string;
  player?: Player;
  teamName: string;
  status: 'SUCCESS' | 'UNKNOWN_REGISTERED' | 'DUPLICATE';
}

export const ContinuousQrScannerModal: React.FC<ContinuousQrScannerModalProps> = ({
  isOpen,
  onClose,
  players,
  homeTeam,
  awayTeam,
  homeTeamId,
  awayTeamId,
  initialTargetTeam = 'AUTO',
  onPlayerScanned,
  onRegisterCustomScanned
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTargetTeam, setSelectedTargetTeam] = useState<'AUTO' | 'HOME' | 'AWAY'>(initialTargetTeam);

  // Sync selectedTargetTeam when modal opens or initialTargetTeam changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTargetTeam(initialTargetTeam);
    }
  }, [isOpen, initialTargetTeam]);

  // Flash animation state when QR is detected
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [flashSuccess, setFlashSuccess] = useState(false);

  // Scan session history
  const [scanHistory, setScanHistory] = useState<ScannedRecord[]>([]);

  // Cooldown tracker to prevent immediate repeated duplicate triggers on same card
  const lastCodeRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  // Web Audio Synthesizer Beep for instant feedback
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // High beep
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      console.warn('Audio feedback error', e);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'No se pudo acceder a la cámara. Asegúrate de conceder permisos en el navegador o usar un dispositivo con cámara.'
      );
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  // Toggle Camera Facing
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Effect to manage camera lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Handle scanned raw string
  const handleCodeFound = (code: string) => {
    const now = Date.now();
    // 1.8 second debounce for same code
    if (lastCodeRef.current.code === code && now - lastCodeRef.current.time < 1800) {
      return;
    }

    lastCodeRef.current = { code, time: now };
    setLastScannedCode(code);
    setFlashSuccess(true);
    playBeep();
    if (navigator.vibrate) {
      try { navigator.vibrate(100); } catch (e) {}
    }
    setTimeout(() => setFlashSuccess(false), 600);

    // Look for matching player in league database
    const cleanCode = code.trim().toLowerCase();
    const matchedPlayer = players.find(p => 
      p.qr_code.toLowerCase() === cleanCode ||
      p.id.toLowerCase() === cleanCode ||
      p.cedula?.toLowerCase() === cleanCode ||
      p.full_name.toLowerCase() === cleanCode
    );

    let assignedTeamId = homeTeamId;
    let teamName = homeTeam?.name || 'Local';

    if (matchedPlayer) {
      // Determine team
      if (selectedTargetTeam === 'HOME') {
        assignedTeamId = homeTeamId;
        teamName = homeTeam?.name || 'Local';
      } else if (selectedTargetTeam === 'AWAY') {
        assignedTeamId = awayTeamId;
        teamName = awayTeam?.name || 'Visitante';
      } else {
        // AUTO: Match by player's team_id
        if (matchedPlayer.team_id === awayTeamId) {
          assignedTeamId = awayTeamId;
          teamName = awayTeam?.name || 'Visitante';
        } else {
          assignedTeamId = homeTeamId;
          teamName = homeTeam?.name || 'Local';
        }
      }

      onPlayerScanned(matchedPlayer, assignedTeamId);

      setScanHistory(prev => [
        {
          id: `${Date.now()}-${Math.random()}`,
          rawCode: code,
          timestamp: new Date().toLocaleTimeString(),
          player: matchedPlayer,
          teamName: teamName,
          status: 'SUCCESS'
        },
        ...prev
      ]);
    } else {
      // Unrecognized QR payload - attempt auto registration or extract info if formatted
      let parsedName = `Jugador QR ${code.slice(-5)}`;
      let parsedNum = 99;

      // Check if code has numbers
      const numMatch = code.match(/\d+/);
      if (numMatch) {
        parsedNum = parseInt(numMatch[0].slice(0, 2), 10) || 99;
      }

      const targetTeamId = selectedTargetTeam === 'AWAY' ? awayTeamId : homeTeamId;
      const targetTeamName = selectedTargetTeam === 'AWAY' ? (awayTeam?.name || 'Visitante') : (homeTeam?.name || 'Local');

      onRegisterCustomScanned({
        jerseyNumber: parsedNum,
        name: parsedName,
        teamId: targetTeamId,
        qrCode: code
      });

      setScanHistory(prev => [
        {
          id: `${Date.now()}-${Math.random()}`,
          rawCode: code,
          timestamp: new Date().toLocaleTimeString(),
          teamName: targetTeamName,
          status: 'UNKNOWN_REGISTERED'
        },
        ...prev
      ]);
    }
  };

  // Continuous Scan Loop
  useEffect(() => {
    if (!isOpen || !cameraStream || !isScanningActive) return;

    let animationFrameId: number;

    const scanFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });

            if (qrResult && qrResult.data) {
              handleCodeFound(qrResult.data);
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, cameraStream, isScanningActive, selectedTargetTeam, players]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c0c] border border-[#00ff66]/40 rounded-3xl p-6 sm:p-7 max-w-4xl w-full space-y-5 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66] animate-pulse">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">Escaneo Continuo de Carnets QR</h3>
                <span className="bg-[#00ff66] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0] font-normal">
                Detecta y registra automáticamente carnets físicos o digitales en tiempo real sin cerrar la cámara.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-white/60 hover:text-white font-black text-xl p-2 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Target Team & Control Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141414] p-3 rounded-2xl border border-white/10 shrink-0 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#A0A0A0] uppercase font-black">Equipo Destino:</span>
            <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-xl border border-white/10 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedTargetTeam('HOME')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTargetTeam === 'HOME' 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                    : 'text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <span>🔵 LOCAL:</span>
                <span>{homeTeam?.name || 'Local'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTargetTeam('AWAY')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTargetTeam === 'AWAY' 
                    ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' 
                    : 'text-teal-400 hover:bg-teal-500/10'
                }`}
              >
                <span>🟢 VISITANTE:</span>
                <span>{awayTeam?.name || 'Visitante'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTargetTeam('AUTO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTargetTeam === 'AUTO' ? 'bg-[#00ff66] text-black shadow-md' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                Auto (Por Club)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-white/50'
              }`}
              title={soundEnabled ? 'Silenciar Beep' : 'Activar Beep'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFacingMode}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="Cambiar Cámara"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Girar Cámara</span>
            </button>
          </div>
        </div>

        {/* Selected Target Team Notification Banner */}
        <div className={`px-4 py-2 rounded-xl text-xs flex items-center justify-between border ${
          selectedTargetTeam === 'HOME'
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
            : selectedTargetTeam === 'AWAY'
            ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
            : 'bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-black uppercase tracking-wider text-[10px]">
              {selectedTargetTeam === 'HOME' ? '🔵 Modo Local' : selectedTargetTeam === 'AWAY' ? '🟢 Modo Visitante' : '⚙️ Modo Automático'}:
            </span>
            <span className="font-bold text-white">
              {selectedTargetTeam === 'HOME' 
                ? `Los carnets escaneados se ingresan a la nómina de ${homeTeam?.name || 'Equipo Local'}`
                : selectedTargetTeam === 'AWAY'
                ? `Los carnets escaneados se ingresan a la nómina de ${awayTeam?.name || 'Equipo Visitante'}`
                : 'Se detecta el club correspondiente según la base de datos de la liga'}
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80 uppercase">Cero Confusión de Carnets</span>
        </div>

        {/* Camera Viewport & Live Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto">
          {/* Video Container (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`relative w-full aspect-4/3 sm:aspect-16/10 bg-black rounded-2xl overflow-hidden border-2 transition-all ${
              flashSuccess ? 'border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.6)]' : 'border-white/20'
            }`}>
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Hidden Canvas for QR extraction */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanner Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Target box */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-[#00ff66]/70 rounded-2xl relative shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#00ff66] rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#00ff66] rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#00ff66] rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#00ff66] rounded-br-lg"></div>

                  {/* Laser Scan Line Animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent shadow-[0_0_8px_#00ff66] animate-bounce" style={{ top: '45%' }}></div>
                </div>
              </div>

              {/* Status Banner inside Video */}
              <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs text-white pointer-events-none">
                <span className="flex items-center gap-1.5 font-bold text-[#00ff66]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-ping"></div>
                  Lector Activo Continuo
                </span>
                <span className="font-mono text-[11px] text-[#A0A0A0]">
                  Escaneos: {scanHistory.length}
                </span>
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="text-xs text-white font-medium max-w-sm">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-[#00ff66] text-black font-black text-xs rounded-xl cursor-pointer"
                  >
                    Reintentar Cámara
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#A0A0A0] text-center mt-2">
              Apunta la cámara al carnet del jugador. Cada carnet detectado se registra instantáneamente en la nómina.
            </p>
          </div>

          {/* Real-time Registered Feed (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3 min-h-[260px] max-h-[380px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#00ff66]" />
                Bitácora de Escaneos ({scanHistory.length})
              </span>
              {scanHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setScanHistory([])}
                  className="text-[10px] text-[#A0A0A0] hover:text-white underline cursor-pointer"
                >
                  Limpiar Lista
                </button>
              )}
            </div>

            <div className="flex-1 bg-[#121212] border border-white/10 rounded-2xl p-3 overflow-y-auto space-y-2">
              {scanHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A0A0A0] space-y-2">
                  <QrCode className="w-8 h-8 opacity-40" />
                  <p className="text-xs">No hay escaneos en esta sesión.</p>
                  <p className="text-[10px] text-white/50">Muestra los carnets QR frente a la cámara para registrarlos en cadena.</p>
                </div>
              ) : (
                scanHistory.map((rec, i) => (
                  <div 
                    key={rec.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      i === 0 ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-white animate-fade-in' : 'bg-[#181818] border-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {rec.player ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                            {rec.player.jersey_number || '#'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate text-white">{rec.player.full_name}</p>
                            <p className="text-[10px] text-[#A0A0A0]">{rec.teamName} • {rec.player.position || 'Jugador'}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                            QR
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate text-white">QR: {rec.rawCode}</p>
                            <p className="text-[10px] text-[#A0A0A0]">Inscrito en {rec.teamName}</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] block">
                        REGISTRADO
                      </span>
                      <span className="text-[9px] text-[#A0A0A0] font-mono">{rec.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
          <div className="text-xs text-[#A0A0A0]">
            💡 Los jugadores escaneados quedan automáticamente habilitados con carnet verificado en la vocalía oficial.
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#00ff66] hover:bg-[#00ff66]/90 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-[#00ff66]/20 transition-all"
          >
            Listo, Finalizar Escaneo
          </button>
        </div>
      </div>
    </div>
  );
};
