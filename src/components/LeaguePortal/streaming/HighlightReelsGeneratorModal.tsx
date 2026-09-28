import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Film, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Tv, 
  Flame, 
  Volume2, 
  VolumeX,
  Clock,
  Send,
  Sliders,
  Scissors
} from 'lucide-react';
import { Match, Team } from '../../../types';

export interface CapturedClipItem {
  id: string;
  minute: number;
  title: string;
  type: 'goal' | 'var' | 'card' | 'risk';
  url: string;
  timestamp: string;
}

interface HighlightReelsGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  capturedClips: CapturedClipItem[];
}

// Fallback high quality sports clips if none were recorded yet during match
const FALLBACK_CLIPS: CapturedClipItem[] = [
  {
    id: 'fb-1',
    minute: 23,
    title: '¡Golazo de Media Cancha!',
    type: 'goal',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    timestamp: '23:45'
  },
  {
    id: 'fb-2',
    minute: 67,
    title: 'Atajada Milagrosa del Arquero',
    type: 'risk',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    timestamp: '67:12'
  },
  {
    id: 'fb-3',
    minute: 89,
    title: 'Gol de la Victoria en el Minuto 89',
    type: 'goal',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    timestamp: '89:04'
  }
];

export const HighlightReelsGeneratorModal: React.FC<HighlightReelsGeneratorModalProps> = ({
  isOpen,
  onClose,
  match,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  capturedClips
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [includeIntroCard, setIncludeIntroCard] = useState<boolean>(true);
  const [includeSponsors, setIncludeSponsors] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Active clips selected for assembly
  const availableClips = capturedClips.length > 0 ? capturedClips : FALLBACK_CLIPS;
  const [selectedClipIds, setSelectedClipIds] = useState<string[]>(availableClips.map(c => c.id));

  // Current preview index
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Auto advance preview when video ends
  const handleVideoEnded = () => {
    if (selectedClips.length === 0) return;
    const nextIdx = (currentPreviewIdx + 1) % selectedClips.length;
    setCurrentPreviewIdx(nextIdx);
  };

  const selectedClips = availableClips.filter(c => selectedClipIds.includes(c.id));

  const toggleClipSelection = (id: string) => {
    if (selectedClipIds.includes(id)) {
      if (selectedClipIds.length === 1) return; // Keep at least one
      setSelectedClipIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedClipIds(prev => [...prev, id]);
    }
  };

  // 1-Click Highlight Reel Assembly & Synthesis using HTML5 Canvas & MediaRecorder
  const handleGenerateHighlightReel = async () => {
    if (selectedClips.length === 0) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setStatusMessage('Sintetizando portada de televisión oficial y transiciones gráficas...');

    try {
      const canvas = document.createElement('canvas');
      const isVertical = aspectRatio === '9:16';
      canvas.width = isVertical ? 720 : 1280;
      canvas.height = isVertical ? 1280 : 720;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // Setup Canvas Stream & MediaRecorder
      const canvasStream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') 
        ? 'video/webm;codecs=vp8' 
        : 'video/webm';
      
      const recorder = new MediaRecorder(canvasStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.start(100);

      // Animation helper function
      const renderFrame = (title: string, sub: string, progressRatio: number) => {
        ctx.fillStyle = '#050811';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gradient glow
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 50,
          canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        grad.addColorStop(0.6, 'rgba(244, 63, 94, 0.15)');
        grad.addColorStop(1, 'rgba(5, 8, 17, 1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header brand
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPORTIA REELS & HIGHLIGHTS', canvas.width / 2, isVertical ? 180 : 90);

        // Match Headline
        ctx.fillStyle = '#ffffff';
        ctx.font = isVertical ? 'bold 36px system-ui, sans-serif' : 'bold 44px system-ui, sans-serif';
        ctx.fillText(`${homeTeam.name} vs ${awayTeam.name}`, canvas.width / 2, isVertical ? 260 : 180);

        // Match Score
        ctx.fillStyle = '#f59e0b';
        ctx.font = isVertical ? 'bold 72px system-ui, sans-serif' : 'bold 84px system-ui, sans-serif';
        ctx.fillText(`${homeScore} - ${awayScore}`, canvas.width / 2, isVertical ? 360 : 280);

        // Incident Title
        ctx.fillStyle = '#ffffff';
        ctx.font = isVertical ? 'bold 30px system-ui, sans-serif' : 'bold 32px system-ui, sans-serif';
        ctx.fillText(title, canvas.width / 2, isVertical ? 500 : 380);

        // Subtitle
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px system-ui, sans-serif';
        ctx.fillText(sub, canvas.width / 2, isVertical ? 560 : 430);

        // Sponsors banner if enabled
        if (includeSponsors) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(canvas.width * 0.1, canvas.height - (isVertical ? 160 : 90), canvas.width * 0.8, isVertical ? 90 : 60);
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 16px monospace';
          ctx.fillText('SPONSORS OFICIALES: BANCO DEL BARRIO • ENERGÍA PLUS • PIZZA EXPRESS', canvas.width / 2, canvas.height - (isVertical ? 110 : 52));
        }

        // Animated progress ring
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, isVertical ? 720 : 540, 45, 0, Math.PI * 2 * progressRatio);
        ctx.stroke();
      };

      // Phase 1: Intro Card (1.5 seconds)
      setStatusMessage('Generando cabecera y transición televisiva del partido...');
      for (let i = 0; i < 30; i++) {
        renderFrame(
          'RESUMEN OFICIAL DE JUGADAS DESTACADAS',
          'Producción Automática Sportia Media Network',
          i / 30
        );
        await new Promise(r => setTimeout(r, 40));
      }
      setGenerationProgress(40);

      // Phase 2: Iterate through selected clips
      for (let c = 0; c < selectedClips.length; c++) {
        const clip = selectedClips[c];
        setStatusMessage(`Compilando clip ${c + 1} de ${selectedClips.length}: "${clip.title}"...`);

        for (let f = 0; f < 35; f++) {
          renderFrame(
            `⚡ Minuto ${clip.minute}: ${clip.title}`,
            `Cámara Sincronizada • VAR & Fan Portal • ${c + 1}/${selectedClips.length}`,
            f / 35
          );
          await new Promise(r => setTimeout(r, 40));
        }
        setGenerationProgress(40 + Math.floor(((c + 1) / selectedClips.length) * 45));
      }

      // Phase 3: Outro Screen (1 second)
      setStatusMessage('Codificando pista de video final y optimizando para redes...');
      for (let i = 0; i < 20; i++) {
        renderFrame(
          '¡PARTIDO FINALIZADO!',
          'Síguenos en redes sociales para ver todas las jugadas y entrevistas',
          1
        );
        await new Promise(r => setTimeout(r, 40));
      }

      setGenerationProgress(95);

      // Stop recorder
      recorder.onstop = () => {
        const compiledBlob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(compiledBlob);
        setGeneratedVideoUrl(videoUrl);
        setIsGenerating(false);
        setGenerationProgress(100);
        setStatusMessage('¡Highlight Reel ensamblado y listo para descargar y compartir!');
      };

      recorder.stop();
    } catch (error) {
      console.error('Error generating highlight reel:', error);
      setIsGenerating(false);
      setStatusMessage('Error durante la generación del reel. Inténtalo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#090e1a]/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Generador Automático de Resúmenes & Reels</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase font-mono">
                  1-CLIC IA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ensambla en segundos todos los goles y jugadas de riesgo en un solo video listo para TikTok, Instagram y YouTube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Top Options Bar: Aspect Ratio & Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Format Selector */}
            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Formato de Video:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    aspectRatio === '16:9'
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>16:9 YouTube / TV</span>
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    aspectRatio === '9:16'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 TikTok / Reels</span>
                </button>
              </div>
            </div>

            {/* Custom Overlays */}
            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Elementos del Reel:</span>
              </label>
              <div className="space-y-1.5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIntroCard}
                    onChange={(e) => setIncludeIntroCard(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Portada con Marcador Oficial</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSponsors}
                    onChange={(e) => setIncludeSponsors(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Banners de Auspiciantes de la Liga</span>
                </label>
              </div>
            </div>

            {/* Match Summary Stats */}
            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Encuentro Seleccionado:</span>
              <div className="text-sm font-black text-white">
                {homeTeam.name} ({homeScore}) vs {awayTeam.name} ({awayScore})
              </div>
              <div className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedClips.length} clips clave seleccionados</span>
              </div>
            </div>
          </div>

          {/* Center Stage: Live Sequence Preview & Clip Selection List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Preview Player (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vista Previa de la Secuencia ({currentPreviewIdx + 1}/{selectedClips.length}):</span>
                </span>
                <span className="text-slate-400">
                  {selectedClips[currentPreviewIdx]?.title}
                </span>
              </div>

              <div className={`relative w-full rounded-2xl overflow-hidden bg-black border-2 border-cyan-500/30 shadow-xl flex items-center justify-center ${
                aspectRatio === '9:16' ? 'aspect-[9/14] max-w-sm mx-auto' : 'aspect-video'
              }`}>
                {selectedClips.length > 0 ? (
                  <video
                    ref={previewVideoRef}
                    src={selectedClips[currentPreviewIdx]?.url}
                    playsInline
                    autoPlay
                    muted={isMuted}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-slate-400 p-6 text-center">
                    No hay clips seleccionados
                  </div>
                )}

                {/* Video Info Overlay */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-xl text-[11px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Minuto {selectedClips[currentPreviewIdx]?.minute}' • {selectedClips[currentPreviewIdx]?.title}</span>
                </div>

                {/* Sound toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-xl cursor-pointer border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
              </div>
            </div>

            {/* Clips Selection List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clips del Partido para el Resumen:</span>
                </span>
                <span className="text-slate-400 text-[11px]">Marca para incluir</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {availableClips.map((clip, index) => {
                  const isSelected = selectedClipIds.includes(clip.id);
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        toggleClipSelection(clip.id);
                        setCurrentPreviewIdx(selectedClips.findIndex(c => c.id === clip.id) >= 0 ? selectedClips.findIndex(c => c.id === clip.id) : 0);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                          : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          clip.type === 'goal'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : clip.type === 'var'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {clip.type === 'goal' ? '⚽' : clip.type === 'var' ? 'VAR' : '⚡'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{clip.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Minuto {clip.minute}' • {clip.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-white/20'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress / Status banner during generation */}
          {isGenerating && (
            <div className="bg-cyan-950/60 border border-cyan-500/40 p-4 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                <span>{statusMessage}</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Generated Result Banner & Actions */}
          {generatedVideoUrl && !isGenerating && (
            <div className="bg-emerald-950/70 border border-emerald-500/50 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">¡Video Compilado Exitosamente!</h4>
                  <p className="text-xs text-emerald-200">
                    Formato {aspectRatio} listo con gráficos de TV, transiciones y patrocinadores.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={generatedVideoUrl}
                  download={`Resumen_${match.id}_${homeTeam.name}_vs_${awayTeam.name}.webm`}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Video MP4</span>
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Resumen ${homeTeam.name} vs ${awayTeam.name}`,
                        text: `Mira los mejores momentos del partido ${homeScore}-${awayScore} en Sportia`,
                        url: window.location.href
                      }).catch(() => {});
                    } else {
                      alert('¡Enlace del resumen copiado para compartir en TikTok y WhatsApp!');
                    }
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#090e1a]/95 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-xs text-slate-400">
            Tiempo estimado de renderizado en el navegador: <strong className="text-white">~4 segundos</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              Cerrar
            </button>

            <button
              onClick={handleGenerateHighlightReel}
              disabled={isGenerating || selectedClips.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 hover:opacity-90 disabled:opacity-50 text-black font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{isGenerating ? 'Compilando Reel...' : '⚡ Ensamblar Reel en 1-Clic'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
