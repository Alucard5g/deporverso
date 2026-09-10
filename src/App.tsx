import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TopHeader } from './components/TopHeader';
import { WelcomePage } from './components/Landing/WelcomePage';
import { MasterAdminDashboard } from './components/MasterAdmin/MasterAdminDashboard';
import { SuperAdminAuthModal } from './components/MasterAdmin/SuperAdminAuthModal';
import { LeagueDashboard } from './components/LeaguePortal/LeagueDashboard';
import { VocaliaDigital } from './components/Vocalia/VocaliaDigital';
import { ComputerVisionEdge } from './components/Vocalia/ComputerVisionEdge';
import { SmartIngester } from './components/SmartIngestion/SmartIngester';
import { VarModule } from './components/VarModule/VarModule';
import { AiChronicleGenerator } from './components/Chronicle/AiChronicleGenerator';
import { GovernanceVirtual } from './components/Governance/GovernanceVirtual';
import { ScoutingHub } from './components/Scouting/ScoutingHub';
import { TacticalBoard } from './components/Tactics/TacticalBoard';
import { HeroesVrSection } from './components/HeroesVR/HeroesVrSection';
import { MultiSportCalendar } from './components/Calendar/MultiSportCalendar';
import { FULL_SUPABASE_SQL_SCRIPT } from './data/sqlScript';
import { INITIAL_CHRONICLES } from './data/mockData';
import { apiService } from './services/apiService';
import { UserRole, Tenant, Sport, Match, MatchEvent, VarRequest, MigrationTicket, Subscription, Team, Player, SportCode, AiChronicle } from './types';
import { Database, Copy, Download, CheckCircle, Shield, Lock, Sparkles, FileText, LogOut, Users, Flame } from 'lucide-react';
import { testConnection } from './lib/firebase';
import { syncMatchToFirebase, syncEventToFirebase, syncChronicleToFirebase, syncTenantToFirebase, subscribeToMatches } from './services/firebaseService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('LEAGUE_ADMIN');
  const [isSuperAdminAuth, setIsSuperAdminAuth] = useState<boolean>(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState<boolean>(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Escucha global de teclado: Al teclear "1326" en cualquier parte de la página,
  // se activa el modo administrador y se despliega el panel maestro con CRM confidencial
  useEffect(() => {
    let keyBuffer = '';
    let timeoutId: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      // Solo aceptar dígitos
      if (['1', '3', '2', '6'].includes(e.key)) {
        keyBuffer += e.key;
      } else {
        keyBuffer = '';
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        keyBuffer = '';
      }, 2500);

      if (keyBuffer.endsWith('1326')) {
        setIsSuperAdminAuth(true);
        setUserRole('SUPER_ADMIN');
        setActiveTab('master-admin');
        setAdminToast('⚡ Acceso verificado: ¡Modo Administrador y CRM activados!');
        setTimeout(() => setAdminToast(null), 4500);
        keyBuffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  // Application Data States
  const [sports, setSports] = useState<Sport[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string>('t-pichincha');
  const [activeSport, setActiveSport] = useState<SportCode>('FUTBOL');

  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [varRequests, setVarRequests] = useState<VarRequest[]>([]);
  const [migrationTickets, setMigrationTickets] = useState<MigrationTicket[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [publishedChronicles, setPublishedChronicles] = useState<AiChronicle[]>(INITIAL_CHRONICLES);

  const [copiedSql, setCopiedSql] = useState(false);

  // Initial Data Fetching
  useEffect(() => {
    const initData = async () => {
      const sps = await apiService.getSports();
      setSports(sps);

      const tns = await apiService.getTenants();
      setTenants(tns);

      const tms = await apiService.getTeams(activeTenantId);
      setTeams(tms);

      const pls = await apiService.getPlayers(activeTenantId);
      setPlayers(pls);

      const mts = await apiService.getMatches();
      setMatches(mts);

      const vrs = await apiService.getVarRequests();
      setVarRequests(vrs);

      const tks = await apiService.getMigrationTickets();
      setMigrationTickets(tks);

      const sbs = await apiService.getSubscriptions();
      setSubscriptions(sbs);
    };

    initData();
  }, []);

  // Update filtered data when active tenant changes
  useEffect(() => {
    const updateTenantData = async () => {
      const tms = await apiService.getTeams(activeTenantId);
      setTeams(tms);

      const pls = await apiService.getPlayers(activeTenantId);
      setPlayers(pls);

      const currentTenant = tenants.find(t => t.id === activeTenantId);
      if (currentTenant) {
        setActiveSport(currentTenant.sport_code);
      }
    };
    updateTenantData();
  }, [activeTenantId, tenants]);

  // Active Tenant & Sport objects
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0] || {
    id: 't-pichincha',
    name: 'Liga Barrial Pichincha',
    slug: 'liga-pichincha',
    sport_code: 'FUTBOL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'pichincha.sportia.app',
    is_active: true,
    annual_license_fee: 25.00,
    created_at: '2026-01-01T00:00:00Z'
  };

  const defaultSport: Sport = {
    id: 'sp-futbol',
    code: 'FUTBOL',
    name: 'Fútbol 11',
    icon: 'Trophy',
    description: 'Fútbol profesional y amateur 11 vs 11',
    sport_rules: { min_players: 7, max_players: 11, periods: 2 }
  };

  const activeSportObj = sports.find(s => s.code === activeSport) || sports[0] || defaultSport;

  // Tenant Matches
  const tenantMatches = matches.filter(m => m.tenant_id === activeTenantId);

  // Event Handlers con Sincronización Automática a Firebase Firestore
  const handleAddTenant = async (newTenantData: Omit<Tenant, 'id' | 'created_at'>) => {
    const created = await apiService.addTenant(newTenantData);
    setTenants(prev => [created, ...prev]);
    setActiveTenantId(created.id);
    syncTenantToFirebase(created);
  };

  const handleAddMatchEvent = async (eventData: Omit<MatchEvent, 'id' | 'created_at'>) => {
    const created = await apiService.addMatchEvent(eventData);
    setEvents(prev => {
      if (prev.some(e => e.id === created.id)) return prev;
      return [...prev, created];
    });
    syncEventToFirebase(created);
  };

  const handleUpdateMatchScore = async (matchId: string, homeScore: number, awayScore: number, matchData?: any) => {
    const updated = await apiService.updateMatchScore(matchId, homeScore, awayScore, matchData);
    setMatches(prev => prev.map(m => m.id === matchId ? updated : m));
    syncMatchToFirebase(updated);
  };

  const handleSaveVocalia = async (params: {
    matchId: string;
    tenantId: string;
    homeScore: number;
    awayScore: number;
    playerStats: Record<string, any>;
    vocalReport: any;
    refereeReport: any;
    homeCaptainApproval?: any;
    awayCaptainApproval?: any;
    status: 'IN_PROGRESS' | 'FINISHED';
  }) => {
    const updated = await apiService.saveVocaliaReport(params);
    setMatches(prev => prev.map(m => m.id === params.matchId ? updated : m));
    syncMatchToFirebase(updated);
    return updated;
  };

  const handleCreateVarRequest = async (req: Omit<VarRequest, 'id' | 'created_at'>) => {
    const created = await apiService.createVarRequest(req);
    setVarRequests(prev => [created, ...prev]);
  };

  const handleUpdateVarStatus = async (varId: string, status: VarRequest['status'], notes?: string) => {
    const updated = await apiService.updateVarStatus(varId, status, notes);
    setVarRequests(prev => prev.map(v => v.id === varId ? updated : v));
  };

  const handleAddMigrationTicket = async (ticket: Omit<MigrationTicket, 'id' | 'created_at'>) => {
    const created = await apiService.createMigrationTicket(ticket);
    setMigrationTickets(prev => [created, ...prev]);
  };

  const handleAddChronicle = (chronicle: AiChronicle) => {
    setPublishedChronicles(prev => [chronicle, ...prev]);
    syncChronicleToFirebase({
      id: `chr-${chronicle.match_id}-${Date.now()}`,
      tenantId: activeTenantId,
      matchId: chronicle.match_id,
      title: chronicle.headline,
      headline: chronicle.headline,
      content: chronicle.body,
      sport: activeSport,
      author: 'Periodista Deporverso IA'
    });
  };

  const handleTabChange = (tab: string) => {
    if ((tab === 'master-admin' || tab === 'master-admin-crm' || tab === 'sql-viewer') && !isSuperAdminAuth) {
      setShowSuperAdminModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleSuperAdminSuccess = () => {
    setIsSuperAdminAuth(true);
    setUserRole('SUPER_ADMIN');
    setActiveTab('master-admin');
    setAdminToast('⚡ Acceso SuperAdmin Autorizado');
    setTimeout(() => setAdminToast(null), 4000);
  };

  const handleLogoutSuperAdmin = () => {
    setIsSuperAdminAuth(false);
    setUserRole('LEAGUE_ADMIN');
    setActiveTab('welcome');
    setAdminToast('🔒 Sesión cerrada: Modo Administrador desactivado');
    setTimeout(() => setAdminToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col lg:flex-row">
      <SuperAdminAuthModal
        isOpen={showSuperAdminModal}
        onClose={() => setShowSuperAdminModal(false)}
        onSuccess={handleSuperAdminSuccess}
      />

      {/* TOAST FLOTANTE DE NOTIFICACIÓN CLAVE 1326 */}
      {adminToast && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300 border border-amber-300">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Left Column Vertical Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        userRole={userRole}
        setUserRole={setUserRole}
        tenants={tenants}
        activeTenantId={activeTenantId}
        setActiveTenantId={setActiveTenantId}
        activeSport={activeSport}
        setActiveSport={setActiveSport}
        isSuperAdminAuth={isSuperAdminAuth}
        onOpenSuperAdminAuth={() => setShowSuperAdminModal(true)}
        onLogoutSuperAdmin={handleLogoutSuperAdmin}
      />

      {/* Right Column Layout: TopHeader + Main Content Scrollable Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 bg-[#050505]">
        {/* BARRA SUPERIOR DE MODO ADMINISTRADOR GLOBAL (ACTIVO CON 1326) */}
        {isSuperAdminAuth && (
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xl shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-amber-300 font-black tracking-wide uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                Modo Administrador Global Activo
              </span>
              <span className="hidden md:inline text-slate-400 text-[11px]">
                • Panel Maestro y CRM Confidencial desplegados
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('master-admin')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'master-admin'
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                    : 'text-amber-300 hover:text-white bg-amber-500/10 border border-amber-500/30'
                }`}
              >
                Panel Maestro
              </button>
              <button
                onClick={() => setActiveTab('master-admin-crm')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'master-admin-crm'
                    ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                    : 'text-indigo-300 hover:text-white bg-indigo-500/10 border border-indigo-500/30'
                }`}
              >
                <Users className="w-3 h-3 text-indigo-400" />
                CRM Ligas (Confidencial)
              </button>
              <button
                onClick={handleLogoutSuperAdmin}
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ml-1"
                title="Cerrar sesión de administrador y ocultar funciones"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Salir de Modo Admin</span>
              </button>
            </div>
          </div>
        )}

        <TopHeader
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          userRole={userRole}
          setUserRole={setUserRole}
          tenants={tenants}
          activeTenantId={activeTenantId}
          setActiveTenantId={setActiveTenantId}
          activeSport={activeSport}
          setActiveSport={setActiveSport}
          onOpenOnboarding={() => setActiveTab('welcome')}
          isSuperAdminAuth={isSuperAdminAuth}
          onOpenSuperAdminAuth={() => setShowSuperAdminModal(true)}
          onLogoutSuperAdmin={handleLogoutSuperAdmin}
        />

        {/* Main App Content View Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {activeTab === 'welcome' && (
          <WelcomePage
            onNavigateTab={handleTabChange}
            onAddTenant={handleAddTenant}
            setUserRole={setUserRole}
            isSuperAdminAuth={isSuperAdminAuth}
            onSuperAdminAuthSuccess={handleSuperAdminSuccess}
          />
        )}

        {activeTab === 'calendar' && (
          <MultiSportCalendar
            matches={matches}
            teams={teams}
            tenants={tenants}
            activeSport={activeSport}
            onSelectSport={(sport) => setActiveSport(sport)}
            onNavigateTab={handleTabChange}
          />
        )}

        {(activeTab === 'master-admin' || activeTab === 'master-admin-crm') && (
          isSuperAdminAuth ? (
            <MasterAdminDashboard
              tenants={tenants}
              sports={sports}
              subscriptions={subscriptions}
              migrationTickets={migrationTickets}
              onAddTenant={handleAddTenant}
              matches={matches}
              events={events}
              activeTenantId={activeTenantId}
              activeSport={activeSport}
              onAddTicket={handleAddMigrationTicket}
              onChronicleGenerated={handleAddChronicle}
              initialAdminTab={activeTab === 'master-admin-crm' ? 'crm' : 'overview'}
              onExitAdminMode={handleLogoutSuperAdmin}
            />
          ) : (
            <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Panel Maestro Protegido</h2>
              <p className="text-xs text-white/60">
                Este panel contiene herramientas avanzadas de administración global, CRM confidencial de ligas, gestión de licencias multi-tenant e ingesta inteligente de datos.
              </p>
              <button
                onClick={() => setShowSuperAdminModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Ingresar al Modo Administrador</span>
              </button>
            </div>
          )
        )}

        {activeTab === 'league' && (
          <LeagueDashboard
            tenant={activeTenant}
            sport={activeSportObj}
            matches={tenantMatches}
            teams={teams}
            players={players}
            publishedChronicles={publishedChronicles}
          />
        )}

        {activeTab === 'vocalia' && (
          <VocaliaDigital
            matches={tenantMatches.length > 0 ? tenantMatches : matches}
            tenant={activeTenant}
            teams={teams}
            sport={activeSportObj}
            players={players}
            events={events}
            onAddEvent={handleAddMatchEvent}
            onUpdateScore={handleUpdateMatchScore}
            onSaveVocalia={handleSaveVocalia}
          />
        )}

        {activeTab === 'vision-ai' && (
          <ComputerVisionEdge match={tenantMatches[0] || matches[0]} />
        )}

        {activeTab === 'ingestion' && (
          isSuperAdminAuth ? (
            <MasterAdminDashboard
              tenants={tenants}
              sports={sports}
              subscriptions={subscriptions}
              migrationTickets={migrationTickets}
              onAddTenant={handleAddTenant}
              matches={matches}
              events={events}
              activeTenantId={activeTenantId}
              activeSport={activeSport}
              onAddTicket={handleAddMigrationTicket}
              initialAdminTab="ingestion"
              onChronicleGenerated={handleAddChronicle}
            />
          ) : (
            <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Módulo Exclusivo de Administración</h2>
              <p className="text-xs text-white/60">
                La ingesta inteligente de datos de ligas (3 Caminos) es una herramienta disponible únicamente en el Panel de Administración Maestro.
              </p>
              <button
                onClick={() => setShowSuperAdminModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Acceder como Administrador</span>
              </button>
            </div>
          )
        )}

        {activeTab === 'var' && (
          <VarModule
            tenantId={activeTenantId}
            matches={tenantMatches.length > 0 ? tenantMatches : matches}
            varRequests={varRequests}
            onCreateVarRequest={handleCreateVarRequest}
            onUpdateVarStatus={handleUpdateVarStatus}
          />
        )}

        {activeTab === 'chronicle' && (
          isSuperAdminAuth ? (
            <MasterAdminDashboard
              tenants={tenants}
              sports={sports}
              subscriptions={subscriptions}
              migrationTickets={migrationTickets}
              onAddTenant={handleAddTenant}
              matches={matches}
              events={events}
              activeTenantId={activeTenantId}
              activeSport={activeSport}
              onAddTicket={handleAddMigrationTicket}
              initialAdminTab="chronicle"
              onChronicleGenerated={handleAddChronicle}
            />
          ) : (
            <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-5 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Generador Exclusivo de Administración</h2>
                <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                  El generador de Crónicas IA es una herramienta de uso exclusivo del Administrador Maestro. Todos los artículos y resúmenes generados están publicados y disponibles públicamente en el Blog Deportivo.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTab('league')}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver Blog & Crónicas Publicadas</span>
                </button>
                <button
                  onClick={() => setShowSuperAdminModal(true)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-amber-300 font-bold text-xs rounded-xl transition-all border border-amber-500/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Acceso Administrador Maestro</span>
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'governance' && (
          <GovernanceVirtual tenant={activeTenant} />
        )}

        {activeTab === 'scouting' && (
          <ScoutingHub
            players={players}
            teams={teams}
            activeSport={activeSport}
          />
        )}

        {activeTab === 'tactics' && (
          <TacticalBoard
            sport={activeSportObj}
          />
        )}

        {activeTab === 'heroes-vr' && (
          <HeroesVrSection
            standalone={true}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'sql-viewer' && (
          <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Script SQL Empresarial y Multideporte Global (Supabase Postgres)
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Generado especialmente para Rolando Guerra. Listo para ejecutar directamente en Supabase SQL Editor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(FULL_SUPABASE_SQL_SCRIPT);
                      }
                    } catch (err) {
                      console.warn('Clipboard copy prevented:', err);
                    }
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="inline-flex items-center gap-2 bg-[#121212] hover:bg-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  {copiedSql ? <CheckCircle className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                  {copiedSql ? '¡Copiado!' : 'Copiar Código SQL'}
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([FULL_SUPABASE_SQL_SCRIPT], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = "sportia_supabase_schema.sql";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar schema.sql
                </button>
              </div>
            </div>

            <pre className="bg-[#050505] p-5 rounded-xl border border-white/10 text-cyan-400 font-mono text-xs overflow-x-auto max-h-[600px] whitespace-pre selection:bg-white/20">
              {FULL_SUPABASE_SQL_SCRIPT}
            </pre>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
