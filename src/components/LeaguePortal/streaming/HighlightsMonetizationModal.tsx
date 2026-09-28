import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Play, 
  Lock, 
  Unlock, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Share2, 
  X, 
  TrendingUp, 
  Award,
  Video
} from 'lucide-react';
import { Match, Team } from '../../../types';

interface HighlightClip {
  id: string;
  title: string;
  minute: number;
  type: 'goal' | 'var' | 'save' | 'skill';
  videoThumbnail: string;
  previewUrl: string;
  duration: string;
  priceUsd: number;
  purchased: boolean;
  clubName: string;
}

interface HighlightsMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  tenantName: string;
}

export const HighlightsMonetizationModal: React.FC<HighlightsMonetizationModalProps> = ({
  isOpen,
  onClose,
  match,
  homeTeam,
  awayTeam,
  tenantName
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'match_pass' | 'season'>('match_pass');
  const [selectedClip, setSelectedClip] = useState<HighlightClip | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(46.50);

  const [clips, setClips] = useState<HighlightClip[]>([
    {
      id: 'clip-1',
      title: "Golazo al ángulo de tiro libre - Tiro perfecto",
      minute: 23,
      type: 'goal',
      videoThumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60',
      previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: '0:28',
      priceUsd: 0.99,
      purchased: false,
      clubName: homeTeam.name
    },
    {
      id: 'clip-2',
      title: "Contragolpe letal y definición cruzada",
      minute: 58,
      type: 'goal',
      videoThumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60',
      previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: '0:35',
      priceUsd: 0.99,
      purchased: false,
      clubName: awayTeam.name
    },
    {
      id: 'clip-3',
      title: "Cabezazo heroico de tiro de esquina",
      minute: 68,
      type: 'goal',
      videoThumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=500&auto=format&fit=crop&q=60',
      previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: '0:22',
      priceUsd: 0.99,
      purchased: false,
      clubName: homeTeam.name
    },
    {
      id: 'clip-4',
      title: "Revisión VAR: Fuera de juego milimétrico en el área",
      minute: 72,
      type: 'var',
      videoThumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=60',
      previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: '0:45',
      priceUsd: 0.99,
      purchased: false,
      clubName: 'Árbitro Oficial'
    }
  ]);

  if (!isOpen) return null;

  const handlePurchase = (itemKey: string, amount: number) => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setUnlockedItems(prev => [...prev, itemKey]);
      setTotalRevenue(prev => Number((prev + amount).toFixed(2)));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090e1a] border border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 text-white space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Monetización de Highlights & Clips IA (Tarea 2)</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Pay-Per-View Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">Genera ingresos para los clubes y la liga mediante micro-pagos de clips HD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard de Ingresos en Vivo del Partido */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-amber-950/40 via-black to-slate-900 rounded-2xl border border-amber-500/30">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Recaudación en Vivo</span>
            <span className="text-xl font-black text-white font-mono">${totalRevenue.toFixed(2)} USD</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">38 ventas hoy</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Para los Clubes (70%)</span>
            <span className="text-xl font-black text-emerald-300 font-mono">${(totalRevenue * 0.7).toFixed(2)} USD</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Reparto automático</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Para la Liga (30%)</span>
            <span className="text-xl font-black text-cyan-300 font-mono">${(totalRevenue * 0.3).toFixed(2)} USD</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Fondo arbitral y VAR</span>
          </div>
        </div>

        {/* Planes de Monetización */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-200">Planes Disponibles para Hinchas & Jugadores:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Plan 1: Clip Individual */}
            <div
              onClick={() => setSelectedPlan('single')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'single'
                  ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white">Clip de Jugada HD</span>
                <span className="font-mono text-amber-400 font-black">$0.99</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Descarga en MP4 con el escudo oficial del club para compartir en Instagram/TikTok.
              </p>
            </div>

            {/* Plan 2: Pase Partido Completo (Recomendado) */}
            <div
              onClick={() => setSelectedPlan('match_pass')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative ${
                selectedPlan === 'match_pass'
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400 shadow-xl shadow-amber-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider">
                MÁS POPULAR
              </span>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white">Pase VIP Partido</span>
                <span className="font-mono text-amber-400 font-black">$1.99</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Acceso a todos los clips generados por IA, repetición 4K y revisión multicámara del VAR.
              </p>
            </div>

            {/* Plan 3: Temporada Completa */}
            <div
              onClick={() => setSelectedPlan('season')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'season'
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white">Pase Temporada</span>
                <span className="font-mono text-cyan-400 font-black">$9.99</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Todos los partidos y resúmenes del torneo para hinchas locales y residentes en el exterior.
              </p>
            </div>
          </div>
        </div>

        {/* Catálogo de Jugadas Clave / Clips con IA */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Clips Generados Automáticamente por IA:</span>
            <span className="text-[10px] text-cyan-400 font-mono">Detección automática por marcas de tiempo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            {clips.map(clip => {
              const isUnlocked = unlockedItems.includes(clip.id) || unlockedItems.includes('match_pass') || unlockedItems.includes('season');
              return (
                <div
                  key={clip.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                    <img src={clip.videoThumbnail} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 text-[9px] font-mono text-white rounded">
                      {clip.duration}
                    </span>
                    <span className="absolute top-1 left-1 bg-rose-600 px-1 py-0.2 text-[8px] font-black text-white rounded uppercase">
                      {clip.minute}'
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{clip.title}</h5>
                    <span className="text-[10px] text-slate-400 block truncate">{clip.clubName}</span>

                    <div className="flex items-center justify-between mt-1">
                      {isUnlocked ? (
                        <a
                          href={clip.previewUrl}
                          download={`deporverso_clip_${clip.id}.mp4`}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Descargar HD
                        </a>
                      ) : (
                        <button
                          onClick={() => handlePurchase(clip.id, clip.priceUsd)}
                          disabled={isProcessingPayment}
                          className="px-2.5 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Lock className="w-3 h-3" /> Desbloquear (${clip.priceUsd})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Checkout Button */}
        <div className="bg-black/60 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {selectedPlan === 'single' ? 'Clip Individual ($0.99)' : selectedPlan === 'match_pass' ? 'Pase VIP Partido Completo ($1.99)' : 'Pase Temporada ($9.99)'}
              </span>
              <span className="text-[10px] text-slate-400">Paga con Deuna, Tarjeta de Débito/Crédito o Billetera DeporVerso</span>
            </div>
          </div>

          <button
            onClick={() => handlePurchase(selectedPlan, selectedPlan === 'single' ? 0.99 : selectedPlan === 'match_pass' ? 1.99 : 9.99)}
            disabled={isProcessingPayment || (selectedPlan === 'match_pass' && unlockedItems.includes('match_pass'))}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessingPayment ? (
              <span>Procesando pago seguro...</span>
            ) : unlockedItems.includes(selectedPlan) ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Plan Adquirido ✓</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                <span>Adquirir Pase Ahora</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
