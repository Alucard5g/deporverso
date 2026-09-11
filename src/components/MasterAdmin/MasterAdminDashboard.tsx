import React, { useState } from 'react';
import { DollarSign, Shield, Building, Video, FileText, Plus, CheckCircle, Database, Copy, Download, RefreshCw, Calendar, Image, Sparkles, Cpu, LogOut, Users, Key, Check, ExternalLink } from 'lucide-react';
import { Tenant, Sport, Subscription, MigrationTicket, Match, MatchEvent, SportCode, AiChronicle } from '../../types';
import { FULL_SUPABASE_SQL_SCRIPT } from '../../data/sqlScript';
import { CalendarCardGenerator } from '../CalendarCardGenerator';
import { INITIAL_MATCHES, INITIAL_TEAMS } from '../../data/mockData';
import { SmartIngester } from '../SmartIngestion/SmartIngester';
import { AiChronicleGenerator } from '../Chronicle/AiChronicleGenerator';
import { AdminCRM } from './AdminCRM';

interface MasterAdminDashboardProps {
  tenants: Tenant[];
  sports: Sport[];
  subscriptions: Subscription[];
  migrationTickets: MigrationTicket[];
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
  matches?: Match[];
  events?: MatchEvent[];
  activeTenantId?: string;
  activeSport?: SportCode;
  onAddTicket?: (ticket: Omit<MigrationTicket, 'id' | 'created_at'>) => void;
  initialAdminTab?: 'overview' | 'crm' | 'ingestion' | 'chronicle' | 'calendar' | 'subscriptions' | 'migrations' | 'sql';
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
  activeTenantId,
  activeSport,
  onAddTicket,
  initialAdminTab = 'overview',
  onChronicleGenerated,
  onExitAdminMode
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'crm' | 'ingestion' | 'chronicle' | 'calendar' | 'subscriptions' | 'migrations' | 'sql'>(initialAdminTab);
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
    </div>
  );
};
