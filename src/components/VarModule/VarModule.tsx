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
      <div className="bg-[#0a0a0a] p-7 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              VAR A la Carta ($12.00 USD)
            </span>
            <span className="text-[#A0A0A0] text-xs font-mono font-normal">Ultra Baja Latencia (Cloudflare R2)</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Sistema VAR A la Carta e Involucramiento de Árbitros</h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-1">
            Reserva de cámaras reglamentarias por partido o inclusión en suscripción Enterprise con repetición multi-ángulo.
          </p>
        </div>

        <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0] block font-bold mb-1">TARIFA POR REVISIÓN</span>
          <span className="text-3xl font-black text-cyan-400">$12.00 USD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VAR Video Review Screen */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              Monitor VAR de Campo de Juego
            </span>
            {activeVarView && (
              <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/20">
                {activeVarView.status}
              </span>
            )}
          </h3>

          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/10 aspect-video flex items-center justify-center">
            {activeVarView?.video_url ? (
              <video
                src={activeVarView.video_url}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-[#A0A0A0]">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-normal">Selecciona o solicita una revisión VAR para cargar el video multiseñales.</p>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-[#0a0a0a]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/10">
              {cameraAngle}
            </div>
          </div>

          {/* Camera Angles Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['Ángulo 1: Línea de Gol', 'Ángulo 2: Táctica Superior', 'Ángulo 3: Lateral Banda'].map((angle) => (
              <button
                key={angle}
                onClick={() => setCameraAngle(angle)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  cameraAngle === angle
                    ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                    : 'bg-[#121212] text-[#A0A0A0] border border-white/10 hover:text-white font-medium'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>

          {/* Referee Decision Log Form */}
          {activeVarView && (
            <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 space-y-3 pt-4">
              <h4 className="font-bold text-white text-xs">Dictamen del Árbitro VAR:</h4>
              <textarea
                rows={2}
                placeholder="Escribe la resolución de la jugada (Ej. Gol Valido / Fuera de Juego / Penalti Aprobado)..."
                value={refereeNotes}
                onChange={(e) => setRefereeNotes(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdateVarStatus(activeVarView.id, 'COMPLETED', refereeNotes || 'Decisión Confirmada por VAR');
                    alert('Dictamen VAR Guardado e integrado al acta oficial.');
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  Confirmar Decisión Arbitral
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Request VAR Form & Active Log */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Reservar VAR A la Carta ($12)
            </h3>

            <form onSubmit={handleRequestVar} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Partido a Solicitar</label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
                      {m.home_team?.name} vs {m.away_team?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Pagar $12.00 USD & Iniciar VAR
              </button>
            </form>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white text-sm">Revisiones VAR Registradas</h3>
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {varRequests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveVarView(r)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    activeVarView?.id === r.id ? 'bg-[#121212] border-cyan-500/50' : 'bg-[#080808] border-white/10 hover:bg-white/5'
                  }`}
                >
                  <p className="font-bold text-white">{r.match_title || 'Encuentro VAR'}</p>
                  <p className="text-[11px] text-[#A0A0A0] font-normal mt-0.5">{r.result_notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
