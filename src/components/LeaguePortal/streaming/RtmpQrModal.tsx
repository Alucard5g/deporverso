import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Copy, Check, Download, ExternalLink, X, Smartphone, 
  Server, Radio, ShieldCheck, Wifi, Sparkles, Video, Camera, CheckCircle2
} from 'lucide-react';

interface RtmpQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchTitle: string;
  tenantName: string;
  tenantId?: string;
  onOpenTerminalStudio?: () => void;
}

export const RtmpQrModal: React.FC<RtmpQrModalProps> = ({
  isOpen,
  onClose,
  matchId,
  matchTitle,
  tenantName,
  tenantId = 't-pichincha',
  onOpenTerminalStudio
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedDeporversoLink, setCopiedDeporversoLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deporverso-web' | 'larix' | 'obs'>('deporverso-web');

  // Estado de sincronización en tiempo real del terminal remoto
  const [isTerminalConnected, setIsTerminalConnected] = useState<boolean>(false);
  const [terminalDeviceName, setTerminalDeviceName] = useState<string>('Terminal Celular');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(0);

  // RTMP Tradicional para OBS y Larix
  const rtmpServer = 'rtmp://live.deporverso.com:1935/live';
  const streamKey = `dpv_live_${matchId}_${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const fullRtmpUrl = `${rtmpServer}/${streamKey}`;

  // URL Universal de Transmisión Web DEPORVERSO (Sin instalar nada - Compatible con iOS y Android)
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://deporverso.app';
  const deporversoCameraUrl = `${currentOrigin}/?mode=terminal-camera&tenantId=${encodeURIComponent(tenantId)}&matchId=${encodeURIComponent(matchId)}&auth=master-cig`;

  // Deep Link para Larix Broadcaster
  const larixDeepLink = `larix://connection?name=${encodeURIComponent(`${tenantName} - Cancha Oficial`)}&url=${encodeURIComponent(rtmpServer)}&key=${encodeURIComponent(streamKey)}`;

  // Escucha activa de sincronización vía BroadcastChannel y LocalStorage
  useEffect(() => {
    if (!isOpen) return;

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('deporverso_camera_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CAMERA_HEARTBEAT' || event.data?.type === 'CAMERA_STARTED') {
            setIsTerminalConnected(true);
            setTerminalDeviceName(event.data.device || 'Terminal Celular Transmisor');
            setLastSyncTimestamp(Date.now());
          } else if (event.data?.type === 'CAMERA_STOPPED') {
            setIsTerminalConnected(false);
          }
        };
      }
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'deporverso_camera_active_session' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.matchId === matchId || !parsed.matchId) {
            setIsTerminalConnected(Boolean(parsed.isLive || parsed.isCameraActive));
            setTerminalDeviceName(parsed.device || 'Terminal Celular Transmisor');
            setLastSyncTimestamp(Date.now());
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorage);

    // Verificar si ya existía una sesión reciente
    try {
      const existing = localStorage.getItem('deporverso_camera_active_session');
      if (existing) {
        const parsed = JSON.parse(existing);
        if (Date.now() - (parsed.timestamp || 0) < 15000) {
          setIsTerminalConnected(Boolean(parsed.isLive || parsed.isCameraActive));
          setTerminalDeviceName(parsed.device || 'Terminal Celular Transmisor');
        }
      }
    } catch (e) {}

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [isOpen, matchId]);

  // Generación dinámica del código QR según la pestaña seleccionada
  useEffect(() => {
    if (!isOpen) return;

    let qrTarget = deporversoCameraUrl;
    if (activeTab === 'larix') {
      qrTarget = larixDeepLink;
    } else if (activeTab === 'obs') {
      qrTarget = fullRtmpUrl;
    }

    QRCode.toDataURL(qrTarget, {
      width: 300,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generando QR:', err));
  }, [isOpen, activeTab, deporversoCameraUrl, larixDeepLink, fullRtmpUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'url' | 'key' | 'deporverso') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedDeporversoLink(true);
      setTimeout(() => setCopiedDeporversoLink(false), 2000);
    }
  };

  const handleDownloadObsProfile = () => {
    const obsProfile = {
      name: `${tenantName} - Transmisión en Vivo`,
      type: 'rtmp_custom',
      settings: {
        server: rtmpServer,
        key: streamKey,
        use_auth: false
      },
      video: {
        output_cx: 1920,
        output_cy: 1080,
        fps_num: 60,
        fps_den: 1,
        bitrate_kbps: 4500
      }
    };

    const blob = new Blob([JSON.stringify(obsProfile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deporverso_obs_profile_${matchId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#070b14] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-500/20 space-y-4 text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
              <QrCode className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Sincronizar Cámara por Código QR
              </h3>
              <p className="text-xs text-slate-400">
                Apunta con cualquier celular (iPhone / Android) para transmitir en vivo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('deporverso-web')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'deporverso-web'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Celular QR (Web)</span>
          </button>

          <button
            onClick={() => setActiveTab('obs')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'obs'
                ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">OBS Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('larix')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'larix'
                ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Larix App RTMP</span>
          </button>
        </div>

        {/* CONTENIDO TAB 1: DEPORVERSO MÓVIL DIRECTO (RECOMENDADO) */}
        {activeTab === 'deporverso-web' && (
          <div className="space-y-4">
            {/* Banner de Estado de Sincronización en Tiempo Real */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
              isTerminalConnected 
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isTerminalConnected ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                <span className="font-bold">
                  {isTerminalConnected 
                    ? `🟢 ¡Cámara Sincronizada con Éxito! (${terminalDeviceName})`
                    : 'Esperando escaneo de código QR desde el celular...'}
                </span>
              </div>
              {isTerminalConnected && (
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  EN VIVO
                </span>
              )}
            </div>

            {/* QR Card */}
            <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#0a1122] to-black rounded-2xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-cyan-400/60 relative group">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Código QR Cámara DeporVerso" 
                    className="w-56 h-56 rounded-lg block" 
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-black text-xs font-mono font-bold">
                    Generando QR Web...
                  </div>
                )}
                {isTerminalConnected && (
                  <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs rounded-lg flex flex-col items-center justify-center text-white p-4 space-y-2 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                    <span className="font-black text-sm text-emerald-300 uppercase tracking-wide">
                      ¡Celular Vinculado!
                    </span>
                    <p className="text-[11px] text-slate-200">
                      Transmitiendo en tiempo real hacia la app oficial
                    </p>
                  </div>
                )}
              </div>

              {/* Instrucciones 1-2-3 */}
              <div className="space-y-1 max-w-sm text-left bg-black/40 p-3 rounded-xl border border-white/5 text-[11px] text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5 text-xs text-cyan-300 mb-1">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  ¿Cómo transmitir en 3 pasos?
                </p>
                <p>1. Abre la <strong>cámara normal</strong> de tu celular (iPhone o Android).</p>
                <p>2. Apunta al código QR y pulsa el enlace amarillo que aparece.</p>
                <p>3. Tu celular abrirá la consola de cámara de <strong>DEPORVERSO</strong> con marcador y VAR instantáneo.</p>
              </div>
            </div>

            {/* Enlace Directo para compartir o abrir */}
            <div className="bg-black/50 p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Enlace Web del Transmisor:</span>
                <button
                  onClick={() => handleCopy(deporversoCameraUrl, 'deporverso')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedDeporversoLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDeporversoLink ? '¡Enlace Copiado!' : 'Copiar para WhatsApp'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-cyan-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/5 truncate select-all">
                {deporversoCameraUrl}
              </div>
            </div>

            {/* Botón de acción: Abrir Estudio en este dispositivo */}
            {onOpenTerminalStudio && (
              <button
                onClick={onOpenTerminalStudio}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
              >
                <Video className="w-4 h-4" />
                <span>O Abrir Terminal de Cámara en esta Misma Pantalla</span>
              </button>
            )}
          </div>
        )}

        {/* CONTENIDO TAB 2: OBS STUDIO */}
        {activeTab === 'obs' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/50">
                <img src={qrDataUrl} alt="QR RTMP OBS" className="w-48 h-48 rounded-lg block" />
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Configura OBS Studio o VMix para transmitir directamente al servidor central de DeporVerso.
              </p>
            </div>

            <div className="space-y-2 bg-black/50 p-3.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Servidor RTMP:</span>
                <button
                  onClick={() => handleCopy(rtmpServer, 'url')}
                  className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-slate-200 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 truncate">
                {rtmpServer}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 font-medium">Clave de Transmisión (Stream Key):</span>
                <button
                  onClick={() => handleCopy(streamKey, 'key')}
                  className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-amber-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 truncate">
                {streamKey}
              </div>
            </div>

            <button
              onClick={handleDownloadObsProfile}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Perfil OBS Studio (.json)</span>
            </button>
          </div>
        )}

        {/* CONTENIDO TAB 3: LARIX BROADCASTER RTMP */}
        {activeTab === 'larix' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/50">
                <img src={qrDataUrl} alt="QR Larix" className="w-48 h-48 rounded-lg block" />
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Apunta con la aplicación <strong>Larix Broadcaster</strong> para importar automáticamente los parámetros RTMP en 1 segundo.
              </p>
            </div>

            <a
              href={larixDeepLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Deep Link en Larix Broadcaster</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
