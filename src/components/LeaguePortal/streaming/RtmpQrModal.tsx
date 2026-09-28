import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Download, ExternalLink, X, Smartphone, Server, Radio, ShieldCheck } from 'lucide-react';

interface RtmpQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchTitle: string;
  tenantName: string;
}

export const RtmpQrModal: React.FC<RtmpQrModalProps> = ({
  isOpen,
  onClose,
  matchId,
  matchTitle,
  tenantName
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'larix' | 'obs' | 'manual'>('larix');

  const rtmpServer = 'rtmp://live.deporverso.com:1935/live';
  const streamKey = `dpv_live_${matchId}_${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const fullRtmpUrl = `${rtmpServer}/${streamKey}`;

  // Larix Broadcaster Auto-Configuration Deep Link
  // Larix supports larix:// links to automatically create and configure a connection
  const larixDeepLink = `larix://connection?name=${encodeURIComponent(`${tenantName} - Cancha Oficial`)}&url=${encodeURIComponent(rtmpServer)}&key=${encodeURIComponent(streamKey)}`;

  useEffect(() => {
    if (!isOpen) return;

    // Generate QR Code containing the auto-configuration payload
    const qrTarget = activeTab === 'larix' ? larixDeepLink : fullRtmpUrl;
    QRCode.toDataURL(qrTarget, {
      width: 280,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generando QR:', err));
  }, [isOpen, activeTab, larixDeepLink, fullRtmpUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'url' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#090e1a] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10 space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Conexión Rápida por Código QR (Tarea 1)
              </h3>
              <p className="text-xs text-slate-400">Escanea desde el celular en cancha para transmitir en 5 seg</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('larix')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'larix' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Larix App (Móvil)</span>
          </button>
          <button
            onClick={() => setActiveTab('obs')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'obs' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>OBS Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Clave Manual</span>
          </button>
        </div>

        {/* QR Display Area */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900/90 to-black rounded-2xl border border-white/10 text-center space-y-4">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/50 relative group">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR de Transmisión RTMP" className="w-56 h-56 rounded-lg block" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-black text-xs font-mono">
                Generando QR...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeTab === 'larix' ? 'Enlace Directo para Larix Broadcaster' : 'Conexión RTMP Oficial'}
            </span>
            <p className="text-xs text-slate-300 max-w-sm">
              {activeTab === 'larix'
                ? 'Apunta la cámara del celular con la app Larix abierta para importar el servidor y clave en 1 segundo.'
                : 'Copia o escanea la configuración para vincular tu software de transmisión favorito.'}
            </p>
          </div>
        </div>

        {/* Credentials and Copy Buttons */}
        <div className="space-y-2.5 bg-black/50 p-4 rounded-2xl border border-white/10 text-xs">
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

        {/* Quick Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {activeTab === 'obs' ? (
            <button
              onClick={handleDownloadObsProfile}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
            >
              <Download className="w-4 h-4" />
              Descargar Perfil OBS Studio (.json)
            </button>
          ) : (
            <a
              href={larixDeepLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Directamente en Larix Broadcaster
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
