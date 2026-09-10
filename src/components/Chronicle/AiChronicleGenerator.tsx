import React, { useState } from 'react';
import { Zap, RefreshCw, FileText, Sparkles, CheckCircle, Share2, Award } from 'lucide-react';
import { Match, MatchEvent, AiChronicle } from '../../types';
import { apiService } from '../../services/apiService';

interface AiChronicleGeneratorProps {
  matches: Match[];
  events: MatchEvent[];
  onChronicleGenerated?: (chronicle: AiChronicle) => void;
}

export const AiChronicleGenerator: React.FC<AiChronicleGeneratorProps> = ({ matches, events, onChronicleGenerated }) => {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chronicle, setChronicle] = useState<AiChronicle | null>(null);

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  const handleGenerateChronicle = async () => {
    if (!selectedMatch) return;

    setIsGenerating(true);
    setChronicle(null);

    const matchEvts = events.filter(e => e.match_id === selectedMatch.id);

    const result = await apiService.generateAiChronicle({
      matchId: selectedMatch.id,
      sportCode: selectedMatch.sport_code,
      homeTeam: selectedMatch.home_team?.name || 'Local',
      awayTeam: selectedMatch.away_team?.name || 'Visitante',
      homeScore: selectedMatch.home_score,
      awayScore: selectedMatch.away_score,
      events: matchEvts
    });

    setChronicle(result);
    setIsGenerating(false);

    if (onChronicleGenerated) {
      onChronicleGenerated(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> IA Periodística Deporverso (Gemini)
            </span>
            <span className="text-white/40 text-xs font-mono">Generador Automático de Crónicas</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Redacción de Crónicas Deportivas en Vivo</h1>
          <p className="text-xs text-white/50 mt-1">
            Convierte los eventos de la vocalía digital en artículos periodísticos emocionantes y titulares de prensa para redes sociales.
          </p>
        </div>

        {selectedMatch && (
          <button
            onClick={handleGenerateChronicle}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Redactando Crónica con IA...' : 'Generar Crónica Gemini'}
          </button>
        )}
      </div>

      {/* Match Selector */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="block text-xs font-bold text-white/70">Seleccionar Encuentro Deportivo para Redacción:</label>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-cyan-500 cursor-pointer"
        >
          {matches.map(m => (
            <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
              [{m.sport_code}] {m.home_team?.name} ({m.home_score}) vs {m.away_team?.name} ({m.away_score}) - {m.status}
            </option>
          ))}
        </select>
      </div>

      {/* Generated Press Chronicle Output */}
      {chronicle && (
        <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Crónica generada y publicada automáticamente en la pestaña &quot;Blog & Crónicas&quot; para todos los aficionados.
            </span>
            <span className="text-[10px] bg-emerald-500/20 px-2.5 py-0.5 rounded font-mono uppercase border border-emerald-500/30">PUBLICADO</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Prensa Deportiva Deporverso | {selectedMatch?.sport_code}
            </span>
            <span className="text-xs text-white/40 font-mono">
              Generado: {new Date(chronicle.generated_at).toLocaleTimeString('es-EC')}
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {chronicle.headline}
            </h2>

            <div className="text-white/80 text-sm leading-relaxed space-y-3 font-serif">
              {chronicle.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key Moments & Tactical Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4" /> Momentos Clave del Partido:
              </h4>
              <ul className="list-disc list-inside text-xs text-white/70 space-y-1">
                {chronicle.key_moments.map((km, i) => (
                  <li key={i}>{km}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-cyan-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Análisis Táctico AI:
              </h4>
              <p className="text-xs text-white/70 leading-normal">{chronicle.tactical_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
