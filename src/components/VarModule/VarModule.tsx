import React, { useState } from 'react';
import { 
  Video, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Shield, 
  RefreshCw, 
  Scissors, 
  Smartphone, 
  Download, 
  Film,
  Terminal,
  Share2,
  FileText,
  Check
} from 'lucide-react';
import { Match, VarRequest } from '../../types';

interface VarModuleProps {
  tenantId: string;
  matches: Match[];
  varRequests: VarRequest[];
  onCreateVarRequest: (req: Omit<VarRequest, 'id' | 'created_at'>) => void;
  onUpdateVarStatus: (varId: string, status: VarRequest['status'], notes?: string) => void;
}

export const VarModule: React.FC<VarModuleProps> = ({
  tenantId,
  matches,
  varRequests,
  onCreateVarRequest,
  onUpdateVarStatus
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [cameraAngle, setCameraAngle] = useState('Ángulo 1: Línea de Gol / Área Chica');
  const [activeVarView, setActiveVarView] = useState<VarRequest | null>(varRequests[0] || null);
  const [refereeNotes, setRefereeNotes] = useState('');

  // AutoHighlightGenerator 9:16 state
  const [eventSec, setEventSec] = useState<number>(45.5);
  const [actionType, setActionType] = useState<string>('GOL_POLEMICO');
  const [isProcessing916, setIsProcessing916] = useState<boolean>(false);
  const [status916, setStatus916] = useState<string | null>(null);
  const [generated916Clip, setGenerated916Clip] = useState<{
    url: string;
    title: string;
    duration: number;
  } | null>(null);

  const handleGenerateVarClip916 = async () => {
    setIsProcessing916(true);
    setStatus916('Procesando extracción cinemática con AutoHighlightGenerator (FFmpeg)...');
    try {
      const res = await fetch('/api/media/generate-highlight-916', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputVideoUrl: activeVarView?.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          eventTimestampSec: Number(eventSec),
          eventTitle: `Incidencia VAR 9:16 - ${actionType}`,
          actionType: actionType,
          preSec: 10.0,
          postSec: 5.0
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGenerated916Clip({
          url: data.clip?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          title: data.clip?.title || 'Clip VAR 9:16',
          duration: data.clip?.durationSec || 15.0
        });
        setStatus916('✓ ¡Clip 9:16 generado con éxito (1080x1920)! Optimizado para dictamen y difusión.');
      } else {
        setGenerated916Clip({
          url: activeVarView?.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          title: 'Clip VAR 9:16 (Simulado)',
          duration: 15.0
        });
        setStatus916('Aviso: Procesamiento completado con fallback de vista previa.');
      }
    } catch (e: any) {
      setStatus916(`Error: ${e.message}`);
    } finally {
      setIsProcessing916(false);
    }
  };

  // Puppeteer VAR & Scouting PDF State
  const [isGeneratingVarPdf, setIsGeneratingVarPdf] = useState(false);
  const [varPdfUrl, setVarPdfUrl] = useState<string | null>(null);
  const [varPdfStatus, setVarPdfStatus] = useState<string | null>(null);

  const handleGenerateVarPdf = async () => {
    setIsGeneratingVarPdf(true);
    setVarPdfStatus('Renderizando Acta Oficial VAR y Ficha Scouting con Puppeteer...');
    try {
      const selectedMatch = matches.find(m => m.id === selectedMatchId);
      const res = await fetch('/api/reports/var-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchTitle: activeVarView?.match_title || `${selectedMatch?.home_team?.name || 'Local'} vs ${selectedMatch?.away_team?.name || 'Visitante'}`,
          incidentType: actionType === 'GOL_POLEMICO' ? 'Revisión de Gol / Fuera de Juego' : actionType,
          minuteOrTimestamp: `Segundo ${eventSec}s (Ángulo: ${cameraAngle})`,
          verdict: refereeNotes || 'GOL VÁLIDO - Posición legal confirmada por calibración VAR',
          refereeNotes: refereeNotes || 'Dictamen oficial emitido con asistencia de cámaras multiseñal y calibración pericial.',
          playerData: {
            name: 'Atleta Involucrado #10',
            team: selectedMatch?.home_team?.name || 'Club Titular',
            position: 'Extremo / Delantero',
            age: 24,
            dorsal: '10',
            sportIaIndex: 9.2,
            metrics: {
              distanceKm: 9.8,
              maxSpeedKmh: 33.1,
              passAccuracy: 88.5,
              recoveries: 6
            }
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setVarPdfUrl(data.pdfUrl);
        setVarPdfStatus('✓ Acta Oficial VAR & Scouting generada con éxito (Puppeteer A4)');
      } else {
        setVarPdfStatus('Aviso: Error generando el PDF en el servidor.');
      }
    } catch (e: any) {
      setVarPdfStatus(`Error: ${e.message}`);
    } finally {
      setIsGeneratingVarPdf(false);
    }
  };

  const handleRequestVar = (e: React.FormEvent) => {
    e.preventDefault();
    const match = matches.find(m => m.id === selectedMatchId);
    if (!match) return;

    onCreateVarRequest({
      tenant_id: tenantId,
      match_id: match.id,
      fee_amount: 12.00,
      status: 'APPROVED',
      camera_angle: cameraAngle,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      result_notes: 'Revisión VAR solicitada para jugada polémica.',
      match_title: `${match.home_team?.name || 'Local'} vs ${match.away_team?.name || 'Visitante'}`
    });

    alert('¡Servicio VAR A la Carta reservado ($12.00 USD)! Transmisión de baja latencia lista.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#080d1a]/80 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              VAR A la Carta ($12.00 USD)
            </span>
            <span className="text-slate-400 text-xs font-mono font-medium">Ultra Baja Latencia (Cloudflare R2)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sistema VAR A la Carta e Involucramiento de Árbitros</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Reserva de cámaras reglamentarias por partido o inclusión en suscripción Enterprise con repetición multi-ángulo.
          </p>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.08] text-center shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold mb-0.5">TARIFA POR REVISIÓN</span>
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400">$12.00 USD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VAR Video Review Screen */}
        <div className="lg:col-span-2 bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-400" />
              Monitor VAR de Campo de Juego
            </span>
            {activeVarView && (
              <span className="bg-cyan-500/15 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-cyan-500/30">
                {activeVarView.status}
              </span>
            )}
          </h3>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-white/[0.08] aspect-video flex items-center justify-center">
            {activeVarView?.video_url ? (
              <video
                src={activeVarView.video_url}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Video className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Selecciona o solicita una revisión VAR para cargar el video multiseñales.</p>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-200 border border-white/10">
              {cameraAngle}
            </div>
          </div>

          {/* Camera Angles Switcher (Segmented) */}
          <div className="deporverso-segmented-nav no-scrollbar flex items-center gap-1.5 overflow-x-auto text-xs">
            {['Ángulo 1: Línea de Gol', 'Ángulo 2: Táctica Superior', 'Ángulo 3: Lateral Banda'].map((angle) => (
              <button
                key={angle}
                onClick={() => setCameraAngle(angle)}
                className={`whitespace-nowrap transition-all cursor-pointer ${
                  cameraAngle === angle
                    ? 'deporverso-tab-pill-active font-semibold'
                    : 'deporverso-tab-pill-inactive'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>

          {/* Referee Decision Log Form */}
          {activeVarView && (
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.08] space-y-3 pt-3">
              <h4 className="font-semibold text-white text-xs">Dictamen del Árbitro VAR:</h4>
              <textarea
                rows={2}
                placeholder="Escribe la resolución de la jugada (Ej. Gol Valido / Fuera de Juego / Penalti Aprobado)..."
                value={refereeNotes}
                onChange={(e) => setRefereeNotes(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdateVarStatus(activeVarView.id, 'COMPLETED', refereeNotes || 'Decisión Confirmada por VAR');
                    alert('Dictamen VAR Guardado e integrado al acta oficial.');
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow-sm transition-all"
                >
                  Confirmar Decisión Arbitral
                </button>
              </div>
            </div>
          )}

          {/* AUTOHIGHLIGHT GENERATOR 9:16 VAR CLIP CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-[#080d1a] border border-rose-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>AutoHighlightGenerator VAR 9:16</span>
                    <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-mono">
                      FFmpeg 1080x1920
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Extrae los 10s antes y 5s después de la jugada polémica para WhatsApp / TikTok / Redes.
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateVarClip916}
                disabled={isProcessing916}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-amber-400 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Smartphone className={`w-3.5 h-3.5 ${isProcessing916 ? 'animate-bounce' : ''}`} />
                <span>{isProcessing916 ? 'Recortando...' : 'Exportar Reel 9:16'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Segundo de la Incidencia (seg):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={eventSec}
                  onChange={(e) => setEventSec(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500/50 font-mono"
                  placeholder="Ej: 850.5"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tipo de Jugada Polémica:
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                >
                  <option value="GOL_POLEMICO">Gol Polémico / Posible Fuera de Juego</option>
                  <option value="PENALTI_DUDOSO">Penalti / Falta en el Área</option>
                  <option value="TARJETA_ROJA">Agresión / Posible Tarjeta Roja</option>
                  <option value="GOL_FANTASMA">Balón en Línea (Gol Fantasma)</option>
                </select>
              </div>
            </div>

            {status916 && (
              <div className="text-[11px] text-rose-300 font-mono bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {status916}
              </div>
            )}

            {/* PREVISUALIZADOR VERTICAL SI FUE GENERADO */}
            {generated916Clip && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-24 aspect-[9/16] rounded-lg overflow-hidden border border-white/20 bg-black shrink-0">
                  <video
                    src={generated916Clip.url}
                    controls
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <span className="font-bold text-white block">{generated916Clip.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Formato: 9:16 (1080x1920) • Duración: {generated916Clip.duration}s
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    Filtro: crop=ih*(9/16):ih:(iw-ow)/2:0,scale=1080:1920
                  </span>
                  <div className="pt-1 flex gap-2">
                    <a
                      href={generated916Clip.url}
                      download="var_highlight_916.mp4"
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>Descargar MP4</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACTA OFICIAL VAR & SCOUTING PDF (PUPPETEER) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-[#080d1a] border border-amber-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Acta Oficial VAR & Scouting PDF (Puppeteer)</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                      A4 Certificado
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Genera el informe pericial del partido con dictamen arbitral, mapa de calor posicional y métricas tácticas.
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateVarPdf}
                disabled={isGeneratingVarPdf}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <FileText className={`w-3.5 h-3.5 ${isGeneratingVarPdf ? 'animate-spin' : ''}`} />
                <span>{isGeneratingVarPdf ? 'Generando PDF...' : 'Generar Acta PDF'}</span>
              </button>
            </div>

            {varPdfStatus && (
              <div className="text-[11px] text-amber-300 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                {varPdfStatus}
              </div>
            )}

            {varPdfUrl && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Acta Oficial VAR y Ficha Scouting Lista</span>
                </div>
                <a
                  href={varPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar Documento A4</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Request VAR Form & Active Log */}
        <div className="space-y-6">
          <div className="bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Reservar VAR A la Carta ($12)
            </h3>

            <form onSubmit={handleRequestVar} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Partido a Solicitar</label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-medium cursor-pointer"
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#090e1a] text-slate-200">
                      {m.home_team?.name} vs {m.away_team?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Pagar $12.00 USD & Iniciar VAR
              </button>
            </form>
          </div>

          <div className="bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-xs sm:text-sm">Revisiones VAR Registradas</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {varRequests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveVarView(r)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    activeVarView?.id === r.id ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <p className="font-semibold text-white">{r.match_title || 'Encuentro VAR'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.result_notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
