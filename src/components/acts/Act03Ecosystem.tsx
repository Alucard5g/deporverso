import React, { useState } from 'react';
import { 
  Trophy, Shield, Users, ShoppingBag, Video, Play, Pause, RotateCcw, 
  Eye, CheckCircle2, ChevronRight, Sparkles, Activity, Layers, ArrowRight, Radio
} from 'lucide-react';
import { CLUBS_DATA, ClubData } from '../../data/clubs';
import { FAN_POSTS, MERCH_ITEMS, VAR_DEMO_PLAY, MerchItem } from '../../data/services';
import estadioVarImg from '../../assets/images/acto3_estadio_var_1789418234243.jpg';
import { CinematicActImage } from '../immersive/CinematicActImage';

interface Act03EcosystemProps {
  onNextAct: () => void;
  onSelectClubModal?: (club: ClubData) => void;
  onOpenLightbox?: (index: number) => void;
}

export const Act03Ecosystem: React.FC<Act03EcosystemProps> = ({ onNextAct, onSelectClubModal, onOpenLightbox }) => {
  const [selectedClub, setSelectedClub] = useState<ClubData>(CLUBS_DATA[0]);
  const [activeSubTab, setActiveSubTab] = useState<'clubs' | 'var' | 'fanzone' | 'merch'>('var');

  // VAR Viewer interactive states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showTacticalLines, setShowTacticalLines] = useState(true);
  const [showVelocityVectors, setShowVelocityVectors] = useState(true);
  const [varCameraAngle, setVarCameraAngle] = useState<'TÁCTICA' | 'LÍNEA_GOL' | 'CÁMARA_BANQUILLO'>('TÁCTICA');

  // Selected merch preview
  const [selectedMerch, setSelectedMerch] = useState<MerchItem>(MERCH_ITEMS[0]);
  const [merchRotated, setMerchRotated] = useState(false);

  return (
    <section
      id="act-3"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 text-center overflow-hidden"
    >
      {/* Background stadium ambiance: metallic, dark slate, floodlights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-b from-emerald-950/20 via-cyan-950/20 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Act Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md mb-8 shadow-xl shadow-emerald-950/30">
        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px] font-mono font-black uppercase tracking-widest text-emerald-300">
          ACTO III • EL ECOSISTEMA
        </span>
      </div>

      {/* Headline */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Tecnología profesional <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            para cada club y aficionado.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light">
          Dentro del estadio moderno de DeporVerso: Club Cards con telemetría en tiempo real, Fan Zone interactivo, Merchandising digital y VAR a la carta con telemetría visual.
        </p>
      </div>

      {/* Hero Visual Showcase: Estadio Moderno & VAR Official */}
      <CinematicActImage
        id="img-act3-estadio-var"
        actNumber="03"
        tag="EL ECOSISTEMA PRO"
        meta="ESTADIO METROPOLITANO • HAWK-EYE 3D"
        title="Tecnología de Élite y VAR a la Carta para Ligas de Base"
        caption="Reflectores internacionales y telemetría de precisión: cada club barrial y formativo accede al mismo estándar de transmisión televisiva y justicia deportiva de las grandes ligas."
        imageSrc={estadioVarImg}
        imageAlt="Estadio de fútbol ultra moderno iluminado de noche con pantalla gigante de revisión VAR y telemetría"
        accent="emerald"
        onExpand={() => onOpenLightbox?.(2)}
      />

      {/* Navigation Sub-Tabs within Act III */}
      <div className="relative z-10 mt-8 mb-10 flex flex-wrap items-center justify-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <button
          onClick={() => setActiveSubTab('var')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'var'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>VAR a la Carta</span>
        </button>

        <button
          onClick={() => setActiveSubTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'clubs'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Club Cards (4)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fanzone')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'fanzone'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Fan Zone Editorial</span>
        </button>

        <button
          onClick={() => setActiveSubTab('merch')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'merch'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Merchandising</span>
        </button>
      </div>

      {/* CONTENT: SUB-TAB 1: VAR A LA CARTA */}
      {activeSubTab === 'var' && (
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 text-left">
          {/* VAR Header */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                  SISTEMA DE REVISIÓN OFICIAL • HAWK-EYE EDGE
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">VAR A LA CARTA</h3>
              <p className="text-xs text-slate-400 italic">
                "Mira la jugada. Analiza la jugada. Entiende el juego."
              </p>
            </div>

            {/* Camera angle switcher */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setVarCameraAngle('TÁCTICA')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  varCameraAngle === 'TÁCTICA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Cám 1: Táctica
              </button>
              <button
                onClick={() => setVarCameraAngle('LÍNEA_GOL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  varCameraAngle === 'LÍNEA_GOL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Cám 2: Línea de Gol
              </button>
              <button
                onClick={() => setVarCameraAngle('CÁMARA_BANQUILLO')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  varCameraAngle === 'CÁMARA_BANQUILLO' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Cám 3: Banquillo
              </button>
            </div>
          </div>

          {/* DUAL SPLIT VISOR: VIDEO ORIGINAL vs ANÁLISIS TÁCTICO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* PANEL 1: VIDEO ORIGINAL */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  SEÑAL DE TRANSMISIÓN ORIGINAL
                </span>
                <span className="text-emerald-400 font-bold">1080p @ 60fps</span>
              </div>

              {/* Stadium Camera Live Feed with VAR Imagery */}
              <div className="h-64 sm:h-72 bg-slate-900 rounded-2xl relative flex items-center justify-center overflow-hidden my-3 border border-slate-800/80 group">
                {/* Real Stadium Broadcast Feed Background */}
                <img
                  id="img-var-panel-feed"
                  src={estadioVarImg}
                  alt="Señal de transmisión oficial del estadio en cabina VAR"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark broadcast shading overlay */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px]" />

                {/* Player tracking dots overlay */}
                <div className="absolute top-1/2 left-1/3 w-6 h-6 rounded-full bg-cyan-400/90 shadow-[0_0_14px_#38bdf8] flex items-center justify-center text-[10px] font-black text-slate-950 z-10">
                  9
                </div>
                <div className="absolute top-1/2 left-[48%] w-6 h-6 rounded-full bg-amber-400/90 shadow-[0_0_14px_#f59e0b] flex items-center justify-center text-[10px] font-black text-slate-950 z-10">
                  4
                </div>
                {/* Ball */}
                <div className="absolute top-[52%] left-[41%] w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping z-10" />

                {/* Center play state indicator */}
                <div className="relative z-10 text-center space-y-1">
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-black/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md block shadow-xl">
                    {isPlaying ? '▶ REPRODUCIENDO VIVO (60 FPS)' : '⏸ CUADRO DETENIDO (78:14.28)'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded-md inline-block">
                    Ángulo: {varCameraAngle}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Jugada: Minuto 78'</span>
                <span>Resolución Nativa broadcast</span>
              </div>
            </div>

            {/* PANEL 2: ANÁLISIS VAR TÁCTICO */}
            <div className="bg-slate-950 rounded-3xl border border-cyan-500/30 p-4 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  OVERLAY TÁCTICO TELEMÉTRICO
                </span>
                <span className="text-emerald-400 font-mono font-bold">LÍNEA DE REGLAMENTO ACTIVA</span>
              </div>

              {/* Tactical overlay representation */}
              <div className="h-64 sm:h-72 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/40 rounded-2xl relative flex items-center justify-center overflow-hidden my-3 border border-cyan-500/30">
                {/* Coordinate grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Tactical lines */}
                {showTacticalLines && (
                  <>
                    {/* Offside line */}
                    <div className="absolute left-[45%] top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    <div className="absolute left-[45%] top-8 bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded -translate-x-1/2">
                      LÍNEA DEFENSIVA
                    </div>

                    {/* Attacker line */}
                    <div className="absolute left-[33%] top-0 bottom-0 w-[2px] bg-emerald-400 border-dashed border-emerald-400 shadow-[0_0_10px_#10b981]" />
                    <div className="absolute left-[33%] top-16 bg-emerald-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded -translate-x-1/2">
                      DELANTERO: +12.4 CM HABILITADO
                    </div>
                  </>
                )}

                {/* Velocity vectors */}
                {showVelocityVectors && (
                  <div className="absolute bottom-6 left-6 bg-black/80 p-2.5 rounded-xl border border-cyan-500/30 text-[10px] font-mono text-cyan-300 space-y-1">
                    <div>○ Vector Velocidad: 28.4 km/h</div>
                    <div>○ Aceleración: +3.2 m/s²</div>
                    <div>○ Ángulo de Proyección: 14.8°</div>
                  </div>
                )}

                {/* Ruling callout banner */}
                <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-emerald-300 font-mono text-xs font-bold shadow-lg">
                  ✓ {VAR_DEMO_PLAY.ruling}
                </div>
              </div>

              {/* Ruling footer */}
              <div className="text-[11px] text-slate-300 font-mono flex items-center justify-between">
                <span>Precisión: <strong className="text-cyan-400">{VAR_DEMO_PLAY.confidence}</strong></span>
                <span className="text-emerald-400 font-bold">Decisión Confirmada</span>
              </div>
            </div>
          </div>

          {/* PLAYBACK & REPLAY CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Play/Pause & Scrub */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsPlaying(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                title="Reiniciar a cuadro 0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Slow Motion Speeds */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 px-2">Velocidad:</span>
              {[0.25, 0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Toggle Overlay Switches */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setShowTacticalLines(!showTacticalLines)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-colors cursor-pointer ${
                  showTacticalLines
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {showTacticalLines ? '✓ Líneas Tácticas' : '○ Líneas Ocultas'}
              </button>

              <button
                onClick={() => setShowVelocityVectors(!showVelocityVectors)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-colors cursor-pointer ${
                  showVelocityVectors
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {showVelocityVectors ? '✓ Vectores Telemetría' : '○ Vectores Ocultos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: SUB-TAB 2: CLUB CARDS */}
      {activeSubTab === 'clubs' && (
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLUBS_DATA.map((club) => {
              const isSelected = selectedClub.id === club.id;
              return (
                <div
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={`bg-slate-950/80 p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer hover:-translate-y-1 ${
                    isSelected
                      ? 'border-emerald-500/60 shadow-2xl shadow-emerald-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Category + Subdomain */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                      {club.category}
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px]">
                      {club.subdomain}
                    </span>
                  </div>

                  {/* Club Badge + Name */}
                  <div className="py-4 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${club.badgeColor} p-1 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center font-black text-white text-base font-mono">
                        {club.shortName}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                        {club.name}
                      </h4>
                      <span className="text-xs text-slate-400 block font-mono">
                        {club.city} • Posición #{club.position}
                      </span>
                    </div>
                  </div>

                  {/* Next Match */}
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-xs space-y-1 mb-4">
                    <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">
                      Próximo Encuentro
                    </span>
                    <div className="text-white font-bold">
                      vs {club.nextMatch.opponent}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{club.nextMatch.date} - {club.nextMatch.time}</span>
                      <span>{club.nextMatch.stadium}</span>
                    </div>
                  </div>

                  {/* Table Stats: PJ, PG, PE, PP, GF, GC, PTS */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs pb-4 border-b border-slate-800">
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">PJ</span>
                      <strong className="text-white text-xs">{club.stats.pj}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">PG</span>
                      <strong className="text-emerald-400 text-xs">{club.stats.pg}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">PE</span>
                      <strong className="text-slate-300 text-xs">{club.stats.pe}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">PP</span>
                      <strong className="text-red-400 text-xs">{club.stats.pp}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">GF</span>
                      <strong className="text-cyan-400 text-xs">{club.stats.gf}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-500 block">GC</span>
                      <strong className="text-slate-400 text-xs">{club.stats.gc}</strong>
                    </div>
                    <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-500/30">
                      <span className="text-[9px] text-emerald-400 block">PTS</span>
                      <strong className="text-emerald-300 text-xs">{club.stats.pts}</strong>
                    </div>
                  </div>

                  {/* Action CTA: [ VER CLUB ] */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Subdominio multi-tenant activo
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectClubModal) onSelectClubModal(club);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>[ VER CLUB ]</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT: SUB-TAB 3: FAN ZONE */}
      {activeSubTab === 'fanzone' && (
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FAN_POSTS.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]">
                      {post.category}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {post.date}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-3 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">{post.votesOrInteractions}</span>
                  <span className="text-slate-500 text-[10px]">#{post.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT: SUB-TAB 4: MERCHANDISING */}
      {activeSubTab === 'merch' && (
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MERCH_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedMerch(item);
                  setMerchRotated(!merchRotated);
                }}
                className={`bg-slate-950/90 p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  selectedMerch.id === item.id ? 'border-amber-500/60' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 font-mono">
                    <span className="text-slate-400">{item.category}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* 3D Product Mock Display with Tilt */}
                  <div className="h-36 bg-gradient-to-tr from-slate-900 to-slate-950 rounded-2xl my-3 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-white text-xs font-mono shadow-2xl transition-transform duration-500"
                      style={{
                        backgroundColor: item.colorHex,
                        transform: selectedMerch.id === item.id && merchRotated ? 'rotateY(180deg)' : 'none'
                      }}
                    >
                      <span>{item.name.substring(0, 3).toUpperCase()}</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-white text-sm line-clamp-1">{item.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-base font-black text-white">${item.price.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400">Clic para girar 3D</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 font-mono">
            Arquitectura lista para pasarela de e-commerce real para cada club sin intermediarios.
          </div>
        </div>
      )}

      {/* Next Act Prompt */}
      <div className="relative z-10 mt-12 text-center">
        <button
          onClick={onNextAct}
          className="px-6 py-2.5 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
        >
          <span>Viajar al Acto IV: El Multiverso Deportivo</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>
    </section>
  );
};
