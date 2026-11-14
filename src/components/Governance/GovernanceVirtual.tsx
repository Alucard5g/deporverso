import React, { useState, useEffect } from 'react';
import { MessageSquare, Video, CheckCircle, Vote, Send, Users, Shield, Clock, FileCheck2 } from 'lucide-react';
import { Tenant } from '../../types';
import { CINEMATIC_ASSETS } from '../../data/cinematicAssets';

interface GovernanceVirtualProps {
  tenant: Tenant;
}

interface ResolutionItem {
  id: string;
  title: string;
  summary: string;
  yes: number;
  no: number;
  userVote?: 'YES' | 'NO' | null;
}

interface BroadcastLogItem {
  id: string;
  message: string;
  timestamp: string;
  recipients: number;
}

const DEFAULT_RESOLUTIONS: ResolutionItem[] = [
  {
    id: 'res-reglamento-2026',
    title: 'Aprobación del Reglamento Oficial Temporada 2026',
    summary: 'Homologación de carnets QR digitales, sanción automática por doble amarilla y horarios oficiales.',
    yes: 14,
    no: 2,
    userVote: null,
  },
  {
    id: 'res-presupuesto-var',
    title: 'Presupuesto Colegio de Árbitros y Cabina VAR Móvil',
    summary: 'Asignación de $12 USD por encuentro para cobertura multicámara en cuartos de final y finales.',
    yes: 11,
    no: 4,
    userVote: null,
  },
  {
    id: 'res-seguro-deportivo',
    title: 'Fondo Solidario de Atención Médica en Cancha',
    summary: 'Reserva del 5% de taquilla barrial para botiquín trauma, camilla y traslados de emergencia.',
    yes: 16,
    no: 1,
    userVote: null,
  },
];

