import React, { useState } from 'react';
import { 
  Building2, Users, Trophy, Shield, ArrowRight, ArrowLeft, CheckCircle2, 
  MessageSquare, Phone, CreditCard, QrCode, Sparkles, X, DollarSign, 
  Check, Copy, ExternalLink, FileText, Sliders, Calendar, Flame, 
  Layers, AlertCircle, Send, Smartphone, ShieldCheck, Star, Clock, 
  HelpCircle, ChevronRight, Hash, Eye
} from 'lucide-react';
import { SportCode, Tenant } from '../../types';

export interface AffiliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAffiliationSuccess?: (newTenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  onAddTenant?: (newTenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  initialSport?: SportCode;
}

import { 
  SPORTS_CATALOG, 
  getExampleTeamsForSport, 
  getSegmentsForSport, 
  ExampleTeam, 
  LeagueSegment 
} from '../../data/sportTemplates';

// WhatsApp Admin Target
const ADMIN_WHATSAPP_NUMBER = '0958610578';
const ADMIN_WHATSAPP_INTERNATIONAL = '593958610578';

export const AffiliationModal: React.FC<AffiliationModalProps> = ({
  isOpen,
  onClose,
  onAffiliationSuccess,
  onAddTenant,
  initialSport = 'FUTBOL'
}) => {
  // Navigation Steps:
  // 1: Datos de la Liga y Solicitante
  // 2: Plantilla Interactiva (5 Equipos + 3 Segmentos) y Bifurcación de Decisión
  // 3_PAY: Pasarela de Pagos (Si acepta la plantilla estándar)
  // 3_CUSTOM: Solicitud de Personalización a WhatsApp 0958610578
  // 4_SUCCESS: Éxito / Confirmación
  const [currentStep, setCurrentStep] = useState<'FORM' | 'TEMPLATE' | 'PAYMENT' | 'CUSTOMIZE' | 'SUCCESS'>('FORM');

  // Form State
  const [leagueName, setLeagueName] = useState('Liga Deportiva Barrial Pichincha');
  const [leaderName, setLeaderName] = useState('Ing. Patricio Cárdenas');
  const [leaderPhone, setLeaderPhone] = useState('0991234567');
  const [leaderEmail, setLeaderEmail] = useState('presidencia@ligapichincha.com');
  const [selectedSport, setSelectedSport] = useState<SportCode>(initialSport);
  const [cityCountry, setCityCountry] = useState('Quito, Ecuador');
  const [estimatedTeams, setEstimatedTeams] = useState<number>(12);

  // Template Interactive Sub-tab
  const [templateTab, setTemplateTab] = useState<'TEAMS' | 'SEGMENTS'>('TEAMS');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-1');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('seg-senior');

  // Customization Request State
  const [customTeamsCount, setCustomTeamsCount] = useState('16');
  const [customCategories, setCustomCategories] = useState({
    sub12: false,
    sub15: true,
    sub18: false,
    segundaDivision: true,
    master50: true,
    femeninoSub20: false,
    indoorFutsal: false
  });
  const [customFeatures, setCustomFeatures] = useState({
    varModule: true,
    pvcCardNfc: true,
    excelMigration: true,
    liveStreaming: false,
    offlinePwa: true
  });
  const [customNotes, setCustomNotes] = useState(
    'Deseamos migrar el archivo histórico de 320 jugadores en Excel y habilitar el VAR para los clásicos de la primera división.'
  );

  // Payment Gateway State
  const [billingPlan, setBillingPlan] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'EXPRESS'>('CARD');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Patricio Cárdenas');
  const [bankRef, setBankRef] = useState('BP-98234712');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceiptId, setPaymentReceiptId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Dynamic Teams and Segments for selected sport
  const currentTeams = getExampleTeamsForSport(selectedSport);
  const currentSegments = getSegmentsForSport(selectedSport);

  // Selected Team Object
  const currentSelectedTeam = currentTeams.find(t => t.id === selectedTeamId) || currentTeams[0];
  const currentSelectedSegment = currentSegments.find(s => s.id === selectedSegmentId) || currentSegments[0];

  // Calculated Pricing
  const annualPrice = 180.00; // $15/mes facturado anualmente ($180)
  const monthlyPrice = 19.99;
  const currentPrice = billingPlan === 'ANNUAL' ? annualPrice : monthlyPrice;

  // Slug generation
  const leagueSlug = (leagueName || 'liga').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const targetSubdomain = `${leagueSlug}.deporverso.com`;

  // Helper to format WhatsApp message for Standard Accepted Affiliation
  const getStandardPaidWhatsappMessage = (receiptId: string) => {
    return `🚨 *NUEVA AFILIACIÓN PAGADA - DEPORVERSO* 🚨\n\n` +
      `¡Hola Administrador de DeporVerso! Se ha procesado el pago de una nueva afiliación con la *Plantilla Estándar* aprobada.\n\n` +
      `📋 *DATOS DE LA ORGANIZACIÓN:*\n` +
      `• *Liga:* ${leagueName}\n` +
      `• *Dirigente / Solicitante:* ${leaderName}\n` +
      `• *Teléfono:* ${leaderPhone}\n` +
      `• *Correo:* ${leaderEmail}\n` +
      `• *Ubicación:* ${cityCountry}\n` +
      `• *Disciplina:* ${selectedSport}\n` +
      `• *Subdominio asignado:* https://${targetSubdomain}\n\n` +
      `📦 *PLANTILLA ESTÁNDAR SELECCIONADA:*\n` +
      `• *5 Equipos de Base:* Atlético Central, Dep. La Cantera, Estrella del Valle, Huracán, Sporting Relámpago\n` +
      `• *3 Segmentos Reglamentarios:* Máster +40, Senior Primera División, Femenina Libre\n\n` +
      `💳 *DETALLE DE LA TRANSACCIÓN:*\n` +
      `• *Plan:* ${billingPlan === 'ANNUAL' ? 'Licencia Anual ($180.00 USD)' : 'Plan Mensual ($19.99 USD)'}\n` +
      `• *Método de Pago:* ${paymentMethod === 'CARD' ? 'Tarjeta de Crédito / Débito' : paymentMethod === 'TRANSFER' ? 'Transferencia Bancaria (Ref: ' + bankRef + ')' : 'Pasarela Express'}\n` +
      `• *Comprobante ID:* ${receiptId}\n` +
      `• *Estado:* PAGO CONFIRMADO / ACTIVO\n\n` +
      `⚡ *Solicito la entrega inmediata de credenciales administrativas y activación del servidor.*`;
  };

  // Helper to format WhatsApp message for Customization Assistance
  const getCustomizationWhatsappMessage = () => {
    const selectedCatsList: string[] = [];
    if (customCategories.sub12) selectedCatsList.push('Sub-12');
    if (customCategories.sub15) selectedCatsList.push('Sub-15');
    if (customCategories.sub18) selectedCatsList.push('Sub-18');
    if (customCategories.segundaDivision) selectedCatsList.push('Segunda División');
    if (customCategories.master50) selectedCatsList.push('Máster +50');
    if (customCategories.femeninoSub20) selectedCatsList.push('Femenino Sub-20');
    if (customCategories.indoorFutsal) selectedCatsList.push('Indor / Fútsal Nocturno');

    const selectedFeaturesList: string[] = [];
    if (customFeatures.varModule) selectedFeaturesList.push('Módulo VAR Móvil en cancha');
    if (customFeatures.pvcCardNfc) selectedFeaturesList.push('Carnets PVC físicos con NFC/QR');
    if (customFeatures.excelMigration) selectedFeaturesList.push('Migración de planillas Excel históricas');
    if (customFeatures.liveStreaming) selectedFeaturesList.push('Transmisión en vivo y Crónicas IA');
    if (customFeatures.offlinePwa) selectedFeaturesList.push('Vocalía Digital Offline PWA');

    return `🛠️ *SOLICITUD DE AFILIACIÓN PERSONALIZADA - DEPORVERSO* 🛠️\n\n` +
      `Hola Administrador de DeporVerso (*Telf: 0958610578*), deseo asistencia para personalizar la plataforma de mi liga deportiva:\n\n` +
      `📋 *DATOS DEL SOLICITANTE:*\n` +
      `• *Liga:* ${leagueName}\n` +
      `• *Presidente / Dirigente:* ${leaderName}\n` +
      `• *WhatsApp / Teléfono:* ${leaderPhone}\n` +
      `• *Correo:* ${leaderEmail}\n` +
      `• *Ciudad / País:* ${cityCountry}\n` +
      `• *Disciplina Deportiva:* ${selectedSport}\n` +
      `• *Subdominio proyectado:* https://${targetSubdomain}\n\n` +
      `⚙️ *REQUERIMIENTOS PERSONALIZADOS:*\n` +
      `• *Cantidad de Equipos Requeridos:* ${customTeamsCount} equipos\n` +
      `• *Categorías Solicitadas:* ${selectedCatsList.length > 0 ? selectedCatsList.join(', ') : 'A convenir con el asesor'}\n` +
      `• *Servicios Adicionales:* ${selectedFeaturesList.length > 0 ? selectedFeaturesList.join(', ') : 'Básicos'}\n` +
      `• *Observaciones / Notas Especiales:* "${customNotes}"\n\n` +
      `🤝 *Solicito contacto directo por WhatsApp para asesoría y propuesta económica a la medida.*`;
  };

  // Open WhatsApp to admin
  const handleOpenAdminWhatsapp = (message: string) => {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${ADMIN_WHATSAPP_INTERNATIONAL}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Trigger SMS app
  const handleSendAdminSms = (message: string) => {
    const encoded = encodeURIComponent(message);
    const smsUrl = `sms:+${ADMIN_WHATSAPP_INTERNATIONAL}?body=${encoded}`;
    window.location.href = smsUrl;
  };

  // Copy message to clipboard
  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Process Payment Submit
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedReceipt = `DPV-PAY-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaymentReceiptId(generatedReceipt);
      setIsProcessingPayment(false);
      setCurrentStep('SUCCESS');

      // Create new tenant if callback provided
      const notifyCallback = onAffiliationSuccess || onAddTenant;
      if (notifyCallback) {
        notifyCallback({
          name: leagueName,
          slug: leagueSlug,
          sport_code: selectedSport,
          country: 'Ecuador',
          currency: 'USD',
          domain: targetSubdomain,
          is_active: true,
          annual_license_fee: currentPrice,
          admin_key: `DV-${leagueSlug.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-ADM`,
          plan_tier: 'PRO_5'
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-3xl max-w-4xl w-full text-white shadow-2xl shadow-cyan-950/80 my-4 flex flex-col max-h-[92vh] overflow-hidden relative">
        
        {/* TOP BAR / HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Afiliación Oficial a DeporVerso
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Atención Directa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>WhatsApp Administrador:</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {ADMIN_WHATSAPP_NUMBER}
                </span>
                <span className="hidden sm:inline text-slate-500">• Cotización y soporte 24/7</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS INDICATOR */}
        <div className="px-4 py-2.5 bg-slate-950/50 border-b border-white/5 flex items-center justify-between text-[11px] font-mono shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 mx-auto">
            <div className={`flex items-center gap-1.5 ${currentStep === 'FORM' ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'FORM' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span>Datos Liga</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <div className={`flex items-center gap-1.5 ${currentStep === 'TEMPLATE' ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'TEMPLATE' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span>Plantilla de Demostración</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <div className={`flex items-center gap-1.5 ${['PAYMENT', 'CUSTOMIZE', 'SUCCESS'].includes(currentStep) ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${['PAYMENT', 'CUSTOMIZE', 'SUCCESS'].includes(currentStep) ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span>{currentStep === 'PAYMENT' ? 'Pasarela de Cobro' : currentStep === 'CUSTOMIZE' ? 'Personalización WhatsApp' : 'Activación'}</span>
            </div>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* PASO 1: FORMULARIO DE DATOS DE LA LIGA */}
          {/* ========================================================================= */}
          {currentStep === 'FORM' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  PASO 1 DE 3 • REGISTRO DE AFILIACIÓN
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white pt-2">
                  Cuéntanos sobre tu Liga Deportiva
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Te generaremos de inmediato una <strong className="text-cyan-300">plantilla en vivo de demostración</strong> con 5 equipos y 3 segmentos oficiales para tu liga.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!leagueName.trim()) return;
                  setCurrentStep('TEMPLATE');
                }} 
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Nombre Oficial de la Liga u Organización *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leagueName}
                      onChange={(e) => setLeagueName(e.target.value)}
                      placeholder="Ej. Liga Deportiva Barrial San Roque"
                      className="w-full bg-[#121824] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
                    />
                    <div className="text-[11px] text-cyan-400/80 font-mono flex items-center gap-1 mt-1">
                      <span>Tu subdominio asignado será:</span>
                      <strong className="text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        {targetSubdomain}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Presidente / Dirigente Responsable *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="Ej. Ing. Patricio Cárdenas"
                      className="w-full bg-[#121824] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp / Teléfono de Contacto *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="Ej. 0991234567"
                      className="w-full bg-[#121824] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="admin@liga.com"
                      className="w-full bg-[#121824] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Ciudad y País *</label>
                    <input
                      type="text"
                      required
                      value={cityCountry}
                      onChange={(e) => setCityCountry(e.target.value)}
                      placeholder="Ej. Quito, Ecuador"
                      className="w-full bg-[#121824] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 block">
                        Disciplina Deportiva Principal (Todo Deporte para Liga & Automatización):
                      </label>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {SPORTS_CATALOG.length} Deportes Disponibles
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 p-1 bg-black/40 rounded-2xl border border-slate-800">
                      {SPORTS_CATALOG.map((s) => (
                        <button
                          key={s.code}
                          type="button"
                          onClick={() => {
                            setSelectedSport(s.code);
                            const newTeams = getExampleTeamsForSport(s.code);
                            if (newTeams.length > 0) setSelectedTeamId(newTeams[0].id);
                            const newSegs = getSegmentsForSport(s.code);
                            if (newSegs.length > 0) setSelectedSegmentId(newSegs[0].id);
                          }}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            selectedSport === s.code
                              ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                              : 'bg-[#121824] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{s.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold block text-white truncate">{s.name}</span>
                            <span className="text-[9px] font-mono text-cyan-300/80 block truncate mt-0.5">{s.badge}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Seleccionado: <strong className="text-cyan-300">{SPORTS_CATALOG.find(x => x.code === selectedSport)?.name}</strong> — {SPORTS_CATALOG.find(x => x.code === selectedSport)?.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                  >
                    <span>Ver Plantilla Demostrativa de mi Liga</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 2: PLANTILLA INTERACTIVA DE DEMOSTRACIÓN (5 EQUIPOS + 3 SEGMENTOS) */}
          {/* ========================================================================= */}
          {currentStep === 'TEMPLATE' && (
            <div className="space-y-6">
              {/* Header preview of the league */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-2xl border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      MAQUETA EN VIVO
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {cityCountry}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>{leagueName}</span>
                    <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono">
                      {selectedSport}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span>Subdominio asignado:</span>
                    <span className="text-cyan-300 font-mono font-bold">{targetSubdomain}</span>
                    <span className="text-slate-500">| Dirigente: {leaderName} ({leaderPhone})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setCurrentStep('FORM')}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Modificar Datos</span>
                  </button>
                </div>
              </div>

              {/* TABS SELECTOR: 5 EQUIPOS VS 3 SEGMENTOS */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setTemplateTab('TEAMS')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    templateTab === 'TEAMS'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>5 Equipos de Ejemplo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('SEGMENTS')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    templateTab === 'SEGMENTS'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>3 Segmentos de Liga</span>
                </button>
              </div>

              {/* SUB-VIEW 1: 5 EQUIPOS DE EJEMPLO */}
              {templateTab === 'TEAMS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Selecciona un club para inspeccionar su ficha técnica, indumentaria y plantilla:
                    </span>
                    <span className="font-mono text-cyan-400 font-bold text-[11px]">
                      5 Clubes Preconfigurados
                    </span>
                  </div>

                  {/* Horizontal Team selector pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {currentTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeamId(team.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          selectedTeamId === team.id
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{team.badgeEmoji}</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: team.primaryColor }}
                            title={`Color: ${team.primaryColor}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white leading-tight truncate">
                            {team.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {team.playersCount} atletas
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* DETALLE DEL EQUIPO SELECCIONADO */}
                  <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Club Presentation Card */}
                    <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 lg:pr-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/20"
                          style={{ backgroundColor: currentSelectedTeam.primaryColor }}
                        >
                          {currentSelectedTeam.badgeEmoji}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                            FICHA TÉCNICA DE CLUB
                          </span>
                          <h4 className="text-lg font-black text-white leading-tight">
                            {currentSelectedTeam.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            {currentSelectedTeam.formation}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 bg-[#101726] p-3 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Delegado Oficial:</span>
                          <span className="font-bold text-white">{currentSelectedTeam.delegate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Teléfono Delegado:</span>
                          <span className="font-mono text-cyan-300">{currentSelectedTeam.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Capitán Designado:</span>
                          <span className="font-bold text-amber-300">{currentSelectedTeam.captain}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Total Habilitados:</span>
                          <span className="font-mono text-emerald-400 font-bold">{currentSelectedTeam.playersCount} jugadores</span>
                        </div>
                      </div>

                      {/* Jersey Visual Color Swatch */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-semibold">Indumentaria Oficial:</span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-5 h-5 rounded-md border border-white/30" 
                            style={{ backgroundColor: currentSelectedTeam.primaryColor }}
                            title="Color Primario"
                          />
                          <span 
                            className="w-5 h-5 rounded-md border border-white/30" 
                            style={{ backgroundColor: currentSelectedTeam.secondaryColor }}
                            title="Color Secundario"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Roster & Digital QR Carnet Preview */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Muestra de Plantilla con Carnetización QR Digital Activa:</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          Sincronizado en Mesa
                        </span>
                      </div>

                      <div className="space-y-2">
                        {currentSelectedTeam.keyPlayers.map((player) => (
                          <div 
                            key={player.number}
                            className="bg-[#121824] hover:bg-[#182132] p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-xs border border-white/20 shadow-sm"
                                style={{ backgroundColor: currentSelectedTeam.primaryColor, color: currentSelectedTeam.textColor }}
                              >
                                {player.number}
                              </span>
                              <div>
                                <span className="font-bold text-white block leading-tight">{player.name}</span>
                                <span className="text-[10px] text-slate-400">{player.position}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>QR Verificado</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                                Cédula EC
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
                        💡 En el sistema final de tu liga podrás añadir, modificar o importar masivamente todos los jugadores y clubes que requieras desde Excel o CSV.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: 3 SEGMENTOS DE LIGA */}
              {templateTab === 'SEGMENTS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Explora los 3 segmentos con reglamento, duración y fixtures configurados para tu liga:
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">
                      3 Divisiones Incluidas
                    </span>
                  </div>

                  {/* 3 Segments Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentSegments.map((seg) => (
                      <div
                        key={seg.id}
                        onClick={() => setSelectedSegmentId(seg.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-3 flex flex-col justify-between ${
                          selectedSegmentId === seg.id
                            ? `${seg.borderClass} ${seg.bgClass} shadow-xl ring-2 ring-emerald-500/30`
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${seg.borderClass} ${seg.colorClass}`}>
                            {seg.badge}
                          </span>
                          <h4 className="text-sm font-black text-white leading-tight">
                            {seg.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {seg.ageRequirement}
                          </p>
                        </div>

                        <div className="text-[11px] font-mono text-cyan-300 bg-black/40 p-2 rounded-xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{seg.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DETALLE DEL SEGMENTO SELECCIONADO */}
                  <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${currentSelectedSegment.colorClass}`}>
                          REGLAMENTO DE COMPETICIÓN
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white">
                          {currentSelectedSegment.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                        {currentSelectedSegment.fixtureSummary}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Rules */}
                      <div className="space-y-2 bg-[#101726] p-3.5 rounded-xl border border-slate-800">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Normativa & Vocalía Digital:</span>
                        </span>
                        <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                          {currentSelectedSegment.rules.map((r, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 bg-[#101726] p-3.5 rounded-xl border border-slate-800">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Beneficios y Tecnología DeporVerso:</span>
                        </span>
                        <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                          {currentSelectedSegment.features.map((f, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* BIFURCACIÓN DE DECISIÓN: ESTÁNDAR (PAGAR) VS PERSONALIZACIÓN (WHATSAPP) */}
              {/* ========================================================================= */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/50 shadow-2xl space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono text-amber-300 font-black uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                    DECISIÓN DE AFILIACIÓN • ELIGE TU CAMINO
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-white pt-1">
                    ¿Deseas que tu liga quede exactamente así o necesitas personalización?
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto">
                    Si te gusta esta estructura estándar (5 equipos iniciales y 3 segmentos) procede directamente a pagar con pasarela. Si tienes categorías específicas, reglamento propio o requieres migración, contáctanos por WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* OPCIÓN 1: PAGAR CON PASARELA (PLANTILLA ESTÁNDAR) */}
                  <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          OPCIÓN A • INMEDIATO
                        </span>
                        <span className="text-xs font-mono font-black text-emerald-400">
                          $180 USD / año
                        </span>
                      </div>
                      <h5 className="text-base font-black text-white">
                        Aprobar Plantilla Estándar y Proceder al Pago
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Activa inmediatamente tu liga con los 5 equipos base y 3 segmentos. Incluye subdominio seguro <strong className="text-cyan-300 font-mono">{targetSubdomain}</strong>, pasarela de pagos integrada y entrega de clave administrativa.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep('PAYMENT')}
                      className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform group-hover:scale-[1.02]"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceder a Pagar (Pasarela de Cobro)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* OPCIÓN 2: ASISTENCIA Y PERSONALIZACIÓN VÍA WHATSAPP 0958610578 */}
                  <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-cyan-400 transition-all group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          OPCIÓN B • A TU MEDIDA
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          WhatsApp: {ADMIN_WHATSAPP_NUMBER}
                        </span>
                      </div>
                      <h5 className="text-base font-black text-white">
                        Deseo Personalización para mi Liga Deportiva
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ¿Tienes más de 20 equipos, categorías especiales (Sub-12, Máster 50), necesitas carnetización física en PVC, migración masiva de planillas o integración especial de VAR? Detállalo al administrador.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep('CUSTOMIZE')}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform group-hover:scale-[1.02]"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>Solicitar Personalización (WhatsApp Admin)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 3_PAY: PASARELA DE COBRO INTEGRADA */}
          {/* ========================================================================= */}
          {currentStep === 'PAYMENT' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('TEMPLATE')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a la Plantilla</span>
                </button>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  PASARELA SEGURA SSL 256-BIT
                </span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Pasarela de Cobro y Activación de Liga
                </h3>
                <p className="text-xs text-slate-400">
                  Pagas por la activación del subdominio <strong className="text-cyan-300">{targetSubdomain}</strong> y tu ecosistema deportivo oficial.
                </p>
              </div>

              {/* Selector de Plan Anual / Mensual */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setBillingPlan('ANNUAL')}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                    billingPlan === 'ANNUAL'
                      ? 'bg-emerald-500/20 border border-emerald-500 text-white shadow-md'
                      : 'border border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Plan Anual Barrial</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">
                      -20% AHORRO
                    </span>
                  </div>
                  <span className="text-lg font-black text-emerald-400 block mt-1">$180.00 <span className="text-xs font-normal text-slate-400">/ año</span></span>
                  <span className="text-[10px] text-slate-400 block">($15.00/mes) Incluye 12 meses de servidor y soporte</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingPlan('MONTHLY')}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                    billingPlan === 'MONTHLY'
                      ? 'bg-cyan-500/20 border border-cyan-500 text-white shadow-md'
                      : 'border border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Plan Mensual Flexible</span>
                  </div>
                  <span className="text-lg font-black text-cyan-300 block mt-1">$19.99 <span className="text-xs font-normal text-slate-400">/ mes</span></span>
                  <span className="text-[10px] text-slate-400 block">Sin contratos a largo plazo, cancela cuando desees</span>
                </button>
              </div>

              {/* Formulario de Pago */}
              <form onSubmit={handleProcessPayment} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
                {/* Method selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Método de Pago Preferido:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                        paymentMethod === 'CARD'
                          ? 'border-emerald-500 bg-emerald-950/40 text-white'
                          : 'border-slate-800 bg-[#121824] text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span>Tarjeta Débito/Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('TRANSFER')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                        paymentMethod === 'TRANSFER'
                          ? 'border-cyan-500 bg-cyan-950/40 text-white'
                          : 'border-slate-800 bg-[#121824] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                      <span>Transferencia Bancaria</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('EXPRESS')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                        paymentMethod === 'EXPRESS'
                          ? 'border-amber-500 bg-amber-950/40 text-white'
                          : 'border-slate-800 bg-[#121824] text-slate-400 hover:text-white'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span>PayPhone / Deuna</span>
                    </button>
                  </div>
                </div>

                {/* Card payment form */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Número de Tarjeta</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Expiración (MM/AA)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">CVV / CVC</label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="888"
                          className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-300">Titular de Tarjeta</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Patricio Cárdenas"
                          className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank transfer instructions */}
                {paymentMethod === 'TRANSFER' && (
                  <div className="p-3.5 rounded-xl bg-[#101726] border border-cyan-500/30 text-xs space-y-2">
                    <span className="font-bold text-cyan-300 block">Cuentas Bancarias Oficiales para Depósito / Transferencia:</span>
                    <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                      <p>• <strong>Banco Pichincha:</strong> Cta. Corriente # 2100854321 (DeporVerso Cía. Ltda. / RUC: 1792837461001)</p>
                      <p>• <strong>Banco Guayaquil:</strong> Cta. Corriente # 0019283471 (DeporVerso C.A.)</p>
                      <p>• <strong>Correo de notificación:</strong> pagos@deporverso.com</p>
                    </div>
                    <div className="pt-1">
                      <label className="text-xs font-bold text-slate-300 block mb-1">Número de Comprobante / Transferencia:</label>
                      <input
                        type="text"
                        required
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                        placeholder="Ej. BP-98234712"
                        className="w-full bg-[#121824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Express button */}
                {paymentMethod === 'EXPRESS' && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-2 text-center">
                    <p className="text-slate-300">
                      Podrás completar el pago mediante botón de cobro rápido con tu número de teléfono registrado en PayPhone o Deuna.
                    </p>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      Comisión de pasarela: 0% (absorbida por DeporVerso)
                    </span>
                  </div>
                )}

                {/* Action submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl cursor-pointer shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Procesando Cobro Seguro en Pasarela...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirmar Pago de ${currentPrice.toFixed(2)} USD y Activar Liga</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 3_CUSTOM: SOLICITUD DE PERSONALIZACIÓN VÍA WHATSAPP 0958610578 */}
          {/* ========================================================================= */}
          {currentStep === 'CUSTOMIZE' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('TEMPLATE')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a la Plantilla</span>
                </button>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>Admin WhatsApp: {ADMIN_WHATSAPP_NUMBER}</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Asistencia de Personalización para tu Liga
                </h3>
                <p className="text-xs text-slate-400">
                  Configura tus especificaciones deseadas y se enviarán directamente detalladas por SMS/WhatsApp al Administrador de DeporVerso (<strong className="text-emerald-400 font-mono">0958610578</strong>).
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
                {/* Number of teams */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>¿Cuántos Equipos participarán en tu Liga?</span>
                    </span>
                    <span className="font-mono text-cyan-400">{customTeamsCount} equipos</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {['8', '12', '16', '20', '24', '32', '48+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCustomTeamsCount(num)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          customTeamsCount === num
                            ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                            : 'bg-[#121824] border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categorías especiales requeridas */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Selecciona las Categorías Especiales que necesitas:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'sub12', label: 'Categoría Formativa Sub-12' },
                      { key: 'sub15', label: 'Categoría Formativa Sub-15' },
                      { key: 'sub18', label: 'Juvenil Sub-18' },
                      { key: 'segundaDivision', label: 'Segunda Categoría / Ascenso' },
                      { key: 'master50', label: 'Super Máster +50 Años' },
                      { key: 'femeninoSub20', label: 'Femenino Juvenil Sub-20' },
                      { key: 'indoorFutsal', label: 'Torneo Nocturno Indor / Fútsal' }
                    ].map((cat) => (
                      <label 
                        key={cat.key}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#121824] border border-slate-800/80 hover:border-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(customCategories as any)[cat.key]}
                          onChange={(e) => setCustomCategories({
                            ...customCategories,
                            [cat.key]: e.target.checked
                          })}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-slate-300">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Servicios de valor agregado */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Servicios Adicionales Requeridos:</span>
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { key: 'varModule', title: 'Módulo de VAR Móvil para jugadas polémicas', desc: 'Revisión en tableta con cámaras móviles en el perímetro de la cancha' },
                      { key: 'pvcCardNfc', title: 'Carnetización física PVC con chip NFC y QR', desc: 'Entrega de credenciales plásticas impresas de alta durabilidad' },
                      { key: 'excelMigration', title: 'Migración asistida de planillas Excel históricas', desc: 'Cargamos tu base de datos de torneos pasados sin esfuerzo para tu directiva' },
                      { key: 'offlinePwa', title: 'Vocalía Digital Offline PWA para canchas sin internet', desc: 'Funciona 100% desconectado y sincroniza al recuperar señal' }
                    ].map((srv) => (
                      <label 
                        key={srv.key}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#121824] border border-slate-800/80 hover:border-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(customFeatures as any)[srv.key]}
                          onChange={(e) => setCustomFeatures({
                            ...customFeatures,
                            [srv.key]: e.target.checked
                          })}
                          className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-white block">{srv.title}</span>
                          <span className="text-[11px] text-slate-400">{srv.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notas o comentarios */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">Notas o Requerimientos Especiales para el Administrador:</label>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Describe cualquier particularidad de tu liga..."
                    className="w-full bg-[#121824] border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                {/* PREVIEW OF WHATSAPP MESSAGE */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-cyan-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mensaje listo para enviar a WhatsApp del Admin (0958610578):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(getCustomizationWhatsappMessage())}
                      className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-0.5 rounded"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 max-h-36 overflow-y-auto">
                    {getCustomizationWhatsappMessage()}
                  </pre>
                </div>

                {/* ACTION BUTTONS TO WHATSAPP / SMS */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenAdminWhatsapp(getCustomizationWhatsappMessage())}
                    className="w-full sm:flex-1 py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Enviar al WhatsApp del Administrador (0958610578)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendAdminSms(getCustomizationWhatsappMessage())}
                    className="w-full sm:w-auto py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                    title="Enviar mediante SMS tradicional"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar por SMS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 4_SUCCESS: CONFIRMACIÓN Y DESPACHO OFICIAL AL ADMINISTRADOR */}
          {/* ========================================================================= */}
          {currentStep === 'SUCCESS' && (
            <div className="space-y-6 max-w-xl mx-auto text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 mx-auto shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                  TRANSACCIÓN CONFIRMADA Y PAGADA
                </span>
                <h3 className="text-2xl font-black text-white pt-1">
                  ¡Felicitaciones, {leaderName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tu solicitud de afiliación para <strong className="text-cyan-300">{leagueName}</strong> ha sido procesada con éxito.
                </p>
              </div>

              {/* Comprobante oficial */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Comprobante Oficial:</span>
                  <span className="font-mono text-emerald-400 font-black">{paymentReceiptId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subdominio Activado:</span>
                  <span className="font-mono text-cyan-300 font-bold">https://{targetSubdomain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Plan de Suscripción:</span>
                  <span className="font-bold text-white">{billingPlan === 'ANNUAL' ? 'Plan Anual Barrial ($180.00 USD)' : 'Plan Mensual ($19.99 USD)'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Equipos & Segmentos:</span>
                  <span className="font-mono text-slate-200">5 Clubes Base + 3 Segmentos Reglamentarios</span>
                </div>
              </div>

              {/* WHATSAPP ADMIN NOTIFICATION CALLOUT */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Notifica de inmediato tu pago al Administrador de DeporVerso:
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Envía el SMS o mensaje de WhatsApp al número <strong className="text-emerald-300 font-mono">0958610578</strong> con tu ID de comprobante para recibir tus credenciales de superadministrador y acceso directo a tu servidor.
                </p>

                <button
                  type="button"
                  onClick={() => handleOpenAdminWhatsapp(getStandardPaidWhatsappMessage(paymentReceiptId))}
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notificar Pago a WhatsApp Administrador (0958610578)</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Asistencia al Administrador: <strong className="text-white">{ADMIN_WHATSAPP_NUMBER}</strong></span>
          </div>
          <span>DeporVerso • Multi-Tenant Cloud Architecture</span>
        </div>

      </div>
    </div>
  );
};
