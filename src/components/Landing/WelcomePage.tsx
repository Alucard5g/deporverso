import React, { useState } from 'react';
import { 
  Trophy, Zap, Video, Cpu, FileText, Users, Shield, Sparkles, 
  CheckCircle2, ArrowRight, Upload, Play, MessageSquare, Award,
  Smartphone, HelpCircle, ChevronRight, Check, X, QrCode, Lock,
  CreditCard, DollarSign, Building2, UserCheck, ShieldCheck, Plus, Trash2,
  Layers, Eye, Compass, Radio, Activity, Globe, Flame, Calendar
} from 'lucide-react';
import { SportCode, UserRole, Tenant } from '../../types';
import { Sport3DExperience } from '../ThreeD/Sport3DExperience';
import { ThematicSportsGallery } from './ThematicSportsGallery';
import { HeroesVrSection } from '../HeroesVR/HeroesVrSection';

// Telemetría en vivo del Multiverso Deporverso (Marcadores en Tiempo Real)
const DEPORVERSO_LIVE_MATCHES = [
  { id: 'm1', sport: 'FÚTBOL 11', code: 'FUTBOL', icon: '⚽', league: 'Torneo Interbarrial Oro', home: 'CD Los Andes', away: 'América Real', score: '2 - 1', time: "78'", status: 'LIVE', badge: 'Vocalía Sync' },
  { id: 'm2', sport: 'ECUAVOLEY', code: 'ECUAVOLEY', icon: '🏐', league: 'Clásico Interprovincial', home: 'Trío Calpi', away: 'Trío Machachi', score: '14 - 11', time: 'Set 2', status: 'LIVE', badge: '15 Puntos' },
  { id: 'm3', sport: 'BALONCESTO', code: 'BALONCESTO', icon: '🏀', league: 'Liga Metropolitana', home: 'Titanes BBC', away: 'Panteras', score: '68 - 64', time: 'Q4 02:45', status: 'LIVE', badge: 'Posesión 24s' },
  { id: 'm4', sport: 'FÚTSAL', code: 'FUTSAL', icon: '👟', league: 'Copa Relámpago Nocturna', home: 'Galácticos FC', away: 'Sparta Indor', score: '4 - 3', time: "34'", status: 'LIVE', badge: 'Faltas Acum: 4-3' },
  { id: 'm5', sport: 'PÁDEL', code: 'PADEL', icon: '🎾', league: 'Open Premier Circuit', home: 'Gómez / Ríos', away: 'López / Vega', score: '6-4, 5-3', time: 'Set 2', status: 'LIVE', badge: 'Punto de Oro' },
  { id: 'm6', sport: 'VAR CLOUD', code: 'FUTBOL', icon: '📹', league: 'Revisión en Cancha 1', home: 'Ojo de Halcón', away: 'Área Penal', score: 'VAR', time: '180ms', status: 'VAR_ACTIVE', badge: 'HD Replay' },
];

