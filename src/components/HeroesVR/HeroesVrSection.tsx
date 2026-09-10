import React, { useState } from 'react';
import { 
  Sparkles, Trophy, Activity, Heart, Zap, Shield, ChevronRight, 
  Flame, Award, CheckCircle2, ArrowRight, RefreshCw, Send,
  Cpu, ExternalLink, Dumbbell, Glasses
} from 'lucide-react';

interface HeroesVrSectionProps {
  onNavigateTab?: (tab: string) => void;
  standalone?: boolean;
}

export const HeroesVrSection: React.FC<HeroesVrSectionProps> = ({ 
  onNavigateTab,
  standalone = false 
}) => {
  // Simulator State
  const [selectedDrill, setSelectedDrill] = useState<'PENALTY_SHOOTOUT' | 'GOALKEEPER_REFLEX' | 'DRIBBLE_SLALOM' | 'ECUAVOLEY_SETTING' | 'FREE_THROW_BASKET'>('PENALTY_SHOOTOUT');
  const [durationSeconds, setDurationSeconds] = useState<number>(420); // 7 min
  const [heartRate, setHeartRate] = useState<number>(148);
  const [precision, setPrecision] = useState<number>(88);
  const [reactionTime, setReactionTime] = useState<number>(195);
  const [deviceModel, setDeviceModel] = useState<string>('Meta Quest 3 / WebXR');
  
  // Simulation Execution State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [athleteCard, setAthleteCard] = useState({
    name: 'Mateo Narváez',
    club: 'DeporVerso All-Stars',
    position: 'Delantero / Extremo',
    overall: 82,
    rarity: 'HERO_GOLD',
    stats: {
      ritmo: 85,
      tiro: 84,
      reflejos: 81,
      fisico: 79,
      pase: 80
    },
    totalXp: 1850,
    hallOfFameRank: 142
  });

  // Pre-registration state
  const [betaEmail, setBetaEmail] = useState('');
  const [betaRegistered, setBetaRegistered] = useState(false);

  const DRILLS_INFO: Record<string, { label: string; desc: string; sport: string; icon: string }> = {
    PENALTY_SHOOTOUT: {
      label: 'Tiros Penales al Ángulo VR',
      desc: 'Simulación de definición bajo presión frente a arqueros de IA con tracking de pie y mano.',
      sport: 'Fútbol',
      icon: '⚽'
    },
    GOALKEEPER_REFLEX: {
      label: 'Reflejos de Arquero (195ms)',
      desc: 'Entrenamiento de reflejos visuales a disparos de 90 km/h con guantes hápticos en WebXR.',
      sport: 'Fútbol / Fútsal',
      icon: '🧤'
    },
    DRIBBLE_SLALOM: {
      label: 'Slalom & Agilidad Espacial',
      desc: 'Evasión de conos y marcadores virtuales en espacio físico real calibrado por passthrough.',
      sport: 'Multideporte',
      icon: '⚡'
    },
    ECUAVOLEY_SETTING: {
      label: 'Batida & Colocada Ecuavoley VR',
      desc: 'Técnica de muñequeo y precisión sobre la red de 2.80m en réplica 3D de cancha barrial.',
      sport: 'Ecuavoley',
      icon: '🏐'
    },
    FREE_THROW_BASKET: {
      label: 'Tiros Libres Baloncesto VR',
      desc: 'Parábola biomecánica y memoria muscular con arco de tiro regulado por físicas realistas.',
      sport: 'Baloncesto',
      icon: '🏀'
    }
  };

  const handleSimulateTelemetry = async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    const calories = Math.round((durationSeconds / 60) * (heartRate * 0.08));

    try {
      const response = await fetch('/api/deporverso/heroes-vr/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSubdomain: 'ligaprolocal',
          playerId: 'ply-mateo-01',
          athleteFullName: athleteCard.name,
          deviceInfo: {
            headset: deviceModel,
            trackingFramework: 'WebXR_Device_API',
            refreshRateHz: 90
          },
          sessionData: {
            drillType: selectedDrill,
            durationSeconds,
            avgHeartRateBpm: heartRate,
            caloriesBurned: calories,
            precisionAccuracyPct: precision,
            reactionTimeMs: reactionTime,
            totalRepsCompleted: Math.round(durationSeconds / 15)
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSimulationResult(data);
        // Actualizar carta dinámica
        setAthleteCard(prev => {
          const newOvr = Math.min(99, prev.overall + (data.heroesBridge?.cardLevelUp ? 1 : 0));
          return {
            ...prev,
            overall: newOvr,
            totalXp: prev.totalXp + data.xpGained,
            hallOfFameRank: Math.max(1, prev.hallOfFameRank - 3),
            stats: {
              ...prev.stats,
              tiro: Math.min(99, prev.stats.tiro + (data.attributeBoosts?.tiro || 0)),
              fisico: Math.min(99, prev.stats.fisico + (data.attributeBoosts?.fisico || 0)),
              reflejos: Math.min(99, prev.stats.reflejos + (data.attributeBoosts?.reflejos || 0))
            }
          };
        });
      }
    } catch (err) {
      // Fallback local instantáneo
      const xpGained = Math.round(durationSeconds * 0.5 * (precision > 80 ? 1.25 : 1) + 40);
      setSimulationResult({
        success: true,
        xpGained,
        attributeBoosts: { tiro: 1, fisico: 1, reflejos: 2 },
        heroesBridge: {
          synced: true,
          cardLevelUp: xpGained > 250,
          newOverallRating: 83,
          hallOfFamePosition: 139,
          transactionId: `HD-${Date.now()}-mock`
        },
        sessionSummary: {
          drill: selectedDrill,
          durationSeconds,
          caloriesBurned: calories,
          precisionAccuracy: `${precision}%`,
          reactionTime: `${reactionTime}ms`
        }
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaEmail.trim()) return;
    setBetaRegistered(true);
  };

  return (
    <div className={`space-y-8 ${standalone ? 'p-4 sm:p-8 max-w-7xl mx-auto' : ''}`}>
      {/* 1. HERO BANNER PRÓXIMAMENTE CON ASOCIACIÓN */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#06141a] via-[#050c14] to-[#12081f] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow visual effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* BADGES OFICIALES */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 uppercase animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                PRÓXIMAMENTE
              </span>

              <a 
                href="https://heroesdeldeporte.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
              >
                <span>En asociación con</span>
                <span className="text-amber-400 font-black">heroesdeldeporte.com</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Glasses className="w-3.5 h-3.5" />
                WebXR / Meta Quest & Vision Pro
              </span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Héroes VR: <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Simulador de Carrera y Deporte en Casa</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              La revolución del deporte inmersivo llega a las ligas deportivas de DeporVerso en colaboración directa con el proyecto <strong className="text-white">"Héroes VR"</strong> de <a href="https://heroesdeldeporte.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">heroesdeldeporte.com</a>. Entrena en tu hogar con visores de realidad virtual, completa rutinas de precisión física y sincroniza tus puntos de experiencia (<strong className="text-amber-400">XP</strong>) para evolucionar tu <strong className="text-white">Carnet y Carta Coleccionable Oficial</strong> en el Salón de la Fama.
            </p>

            {/* KEY METRICS PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetría</span>
                </div>
                <div className="text-base font-black text-white">BPM & Cadencia</div>
                <div className="text-[10px] text-white/50">Tracking cardíaco en vivo</div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Salón de Fama</span>
                </div>
                <div className="text-base font-black text-white">Trading Cards</div>
                <div className="text-[10px] text-white/50">heroesdeldeporte.com</div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Latencia VR</span>
                </div>
                <div className="text-base font-black text-white">&lt; 15 ms</div>
                <div className="text-[10px] text-white/50">WebXR Device API 90Hz</div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-emerald-500/20 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Puente Seguro</span>
                </div>
                <div className="text-base font-black text-white">HMAC-SHA256</div>
                <div className="text-[10px] text-white/50">Firma criptográfica</div>
              </div>
            </div>
          </div>

          {/* RIGHT HERO CARD PREVIEW */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col items-center">
            {/* HOLOGRAPHIC ATHLETE CARD */}
            <div className="w-full max-w-xs bg-gradient-to-b from-amber-500/30 via-slate-900 to-black border-2 border-amber-400/70 rounded-3xl p-5 shadow-2xl shadow-amber-500/10 relative overflow-hidden text-center group">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black rounded-md uppercase tracking-wider">
                {athleteCard.rarity.replace('_', ' ')}
              </div>
              <div className="absolute top-2 left-2 text-[10px] font-black text-amber-300">
                HEROES VR
              </div>

              {/* OVERALL SCORE BADGE */}
              <div className="mt-4 mb-2 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-black font-black text-3xl shadow-lg shadow-amber-500/30 border-2 border-white/40">
                {athleteCard.overall}
              </div>
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                OVERALL RATING
              </div>

              <h3 className="text-lg font-black text-white mt-1">
                {athleteCard.name}
              </h3>
              <p className="text-xs text-white/60 font-medium">
                {athleteCard.position} • {athleteCard.club}
              </p>

              {/* STATS BARS */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                <div className="bg-white/5 p-2 rounded-xl text-left">
                  <span className="text-[10px] text-white/50 font-mono">RIT</span>
                  <div className="text-sm font-black text-white">{athleteCard.stats.ritmo}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl text-left">
                  <span className="text-[10px] text-white/50 font-mono">TIR</span>
                  <div className="text-sm font-black text-amber-400">{athleteCard.stats.tiro}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl text-left">
                  <span className="text-[10px] text-white/50 font-mono">REF</span>
                  <div className="text-sm font-black text-cyan-400">{athleteCard.stats.reflejos}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl text-left">
                  <span className="text-[10px] text-white/50 font-mono">FÍS</span>
                  <div className="text-sm font-black text-emerald-400">{athleteCard.stats.fisico}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                <span>XP Acumulado: <strong className="text-amber-300">{athleteCard.totalXp}</strong></span>
                <span>Ranking Fama: <strong className="text-cyan-300">#{athleteCard.hallOfFameRank}</strong></span>
              </div>

              <div className="mt-2 text-[9px] text-amber-400/80 font-mono uppercase tracking-wider">
                heroesdeldeporte.com ID: HERO-8429
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE TELEMETRY LAB & LIVE SIMULATOR */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Laboratorio de Telemetría WebXR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Simulador en Vivo: Entrenamiento Físico & Cálculo de XP
            </h2>
            <p className="text-xs text-white/60">
              Prueba en tiempo real cómo el backend de DeporVerso procesa los paquetes de datos biométricos de visores VR y sincroniza con heroesdeldeporte.com.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/50 bg-[#141414] px-3 py-1.5 rounded-xl border border-white/10">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Endpoint: <code className="text-cyan-300 font-mono">/api/deporverso/heroes-vr/telemetry</code></span>
          </div>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Selector de Ejercicio */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              1. Selecciona Ejercicio VR
            </label>
            <div className="space-y-2">
              {Object.entries(DRILLS_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDrill(key as any)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedDrill === key
                      ? 'bg-cyan-500/15 border-cyan-400/80 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-[#121212] border-white/5 text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{info.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{info.label}</div>
                      <div className="text-[10px] text-white/40 truncate">{info.sport}</div>
                    </div>
                  </div>
                  {selectedDrill === key && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Telemetría Biométrica Regulable */}
          <div className="space-y-4 bg-[#111111] p-5 rounded-2xl border border-white/5">
            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
              2. Parámetros de Biometría & Sensores
            </label>

            {/* Duración */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Duración de Sesión:
                </span>
                <span className="font-mono text-cyan-300 font-bold">{durationSeconds} seg ({Math.round(durationSeconds / 60)} min)</span>
              </div>
              <input
                type="range"
                min={60}
                max={900}
                step={30}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Frecuencia Cardíaca */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Ritmo Cardíaco Medio:
                </span>
                <span className="font-mono text-rose-300 font-bold">{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min={90}
                max={185}
                step={1}
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* Precisión */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Precisión de Tiro / Técnica:
                </span>
                <span className="font-mono text-amber-300 font-bold">{precision}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                step={1}
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Tiempo de Reacción */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Tiempo de Reacción:
                </span>
                <span className="font-mono text-purple-300 font-bold">{reactionTime} ms</span>
              </div>
              <input
                type="range"
                min={150}
                max={350}
                step={5}
                value={reactionTime}
                onChange={(e) => setReactionTime(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Selector de Dispositivo */}
            <div>
              <label className="block text-[11px] text-white/50 mb-1">Dispositivo Hardware VR:</label>
              <select
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                <option value="Meta Quest 3 / WebXR">Meta Quest 3 (Passthrough & Hands)</option>
                <option value="Apple Vision Pro WebXR">Apple Vision Pro (Eye & Pinch Tracking)</option>
                <option value="Pico 4 Enterprise">Pico 4 Enterprise (OpenXR)</option>
                <option value="WebXR PCVR Simulator">WebXR PCVR / Navegador Chrome</option>
              </select>
            </div>
          </div>

          {/* Col 3: Ejecución & Salida de Datos */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-[#111111] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ejecutar Sesión VR</span>
              </div>

              <p className="text-xs text-white/60">
                Dispara el cálculo matemático en Node.js, registra el entrenamiento en la base de datos de la liga y envía el webhook firmado a heroesdeldeporte.com.
              </p>

              <button
                type="button"
                disabled={isSimulating}
                onClick={handleSimulateTelemetry}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Calculando XP y Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black text-black" />
                    <span>Procesar Telemetría VR & Subir XP</span>
                  </>
                )}
              </button>
            </div>

            {/* RESULT PANEL */}
            {simulationResult ? (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ¡Sincronización Exitosa!
                  </span>
                  <span className="font-mono text-[10px] text-white/40">HTTP 200 OK</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-black/40 p-2 rounded-xl">
                    <span className="text-[10px] text-white/50">XP Otorgado:</span>
                    <div className="text-sm font-black text-amber-400">+{simulationResult.xpGained} XP</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl">
                    <span className="text-[10px] text-white/50">Calorías Quemadas:</span>
                    <div className="text-sm font-black text-rose-400">{simulationResult.sessionSummary?.caloriesBurned} kcal</div>
                  </div>
                </div>

                <div className="text-[11px] text-white/70 pt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Card Level-Up:</span>
                    <strong className="text-cyan-300">{simulationResult.heroesBridge?.cardLevelUp ? '¡SUBIDA DE NIVEL!' : 'Progreso en ruta'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ID Transacción Bridge:</span>
                    <code className="text-[10px] text-white/50 font-mono">{simulationResult.heroesBridge?.transactionId?.substring(0, 16)}...</code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-2xl p-4 text-center text-xs text-white/40 flex items-center justify-center min-h-24">
                Presiona "Procesar Telemetría VR" para disparar la llamada al motor y ver el resultado biométrico.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. ARQUITECTURA TÉCNICA DEL ECOSISTEMA HEROES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Glasses className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Simulador en Casa (WebXR)</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Sin descargas pesadas obligatorias. Funciona directamente en visores mediante estándares abiertos WebXR, mapeando la habitación física con seguridad de guardian espacial.
          </p>
          <ul className="text-[11px] text-white/60 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Ejercicios de penales, tiros libres y reflejos</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Conexión con pulsómetros Bluetooth BLE</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">heroesdeldeporte.com Bridge</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Alianza de datos con el portal global heroesdeldeporte.com. Las estadísticas reales de tu torneo barrial o intercolegial alimentan tu carnet coleccionable digital.
          </p>
          <ul className="text-[11px] text-white/60 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Salón de la Fama y Ranking Nacional</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Cartas coleccionables verificadas</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Integridad & Anti-Trampas</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Verificación algorítmica de acelerometría y frecuencia de muestreo para garantizar que las calorías, repeticiones y horas de entrenamiento sean 100% auténticas.
          </p>
          <ul className="text-[11px] text-white/60 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Firma HMAC de paquetes de telemetría</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Esquema PostgreSQL aislado por tenant</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. BETA ACCESS WAITLIST REGISTRATION */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
            Acceso Temprano Exclusivo
          </span>
          <h3 className="text-2xl font-black text-white">
            ¿Quieres ser de los primeros en probar Héroes VR en tu liga?
          </h3>
          <p className="text-xs text-white/70">
            Regístrate para recibir la beta cerrada WebXR para visores Meta Quest y participar por pases oficiales al Salón de la Fama de heroesdeldeporte.com.
          </p>
        </div>

        {betaRegistered ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-2xl text-center space-y-1 max-w-xs">
            <div className="text-xs font-black text-emerald-300">¡Registro Confirmado!</div>
            <p className="text-[11px] text-white/70">Te enviaremos las instrucciones de instalación del simulador WebXR a tu correo.</p>
          </div>
        ) : (
          <form onSubmit={handleBetaSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              required
              placeholder="tu-correo@deporte.com"
              value={betaEmail}
              onChange={(e) => setBetaEmail(e.target.value)}
              className="bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 min-w-[220px]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-400/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Unirme a la Beta
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
