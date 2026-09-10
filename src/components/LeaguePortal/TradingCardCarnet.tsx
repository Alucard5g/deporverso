import React, { useState } from 'react';
import { QrCode, ShieldCheck, Zap, Award, Sparkles, CheckCircle2, UserCheck, Star, ChevronRight } from 'lucide-react';
import { Player, Team, Tenant, Sport } from '../../types';

interface TradingCardCarnetProps {
  player: Player;
  team?: Team;
  tenant?: Tenant;
  sport?: Sport;
  size?: 'sm' | 'md' | 'lg';
  showQrModal?: boolean;
  onOpenQrModal?: () => void;
}

export const TradingCardCarnet: React.FC<TradingCardCarnetProps> = ({
  player,
  team,
  tenant,
  sport,
  size = 'md',
  onOpenQrModal
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Derive OVR score deterministically from player name/id for collectible feel
  const getPlayerOvr = (id: string, jersey?: number) => {
    let charSum = 0;
    for (let i = 0; i < id.length; i++) {
      charSum += id.charCodeAt(i);
    }
    const base = 82 + (charSum % 12);
    return Math.min(96, Math.max(78, base + ((jersey || 10) % 3)));
  };

  const ovr = getPlayerOvr(player.id, player.jersey_number);

  // Derive position abbreviation
  const getPosShort = (pos?: string) => {
    if (!pos) return 'JUG';
    const p = pos.toUpperCase();
    if (p.includes('MEDI')) return 'MED';
    if (p.includes('DELA') || p.includes('EXTR')) return 'DEL';
    if (p.includes('DEFE') || p.includes('LATE')) return 'DEF';
    if (p.includes('PORT') || p.includes('ARQU')) return 'POR';
    if (p.includes('PÍV') || p.includes('PIV')) return 'PIV';
    if (p.includes('ALER')) return 'ALE';
    if (p.includes('BASE')) return 'BAS';
    if (p.includes('COLO')) return 'COL';
    if (p.includes('SERV')) return 'SER';
    if (p.includes('VOLA')) return 'VOL';
    return p.substring(0, 3);
  };

  // Default player portrait fallback based on ID index
  const getDefaultPortrait = (id: string) => {
    const photos = [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'
    ];
    let num = 0;
    for (let i = 0; i < id.length; i++) num += id.charCodeAt(i);
    return photos[num % photos.length];
  };

  const photo = player.photo_url || getDefaultPortrait(player.id);
  const posAbbr = getPosShort(player.position);
  const nationalId = `17${(player.id.charCodeAt(0) * 12345).toString().slice(0, 8)}-${player.id.charCodeAt(player.id.length - 1) % 9}`;

  // Card theme styling
  const isGold = ovr >= 86;

  return (
    <div 
      className={`group relative perspective-1000 transition-all duration-300 ${
        size === 'sm' ? 'w-64 h-[380px]' : size === 'lg' ? 'w-80 h-[520px]' : 'w-72 h-[450px]'
      }`}
    >
      {/* CARD CONTAINER WITH FLIP ROTATION */}
      <div 
        className={`w-full h-full duration-700 transform-style-3d relative rounded-3xl transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE - COLLECTIBLE TRADING CARD */}
        <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-amber-200 via-amber-500 to-yellow-800 shadow-[0_10px_30px_rgba(245,158,11,0.25)] border border-amber-300/50">
          {/* Card Frame Inner Box */}
          <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#15151a] via-[#0d0d12] to-[#050508] relative overflow-hidden flex flex-col justify-between p-3.5 border border-amber-400/30">
            
            {/* Holographic glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* TOP HEADER: OVR RATING, POSITION & TEAM LOGO */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-amber-300 to-yellow-600 text-black p-1.5 rounded-xl shadow-lg border border-amber-200 text-center min-w-[48px]">
                  <span className="block text-xl font-black leading-none font-mono tracking-tighter">{ovr}</span>
                  <span className="block text-[9px] font-extrabold uppercase tracking-widest text-black/80">{posAbbr}</span>
                </div>
                <div className="text-left">
                  <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {player.position || 'Jugador'}
                  </span>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-0.5">
                    {sport?.name || tenant?.sport_code || 'Deporverso'}
                  </p>
                </div>
              </div>

              {/* Jersey Number Shield */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-amber-400/50 flex items-center justify-center font-black text-amber-400 font-mono text-lg shadow-inner">
                  #{player.jersey_number || '10'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border border-black">
                  ✓
                </div>
              </div>
            </div>

            {/* CENTER PORTRAIT PHOTO */}
            <div className="relative my-2 flex-1 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[220px] rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-black/40 to-black/80 shadow-2xl group-hover:scale-[1.02] transition-transform">
                <img 
                  src={photo} 
                  alt={player.full_name} 
                  className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
                />
                
                {/* Bottom Photo Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent"></div>

                {/* Team Badge Watermark */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-black text-black">
                    {team?.name?.[0] || 'T'}
                  </div>
                  <span className="text-[10px] font-bold text-white max-w-[120px] truncate">
                    {team?.name || 'Equipo Oficial'}
                  </span>
                </div>

                {/* Official Verification Badge */}
                <div className="absolute top-2 right-2 bg-emerald-500/90 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3 h-3" /> VERIFICADO
                </div>
              </div>
            </div>

            {/* PLAYER NAME BANNER */}
            <div className="relative z-10 text-center space-y-1">
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-y border-amber-400/40 py-1 rounded-lg">
                <h3 className="text-base font-black text-amber-200 uppercase tracking-wide truncate drop-shadow-md">
                  {player.full_name}
                </h3>
              </div>
              <p className="text-[10px] text-white/60 font-semibold truncate">
                {tenant?.name || 'Liga Barrial Oficial'}
              </p>
            </div>

            {/* STATS ATTRIBUTES GRID */}
            <div className="relative z-10 grid grid-cols-3 gap-1 my-2 bg-black/60 p-2 rounded-xl border border-white/10 text-center text-[10px] font-mono">
              <div>
                <span className="text-amber-400 font-bold">88</span> <span className="text-white/50">RIT</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">85</span> <span className="text-white/50">TIR</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">84</span> <span className="text-white/50">PAS</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">89</span> <span className="text-white/50">REG</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">76</span> <span className="text-white/50">DEF</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">82</span> <span className="text-white/50">FIS</span>
              </div>
            </div>

            {/* CARD FOOTER & ACTION BUTTONS */}
            <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <span className="text-white/40 font-mono">C.I: {nationalId}</span>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  title="Girar Carnet (Ver QR y Barcode)"
                >
                  <QrCode className="w-3 h-3" /> QR / Barcode
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* BACK SIDE - REVERSE OF COLLECTIBLE CARNET WITH QR & BARCODE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-amber-300 via-amber-600 to-yellow-900 shadow-2xl border border-amber-300/50">
          <div className="w-full h-full rounded-[22px] bg-[#09090d] relative overflow-hidden flex flex-col justify-between p-4 text-center border border-amber-400/30">
            
            {/* Header */}
            <div className="space-y-1">
              <span className="inline-block bg-amber-500 text-black font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest">
                Credencial Digital Deporverso
              </span>
              <h4 className="text-sm font-black text-white">{player.full_name}</h4>
              <p className="text-[10px] text-amber-400 font-bold">C.I. {nationalId}</p>
            </div>

            {/* Large QR Code Display */}
            <div className="bg-white p-3 rounded-2xl border-4 border-amber-400 my-2 inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(player.qr_code)}`}
                alt="QR Carnet"
                className="w-32 h-32 mx-auto object-contain"
              />
            </div>

            <div className="space-y-1 text-left bg-black/60 p-2.5 rounded-xl border border-white/10 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-white/50">Código QR:</span>
                <span className="text-cyan-400 font-bold">{player.qr_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Equipo:</span>
                <span className="text-white font-bold">{team?.name || 'Oficial'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Organización:</span>
                <span className="text-white font-bold">{tenant?.name || 'Liga'}</span>
              </div>
            </div>

            {/* Return / Flip Back Button */}
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              Girar al Frente
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
