import React, { useState } from 'react';
import { 
  Trophy, Shield, Zap, Video, Award, Users, CheckCircle2, 
  ArrowRight, Download, Share2, Printer, Sparkles, Check, 
  ExternalLink, Calculator, DollarSign, Clock, FileText, 
  AlertTriangle, Play, Smartphone, QrCode, TrendingUp,
  ShieldCheck, Tag
} from 'lucide-react';
import { Tenant, Sport, Match, Team, Player } from '../../types';
import ligaBarrialPichinchaHero from '../../assets/images/liga_barrial_pichincha_hero_1791927900990.jpg';

interface PichinchaExecutiveDemoProps {
  tenant: Tenant;
  sport?: Sport;
  matches: Match[];
  teams: Team[];
  players: Player[];
  onLaunchTour?: () => void;
  onNavigateSubTab?: (tab: string) => void;
}

export const PichinchaExecutiveDemo: React.FC<PichinchaExecutiveDemoProps> = ({
  tenant,
  sport,
  matches,
  teams,
  players,
  onLaunchTour,
  onNavigateSubTab
}) => {
  const [numClubes, setNumClubes] = useState<number>(24);
  const [precioInscripcionLiga, setPrecioInscripcionLiga] = useState<number>(50); // $50 a $100
  const [garantiaTradicional, setGarantiaTradicional] = useState<number>(150); // $100 a $200
  const [ventasMercaderiaAnual, setVentasMercaderiaAnual] = useState<number>(6000); // Ventas en heroesdeldeporte.com
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);
  const [simulatedGoalEvent, setSimulatedGoalEvent] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'dossier' | 'calculator' | 'simulator'>('calculator');

  // Cálculos dinámicos de monetización y ahorro real
  const costoAutomatizacionDeporverso = 35; // DeporVerso cobra $35 por club/torneo
  const margenNetoInscripcionPorClub = Math.max(0, precioInscripcionLiga - costoAutomatizacionDeporverso); // Ej: $50 - $35 = $15
  const gananciaInscripcionLiga = numClubes * margenNetoInscripcionPorClub; // Ganancia neta directa de la Liga
  
  // Garantía: se reduce mínimo 50% por el streaming y VAR que reducen el riesgo
  const garantiaReducida = Math.round(garantiaTradicional * 0.5);
  const ahorroGarantiaClubes = (garantiaTradicional - garantiaReducida) * numClubes; // Capital liberado para los clubes
  
  // Tienda oficial heroesdeldeporte.com: 2% comisión para la Liga por venta de mercadería
  const comisionTiendaLiga = Math.round(ventasMercaderiaAnual * 0.02);
  
  // Ahorro en papelería y horas de secretaría
  const ahorroPapeleriaAnual = numClubes * 145; // Hojas de vocalía, talonarios, carnets físicos
  const horasAhorradasSecretaria = numClubes * 28; // Horas de digitación de tablas y cómputo de actas
  
  // Beneficio neto total para la Liga (Margen de inscripción + Comisión tienda + Ahorro papelería)
  const beneficioNetoLigaAnual = gananciaInscripcionLiga + comisionTiendaLiga + ahorroPapeleriaAnual;

  const handlePrintDossier = () => {
    window.print();
  };

  const handleCopyProposal = () => {
    const text = `📋 *Modelo de Monetización y Cierre Financiero — Liga Barrial Pichincha 2026*\n\nEstimados Dirigentes y Presidentes de Clubes de Liga Barrial Pichincha:\n\nPresentamos la transformación digital y financiera con *DeporVerso*:\n\n1. *Margen de Inscripción:* La Liga cobra su inscripción regular (ej. $${precioInscripcionLiga} USD/club). DeporVerso cobra $35 USD por automatización integral. *La Liga gana $${margenNetoInscripcionPorClub} USD netos por club* ($${gananciaInscripcionLiga.toLocaleString()} USD para los ${numClubes} clubes) sin trabajo manual.\n2. *Garantía Reducida al 50%:* Gracias al Streaming y al VAR oficial, el riesgo de altercados se reduce a niveles mínimos. La garantía pasa de $${garantiaTradicional} a $${garantiaReducida} USD, liberando $${ahorroGarantiaClubes.toLocaleString()} USD en caja para los clubes.\n3. *2% por Venta de Mercadería:* La Liga monetiza con el 2% de comisión en la tienda oficial *heroesdeldeporte.com* por la indumentaria de sus clubes.\n4. *VAR & Streaming Provistos por la App:* Cero inversión en hardware para la Liga; la App opera el VAR y el streaming. El torneo digital con transmisión en vivo y VAR lo ubica en otro nivel, atrayendo más clubes, patrocinadores y nuevos torneos deportivos.\n5. *+$${ahorroPapeleriaAnual.toLocaleString()} USD de Ahorro en Secretaría:* Eliminación total de talonarios y planillas físicas.\n\nDemostración interactiva en vivo disponible en: https://deporverso.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedProposal(true);
      setTimeout(() => setCopiedProposal(false), 3000);
    }
  };

  const handleTriggerSimulatedGoal = () => {
    setSimulatedGoalEvent(true);
    setTimeout(() => {
      setSimulatedGoalEvent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* 1. HERO INSTITUCIONAL: DOSSIER PARA EL DIRECTORIO             */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 bg-[#040816] p-6 sm:p-10 shadow-2xl">
        {/* Portada Cinematográfica de la Liga Barrial Pichincha */}
        <div className="absolute inset-0 z-0">
          <img 
            src={ligaBarrialPichinchaHero} 
            alt="Liga Barrial Pichincha Oficial" 
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-[#091533]/85 to-[#060e22]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/60 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Dossier Ejecutivo de Directorio 2026
              </span>
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold px-3 py-1 rounded-full">
                Liga Barrial Pichincha · Serie A & Serie B
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Transformación Digital Integral para Dirigentes y Presidentes de Clubes
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Propuesta oficial para la modernización de los <strong>{teams.length} clubes inscritos</strong> y <strong>{players.length}+ deportistas federados</strong> de la <strong>{tenant.name}</strong>. Cero papel, tablas en tiempo real, vocalía móvil, carnetización holográfica QR y VAR barrial al alcance de cada cancha.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {onLaunchTour && (
              <button
                onClick={onLaunchTour}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Iniciar Tour Multiverso Paso a Paso</span>
              </button>
            )}

            <button
              onClick={handleCopyProposal}
              className="px-4 py-3 rounded-xl bg-[#0e1c3d] hover:bg-[#142857] border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Copiar texto resumen para enviar por WhatsApp al grupo de presidentes"
            >
              {copiedProposal ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedProposal ? '¡Copiado!' : 'Compartir en WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrintDossier}
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir propuesta en formato A4"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Imprimir A4</span>
            </button>
          </div>
        </div>

        {/* Badges de Autoridades y Respaldo */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Presidente de Liga</span>
            <span className="font-bold text-white text-xs truncate block">Sr. Carlos Guayasamín</span>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Comisión Técnica</span>
            <span className="font-bold text-cyan-300 text-xs truncate block">Ing. Rodrigo Almendariz</span>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Tribunal de Penas</span>
            <span className="font-bold text-amber-300 text-xs truncate block">Dr. Fausto Villacís</span>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Club Modelo</span>
            <span className="font-bold text-emerald-300 text-xs truncate block">Club Deportivo Deporverso</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SELECTOR DE VISTAS: DOSSIER · CALCULADORA · SIMULADOR      */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[#050b18] border border-white/10 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTabSection('dossier')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'dossier'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Dossier Comparativo (Antes vs Ahora)</span>
          </button>

          <button
            onClick={() => setActiveTabSection('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'calculator'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>2. Modelo de Monetización & Cierre Financiero</span>
          </button>

          <button
            onClick={() => setActiveTabSection('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'simulator'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>3. Simulador en Vivo para Dirigentes</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CONTENIDO: DOSSIER COMPARATIVO                             */}
      {/* ============================================================== */}
      {activeTabSection === 'dossier' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* TABLA COMPARATIVA ANTES VS AHORA */}
          <div className="bg-[#060c1d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Impacto Directo en la Gestión Dirigencial
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Modelo Tradicional Barrial vs Plataforma DeporVerso
              </h3>
              <p className="text-xs text-slate-400">
                La comparativa real que convence a cualquier presidente de liga o delegado de club en menos de 2 minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Lado Antiguo */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Modelo Tradicional (En Papel y Excel)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>14 horas semanales de secretaría calculando tablas y goles a mano los días lunes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Planillas de papel rotas, tachadas, ilegibles o manchadas de lluvia y barro.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Riesgo constante de suplantación de identidad con carnets de cartulina adulterados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Disputas arbitrales violentas en finales sin evidencia de video para apelar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Cero ingresos adicionales para la liga por derechos de transmisión o sponsors.</span>
                  </li>
                </ul>
              </div>

              {/* Lado Moderno DeporVerso */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Plataforma DeporVerso (Automatización 100%)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Tablas recalculadas en 0.2 segundos al sonar el pitazo final. Publicación instantánea.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Vocalía digital en el teléfono móvil del vocal de turno; firma del árbitro en pantalla.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Carnet holográfico con código QR único que valida ficha médica y cédula al instante.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Sistema VAR a la carta con repetición multicámara que resuelve jugadas y genera clips 9:16.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Monetización de la Liga: Margen neto en inscripción ($15 a $65/club), reducción del 50% en riesgo de garantía y 2% por venta de mercadería en heroesdeldeporte.com.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>VAR y Streaming provistos por la App: Cero costo de equipamiento para la Liga; la App DeporVerso proporciona el sistema y percibe los ingresos de revisiones a la carta.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* LAS 5 SOLUCIONES CLAVE PARA EL DIRECTORIO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">1. Fixture & Posiciones en Vivo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asignación inteligente de canchas, horarios y terna arbitral para 24 fechas. Cero cruces de horario y clasificación Serie A/B automática.
              </p>
            </div>

            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <QrCode className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">2. Carnetización QR Inviolable</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada futbolista de Liga Pichincha porta su carnet digital en el teléfono con código QR verificable. Se escanea en 1 segundo en la mesa.
              </p>
            </div>

            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">3. Mesa de Control PWA Móvil</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Planilla digital sin necesidad de conexión constante. Registro táctil de goles, tarjetas amarillas, rojas y observaciones disciplinarias.
              </p>
            </div>

            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">4. VAR A La Carta Barrial</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solución a fueras de juego y penales en partidos decisivos. Los delegados pueden solicitar revisión oficial financiada con costo de $12.
              </p>
            </div>

            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">5. Fichas de Scouting A4</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluación del talento con Índice Deporverso (1-10) y mapas de calor. Permite exportar informes periciales para transferencias y visorías.
              </p>
            </div>

            <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Share2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">6. Boletines por WhatsApp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Al terminar el domingo, el sistema compila la crónica, resultados y tabla para enviarlo al grupo de WhatsApp de los 24 presidentes.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CALCULADORA INTERACTIVA DE ROI Y AHORRO                    */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 4. MODELO DE MONETIZACIÓN Y CIERRE FINANCIERO PARA LA LIGA    */}
      {/* ============================================================== */}
      {activeTabSection === 'calculator' && (
        <div className="bg-[#060d20] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl animate-in fade-in duration-200">
          
          {/* Encabezado y Explicación del Modelo */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Ingeniería Financiera & Cierre de Venta
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Modelo de Monetización Oficial para Liga Barrial Pichincha
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                La plataforma <strong>DeporVerso</strong> automatiza la liga por <strong>$35 USD por club y torneo</strong>. La Liga monetiza reteniendo su margen de inscripción, reduciendo la garantía a los clubes, y comisionando por la venta de mercadería oficial en <strong>heroesdeldeporte.com</strong>.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyProposal}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 text-slate-950 font-black text-xs font-mono rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                {copiedProposal ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedProposal ? '¡Copiado a WhatsApp!' : 'Copiar Propuesta para Presidentes'}</span>
              </button>
            </div>
          </div>

          {/* SIMULADOR INTERACTIVO DE VARIABLES */}
          <div className="bg-[#08132e] border border-cyan-500/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              Parámetros Financieros Configurables para la Asamblea
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Clubes */}
              <div className="bg-[#050b18] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 block">1. Clubes en Torneo:</span>
                <select
                  value={numClubes}
                  onChange={(e) => setNumClubes(Number(e.target.value))}
                  className="w-full bg-[#0d1a38] text-white font-bold font-mono text-xs px-3 py-2 rounded-lg border border-cyan-500/40 focus:outline-none cursor-pointer"
                >
                  <option value={12}>12 Clubes</option>
                  <option value={16}>16 Clubes</option>
                  <option value={20}>20 Clubes</option>
                  <option value={24}>24 Clubes (Oficial Pichincha)</option>
                  <option value={32}>32 Clubes</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Serie A & Serie B</span>
              </div>

              {/* Inscripción de la Liga */}
              <div className="bg-[#050b18] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 block">2. Cobro Inscripción Liga:</span>
                <select
                  value={precioInscripcionLiga}
                  onChange={(e) => setPrecioInscripcionLiga(Number(e.target.value))}
                  className="w-full bg-[#0d1a38] text-emerald-300 font-bold font-mono text-xs px-3 py-2 rounded-lg border border-emerald-500/40 focus:outline-none cursor-pointer"
                >
                  <option value={50}>$50 USD / club (Básico)</option>
                  <option value={60}>$60 USD / club</option>
                  <option value={75}>$75 USD / club</option>
                  <option value={80}>$80 USD / club</option>
                  <option value={100}>$100 USD / club</option>
                </select>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  DeporVerso cobra $35 · <strong>Liga gana ${margenNetoInscripcionPorClub} netos</strong>
                </span>
              </div>

              {/* Garantía Tradicional */}
              <div className="bg-[#050b18] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 block">3. Garantía Tradicional:</span>
                <select
                  value={garantiaTradicional}
                  onChange={(e) => setGarantiaTradicional(Number(e.target.value))}
                  className="w-full bg-[#0d1a38] text-amber-300 font-bold font-mono text-xs px-3 py-2 rounded-lg border border-amber-500/40 focus:outline-none cursor-pointer"
                >
                  <option value={100}>$100 USD / club</option>
                  <option value={150}>$150 USD / club (Promedio)</option>
                  <option value={200}>$200 USD / club (Clásicos)</option>
                </select>
                <span className="text-[10px] text-amber-400 font-mono block">
                  Con VAR baja a <strong>${garantiaReducida} USD (-50%)</strong>
                </span>
              </div>

              {/* Ventas Mercadería heroesdeldeporte.com */}
              <div className="bg-[#050b18] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 block">4. Ventas Indumentaria:</span>
                <select
                  value={ventasMercaderiaAnual}
                  onChange={(e) => setVentasMercaderiaAnual(Number(e.target.value))}
                  className="w-full bg-[#0d1a38] text-cyan-300 font-bold font-mono text-xs px-3 py-2 rounded-lg border border-cyan-500/40 focus:outline-none cursor-pointer"
                >
                  <option value={3000}>$3,000 USD / año</option>
                  <option value={6000}>$6,000 USD / año (Estimado)</option>
                  <option value={10000}>$10,000 USD / año</option>
                  <option value={15000}>$15,000 USD / año</option>
                </select>
                <span className="text-[10px] text-cyan-400 font-mono block">
                  Tienda heroesdeldeporte.com (2% Liga)
                </span>
              </div>
            </div>
          </div>

          {/* LAS 4 VÍAS DE MONETIZACIÓN Y CIERRE DE VENTA DETALLADAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Vía 1: Margen de Inscripción */}
            <div className="p-5 rounded-2xl bg-[#091533] border border-emerald-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Vía 1: Margen de Inscripción de la Liga
                </span>
                <span className="text-xs font-mono font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  +$15 a $65 / Club
                </span>
              </div>
              <h5 className="text-sm font-black text-white">
                La Liga cobra su inscripción regular y se queda con la diferencia neta
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ejemplo real: La Liga Barrial Pichincha cobra su inscripción básica de <strong>${precioInscripcionLiga} USD</strong>. DeporVerso cobra por la automatización completa (vocalía, carnets QR, tablas en vivo y actas digitales) únicamente <strong>$35 USD</strong> por club.
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Ganancia neta para la Liga ({numClubes} clubes):</span>
                <span className="text-base font-black text-emerald-400">+${gananciaInscripcionLiga.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Vía 2: Reducción del 50% en Garantía */}
            <div className="p-5 rounded-2xl bg-[#091533] border border-amber-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Vía 2: Reducción del 50% en Fondo de Garantía
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  -50% Mínimo
                </span>
              </div>
              <h5 className="text-sm font-black text-white">
                El Streaming y el VAR reducen el riesgo; los clubes ahorran en caja inmovilizada
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Históricamente los clubes deben dejar entre $100 y $200 USD de garantía. Al contar con <strong>transmisión en vivo y VAR</strong>, los altercados y suplantaciones se eliminan casi al 100%. La garantía baja a <strong>${garantiaReducida} USD</strong>.
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Capital liberado a los {numClubes} clubes:</span>
                <span className="text-base font-black text-amber-300">+${ahorroGarantiaClubes.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Vía 3: Tienda heroesdeldeporte.com (2%) */}
            <div className="p-5 rounded-2xl bg-[#091533] border border-cyan-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  Vía 3: Venta de Mercadería en heroesdeldeporte.com
                </span>
                <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  2% Comisión Liga
                </span>
              </div>
              <h5 className="text-sm font-black text-white">
                Monetización pasiva por camisetas, indumentaria y souvenirs de los clubes
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cada club de la Liga puede comercializar su indumentaria en la tienda digital oficial multiverso <strong>heroesdeldeporte.com</strong>. Por cada venta generada, <strong>la Liga percibe el 2% de comisión neta directa</strong> los 365 días del año.
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Comisión estimada para la Liga:</span>
                <span className="text-base font-black text-cyan-300">+${comisionTiendaLiga.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Vía 4: El VAR es provisto por la App (Cero costo de equipamiento para la Liga) */}
            <div className="p-5 rounded-2xl bg-[#091533] border border-purple-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-400" />
                  Vía 4: VAR & Streaming Provistos por la App
                </span>
              </div>
              <h5 className="text-sm font-black text-white">
                Cero inversión en hardware para la Liga; la App opera el VAR y el streaming
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                El torneo digital con transmisión en vivo y var lo ubica en otro nivel, atrayendo más clubes y la generación de más torneos deportivos variados y patrocinadores para la liga.
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Costo de equipamiento para la Liga:</span>
                <span className="text-base font-black text-emerald-400">$0 USD (100% Provisto)</span>
              </div>
            </div>

          </div>

          {/* CUADRO RESUMEN DE BENEFICIO NETO TOTAL */}
          <div className="bg-gradient-to-r from-[#040c20] via-[#08183c] to-[#040c20] border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Resumen Integral de Cierre para el Directorio
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  Balance Anual de Beneficios: Liga Barrial Pichincha & 24 Clubes
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Beneficio Neto en Caja Liga:</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  ${beneficioNetoLigaAnual.toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Margen Inscripción Liga</span>
                <span className="text-lg font-bold text-emerald-400">+${gananciaInscripcionLiga.toLocaleString()} USD</span>
                <span className="text-[10px] text-slate-500 block">${margenNetoInscripcionPorClub}/club</span>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Ahorro Garantía Clubes</span>
                <span className="text-lg font-bold text-amber-300">+${ahorroGarantiaClubes.toLocaleString()} USD</span>
                <span className="text-[10px] text-slate-500 block">50% liberado a cajas</span>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Comisión heroesdeldeporte</span>
                <span className="text-lg font-bold text-cyan-300">+${comisionTiendaLiga.toLocaleString()} USD</span>
                <span className="text-[10px] text-slate-500 block">2% por venta</span>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Ahorro en Papelería</span>
                <span className="text-lg font-bold text-white">+${ahorroPapeleriaAnual.toLocaleString()} USD</span>
                <span className="text-[10px] text-slate-500 block">Cero actas físicas</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-300">
              <p className="leading-relaxed">
                Conclusión para la asamblea: <strong>La Liga no gasta, gana dinero desde el día 1 ($15+ por club)</strong>, ahorra tiempo de secretaría, comisiona en tienda oficial, y los clubes reducen a la mitad su garantía gracias al streaming y VAR de DeporVerso.
              </p>
              <button
                onClick={handleCopyProposal}
                className="w-full sm:w-auto px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs font-mono rounded-xl shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {copiedProposal ? '✓ ¡Texto Copiado!' : 'Copiar para WhatsApp'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SIMULADOR EN VIVO PARA DIRIGENTES                          */}
      {/* ============================================================== */}
      {activeTabSection === 'simulator' && (
        <div className="bg-[#060d20] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="space-y-1 border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Demostración Práctica en Tiempo Real
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Simulador de Eventos de Partido para el Directorio
            </h3>
            <p className="text-xs text-slate-400">
              Prueba cómo reacciona el sistema ante las situaciones más comunes que vive la directiva los fines de semana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Prueba 1: Simulación de Gol */}
            <div className="bg-[#08122a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Trophy className="w-4 h-4" />
                <span>Prueba 1: Gol en Vivo</span>
              </div>
              <p className="text-xs text-slate-400">
                Simula la anotación de Santiago López para Deportivo Quito Norte en el Clásico Barrial.
              </p>
              <button
                onClick={handleTriggerSimulatedGoal}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
              >
                {simulatedGoalEvent ? '¡Gol Registrado en 0.2s!' : 'Simular Gol de Quito Norte'}
              </button>
              {simulatedGoalEvent && (
                <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono animate-in fade-in">
                  ✓ Gol computado en Vocalía Digital. Tabla de Serie A recalculada en 0.2 segundos.
                </div>
              )}
            </div>

            {/* Prueba 2: Solicitud de VAR */}
            <div className="bg-[#08122a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Video className="w-4 h-4" />
                <span>Prueba 2: Solicitud VAR</span>
              </div>
              <p className="text-xs text-slate-400">
                Revisa el dictamen del fuera de juego en el partido de Atlético San Antonio con cámara de línea.
              </p>
              <button
                onClick={() => onNavigateSubTab && onNavigateSubTab('matches')}
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Abrir Repetición VAR Oficial
              </button>
            </div>

            {/* Prueba 3: Carnet QR Holográfico */}
            <div className="bg-[#08122a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <QrCode className="w-4 h-4" />
                <span>Prueba 3: Escaneo QR</span>
              </div>
              <p className="text-xs text-slate-400">
                Verifica la credencial digital de Mateo Silva (#10 de Club Deporverso) con foto y habilitación.
              </p>
              <button
                onClick={() => onNavigateSubTab && onNavigateSubTab('teams')}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Inspeccionar Carnet QR Digital
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. BANNER DE CIERRE: PROYECCIÓN Y ACCIÓN                       */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#030816] via-[#091535] to-[#040816] border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Compromiso CIG DeporVerso 2026
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ¿Listo para llevar a Liga Barrial Pichincha al siguiente nivel?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300">
            El sistema está completamente configurado para comenzar el campeonato el próximo fin de semana sin contratiempos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          {onLaunchTour && (
            <button
              onClick={onLaunchTour}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 cursor-pointer transition-all transform hover:scale-105"
            >
              Iniciar Tour del Multiverso
            </button>
          )}

          <button
            onClick={handleCopyProposal}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Copiar Resumen para el Directorio
          </button>
        </div>
      </div>

    </div>
  );
};