export const GovernanceVirtual: React.FC<GovernanceVirtualProps> = ({ tenant }) => {
  const safeTenant = tenant || { name: 'Liga Barrial', slug: 'liga-barrial' };
  const [jitsiRoom] = useState(`Deporverso-Asamblea-${safeTenant.slug}`);
  const [inAssembly, setInAssembly] = useState(false);

  const storageKey = `deporverso_gov_votes_${safeTenant.slug}`;
  const [resolutions, setResolutions] = useState<ResolutionItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage failure
    }
    return DEFAULT_RESOLUTIONS;
  });

  const [selectedResId, setSelectedResId] = useState<string>(DEFAULT_RESOLUTIONS[0].id);
  const [waMessage, setWaMessage] = useState('');
  const [waSent, setWaSent] = useState(false);
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastLogItem[]>([
    {
      id: 'init-1',
      message: 'Recordatorio: Cierre de inscripciones y verificación de carnets QR este viernes 19:00.',
      timestamp: 'Hace 2h',
      recipients: 18,
    },
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(resolutions));
    } catch {
      // ignore storage failure
    }
  }, [resolutions, storageKey]);

  const activeResolution = resolutions.find(r => r.id === selectedResId) || resolutions[0];
  const totalVotes = activeResolution.yes + activeResolution.no;
  const yesPct = totalVotes > 0 ? Math.round((activeResolution.yes / totalVotes) * 100) : 0;
  const noPct = 100 - yesPct;

  const handleVote = (approve: boolean) => {
    if (activeResolution.userVote) return;
    setResolutions(prev =>
      prev.map(r =>
        r.id === activeResolution.id
          ? {
              ...r,
              yes: approve ? r.yes + 1 : r.yes,
              no: !approve ? r.no + 1 : r.no,
              userVote: approve ? 'YES' : 'NO',
            }
          : r
      )
    );
  };

  const handleSendWaNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    const nowTime = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
    setBroadcastHistory(prev => [
      {
        id: `msg-${Date.now()}`,
        message: waMessage.trim(),
        timestamp: nowTime,
        recipients: 24,
      },
      ...prev.slice(0, 4),
    ]);
    setWaSent(true);
    setWaMessage('');
    setTimeout(() => setWaSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Cinematic Header */}
      <div className="cine-stage-frame min-h-[190px] p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-end">
        <img
          src={CINEMATIC_ASSETS.clubTunnel}
          alt="Túnel directivo del estadio - Gobernanza Virtual"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="cine-scrim-hero" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/35 font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Gobernanza Virtual & Quórum Digital
              </span>
              <span className="text-slate-300 text-xs font-mono">{safeTenant.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Asambleas de Delegados & Votaciones en Vivo
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/85 mt-1 max-w-2xl">
              Sesiones directivas integradas con Jitsi Meet, escrutinio inmutable de resoluciones y difusión oficial a capitanes por WhatsApp.
            </p>
          </div>

          <div className="bg-black/65 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-xs tabular-nums shrink-0">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-mono">Resoluciones en Orden del Día</span>
            <strong className="text-white font-black text-sm">{resolutions.length} Puntos Activos • Quórum 100%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jitsi Assembly Module */}
        <div className="cine-surface rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              Asamblea Virtual de Delegados (Jitsi SDK)
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              inAssembly
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}>
              {inAssembly ? 'SALA CONECTADA' : 'SALA EN ESPERA'}
            </span>
          </div>

          {!inAssembly ? (
            <div className="bg-black/50 p-6 rounded-xl border border-white/10 text-center space-y-4">
              <Users className="w-10 h-10 text-cyan-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Sala Oficial: {jitsiRoom}</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Reunión ejecutiva de dirigentes y delegados para resolver apelaciones disciplinarias, aprobar calendarios y auditar presupuestos.
                </p>
              </div>

              <button
                onClick={() => setInAssembly(true)}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Unirse a la Asamblea Virtual
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-black border border-cyan-500/30 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
                <iframe
                  src={`https://meet.jit.si/${jitsiRoom}`}
                  className="w-full h-full border-none"
                  allow="camera; microphone; display-capture"
                  title="Jitsi Assembly"
                />
              </div>

              <button
                onClick={() => setInAssembly(false)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer border border-white/10 transition-colors"
              >
                Salir de la Asamblea
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp & Voting Module */}
        <div className="space-y-6">
          {/* Active Voting Box */}
          <div className="cine-surface rounded-2xl p-6 space-y-4 tabular-nums">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-amber-400" />
                Votación Oficial de Dirigencia
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{totalVotes} votos emitidos</span>
            </div>

            {/* Resolution Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {resolutions.map((res, idx) => (
                <button
                  key={res.id}
                  onClick={() => setSelectedResId(res.id)}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border text-left transition-colors cursor-pointer ${
                    selectedResId === res.id
                      ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block font-mono text-[9px] uppercase opacity-75">Punto #{idx + 1}</span>
                  <span className="line-clamp-1">{res.title}</span>
                </button>
              ))}
            </div>

            <div className="bg-black/55 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-amber-500/15 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/25 uppercase tracking-wider">
                  {activeResolution.userVote ? 'VOTO REGISTRADO' : 'VOTACIÓN EN CURSO'}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {yesPct}% Aprobación
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{activeResolution.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{activeResolution.summary}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${yesPct}%` }} />
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${noPct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>A favor: {activeResolution.yes} ({yesPct}%)</span>
                  <span>En contra: {activeResolution.no} ({noPct}%)</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleVote(true)}
                  disabled={Boolean(activeResolution.userVote)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    activeResolution.userVote
                      ? activeResolution.userVote === 'YES'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-black/40 text-white/30 border border-white/5'
                      : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  }`}
                >
                  A favor ({activeResolution.yes})
                </button>
                <button
                  onClick={() => handleVote(false)}
                  disabled={Boolean(activeResolution.userVote)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    activeResolution.userVote
                      ? activeResolution.userVote === 'NO'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-black/40 text-white/30 border border-white/5'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                  }`}
                >
                  En contra ({activeResolution.no})
                </button>
              </div>

              {activeResolution.userVote && (
                <p className="text-[11px] text-emerald-400 text-center font-semibold pt-1 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Voto {activeResolution.userVote === 'YES' ? 'A FAVOR' : 'EN CONTRA'} guardado localmente en el acta de sesión.</span>
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Broadcast Module */}
          <div className="cine-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Notificador WhatsApp a Capitanes (Baileys)
            </h3>

            <form onSubmit={handleSendWaNotification} className="space-y-3">
              <textarea
                rows={2}
                placeholder="Escribe la convocatoria o citación urgente para envío masivo por WhatsApp..."
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full bg-black/55 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {waSent ? '¡Comunicado Registrado para Envío!' : 'Enviar Comunicado Masivo WhatsApp'}
              </button>
            </form>

            {/* Broadcast Log */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Historial de Comunicados Despachados
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {broadcastHistory.map(item => (
                  <div key={item.id} className="bg-black/45 border border-white/10 rounded-xl p-2.5 text-xs flex items-start justify-between gap-3">
                    <p className="text-slate-200 leading-snug">{item.message}</p>
                    <div className="text-right shrink-0 font-mono text-[10px] text-slate-400 tabular-nums">
                      <span className="flex items-center gap-1 justify-end"><Clock className="w-2.5 h-2.5" /> {item.timestamp}</span>
                      <span className="text-emerald-400 block">{item.recipients} capitanes</span>
                    </div>
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

