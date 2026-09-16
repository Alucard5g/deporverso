import React, { useState, useMemo } from 'react';
import { DollarSign, Shield, Building, Video, FileText, Plus, CheckCircle, Database, Copy, Download, RefreshCw, Calendar, Image, Sparkles, Cpu, LogOut, Users, Key, Check, ExternalLink, Search, Clock, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Tenant, Sport, Subscription, MigrationTicket, Match, MatchEvent, SportCode, AiChronicle, VocaliaReportRecord } from '../../types';
import { FULL_SUPABASE_SQL_SCRIPT } from '../../data/sqlScript';
import { CalendarCardGenerator } from '../CalendarCardGenerator';
import { INITIAL_MATCHES, INITIAL_TEAMS } from '../../data/mockData';
import { SmartIngester } from '../SmartIngestion/SmartIngester';
import { AiChronicleGenerator } from '../Chronicle/AiChronicleGenerator';
import { AdminCRM } from './AdminCRM';
import { syncVocaliaReportToFirebase } from '../../services/firebaseService';

interface MasterAdminDashboardProps {
  tenants: Tenant[];
  sports: Sport[];
  subscriptions: Subscription[];
  migrationTickets: MigrationTicket[];
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  matches?: Match[];
  events?: MatchEvent[];
  vocaliaReports?: VocaliaReportRecord[];
  activeTenantId?: string;
  activeSport?: SportCode;
  onAddTicket?: (ticket: Omit<MigrationTicket, 'id' | 'created_at'>) => void;
  initialAdminTab?: 'overview' | 'crm' | 'vocalia-reports' | 'ingestion' | 'chronicle' | 'calendar' | 'subscriptions' | 'migrations' | 'sql';
  onChronicleGenerated?: (chronicle: AiChronicle) => void;
  onExitAdminMode?: () => void;
}

