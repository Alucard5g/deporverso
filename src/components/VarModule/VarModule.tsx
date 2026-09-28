import React, { useState } from 'react';
import { Video, DollarSign, CheckCircle, AlertTriangle, Play, Shield, RefreshCw } from 'lucide-react';
import { Match, VarRequest } from '../../types';

interface VarModuleProps {
  tenantId: string;
  matches: Match[];
  varRequests: VarRequest[];
  onCreateVarRequest: (req: Omit<VarRequest, 'id' | 'created_at'>) => void;
  onUpdateVarStatus: (varId: string, status: VarRequest['status'], notes?: string) => void;
}

export const VarModule: React.FC<VarModuleProps> = ({
  tenantId,
  matches,
  varRequests,
  onCreateVarRequest,
  onUpdateVarStatus
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [cameraAngle, setCameraAngle] = useState('Ángulo 1: Línea de Gol / Área Chica');
  const [activeVarView, setActiveVarView] = useState<VarRequest | null>(varRequests[0] || null);
  const [refereeNotes, setRefereeNotes] = useState('');

  const handleRequestVar = (e: React.FormEvent) => {
    e.preventDefault();
    const match = matches.find(m => m.id === selectedMatchId);
    if (!match) return;

    onCreateVarRequest({
      tenant_id: tenantId,
      match_id: match.id,
      fee_amount: 12.00,
      status: 'APPROVED',
      camera_angle: cameraAngle,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      result_notes: 'Revisión VAR solicitada para jugada polémica.',
      match_title: `${match.home_team?.name || 'Local'} vs ${match.away_team?.name || 'Visitante'}`
    });

    alert('¡Servicio VAR A la Carta reservado ($12.00 USD)! Transmisión de baja latencia lista.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#080d1a]/80 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              VAR A la Carta ($12.00 USD)
            </span>
            <span className="text-slate-400 text-xs font-mono font-medium">Ultra Baja Latencia (Cloudflare R2)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sistema VAR A la Carta e Involucramiento de Árbitros</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Reserva de cámaras reglamentarias por partido o inclusión en suscripción Enterprise con repetición multi-ángulo.
          </p>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.08] text-center shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold mb-0.5">TARIFA POR REVISIÓN</span>
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400">$12.00 USD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VAR Video Review Screen */}
        <div className="lg:col-span-2 bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-400" />
              Monitor VAR de Campo de Juego
            </span>
            {activeVarView && (
              <span className="bg-cyan-500/15 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-cyan-500/30">
                {activeVarView.status}
              </span>
            )}
          </h3>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-white/[0.08] aspect-video flex items-center justify-center">
            {activeVarView?.video_url ? (
              <video
                src={activeVarView.video_url}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Video className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Selecciona o solicita una revisión VAR para cargar el video multiseñales.</p>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-200 border border-white/10">
              {cameraAngle}
            </div>
          </div>

          {/* Camera Angles Switcher (Segmented) */}
          <div className="deporverso-segmented-nav no-scrollbar flex items-center gap-1.5 overflow-x-auto text-xs">
            {['Ángulo 1: Línea de Gol', 'Ángulo 2: Táctica Superior', 'Ángulo 3: Lateral Banda'].map((angle) => (
              <button
                key={angle}
                onClick={() => setCameraAngle(angle)}
                className={`whitespace-nowrap transition-all cursor-pointer ${
                  cameraAngle === angle
                    ? 'deporverso-tab-pill-active font-semibold'
                    : 'deporverso-tab-pill-inactive'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>

          {/* Referee Decision Log Form */}
          {activeVarView && (
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.08] space-y-3 pt-3">
              <h4 className="font-semibold text-white text-xs">Dictamen del Árbitro VAR:</h4>
              <textarea
                rows={2}
                placeholder="Escribe la resolución de la jugada (Ej. Gol Valido / Fuera de Juego / Penalti Aprobado)..."
                value={refereeNotes}
                onChange={(e) => setRefereeNotes(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdateVarStatus(activeVarView.id, 'COMPLETED', refereeNotes || 'Decisión Confirmada por VAR');
                    alert('Dictamen VAR Guardado e integrado al acta oficial.');
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow-sm transition-all"
                >
                  Confirmar Decisión Arbitral
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Request VAR Form & Active Log */}
        <div className="space-y-6">
          <div className="bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Reservar VAR A la Carta ($12)
            </h3>

            <form onSubmit={handleRequestVar} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Partido a Solicitar</label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-medium cursor-pointer"
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#090e1a] text-slate-200">
                      {m.home_team?.name} vs {m.away_team?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Pagar $12.00 USD & Iniciar VAR
              </button>
            </form>
          </div>

          <div className="bg-[#080d1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-xs sm:text-sm">Revisiones VAR Registradas</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {varRequests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveVarView(r)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    activeVarView?.id === r.id ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <p className="font-semibold text-white">{r.match_title || 'Encuentro VAR'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.result_notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
