import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Shield, 
  Award, 
  Users, 
  Calendar, 
  MapPin, 
  Flame, 
  QrCode, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  TrendingUp, 
  Activity, 
  ExternalLink, 
  Lock, 
  CreditCard, 
  Play, 
  Download, 
  Share2, 
  X,
  Target,
  Zap,
  FileText
} from 'lucide-react';
import { 
  DEPORVERSO_CLUB_DATA, 
  DEPORVERSO_FUTBOL_PLAYERS, 
  DEPORVERSO_BASKET_PLAYERS, 
  DEPORVERSO_MATCHES, 
  DeporversoPlayer,
  ClubMatch 
} from '../../data/deporversoClubData';

interface ClubDeporversoShowcaseProps {
  onUnlockFullPortal?: () => void;
  onOpenCheckout?: () => void;
  isUnlocked?: boolean;
  userEmail?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenStepTour?: (stepIndex?: number) => void;
}

export const ClubDeporversoShowcase: React.FC<ClubDeporversoShowcaseProps> = ({
  onUnlockFullPortal,
  onOpenCheckout,
  isUnlocked = false,
  userEmail = '',
  onNavigateTab,
  onOpenStepTour
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<'FUTBOL' | 'BALONCESTO'>('FUTBOL');
  const [selectedPlayer, setSelectedPlayer] = useState<DeporversoPlayer | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<string | null>(null);

  const club = DEPORVERSO_CLUB_DATA;

  // Active players list based on discipline
  const currentPlayers = useMemo(() => {
    const list = activeDiscipline === 'FUTBOL' ? DEPORVERSO_FUTBOL_PLAYERS : DEPORVERSO_BASKET_PLAYERS;
    return list.filter(player => {
      const matchSearch = player.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          player.position.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          player.nickname.toLowerCase().includes(searchFilter.toLowerCase());
      const matchPos = positionFilter === 'ALL' || player.positionCategory === positionFilter;
      return matchSearch && matchPos;
    });
  }, [activeDiscipline, searchFilter, positionFilter]);

  // Discipline matches
  const currentMatches = useMemo(() => {
    return DEPORVERSO_MATCHES.filter(m => m.discipline === activeDiscipline);
  }, [activeDiscipline]);

  const handleShareCarnet = (player: DeporversoPlayer) => {
    const shareText = `Carnet Oficial ${club.shortName} · ${player.name} (#${player.dorsal}) · Verificado por CIG DeporVerso`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(`✓ Enlace de carnet copiado: ${player.name}`);
      setTimeout(() => setShowShareToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black">
      
      {/* ================================================================ */}
      {/* BANNER PRINCIPAL PARA LEADS: DEMOSTRACIÓN OFICIAL DEL CLUB        */}
      {/* ================================================================ */}
      <section className="relative w-full border-b border-cyan-500/30 bg-gradient-to-r from-[#030919] via-[#091533] to-[#030919] px-4 py-3.5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">Modo Demo Oficial</span>
                <span className="text-white/30">/</span>
                <span className="text-white font-bold">Club Deportivo Deporverso</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {userEmail ? <span className="font-semibold text-white">{userEmail} · </span> : ''}
                Este usuario solo accede a la demo de la Liga Pichincha y el Club Deporverso. Los usuarios que paguen la suscripción acceden al portal de Deporverso completo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('league') : null}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Ver cómo compite Club Deporverso en la Liga Barrial Pichincha"
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Demo Liga Pichincha</span>
            </button>

            {!isUnlocked ? (
              <button
                onClick={onOpenCheckout || onUnlockFullPortal}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                <span>Suscríbete y accede al 50% descuento</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Completo Activo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HERO PORTADA Y ESCUDO DEL CLUB DEPORTIVO DEPORVERSO              */}
      {/* ================================================================ */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Contenedor de la Portada Cinematográfica */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#03060f]">
          
          {/* Imagen de Portada Oficial con colores celeste, blanco y negro */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img 
              src={club.portadaUrl} 
              alt="Portada Club Deportivo Deporverso" 
              className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            />
            {/* Gradientes disruptivos minimalistas */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/90 via-transparent to-[#030712]/60" />

            {/* Badges y Certificación en la esquina superior */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2.5">
              <div className="bg-black/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Club Insignia Certificado CIG 2026</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                <span>Fundado {club.foundedYear}</span>
                <span className="mx-1.5 text-white/30">·</span>
                <span>{club.city}, {club.country}</span>
              </div>
            </div>
          </div>

          {/* Bloque Inferior con Escudo, Título y Datos Clave */}
          <div className="relative px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Escudo Oficial + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              {/* Escudo con marco brillante celeste */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-black border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(0,229,255,0.35)] overflow-hidden p-1.5 transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={club.logoUrl} 
                    alt="Escudo Club Deportivo Deporverso" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-md border border-cyan-200">
                  OFICIAL
                </div>
              </div>

              {/* Título y Lemas */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-cyan-400 font-mono">
                  <span>{club.acronym}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-slate-300">{club.motto}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  {club.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {club.stadiumFutbol.split('(')[0]}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    {club.membershipCount.toLocaleString()} Socios Registrados
                  </span>
                </p>
              </div>
            </div>

            {/* Palmarés y Acciones Rápidas */}
            <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowTrophyModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Vitrina de Trofeos ({club.trophies.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SELECTOR DE DISCIPLINA: FÚTBOL (11 & INDOR) vs BALONCESTO       */}
        {/* ================================================================ */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Seleccionar Disciplina del Club
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => { setActiveDiscipline('FUTBOL'); setPositionFilter('ALL'); }}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeDiscipline === 'FUTBOL'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 border-b-2 border-cyan-200'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                <Flame className={`w-4 h-4 ${activeDiscipline === 'FUTBOL' ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>Equipo de Fútbol 11 & Fútsal</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  activeDiscipline === 'FUTBOL' ? 'bg-black text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  1° Lugar
                </span>
              </button>

              <button
                onClick={() => { setActiveDiscipline('BALONCESTO'); setPositionFilter('ALL'); }}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeDiscipline === 'BALONCESTO'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 border-b-2 border-amber-200'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeDiscipline === 'BALONCESTO' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Equipo de Baloncesto</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  activeDiscipline === 'BALONCESTO' ? 'bg-black text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  Oro
                </span>
              </button>
            </div>
          </div>

          {/* Estadísticas Resumidas de la Disciplina Seleccionada */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto py-1">
            {activeDiscipline === 'FUTBOL' ? (
              <>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Partidos Jugados</span>
                  <span className="text-lg font-black text-white">{club.statsFutbol.pj}</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-cyan-400 uppercase">Victorias / Invicto</span>
                  <span className="text-lg font-black text-cyan-400">{club.statsFutbol.pg} <span className="text-xs text-slate-400">({club.statsFutbol.pe}E)</span></span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Goles (GF / GC)</span>
                  <span className="text-lg font-black text-white">{club.statsFutbol.gf} / {club.statsFutbol.gc}</span>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-cyan-300 uppercase">Puntos Totales</span>
                  <span className="text-lg font-black text-cyan-300">{club.statsFutbol.pts} pts</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Partidos Jugados</span>
                  <span className="text-lg font-black text-white">{club.statsBasket.pj}</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-amber-400 uppercase">Récord (V-D)</span>
                  <span className="text-lg font-black text-amber-400">{club.statsBasket.pg} - {club.statsBasket.pp}</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Promedio PTS</span>
                  <span className="text-lg font-black text-white">{club.statsBasket.avgPoints} ppg</span>
                </div>
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-4 py-2 text-center shrink-0">
                  <span className="block text-[10px] font-mono text-amber-300 uppercase">Diferencial</span>
                  <span className="text-lg font-black text-amber-300">+{club.statsBasket.diff}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* GRILLA DE CONTENIDO: PLANTILLA + PARTIDOS + CARNET INTERACTIVO   */}
        {/* ================================================================ */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA Y CENTRAL: PLANTILLA DE JUGADORES */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cabecera de la plantilla con filtros y búsqueda */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Plantilla Oficial de {activeDiscipline === 'FUTBOL' ? 'Fútbol' : 'Baloncesto'}</span>
                  <span className="text-xs font-mono font-normal text-slate-400">({currentPlayers.length} deportistas)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Haz clic en cualquier tarjeta para abrir el carnet digital verificado con código QR.
                </p>
              </div>

              {/* Filtro de búsqueda rápida */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-full sm:w-48"
                />
              </div>
            </div>

            {/* Grilla de Tarjetas de Jugadores (Disruptivo / Minimalista) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    selectedPlayer?.id === player.id 
                      ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-cyan-500/20' 
                      : 'border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  {/* Dorsal y Categoría */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-lg">
                      #{player.dorsal}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {player.positionCategory}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        player.status === 'CAPITÁN' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-slate-400'
                      }`}>
                        {player.status}
                      </span>
                    </div>
                  </div>

                  {/* Foto y Datos Principales */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-white/15 shrink-0 group-hover:border-cyan-400 transition-colors">
                      <img 
                        src={player.photoUrl} 
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-cyan-300 font-bold py-0.5">
                        {player.ovr} OVR
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {player.position}
                      </p>
                      <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                        {player.marketValue}
                      </p>
                    </div>
                  </div>

                  {/* Resumen de estadísticas según la disciplina */}
                  <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    {activeDiscipline === 'FUTBOL' && player.futbolStats ? (
                      <>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">Goles</span>
                          <span className="font-bold text-white">{player.futbolStats.goles}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">Asist.</span>
                          <span className="font-bold text-cyan-300">{player.futbolStats.asistencias}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">Rating</span>
                          <span className="font-bold text-amber-400">{player.futbolStats.rating}</span>
                        </div>
                      </>
                    ) : player.basketStats ? (
                      <>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">PTS</span>
                          <span className="font-bold text-white">{player.basketStats.ppg}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">REB</span>
                          <span className="font-bold text-amber-400">{player.basketStats.rpg}</span>
                        </div>
                        <div className="bg-slate-950/60 rounded-lg py-1 px-1.5">
                          <span className="block text-[9px] text-slate-500 uppercase">% 3P</span>
                          <span className="font-bold text-cyan-300">{player.basketStats.threePct}%</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {/* Llamado a la acción disruptivo bajo la plantilla */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Personalización Total de Tu Club
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  ¿Quieres gestionar tu propio club o liga con esta misma tecnología?
                </h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Accede a la Vocalía Digital QR, Sistema de VAR Barrial, Cronista IA y Carnets Holográficos con la Licencia Oficial CIG por solo $35 por club y por torneo (50% de descuento por lanzamiento, precio real $70).
                </p>
              </div>

              <button
                onClick={onOpenCheckout || onUnlockFullPortal}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-400/20 shrink-0 cursor-pointer transition-transform transform active:scale-95 flex items-center gap-2"
              >
                <span>Activar Portal Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: CARNET DIGITAL ACTIVO + FIXTURE OFICIAL */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CARNET DIGITAL INTERACTIVO (TRADING CARD HOLOGRAMA) */}
            <div className="sticky top-6 space-y-6">
              <div className="border border-white/10 rounded-3xl bg-[#060a14] p-5 shadow-2xl relative overflow-hidden">
                {/* Resplandor decorativo celeste */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Carnet Digital Oficial
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    CIG VERIFIED
                  </span>
                </div>

                {/* Si hay jugador seleccionado, mostrar su carnet de lujo, sino el capitán */}
                {(() => {
                  const activeCard = selectedPlayer || currentPlayers[0];
                  if (!activeCard) return null;

                  return (
                    <div className="space-y-4">
                      {/* Tarjeta Holográfica del Jugador */}
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1628] to-[#050811] border-2 border-cyan-400/40 p-4 shadow-xl">
                        
                        {/* Cabecera de la tarjeta */}
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span className="text-cyan-400 font-bold">{club.shortName}</span>
                          <span className="text-white/60">DORSAL #{activeCard.dorsal}</span>
                        </div>

                        {/* Foto e insignia */}
                        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-3">
                          <img 
                            src={activeCard.photoUrl} 
                            alt={activeCard.name}
                            className="w-full h-full object-cover object-top" 
                          />
                          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-cyan-300 font-mono text-xs font-black border border-cyan-500/40">
                            {activeCard.ovr} OVR
                          </div>
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono border border-white/20">
                            {activeCard.status}
                          </div>
                        </div>

                        {/* Nombre y posición */}
                        <div className="space-y-0.5">
                          <h4 className="text-base font-black text-white tracking-tight">
                            {activeCard.name}
                          </h4>
                          <p className="text-xs text-cyan-400 font-medium">
                            {activeCard.position} ({activeCard.discipline})
                          </p>
                        </div>

                        {/* Bio / Scout brief */}
                        <p className="text-[11px] text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5 mt-2">
                          {activeCard.bio}
                        </p>

                        {/* Radar / Grid de métricas */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3">
                          <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 block">Edad / Estatura</span>
                            <span className="text-white font-bold">{activeCard.age} años · {activeCard.height}</span>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 block">Pie / Mano Hábil</span>
                            <span className="text-cyan-300 font-bold">{activeCard.footOrHand}</span>
                          </div>
                        </div>

                        {/* Código QR Verificable y Token CIG */}
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-slate-400 block">TOKEN CRIPTOGRÁFICO</span>
                            <span className="text-[11px] font-mono font-bold text-white">{activeCard.qrCode}</span>
                          </div>
                          <button
                            onClick={() => handleShareCarnet(activeCard)}
                            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
                            title="Compartir o Copiar Ficha"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Toast de compartir */}
                      {showShareToast && (
                        <div className="p-2 text-center text-xs font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-500 rounded-xl animate-in fade-in">
                          {showShareToast}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* FIXTURE Y PRÓXIMOS ENCUENTROS DEL CLUB */}
              <div className="border border-white/10 rounded-3xl bg-[#060a14] p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Fixture Oficial {activeDiscipline === 'FUTBOL' ? 'Fútbol' : 'Baloncesto'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentMatches.map((match) => (
                    <div 
                      key={match.id}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{match.competition}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          match.status === 'SCHEDULED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {match.status === 'SCHEDULED' ? 'PRÓXIMO' : 'FINALIZADO'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-cyan-300">{club.shortName}</span>
                          <span className="text-xs text-slate-500 font-mono">vs</span>
                          <span className="text-xs font-bold text-white">{match.opponent}</span>
                        </div>

                        {match.status === 'FINISHED' ? (
                          <div className="text-xs font-black font-mono text-emerald-400">
                            {match.scoreDeporverso} - {match.scoreOpponent}
                          </div>
                        ) : (
                          <div className="text-xs font-bold font-mono text-amber-400">
                            {match.time}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {match.venue}
                        </span>
                        <span className="font-mono text-slate-300">{match.date}</span>
                      </div>

                      {match.highlights && (
                        <p className="text-[10px] text-slate-400 italic bg-black/30 p-1.5 rounded">
                          {match.highlights}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MODAL DE PALMARÉS Y VITRINA DE TROFEOS                            */}
      {/* ================================================================ */}
      {showTrophyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#090e1c] border border-cyan-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Vitrina de Trofeos Oficial</h3>
                  <p className="text-xs text-slate-400">{club.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrophyModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {club.trophies.map((trophy) => (
                <div 
                  key={trophy.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{trophy.name}</h4>
                      <p className="text-[11px] text-slate-400">{trophy.category} · {trophy.discipline}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                    {trophy.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowTrophyModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Cerrar Vitrina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
