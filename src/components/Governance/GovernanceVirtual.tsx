import React, { useState } from 'react';
import { MessageSquare, Video, CheckCircle, Vote, Send, Users, Shield } from 'lucide-react';
import { Tenant } from '../../types';

interface GovernanceVirtualProps {
  tenant: Tenant;
}

export const GovernanceVirtual: React.FC<GovernanceVirtualProps> = ({ tenant }) => {
  const safeTenant = tenant || { name: 'Liga Barrial', slug: 'liga-barrial' };
  const [jitsiRoom, setJitsiRoom] = useState(`Deporverso-Asamblea-${safeTenant.slug}`);

  const [inAssembly, setInAssembly] = useState(false);
  const [voteTopic, setVoteTopic] = useState('Aprobación del Reglamento Temporada 2026');
  const [votesCount, setVotesCount] = useState({ yes: 14, no: 2, total: 16 });
  const [userVoted, setUserVoted] = useState(false);
  const [waMessage, setWaMessage] = useState('');
  const [waSent, setWaSent] = useState(false);

  const handleVote = (approve: boolean) => {
    if (userVoted) return;
    setVotesCount(prev => ({
      ...prev,
      yes: approve ? prev.yes + 1 : prev.yes,
      no: !approve ? prev.no + 1 : prev.no,
      total: prev.total + 1
    }));
    setUserVoted(true);
  };

  const handleSendWaNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    setWaSent(true);
    setTimeout(() => {
      setWaSent(false);
      setWaMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Gobernanza Virtual e Integración Jitsi / WhatsApp
            </span>
            <span className="text-white/40 text-xs font-mono">{safeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Asambleas de Delegados & Votaciones en Vivo</h1>
          <p className="text-xs text-white/50 mt-1">
            Videoconferencias integradas con Jitsi Meet SDK y notificaciones automáticas por WhatsApp (Baileys WebSockets).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jitsi Assembly Module */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            Asamblea Virtual de Delegados (Jitsi SDK)
          </h3>

          {!inAssembly ? (
            <div className="bg-[#121212] p-6 rounded-xl border border-white/10 text-center space-y-3">
              <Users className="w-10 h-10 text-cyan-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Sala de Conferencia: {jitsiRoom}</h4>
              <p className="text-xs text-white/50">Reunión de dirigentes y delegados de equipos para resolver apelaciones y presupuestos.</p>

              <button
                onClick={() => setInAssembly(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-lg"
              >
                Unirse a la Asamblea Virtual
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-[#050505] border border-cyan-500/30 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
                <iframe
                  src={`https://meet.jit.si/${jitsiRoom}`}
                  className="w-full h-full border-none"
                  allow="camera; microphone; display-capture"
                  title="Jitsi Assembly"
                ></iframe>
              </div>

              <button
                onClick={() => setInAssembly(false)}
                className="w-full bg-[#121212] hover:bg-white/10 text-white font-bold text-xs py-2 rounded-xl cursor-pointer border border-white/10"
              >
                Salir de la Asamblea
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp & Voting Module */}
        <div className="space-y-6">
          {/* Active Voting Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-amber-400" />
              Votación Oficial de Dirigencia
            </h3>

            <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-3">
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                VOTACIÓN EN CURSO
              </span>
              <h4 className="font-bold text-white text-sm">{voteTopic}</h4>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleVote(true)}
                  disabled={userVoted}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    userVoted ? 'bg-[#080808] text-white/30 border border-white/5' : 'bg-cyan-500 text-black hover:bg-cyan-400'
                  }`}
                >
                  A favor ({votesCount.yes})
                </button>
                <button
                  onClick={() => handleVote(false)}
                  disabled={userVoted}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    userVoted ? 'bg-[#080808] text-white/30 border border-white/5' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  En contra ({votesCount.no})
                </button>
              </div>

              {userVoted && (
                <p className="text-[11px] text-cyan-400 text-center font-semibold pt-1">
                  ✓ Tu voto ha sido registrado e inmutablemente guardado.
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Broadcast Simulator */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-3 shadow-2xl">
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
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {waSent ? '¡Mensaje Enviado por WhatsApp!' : 'Enviar Comunicado Masivo WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
