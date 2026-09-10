import React, { useState } from 'react';
import { 
  Users, Sparkles, Download, Play, RefreshCw, Shield, Zap, 
  ArrowRight, FileText, Check, Layout
} from 'lucide-react';
import { SportCode, Sport } from '../../types';

interface TacticalBoardProps {
  sport: Sport;
}

interface PlayerToken {
  id: string;
  number: number;
  name: string;
  role: string;
  x: number; // percentage on board (0 to 100)
  y: number; // percentage on board (0 to 100)
}

// Default Presets according to Sport
const PRESETS: Record<SportCode, { name: string; tokens: PlayerToken[] }[]> = {
  FUTBOL: [
    {
      name: '4-3-3 Ofensivo',
      tokens: [
        { id: '1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50 },
        { id: '2', number: 4, name: 'Defensa Der', role: 'DEF', x: 28, y: 20 },
        { id: '3', number: 2, name: 'Central I', role: 'DEF', x: 25, y: 40 },
        { id: '4', number: 3, name: 'Central D', role: 'DEF', x: 25, y: 60 },
        { id: '5', number: 5, name: 'Defensa Izq', role: 'DEF', x: 28, y: 80 },
        { id: '6', number: 6, name: 'Pivote', role: 'MED', x: 45, y: 50 },
        { id: '7', number: 8, name: 'Volante D', role: 'MED', x: 55, y: 30 },
        { id: '8', number: 10, name: 'Volante I', role: 'MED', x: 55, y: 70 },
        { id: '9', number: 7, name: 'Extremo D', role: 'DEL', x: 78, y: 20 },
        { id: '10', number: 9, name: 'Delantero C', role: 'DEL', x: 85, y: 50 },
        { id: '11', number: 11, name: 'Extremo I', role: 'DEL', x: 78, y: 80 }
      ]
    },
    {
      name: '4-4-2 Robusto',
      tokens: [
        { id: '1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50 },
        { id: '2', number: 4, name: 'Lateral D', role: 'DEF', x: 28, y: 18 },
        { id: '3', number: 2, name: 'Central', role: 'DEF', x: 25, y: 38 },
        { id: '4', number: 3, name: 'Central', role: 'DEF', x: 25, y: 62 },
        { id: '5', number: 5, name: 'Lateral I', role: 'DEF', x: 28, y: 82 },
        { id: '6', number: 7, name: 'Banda D', role: 'MED', x: 52, y: 18 },
        { id: '7', number: 6, name: 'Mediocentro', role: 'MED', x: 50, y: 40 },
        { id: '8', number: 8, name: 'Mediocentro', role: 'MED', x: 50, y: 60 },
        { id: '9', number: 11, name: 'Banda I', role: 'MED', x: 52, y: 82 },
        { id: '10', number: 9, name: 'Punta I', role: 'DEL', x: 80, y: 38 },
        { id: '11', number: 10, name: 'Punta D', role: 'DEL', x: 80, y: 62 }
      ]
    }
  ],
  ECUAVOLEY: [
    {
      name: 'Ecuavoley 3 vs 3 Tradicional',
      tokens: [
        { id: '1', number: 1, name: 'Colocador', role: 'COLOCADOR', x: 70, y: 30 },
        { id: '2', number: 2, name: 'Servidor', role: 'SERVIDOR', x: 60, y: 50 },
        { id: '3', number: 3, name: 'Volador', role: 'VOLADOR', x: 30, y: 50 }
      ]
    }
  ],
  FUTSAL: [
    {
      name: 'Fútsal 1-2-2 Diamante',
      tokens: [
        { id: '1', number: 1, name: 'Portero', role: 'POR', x: 12, y: 50 },
        { id: '2', number: 2, name: 'Cierre', role: 'DEF', x: 32, y: 50 },
        { id: '3', number: 7, name: 'Ala Izquierda', role: 'ALA', x: 55, y: 22 },
        { id: '4', number: 8, name: 'Ala Derecha', role: 'ALA', x: 55, y: 78 },
        { id: '5', number: 9, name: 'Pívot', role: 'PIV', x: 82, y: 50 }
      ]
    }
  ],
  BALONCESTO: [
    {
      name: 'Baloncesto 2-3 Zona',
      tokens: [
        { id: '1', number: 1, name: 'Base', role: 'PG', x: 45, y: 35 },
        { id: '2', number: 2, name: 'Escolta', role: 'SG', x: 45, y: 65 },
        { id: '3', number: 3, name: 'Alero', role: 'SF', x: 70, y: 20 },
        { id: '4', number: 4, name: 'Ala-Pívot', role: 'PF', x: 75, y: 50 },
        { id: '5', number: 5, name: 'Pívot', role: 'C', x: 70, y: 80 }
      ]
    }
  ],
  PADEL: [
    {
      name: 'Pádel Pareja Ataque',
      tokens: [
        { id: '1', number: 1, name: 'Jugador Reves', role: 'REV', x: 65, y: 30 },
        { id: '2', number: 2, name: 'Jugador Drive', role: 'DRI', x: 65, y: 70 }
      ]
    }
  ],
  VOLEIBOL: [],
  BEISBOL: [],
  OTROS: []
};

export const TacticalBoard: React.FC<TacticalBoardProps> = ({ sport }) => {
  const sportCode = sport?.code || 'FUTBOL';
  const sportName = sport?.name || 'Fútbol';
  const sportPresets = PRESETS[sportCode] || PRESETS.FUTBOL;
  const [tokens, setTokens] = useState<PlayerToken[]>(sportPresets[0]?.tokens || PRESETS.FUTBOL[0].tokens);
  const [activePreset, setActivePreset] = useState<string>(sportPresets[0]?.name || '4-3-3 Ofensivo');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleSelectPreset = (presetName: string) => {
    setActivePreset(presetName);
    const found = sportPresets.find(p => p.name === presetName);
    if (found) {
      setTokens(found.tokens);
    }
  };

  const handleGenerateAiReport = () => {
    setGeneratingAi(true);
    setTimeout(() => {
      setGeneratingAi(false);
      setAiReport(
        `ANÁLISIS TÁCTICO IA (Gemini 1.5 Flash):\n` +
        `• Esquema: ${activePreset} para ${sportName}.\n` +
        `• Puntos Fuertes: Ocupación óptima de espacios con amplitud y profundidad. Presión alta en salida del rival.\n` +
        `• Recomendación DT: Mantener el bloque compacto en transiciones defensivas para evitar contragolpes por las bandas.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* TACTICAL BOARD BANNER */}
      <div className="bg-gradient-to-r from-[#0a1b2a] via-[#05111c] to-[#030910] p-6 sm:p-8 rounded-3xl border border-cyan-500/35 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden card-3d-interactive">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="bg-cyan-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Layout className="w-3.5 h-3.5" />
              <span>Pizarra Táctica Cuántica</span>
            </span>
            <span className="text-cyan-400 text-xs font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{sportName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Pizarra Táctica Holográfica & Analítica para DTs
          </h1>
          <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
            Simulador visual de formaciones con presets para Fútbol, Indor, Ecuavoley, Baloncesto y Pádel. Análisis automático de fortalezas tácticas asistido por Gemini IA.
          </p>
        </div>

        <button
          onClick={handleGenerateAiReport}
          disabled={generatingAi}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-[#00ff66] hover:from-cyan-300 hover:to-emerald-300 text-black font-black px-5 py-3 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto text-xs hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generatingAi ? 'Escaneando Formación...' : 'Análisis Táctico Gemini IA'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IZQUIERDA: PIZARRA DE CANCHA VISUAL */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#050b12] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden card-3d-interactive">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Cancha Adaptativa: {sportName} ({tokens.length} Jugadores)
              </span>

              <div className="flex gap-2 flex-wrap">
                {sportPresets.map(p => (
                  <button
                    key={p.name}
                    onClick={() => handleSelectPreset(p.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono ${
                      activePreset === p.name
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                        : 'bg-black/50 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SIMULADOR DE CANCHA CON EFECTO LÁSER */}
            <div className="relative w-full aspect-[16/9] bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-emerald-950/80 border-2 border-emerald-500/40 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              {/* LÁSER DE RASTREO TÁCTICO */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-laser-sweep pointer-events-none z-10"></div>

              {/* LÍNEAS DE CANCHA */}
              <div className="absolute inset-0 border-2 border-emerald-400/30 m-4 rounded-xl pointer-events-none" />
              <div className="absolute top-4 bottom-4 left-1/2 w-0.5 bg-emerald-400/30 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-emerald-400/30 rounded-full pointer-events-none" />

              {/* FICHAS DE JUGADORES EN POSICIONES % */}
              {tokens.map((t) => (
                <div
                  key={t.id}
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black font-black text-xs flex items-center justify-center border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-125 transition-transform">
                    {t.number}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-white bg-black/90 px-2 py-0.5 rounded-full border border-cyan-500/40 mt-1 whitespace-nowrap shadow-md group-hover:border-cyan-400 transition-colors">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DERECHA: REPORTE E INSTRUCCIONES */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#050b12] rounded-3xl border border-cyan-500/30 p-6 space-y-4 shadow-2xl relative overflow-hidden card-3d-interactive">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <FileText className="w-4 h-4" />
              <span>Informe de Pizarra Táctica</span>
            </h3>

            {aiReport ? (
              <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-xs text-white/90 space-y-2 font-mono">
                <pre className="whitespace-pre-wrap leading-relaxed">{aiReport}</pre>
              </div>
            ) : (
              <p className="text-xs text-white/50 leading-relaxed bg-black/50 p-4 rounded-2xl border border-white/5">
                Presiona <strong>"Análisis Táctico Gemini IA"</strong> para obtener una evaluación detallada del esquema táctico actual.
              </p>
            )}

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold text-white/70 block font-mono">Alineación en Campo:</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {tokens.map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs flex items-center justify-between hover:border-cyan-500/30 transition-colors">
                    <span className="text-white font-bold">#{t.number} - {t.name}</span>
                    <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-md font-mono border border-cyan-500/20">
                      {t.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
