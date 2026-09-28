import React, { useState, useMemo } from 'react';
import { 
  Shield, CreditCard, QrCode, CheckCircle2, AlertCircle, FileText, 
  Tv, Radio, Video, Play, Pause, ExternalLink, Share2, Settings, 
  Server, Wifi, Layers, Activity, Sparkles, Clock, Flame, Download, 
  Copy, Check, RotateCcw, Maximize2, Volume2, VolumeX, Smartphone, 
  Globe, Building2, HelpCircle, Send, ArrowRight, DollarSign,
  ChevronRight, Lock, Users, Award, RefreshCw, UploadCloud, Info
} from 'lucide-react';
import { Tenant, Sport, Match, Team, Player } from '../../types';

interface InscriptionsAndStreamingProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  onRegisterTeamSuccess?: (newTeam: Partial<Team>) => void;
  initialSubTab?: 'inscriptions' | 'rules' | 'streaming';
  initialSelectedMatchId?: string;
}

export const InscriptionsAndStreaming: React.FC<InscriptionsAndStreamingProps> = ({
  tenant,
  sport,
  matches,
  teams,
  players,
  onRegisterTeamSuccess,
  initialSubTab = 'inscriptions',
  initialSelectedMatchId
}) => {
  // Navigation between Inscriptions, Rules, and Open Source Streaming
  const [subTab, setSubTab] = useState<'inscriptions' | 'rules' | 'streaming'>(initialSubTab);

  // ----------------------------------------------------
  // SECTION 1: INSCRIPCIONES & PASARELA DE PAGO STATE
  // ----------------------------------------------------
  const [teamName, setTeamName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Primera Senior');
  const [delegateName, setDelegateName] = useState('');
  const [delegatePhone, setDelegatePhone] = useState('');
  const [delegateEmail, setDelegateEmail] = useState('');
  const [playerCount, setPlayerCount] = useState<number>(18);
  const [primaryColor, setPrimaryColor] = useState('#00e5ff');
  const [acceptRegulations, setAcceptRegulations] = useState(false);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'deuna_qr' | 'bank_transfer' | 'card'>('deuna_qr');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    receiptId: string;
    teamName: string;
    totalPaid: number;
    paymentMethod: string;
    paidAt: string;
  } | null>(null);

  // Bank Transfer receipt input
  const [bankRefNumber, setBankRefNumber] = useState('');
  const [bankFileAttached, setBankFileAttached] = useState(false);

  // Credit Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Cost calculations in USD
  const REGISTRATION_BASE_FEE = 35.00;
  const DISCIPLINE_WARRANTY_FEE = 30.00;
  const QR_CARNET_UNIT_PRICE = 1.50;
  const carnetsTotal = useMemo(() => playerCount * QR_CARNET_UNIT_PRICE, [playerCount]);
  const grandTotal = useMemo(() => REGISTRATION_BASE_FEE + DISCIPLINE_WARRANTY_FEE + carnetsTotal, [carnetsTotal]);

  // Handle payment execution
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptRegulations) {
      alert('Debes leer y aceptar el Reglamento Oficial de la Liga para formalizar la inscripción.');
      return;
    }
    if (!teamName.trim() || !delegateName.trim() || !delegatePhone.trim()) {
      alert('Por favor completa todos los datos requeridos del club y delegado.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const receipt = {
        receiptId: `DPV-INS-${Math.floor(100000 + Math.random() * 900000)}`,
        teamName: teamName.trim(),
        totalPaid: grandTotal,
        paymentMethod: paymentMethod === 'deuna_qr' ? 'Deuna / Payphone QR' : paymentMethod === 'bank_transfer' ? 'Transferencia Bancaria' : 'Tarjeta de Crédito / Débito',
        paidAt: new Date().toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })
      };
      setPaymentSuccessData(receipt);

      if (onRegisterTeamSuccess) {
        onRegisterTeamSuccess({
          name: teamName.trim(),
          primary_color: primaryColor,
          president_name: delegateName.trim(),
          category_id: selectedCategory
        });
      }
    }, 1800);
  };

  // ----------------------------------------------------
  // SECTION 2: STREAMING OPEN SOURCE (RTMP + YOUTUBE LIVE)
  // ----------------------------------------------------
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    initialSelectedMatchId || (matches[0]?.id || 'm-1')
  );
  const activeMatch = useMemo(() => {
    return matches.find(m => m.id === selectedMatchId) || matches[0];
  }, [matches, selectedMatchId]);

  // Ingest server mode (SRS vs Node Media Server)
  const [ingestServerType, setIngestServerType] = useState<'srs' | 'node_media'>('srs');
  const [privacySetting, setPrivacySetting] = useState<'unlisted' | 'public'>('unlisted');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDeployingApiStream, setIsDeployingApiStream] = useState(false);
  const [apiStreamDeployed, setApiStreamDeployed] = useState(false);

  // Player overlay state
  const [showScoreOverlay, setShowScoreOverlay] = useState(true);
  const [isPlayerMuted, setIsPlayerMuted] = useState(true);
  const [liveStreamQuality, setLiveStreamQuality] = useState<'1080p' | '720p'>('1080p');
  const [activeCameraAngle, setActiveCameraAngle] = useState<'CAM_1_MAIN' | 'CAM_2_VAR'>('CAM_1_MAIN');

  // Video feed sample: fallback YouTube Live streams for sports testing
  const [customYouTubeVideoId, setCustomYouTubeVideoId] = useState<string>('jfKfPfyJRdk'); // Live nature/sport stream fallback
  const [streamToast, setStreamToast] = useState<string | null>(null);

  const homeTeam = teams.find(t => t.id === activeMatch?.home_team_id) || { name: 'Local FC', primary_color: '#00e5ff' };
  const awayTeam = teams.find(t => t.id === activeMatch?.away_team_id) || { name: 'Visitante SC', primary_color: '#ff0055' };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleAutomateYouTubeLive = () => {
    setIsDeployingApiStream(true);
    setTimeout(() => {
      setIsDeployingApiStream(false);
      setApiStreamDeployed(true);
      setStreamToast(`✅ Transmisión YouTube Live programada vía API para ${activeMatch?.home_team_id ? `${homeTeam.name} vs ${awayTeam.name}` : 'el partido'}. ID vinculado con éxito.`);
      setTimeout(() => setStreamToast(null), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* TOAST FLOTANTE */}
      {streamToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-black font-black text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300 border border-emerald-300">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{streamToast}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL CON SEGMENTED TABS */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Oficial {tenant.sport_code || 'FUTBOL'}
              </span>
              <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5" /> Streaming RTMP Open Source
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              Inscripciones, Reglamento & Streaming en Vivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Gestión legal de la liga {tenant.name}: inscripción de clubes con pasarela de pago, normativa disciplinaria y despliegue de video en vivo a costo cero basado en SRS, RTMP y YouTube Live API.
            </p>
          </div>

          {/* SUB-TABS SELECTOR */}
          <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setSubTab('inscriptions')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'inscriptions'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Inscripciones & Pagos</span>
            </button>

            <button
              onClick={() => setSubTab('rules')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'rules'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Reglamento Oficial</span>
            </button>

            <button
              onClick={() => setSubTab('streaming')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'streaming'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Streaming Open Source</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SUBTAB 1: INSCRIPCIONES & PASARELA DE PAGOS */}
        {/* ---------------------------------------------------- */}
        {subTab === 'inscriptions' && (
          <div className="pt-6">
            {paymentSuccessData ? (
              /* RECIBO Y ACTA DIGITAL GENERADA TRAS EL PAGO */
              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-3xl p-8 max-w-2xl mx-auto space-y-6 text-center shadow-2xl relative">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                    Pago Exitoso & Club Inscrito
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3">
                    ¡Inscripción Formalizada con Éxito!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                    El club <strong className="text-amber-400">{paymentSuccessData.teamName}</strong> ha sido dado de alta oficialmente en los registros de {tenant.name}.
                  </p>
                </div>

                {/* Resumen del Comprobante */}
                <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 font-sans">N° Comprobante:</span>
                    <span className="text-white font-bold">{paymentSuccessData.receiptId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 font-sans">Monto Total Liquidado:</span>
                    <span className="text-emerald-400 font-black text-sm">${paymentSuccessData.totalPaid.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 font-sans">Método de Cobro:</span>
                    <span className="text-white">{paymentSuccessData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Fecha de Emisión:</span>
                    <span className="text-slate-300">{paymentSuccessData.paidAt}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      alert(`Descargando Acta Digital Oficial (${paymentSuccessData.receiptId}.pdf) con firma digital y código QR de validación.`);
                    }}
                    className="py-3 px-5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Acta Digital & QR</span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentSuccessData(null);
                      setTeamName('');
                      setDelegateName('');
                      setDelegatePhone('');
                    }}
                    className="py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Registrar Otro Equipo</span>
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULARIO DE INSCRIPCIÓN Y CHECKOUT */
              <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Izquierda: Datos del Club y Nómina (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      1. Ficha del Club & Representación Legal
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-slate-300 font-semibold block">Nombre Oficial del Club / Equipo *</label>
                        <input
                          type="text"
                          required
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Ej: Club Deportivo Los Andes"
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold block">Categoría de Competición *</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                        >
                          <option value="Primera Senior">Primera Senior (Libre)</option>
                          <option value="Segunda Categoría">Segunda Categoría (Ascenso)</option>
                          <option value="Máster 40">Máster 40+ Años</option>
                          <option value="Femenino Honor">Femenino de Honor</option>
                          <option value="Juvenil U-18">Juvenil Sub-18</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold block">Color Principal de Uniforme</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                          />
                          <span className="font-mono text-slate-400 uppercase text-xs">{primaryColor}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold block">Nombre del Delegado / Presidente *</label>
                        <input
                          type="text"
                          required
                          value={delegateName}
                          onChange={(e) => setDelegateName(e.target.value)}
                          placeholder="Ej: Roberto Gómez M."
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold block">WhatsApp para Citaciones & Vocalía *</label>
                        <input
                          type="tel"
                          required
                          value={delegatePhone}
                          onChange={(e) => setDelegatePhone(e.target.value)}
                          placeholder="Ej: +593 99 876 5432"
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-slate-300 font-semibold block">Correo Electrónico de Contacto</label>
                        <input
                          type="email"
                          value={delegateEmail}
                          onChange={(e) => setDelegateEmail(e.target.value)}
                          placeholder="delegado@clublosandes.ec"
                          className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nómina y Carnets Iniciales */}
                  <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                      <Users className="w-4 h-4 text-cyan-400" />
                      2. Emisión de Carnets Digitales QR Anti-Suplantación
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-white block">Número de Jugadores a Carnetizar</span>
                        <span className="text-slate-400 text-[11px]">Mínimo reglamentario: 12 jugadores / Máximo: 25.</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPlayerCount(Math.max(12, playerCount - 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-base font-bold text-cyan-400 w-8 text-center">{playerCount}</span>
                        <button
                          type="button"
                          onClick={() => setPlayerCount(Math.min(25, playerCount + 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-300 text-[11px] flex items-start gap-2.5">
                      <QrCode className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                      <span>
                        Cada jugador recibe su credencial 3D con código QR dinámico compatible con la Vocalía Digital en cancha. Sin necesidad de imprimir carnets físicos de plástico.
                      </span>
                    </div>
                  </div>

                  {/* Aceptación de Reglamento */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="regulations_checkbox"
                      checked={acceptRegulations}
                      onChange={(e) => setAcceptRegulations(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 mt-0.5 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="regulations_checkbox" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
                      Declaro como delegado oficial que he leído y acepto el <button type="button" onClick={() => setSubTab('rules')} className="text-amber-400 underline font-bold hover:text-amber-300">Reglamento Oficial de Competición y Régimen Disciplinario</button> de la Liga {tenant.name}, comprometiendo a mi club al juego limpio y cumplimiento de vocalías.
                    </label>
                  </div>
                </div>

                {/* Columna Derecha: Pasarela de Pago & Checkout (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      3. Liquidación & Pasarela de Pagos
                    </h3>

                    {/* Desglose de Costos */}
                    <div className="space-y-2 text-xs border-b border-white/10 pb-4">
                      <div className="flex justify-between text-slate-300">
                        <span>Cuota de Inscripción Oficial Liga:</span>
                        <span className="font-mono text-white font-semibold">${REGISTRATION_BASE_FEE.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Garantía Disciplinaria (Reembolsable):</span>
                        <span className="font-mono text-white font-semibold">${DISCIPLINE_WARRANTY_FEE.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{playerCount} Carnets Digitales QR ($1.50 c/u):</span>
                        <span className="font-mono text-cyan-400 font-semibold">${carnetsTotal.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/5">
                        <span>Total a Liquidar:</span>
                        <span className="font-mono text-emerald-400">${grandTotal.toFixed(2)} USD</span>
                      </div>
                    </div>

                    {/* Selector de Método de Pago */}
                    <div className="space-y-3">
                      <label className="text-slate-300 text-xs font-semibold block">Selecciona Método de Pago:</label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('deuna_qr')}
                          className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                            paymentMethod === 'deuna_qr'
                              ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <QrCode className="w-4 h-4 text-amber-400" />
                          <span className="text-[11px]">Deuna / QR</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank_transfer')}
                          className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                            paymentMethod === 'bank_transfer'
                              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-[11px]">Transferencia</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                            paymentMethod === 'card'
                              ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          <span className="text-[11px]">Tarjeta</span>
                        </button>
                      </div>
                    </div>

                    {/* INTERFAZ ESPECÍFICA SEGÚN MÉTODO DE PAGO */}
                    {paymentMethod === 'deuna_qr' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-center space-y-3">
                        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <QrCode className="w-4 h-4" /> Cobro Instantáneo Banco Pichincha / Deuna
                        </div>
                        {/* Simulación visual de QR code */}
                        <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=DEPORVERSO-INSC-${grandTotal}-${encodeURIComponent(teamName || 'EQUIPO')}`}
                            alt="Código QR Deuna"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Abre tu app <strong className="text-amber-300">Deuna</strong> o banca móvil y escanea el código para transferir <strong className="text-white">${grandTotal.toFixed(2)} USD</strong> a la cuenta de la Liga.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3 text-xs">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" /> Datos de la Cuenta Oficial de la Liga:
                        </div>
                        <div className="p-2.5 bg-slate-900 rounded-lg space-y-1 font-mono text-[11px] text-slate-300">
                          <div><strong>Banco:</strong> Banco Pichincha (Cta. Corriente)</div>
                          <div><strong>N° de Cuenta:</strong> 2100847291</div>
                          <div><strong>Titular:</strong> {tenant.name}</div>
                          <div><strong>RUC:</strong> 1792458901001</div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="text-slate-300 font-semibold block text-[11px]">Número de Comprobante / Referencia:</label>
                          <input
                            type="text"
                            value={bankRefNumber}
                            onChange={(e) => setBankRefNumber(e.target.value)}
                            placeholder="Ej: 98451270"
                            className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setBankFileAttached(!bankFileAttached)}
                            className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              bankFileAttached
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                          >
                            <UploadCloud className="w-4 h-4 text-cyan-400" />
                            <span>{bankFileAttached ? '✓ Comprobante Adjunto' : 'Adjuntar Recibo (PDF/JPG)'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3 text-xs">
                        <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
                          <span>Pago con Tarjeta (Stripe 3DS)</span>
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Nombre del Titular de la Tarjeta"
                            className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                          />
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Número de Tarjeta (4242 4242 ...)"
                            className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                              className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                            />
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="CVC / CVV"
                              className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botón de Checkout */}
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Procesando Pago Seguro...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>Pagar Inscripción (${grandTotal.toFixed(2)} USD)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB 2: REGLAMENTO OFICIAL & RÉGIMEN DISCIPLINARIO */}
        {/* ---------------------------------------------------- */}
        {subTab === 'rules' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Sistema de Puntuación */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3 shadow-md hover:border-amber-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-sm">Sistema de Puntuación</h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Victoria Oficial:</span> <strong className="text-white">3 Puntos</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Empate Reglamentario:</span> <strong className="text-white">1 Punto</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Derrota en Cancha:</span> <strong className="text-white">0 Puntos</strong>
                  </li>
                  <li className="flex justify-between text-rose-400">
                    <span>No Presentación (W.O.):</span> <strong>-1 Punto & Pérdida</strong>
                  </li>
                </ul>
              </div>

              {/* Multas Disciplinarias */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3 shadow-md hover:border-rose-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-rose-400 uppercase tracking-wider text-sm">Multas Disciplinarias (USD)</h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Tarjeta Amarilla:</span> <strong className="text-amber-400 font-mono">$1.00 USD</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Tarjeta Roja Directa:</span> <strong className="text-rose-400 font-mono">$5.00 USD + 1 Fecha</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Ausencia de Vocal de Mesa:</span> <strong className="text-rose-400 font-mono">$20.00 USD</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Uniforme Incompleto:</span> <strong className="text-amber-400 font-mono">$3.00 USD</strong>
                  </li>
                </ul>
              </div>

              {/* Acreditación y Reglas de Campo */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-3 shadow-md hover:border-cyan-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-sm">Acreditación & Vocalía</h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Credencial QR Obligatoria:</span> <strong className="text-cyan-400">PWA Digital</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Cambios por Partido:</span> <strong className="text-white">Hasta 5 sustituciones</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Tolerancia de Inicio:</span> <strong className="text-white">15 Minutos</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Cierre de Vocalía Digital:</span> <strong className="text-emerald-400">Firma Biométrica</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* Articulado General de la Competición */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                <FileText className="w-4 h-4 text-amber-400" />
                Estatutos y Convivencia Deportiva — Temporada Oficial 2026
              </h4>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>
                  <strong>Artículo 1 (Ámbito de Aplicación):</strong> El presente reglamento rige para todos los clubes, dirigentes, delegados, deportistas y cuerpo técnico inscritos en la Liga {tenant.name}. La participación en el torneo implica la aceptación irrestricta de estas disposiciones.
                </p>
                <p>
                  <strong>Artículo 2 (Vocalía Digital & Mesa de Control):</strong> Los partidos serán controlados mediante la aplicación oficial PWA Deporverso. Es responsabilidad del vocal designado verificar la cédula o credencial QR de cada jugador antes de su ingreso a la cancha.
                </p>
                <p>
                  <strong>Artículo 3 (Uso del VAR a la Carta):</strong> En las instancias autorizadas por la Comisión Técnica, los capitanes tendrán derecho a solicitar revisiones de jugadas decisivas (goles dudosos, penales, confusión de identidad y tarjetas rojas directas) conforme al protocolo de baja latencia establecido.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUBTAB 3: STREAMING OPEN SOURCE (RTMP + YOUTUBE LIVE) */}
        {/* ---------------------------------------------------- */}
        {subTab === 'streaming' && (
          <div className="pt-6 space-y-8">
            {/* Banner Explicativo de la Arquitectura Híbrida Open Source */}
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-black p-6 rounded-2xl border border-cyan-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" /> Arquitectura Híbrida RTMP + YouTube Live API
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Costo Cero en Licencias de Video
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Despliegue de la Infraestructura de Streaming Open Source
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Para evitar pagar licencias de video masivas, Deporverso implementa una arquitectura híbrida de alto rendimiento: el teléfono en cancha envía la señal de video cruda por <strong>RTMP</strong> a un servidor de ingesta ultraligero (<strong>SRS</strong> o <strong>Node Media Server</strong>), el cual se automatiza con la <strong>API de YouTube Live</strong> para programar transmisiones ocultas o públicas por partido, e incrusta el reproductor en la PWA con un <strong>marcador superpuesto (overlay de TV)</strong> en tiempo real.
              </p>
            </div>

            {/* SELECTOR DE PARTIDO EN VIVO PARA GESTIÓN DEL STREAM */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Partido Seleccionado para Transmisión:</span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400">{homeTeam.name}</span>
                    <span className="text-slate-400 text-xs">vs</span>
                    <span className="text-rose-400">{awayTeam.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {matches.map(m => {
                    const h = teams.find(t => t.id === m.home_team_id)?.name || 'Local';
                    const a = teams.find(t => t.id === m.away_team_id)?.name || 'Visitante';
                    return (
                      <option key={m.id} value={m.id}>
                        {h} vs {a} ({m.status === 'IN_PROGRESS' ? 'EN VIVO' : 'Programado'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* SECCIÓN PRINCIPAL: REPRODUCTOR EMBEBIDO CON MARCADOR SUPERPUESTO (LIVE OVERLAY) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  Incrustación en la PWA: Reproductor Embebido con Marcador Superpuesto
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowScoreOverlay(!showScoreOverlay)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      showScoreOverlay 
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{showScoreOverlay ? 'Marcador TV Activo' : 'Ocultar Marcador'}</span>
                  </button>

                  <button
                    onClick={() => setIsPlayerMuted(!isPlayerMuted)}
                    className="p-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs transition-colors cursor-pointer"
                    title={isPlayerMuted ? 'Activar Audio' : 'Silenciar'}
                  >
                    {isPlayerMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              {/* CONTENEDOR DEL REPRODUCTOR CON OVERLAY */}
              <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-black group">
                {/* IFRAME EMBEBIDO DE YOUTUBE LIVE */}
                <iframe
                  title="Transmisión en Vivo del Partido"
                  src={`https://www.youtube.com/embed/${customYouTubeVideoId}?autoplay=1&mute=${isPlayerMuted ? '1' : '0'}&controls=1&modestbranding=1&rel=0`}
                  className="w-full h-full object-cover border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>

                {/* MARCADOR SUPERPUESTO (TV BROADCAST LIVE GRAPHIC OVERLAY) */}
                {showScoreOverlay && (
                  <div className="absolute top-4 left-4 right-4 pointer-events-none flex flex-col gap-2 transition-all">
                    {/* Cintillo Superior de Televisión */}
                    <div className="self-start flex items-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-2xl">
                      {/* LIVE BADGE */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 rounded-xl text-white font-black text-[10px] tracking-wider uppercase mr-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        <span>LIVE</span>
                      </div>

                      {/* HOME TEAM */}
                      <div className="flex items-center gap-2 px-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: homeTeam.primary_color }}></span>
                        <span className="text-white font-black text-xs sm:text-sm tracking-tight">{homeTeam.name}</span>
                        <span className="text-amber-400 font-mono font-black text-base sm:text-lg bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                          {activeMatch?.home_score ?? 2}
                        </span>
                      </div>

                      <span className="text-white/40 font-mono text-xs px-1">-</span>

                      {/* AWAY TEAM */}
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-amber-400 font-mono font-black text-base sm:text-lg bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                          {activeMatch?.away_score ?? 1}
                        </span>
                        <span className="text-white font-black text-xs sm:text-sm tracking-tight">{awayTeam.name}</span>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: awayTeam.primary_color }}></span>
                      </div>

                      {/* PERIOD & TIMER */}
                      <div className="border-l border-white/20 pl-2.5 ml-1 flex items-center gap-1.5 font-mono text-xs text-cyan-300 font-bold">
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">2T</span>
                        <span>74:18</span>
                      </div>
                    </div>

                    {/* TICKER INFERIOR FLOTANTE DE EVENTOS RECIENTES */}
                    <div className="self-start bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/15 px-3 py-1.5 text-[11px] text-white flex items-center gap-2 shadow-lg">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" /> Min 68':
                      </span>
                      <span className="text-slate-200">
                        ¡Gol de Carlos Morales! Asistencia de L. Paredes para {homeTeam.name}.
                      </span>
                    </div>
                  </div>
                )}

                {/* CONTROLES RÁPIDOS EN PANTALLA */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2.8 Mbps</span>
                  </span>
                  <span>|</span>
                  <span className="text-cyan-400">{liveStreamQuality}</span>
                  <span>|</span>
                  <span className="text-amber-400 font-bold">SRS Ingest</span>
                </div>
              </div>
            </div>

            {/* DETALLE TÉCNICO DE LOS 2 PILARES: INGESTA RTMP Y YOUTUBE LIVE API */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* PILAR 1: EL SERVIDOR DE INGESTA (SRS / NODE MEDIA SERVER) */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-white text-sm">1. El Servidor de Ingesta (Self-Hosted)</h4>
                  </div>
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setIngestServerType('srs')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        ingestServerType === 'srs' ? 'bg-amber-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      SRS Server
                    </button>
                    <button
                      type="button"
                      onClick={() => setIngestServerType('node_media')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        ingestServerType === 'node_media' ? 'bg-amber-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Node Media
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para tener control absoluto antes de salir a YouTube, levanta una instancia ligera de <strong>{ingestServerType === 'srs' ? 'SRS (Simple Real-Time Server)' : 'Node Media Server'}</strong> en un VPS económico ($3-$5 USD/mes) o contenedor local. Este servidor recibe la señal de video cruda del teléfono en la cancha.
                </p>

                {/* RTMP PUSH URL & STREAM KEY */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>URL de Ingesta RTMP:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('rtmp://live.deporverso.com:1935/live', 'url')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url' ? 'Copiado' : 'Copiar URL'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10 text-slate-200 truncate">
                      rtmp://live.deporverso.com:1935/live
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Clave de Transmisión (Stream Key) para {homeTeam.name} vs {awayTeam.name}:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`dpv_live_${selectedMatchId}_token771`, 'key')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'key' ? 'Copiado' : 'Copiar Clave'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/25 text-amber-300 truncate">
                      dpv_live_{selectedMatchId}_token771
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-200 block">App Móvil para el Camarógrafo en Cancha:</span>
                  <span>Configura estos datos en <strong>Larix Broadcaster</strong> o <strong>Prism Live</strong> en el teléfono celular. Listo para emitir en 1080p a 30 FPS sin coste de licencias.</span>
                </div>
              </div>

              {/* PILAR 2: LA AUTOMATIZACIÓN VÍA YOUTUBE LIVE API */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-rose-400" />
                    <h4 className="font-bold text-white text-sm">2. La Automatización vía YouTube Live API</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded font-bold">
                    YouTube Live v3 API
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Utiliza la API de YouTube Live para programar automáticamente una transmisión oculta o pública por cada partido agendado en el fixture de la liga. El ID del stream se vincula directamente al partido en la base de datos de Deporverso.
                </p>

                {/* CONFIGURACIÓN Y DESPLIEGUE AUTOMATIZADO */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">Privacidad del Stream Automático:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrivacySetting('unlisted')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          privacySetting === 'unlisted' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        Oculto (Unlisted)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrivacySetting('public')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          privacySetting === 'public' ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        Público
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {privacySetting === 'unlisted'
                      ? '🔒 Solo accesible dentro de la PWA Deporverso para seguidores autorizados.'
                      : '🌍 Abierto en el canal de YouTube de la Liga para máxima audiencia y monetización.'}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAutomateYouTubeLive}
                      disabled={isDeployingApiStream}
                      className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDeployingApiStream ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Programando Broadcast en YouTube Live API...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{apiStreamDeployed ? '✓ Stream API Vinculado (Re-programar)' : 'Programar Stream vía YouTube Live API'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ESTADO VINCULADO AL PARTIDO */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 font-mono text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>ID del Partido en Deporverso:</span>
                    <span className="text-white font-bold">{activeMatch?.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>YouTube Broadcast ID:</span>
                    <span className="text-cyan-400 font-bold">yt_live_{selectedMatchId.replace(/-/g, '_')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Enlace Compartible:</span>
                    <span className="text-slate-300">https://youtu.be/{customYouTubeVideoId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
