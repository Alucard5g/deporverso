import React, { useState } from 'react';
import { 
  X, Tag, CheckCircle2, ShieldCheck, Flame, Users, Trophy, Video, 
  CreditCard, Smartphone, Building2, ChevronRight, ArrowRight, DollarSign,
  Lock, Copy, Check, ExternalLink, Sparkles, Plus, Trash2
} from 'lucide-react';
import { SportCode, Tenant } from '../../types';

interface ExclusiveOfferCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leagueData: {
    leagueName: string;
    sport: SportCode;
    teamsCount: number;
    totalPaid: number;
    leaderName: string;
    leaderPhone: string;
  }) => void;
  onAddTenant?: (newTenant: Omit<Tenant, 'id' | 'created_at'>) => void;
}

export interface LeagueCategory {
  id: string;
  name: string;
  isInferior: boolean; // Infantil/Juvenil pays $25, Senior pays $35
  teamsCount: number;
}

const TOTAL_PROMO_SLOTS = 10;
const TAKEN_PROMO_SLOTS = 6; // 4 remaining

export const ExclusiveOfferCheckoutModal: React.FC<ExclusiveOfferCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onAddTenant
}) => {
  const [categories, setCategories] = useState<LeagueCategory[]>([
    { id: 'cat-1', name: 'Primera Senior (Mayores)', isInferior: false, teamsCount: 6 },
    { id: 'cat-2', name: 'Segunda Senior (Mayores)', isInferior: false, teamsCount: 6 },
    { id: 'cat-3', name: 'Sub-12 (Infantil)', isInferior: true, teamsCount: 4 },
    { id: 'cat-4', name: 'Sub-16 (Juvenil)', isInferior: true, teamsCount: 4 },
  ]);

  const [leagueName, setLeagueName] = useState<string>('Liga Deportiva Barrial América');
  const [leaderName, setLeaderName] = useState<string>('Ing. Marco Benavides');
  const [leaderPhone, setLeaderPhone] = useState<string>('0987654321');
  const [leaderEmail, setLeaderEmail] = useState<string>('presidencia@liga-america.com');
  const [cityCountry, setCityCountry] = useState<string>('Quito, Ecuador');
  const [sport, setSport] = useState<SportCode>('FUTBOL');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'WHATSAPP'>('CARD');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('382');
  
  // States
  const [step, setStep] = useState<'CALCULATOR' | 'CHECKOUT' | 'SUCCESS'>('CALCULATOR');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receiptCode, setReceiptCode] = useState<string>('');

  if (!isOpen) return null;

  // Calculos financieros reactivos basados en categorías
  const teamsCount = categories.reduce((sum, cat) => sum + (Number(cat.teamsCount) || 0), 0);
  
  const regularTotal = categories.reduce((sum, cat) => {
    const regularPrice = cat.isInferior ? 50 : 70;
    return sum + (Number(cat.teamsCount) || 0) * regularPrice;
  }, 0);

  const finalTotal = categories.reduce((sum, cat) => {
    const discountedPrice = cat.isInferior ? 25 : 35;
    return sum + (Number(cat.teamsCount) || 0) * discountedPrice;
  }, 0);

  const discountAmount = regularTotal - finalTotal;
  const remainingSlots = TOTAL_PROMO_SLOTS - TAKEN_PROMO_SLOTS;

  const handleAddCategory = () => {
    const newId = `cat-custom-${Date.now()}`;
    setCategories([
      ...categories,
      { id: newId, name: `Categoría Nueva ${categories.length + 1}`, isInferior: false, teamsCount: 4 }
    ]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleUpdateCategoryType = (id: string, isInferior: boolean) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isInferior } : c));
  };

  const handleUpdateCategoryTeams = (id: string, count: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, teamsCount: count < 0 ? 0 : count } : c));
  };

  const handleRemoveCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleProcessOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedReceipt = `DV-50OFF-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptCode(generatedReceipt);
      setStep('SUCCESS');

      // Create new tenant if callback provided
      if (onAddTenant) {
        const subdomainSlug = leagueName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        onAddTenant({
          name: leagueName,
          slug: subdomainSlug || 'liga-promocion',
          sport_code: sport,
          country: cityCountry.split(',')[1]?.trim() || 'Ecuador',
          currency: 'USD',
          domain: `${subdomainSlug || 'liga-promocion'}.deporverso.app`,
          admin_key: `DV-KEY-${Math.floor(1000 + Math.random() * 9000)}`,
          is_active: true,
          annual_license_fee: finalTotal,
          plan_tier: 'PRO_5'
        });
      }

      if (onSuccess) {
        onSuccess({
          leagueName,
          sport,
          teamsCount,
          totalPaid: finalTotal,
          leaderName,
          leaderPhone
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in text-white">
      
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-[#030712] border border-[#00F0FF]/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,102,255,0.4)] flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-[#080F24]/95 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00F0FF] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center text-[#00F0FF]">
                <Tag className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
                  OFERTA EXCLUSIVA DE LANZAMIENTO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold">
                  50% OFF
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Suscripción de Liga con Descuento Especial
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROMO BANNER: CUPOS RESTANTES */}
        <div className="px-6 py-3 bg-gradient-to-r from-[#0066FF]/20 via-[#00F0FF]/15 to-[#0066FF]/20 border-b border-[#00F0FF]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold text-white">
              ¡Solo quedan <span className="text-[#00F0FF] underline font-mono text-sm">{remainingSlots} de {TOTAL_PROMO_SLOTS}</span> cupos con 50% de descuento!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Cupos Asignados: {TAKEN_PROMO_SLOTS}/{TOTAL_PROMO_SLOTS}</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF]" style={{ width: '60%' }} />
            </div>
          </div>
        </div>

        {/* BODY ACCORDING TO CURRENT STEP */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: CALCULADORA Y BENEFICIOS */}
          {step === 'CALCULATOR' && (
            <div className="space-y-6">
              
              {/* CALCULADORA DE PRECIO POR EQUIPO */}
              <div className="p-6 rounded-2xl bg-[#080F24]/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                      1. Registra tus Equipos por Categorías (Sin Límite)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ingresa el número de equipos por categoría. El descuento del 50% y tarifas preferenciales para inferiores se aplican automáticamente.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black text-[#00F0FF] font-mono">{teamsCount}</span>
                    <span className="text-xs text-slate-400 block font-mono">equipos totales</span>
                  </div>
                </div>

                {/* Panel de Información Exclusivo y Beneficios */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-cyan-950/40 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#00F0FF]">
                    <Sparkles className="w-4 h-4 animate-pulse text-[#00F0FF]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Políticas de Registro & Incentivos Deportivos</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 list-none pl-0">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF] font-bold font-mono">■</span>
                      <span><strong>El número de equipos se ingresa sin límite:</strong> Añade todos los equipos que pertenezcan a tu liga o torneo sin restricciones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF] font-bold font-mono">■</span>
                      <span><strong>Se ingresa por categorías:</strong> Organiza la estructura de tu torneo asignando los equipos correspondientes a cada nivel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF] font-bold font-mono">■</span>
                      <span><strong>Tarifa de Incentivo Infantil y Juvenil:</strong> Las categorías inferiores pagan solo <strong className="text-emerald-400 font-bold">$25</strong> con descuento especial como incentivo al deporte infantil y juvenil (en lugar de la tarifa normal de $35 para mayores).</span>
                    </li>
                  </ul>
                </div>

                {/* Formulario Dinámico de Categorías */}
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08] hover:border-[#00F0FF]/30 transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs animate-fade-in"
                    >
                      {/* Nombre de la Categoría */}
                      <div className="flex-1 min-w-0">
                        <label className="text-slate-400 text-[10px] block mb-1 uppercase font-mono">Nombre de la Categoría</label>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#00F0FF]"
                          placeholder="Ej: Primera Senior"
                        />
                      </div>

                      {/* Tipo de Categoría */}
                      <div className="w-full md:w-56">
                        <label className="text-slate-400 text-[10px] block mb-1 uppercase font-mono">Tipo (Nivel / Descuento)</label>
                        <select
                          value={cat.isInferior ? 'inferior' : 'senior'}
                          onChange={(e) => handleUpdateCategoryType(cat.id, e.target.value === 'inferior')}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                        >
                          <option value="senior">Categoría Mayor / Senior ($35/eq)</option>
                          <option value="inferior">Categoría Inferior (Infantil/Juvenil - $25/eq)</option>
                        </select>
                      </div>

                      {/* Número de Equipos */}
                      <div className="w-full md:w-28">
                        <label className="text-slate-400 text-[10px] block mb-1 uppercase font-mono">Equipos (Sin Límite)</label>
                        <input
                          type="number"
                          min="0"
                          value={cat.teamsCount}
                          onChange={(e) => handleUpdateCategoryTeams(cat.id, Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-center text-xs focus:outline-none focus:border-[#00F0FF]"
                        />
                      </div>

                      {/* Eliminar Categoría */}
                      {categories.length > 1 && (
                        <div className="flex items-end justify-end shrink-0 pt-4 md:pt-0">
                          <button
                            onClick={() => handleRemoveCategory(cat.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                            title="Eliminar esta categoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Botón para Añadir Categoría */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Añadir Categoría Personalizada</span>
                    </button>

                    <span className="text-[11px] text-slate-400 font-mono italic">
                      * Las categorías infantiles y juveniles pagan $25 por incentivo al deporte infantil y juvenil.
                    </span>
                  </div>
                </div>

                {/* DESGLOSE MATEMÁTICO TRANSPARENTE POR CATEGORÍAS */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">INVERSIÓN REAL (SIN DSCTO)</span>
                    <span className="text-sm font-bold text-slate-400 line-through">
                      ${regularTotal} <span className="text-[10px] block text-slate-500">(Mayores: $70 / Inferiores: $50)</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 block">DESCUENTO LANZAMIENTO & INCENTIVO</span>
                    <span className="text-sm font-bold text-emerald-400">
                      -${discountAmount} <span className="text-[10px] block text-emerald-500">Ahorro Real</span>
                    </span>
                  </div>

                  <div className="bg-[#0066FF]/20 rounded-lg p-1.5 border border-[#00F0FF]/30 flex flex-col justify-center">
                    <span className="text-[11px] font-mono text-[#00F0FF] block font-bold">TOTAL NETO A PAGAR</span>
                    <span className="text-xl font-black text-white font-mono">
                      ${finalTotal} <span className="text-[10px] block text-cyan-200">(Mayores: $35 / Inferiores: $25)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* BENEFICIOS PREMIUM INCLUIDOS */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Beneficios Completos Incluidos en tu Suscripción:
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Sistema VAR 4K a la Carta</p>
                      <p className="text-slate-400 text-[11px]">Repetición multicámara y calibración de líneas de fuera de juego.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Subdominio Oficial Propio</p>
                      <p className="text-slate-400 text-[11px]">tuliga.deporverso.app con identidad, tablas y patrocinadores.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Carnets QR Biométricos Antifraude</p>
                      <p className="text-slate-400 text-[11px]">Cero suplantaciones en cancha con verificación pericial.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Vocalía Digital 100% Sin Papel</p>
                      <p className="text-slate-400 text-[11px]">Control de amonestaciones, goles y planillas en tiempo real.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON TO CHECKOUT FORM */}
              <div className="pt-2">
                <button
                  onClick={() => setStep('CHECKOUT')}
                  className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_30px_rgba(0,102,255,0.7)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Continuar al Registro y Pago (${finalTotal} Total)</span>
                  <ChevronRight className="w-4 h-4 text-[#00F0FF]" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: FORMULARIO DE LIGA Y MÉTODO DE PAGO */}
          {step === 'CHECKOUT' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* RESUMEN DE LA ORDEN */}
              <div className="p-4 rounded-xl bg-[#080F24]/80 border border-[#00F0FF]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Suscripción: {teamsCount} Equipos</span>
                  <span className="text-slate-400 font-mono">Promo 10 Primeras Ligas (50% OFF)</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#00F0FF] font-mono">${finalTotal}</span>
                  <button 
                    onClick={() => setStep('CALCULATOR')} 
                    className="text-[10px] text-slate-400 underline block cursor-pointer"
                  >
                    Modificar Equipos
                  </button>
                </div>
              </div>

              {/* DATOS DE LA LIGA */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Datos de la Liga y del Representante:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Nombre de la Liga o Torneo *</label>
                    <input
                      type="text"
                      value={leagueName}
                      onChange={(e) => setLeagueName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Deporte Principal *</label>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value as SportCode)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    >
                      <option value="FUTBOL">Fútbol 11 / Indor / Fútsal</option>
                      <option value="BALONCESTO">Baloncesto</option>
                      <option value="ECUAVOLEY">Ecuavoley</option>
                      <option value="PADEL">Pádel</option>
                      <option value="TENNIS">Tenis</option>
                      <option value="VOLEIBOL">Voleibol</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Presidente / Coordinador *</label>
                    <input
                      type="text"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="text"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Ciudad y País *</label>
                    <input
                      type="text"
                      value={cityCountry}
                      onChange={(e) => setCityCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>
              </div>

              {/* SELECCIÓN DE MÉTODO DE PAGO */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Método de Pago Seguro:
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Tarjeta</span>
                    <span className="text-[10px] text-cyan-200">Crédito/Débito</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('TRANSFER')}
                    className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'TRANSFER'
                        ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Transferencia</span>
                    <span className="text-[10px] text-cyan-200">Bancaria / Zelle</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('WHATSAPP')}
                    className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'WHATSAPP'
                        ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>WhatsApp VIP</span>
                    <span className="text-[10px] text-cyan-200">Asistencia 1 a 1</span>
                  </button>
                </div>

                {/* Sub-Panel de Tarjeta */}
                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Número de Tarjeta (Stripe Protected)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Vencimiento</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Panel Transferencia */}
                {paymentMethod === 'TRANSFER' && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                    <p className="font-bold text-white">Datos de Cuenta Corporativa CIG:</p>
                    <p className="text-slate-300 font-mono text-[11px]">Banco Pichincha • Cta. Corriente: 2100489123</p>
                    <p className="text-slate-300 font-mono text-[11px]">Titular: CORPORACIÓN E INNOVACIÓN GUERRA CIG</p>
                    <p className="text-slate-300 font-mono text-[11px]">Zelle / Internacional: pagos@deporverso.com</p>
                  </div>
                )}

                {/* Sub-Panel WhatsApp */}
                {paymentMethod === 'WHATSAPP' && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                    <p className="font-bold text-[#00F0FF]">Asistencia Inmediata con Gerencia CIG:</p>
                    <p className="text-slate-300 text-[11px]">
                      Al confirmar, se abrirá tu WhatsApp con el mensaje pre-cargado para asignar tu cupo #07 con el 50% de descuento al número oficial 0958610578.
                    </p>
                  </div>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('CALCULATOR')}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Volver
                </button>
                <button
                  onClick={handleProcessOrder}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-xl text-sm font-extrabold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando Reserva Criptográfica...
                    </span>
                  ) : (
                    <span>Confirmar y Asegurar Cupo (${finalTotal} Total)</span>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: ÉXITO Y RECIBO CONFIRMADO */}
          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  ¡CUPO ASIGNADO CON ÉXITO! (50% DESCUENTO)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Bienvenido a DeporVerso, {leagueName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Tu suscripción para {teamsCount} equipos ha sido procesada con éxito por un total de <span className="text-[#00F0FF] font-bold font-mono">${finalTotal}</span>.
                </p>
              </div>

              {/* RECIBO OFICIAL */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#080F24] border border-white/10 text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Código de Recibo:</span>
                  <span className="text-[#00F0FF] font-bold">{receiptCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cupo Promocional:</span>
                  <span className="text-white font-bold">#07 de 10 (50% OFF)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Precio Regular:</span>
                  <span className="text-slate-400 line-through">${regularTotal} ($70/eq)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Total Liquidado:</span>
                  <span className="text-emerald-400 font-bold">${finalTotal} ($35/eq)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-400">Subdominio Asignado:</span>
                  <span className="text-cyan-300">tuliga.deporverso.app</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/593958610578?text=Hola%20DeporVerso,%20acabo%20de%20reservar%20mi%20cupo%20con%2050%25%20de%20descuento%20(Recibo:%20${receiptCode})%20para%20la%20liga%20${encodeURIComponent(leagueName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Notificar por WhatsApp (0958610578)</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
                >
                  Ir al Portal de la Liga
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