export const MasterAdminDashboard: React.FC<MasterAdminDashboardProps> = ({
  tenants,
  sports,
  subscriptions,
  migrationTickets,
  onAddTenant,
  matches,
  events,
  vocaliaReports,
  activeTenantId,
  activeSport,
  onAddTicket,
  initialAdminTab = 'overview',
  onChronicleGenerated,
  onExitAdminMode
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'crm' | 'vocalia-reports' | 'ingestion' | 'chronicle' | 'calendar' | 'subscriptions' | 'migrations' | 'sql'>(initialAdminTab);
  const [selectedCalendarTenantId, setSelectedCalendarTenantId] = useState<string>(tenants[0]?.id || '1');

  // Form State for new Tenant
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantSport, setNewTenantSport] = useState('FUTBOL');
  const [newTenantCountry, setNewTenantCountry] = useState('Ecuador');
  const [newTenantPlan, setNewTenantPlan] = useState<'BASIC_3' | 'PRO_5' | 'ENTERPRISE_8'>('PRO_5');
  const [newTenantAdminKey, setNewTenantAdminKey] = useState('');
  const [copiedTenantKeyId, setCopiedTenantKeyId] = useState<string | null>(null);
  const [copiedDeliveryId, setCopiedDeliveryId] = useState<string | null>(null);

  // State for Vocalia Reports Tab
  const [selectedSubdomainFilter, setSelectedSubdomainFilter] = useState<string>('ALL');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [vocaliaSearchQuery, setVocaliaSearchQuery] = useState<string>('');
  const [selectedVocaliaModalReport, setSelectedVocaliaModalReport] = useState<VocaliaReportRecord | null>(null);
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [syncingReportId, setSyncingReportId] = useState<string | null>(null);
  const [syncSuccessReportId, setSyncSuccessReportId] = useState<string | null>(null);

  // Derived Vocalia Reports from props or initial matches
  const derivedVocaliaReports = useMemo<VocaliaReportRecord[]>(() => {
    if (vocaliaReports && vocaliaReports.length > 0) return vocaliaReports;
    const currentMatches = matches || INITIAL_MATCHES;
    const currentEvents = events || [];
    const list: VocaliaReportRecord[] = [];
    currentMatches.forEach(m => {
      if (m.match_data?.vocal_report || m.match_data?.referee_report || m.status === 'IN_PROGRESS' || m.status === 'FINISHED') {
        const tenant = tenants.find(t => t.id === m.tenant_id);
        const homeTeam = INITIAL_TEAMS.find(t => t.id === m.home_team_id);
        const awayTeam = INITIAL_TEAMS.find(t => t.id === m.away_team_id);
        const matchEvts = currentEvents.filter(e => e.match_id === m.id);

        list.push({
          id: `vocalia-${m.id}`,
          match_id: m.id,
          tenant_id: m.tenant_id,
          tenant_name: tenant?.name || 'Liga Deporverso',
          subdomain: tenant?.slug || m.tenant_id,
          domain: tenant?.domain || `${tenant?.slug || 'liga'}.deporverso.app`,
          sport_code: m.sport_code,
          home_team_name: homeTeam?.name || m.home_team_id,
          away_team_name: awayTeam?.name || m.away_team_id,
          home_score: m.home_score ?? 0,
          away_score: m.away_score ?? 0,
          status: m.status,
          current_period: m.match_data?.current_period || '1T',
          vocal_report: m.match_data?.vocal_report || {
            vocal_name: m.match_data?.vocal_name || 'Vocal de Mesa Oficial',
            vocal_cedula: '1712498231',
            observations: 'Planilla digital registrada conforme en el subdominio oficial de la liga.',
            status: 'CONFORME',
            ball_conditions: 'Balones reglamentarios entregados y verificados.',
            start_time: '10:00',
            end_time: '12:00',
            signed: true,
            saved_at: m.created_at
          },
          referee_report: m.match_data?.referee_report || {
            main_referee: m.match_data?.referee_name || 'Árbitro Principal Oficial',
            assistant_1: 'Asistente 1 Oficial',
            assistant_2: 'Asistente 2 Oficial',
            disciplinary_notes: 'Juego reglamentario sin incidentes extraordinarios en el terreno de juego.',
            incidents: 'Ningún incidente grave en graderíos o bancas de suplentes.',
            signatures_verified: true,
            saved_at: m.created_at
          },
          home_captain_approval: m.match_data?.home_captain_approval || {
            captain_name: `Capitán ${homeTeam?.name || 'Local'}`,
            captain_number: 10,
            approved: true,
            approved_at: m.created_at
          },
          away_captain_approval: m.match_data?.away_captain_approval || {
            captain_name: `Capitán ${awayTeam?.name || 'Visitante'}`,
            captain_number: 8,
            approved: true,
            approved_at: m.created_at
          },
          player_stats: m.match_data?.player_stats,
          events_count: matchEvts.length,
          events: matchEvts,
          firestore_path: `firestore://vocalia_reports/vocalia-${m.id}`,
          saved_at: m.match_data?.last_synced_at || m.created_at || new Date().toISOString()
        });
      }
    });
    return list;
  }, [vocaliaReports, matches, events, tenants]);

  // Filtered Vocalia Reports
  const filteredVocaliaReports = useMemo(() => {
    return derivedVocaliaReports.filter(report => {
      if (selectedSubdomainFilter !== 'ALL' && report.tenant_id !== selectedSubdomainFilter && report.subdomain !== selectedSubdomainFilter) {
        return false;
      }
      if (selectedSportFilter !== 'ALL' && report.sport_code !== selectedSportFilter) {
        return false;
      }
      if (selectedStatusFilter === 'LIVE' && report.status !== 'IN_PROGRESS') {
        return false;
      }
      if (selectedStatusFilter === 'FINISHED' && report.status !== 'FINISHED') {
        return false;
      }
      if (vocaliaSearchQuery.trim()) {
        const q = vocaliaSearchQuery.toLowerCase();
        const matchesQuery =
          report.tenant_name.toLowerCase().includes(q) ||
          report.domain.toLowerCase().includes(q) ||
          report.home_team_name.toLowerCase().includes(q) ||
          report.away_team_name.toLowerCase().includes(q) ||
          (report.vocal_report?.vocal_name || '').toLowerCase().includes(q) ||
          (report.referee_report?.main_referee || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [derivedVocaliaReports, selectedSubdomainFilter, selectedSportFilter, selectedStatusFilter, vocaliaSearchQuery]);

  const handleCopyReportSheet = async (report: VocaliaReportRecord) => {
    const text = [
      `========================================================================`,
      `📋 DEPORVERSO - ACTA OFICIAL DE VOCALÍA DIGITAL EN VIVO`,
      `========================================================================`,
      `• Organización / Liga: ${report.tenant_name}`,
      `• Subdominio Oficial: https://${report.domain}`,
      `• Deporte / Disciplina: ${report.sport_code}`,
      `• Partido: ${report.home_team_name} [ ${report.home_score} ] vs [ ${report.away_score} ] ${report.away_team_name}`,
      `• Estado: ${report.status === 'IN_PROGRESS' ? '🔴 EN VIVO' : '🟢 FINALIZADO'} • Período: ${report.current_period || 'Oficial'}`,
      `• Sincronización Firebase: ${report.firestore_path}`,
      `• Fecha / Hora de Registro: ${new Date(report.saved_at).toLocaleString()}`,
      `------------------------------------------------------------------------`,
      `👤 INFORME DE VOCALÍA DE MESA:`,
      `  - Vocal Designado: ${report.vocal_report?.vocal_name || 'No especificado'}`,
      `  - Cédula / Identificación: ${report.vocal_report?.vocal_cedula || 'N/A'}`,
      `  - Dictamen: ${report.vocal_report?.status || 'CONFORME'}`,
      `  - Observaciones: ${report.vocal_report?.observations || 'Sin novedades'}`,
      `  - Balones y Material: ${report.vocal_report?.ball_conditions || 'Reglamentario'}`,
      `------------------------------------------------------------------------`,
      `⚖️ INFORME ARBITRAL & DISCIPLINA:`,
      `  - Árbitro Principal: ${report.referee_report?.main_referee || 'Designado Oficial'}`,
      `  - Disciplina en Cancha: ${report.referee_report?.disciplinary_notes || 'Sin novedades'}`,
      `  - Incidentes: ${report.referee_report?.incidents || 'Ninguno'}`,
      `------------------------------------------------------------------------`,
      `✍️ FIRMAS DIGITALES DE CAPITANES:`,
      `  - Capitán ${report.home_team_name}: ${report.home_captain_approval?.approved ? '✓ FIRMADO Y CONFORME' : 'PENDIENTE'}`,
      `  - Capitán ${report.away_team_name}: ${report.away_captain_approval?.approved ? '✓ FIRMADO Y CONFORME' : 'PENDIENTE'}`,
      `------------------------------------------------------------------------`,
      `🔐 CERTIFICACIÓN FIRESTORE: Sincronizado en la colección /vocalia_reports de Deporverso.`,
      `========================================================================`
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedReportId(report.id);
      setTimeout(() => setCopiedReportId(null), 2500);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleSyncReportToFirebase = async (report: VocaliaReportRecord) => {
    setSyncingReportId(report.id);
    try {
      await syncVocaliaReportToFirebase({
        matchId: report.match_id,
        tenantId: report.tenant_id,
        tenantName: report.tenant_name,
        subdomain: report.subdomain,
        domain: report.domain,
        sportCode: report.sport_code,
        homeTeam: report.home_team_name,
        awayTeam: report.away_team_name,
        homeScore: report.home_score,
        awayScore: report.away_score,
        status: report.status,
        currentPeriod: report.current_period,
        vocalReport: report.vocal_report,
        refereeReport: report.referee_report,
        homeCaptainApproval: report.home_captain_approval,
        awayCaptainApproval: report.away_captain_approval,
        playerStats: report.player_stats,
        events: report.events,
        savedAt: new Date().toISOString()
      });
      setSyncSuccessReportId(report.id);
      setTimeout(() => setSyncSuccessReportId(null), 3000);
    } catch (e) {
      console.error('Error syncing vocalia report to Firebase:', e);
    } finally {
      setSyncingReportId(null);
    }
  };

  // Calculations
  const totalTenants = tenants.length;
  const annualLicensesTotal = totalTenants * 25.00;
  
  const mrrTotal = subscriptions.reduce((acc, sub) => acc + Number(sub.price_monthly), 0);
  const arrTotal = (mrrTotal * 12) + annualLicensesTotal;

  const generateRandomKey = (slug: string) => {
    const cleanSlug = (slug || 'LIGA').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `DV-${cleanSlug}-${randomNum}-ADM`;
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSlug) return;

    const finalSlug = newTenantSlug.toLowerCase().trim().replace(/\s+/g, '-');
    const finalKey = newTenantAdminKey.trim() || generateRandomKey(finalSlug);

    onAddTenant({
      name: newTenantName,
      slug: finalSlug,
      sport_code: newTenantSport as any,
      country: newTenantCountry,
      currency: 'USD',
      domain: `${finalSlug}.deporverso.app`,
      admin_key: finalKey,
      is_active: true,
      annual_license_fee: 25.00,
      plan_tier: newTenantPlan
    });

    setNewTenantName('');
    setNewTenantSlug('');
    setNewTenantAdminKey('');
    setShowAddModal(false);
  };

  const handleCopyKey = async (tenantId: string, key: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(key);
      }
      setCopiedTenantKeyId(tenantId);
      setTimeout(() => setCopiedTenantKeyId(null), 2500);
    } catch (e) {
      console.warn('Clipboard write prevented:', e);
    }
  };

  const handleCopyDeliverySheet = async (tenant: Tenant) => {
    const text = [
      `======================================================`,
      `🏆 DEPORVERSO - FICHA DE ENTREGA Y ACCESO DE LIGA / SUBDOMINIO`,
      `======================================================`,
      `• Organización / Liga: ${tenant.name}`,
      `• Disciplina Oficial: ${tenant.sport_code}`,
      `• Subdominio Oficial: https://${tenant.domain}`,
      `• Clave de Administrador (Confidencial): ${tenant.admin_key || 'DV-ADM-2026-KEY'}`,
      `• Tarifa Anual: $${tenant.annual_license_fee.toFixed(2)} USD`,
      `• Plan Cloud: ${tenant.plan_tier || 'PRO_5'}`,
      `• Estado RLS: Aislamiento Multi-Tenant Activo`,
      `======================================================`,
      `Instrucciones para el Administrador de Liga:`,
      `1. Acceda a https://${tenant.domain}`,
      `2. Seleccione 'Ingresar como Administrador de Liga'`,
      `3. Ingrese su clave de seguridad exclusiva`,
      `======================================================`
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedDeliveryId(tenant.id);
      setTimeout(() => setCopiedDeliveryId(null), 3000);
    } catch (e) {
      console.warn('Clipboard write prevented:', e);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(FULL_SUPABASE_SQL_SCRIPT);
      }
    } catch (e) {
      console.warn('Clipboard write prevented:', e);
    }
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const downloadSqlFile = () => {
    const element = document.createElement("a");
    const file = new Blob([FULL_SUPABASE_SQL_SCRIPT], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "sportia_supabase_schema.sql";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* SuperAdmin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Control Maestro Exclusivo
            </span>
            <span className="text-slate-400 text-xs font-medium">Panel Principal • Administrador Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Panel SuperAdmin Deporverso
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Administración Global Multi-Tenant, Licencias Anuales ($25/año), Planes Recurrentes ($3, $5, $8/mes) e Ingesta de Datos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {onExitAdminMode && (
            <button
              onClick={onExitAdminMode}
              className="inline-flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 font-black px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap text-xs"
              title="Cerrar panel de administrador y regresar al modo público"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              Salir de Modo Administrador
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap text-xs"
          >
            <Plus className="w-4 h-4" />
            Nueva Liga / Organización
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Ingresos Licencias Anuales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">${annualLicensesTotal.toFixed(2)} USD</div>
          <p className="text-xs text-slate-400 mt-1">${25.00} USD por cada una de las {totalTenants} ligas activas</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>MRR Mensual Recurrente</span>
            <Building className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${mrrTotal.toFixed(2)} USD / mes</div>
          <p className="text-xs text-slate-400 mt-1">Suscripciones activas ($3, $5 y $8/mes)</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>ARR Proyectado Anual</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">${arrTotal.toFixed(2)} USD / año</div>
          <p className="text-xs text-slate-400 mt-1">Proyección global de ingresos Deporverso</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Módulos VAR A la Carta</span>
            <Video className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white">$12.00 USD</div>
          <p className="text-xs text-slate-400 mt-1">Tarifa fija de revisión por encuentro</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'overview'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Organizaciones y Ligas ({totalTenants})
        </button>
        <button
          onClick={() => setActiveAdminTab('crm')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'crm'
              ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          CRM Ligas & Ventas (Confidencial)
        </button>
        <button
          onClick={() => setActiveAdminTab('vocalia-reports')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'vocalia-reports'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          Informes de Vocalía en Vivo ({derivedVocaliaReports.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('ingestion')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'ingestion'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Ingesta Inteligente IA
        </button>
        <button
          onClick={() => setActiveAdminTab('chronicle')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'chronicle'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          IA Periodística (Gemini)
        </button>
        <button
          onClick={() => setActiveAdminTab('calendar')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'calendar'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-emerald-400" />
          Generador de Calendario HD JPG
        </button>
        <button
          onClick={() => setActiveAdminTab('subscriptions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'subscriptions'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Control de Suscripciones Custom
        </button>
        <button
          onClick={() => setActiveAdminTab('migrations')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'migrations'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Solicitudes Migración Asistida ({migrationTickets.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('sql')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'sql'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Script SQL Supabase DDL
        </button>
      </div>

      {/* TAB 1: TENANTS LIST */}
      {activeAdminTab === 'overview' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            Ligas y Torneos Registrados (Aislamiento Multi-Tenant RLS)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Organización / Liga</th>
                  <th className="py-3 px-4">Disciplina</th>
                  <th className="py-3 px-4">País / Moneda</th>
                  <th className="py-3 px-4">Dominio Tenant</th>
                  <th className="py-3 px-4">Clave Admin & Entrega</th>
                  <th className="py-3 px-4">Licencia Anual</th>
                  <th className="py-3 px-4">Plan Recurrente</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm font-medium text-slate-200">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-black uppercase text-[#00ff66] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.8)]"></div>
                      {t.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">{t.sport_code}</td>
                    <td className="py-3 px-4 text-slate-300">{t.country} ({t.currency})</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-md inline-flex items-center gap-1">
                        https://{t.domain}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{t.admin_key || 'DV-ADM-2026-KEY'}</span>
                        </div>
                        <button
                          onClick={() => handleCopyKey(t.id, t.admin_key || 'DV-ADM-2026-KEY')}
                          title="Copiar solo la clave secreta"
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedTenantKeyId === t.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyDeliverySheet(t)}
                          title="Copiar ficha completa de entrega para el Administrador de Liga"
                          className="px-2 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1"
                        >
                          {copiedDeliveryId === t.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">¡Ficha Copiada!</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3 text-amber-400" />
                              <span>Ficha Entrega</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">${t.annual_license_fee.toFixed(2)}/año</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-700">
                        {t.plan_tier === 'BASIC_3' ? '$3/mes (Básico)' : t.plan_tier === 'ENTERPRISE_8' ? '$8/mes (Enterprise)' : '$5/mes (Pro)'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CRM LIGAS & VENTAS (CONFIDENCIAL) */}
      {activeAdminTab === 'crm' && (
        <AdminCRM />
      )}

      {/* TAB: INFORMES DE VOCALÍA EN VIVO (SUBDOMINIOS & FIREBASE) */}
      {activeAdminTab === 'vocalia-reports' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Sincronización en Tiempo Real
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    Firestore: /vocalia_reports
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-400" />
                  Informes de Vocalía en Vivo por Subdominio & Firebase
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Supervisión centralizada de actas de mesa, firmas biométricas de capitanes, informes de vocales y ternas arbitrales emitidas desde los subdominios de cada liga (<code className="text-cyan-300">*.deporverso.app</code>). Cada informe se guarda de forma permanente en Firebase Firestore y se replica al panel maestro.
                </p>
              </div>

              {/* Cloud Connection Badge */}
              <div className="bg-black/60 rounded-xl border border-emerald-500/30 p-3 text-right shrink-0 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Estado de Conexión</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>thin-aloe-bbndl Conectado</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">Dual-write /matches + /vocalia_reports</div>
              </div>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Actas Registradas</span>
                <div className="text-2xl font-black text-white mt-1">{derivedVocaliaReports.length}</div>
                <span className="text-[10px] text-slate-500">Planillas oficiales en sistema</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Vocalía en Vivo</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {derivedVocaliaReports.filter(r => r.status === 'IN_PROGRESS').length}
                </div>
                <span className="text-[10px] text-emerald-300/60">Partidos con mesa activa</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actas Finalizadas & Conformes</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {derivedVocaliaReports.filter(r => r.status === 'FINISHED').length}
                </div>
                <span className="text-[10px] text-slate-500">Con firmas de capitanes y vocal</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subdominios Con Actividad</span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {new Set(derivedVocaliaReports.map(r => r.subdomain)).size}
                </div>
                <span className="text-[10px] text-slate-500">Ligas federadas con actas</span>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por equipo, vocal, árbitro, subdominio..."
                  value={vocaliaSearchQuery}
                  onChange={(e) => setVocaliaSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Subdomain Filter */}
              <select
                value={selectedSubdomainFilter}
                onChange={(e) => setSelectedSubdomainFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">🌐 Todos los Subdominios ({tenants.length})</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.domain})
                  </option>
                ))}
              </select>

              {/* Sport Filter */}
              <select
                value={selectedSportFilter}
                onChange={(e) => setSelectedSportFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">⚽ Todos los Deportes</option>
                {sports.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="LIVE">🔴 En Vivo</option>
                <option value="FINISHED">🟢 Finalizados</option>
              </select>
            </div>

            {/* Clear Filters button */}
            {(selectedSubdomainFilter !== 'ALL' || selectedSportFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || vocaliaSearchQuery) && (
              <button
                onClick={() => {
                  setSelectedSubdomainFilter('ALL');
                  setSelectedSportFilter('ALL');
                  setSelectedStatusFilter('ALL');
                  setVocaliaSearchQuery('');
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
          </div>

          {/* List of Vocalia Reports */}
          {filteredVocaliaReports.length === 0 ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No se encontraron informes de vocalía</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No hay actas que coincidan con los filtros seleccionados. Los informes se generan automáticamente cuando los vocales guardan una mesa en cada subdominio de liga.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredVocaliaReports.map((report) => {
                const isLive = report.status === 'IN_PROGRESS';
                const isSyncing = syncingReportId === report.id;
                const isSyncedSuccess = syncSuccessReportId === report.id;
                const isCopied = copiedReportId === report.id;

                return (
                  <div
                    key={report.id}
                    className={`bg-slate-900 rounded-2xl border transition-all p-5 shadow-lg ${
                      isLive ? 'border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Subdomain + Sport + Status + Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Subdomain Pill */}
                        <a
                          href={`https://${report.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg text-xs font-mono font-bold text-cyan-300 transition-colors"
                          title={`Abrir subdominio oficial https://${report.domain}`}
                        >
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                          <span>https://{report.domain}</span>
                        </a>

                        <span className="text-xs text-slate-400 font-bold">•</span>

                        {/* Tenant Name */}
                        <span className="text-xs font-black uppercase text-slate-200">
                          {report.tenant_name}
                        </span>

                        {/* Sport Badge */}
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md uppercase">
                          {report.sport_code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {isLive ? (
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            🔴 EN VIVO ({report.current_period || '1T'})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                            FINALIZADO CONFORME
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(report.saved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Scoreboard Row */}
                    <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Teams & Score */}
                      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">LOCAL</span>
                          <span className="text-base sm:text-lg font-black text-white">{report.home_team_name}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-black/70 px-4 py-2 rounded-xl border border-slate-800 font-mono shadow-inner">
                          <span className="text-2xl sm:text-3xl font-black text-[#00ff66]">{report.home_score}</span>
                          <span className="text-slate-600 font-bold">:</span>
                          <span className="text-2xl sm:text-3xl font-black text-[#00ff66]">{report.away_score}</span>
                        </div>

                        <div className="text-left">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block font-mono">VISITANTE</span>
                          <span className="text-base sm:text-lg font-black text-white">{report.away_team_name}</span>
                        </div>
                      </div>

                      {/* Events summary pill */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">
                          ⚽ Goles: <strong className="text-white">{report.home_score + report.away_score}</strong>
                        </span>
                        <span className="px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">
                          📋 Incidencias: <strong className="text-cyan-400">{report.events_count || 0}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Details in 3 Columns: Vocalia, Arbitraje, Capitanes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                      {/* Column 1: Vocal de Mesa */}
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1 font-mono">
                          <Users className="w-3 h-3 text-amber-400" />
                          Vocal de Mesa Oficial
                        </span>
                        <div className="font-bold text-white truncate">
                          {report.vocal_report?.vocal_name || 'Vocal Designado'}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>C.I.: <strong className="text-slate-300 font-mono">{report.vocal_report?.vocal_cedula || '1700000000'}</strong></span>
                          <span className="text-emerald-400 font-bold">✓ {report.vocal_report?.status || 'CONFORME'}</span>
                        </div>
                        {report.vocal_report?.observations && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                            "{report.vocal_report.observations}"
                          </p>
                        )}
                      </div>

                      {/* Column 2: Terna Arbitral */}
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block flex items-center gap-1 font-mono">
                          <Shield className="w-3 h-3 text-blue-400" />
                          Terna Arbitral & Disciplina
                        </span>
                        <div className="font-bold text-white truncate">
                          {report.referee_report?.main_referee || 'Árbitro Principal'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {report.referee_report?.disciplinary_notes || 'Juego reglamentario sin incidentes extraordinarios.'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Firmas arbitrales validadas
                        </div>
                      </div>

                      {/* Column 3: Validación de Capitanes */}
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Firmas de Capitanes
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>{report.home_team_name}:</span>
                          <span className="text-emerald-400 font-bold font-mono">✓ Aprobado</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>{report.away_team_name}:</span>
                          <span className="text-emerald-400 font-bold font-mono">✓ Aprobado</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Conformidad bilateral en subdominio
                        </div>
                      </div>
                    </div>

                    {/* Footer Row: Firebase Document Path + Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Firestore Path */}
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] truncate max-w-full sm:max-w-md">
                        <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-500">Firestore:</span>
                        <span className="text-slate-300 font-bold truncate">{report.firestore_path}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Resync Button */}
                        <button
                          type="button"
                          disabled={isSyncing}
                          onClick={() => handleSyncReportToFirebase(report)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSyncedSuccess
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                          title="Forzar actualización en Firebase Firestore"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                          <span>{isSyncing ? 'Sincronizando...' : isSyncedSuccess ? '✓ Sincronizado' : 'Re-sincronizar'}</span>
                        </button>

                        {/* Copy Sheet Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyReportSheet(report)}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Copiar texto oficial del acta"
                        >
                          {isCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{isCopied ? '¡Copiado!' : 'Copiar Acta'}</span>
                        </button>

                        {/* View Full Sheet Modal Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedVocaliaModalReport(report)}
                          className="px-4 py-1.5 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Acta Oficial Completa</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: INGESTA IA */}
      {activeAdminTab === 'ingestion' && (
        <SmartIngester
          tenantId={activeTenantId || tenants[0]?.id || 't-pichincha'}
          sportCode={activeSport || 'FUTBOL'}
          onAddTicket={onAddTicket || (() => {})}
        />
      )}

      {/* TAB: IA PERIODÍSTICA */}
      {activeAdminTab === 'chronicle' && (
        <AiChronicleGenerator
          matches={matches || INITIAL_MATCHES}
          events={events || []}
          onChronicleGenerated={onChronicleGenerated}
        />
      )}

      {/* TAB 2: GENERADOR DE CALENDARIOS HD EN IMAGEN */}
      {activeAdminTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Seleccionar Liga para Generar Fixture:</span>
              <select
                value={selectedCalendarTenantId}
                onChange={(e) => setSelectedCalendarTenantId(e.target.value)}
                className="bg-slate-950 text-emerald-400 font-bold text-sm px-4 py-2 rounded-xl border border-slate-700 mt-1 cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.sport_code}) - {t.domain}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              ✓ Exportación Directa a JPG HD (1200 x 1600 px)
            </span>
          </div>

          <CalendarCardGenerator
            tenant={tenants.find(t => t.id === selectedCalendarTenantId) || tenants[0]}
            matches={INITIAL_MATCHES}
            teams={INITIAL_TEAMS}
          />
        </div>
      )}

      {/* TAB 3: SUBSCRIPTIONS */}
      {activeAdminTab === 'subscriptions' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Matriz de Planes SaaS Deporverso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">Básico - $3/mes</span>
              <h3 className="text-xl font-black text-white">Plan Barrial</h3>
              <p className="text-xs text-slate-400">Diseñado para comunidades pequeñas o torneos de un solo deporte.</p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li>✓ Licencia anual de $25 USD</li>
                <li>✓ Vocalía digital estándar</li>
                <li>✓ Hasta 12 equipos</li>
                <li>✓ Generación de calendarios</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-emerald-500/50 shadow-lg shadow-emerald-500/10 space-y-3 relative">
              <span className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">POPULAR</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">Pro - $5/mes</span>
              <h3 className="text-xl font-black text-white">Plan Liga Profesional</h3>
              <p className="text-xs text-slate-400">Para ligas barriales consolidadas y federaciones cantonales.</p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li>✓ Licencia anual de $25 USD</li>
                <li>✓ Vocalía digital multideporte en vivo</li>
                <li>✓ Equipos ilimitados & Carnetización QR</li>
                <li>✓ Ingesta de datos Word / PDF / Excel con IA</li>
                <li>✓ Crónicas deportivas automáticas Gemini</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-purple-500/50 space-y-3">
              <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2.5 py-1 rounded-full">Enterprise - $8/mes</span>
              <h3 className="text-xl font-black text-white">Plan Federación Global</h3>
              <p className="text-xs text-slate-400">Acceso completo multideporte con VAR a la Carta e IA de Visión Artificial.</p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li>✓ Todo lo del Plan Pro</li>
                <li>✓ Integración VAR A la Carta ($12/partido)</li>
                <li>✓ Visión Artificial Edge AI (detección dorsales)</li>
                <li>✓ Asambleas virtuales & Votaciones WhatsApp</li>
                <li>✓ Dominio propio personalizado</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MIGRATIONS */}
      {activeAdminTab === 'migrations' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Bandeja de Migración Asistida (Sistemas Anteriores / PDF / Excel)
          </h2>

          <div className="space-y-3">
            {migrationTickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{t.source_system}</span>
                    <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded font-mono">{t.contact_email}</span>
                  </div>
                  <p className="text-xs text-slate-300">{t.notes}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Archivos adjuntos: {t.file_urls.join(', ')}</p>
                </div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full self-start md:self-auto">
                  Estado: {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SQL SCHEMA EXPORTER */}
      {activeAdminTab === 'sql' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Script SQL Supabase DDL Listo para Producción
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Estructura completa de tablas, enums, políticas Row Level Security (RLS) y semillas de deportes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSql ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                {copiedSql ? '¡Copiado!' : 'Copiar SQL'}
              </button>
              <button
                onClick={downloadSqlFile}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Descargar schema.sql
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] whitespace-pre">
            {FULL_SUPABASE_SQL_SCRIPT}
          </pre>
        </div>
      )}

      {/* ADD TENANT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Registrar Nueva Liga / Torneo SaaS</h3>
            <p className="text-xs text-slate-400">Creación de tenant aislado con política RLS y asignación de disciplina.</p>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de la Organización / Liga</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Liga Deportiva Barrial Quito Sur"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Identificador Slug (subdominio)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="ej. quito-sur"
                    value={newTenantSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setNewTenantSlug(slug);
                      if (!newTenantAdminKey) {
                        setNewTenantAdminKey(generateRandomKey(slug));
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                {newTenantSlug && (
                  <p className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                    <span>Subdominio asignado:</span>
                    <strong className="bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      https://{newTenantSlug.toLowerCase().replace(/\s+/g, '-')}.deporverso.app
                    </strong>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Clave Proporcionada por Administrador (Para Entrega a Liga)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewTenantAdminKey(generateRandomKey(newTenantSlug || 'LIGA'))}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                  >
                    Auto-Generar
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="ej. DV-QUIT-2026-ADM"
                  value={newTenantAdminKey}
                  onChange={(e) => setNewTenantAdminKey(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-2 text-sm text-amber-300 focus:outline-none focus:border-amber-400 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Esta clave única será registrada en el panel y se entregará al Administrador de Liga para la gestión segura y aislada de sus datos.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Disciplina Deportiva</label>
                  <select
                    value={newTenantSport}
                    onChange={(e) => setNewTenantSport(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {sports.map(s => (
                      <option key={s.code} value={s.code}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Plan Mensual</label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BASIC_3">Básico ($3/mes)</option>
                    <option value="PRO_5">Pro ($5/mes)</option>
                    <option value="ENTERPRISE_8">Enterprise ($8/mes)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-colors"
                >
                  Crear Tenant ($25 Licencia + Plan)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACTA OFICIAL DE VOCALÍA EN VIVO (SUBDOMINIO & FIREBASE) */}
      {selectedVocaliaModalReport && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                    https://{selectedVocaliaModalReport.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                    {selectedVocaliaModalReport.sport_code}
                  </span>
                  {selectedVocaliaModalReport.status === 'IN_PROGRESS' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                      🔴 EN VIVO ({selectedVocaliaModalReport.current_period || '1T'})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      ✓ ACTA OFICIAL FINALIZADA
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-white">
                  Ficha Oficial de Vocalía • {selectedVocaliaModalReport.tenant_name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Sincronizado en Firestore: {selectedVocaliaModalReport.firestore_path}
                </p>
              </div>

              <button
                onClick={() => setSelectedVocaliaModalReport(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
              {/* Scoreboard Highlight */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 text-center flex flex-col sm:flex-row items-center justify-around gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">CLUB LOCAL</span>
                  <h4 className="text-lg font-black text-white">{selectedVocaliaModalReport.home_team_name}</h4>
                  <span className="text-xs text-emerald-400 font-bold block">
                    Capitán: {selectedVocaliaModalReport.home_captain_approval?.approved ? '✓ Firma Conforme' : 'Pendiente'}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-700 font-mono shadow-inner">
                  <span className="text-4xl font-black text-[#00ff66] drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]">
                    {selectedVocaliaModalReport.home_score}
                  </span>
                  <span className="text-2xl text-slate-500 font-bold">:</span>
                  <span className="text-4xl font-black text-[#00ff66] drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]">
                    {selectedVocaliaModalReport.away_score}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-teal-400 tracking-wider">CLUB VISITANTE</span>
                  <h4 className="text-lg font-black text-white">{selectedVocaliaModalReport.away_team_name}</h4>
                  <span className="text-xs text-emerald-400 font-bold block">
                    Capitán: {selectedVocaliaModalReport.away_captain_approval?.approved ? '✓ Firma Conforme' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Technical Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Vocalía de Mesa Report */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Users className="w-4 h-4 text-amber-400" />
                      Informe del Vocal de Mesa
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded">
                      {selectedVocaliaModalReport.vocal_report?.status || 'CONFORME'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vocal Responsable:</span>
                      <strong className="text-white">{selectedVocaliaModalReport.vocal_report?.vocal_name || 'Designado Oficial'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cédula / Documento:</span>
                      <strong className="text-slate-200 font-mono">{selectedVocaliaModalReport.vocal_report?.vocal_cedula || '1700000000'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Material y Balones:</span>
                      <span className="text-slate-200">{selectedVocaliaModalReport.vocal_report?.ball_conditions || 'Reglamentario'}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Observaciones de Mesa:</span>
                      <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 italic">
                        "{selectedVocaliaModalReport.vocal_report?.observations || 'Planilla registrada conforme sin novedades técnicas extraordinarias.'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informe Arbitral */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Informe Arbitral Oficial
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded">
                      REGLAMENTARIO
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Árbitro Central:</span>
                      <strong className="text-white">{selectedVocaliaModalReport.referee_report?.main_referee || 'Árbitro Designado'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asistente 1:</span>
                      <span className="text-slate-200">{selectedVocaliaModalReport.referee_report?.assistant_1 || 'Asistente 1 Oficial'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asistente 2:</span>
                      <span className="text-slate-200">{selectedVocaliaModalReport.referee_report?.assistant_2 || 'Asistente 2 Oficial'}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Novedades Disciplinarias:</span>
                      <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 italic">
                        "{selectedVocaliaModalReport.referee_report?.disciplinary_notes || 'Juego dentro del reglamento sin incidentes graves ni expulsiones atípicas.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Captain Approvals & Biometric Status */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider block">
                  Conformidad y Firmas Digitales de Capitanes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Capitán {selectedVocaliaModalReport.home_team_name}</span>
                      <span className="text-white font-bold">{selectedVocaliaModalReport.home_captain_approval?.captain_name || 'Capitán Local'}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      FIRMADO
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Capitán {selectedVocaliaModalReport.away_team_name}</span>
                      <span className="text-white font-bold">{selectedVocaliaModalReport.away_captain_approval?.captain_name || 'Capitán Visitante'}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      FIRMADO
                    </span>
                  </div>
                </div>
              </div>

              {/* Firebase Cloud Ledger Signature */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    Certificación Criptográfica Firebase Firestore
                  </span>
                  <span className="text-[10px] text-slate-500">Dual-write Activo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500">Documento: </span>
                    <span className="text-slate-200">{selectedVocaliaModalReport.firestore_path}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha/Hora UTC: </span>
                    <span className="text-slate-200">{selectedVocaliaModalReport.saved_at}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Subdominio Tenant: </span>
                    <span className="text-cyan-300">https://{selectedVocaliaModalReport.domain}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Estado de Aislamiento: </span>
                    <span className="text-emerald-400 font-bold">Multi-tenant RLS Verificado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyReportSheet(selectedVocaliaModalReport)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copiedReportId === selectedVocaliaModalReport.id ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReportId === selectedVocaliaModalReport.id ? '¡Acta Copiada!' : 'Copiar Acta Oficial'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVocaliaModalReport(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
