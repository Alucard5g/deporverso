import React, { useState } from 'react';
import { FileText, Upload, Cpu, CheckCircle, RefreshCw, Send, Shield, Sparkles } from 'lucide-react';
import { MigrationTicket } from '../../types';
import { apiService } from '../../services/apiService';

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
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Ingesta Multideporte Inteligente
            </span>
            <span className="text-white/40 text-xs font-mono">3 Caminos de Carga</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Módulo de Ingesta Inteligente de Datos</h1>
          <p className="text-xs text-white/50 mt-1">
            Convierte documentos Word, Excel o PDF mediante Gemini AI o solicita migración asistida desde tu sistema anterior.
          </p>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveMode('ai-parse')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'ai-parse'
              ? 'bg-[#121212] border-cyan-500/50 shadow-lg'
              : 'bg-[#0a0a0a] border-white/10 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-sm">Camino 1: Gemini AI Parser</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-white/50">Pega el contenido de archivos Word/Excel/PDF para extraer equipos y calendarios automáticamente.</p>
        </button>

        <button
          onClick={() => setActiveMode('legacy')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'legacy'
              ? 'bg-[#121212] border-cyan-500/50 shadow-lg'
              : 'bg-[#0a0a0a] border-white/10 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-sm">Camino 2: Migración Asistida de Datos</span>
            <Upload className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-xs text-white/50">Solicita ayuda técnica para importar bases de datos antiguas, hojas de cálculo o archivos PDF.</p>
        </button>

        <button
          onClick={() => setActiveMode('manual')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeMode === 'manual'
              ? 'bg-[#121212] border-cyan-500/50 shadow-lg'
              : 'bg-[#0a0a0a] border-white/10 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-sm">Camino 3: Registro Manual</span>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs text-white/50">Creación tradicional paso a paso de categorías, equipos y programación de partidos.</p>
        </button>
      </div>

      {/* MODE 1: GEMINI AI PARSER */}
      {activeMode === 'ai-parse' && (
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Parsing Inteligente de Documentos con Gemini Flash
          </h2>

          <form onSubmit={handleAiParse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">
                Copiar y pegar texto de tu archivo Word, Excel o PDF de torneo:
              </label>
              <textarea
                rows={6}
                required
                placeholder="Ejemplo: LIGA REGIONAL DE BALONCESTO. Equipos: Grizzlies, Halcones, Titanes. Partido 1: Grizzlies vs Halcones el Sábado a las 10am en Coliseo 1..."
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
              {isParsing ? 'Procesando Documento con IA...' : 'Procesar con Gemini AI'}
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
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Registro Manual Asistido
          </h2>
          <p className="text-xs text-white/60">
            Puedes agregar directamente equipos y jugadores desde la pestaña "Equipos y Carnetización QR" del portal de tu liga.
          </p>
        </div>
      )}
    </div>
  );
};
