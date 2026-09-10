import React, { useState } from 'react';
import { Cpu, Play, Pause, RefreshCw, CheckCircle, Eye, Radio } from 'lucide-react';
import { Match } from '../../types';

interface ComputerVisionEdgeProps {
  match?: Match;
}

export const ComputerVisionEdge: React.FC<ComputerVisionEdgeProps> = ({ match }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [detectedJersey, setDetectedJersey] = useState('10');
  const [confidenceScore, setConfidenceScore] = useState(98.4);
  const [detectedAction, setDetectedAction] = useState('Detección de Balón en Área de Meta');

  const triggerRescan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const numbers = ['7', '9', '10', '23', '11'];
      setDetectedJersey(numbers[Math.floor(Math.random() * numbers.length)]);
      setConfidenceScore(+(95 + Math.random() * 4.5).toFixed(1));
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Visión Artificial Edge AI (WebAssembly)
            </span>
            <span className="text-white/40 text-xs font-mono">Inferencia en Cliente</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Segmento 2: Inferencia Edge para Mesa de Control</h1>
          <p className="text-xs text-white/50 mt-1">
            Detección automática de dorsales de jugadores, seguimiento de balón, anotación instantánea e interrupciones sin latencia de servidor.
          </p>
        </div>

        <button
          onClick={triggerRescan}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          Simular Inferencia Edge
        </button>
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

          <div className="flex items-center justify-between text-xs text-white/50 bg-[#121212] p-3 rounded-xl border border-white/10">
            <span>Modelo: TensorFlow.js / WASM MobileNet-SSD</span>
            <span className="text-cyan-400 font-mono font-bold">Latencia Inferencia: 12ms</span>
          </div>
        </div>

        {/* AI Stats Panel */}
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
      </div>
    </div>
  );
};
