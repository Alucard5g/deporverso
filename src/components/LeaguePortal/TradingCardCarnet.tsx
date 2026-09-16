import React, { useState } from 'react';
import { QrCode, ShieldCheck, Zap, Award, Sparkles, CheckCircle2, UserCheck, Star, ChevronRight, Activity } from 'lucide-react';
import { Player, Team, Tenant, Sport } from '../../types';
import { getPlayerFullData, PlayerFullData } from '../../utils/playerStatsHelper';

interface TradingCardCarnetProps {
  player: Player;
  team?: Team;
  tenant?: Tenant;
  sport?: Sport;
  size?: 'sm' | 'md' | 'lg';
  showQrModal?: boolean;
  onOpenQrModal?: () => void;
  fullData?: PlayerFullData;
}

export const TradingCardCarnet: React.FC<TradingCardCarnetProps> = ({
  player,
  team,
  tenant,
  sport,
  size = 'md',
  onOpenQrModal,
  fullData: providedFullData
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const fullData = providedFullData || getPlayerFullData(player, team);
  const { general, stats } = fullData;
  const ovr = stats.rating_ovr;

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
  const nationalId = general.cedula;

  return (
    <div 
      className={`group relative perspective-1000 transition-all duration-300 ${
        size === 'sm' ? 'w-64 h-[400px]' : size === 'lg' ? 'w-80 h-[540px]' : 'w-72 h-[470px]'
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
                  #{player.jersey_number || general.role_description || '10'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border border-black" title="Carnet Federado Verificado">
                  ✓
                </div>
              </div>
            </div>

            {/* CENTER PORTRAIT PHOTO */}
            <div className="relative my-2 flex-1 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[190px] rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-black/40 to-black/80 shadow-2xl group-hover:scale-[1.02] transition-transform">
                <img 
                  src={photo} 
                  alt={player.full_name} 
                  className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
                />
                
                {/* Bottom Photo Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent"></div>

                {/* Team Badge Watermark */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <div 
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm"
                    style={{ backgroundColor: team?.primary_color || '#f59e0b' }}
                  >
                    {team?.name?.[0] || 'C'}
                  </div>
                  <span className="text-[10px] font-bold text-white max-w-[120px] truncate">
                    {team?.name || 'Club Oficial'}
                  </span>
                </div>

                {/* Official Verification Badge */}
                <div className="absolute top-2 right-2 bg-emerald-500/95 text-black text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3 h-3" /> HABILITADO
                </div>
              </div>
            </div>

            {/* PLAYER NAME BANNER */}
            <div className="relative z-10 text-center space-y-0.5">
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-y border-amber-400/40 py-1 rounded-lg">
                <h3 className="text-sm sm:text-base font-black text-amber-200 uppercase tracking-wide truncate drop-shadow-md px-1">
                  {player.full_name}
                </h3>
              </div>
              <p className="text-[10px] text-white/60 font-semibold truncate">
                {team?.name || tenant?.name || 'Liga Oficial'}
              </p>
            </div>

            {/* REAL GOALS & ASSISTS LIVE STATS BANNER */}
            <div className="relative z-10 grid grid-cols-3 gap-1 my-1.5 bg-black/80 px-2 py-1.5 rounded-xl border border-amber-400/30 text-center font-mono">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-0.5">
                  ⚽ {stats.goals_total}
                </span>
                <span className="text-[8px] text-white/50 uppercase font-bold">Goles</span>
              </div>
              <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-xs font-black text-cyan-400 flex items-center gap-0.5">
                  👟 {stats.assists_total}
                </span>
                <span className="text-[8px] text-white/50 uppercase font-bold">Asist.</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-amber-300 flex items-center gap-0.5">
                  ⏱️ {stats.matches_played}
                </span>
                <span className="text-[8px] text-white/50 uppercase font-bold">Partidos</span>
              </div>
            </div>

            {/* STATS ATTRIBUTES GRID */}
            <div className="relative z-10 grid grid-cols-6 gap-0.5 bg-black/60 p-1.5 rounded-xl border border-white/10 text-center text-[9px] font-mono">
              <div>
                <span className="text-amber-400 font-bold block">{stats.pace}</span>
                <span className="text-white/50 text-[7px] block">RIT</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block">{stats.shooting}</span>
                <span className="text-white/50 text-[7px] block">TIR</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block">{stats.passing}</span>
                <span className="text-white/50 text-[7px] block">PAS</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block">{stats.dribbling}</span>
                <span className="text-white/50 text-[7px] block">REG</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block">{stats.defense}</span>
                <span className="text-white/50 text-[7px] block">DEF</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block">{stats.physical}</span>
                <span className="text-white/50 text-[7px] block">FIS</span>
              </div>
            </div>

            {/* CARD FOOTER & ACTION BUTTONS */}
            <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <span className="text-white/50 font-mono text-[9px]">C.I: {nationalId}</span>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-amber-500/30 text-[9px]"
                  title="Girar Carnet (Ver QR y Barcode)"
                >
                  <QrCode className="w-3 h-3" /> QR Reverso
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* BACK SIDE - REVERSE OF COLLECTIBLE CARNET WITH QR & BARCODE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-amber-300 via-amber-600 to-yellow-900 shadow-2xl border border-amber-300/50">
          <div className="w-full h-full rounded-[22px] bg-[#09090d] relative overflow-hidden flex flex-col justify-between p-3.5 text-center border border-amber-400/30">
            
            {/* Header */}
            <div className="space-y-0.5">
              <span className="inline-block bg-amber-500 text-black font-black text-[9px] px-3 py-0.5 rounded-full uppercase tracking-widest">
                Credencial Digital Deporverso
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white truncate">{player.full_name}</h4>
              <p className="text-[10px] text-amber-400 font-mono">C.I. {nationalId} • #{player.jersey_number}</p>
            </div>

            {/* Large QR Code Display */}
            <div className="bg-white p-2 rounded-2xl border-4 border-amber-400 my-1 inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(player.qr_code || `DV-PL-${player.id}`)}`}
                alt="QR Carnet"
                className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain"
              />
            </div>

            {/* Player Quick Details */}
            <div className="space-y-1 text-left bg-black/70 p-2 rounded-xl border border-white/10 text-[9px] font-mono">
              <div className="flex justify-between">
                <span className="text-white/50">Club Oficial:</span>
                <span className="text-amber-300 font-bold truncate max-w-[140px]">{team?.name || 'Club Registrado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Goles / Asistencias:</span>
                <span className="text-emerald-400 font-bold">⚽ {stats.goals_total} | 👟 {stats.assists_total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Minutos Jugados:</span>
                <span className="text-cyan-400 font-bold">{stats.minutes_played}' ({stats.matches_played} PJ)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Ficha Médica:</span>
                <span className="text-emerald-400 font-bold">✓ VIGENTE 2026</span>
              </div>
            </div>

            {/* Return / Flip Back Button */}
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-[11px] rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1 mt-1"
            >
              Girar al Frente
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