interface WelcomePageProps {
  onNavigateTab: (tab: string) => void;
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  setUserRole: (role: UserRole) => void;
  isSuperAdminAuth?: boolean;
  onSuperAdminAuthSuccess?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateTab,
  onAddTenant,
  setUserRole,
  isSuperAdminAuth,
  onSuperAdminAuthSuccess
}) => {
  // Modals state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVarDemoModal, setShowVarDemoModal] = useState(false);
  const [varActiveCamera, setVarActiveCamera] = useState<'CAM1' | 'CAM2' | 'CAM3'>('CAM1');

  // Onboarding Wizard & Payment Gateway State
  // Step 1: Datos Liga & Admin | Step 2: Pasarela de Pago | Step 3: Panel Post-Pago | Step 4: Éxito
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [newLeagueName, setNewLeagueName] = useState('Liga Barrial Pichincha');
  const [adminName, setAdminName] = useState('Carlos Pérez');
  const [adminEmail, setAdminEmail] = useState('carlos.perez@liga.com');
  const [adminPhone, setAdminPhone] = useState('+593 99 123 4567');
  const [newLeagueSport, setNewLeagueSport] = useState<SportCode>('FUTBOL');
  const [newLeagueCountry, setNewLeagueCountry] = useState('Ecuador');
  const [leagueTeamCount, setLeagueTeamCount] = useState<number>(12);
  const [leagueCategories, setLeagueCategories] = useState<string>('Senior, Máster 40, Femenino');
  const [leagueNotes, setLeagueNotes] = useState<string>('Deseamos integración VAR y gestión de carnetización QR.');

  // Estado para Registro Gratuito de Aficionados / Fans
  const [loginTab, setLoginTab] = useState<'DIRIGENTE' | 'AFICIONADO' | 'SUPERADMIN'>('AFICIONADO');
  const [fanName, setFanName] = useState('');
  const [fanEmail, setFanEmail] = useState('');
  const [favoriteLeague, setFavoriteLeague] = useState('Liga Barrial Central');
  const [fanSuccessMsg, setFanSuccessMsg] = useState(false);

  // Estado para SuperAdmin Auth en Modal Login
  const [saEmail, setSaEmail] = useState('');
  const [saPassword, setSaPassword] = useState('');
  const [saError, setSaError] = useState('');

  // Solicitud enviada a Agente de Soluciones
  const [agentRequestSent, setAgentRequestSent] = useState(false);

  // Pasarela de Pagos State
  const [paymentPlan, setPaymentPlan] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'PAYPAL'>('CARD');
  const [cardNumber, setCardNumber] = useState('4532 8812 9012 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Carlos Pérez');
  const [transferRef, setTransferRef] = useState('BP-98234712');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentPaid, setPaymentPaid] = useState(false);

  // Post-Payment Panel State
  const [postPaymentTab, setPostPaymentTab] = useState<'LIGA' | 'EQUIPOS' | 'JUGADORES' | 'REGLAMENTO'>('LIGA');
  const [leagueCategory, setLeagueCategory] = useState('Máster 40 & Senior');
  const [customTeams, setCustomTeams] = useState([
    { id: '1', name: 'Deportivo Quito Barrial', delegate: 'Jorge Narváez', color: 'Azul y Grana', playersCount: 18 },
    { id: '2', name: 'Atlético Pichincha', delegate: 'Mario Silva', color: 'Verde Esmeralda', playersCount: 16 },
    { id: '3', name: 'Club Estudiantes', delegate: 'Luis Alvear', color: 'Blanco y Rojo', playersCount: 15 }
  ]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDelegate, setNewTeamDelegate] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('');

  const [customPlayers, setCustomPlayers] = useState([
    { id: '1', name: 'Esteban Guerra', team: 'Deportivo Quito Barrial', number: '10', dni: '1723456789', position: 'Mediocampista' },
    { id: '2', name: 'Mateo Morales', team: 'Atlético Pichincha', number: '9', dni: '1712984721', position: 'Delantero' }
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerTeam, setNewPlayerTeam] = useState('Deportivo Quito Barrial');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerDni, setNewPlayerDni] = useState('');

  const [customRulesText, setCustomRulesText] = useState(
    '1. Tiempos de juego reglamentarios según la disciplina.\n2. Máximo 5 sustituciones por encuentro.\n3. Acumulación de tarjetas amarillas sancionada con 1 fecha de suspensión.\n4. Verificación obligatoria de carnet digital QR en mesa de control.'
  );

  // Selected Sport in Multideporte section
  const [selectedSport, setSelectedSport] = useState<SportCode>('FUTBOL');

  const sportsList: { code: SportCode; name: string; icon: string; desc: string; rules: string }[] = [
    { code: 'FUTBOL', name: 'Fútbol 11', icon: '⚽', desc: 'Reglamento FIFA completo', rules: 'Dos tiempos de 45m, sustituciones, tarjetas amarillas/rojas, fueras de juego.' },
    { code: 'FUTSAL', name: 'Fútsal / Indor', icon: '👟', desc: 'Control de faltas acumuladas', rules: 'Tiempos de 20m cronometrados, 5ª falta con tiro libre directo de 10m.' },
    { code: 'ECUAVOLEY', name: 'Ecuavoley', icon: '🏐', desc: 'Modalidad de 3 vs 3 con cambios y batidas', rules: 'Sistemas de 10, 12 o 15 puntos. Cambios de bola, ponchadas y colocadas.' },
    { code: 'BALONCESTO', name: 'Baloncesto', icon: '🏀', desc: 'Puntuación 1, 2 y 3 puntos', rules: 'Cuatro cuartos de 10m, reloj de posesión, control de faltas personales y técnicas.' },
    { code: 'PADEL', name: 'Pádel', icon: '🎾', desc: 'Gestión por Sets y Tie-break', rules: 'Sets a 6 juegos, punto de oro o ventajas, desempate tie-break a 7 puntos.' },
    { code: 'VOLEIBOL', name: 'Voleibol / Tenis', icon: '🏐', desc: 'Formatos por Sets y Rotaciones', rules: 'Sets a 25 puntos con ventaja de 2, rotaciones de saque, bloqueos y colocaciones.' },
    { code: 'BEISBOL', name: 'Béisbol / Sóftbol', icon: '⚾', desc: 'Entradas e Innings', rules: 'Innings, carreras, conteo de strikes y bolas, gestión de outs.' },
    { code: 'OTROS', name: 'Artes Marciales / Otros', icon: '🥊', desc: 'Reglamento Adaptable', rules: 'Estructuras de combate, katas o rondas por puntos personalizables.' }
  ];

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentPaid(true);
      setOnboardingStep(3); // Despliega el panel de ingreso de información inmediatamente post-pago
    }, 1200);
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCustomTeams([
      ...customTeams,
      {
        id: Date.now().toString(),
        name: newTeamName,
        delegate: newTeamDelegate || 'Delegado Por Asignar',
        color: newTeamColor || 'Oficial',
        playersCount: 0
      }
    ]);
    setNewTeamName('');
    setNewTeamDelegate('');
    setNewTeamColor('');
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    setCustomPlayers([
      ...customPlayers,
      {
        id: Date.now().toString(),
        name: newPlayerName,
        team: newPlayerTeam,
        number: newPlayerNumber || '10',
        dni: newPlayerDni || '1700000000',
        position: 'Jugador'
      }
    ]);
    setNewPlayerName('');
    setNewPlayerNumber('');
    setNewPlayerDni('');
  };

  const handleLeagueRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;

    const slug = newLeagueName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onAddTenant({
      name: newLeagueName,
      slug: slug,
      sport_code: newLeagueSport,
      country: newLeagueCountry,
      currency: 'USD',
      domain: `${slug}.sportia.app`,
      is_active: true,
      annual_license_fee: 0
    });

    setAgentRequestSent(true);
    setOnboardingStep(4);
  };

  const handleFanRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanEmail.trim()) return;

    setUserRole('PLAYER'); // Aficionado / Jugador
    setFanSuccessMsg(true);
    setTimeout(() => {
      setShowLoginModal(false);
      onNavigateTab('chronicle');
    }, 1500);
  };

  const handleFinalizeLeagueRegistration = () => {
    const slug = newLeagueName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onAddTenant({
      name: newLeagueName,
      slug: slug,
      sport_code: newLeagueSport,
      country: newLeagueCountry,
      currency: 'USD',
      domain: `${slug}.sportia.app`,
      is_active: true,
      annual_license_fee: 0
    });

    setOnboardingStep(4);
  };

  const handleLoginRole = (role: UserRole, targetTab: string) => {
    setUserRole(role);
    setShowLoginModal(false);
    onNavigateTab(targetTab);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12 text-white">
      {/* 0. LIVE MULTIVERSE TICKER TAPE (FEED EN TIEMPO REAL DEL DEPORVERSO) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#040810]/90 border border-cyan-500/30 backdrop-blur-xl p-2.5 shadow-2xl shadow-cyan-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-400/40 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black tracking-widest uppercase text-emerald-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              DEPÔRVERSO LIVE FEED
            </span>
          </div>

          {/* Marquee de Marcadores Multideporte */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-3 py-1 text-xs">
            {DEPORVERSO_LIVE_MATCHES.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedSport(m.code as SportCode)}
                className="shrink-0 flex items-center gap-2.5 bg-[#0a0f18] hover:bg-[#101826] border border-white/10 hover:border-cyan-400/50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all group"
              >
                <span className="text-sm">{m.icon}</span>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">{m.sport}</span>
                <span className="text-white/80 font-semibold text-xs">{m.home}</span>
                <span className="font-mono font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px] border border-emerald-500/20">
                  {m.score}
                </span>
                <span className="text-white/80 font-semibold text-xs">{m.away}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {m.time}
                </span>
                <span className="text-[9px] font-bold text-white/50 group-hover:text-cyan-300 transition-colors">
                  • {m.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1. NAVBAR DEDICADA DE LA PÁGINA DE BIENVENIDA */}
      <nav id="navbar-welcome" className="bg-[#050811]/90 backdrop-blur-xl relative z-10 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Logo Deporverso con Ícono Holográfico en Gradiente Multiversal */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/25 relative group">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Trophy className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white">
                Depor<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">verso</span>
              </span>
              <span className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                MULTIVERSO
              </span>
            </div>
            <p className="text-[10px] text-white/50 font-mono tracking-wider uppercase">Plataforma Inteligente de Deportes</p>
          </div>
        </div>

        {/* Enlaces Directos de Desplazamiento */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-white/70">
          <button 
            onClick={() => scrollToSection('funciones')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            6 Dimensiones
          </button>
          <button 
            onClick={() => scrollToSection('var-seccion')} 
            className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            VAR a la Carta
          </button>
          <button 
            onClick={() => scrollToSection('heroes-vr')} 
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5 text-cyan-300"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Héroes VR</span>
            <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-full font-bold">META</span>
          </button>
          <button 
            onClick={() => onNavigateTab('calendar')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-400 font-extrabold"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calendario Multideporte</span>
            <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">FECHAS</span>
          </button>
          <button 
            onClick={() => scrollToSection('multideporte')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            Multideporte 3D
          </button>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Acceso Liga
          </button>

          <button
            onClick={() => {
              setOnboardingStep(1);
              setShowOnboardingModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center gap-2 transform hover:scale-105"
          >
            <Trophy className="w-4 h-4" />
            Crear mi Liga
          </button>
        </div>
      </nav>

      {/* 2. SECCIÓN PRINCIPAL (HERO SECTION) CON MOTOR WEBGL 3D INTERACTIVO */}
      <section className="relative overflow-hidden rounded-3xl bg-[#030712] border border-cyan-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-cyan-950/30">
        {/* Glow Ambient Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-deporverso-grid pointer-events-none opacity-40"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Mensaje, CTAs y Métricas */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-inner">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>EL MULTIVERSO DEPORTIVO INTELIGENTE • DEPORVERSO ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Administra tu liga sin estrés. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Potenciada con 3D, IA y VAR.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
              Unifica Fútbol, Ecuavoley, Baloncesto, Fútsal, Pádel y Béisbol bajo un solo ecosistema. Registra partidos con carnets QR, obtén revisiones VAR instantáneas en tablet, genera crónicas automáticas con Gemini y entrena reflejos en Héroes VR.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  setOnboardingStep(1);
                  setShowOnboardingModal(true);
                }}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs transition-all transform hover:scale-105 cursor-pointer shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3"
              >
                <span>Crear mi Torneo en 1 Minuto</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowVarDemoModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-[#0d131f] hover:bg-white/10 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-red-400 fill-red-400" />
                <span>Ver Demostración VAR ($12)</span>
              </button>

              <button
                onClick={() => onNavigateTab('calendar')}
                className="px-6 py-3.5 rounded-2xl bg-[#091523] hover:bg-cyan-950/60 text-cyan-300 font-extrabold text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Calendario & Fixture</span>
              </button>
            </div>

            {/* Key Metric Highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 text-left">
              <div className="p-3 bg-[#080d18]/90 rounded-2xl border border-white/10 shadow-lg">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400 font-mono">&lt; 1 seg</span>
                <span className="text-[11px] text-white/60 font-medium">Lectura QR Carnets</span>
              </div>
              <div className="p-3 bg-[#080d18]/90 rounded-2xl border border-white/10 shadow-lg">
                <span className="block text-xl sm:text-2xl font-black text-cyan-400 font-mono">$12 USD</span>
                <span className="text-[11px] text-white/60 font-medium">VAR por Partido</span>
              </div>
              <div className="p-3 bg-[#080d18]/90 rounded-2xl border border-white/10 shadow-lg">
                <span className="block text-xl sm:text-2xl font-black text-amber-400 font-mono">100% IA</span>
                <span className="text-[11px] text-white/60 font-medium">Parsing de Planillas</span>
              </div>
              <div className="p-3 bg-[#080d18]/90 rounded-2xl border border-white/10 shadow-lg">
                <span className="block text-xl sm:text-2xl font-black text-purple-400 font-mono">0 Papel</span>
                <span className="text-[11px] text-white/60 font-medium">Acta Digital en Vivo</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Holograma 3D Interactivo en Tiempo Real */}
          <div className="lg:col-span-5 w-full">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <Sport3DExperience
                sportCode={selectedSport}
                height={400}
                interactive={true}
                initialMode="STADIUM"
                className="relative"
              />
            </div>
          </div>
        </div>

        {/* Franja Visual de Deportes Soportados Interactiva */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Selecciona una disciplina para adaptar el Estadio 3D en tiempo real:</span>
            </p>
            <button
              onClick={() => scrollToSection('multideporte')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Galería de Acción HD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {sportsList.map((sport) => {
              const isSelected = selectedSport === sport.code;
              return (
                <button 
                  key={sport.code}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105 ring-1 ring-emerald-400/50'
                      : 'bg-[#0e1218] border border-white/10 text-white/70 hover:border-emerald-500/40 hover:text-white hover:bg-[#141b24]'
                  }`}
                  onClick={() => {
                    setSelectedSport(sport.code);
                  }}
                >
                  <span className="text-base">{sport.icon}</span>
                  <span>{sport.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Telemetry of the Selected Sport Dimension */}
          {(() => {
            const activeSportData = sportsList.find(s => s.code === selectedSport) || sportsList[0];
            return (
              <div className="mt-5 p-4 rounded-2xl bg-[#060b14]/90 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
                    {activeSportData.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white">{activeSportData.name} • Dimensión Activa</h4>
                      <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">
                        MOTOR OFICIAL LISTO
                      </span>
                    </div>
                    <p className="text-xs text-white/70">{activeSportData.rules}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigateTab('vocalia')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Abrir Mesa {activeSportData.name}</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 3. INGESTA INTELIGENTE DE DATOS (LOS 3 CAMINOS DE REGISTRO) */}
      <section id="registro-facil" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Sin Complicaciones
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            3 Caminos de Ingesta Inteligente
          </h2>
          <p className="text-xs text-white/60">
            Carga tu torneo en minutos sin importar si vienes de planillas físicas, archivos digitales o plataformas antiguas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Opción 1: Registro Manual Guiado */}
          <div className="card-3d-interactive cyber-sheen-effect neon-border-emerald bg-gradient-to-b from-[#091410] to-[#040806] p-6 rounded-3xl space-y-4 shadow-xl transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 font-bold group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                VÍA 01 • ASISTIDA
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Registro Manual Guiado</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Crea tu categoría, añade tus equipos y arrastra jugadores fácilmente con formularios paso a paso optimizados para celular o computadora.
            </p>
            <ul className="space-y-2 text-xs text-white/70 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Formularios adaptables por deporte</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Generación automática de fotos y QR</span>
              </li>
            </ul>
            <button
              onClick={() => onNavigateTab('master-admin')}
              className="w-full mt-2 py-3 bg-[#0d1712] hover:bg-emerald-500 hover:text-black text-white font-bold text-xs rounded-xl border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Gestionar en Panel Admin</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          {/* Opción 2: Subir Excel, Word o PDF (Gemini AI) */}
          <div className="card-3d-interactive cyber-sheen-effect neon-border-cyan bg-gradient-to-b from-[#08141e] to-[#03080f] p-6 rounded-3xl space-y-4 shadow-xl transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 font-bold group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ADMIN
                </span>
                <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  VÍA 02 • GEMINI AI
                </span>
              </div>
            </div>
            <h3 className="text-xl font-black text-white">Subir Excel, Word o PDF</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Pega o sube tus fixture, planillas o nóminas de equipos. Nuestra IA procesa el documento y extrae automáticamente equipos y partidos.
            </p>
            <ul className="space-y-2 text-xs text-white/70 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Parsing inteligente sin plantillas rígidas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Importación en menos de 10 segundos</span>
              </li>
            </ul>
            <button
              onClick={() => onNavigateTab('master-admin')}
              className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Usar Parser IA en Panel Maestro</span>
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Opción 3: Migración Asistida Gratuita */}
          <div className="card-3d-interactive cyber-sheen-effect neon-border-gold bg-gradient-to-b from-[#181206] to-[#0a0702] p-6 rounded-3xl space-y-4 shadow-xl transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 font-bold group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                VÍA 03 • MIGRACIÓN
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Migración Asistida Gratuita</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              ¿Usas un programa antiguo o planillas de Excel? Nuestro equipo técnico migra gratis todas tus bases de datos, historial de tarjetas y sanciones.
            </p>
            <ul className="space-y-2 text-xs text-white/70 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sin perder historiales ni estadísticas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Soporte técnico directo vía WhatsApp</span>
              </li>
            </ul>
            <button
              onClick={() => {
                setShowOnboardingModal(true);
                setOnboardingStep(1);
              }}
              className="w-full mt-2 py-3 bg-[#1c1407] hover:bg-amber-500 hover:text-black text-white font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Solicitar Migración Asistida</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONES CLAVE DE LA PLATAFORMA: LAS 6 DIMENSIONES DE DEPORVERSO */}
      <section id="funciones" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-inner inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            ARQUITECTURA MULTIVERSAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Las 6 Dimensiones Tecnológicas de Deporverso
          </h2>
          <p className="text-xs sm:text-sm text-white/60">
            Diseñadas con precisión matemática para dirigentes barriales, vocales de mesa, árbitros, directores técnicos y cazatalentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dimensión 1: Mesa de Control Cuántica & Carnetización QR */}
          <div className="card-3d-interactive cyber-sheen-effect neon-border-emerald bg-gradient-to-b from-[#0a151b] to-[#03080d] p-6 rounded-3xl space-y-4 shadow-xl transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  DIMENSIÓN 01
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Vocalía Cuántica & QR</h3>
                <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">PWA OFFLINE</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Mesa de control adaptable a cualquier deporte. Escanea carnets biométricos en menos de 1 segundo, gestiona faltas acumuladas, cambios y firmas digitales.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Latencia &lt; 0.8s
              </span>
              <button 
                onClick={() => onNavigateTab('vocalia')} 
                className="text-xs text-emerald-400 font-extrabold hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Abrir Vocalía en Vivo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimensión 2: Ojo de Halcón VAR A la Carta */}
          <div className="card-3d-interactive cyber-sheen-effect bg-gradient-to-b from-[#1b0a0a] to-[#090303] border border-red-500/40 hover:border-red-400 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-red-500/25 transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black bg-red-500 text-black px-2 py-0.5 rounded-full uppercase">HOT</span>
                <span className="text-[10px] font-black tracking-widest font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
                  DIMENSIÓN 02
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">VAR A la Carta ($12)</h3>
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">POR PARTIDO</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Transmisión local de ultra-baja latencia (180ms). Repetición multi-ángulo instantánea en tablet para que los jueces resuelvan jugadas clave con máxima justicia.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-red-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Multi-cámara HD
              </span>
              <button 
                onClick={() => onNavigateTab('var')} 
                className="text-xs text-red-400 font-extrabold hover:text-red-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Probar Simulador VAR <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimensión 3: Crónicas Neuronales con Gemini IA */}
          <div className="card-3d-interactive cyber-sheen-effect bg-gradient-to-b from-[#160a1d] to-[#07030c] border border-purple-500/40 hover:border-purple-400 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-purple-500/25 transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                DIMENSIÓN 03
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Crónicas Neuronales IA</h3>
                <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">GEMINI 1.5</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Convierte las incidencias y goles del acta digital en emocionantes crónicas periodísticas redactadas al instante, listas para redes sociales y WhatsApp.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-purple-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Generación &lt; 2 seg
              </span>
              <button 
                onClick={() => onNavigateTab('chronicle')} 
                className="text-xs text-purple-400 font-extrabold hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Generador de Crónicas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimensión 4: Hub de Scouting & Deporverso Index */}
          <div className="card-3d-interactive cyber-sheen-effect neon-border-cyan bg-gradient-to-b from-[#0a1420] to-[#040912] p-6 rounded-3xl space-y-4 shadow-xl transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                DIMENSIÓN 04
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Scouting & Talent Index</h3>
                <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">INDEX 1-10</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Descubre a las promesas deportivas de cada barrio. Mapea aceleración, precisión, disciplina y genera fichas técnicas en PDF coleccionables.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Radar Biomecánico
              </span>
              <button 
                onClick={() => onNavigateTab('scouting')} 
                className="text-xs text-cyan-400 font-extrabold hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Explorar Radar Scouting <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimensión 5: Gobernanza Virtual & Asambleas WhatsApp */}
          <div className="card-3d-interactive cyber-sheen-effect bg-gradient-to-b from-[#081816] to-[#030908] border border-teal-500/40 hover:border-teal-400 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-teal-500/25 transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black tracking-widest font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
                DIMENSIÓN 05
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Gobernanza & Asambleas</h3>
                <span className="text-[9px] font-mono font-bold text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded">JITSI MEET</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Sesiones virtuales de directiva integradas, votación oficial cifrada y alertas automáticas enviadas a los delegados vía WhatsApp API.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-teal-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Actas Firmadas PDF
              </span>
              <button 
                onClick={() => onNavigateTab('governance')} 
                className="text-xs text-teal-400 font-extrabold hover:text-teal-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Ver Asambleas Virtuales <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimensión 6: Héroes VR & Simulación Inmersiva */}
          <div className="card-3d-interactive cyber-sheen-effect bg-gradient-to-b from-[#0f1025] to-[#050611] border border-indigo-500/40 hover:border-indigo-400 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-indigo-500/25 transition-all group relative overflow-hidden">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <Eye className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black bg-cyan-400 text-black px-2 py-0.5 rounded-full uppercase">PRÓX</span>
                <span className="text-[10px] font-black tracking-widest font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
                  DIMENSIÓN 06
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Héroes VR en Casa</h3>
                <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded">METAVERSO</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Entrena reflejos, carrera y toma de decisiones tácticas en casa con tecnología de realidad virtual en alianza exclusiva con heroesdeldeporte.com.
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Gafas VR & Sensores
              </span>
              <button 
                onClick={() => onNavigateTab('heroes-vr')} 
                className="text-xs text-indigo-400 font-extrabold hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer transition-colors group-hover:translate-x-1"
              >
                Explorar Metaverso VR <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MÓDULO DESTACADO DE VAR A LA CARTA */}
      <section id="var-seccion" className="bg-gradient-to-r from-[#120a0a] via-[#0a0a0a] to-[#0a1210] border border-red-500/30 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              <Video className="w-4 h-4 text-red-400" />
              <span>Innovación Exclusiva Deporverso</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              VAR A la Carta para Cualquier Torneo
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              No necesitas costosos camiones de transmisión. Con nuestro Kit VAR local de ultra baja latencia (servido mediante Cloudflare R2), los árbitros revisan jugadas dudosas en tablet en menos de 20 segundos.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-xl border border-white/10">
                <span className="font-black text-lg text-emerald-400">$12.00 USD</span>
                <span className="text-xs text-white/60">por partido completo (o $6 USD financiado por equipo)</span>
              </div>
              <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-xl border border-white/10">
                <span className="font-black text-lg text-cyan-400">&lt; 20 seg</span>
                <span className="text-xs text-white/60">Repetición multi-ángulo disponible en tablet en campo</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('var')}
                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-red-500/20"
              >
                Ingresar al Módulo VAR
              </button>
              <button
                onClick={() => setShowVarDemoModal(true)}
                className="px-5 py-3 rounded-xl bg-[#121212] hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
              >
                Ver Video Demostrativo
              </button>
            </div>
          </div>

          {/* Interactive Replay Simulation Graphic */}
          <div className="w-full lg:w-1/2 bg-[#060a12] border border-red-500/40 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl relative overflow-hidden card-3d-interactive">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center group">
              <img
                src={
                  varActiveCamera === 'CAM1'
                    ? "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
                    : varActiveCamera === 'CAM2'
                    ? "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
                    : "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800"
                }
                alt="VAR Camera Simulation"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none"></div>

              {/* Dynamic Laser Scanning Line across simulated feed */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444] animate-laser-sweep pointer-events-none"></div>
              
              <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                VAR DEPORVERSO EN VIVO
              </div>

              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                R2 SYNC: 18MS • 4K
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                <div className="bg-black/85 backdrop-blur-md border border-red-500/40 text-red-300 text-[11px] font-mono font-bold px-3 py-1 rounded-xl shadow-lg">
                  {varActiveCamera === 'CAM1' ? "REVISIÓN: POSIBLE PENALTI (MIN 83')" : varActiveCamera === 'CAM2' ? "REVISIÓN: FUERA DE JUEGO LÍNEA 5.50 (MIN 64')" : "REVISIÓN: BALÓN DUDOSO EN LÍNEA DE GOL (MIN 41')"}
                </div>
                <div className="bg-black/85 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold px-3 py-1 rounded-xl shadow-lg">
                  {varActiveCamera === 'CAM1' ? "CAM-01 • GOL / ÁREA" : varActiveCamera === 'CAM2' ? "CAM-02 • BANDA LATERAL" : "CAM-03 • AÉREA TÁCTICA"}
                </div>
              </div>
            </div>

            {/* Selector de Ángulos de Cámara Táctica */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <button
                type="button"
                onClick={() => setVarActiveCamera('CAM1')}
                className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                  varActiveCamera === 'CAM1'
                    ? 'bg-red-500/25 border border-red-400 text-red-200 ring-1 ring-red-500/40 shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                CAM 1: Gol / Área
              </button>
              <button
                type="button"
                onClick={() => setVarActiveCamera('CAM2')}
                className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                  varActiveCamera === 'CAM2'
                    ? 'bg-red-500/25 border border-red-400 text-red-200 ring-1 ring-red-500/40 shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                CAM 2: Banda Lateral
              </button>
              <button
                type="button"
                onClick={() => setVarActiveCamera('CAM3')}
                className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                  varActiveCamera === 'CAM3'
                    ? 'bg-red-500/25 border border-red-400 text-red-200 ring-1 ring-red-500/40 shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                CAM 3: Aérea Táctica
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Servidor Edge Cloudflare R2 Global
              </span>
              <span className="text-emerald-400 font-bold">Latencia Local: 18ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN HEROES VR - SIMULADOR DE CARRERA & DEPORTE EN CASA (PRÓXIMAMENTE) */}
      <section id="heroes-vr" className="space-y-6">
        <HeroesVrSection onNavigateTab={onNavigateTab} standalone={false} />
      </section>

      {/* SECCIÓN MULTIDEPORTE INTERACTIVA CON GALERÍA DE ALTA DEFINICIÓN */}
      <section id="multideporte" className="space-y-6">
        <ThematicSportsGallery
          onSelectSport={(sportCode) => setSelectedSport(sportCode)}
          onNavigateTab={onNavigateTab}
        />
      </section>

      {/* TELEMETRÍA GLOBAL DEL MULTIVERSO: IMPACTO EN NÚMEROS */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#080d15] to-[#04060a] border border-white/10 p-8 sm:p-10 shadow-2xl">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                TELEMETRÍA EN TIEMPO REAL
              </span>
              <h3 className="text-2xl font-black text-white">Ecosistema Global Deporverso</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60 bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ESTADO DE RED: 99.98% OPERACIONAL</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b121c]/80 border border-emerald-500/25 p-5 rounded-2xl space-y-2 card-3d-interactive cyber-sheen-effect">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">8</div>
              <div className="text-xs font-bold text-white">Disciplinas Oficiales</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Fútbol, Baloncesto, Ecuavoley, Pádel, Voleibol y más con reglas federadas.</p>
            </div>

            <div className="bg-[#0b121c]/80 border border-cyan-500/25 p-5 rounded-2xl space-y-2 card-3d-interactive cyber-sheen-effect">
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">48.2K+</div>
              <div className="text-xs font-bold text-white">Jugadores y Carnets QR</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Verificación biométrica en campo contra suplantaciones y dobles inscripciones.</p>
            </div>

            <div className="bg-[#0b121c]/80 border border-red-500/25 p-5 rounded-2xl space-y-2 card-3d-interactive cyber-sheen-effect">
              <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono tracking-tight">&lt; 20s</div>
              <div className="text-xs font-bold text-white">Tiempo de Veredicto VAR</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Multi-ángulo táctico HD en tablet a $12 por partido con latencia 18ms.</p>
            </div>

            <div className="bg-[#0b121c]/80 border border-purple-500/25 p-5 rounded-2xl space-y-2 card-3d-interactive cyber-sheen-effect">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono tracking-tight">100%</div>
              <div className="text-xs font-bold text-white">Ecológico / Cero Papel</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Actas electrónicas en vivo, firmas criptográficas y crónicas automáticas IA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 sm:p-12 text-black shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ¿Listo para modernizar tu liga deportiva?
          </h2>
          <p className="text-xs sm:text-sm font-medium opacity-90">
            Únete a las decenas de organizaciones que ya administran sus torneos con la potencia de Deporverso. Licencia desde $25.00/año.
          </p>
        </div>

        <button
          onClick={() => {
            setOnboardingStep(1);
            setShowOnboardingModal(true);
          }}
          className="px-8 py-4 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <span>Crear mi Liga Ahora</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </section>

      {/* 6. PIE DE PÁGINA (FOOTER) */}
      <footer className="border-t border-white/10 pt-12 pb-6 space-y-8 text-xs text-white/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-lg text-white">Deporverso</span>
            </div>
            <p className="text-xs text-white/50">
              Plataforma web multideporte global con arquitectura SaaS Multi-Tenant, visión artificial Edge AI, VAR a la carta e IA periodística.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('funciones')} className="hover:text-white cursor-pointer">Funciones</button></li>
              <li><button onClick={() => scrollToSection('var-seccion')} className="hover:text-white cursor-pointer">VAR A la Carta</button></li>
              <li><button onClick={() => scrollToSection('multideporte')} className="hover:text-white cursor-pointer">Multideporte</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigateTab('league')} className="hover:text-white cursor-pointer">Portal de Liga</button></li>
              <li><button onClick={() => onNavigateTab('vocalia')} className="hover:text-white cursor-pointer">Vocalía Digital</button></li>
              <li><button onClick={() => onNavigateTab('master-admin')} className="hover:text-white cursor-pointer">Panel Maestro SuperAdmin</button></li>
              <li><button onClick={() => onNavigateTab('sql-viewer')} className="hover:text-white cursor-pointer">Schema SQL Supabase</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Soporte & Legal</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Términos y Condiciones</li>
              <li className="hover:text-white cursor-pointer">Política de Privacidad</li>
              <li className="hover:text-white cursor-pointer">Soporte Directo WhatsApp</li>
              <li className="hover:text-white cursor-pointer">Licencias y Suscripciones</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Deporverso Global Inc. Todos los derechos reservados.</p>
          <p className="font-semibold text-emerald-400">Plataforma Multideporte Global • Powered by AI Engine</p>
        </div>
      </footer>

      {/* MODAL: REGISTRO, PASARELA DE PAGO Y PANEL POST-PAGO */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 relative shadow-2xl my-8">
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER DE REGISTRO */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Solicitud de Creación de Liga Personalizada
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Suscripciones a la medida de tu organización con atención directa por un Agente de Soluciones Deportivas
                  </p>
                </div>
              </div>
            </div>

            {/* FORMULARIO DE REGISTRO DE SOLICITUD */}
            {onboardingStep === 1 && (
              <form onSubmit={handleLeagueRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nombre de la Liga / Organización</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Liga Barrial Pichincha"
                      value={newLeagueName}
                      onChange={(e) => setNewLeagueName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nombre del Presidente / Dirigente</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Pérez"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80">Correo Electrónico de Contacto</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@liga.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80">Teléfono / WhatsApp de Contacto</label>
                    <input
                      type="text"
                      required
                      placeholder="+593 99 123 4567"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>¿Cuántos Equipos tiene la Liga aprox.?</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      required
                      value={leagueTeamCount}
                      onChange={(e) => setLeagueTeamCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#121212] border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs text-white font-black focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>¿Qué Categorías manejan?</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Máster 40, Senior, Femenino, Infantil"
                      value={leagueCategories}
                      onChange={(e) => setLeagueCategories(e.target.value)}
                      className="w-full bg-[#121212] border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-white/80 block">Selecciona la Disciplina Principal:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sportsList.map((s) => (
                      <button
                        key={s.code}
                        type="button"
                        onClick={() => setNewLeagueSport(s.code)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          newLeagueSport === s.code
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                            : 'bg-[#121212] border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-lg block">{s.icon}</span>
                        <span className="text-xs font-bold block truncate">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/80 block">Requerimientos o Comentarios Adicionales:</label>
                  <textarea
                    rows={3}
                    value={leagueNotes}
                    onChange={(e) => setLeagueNotes(e.target.value)}
                    placeholder="Escribe si requieres módulo VAR, migración asistida de datos o carnetización especial..."
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Solicitar Registro & Contactar Agente Deporverso</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* CONFIRMACIÓN Y ATENCIÓN POR AGENTE */}
            {onboardingStep === 4 && (
              <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white">¡Solicitud de Liga Registrada!</h3>
                <div className="bg-[#121212] p-4 rounded-2xl border border-emerald-500/30 text-left space-y-2 max-w-lg mx-auto">
                  <p className="text-xs text-white/90 leading-relaxed">
                    Hola <strong className="text-emerald-400">{adminName}</strong>, hemos registrado la solicitud para la organización <strong className="text-emerald-400">{newLeagueName}</strong> ({newLeagueSport}).
                  </p>
                  <p className="text-xs text-emerald-400/90 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    En unos momentos un <strong>Agente de Soluciones Deportivas de Deporverso</strong> se pondrá en contacto contigo por WhatsApp (<span>{adminPhone}</span>) o Correo (<span>{adminEmail}</span>) para crear tu liga personalizada y brindarte toda la información del caso.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowOnboardingModal(false);
                      setUserRole('LEAGUE_ADMIN');
                      onNavigateTab('league');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs rounded-xl cursor-pointer shadow-xl shadow-emerald-500/20"
                  >
                    Ver Vista Previa del Portal de Liga
                  </button>
                  <button
                    onClick={() => setShowOnboardingModal(false)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#121212] text-white/70 hover:text-white border border-white/10 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: INICIAR SESIÓN (`/login`) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Ingreso & Registro en Deporverso</h3>
              <p className="text-xs text-white/50">Elige tu modalidad para continuar:</p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setLoginTab('AFICIONADO')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  loginTab === 'AFICIONADO'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                ⚽ Aficionado / Fan (Gratis)
              </button>
              <button
                onClick={() => setLoginTab('DIRIGENTE')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  loginTab === 'DIRIGENTE'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                🏢 Administrador de Liga
              </button>
            </div>

            {/* TAB 1: AFICIONADO / FAN (REGISTRO GRATUITO) */}
            {loginTab === 'AFICIONADO' && (
              <form onSubmit={handleFanRegistrationSubmit} className="space-y-4 pt-2">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
                  <strong className="block text-emerald-400 font-bold mb-0.5">¡Acceso Gratuito para Aficionados!</strong>
                  Registra tu correo para explorar todas las ligas, leer las crónicas periodísticas con IA, comentar partidos y compartir en redes sociales.
                </div>

                {fanSuccessMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300 animate-fade-in">
                    ✓ ¡Registro Exitoso! Ingresando a la plataforma como Aficionado...
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/80 block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Delgado"
                    value={fanName}
                    onChange={(e) => setFanName(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/80 block">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="fan@correo.com"
                    value={fanEmail}
                    onChange={(e) => setFanEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/80 block">Liga o Torneo Favorito (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Liga Barrial Pichincha"
                    value={favoriteLeague}
                    onChange={(e) => setFavoriteLeague(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-md"
                >
                  Registrarse Gratis & Explorar Ligas
                </button>
              </form>
            )}

            {/* TAB 2: DIRIGENTE / ADMIN LIGA */}
            {loginTab === 'DIRIGENTE' && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleLoginRole('LEAGUE_ADMIN', 'league')}
                  className="w-full p-3.5 bg-[#121212] hover:bg-emerald-500/10 hover:border-emerald-500/50 border border-white/10 rounded-2xl text-left cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <strong className="text-white text-xs block font-bold">Ingresar como Dirigente Registrado</strong>
                    <span className="text-[10px] text-white/40 block">Acceso completo a calendarios, equipos y vocalía digital</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>

                <div className="pt-2 border-t border-white/10 text-center">
                  <p className="text-xs text-white/60 mb-2">¿Aún no tienes una liga creada?</p>
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      setOnboardingStep(1);
                      setShowOnboardingModal(true);
                    }}
                    className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-extrabold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Solicitar Registro de Liga con Agente</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SUPERADMIN (SOLO SI SESION ACTIVA) */}
            {loginTab === 'SUPERADMIN' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-300">
                  Panel de Control Maestro para Administradores de la Plataforma.
                </div>

                {isSuperAdminAuth ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Sesión activa de SuperAdmin</span>
                    </div>
                    <button
                      onClick={() => handleLoginRole('SUPER_ADMIN', 'master-admin')}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Abrir Panel Maestro SuperAdmin</span>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSaError('');
                      if (saPassword.trim() === '1326') {
                        onSuperAdminAuthSuccess?.();
                        setUserRole('SUPER_ADMIN');
                        setShowLoginModal(false);
                        onNavigateTab('master-admin');
                      } else {
                        setSaError('Contraseña incorrecta de SuperAdmin. Ingrese 1326.');
                      }
                    }}
                    className="space-y-3"
                  >
                    {saError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-bold">
                        {saError}
                      </div>
                    )}
                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">Correo Administrador</label>
                      <input
                        type="email"
                        required
                        placeholder="correo@admin.com"
                        value={saEmail}
                        onChange={(e) => setSaEmail(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">Contraseña</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={saPassword}
                        onChange={(e) => setSaPassword(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Ingresar como SuperAdmin</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DEMOSTRACIÓN VAR */}
      {showVarDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-red-500/40 rounded-3xl p-6 max-w-2xl w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowVarDemoModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">Demostración Interactiva del Kit VAR ($12)</h3>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000"
                alt="VAR Video Replay"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 flex flex-col justify-between">
                <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest self-start">
                  REPETICIÓN EN TABLET DE MESA
                </span>
                <div className="bg-black/80 p-3 rounded-xl border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold text-xs block">✓ Jugada Revisada: Posible Penalti Min. 87</span>
                  <p className="text-[11px] text-white/70">Dictamen del Árbitro VAR: Falta confirmada. Tarjeta amarilla asignada.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-white/60">Servicio gestionado mediante Cloudflare R2 WebSockets.</span>
              <button
                onClick={() => {
                  setShowVarDemoModal(false);
                  onNavigateTab('var');
                }}
                className="px-4 py-2 bg-red-500 text-black font-extrabold rounded-xl hover:bg-red-400 cursor-pointer"
              >
                Ir a Módulo VAR Completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
