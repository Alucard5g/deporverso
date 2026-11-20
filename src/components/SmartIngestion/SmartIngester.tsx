import React, { useState } from 'react';
import { FileText, Upload, Cpu, CheckCircle, RefreshCw, Send, Plus, Trash2, Copy, Check } from 'lucide-react';
import { MigrationTicket } from '../../types';
import { apiService } from '../../services/apiService';
import { copyTextSafely } from '../../utils/safeClipboard';

interface SmartIngesterProps {
  tenantId: string;
  sportCode: string;
  onAddTicket: (ticket: Omit<MigrationTicket, 'id' | 'created_at'>) => void;
}

export const SmartIngester: React.FC<SmartIngesterProps> = ({ tenantId, sportCode, onAddTicket }) => {
  const [activeMode, setActiveMode] = useState<'ai-parse' | 'legacy' | 'manual'>('ai-parse');

  // AI Parse Form
  const [docText, setDocText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  // Legacy System Migration Form
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [legacyNotes, setLegacyNotes] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  // Interactive Manual Builder (Camino 3)
  const [manualLeagueName, setManualLeagueName] = useState('Torneo Barrial Temporada 2026');
  const [manualTeamInput, setManualTeamInput] = useState('');
  const [manualTeams, setManualTeams] = useState<string[]>(['Real Pichincha FC', 'San Blas Atlético', 'Sporting La Carolina', 'Juvenil Norte']);
  const [manualCopied, setManualCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDocText(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const handleAiParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim()) return;

    setIsParsing(true);
    setParseResult(null);

    const res = await apiService.parseScheduleWithAi(docText, sportCode);
    setParseResult(res);
    setIsParsing(false);
  };

  const handleLegacyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;

    onAddTicket({
      tenant_id: tenantId,
      source_system: 'Sistema Anterior / Excel / PDF',
      contact_email: contactEmail,
      contact_phone: contactPhone,
      file_urls: ['plantilla_liga_import.xlsx'],
      status: 'NEW',
      notes: legacyNotes
    });

    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setContactEmail('');
      setContactPhone('');
      setLegacyNotes('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#080d1a]/80 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Ingesta Multideporte Inteligente
            </span>
            <span className="text-slate-400 text-xs font-mono font-medium">3 Caminos de Carga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Módulo de Ingesta y Digitalización de Datos</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Convierte documentos Word, Excel o PDF mediante el motor automatizado de procesamiento o solicita migración asistida desde tu sistema anterior.
          </p>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveMode('ai-parse')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'ai-parse'
              ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-[#080d1a]/70 border-white/[0.08] hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white text-sm">Camino 1: Procesador Digital de Planillas</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Pega el contenido de archivos Word/Excel/PDF para extraer equipos y calendarios automáticamente.</p>
        </button>

        <button
          onClick={() => setActiveMode('legacy')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'legacy'
              ? 'bg-teal-500/10 border-teal-500/50 shadow-md ring-1 ring-teal-500/30'
              : 'bg-[#080d1a]/70 border-white/[0.08] hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white text-sm">Camino 2: Migración Asistida</span>
            <Upload className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Solicita ayuda técnica para importar bases de datos antiguas, hojas de cálculo o archivos PDF.</p>
        </button>

        <button
          onClick={() => setActiveMode('manual')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'manual'
              ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
              : 'bg-[#080d1a]/70 border-white/[0.08] hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white text-sm">Camino 3: Registro Manual</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Creación tradicional paso a paso de categorías, equipos y programación de partidos.</p>
        </button>
      </div>

      {/* MODE 1: GEMINI AI PARSER */}
      {activeMode === 'ai-parse' && (
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Procesamiento Automatizado de Documentos y Fixtures
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setDocText(
                    'LIGA BARRIAL PICHINCHA - FECHA 1\nEquipos: Real Pichincha, Deportivo Quito Barrial, San Blas FC, Sporting Sur\nPartido 1: Real Pichincha vs San Blas FC - Sábado 10:00 - Cancha 1\nPartido 2: Deportivo Quito Barrial vs Sporting Sur - Sábado 12:00 - Cancha Central'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold cursor-pointer"
              >
                Cargar Ejemplo Liga
              </button>
              <label className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/35 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Subir .TXT / .CSV</span>
                <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <form onSubmit={handleAiParse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">
                Copiar y pegar texto o cargar archivo .CSV / .TXT de tu torneo:
              </label>
              <textarea
                rows={6}
                required
                placeholder="Ejemplo: LIGA REGIONAL DE FÚTBOL. Equipos: Real Pichincha, San Blas FC, Titanes. Partido 1: Real Pichincha vs San Blas FC el Sábado a las 10am en Cancha 1..."
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isParsing}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isParsing ? 'animate-spin' : ''}`} />
              {isParsing ? 'Procesando Documento...' : 'Procesar Documento Digital'}
            </button>
          </form>

          {/* AI Parsing Output */}
          {parseResult && (
            <div className="bg-[#121212] p-5 rounded-2xl border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Estructura extraída por IA para {parseResult.leagueName || 'Liga'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-white mb-2">Equipos Detectados ({parseResult.extractedTeams?.length || 0}):</h4>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {parseResult.extractedTeams?.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Partidos Programados:</h4>
                  <ul className="space-y-1 text-white/70">
                    {parseResult.parsedMatches?.map((m: any, i: number) => (
                      <li key={i} className="bg-[#080808] p-2 rounded border border-white/5">
                        <span className="font-bold text-cyan-300">{m.homeTeam}</span> vs <span className="font-bold text-cyan-300">{m.awayTeam}</span> ({m.date}) - {m.field}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: LEGACY MIGRATION TICKET */}
      {activeMode === 'legacy' && (
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-400" />
            Solicitud de Migración Asistida de Datos
          </h2>

          {ticketSent ? (
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">¡Ticket de Migración Enviado!</h3>
              <p className="text-xs text-white/60">El equipo técnico de Deporverso revisará tu información en un plazo de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleLegacyTicket} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Correo de Contacto de la Liga</label>
                <input
                  type="email"
                  required
                  placeholder="admin@ligabarrial.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+593 99 123 4567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Notas del Sistema Anterior / Base de Datos</label>
                <textarea
                  rows={3}
                  placeholder="Indica cuántos equipos, categorías e historial de sanciones deseas importar..."
                  value={legacyNotes}
                  onChange={(e) => setLegacyNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Enviar Solicitud de Migración
              </button>
            </form>
          )}
        </div>
      )}

      {/* MODE 3: MANUAL REGISTRATION */}
      {activeMode === 'manual' && (
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Generador Rápido de Equipos & Cruces Manuales
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Arma la lista de clubes participantes y genera automáticamente la jornada de enfrentamientos lista para copiar o procesar.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const pairings: string[] = [];
                for (let i = 0; i < manualTeams.length; i += 2) {
                  if (manualTeams[i + 1]) {
                    pairings.push(`Partido ${Math.floor(i / 2) + 1}: ${manualTeams[i]} vs ${manualTeams[i + 1]}`);
                  }
                }
                const summary = `${manualLeagueName}\nEquipos: ${manualTeams.join(', ')}\n${pairings.join('\n')}`;
                const ok = await copyTextSafely(summary);
                if (ok) {
                  setManualCopied(true);
                  setTimeout(() => setManualCopied(false), 2500);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {manualCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{manualCopied ? 'Fixture Copiado' : 'Copiar Fixture Generado'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Nombre del Torneo / Categoría</label>
                <input
                  type="text"
                  value={manualLeagueName}
                  onChange={(e) => setManualLeagueName(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar club (Ej. Unión Barrial)"
                  value={manualTeamInput}
                  onChange={(e) => setManualTeamInput(e.target.value)}
                  className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!manualTeamInput.trim()) return;
                    setManualTeams(prev => [...prev, manualTeamInput.trim()]);
                    setManualTeamInput('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {manualTeams.map((team, idx) => (
                  <div key={`${team}-${idx}`} className="flex items-center justify-between bg-[#121212] border border-white/10 px-3 py-2 rounded-xl text-xs">
                    <span className="font-semibold text-white">{idx + 1}. {team}</span>
                    <button
                      type="button"
                      onClick={() => setManualTeams(prev => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer p-1"
                      aria-label={`Eliminar ${team}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-mono font-bold text-amber-300 block uppercase">
                Cruces Automáticos ({Math.floor(manualTeams.length / 2)} Partidos)
              </span>
              <div className="space-y-2 text-xs">
                {Array.from({ length: Math.floor(manualTeams.length / 2) }).map((_, i) => (
                  <div key={i} className="p-2.5 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{manualTeams[i * 2]}</span>
                    <span className="text-[10px] font-mono text-slate-400 px-2">VS</span>
                    <span className="font-bold text-emerald-300">{manualTeams[i * 2 + 1]}</span>
                  </div>
                ))}
                {manualTeams.length % 2 === 1 && (
                  <p className="text-[11px] text-amber-300/80 font-mono">
                    Descansa en Fecha 1: {manualTeams[manualTeams.length - 1]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
