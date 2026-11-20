import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  X,
  Smartphone,
  Server,
  Radio,
  Video,
  Camera,
  CheckCircle2,
  Plus,
  Edit3,
} from 'lucide-react';
import { copyTextSafely } from '../../../utils/safeClipboard';
import {
  CameraSlotPreset,
  DEFAULT_CAMERA_SLOTS,
  RemoteCameraInfo,
  buildQrCameraUrl,
  getStreamStudioWsUrl,
  getCreatorStudioKey,
} from '../../../services/streamStudioClient';

interface RtmpQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchTitle: string;
  tenantName: string;
  tenantId?: string;
  connectedCameras?: RemoteCameraInfo[];
  activeProgramCamId?: string | null;
  cameraSlots?: CameraSlotPreset[];
  onUpdateCameraSlots?: (slots: CameraSlotPreset[]) => void;
  onSelectCameraLive?: (camId: string) => void;
  onOpenTerminalStudio?: (slot?: CameraSlotPreset) => void;
}

export const RtmpQrModal: React.FC<RtmpQrModalProps> = ({
  isOpen,
  onClose,
  matchId,
  matchTitle,
  tenantName,
  tenantId = 't-pichincha',
  connectedCameras: externalCameras,
  activeProgramCamId: externalActiveProgramCamId,
  cameraSlots: externalSlots,
  onUpdateCameraSlots,
  onSelectCameraLive,
  onOpenTerminalStudio,
}) => {
  const [internalSlots, setInternalSlots] = useState<CameraSlotPreset[]>(DEFAULT_CAMERA_SLOTS);
  const slots = externalSlots || internalSlots;
  const setSlots = (updater: (prev: CameraSlotPreset[]) => CameraSlotPreset[]) => {
    const next = updater(slots);
    setInternalSlots(next);
    onUpdateCameraSlots?.(next);
  };

  const [selectedSlotId, setSelectedSlotId] = useState<string>(slots[0]?.camId || 'cam-1');
  const [editingLabel, setEditingLabel] = useState<boolean>(false);
  const [customLabelInput, setCustomLabelInput] = useState<string>('');
  const [customAngleInput, setCustomAngleInput] = useState<string>('');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedDeporversoLink, setCopiedDeporversoLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deporverso-web' | 'larix' | 'obs'>('deporverso-web');

  // Local WS fallback state if externalCameras aren't passed
  const [wsCameras, setWsCameras] = useState<RemoteCameraInfo[]>([]);
  const [wsActiveCamId, setWsActiveCamId] = useState<string | null>(null);

  const connectedCameras = externalCameras ?? wsCameras;
  const activeProgramCamId = externalActiveProgramCamId ?? wsActiveCamId;

  const selectedSlot = useMemo(
    () => slots.find((s) => s.camId === selectedSlotId) || slots[0] || DEFAULT_CAMERA_SLOTS[0],
    [slots, selectedSlotId]
  );

  // Also ensure any ad-hoc connected cameras not in default list appear cleanly
  const mergedSlots = useMemo(() => {
    const map = new Map<string, CameraSlotPreset>();
    slots.forEach((s) => map.set(s.camId, s));
    connectedCameras.forEach((c) => {
      if (!map.has(c.camId)) {
        map.set(c.camId, { camId: c.camId, label: c.label, angle: c.angle });
      }
    });
    return Array.from(map.values());
  }, [slots, connectedCameras]);

  // Real-time WebSocket listener when opened directly without parent state
  useEffect(() => {
    if (!isOpen || externalCameras) return;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(getStreamStudioWsUrl());
      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            type: 'studio:join',
            tenantId,
            matchId,
            role: 'director',
            creatorEmail: 'roly3d.rg@gmail.com',
            creatorKey: getCreatorStudioKey(),
          })
        );
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'studio:state') {
            setWsCameras(Array.isArray(data.cameras) ? data.cameras : []);
            setWsActiveCamId(data.activeProgramCamId || null);
          }
        } catch {}
      };
    } catch {}
    return () => {
      try {
        ws?.close();
      } catch {}
    };
  }, [isOpen, externalCameras, tenantId, matchId]);

  const rtmpServer = 'rtmp://live.deporverso.com:1935/live';
  const streamKey = `dpv_${selectedSlot.camId}_${matchId}_${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const fullRtmpUrl = `${rtmpServer}/${streamKey}`;

  const deporversoCameraUrl = useMemo(
    () =>
      buildQrCameraUrl({
        tenantId,
        matchId,
        camId: selectedSlot.camId,
        camLabel: selectedSlot.label,
        angle: selectedSlot.angle,
      }),
    [tenantId, matchId, selectedSlot.camId, selectedSlot.label, selectedSlot.angle]
  );

  const larixDeepLink = `larix://connection?name=${encodeURIComponent(
    `${tenantName} - ${selectedSlot.label}`
  )}&url=${encodeURIComponent(rtmpServer)}&key=${encodeURIComponent(streamKey)}`;

  // Generate QR code whenever active slot/tab changes
  useEffect(() => {
    if (!isOpen) return;
    let qrTarget = deporversoCameraUrl;
    if (activeTab === 'larix') qrTarget = larixDeepLink;
    else if (activeTab === 'obs') qrTarget = fullRtmpUrl;

    QRCode.toDataURL(qrTarget, {
      width: 300,
      margin: 2,
      color: { dark: '#030712', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generando QR:', err));
  }, [isOpen, activeTab, deporversoCameraUrl, larixDeepLink, fullRtmpUrl]);

  if (!isOpen) return null;

  const connectedForSelected = connectedCameras.find((c) => c.camId === selectedSlot.camId);
  const isSelectedConnected = Boolean(connectedForSelected);

  const handleAddCameraSlot = () => {
    const nextNum = mergedSlots.length + 1;
    const newSlot: CameraSlotPreset = {
      camId: `cam-${nextNum}`,
      label: `CAM ${nextNum} · Ángulo Extra`,
      angle: `Cámara Móvil ${nextNum}`,
    };
    setSlots((prev) => [...prev, newSlot]);
    setSelectedSlotId(newSlot.camId);
  };

  const handleSaveLabelEdit = () => {
    const nextLabel = customLabelInput.trim() || selectedSlot.label;
    const nextAngle = customAngleInput.trim() || selectedSlot.angle;
    setSlots((prev) =>
      prev.map((s) =>
        s.camId === selectedSlot.camId ? { ...s, label: nextLabel, angle: nextAngle } : s
      )
    );
    setEditingLabel(false);
  };

  const handleCopy = (text: string, type: 'url' | 'key' | 'deporverso') => {
    copyTextSafely(text);
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
      name: `${tenantName} - ${selectedSlot.label}`,
      type: 'rtmp_custom',
      settings: { server: rtmpServer, key: streamKey, use_auth: false },
      video: { output_cx: 1920, output_cy: 1080, fps_num: 60, fps_den: 1, bitrate_kbps: 4500 },
    };
    const blob = new Blob([JSON.stringify(obsProfile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deporverso_obs_${selectedSlot.camId}_${matchId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#070b14] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-500/20 space-y-4 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Conectar Varios Celulares por Código QR
              </h3>
              <p className="text-xs text-slate-400">
                {matchTitle} · Todas las cámaras graban continuamente; tú decides cuál sale en vivo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Camera Slot Selector Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-cyan-300">
              Cámaras del Partido ({connectedCameras.length} conectadas en vivo)
            </span>
            <button
              type="button"
              onClick={handleAddCameraSlot}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Cámara QR</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mergedSlots.map((slot) => {
              const liveCam = connectedCameras.find((c) => c.camId === slot.camId);
              const isSelected = selectedSlot.camId === slot.camId;
              const isOnAir = activeProgramCamId === slot.camId;

              return (
                <button
                  key={slot.camId}
                  type="button"
                  onClick={() => {
                    setSelectedSlotId(slot.camId);
                    setEditingLabel(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/15'
                      : 'bg-black/50 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-black text-white truncate">{slot.label}</span>
                    {liveCam ? (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isOnAir ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                        }`}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate">{slot.angle}</span>
                  <div className="pt-0.5">
                    {liveCam ? (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isOnAir
                            ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOnAir ? '🔴 EN VIVO' : '● GRABANDO'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500">Sin vincular</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Camera Rename Bar */}
        <div className="bg-black/45 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          {editingLabel ? (
            <div className="flex flex-wrap items-center gap-2 w-full">
              <input
                type="text"
                value={customLabelInput}
                onChange={(e) => setCustomLabelInput(e.target.value)}
                placeholder="Nombre (ej. CAM 5 · Drone / Córner)"
                className="flex-1 min-w-[140px] bg-slate-950 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
              />
              <input
                type="text"
                value={customAngleInput}
                onChange={(e) => setCustomAngleInput(e.target.value)}
                placeholder="Ubicación"
                className="w-36 bg-slate-950 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleSaveLabelEdit}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs cursor-pointer"
              >
                Guardar
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">{selectedSlot.label}</span>
                <span className="text-slate-400">· {selectedSlot.angle}</span>
              </div>
              <div className="flex items-center gap-2">
                {isSelectedConnected && onSelectCameraLive && (
                  <button
                    type="button"
                    onClick={() => onSelectCameraLive(selectedSlot.camId)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] cursor-pointer transition-all ${
                      activeProgramCamId === selectedSlot.camId
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {activeProgramCamId === selectedSlot.camId ? '🔴 Al Aire Ahora' : 'Poner En Vivo'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCustomLabelInput(selectedSlot.label);
                    setCustomAngleInput(selectedSlot.angle);
                    setEditingLabel(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Renombrar</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('deporverso-web')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'deporverso-web'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Celular QR ({selectedSlot.camId.toUpperCase()})</span>
          </button>

          <button
            type="button"
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
            type="button"
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

        {activeTab === 'deporverso-web' && (
          <div className="space-y-3.5">
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                isSelectedConnected
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isSelectedConnected ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'
                  }`}
                />
                <span className="font-bold truncate">
                  {isSelectedConnected
                    ? `🟢 ${selectedSlot.label} conectada (${connectedForSelected?.deviceName}) · Grabando`
                    : `Escanea este QR con el celular que operará ${selectedSlot.label}`}
                </span>
              </div>
              {isSelectedConnected && (
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                  {activeProgramCamId === selectedSlot.camId ? 'AL AIRE' : 'GRABANDO'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-gradient-to-b from-[#0a1122] to-black rounded-2xl border border-white/10">
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-cyan-400/60 relative">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR ${selectedSlot.label}`}
                      className="w-48 h-48 rounded-lg block"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-black text-xs font-mono font-bold">
                      Generando QR...
                    </div>
                  )}
                  {isSelectedConnected && (
                    <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-black text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VINCULADA EN VIVO</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 text-left text-[11px] text-slate-300">
                <p className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Flujo Multicámara en Cancha
                </p>
                <p>
                  1. Escanea el QR de <strong>{selectedSlot.label}</strong> con el celular en cancha (iPhone o Android).
                </p>
                <p>
                  2. La cámara comenzará a <strong>grabar continuamente</strong> de inmediato sin interrupciones.
                </p>
                <p>
                  3. Escanea otros QRs (CAM 2, CAM 3, CAM 4...) en más celulares y cambia entre cámaras desde tu <strong>Panel de Director</strong> cuando quieras.
                </p>
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Enlace Directo {selectedSlot.camId.toUpperCase()}:</span>
                <button
                  type="button"
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

            {onOpenTerminalStudio && (
              <button
                type="button"
                onClick={() => onOpenTerminalStudio(selectedSlot)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
              >
                <Video className="w-4 h-4" />
                <span>Abrir {selectedSlot.label} en esta Misma Pantalla</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'obs' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/50">
                <img src={qrDataUrl} alt="QR RTMP OBS" className="w-44 h-44 rounded-lg block" />
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Configura OBS Studio o vMix para transmitir {selectedSlot.label} al servidor central de DeporVerso.
              </p>
            </div>
            <div className="space-y-2 bg-black/50 p-3.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Servidor RTMP:</span>
                <button
                  type="button"
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
                <span className="text-slate-400 font-medium">Clave ({selectedSlot.camId}):</span>
                <button
                  type="button"
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
              type="button"
              onClick={handleDownloadObsProfile}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Perfil OBS (.json)</span>
            </button>
          </div>
        )}

        {activeTab === 'larix' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/10 text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/50">
                <img src={qrDataUrl} alt="QR Larix" className="w-44 h-44 rounded-lg block" />
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Escanea con <strong>Larix Broadcaster</strong> para vincular {selectedSlot.label} al instante.
              </p>
            </div>
            <a
              href={larixDeepLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en Larix Broadcaster</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
