import React, { useState } from 'react';
import { Heart, Mail, User, CheckCircle, Share2, Sparkles, X, Bell, Trophy, ShieldCheck } from 'lucide-react';

interface FanAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (fanData: { name: string; email: string }) => void;
  actionTitle?: string;
}

export const FanAuthModal: React.FC<FanAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Interactuar y Compartir Contenido'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegistered(true);
      setTimeout(() => {
        onSuccess({ name, email });
        onClose();
        setIsRegistered(false);
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e0e0e] border border-cyan-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Heart className="w-8 h-8 fill-cyan-400/20" />
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block tracking-wider">
            Comunidad de Aficionados Deporverso
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            Registro Rápido de Fanático
          </h2>
          <p className="text-xs text-white/60">
            Para <strong className="text-cyan-400">{actionTitle}</strong>, suscríbete gratuitamente con tu correo electrónico.
          </p>
        </div>

        {isRegistered ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2 text-emerald-400 animate-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 mx-auto" />
            <h3 className="font-extrabold text-base text-white">¡Bienvenido a la Comunidad!</h3>
            <p className="text-xs text-emerald-300">
              Tu acceso ha sido activado. Ahora puedes compartir, votar y comentar en todas las ligas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">
                Tu Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Cevallos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="tu.correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-[11px] text-white/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Beneficios de Registro de Aficionado:</span>
              </div>
              <ul className="list-disc list-inside text-[10px] space-y-0.5 text-white/50 pl-1">
                <li>Compartir resultados y estadísticas en WhatsApp/Redes</li>
                <li>Votar por el Jugador del Partido y comentar crónicas IA</li>
                <li>Recibir alertas de marcadores en tiempo real</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando Aficionado...' : 'Activar Cuenta de Aficionado'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
