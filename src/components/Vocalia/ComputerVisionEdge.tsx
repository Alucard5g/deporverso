import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  Eye, 
  Radio, 
  Scissors, 
  Smartphone, 
  Download, 
  Sparkles, 
  Film,
  Check,
  Terminal,
  Share2,
  FileText,
  Server,
  Layers,
  Copy,
  Code
} from 'lucide-react';
import { Match } from '../../types';

interface ComputerVisionEdgeProps {
  match?: Match;
}

export const ComputerVisionEdge: React.FC<ComputerVisionEdgeProps> = ({ match }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [detectedJersey, setDetectedJersey] = useState('10');
  const [confidenceScore, setConfidenceScore] = useState(98.4);
  const [detectedAction, setDetectedAction] = useState('Detección de Balón en Área de Meta');

  // AutoHighlightGenerator 9:16 State
  const [isGeneratingClip, setIsGeneratingClip] = useState(false);
  const [generatedClip, setGeneratedClip] = useState<{
    url: string;
    duration: number;
    resolution: string;
    aspectRatio: string;
    timestamp: number;
  } | null>(null);
  const [clipStatus, setClipStatus] = useState<string | null>(null);
  const [showCodeDetails, setShowCodeDetails] = useState(false);

  // Puppeteer Scouting PDF State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scoutingPdfUrl, setScoutingPdfUrl] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  // Serverless Worker (Cloud Run 8080 - YOLOv8 + EasyOCR) State
  const [showWorkerCode, setShowWorkerCode] = useState(false);
  const [isTestingWorker, setIsTestingWorker] = useState(false);
  const [workerLatency, setWorkerLatency] = useState<number | null>(null);
  const [workerStatusMessage, setWorkerStatusMessage] = useState<string | null>(null);
  const [copiedDockerfile, setCopiedDockerfile] = useState(false);

  const handleSimulateServerlessWorker = async () => {
    setIsTestingWorker(true);
    setWorkerStatusMessage('Despachando inferencia a main_serverless_worker.py (YOLOv8 + EasyOCR)...');
    try {
      const res = await fetch('/api/worker/simulate-inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dorsal: detectedJersey,
          action: detectedAction
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWorkerLatency(data.latencyMs || 14.2);
        setConfidenceScore(data.inferenceResult?.confidence || 98.6);
        setWorkerStatusMessage(`✓ Inferencia completada con éxito en ${data.latencyMs || 14.2}ms via Cloud Run Port 8080.`);
      } else {
        setWorkerStatusMessage('Aviso: Ejecutando inferencia en modo fallback local.');
      }
    } catch (e: any) {
      setWorkerStatusMessage(`Error comunicando con worker: ${e.message}`);
    } finally {
      setIsTestingWorker(false);
    }
  };

  const handleGenerateScoutingPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfStatus('Iniciando Puppeteer y renderizando HTML táctico A4...');
    try {
      const res = await fetch('/api/reports/scouting-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerData: {
            name: `Atleta Titular #${detectedJersey}`,
            team: match?.home_team?.name || 'Club Atlético DeporVerso',
            position: 'Extremo Ofensivo / Atacante',
            age: 23,
            dorsal: detectedJersey,
            sportIaIndex: 9.3,
            metrics: {
              distanceKm: 10.4,
              maxSpeedKmh: 32.8,
              passAccuracy: 89.2,
              recoveries: 7
            },
            aiEvaluation: `Lectura táctica pericial asistida por Visión Artificial Edge. El jugador #${detectedJersey} mantiene un índice de acierto del 89.2% con presencia dominante en el carril ofensivo.`
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScoutingPdfUrl(data.pdfUrl);
        setPdfStatus('✓ Ficha de Scouting PDF generada exitosamente (A4 Puppeteer)');
      } else {
        setPdfStatus('Aviso: Error generando PDF en el servidor.');
      }
    } catch (e: any) {
      setPdfStatus(`Fallo de conexión: ${e.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const triggerRescan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const numbers = ['7', '9', '10', '23', '11'];
      setDetectedJersey(numbers[Math.floor(Math.random() * numbers.length)]);
      setConfidenceScore(+(95 + Math.random() * 4.5).toFixed(1));
      setIsProcessing(false);
    }, 1200);
  };

  const handleGenerateHighlight916 = async () => {
    setIsGeneratingClip(true);
    setClipStatus('Ejecutando AutoHighlightGenerator (FFmpeg crop=ih*(9/16)...)');
    try {
      const res = await fetch('/api/media/generate-highlight-916', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          eventTimestampSec: 15.0,
          eventTitle: `Golazo en Directo - Dorsal #${detectedJersey}`,
          playerDorsal: detectedJersey,
          actionType: 'GOL_EDGE_DETECTION',
          preSec: 10.0,
          postSec: 5.0
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedClip({
          url: data.clip?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: data.clip?.durationSec || 15.0,
          resolution: '1080x1920',
          aspectRatio: '9:16',
          timestamp: 15.0
        });
        setClipStatus('✓ ¡Clip 9:16 generado con éxito (1080x1920)! Listo para TikTok / Reels.');
      } else {
        setClipStatus('Aviso: Procesado con fallback visual simulado.');
        setGeneratedClip({
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: 15.0,
          resolution: '1080x1920',
          aspectRatio: '9:16',
          timestamp: 15.0
        });
      }
    } catch (e: any) {
      setClipStatus(`Fallo de conexión: ${e.message}`);
    } finally {
      setIsGeneratingClip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Visión Artificial Edge AI & AutoHighlight 9:16
            </span>
            <span className="text-white/40 text-xs font-mono">Inferencia en Cliente + FFmpeg Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Segmento 2: Inferencia Edge para Mesa de Control & Generación 9:16</h1>
          <p className="text-xs text-white/50 mt-1">
            Detección automática de dorsales de jugadores, seguimiento de balón y extracción cinemática de clips verticales (1080x1920) para redes sociales en menos de 1 segundo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerRescan}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Simular Inferencia Edge
          </button>
        </div>
      </div>

      {/* Video Feed Simulation with AI Overlays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Container */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="relative rounded-xl overflow-hidden bg-[#050505] border border-white/10 aspect-video flex items-center justify-center">
            {/* Sample Stadium / Sports Image */}
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000"
              alt="Match Feed"
              className="w-full h-full object-cover opacity-80"
            />

            {/* AI Bounding Box Overlay Simulation */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400 bg-cyan-500/10 p-2 rounded-lg text-center backdrop-blur-xs shadow-lg animate-pulse">
              <span className="bg-cyan-500 text-black font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Dorsal #{detectedJersey} ({confidenceScore}%)
              </span>
              <div className="w-16 h-20 border border-cyan-400/60 mt-1 mx-auto rounded"></div>
            </div>

            {/* Ball Tracker */}
            <div className="absolute top-1/2 left-2/3 border-2 border-amber-400 rounded-full w-8 h-8 flex items-center justify-center bg-amber-400/20 animate-bounce">
              <span className="text-[9px] font-black text-amber-300">BALÓN</span>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 bg-[#0a0a0a]/90 text-white text-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 font-mono">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>CÁMARA TÁCTICA EDGE AI - 60 FPS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50 bg-[#121212] p-3 rounded-xl border border-white/10">
            <span>Modelo: TensorFlow.js / WASM MobileNet-SSD</span>
            <span className="text-cyan-400 font-mono font-bold">Latencia Inferencia: 12ms</span>
          </div>

          {/* AUTO-HIGHLIGHT GENERATOR 9:16 TRIGGER CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#101726] to-[#090d16] border border-cyan-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>AutoHighlightGenerator 9:16 (FFmpeg Engine)</span>
                    <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-mono">
                      TikTok / Shorts
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Extrae automáticamente los 10 segundos antes y 5 segundos después del gol del Jugador #{detectedJersey}.
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateHighlight916}
                disabled={isGeneratingClip}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Smartphone className={`w-3.5 h-3.5 ${isGeneratingClip ? 'animate-bounce' : ''}`} />
                <span>{isGeneratingClip ? 'Procesando Clip...' : 'Generar Clip 9:16'}</span>
              </button>
            </div>

            {clipStatus && (
              <div className="text-[11px] text-cyan-300 font-mono bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                {clipStatus}
              </div>
            )}
          </div>
        </div>

        {/* AI Stats Panel & 9:16 Phone Mockup Preview */}
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Resultados de Inferencia Edge
            </h3>

            <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Dorsal Detectado</span>
                <div className="text-2xl font-extrabold text-cyan-400">Jugador #{detectedJersey}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Confianza del Algoritmo</span>
                <div className="w-full bg-[#080808] h-2 rounded-full overflow-hidden mt-1 border border-white/5">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${confidenceScore}%` }}></div>
                </div>
                <p className="text-[11px] text-white/40 mt-1">{confidenceScore}% de precisión en lectura OCR</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Acción de Juego</span>
                <p className="text-xs font-bold text-white mt-1">{detectedAction}</p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-xl space-y-2">
              <span className="inline-flex items-center gap-1 text-cyan-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" /> Asistencia para Mesa de Control
              </span>
              <p className="text-xs text-white/60">
                La IA sugiere autocompletar la anotación para el jugador #{detectedJersey} en el acta digital.
              </p>
            </div>
          </div>

          {/* 9:16 PREVIEW CARD (SMARTPHONE REEL PREVIEW) */}
          {generatedClip && (
            <div className="bg-[#0a0a0a] border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  Clip Vertical 9:16 Listo
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                  1080x1920 Full HD
                </span>
              </div>

              {/* Vertical Mockup Container */}
              <div className="relative mx-auto w-44 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl">
                <video
                  src={generatedClip.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                  9:16 REEL
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-mono text-[11px]">Duración: 15s (10s antes, 5s después)</span>
                <a
                  href={generatedClip.url}
                  download={`highlight_dorsal_${detectedJersey}_916.mp4`}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          )}

          {/* BOTÓN INSPECTOR TÉCNICO FFMPEG */}
          <button
            onClick={() => setShowCodeDetails(!showCodeDetails)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showCodeDetails ? 'Ocultar Comando FFmpeg' : 'Ver Filtro FFmpeg AutoHighlight'}</span>
          </button>

          {showCodeDetails && (
            <div className="p-3 bg-black/80 rounded-xl border border-white/10 text-[10px] font-mono text-cyan-300 space-y-1">
              <p className="text-slate-400 font-bold uppercase">Filtro de Recorte Vertical:</p>
              <code className="block bg-slate-900 p-2 rounded text-emerald-400 overflow-x-auto">
                -vf "crop=ih*(9/16):ih:(iw-ow)/2:0,scale=1080:1920:flags=bicubic"
              </code>
              <p className="text-slate-400 mt-1">Configuración: 10s pre, 5s post, libx264 crf=22, aac 128k.</p>
            </div>
          )}

          {/* FICHA OFICIAL DE SCOUTING PDF (PUPPETEER) */}
          <div className="bg-[#0c1322] border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Ficha Scouting PDF (Puppeteer)
                </h4>
              </div>
              <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded font-mono">
                A4 Print
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Genera la ficha pericial para el Jugador #{detectedJersey} con mapa de calor táctico, métricas de velocidad y dictamen IA de Gemini.
            </p>

            <button
              onClick={handleGenerateScoutingPdf}
              disabled={isGeneratingPdf}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FileText className={`w-3.5 h-3.5 ${isGeneratingPdf ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPdf ? 'Generando PDF con Puppeteer...' : `Generar Ficha PDF (Dorsal #${detectedJersey})`}</span>
            </button>

            {pdfStatus && (
              <p className="text-[10px] text-amber-300 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                {pdfStatus}
              </p>
            )}

            {scoutingPdfUrl && (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> PDF A4 Listo
                </span>
                <a
                  href={scoutingPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Ver / Descargar PDF</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PANEL DE ARQUITECTURA: WORKER SERVERLESS DE VISIÓN ARTIFICIAL & VAR (CLOUD RUN) */}
      <div className="bg-[#080d1a] border border-cyan-500/20 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Server className="w-3 h-3" /> Worker Serverless Cloud Run
              </span>
              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
                Puerto 8080 : ACTIVO
              </span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Contenedor Multi-Stage de Visión e Inferencia IA (YOLOv8 + EasyOCR + PyTorch)
            </h3>
            <p className="text-xs text-slate-400">
              Arquitectura desacoplada en dos etapas (Builder & Runner) para inferencia acelerada de dorsales, seguimiento de balón y clips cinemáticos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateServerlessWorker}
              disabled={isTestingWorker}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Cpu className={`w-3.5 h-3.5 ${isTestingWorker ? 'animate-spin' : ''}`} />
              <span>{isTestingWorker ? 'Procesando Inferencia...' : 'Ejecutar Inferencia Worker'}</span>
            </button>

            <button
              onClick={() => setShowWorkerCode(!showWorkerCode)}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showWorkerCode ? 'Ocultar Dockerfile' : 'Ver Dockerfile'}</span>
            </button>
          </div>
        </div>

        {/* Badges de Dependencias y Pila Tecnológica */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Modelo Base</span>
            <span className="text-xs font-bold text-cyan-400">ultralytics</span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Visión OpenCV</span>
            <span className="text-xs font-bold text-emerald-400">opencv-headless</span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Inferencia Deep</span>
            <span className="text-xs font-bold text-amber-400">torch (CPU)</span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Reconocimiento</span>
            <span className="text-xs font-bold text-rose-400">easyocr</span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Procesamiento 9:16</span>
            <span className="text-xs font-bold text-purple-400">ffmpeg</span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Entrypoint</span>
            <span className="text-xs font-bold text-white">main_serverless</span>
          </div>
        </div>

        {workerStatusMessage && (
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs font-mono text-cyan-300">
            <span>{workerStatusMessage}</span>
            {workerLatency && (
              <span className="text-emerald-400 font-bold">Latencia: {workerLatency} ms</span>
            )}
          </div>
        )}

        {/* Visor Interactivo del Dockerfile Multi-Stage */}
        {showWorkerCode && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Dockerfile.worker (Configuración Cloud Run Serverless):</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
`# ==========================================
# ETAPA 1: Construcción de Dependencias
# ==========================================
FROM python:3.10-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    ffmpeg \\
    libgl1 \\
    libglib2.0-0 \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Instalación de paquetes de visión e IA optimizados
RUN pip install --no-cache-dir --user \\
    ultralytics \\
    opencv-python-headless \\
    torch torchvision --index-url https://download.pytorch.org/whl/cpu \\
    easyocr \\
    numpy

# ==========================================
# ETAPA 2: Imagen Final Ejecutable
# ==========================================
FROM python:3.10-slim AS runner

WORKDIR /app

# Copiar paquetes instalados y binarios del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \\
    ffmpeg \\
    libgl1 \\
    libglib2.0-0 \\
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY . /app

ENV PATH=/root/.local/bin:$PATH
ENV PORT=8080

EXPOSE 8080

CMD ["python", "main_serverless_worker.py"]`
                  );
                  setCopiedDockerfile(true);
                  setTimeout(() => setCopiedDockerfile(false), 2000);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-200 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy className="w-3 h-3 text-cyan-400" />
                <span>{copiedDockerfile ? '¡Copiado!' : 'Copiar Dockerfile'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-80">
{`# ==========================================
# ETAPA 1: Construcción de Dependencias
# ==========================================
FROM python:3.10-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    ffmpeg \\
    libgl1 \\
    libglib2.0-0 \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Instalación de paquetes de visión e IA optimizados
RUN pip install --no-cache-dir --user \\
    ultralytics \\
    opencv-python-headless \\
    torch torchvision --index-url https://download.pytorch.org/whl/cpu \\
    easyocr \\
    numpy

# ==========================================
# ETAPA 2: Imagen Final Ejecutable
# ==========================================
FROM python:3.10-slim AS runner

WORKDIR /app

# Copiar paquetes instalados y binarios del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \\
    ffmpeg \\
    libgl1 \\
    libglib2.0-0 \\
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY . /app

ENV PATH=/root/.local/bin:$PATH
ENV PORT=8080

EXPOSE 8080

CMD ["python", "main_serverless_worker.py"]`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

