import React, { useState } from 'react';
import { 
  Trophy, Shield, Zap, Video, Award, FileText, Users, BarChart3, 
  Sparkles, CheckCircle2, ChevronRight, ArrowRight, Play, QrCode, 
  DollarSign, Clock, Download, Share2, Printer, Eye, Flame, Check,
  Activity, ExternalLink, Calendar, ChevronDown, Layers
} from 'lucide-react';
import { MULTIVERSO_STATIONS } from './MultiversoStepTourModal';

interface MultiversoExecutiveDemoProps {
  onNavigateTab: (tabId: string) => void;
  onOpenStepTour: (stepIndex?: number) => void;
}

export const MultiversoExecutiveDemo: React.FC<MultiversoExecutiveDemoProps> = ({
  onNavigateTab,
  onOpenStepTour
}) => {
  const [activeView, setActiveView] = useState<'recorrido' | 'sincronizacion' | 'dossier'>('recorrido');
  const [selectedStationIndex, setSelectedStationIndex] = useState<number>(0);
  const [simulatedGoalStep, setSimulatedGoalStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);

  const selectedStation = MULTIVERSO_STATIONS[selectedStationIndex] || MULTIVERSO_STATIONS[0];
  const IconComp = selectedStation.icon;

  // Simulación interactiva del Gol de Mateo Silva (Club Deporverso en Liga Pichincha)
  const handleRunSyncSimulation = () => {
    setIsSimulating(true);
    setSimulatedGoalStep(1);

    const steps = [
      { step: 2, delay: 1000 }, // Vocalía registra gol
      { step: 3, delay: 2200 }, // VAR genera clip 9:16
      { step: 4, delay: 3400 }, // Tabla de posiciones y goleadores de Pichincha recalculadas
      { step: 5, delay: 4600 }, // Crónica redactada para WhatsApp y prensa
      { step: 6, delay: 5800 }, // Ficha de scouting actualizada
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSimulatedGoalStep(step);
        if (step === 6) {
          setIsSimulating(false);
        }
      }, delay);
    });
  };

  const handleCopyProposal = () => {
    const text = `🏆 *DOSSIER EJECUTIVO OFICIAL · LIGA BARRIAL PICHINCHA & CLUB DEPORVERSO*\n\n` +
      `Estimados Señores Dirigentes y Presidentes de Clubes Filiales:\n\n` +
      `Presentamos la plataforma tecnológica integral *DeporVerso*, desarrollada para profesionalizar al 100% nuestra liga barrial:\n\n` +
      `1️⃣ *Liga Barrial Pichincha:* Automatización de tablas de Serie A y B en 0.2 seg, fixture de 24 fechas sin conflictos de cancha y tabla de goleadores en vivo.\n` +
      `2️⃣ *Club Deportivo Deporverso (Club Modelo):* Carnets con código QR inviolable (cero suplantaciones), portada institucional y autogestión a solo $35 por club y por torneo (50% OFF lanzamiento, precio real $70).\n` +
      `3️⃣ *Vocalía Digital Móvil:* Eliminación de actas en papel, firma digital del árbitro y registro táctil en cancha.\n` +
      `4️⃣ *Sistema VAR A La Carta:* Repetición de jugadas en video, clips 9:16 y dictamen pericial autofinanciado con $12 por reclamo.\n` +
      `5️⃣ *Hub de Scouting & Talentos:* Fichas técnicas A4 de exportación para cazatalentos de clubes profesionales.\n` +
      `6️⃣ *Sala de Prensa Automática:* Crónicas periodísticas instantáneas para WhatsApp y medios locales.\n` +
      `7️⃣ *Gobernanza Virtual:* Asambleas con control de quórum y votaciones con hash de seguridad.\n` +
      `8️⃣ *Analítica de Fatiga:* Prevención de lesiones y alertas tácticas del minuto 75 al 90+.\n\n` +
      `📌 *Inversión oficial de lanzamiento:* $35 USD por club y por torneo (Precio real: $70 USD • 50% de descuento).\n` +
      `Demostración interactiva en vivo: https://deporverso.app`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedProposal(true);
      setTimeout(() => setCopiedProposal(false), 3000);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* HERO BANNER PRINCIPAL DE LA DEMO EJECUTIVA                     */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-[#030712] via-[#091326] to-[#040817] p-6 sm:p-10 shadow-[0_0_60px_rgba(0,240,255,0.15)]">
        {/* Glow atmosférico */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>PRESENTACIÓN OFICIAL PARA DIRIGENTES DEPORTIVOS 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Multiverso <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">DeporVerso</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Demostración interactiva de alta fidelidad sincronizada entre la <strong className="text-white">Liga Barrial Pichincha</strong> y el <strong className="text-white">Club Deportivo Deporverso</strong>. Conozca cómo la automatización integral reduce 14 horas semanales de trabajo directivo, erradica la suplantación de atletas con carnet QR y genera ingresos netos para la institución.
            </p>

            {/* Badges de impacto */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-slate-300 flex items-center gap-1.5 font-medium">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Liga Barrial Pichincha (Serie A & B)
              </span>
              <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-slate-300 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Club Deportivo Deporverso (Club Modelo)
              </span>
              <span className="text-xs px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 8 Estaciones Sincronizadas
              </span>
            </div>
          </div>

          {/* Botones de acción directos */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onOpenStepTour(0)}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Iniciar Tour Guiado (Paso a Paso)</span>
            </button>

            <button
              onClick={handleCopyProposal}
              className="px-5 py-3 bg-[#0a1122] hover:bg-[#0f1b36] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedProposal ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedProposal ? '¡Copiado para WhatsApp!' : 'Copiar Propuesta WhatsApp'}</span>
            </button>

            <button
              onClick={() => setActiveView('dossier')}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Ver Dossier Imprimible A4</span>
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN ENTRE VISTAS DE LA DEMO */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'recorrido', label: '1. Recorrido Paso a Paso (8 Estaciones)', icon: Layers },
            { id: 'sincronizacion', label: '2. Sincronización en Vivo (Pichincha ↔ Club)', icon: Activity },
            { id: 'dossier', label: '3. Dossier Oficial para Dirigentes (A4)', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* VISTA 1: RECORRIDO PASO A PASO POR LAS 8 ESTACIONES            */}
      {/* ============================================================== */}
      {activeView === 'recorrido' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Selector de Estaciones */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Las 8 Estaciones del Multiverso
              </span>
              <span className="text-xs text-cyan-400 font-mono font-semibold">
                0{selectedStationIndex + 1} / 08
              </span>
            </div>

            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {MULTIVERSO_STATIONS.map((station, idx) => {
                const Icon = station.icon;
                const isSelected = selectedStationIndex === idx;
                return (
                  <div
                    key={station.id}
                    onClick={() => setSelectedStationIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#0d1c3a] to-[#071124] border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                        : 'bg-[#080d1a] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected 
                          ? 'bg-cyan-400 text-slate-950 font-black' 
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isSelected ? 'text-cyan-300' : 'text-slate-400'
                          }`}>
                            Estación 0{station.stationNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                            {station.liveInteractiveAction.tabId}
                          </span>
                        </div>

                        <h3 className={`text-sm font-bold truncate mt-0.5 ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {station.title.split('—')[0]}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {station.dirigenteBenefit}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Detalle Profundo de la Estación Seleccionada */}
          <div className="lg:col-span-7 bg-[#060a14] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header de Estación */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                    {selectedStation.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Módulo de Operación Directiva
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedStation.title}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                  {selectedStation.subtitle}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <IconComp className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            {/* Resumen Ejecutivo */}
            <div className="space-y-2 bg-[#091122] p-4 rounded-2xl border border-cyan-500/20">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                ¿Qué hace este módulo por su institución?
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedStation.executiveSummary}
              </p>
            </div>

            {/* Problema Solucionado vs Beneficio para el Dirigente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Problema que Erradica
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedStation.problemSolved}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Beneficio Directivo
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedStation.dirigenteBenefit}
                </p>
              </div>
            </div>

            {/* Métricas de Alto Impacto */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Métricas Comprobadas en Torneos Barriales
              </span>
              <div className="grid grid-cols-3 gap-3">
                {selectedStation.metrics.map((m, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                    <span className="text-lg sm:text-xl font-black text-cyan-400 block font-mono">
                      {m.value}
                    </span>
                    <span className="text-[10px] font-bold text-white block truncate">
                      {m.label}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                      {m.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capturas de Demostración */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Componentes Clave en Funcionamiento
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedStation.mockScreenshots.map((scr, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                        {scr.tag}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white block">
                      {scr.title}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {scr.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de acción interactivo */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                {selectedStation.liveInteractiveAction.previewDescription}
              </p>

              <button
                onClick={() => onNavigateTab(selectedStation.liveInteractiveAction.tabId)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>{selectedStation.liveInteractiveAction.buttonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 2: SINCRONIZACIÓN EN VIVO (PICHINCHA ↔ CLUB DEPORVERSO)  */}
      {/* ============================================================== */}
      {activeView === 'sincronizacion' && (
        <div className="space-y-6">
          <div className="bg-[#070c18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Simulador de Flujo Multiverso
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  ¿Cómo se sincroniza Club Deporverso con Liga Barrial Pichincha?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  En un solo evento (un gol de Mateo Silva en la fecha 4), observe la reacción encadenada e instantánea en todas las áreas de la plataforma sin intervención manual.
                </p>
              </div>

              <button
                onClick={handleRunSyncSimulation}
                disabled={isSimulating}
                className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl ${
                  isSimulating
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{isSimulating ? 'Sincronizando Multiverso...' : 'Simular Gol en Vivo (Mateo Silva #10)'}</span>
              </button>
            </div>

            {/* LÍNEA DE TIEMPO DEL FLUJO EN VIVO */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { 
                  step: 2, 
                  title: '1. Vocalía Digital', 
                  desc: 'Vocal de cancha pulsa "Gol Mateo Silva #10". Acta firmada digitalmente.',
                  badge: 'CANCHA',
                  color: 'amber'
                },
                { 
                  step: 3, 
                  title: '2. VAR & Video', 
                  desc: 'Extracción instantánea de repetición y clip vertical 9:16 para redes.',
                  badge: 'MULTIMEDIA',
                  color: 'rose'
                },
                { 
                  step: 4, 
                  title: '3. Liga Pichincha', 
                  desc: 'Recálculo automático: +3 puntos, +1 GD y tabla de goleadores actualizada.',
                  badge: 'COMPETICIÓN',
                  color: 'cyan'
                },
                { 
                  step: 5, 
                  title: '4. Sala de Prensa', 
                  desc: 'Crónica periodística redactada para WhatsApp y blog oficial del torneo.',
                  badge: 'PRENSA',
                  color: 'purple'
                },
                { 
                  step: 6, 
                  title: '5. Scouting Hub', 
                  desc: 'Ficha A4 de Mateo Silva sube a 8.9 OVR lista para cazatalentos.',
                  badge: 'TALENTO',
                  color: 'emerald'
                },
              ].map((item) => {
                const isActivated = simulatedGoalStep >= item.step;
                const isCurrent = simulatedGoalStep === item.step;
                return (
                  <div
                    key={item.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)] scale-[1.03]'
                        : isActivated
                        ? 'bg-[#0a152d] border-emerald-500/40 text-white'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                      {isActivated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ESTADO COMPARATIVO DE DATOS EN VIVO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              
              {/* Tarjeta 1: Liga Barrial Pichincha */}
              <div className="p-5 rounded-2xl bg-[#030712] border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Liga Barrial Pichincha · Serie A</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Tabla de Posiciones Oficial</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('league')}
                    className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Tabla Completa</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">1º</span>
                      <span>Club Deportivo Deporverso</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded font-black">LÍDER</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-cyan-300">
                      <span>4 PJ</span>
                      <span>+8 GD</span>
                      <span className="text-emerald-400 font-black">12 PTS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">2º</span>
                      <span>Deportivo Quito Norte</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-slate-400">
                      <span>4 PJ</span>
                      <span>+4 GD</span>
                      <span className="text-white font-bold">9 PTS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">3º</span>
                      <span>Atlético San Antonio</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-slate-400">
                      <span>4 PJ</span>
                      <span>+2 GD</span>
                      <span className="text-white font-bold">7 PTS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Club Deportivo Deporverso */}
              <div className="p-5 rounded-2xl bg-[#030712] border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Club Deportivo Deporverso</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Carnet QR & Rendimiento de Atletas</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('club-deporverso')}
                    className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Plantel del Club</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0a1835] to-[#061023] border border-cyan-400/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-400 text-lg">
                      #10
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">Mateo Silva (#10)</h5>
                      <span className="text-xs text-cyan-300">Capitán & Mediapunta Ofensivo</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-bold">Carnet QR: Habilitado</span>
                        <span>·</span>
                        <span>Fútbol 11 Serie A</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Goles en Liga</span>
                    <span className="text-xl font-black text-white font-mono">
                      {simulatedGoalStep >= 4 ? '7 Goles' : '6 Goles'}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono block">Bota de Oro Barrial</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Costo por club afiliado: <strong className="text-white">$25 / año</strong></span>
                  <span className="text-cyan-400">Verificado CIG 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 3: DOSSIER EJECUTIVO IMPRIMIBLE A4 PARA ASAMBLEAS        */}
      {/* ============================================================== */}
      {activeView === 'dossier' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 bg-[#091122] p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">
                Ficha Técnica & Dossier Oficial para Dirigentes Deportivos
              </h3>
              <p className="text-xs text-slate-400">
                Documento estructurado en formato formal para imprimir o presentar en asamblea de delegados.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintDossier}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                onClick={handleCopyProposal}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedProposal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedProposal ? 'Copiado' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* HOJA A4 DIGITAL ESTILIZADA */}
          <div className="bg-[#030712] border-2 border-white/15 rounded-3xl p-8 sm:p-12 text-slate-200 max-w-4xl mx-auto space-y-8 shadow-2xl font-sans print:bg-white print:text-black print:border-none print:p-0">
            
            {/* Header Oficial de la Propuesta */}
            <div className="border-b-2 border-cyan-500/40 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest block">
                  PROPUESTA OFICIAL DE MODERNIZACIÓN TECNOLÓGICA 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Liga Barrial Pichincha & Clubes Filiales
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dirigido a: Señores Presidentes de Clubes, Delegados de Disciplina y Directorio General
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-cyan-300 font-bold block">
                  ECOSISTEMA DEPORVERSO
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Certificación CIG-2026
                </span>
              </div>
            </div>

            {/* Resumen Ejecutivo y Diagnóstico */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                1. Diagnóstico de la Problemática Barrial
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                Actualmente, la gestión semanal de los campeonatos barriales demanda más de 14 horas de digitación manual de planillas, con frecuentes conflictos por actas de partido ilegibles, reclamos por suplantación de identidad en canchas alejadas y retrasos en la entrega de tablas a los delegados. Esto limita el crecimiento institucional y ahuyenta a los patrocinadores comerciales.
              </p>
            </div>

            {/* Comparativa: Antes vs Con DeporVerso */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                2. Cuadro Comparativo Operativo
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-[#091122] text-slate-300 font-mono">
                    <tr>
                      <th className="p-3 text-left border-b border-white/10">Área Operativa</th>
                      <th className="p-3 text-left border-b border-white/10 text-rose-400">Modelo Tradicional</th>
                      <th className="p-3 text-left border-b border-white/10 text-cyan-300">Con DeporVerso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="p-3 font-bold text-white">Tablas y Fixture</td>
                      <td className="p-3 text-slate-400">Sumadas a mano los lunes (14 horas)</td>
                      <td className="p-3 text-emerald-300 font-semibold">Cálculo instantáneo en 0.2 segundos</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Identidad de Jugadores</td>
                      <td className="p-3 text-slate-400">Carnets de cartulina fáciles de alterar</td>
                      <td className="p-3 text-emerald-300 font-semibold">Carnet QR inviolable con validación facial</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Actas de Vocalía</td>
                      <td className="p-3 text-slate-400">Papel arrugado, tachones y extravíos</td>
                      <td className="p-3 text-emerald-300 font-semibold">Vocalía Digital táctil y firma electrónica</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Polémicas de Jugadas</td>
                      <td className="p-3 text-slate-400">Peleas, reclamos y agresiones al árbitro</td>
                      <td className="p-3 text-emerald-300 font-semibold">VAR A La Carta autofinanciado ($12)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Difusión & Prensa</td>
                      <td className="p-3 text-slate-400">Resultados invisibles fuera de la cancha</td>
                      <td className="p-3 text-emerald-300 font-semibold">Crónicas automáticas en WhatsApp y web</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estructura Económica y Retorno */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                3. Modelo de Costos Accesible para Clubes Barriales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block">Afiliación Anual por Club</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono my-1 block">$25 USD</span>
                  <span className="text-[10px] text-slate-400 block">Apenas $2.08 mensuales por institución</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block">Ahorro en Papelería</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono my-1 block">100% Cero</span>
                  <span className="text-[10px] text-slate-400 block">Elimina talonarios, sellos y copias</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block">Ingreso Neto VAR Liga</span>
                  <span className="text-2xl font-black text-amber-400 font-mono my-1 block">+$1,200</span>
                  <span className="text-[10px] text-slate-400 block">Financiado por solicitudes de revisión</span>
                </div>
              </div>
            </div>

            {/* Firma y Conclusión */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div>
                <span>Aprobado para demostración a la directiva de Liga Barrial Pichincha.</span>
                <span className="block text-white font-bold mt-0.5">Ecosistema Tecnológico DeporVerso • 2026</span>
              </div>
              <button
                onClick={() => onNavigateTab('league')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all cursor-pointer"
              >
                Abrir Liga Barrial Pichincha en Vivo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
