import React, { useState } from 'react';
import { RefreshCw, FileText, Sparkles, CheckCircle, Award, Copy, Check } from 'lucide-react';
import { Match, MatchEvent, AiChronicle } from '../../types';
import { apiService } from '../../services/apiService';
import { CINEMATIC_ASSETS } from '../../data/cinematicAssets';
import { copyTextSafely } from '../../utils/safeClipboard';

interface AiChronicleGeneratorProps {
  matches: Match[];
  events: MatchEvent[];
  onChronicleGenerated?: (chronicle: AiChronicle) => void;
}

export const AiChronicleGenerator: React.FC<AiChronicleGeneratorProps> = ({ matches, events, onChronicleGenerated }) => {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chronicle, setChronicle] = useState<AiChronicle | null>(null);
  const [copiedPress, setCopiedPress] = useState(false);

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

  const handleCopyPressNote = async () => {
    if (!chronicle) return;
    const scoreLine = selectedMatch
      ? `${selectedMatch.home_team?.name || 'Local'} ${selectedMatch.home_score} - ${selectedMatch.away_score} ${selectedMatch.away_team?.name || 'Visitante'}`
      : '';
    const pressText = [
      `*${chronicle.headline}*`,
      scoreLine ? `Marcador Oficial: ${scoreLine}` : '',
      '',
      chronicle.body,
      '',
      `Momentos Clave:\n${chronicle.key_moments.map(k => `• ${k}`).join('\n')}`,
      '',
      `Nota Táctica: ${chronicle.tactical_notes}`,
      '— Redacción Oficial Deporverso'
    ].filter(Boolean).join('\n');

    const copied = await copyTextSafely(pressText);
    if (copied) {
      setCopiedPress(true);
      setTimeout(() => setCopiedPress(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cinematic Stage Banner */}
      <div className="cine-stage-frame min-h-[195px] p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-end">
        <img
          src={CINEMATIC_ASSETS.goalMoment}
          alt="Celebración de gol en estadio - Sala de Prensa Deporverso"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="cine-scrim-hero" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/35 font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Sala de Prensa Oficial Deporverso
              </span>
              <span className="text-slate-300 text-xs font-mono">Redacción Automatizada IA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Redacción de Crónicas Deportivas Oficiales
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/85 mt-1 max-w-2xl">
              Convierte los eventos de la vocalía digital en artículos periodísticos estructurados, análisis táctico y titulares de prensa listos para WhatsApp y redes.
            </p>
          </div>

          {selectedMatch && (
            <button
              onClick={handleGenerateChronicle}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Redactando Crónica Oficial...' : 'Generar Crónica Oficial'}
            </button>
          )}
        </div>
      </div>

      {/* Match Selector */}
      <div className="cine-surface rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Seleccionar Encuentro Deportivo para Redacción:
            </label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full max-w-xl bg-black/55 border border-white/10 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-cyan-400 cursor-pointer"
            >
              {matches.map(m => (
                <option key={m.id} value={m.id} className="bg-[#090e1a]">
                  [{m.sport_code}] {m.home_team?.name} ({m.home_score}) vs {m.away_team?.name} ({m.away_score}) - {m.status}
                </option>
              ))}
            </select>
          </div>

          {selectedMatch && (
            <div className="bg-black/55 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-4 tabular-nums">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Local</span>
                <strong className="text-xs font-extrabold text-white">{selectedMatch.home_team?.name || 'Local'}</strong>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg font-mono text-base font-black text-cyan-300">
                {selectedMatch.home_score} - {selectedMatch.away_score}
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Visitante</span>
                <strong className="text-xs font-extrabold text-white">{selectedMatch.away_team?.name || 'Visitante'}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Press Chronicle Output */}
      {chronicle && (
        <div className="cine-surface border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Editorial Cover Frame */}
          <div className="relative h-48 sm:h-56 overflow-hidden border-b border-white/10">
            <img
              src={CINEMATIC_ASSETS.goalMoment}
              alt={chronicle.headline}
              className="w-full h-full object-cover object-center"
            />
            <div className="cine-scrim-card" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold px-3 py-1 rounded flex items-center gap-1.5 uppercase">
                  <CheckCircle className="w-3.5 h-3.5" /> Publicado en Blog & Crónicas
                </span>
                <span className="bg-black/65 backdrop-blur-md text-slate-200 border border-white/15 text-[10px] font-mono px-2.5 py-1 rounded tabular-nums">
                  {new Date(chronicle.generated_at).toLocaleTimeString('es-EC')}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300">
                  Prensa Deportiva Deporverso • {selectedMatch?.sport_code}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight drop-shadow">
                  {chronicle.headline}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <span className="text-xs text-slate-400">
                Artículo listo para boletín oficial de la liga y difusión en redes.
              </span>
              <button
                onClick={handleCopyPressNote}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white cursor-pointer transition-colors"
              >
                {copiedPress ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Nota Copiada para WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copiar Nota de Prensa (WhatsApp)</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-slate-200 text-sm leading-relaxed space-y-3 font-serif">
              {chronicle.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Moments & Tactical Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-2">
                <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Momentos Clave del Partido:
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {chronicle.key_moments.map((km, i) => (
                    <li key={i}>{km}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-2">
                <h4 className="font-bold text-cyan-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Análisis Táctico IA:
                </h4>
                <p className="text-xs text-slate-300 leading-normal">{chronicle.tactical_notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

