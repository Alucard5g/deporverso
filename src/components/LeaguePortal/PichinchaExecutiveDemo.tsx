import React, { useState } from 'react';
import { 
  Trophy, Shield, Zap, Video, Award, Users, CheckCircle2, 
  ArrowRight, Download, Share2, Printer, Sparkles, Check, 
  ExternalLink, Calculator, DollarSign, Clock, FileText, 
  AlertTriangle, Play, Smartphone, QrCode, TrendingUp
} from 'lucide-react';
import { Tenant, Sport, Match, Team, Player } from '../../types';

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
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);
  const [simulatedGoalEvent, setSimulatedGoalEvent] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'dossier' | 'calculator' | 'simulator'>('dossier');

  // Cálculos dinámicos de ROI para el directorio
  const ahorroPapeleriaAnual = numClubes * 145; // Hojas de vocalía, talonarios, carnets físicos
  const horasAhorradasSecretaria = numClubes * 28; // Horas de digitación de tablas y cómputo de actas
  const valorHorasAhorro = horasAhorradasSecretaria * 4.5; // Estimado hora asistente
  const nuevosIngresosVar = numClubes * 8 * 12 * 0.5; // 8 revisiones estimadas por club al año, 50% margen neto liga
  const ahorroTotalAnual = Math.round(ahorroPapeleriaAnual + valorHorasAhorro + nuevosIngresosVar);

  const handlePrintDossier = () => {
    window.print();
  };

  const handleCopyProposal = () => {
    const text = `📋 *Dossier Ejecutivo Oficial — Liga Barrial Pichincha 2026*\n\nEstimados Dirigentes y Presidentes de Clubes de Liga Barrial Pichincha:\n\nPresentamos la transformación digital con la plataforma *DeporVerso*:\n\n1. *Cero Papel:* Vocalía digital en vivo desde cualquier celular.\n2. *Cero Suplantación:* Carnets con código QR holográfico inviolable.\n3. *Tablas en 0.2s:* Recálculo automático de Serie A y B sin errores.\n4. *Justicia Deportiva:* Sistema VAR a la carta barrial para clásicos y finales.\n5. *Ahorro Confirmado:* +$${ahorroTotalAnual.toLocaleString()} USD al año en secretaría y papelería para la Liga.\n\nDemostración interactiva en vivo disponible en: https://deporverso.app`;
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
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#060e22] via-[#091533] to-[#040816] p-6 sm:p-10 shadow-2xl">
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
            <span>2. Calculadora de Ahorro y ROI</span>
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
                    <span>Nuevas fuentes de ingreso: $12 por revisión VAR y venta de publicidad en la app.</span>
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
      {activeTabSection === 'calculator' && (
        <div className="bg-[#060d20] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Retorno de Inversión (ROI) Garantizado
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Calculadora de Ahorro Anual para Liga Barrial Pichincha
              </h3>
            </div>
            
            <div className="flex items-center gap-3 bg-[#0a1532] border border-white/10 rounded-2xl px-4 py-2">
              <span className="text-xs font-mono text-slate-400">Clubes Participantes:</span>
              <select
                value={numClubes}
                onChange={(e) => setNumClubes(Number(e.target.value))}
                className="bg-[#0f214d] text-cyan-300 font-bold font-mono text-sm px-3 py-1 rounded-xl border border-cyan-500/40 focus:outline-none cursor-pointer"
              >
                <option value={12}>12 Clubes</option>
                <option value={16}>16 Clubes</option>
                <option value={20}>20 Clubes</option>
                <option value={24}>24 Clubes (Oficial Pichincha)</option>
                <option value={32}>32 Clubes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#08122c] border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Ahorro en Papelería</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                ${ahorroPapeleriaAnual.toLocaleString()} USD
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Talonarios, planillas y carnets</span>
            </div>

            <div className="bg-[#08122c] border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Horas de Secretaría Ahorradas</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono block">
                {horasAhorradasSecretaria} Horas
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">28 hrs ahorradas por club</span>
            </div>

            <div className="bg-[#08122c] border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">Nuevos Ingresos VAR (Neto)</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono block">
                +${nuevosIngresosVar.toLocaleString()} USD
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Por solicitudes en clásicos</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/40 to-[#071928] border border-emerald-500/40 rounded-2xl p-5 text-center shadow-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1 font-bold">Beneficio Neto Anual</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono block">
                ${ahorroTotalAnual.toLocaleString()} USD
              </span>
              <span className="text-[11px] text-emerald-400/80 mt-1 block">Ahorro + Nuevos Ingresos</span>
            </div>
          </div>

          <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <span>
              La suscripción de afiliación anual es de únicamente <strong>$25 por club</strong> ($600 USD para los 24 clubes), produciendo un retorno de inversión superior al <strong>800%</strong> el primer año.
            </span>
            <button
              onClick={handleCopyProposal}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap self-start sm:self-center shrink-0"
            >
              Exportar Cálculo a WhatsApp
            </button>
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
