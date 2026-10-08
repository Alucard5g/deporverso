import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TopHeader } from './components/TopHeader';
import { WelcomePage } from './components/Landing/WelcomePage';
import { MasterAdminDashboard } from './components/MasterAdmin/MasterAdminDashboard';
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
import { INITIAL_CHRONICLES, INITIAL_MATCH_EVENTS } from './data/mockData';
import { apiService } from './services/apiService';
import { UserRole, Tenant, Sport, Match, MatchEvent, VarRequest, MigrationTicket, Subscription, Team, Player, SportCode, AiChronicle } from './types';
import { Database, Copy, Download, CheckCircle, Shield, Lock, Sparkles, FileText, LogOut, Users, Flame } from 'lucide-react';
import { testConnection } from './lib/firebase';
import { syncMatchToFirebase, syncEventToFirebase, syncChronicleToFirebase, syncTenantToFirebase, subscribeToMatches } from './services/firebaseService';
import { AffiliationModal } from './components/Affiliation/AffiliationModal';
import { LoginGate } from './components/Auth/LoginGate';
import { CampaignBannersGenerator } from './components/Marketing/CampaignBannersGenerator';
import { ExclusiveOfferCheckoutModal } from './components/Marketing/ExclusiveOfferCheckoutModal';
import { ClubDeporversoShowcase } from './components/ClubShowcase/ClubDeporversoShowcase';
import { MultiversoStepTourModal } from './components/Demo/MultiversoStepTourModal';
import deporversoDarkBg from './assets/images/deporverso_dark_bg_1789426720628.jpg';

export default function App() {
  // La aplicación inicia para todos requiriendo registro previo (LoginGate con Panel de Registro)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('LEAGUE_ADMIN');
  const [isSuperAdminAuth, setIsSuperAdminAuth] = useState<boolean>(false);
  const [showAffiliationModal, setShowAffiliationModal] = useState<boolean>(false);
  const [showCheckoutOfferModal, setShowCheckoutOfferModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [hasPaidFullAccess, setHasPaidFullAccess] = useState<boolean>(() => {
    try {
      return localStorage.getItem('deporverso_has_paid') === 'true';
    } catch {
      return false;
    }
  });
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [isPlatformUnlocked, setIsPlatformUnlocked] = useState<boolean>(false);
  const [isStepTourOpen, setIsStepTourOpen] = useState<boolean>(false);
  const [stepTourInitialIndex, setStepTourInitialIndex] = useState<number>(0);

  const handleOpenStepTour = (initialIndex: number = 0) => {
    setStepTourInitialIndex(initialIndex);
    setIsStepTourOpen(true);
  };

  const handleLoginSuccess = (authData: { role: UserRole; email: string; isSuperAdmin: boolean }) => {
    setIsAuthenticated(true);
    setUserRole(authData.role);
    setIsSuperAdminAuth(authData.isSuperAdmin);
    setIsPlatformUnlocked(true);
    setCurrentUserEmail(authData.email);
    setShowAuthModal(false);

    try {
      localStorage.setItem('deporverso_auth_session', JSON.stringify({
        authenticated: true,
        role: authData.role,
        email: authData.email,
        isSuperAdmin: authData.isSuperAdmin,
        loginTimestamp: Date.now()
      }));
    } catch (e) {
      console.warn('No se pudo guardar la sesión en localStorage:', e);
    }

    if (authData.isSuperAdmin) {
      setActiveTab('master-admin');
      setAdminToast('👑 Acceso Maestro: Modo Super Administrador CIG (Acceso Total Desbloqueado)');
    } else {
      setActiveTenantId('t-pichincha');
      setActiveSport('FUTBOL');
      setActiveTab('league');
      setAdminToast(`✓ ¡Bienvenido ${authData.email}! Acceso concedido a la demo de la Liga Pichincha y el Club Deporverso.`);
    }
    setTimeout(() => setAdminToast(null), 4500);
  };

  const handleGlobalLogout = () => {
    try {
      localStorage.removeItem('deporverso_auth_session');
    } catch (e) {}
    setIsAuthenticated(false);
    setIsSuperAdminAuth(false);
    setIsPlatformUnlocked(false);
    setCurrentUserEmail('');
    setUserRole('LEAGUE_ADMIN');
    setActiveTab('welcome');
    setAdminToast('🔒 Plataforma bloqueada: Sesión cerrada');
    setTimeout(() => setAdminToast(null), 3000);
  };

  // Escucha global de teclado: El administrador accede desde cualquier parte de la app con su clave 1326 al ser digitada
  useEffect(() => {
    let keyBuffer = '';
    let timeoutId: any = null;

    const handleGlobalKeyStroke = (e: KeyboardEvent) => {
      // Capturar cualquier caracter simple introducido
      if (e.key && e.key.length === 1) {
        keyBuffer += e.key;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          keyBuffer = '';
        }, 3500);

        if (keyBuffer.endsWith('1326')) {
          keyBuffer = '';
          setIsAuthenticated(true);
          setIsSuperAdminAuth(true);
          setUserRole('SUPER_ADMIN');
          setIsPlatformUnlocked(true);
          setCurrentUserEmail('roly3d.rg@gmail.com');
          setActiveTab('master-admin');
          setAdminToast('👑 Acceso Maestro: Modo Administrador CIG Desbloqueado (1326)');
          setTimeout(() => setAdminToast(null), 4500);

          try {
            localStorage.setItem('deporverso_auth_session', JSON.stringify({
              authenticated: true,
              role: 'SUPER_ADMIN',
              email: 'roly3d.rg@gmail.com',
              isSuperAdmin: true,
              loginTimestamp: Date.now()
            }));
          } catch (err) {
            console.warn('Error guardando sesión admin:', err);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyStroke, true);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyStroke, true);
      clearTimeout(timeoutId);
    };
  }, []);

  // Application Data States
  const [sports, setSports] = useState<Sport[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string>('t-pichincha');
  const [activeSport, setActiveSport] = useState<SportCode>('FUTBOL');

  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>(INITIAL_MATCH_EVENTS);
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
    domain: 'pichincha.deporverso.app',
    admin_key: 'DV-PICH-2026-ADM',
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

  const handlePlayerTransferred = (playerId: string, newTeamId: string, newJerseyNumber?: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          team_id: newTeamId,
          jersey_number: newJerseyNumber !== undefined ? newJerseyNumber : p.jersey_number
        };
      }
      return p;
    }));
  };

  const handleEnterFullPlatform = (targetTab: string = 'league') => {
    setIsPlatformUnlocked(true);
    setActiveTab(targetTab === 'welcome' ? 'league' : targetTab);
  };

  const handleReturnToHome = () => {
    setIsPlatformUnlocked(false);
    setActiveTab('welcome');
  };

  const DEMO_ALLOWED_TABS = ['welcome', 'club-deporverso', 'league', 'exclusive-offer'];

  const handleTabChange = (tab: string) => {
    if (tab === 'welcome') {
      handleReturnToHome();
      return;
    }
    const resolvedTab = tab === 'demo-multiverso' ? 'league' : tab;
    if ((resolvedTab === 'master-admin' || resolvedTab === 'master-admin-crm' || resolvedTab === 'sql-viewer' || resolvedTab === 'campaign-banners') && !isSuperAdminAuth) {
      return;
    }

    // Regla 1: Un usuario no registrado (invitado) solo accede a Inicio ('welcome').
    // Si intenta acceder a la demo de Liga Pichincha o Club Deporverso, debe registrarse:
    if (!isAuthenticated && !isSuperAdminAuth && resolvedTab !== 'exclusive-offer') {
      setAuthModalMode('register');
      setShowAuthModal(true);
      setAdminToast('👋 Regístrate gratis para acceder a la demo de la Liga Pichincha y el Club Deporverso.');
      setTimeout(() => setAdminToast(null), 4500);
      return;
    }

    // Regla 2: El usuario registrado solo accede a la demo ('league' y 'club-deporverso').
    // Los usuarios que paguen la suscripción acceden al portal de Deporverso completo:
    if (!hasPaidFullAccess && !isSuperAdminAuth && !DEMO_ALLOWED_TABS.includes(resolvedTab)) {
      setShowCheckoutOfferModal(true);
      setAdminToast('🔒 Este usuario solo accede a la demo. Para desbloquear el portal de Deporverso completo, suscríbete ($35 por club y torneo).');
      setTimeout(() => setAdminToast(null), 5000);
      return;
    }

    setIsPlatformUnlocked(true);
    setActiveTab(resolvedTab);
  };

  const handleLogoutSuperAdmin = () => {
    setIsAuthenticated(false);
    setIsSuperAdminAuth(false);
    setUserRole('LEAGUE_ADMIN');
    setIsPlatformUnlocked(false);
    setCurrentUserEmail('');
    setActiveTab('welcome');
    try {
      localStorage.removeItem('deporverso_auth_session');
    } catch (e) {}
    setAdminToast('🔒 Panel de Administrador cerrado: Vuelto a Inicio');
    setTimeout(() => setAdminToast(null), 3000);
  };

  const handleElevateToSuperAdmin = () => {
    setIsSuperAdminAuth(true);
    setUserRole('SUPER_ADMIN');
    setCurrentUserEmail('roly3d.rg@gmail.com');
    setAdminToast('👑 Sesión elevada: Acceso concedido como Administrador Maestro');
    setTimeout(() => setAdminToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col lg:flex-row overflow-x-hidden">
      {/* TOAST FLOTANTE DE NOTIFICACIÓN ADMINISTRADOR */}
      {adminToast && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300 border border-amber-300">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* MODAL DE AFILIACIÓN AL DEPORVERSO */}
      <AffiliationModal
        isOpen={showAffiliationModal}
        onClose={() => setShowAffiliationModal(false)}
        onAddTenant={handleAddTenant}
        initialSport={activeSport}
      />

      {/* Left Column Vertical Sidebar Navigation (Panel Imagen 2) - Se oculta en inicio y se despliega al presionar el botón */}
      <div
        className={`transition-all duration-700 ease-in-out shrink-0 z-40 ${
          isPlatformUnlocked
            ? 'translate-x-0 w-full lg:w-64 opacity-100'
            : '-translate-x-full w-0 max-w-0 overflow-hidden opacity-0 pointer-events-none fixed lg:static'
        }`}
      >
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
          onLogoutSuperAdmin={handleLogoutSuperAdmin}
          hasPaidFullAccess={hasPaidFullAccess}
          onOpenCheckout={() => setShowCheckoutOfferModal(true)}
          isAuthenticated={isAuthenticated}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'register');
            setShowAuthModal(true);
          }}
        />
      </div>

      {/* Right Column Layout: TopHeader + Main Content Scrollable Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 bg-[#030610] relative">
        {/* Deporverso Ambient Stadium Texture */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <img
            src={deporversoDarkBg}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-20 filter brightness-90 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030610]/95 via-[#030610]/85 to-[#030610]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030610]/60 to-[#030610]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col min-h-full">
          {/* BARRA SUPERIOR DE MODO ADMINISTRADOR GLOBAL (AUTORIZADO CON CREDENCIALES) */}
          {isSuperAdminAuth && isPlatformUnlocked && (
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

          {/* TopHeader (Panel Imagen 1) - Se oculta en inicio y se despliega al presionar el botón */}
          <div
            className={`transition-all duration-700 ease-in-out z-30 shrink-0 ${
              isPlatformUnlocked
                ? 'translate-y-0 opacity-100 max-h-36'
                : '-translate-y-full opacity-0 max-h-0 overflow-hidden pointer-events-none'
            }`}
          >
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
              onOpenOnboarding={() => setShowAffiliationModal(true)}
              isSuperAdminAuth={isSuperAdminAuth}
              onLogoutSuperAdmin={handleLogoutSuperAdmin}
              onElevateToSuperAdmin={handleElevateToSuperAdmin}
              userEmail={currentUserEmail}
              onLogout={handleGlobalLogout}
              onOpenStepTour={handleOpenStepTour}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode || 'register');
                setShowAuthModal(true);
              }}
              hasPaidFullAccess={hasPaidFullAccess}
              onOpenCheckout={() => setShowCheckoutOfferModal(true)}
            />
          </div>

          {/* Main App Content View Container */}
          <main className={`flex-1 w-full min-w-0 transition-all duration-500 ${
            isPlatformUnlocked
              ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'
              : 'p-0 w-full'
          }`}>
            {activeTab === 'club-deporverso' && (
              <ClubDeporversoShowcase
                onUnlockFullPortal={() => {
                  setHasPaidFullAccess(true);
                  try {
                    localStorage.setItem('deporverso_has_paid', 'true');
                  } catch (e) {}
                  setActiveTab('league');
                  setAdminToast('🎉 ¡Licencia CIG Activada! Tienes acceso total al portal de administración.');
                }}
                onOpenCheckout={() => setShowCheckoutOfferModal(true)}
                isUnlocked={hasPaidFullAccess || isSuperAdminAuth}
                userEmail={currentUserEmail}
                onNavigateTab={handleTabChange}
                onOpenStepTour={handleOpenStepTour}
              />
            )}

            {activeTab === 'welcome' && (
              <WelcomePage
                onNavigateTab={handleTabChange}
                onEnterFullPlatform={(tabKey) => handleTabChange(tabKey || 'league')}
                onOpenAffiliation={() => setShowAffiliationModal(true)}
                onAddTenant={handleAddTenant}
                setUserRole={setUserRole}
                onOpenStepTour={handleOpenStepTour}
                onOpenAuthModal={(mode) => {
                  setAuthModalMode(mode || 'register');
                  setShowAuthModal(true);
                }}
                isAuthenticated={isAuthenticated}
                hasPaidFullAccess={hasPaidFullAccess}
              />
            )}

        {activeTab === 'campaign-banners' && isSuperAdminAuth && (
          <CampaignBannersGenerator
            onOpenCheckout={() => handleTabChange('exclusive-offer')}
          />
        )}

        {activeTab === 'exclusive-offer' && (
          <div className="py-4">
            <ExclusiveOfferCheckoutModal
              isOpen={true}
              onClose={() => handleTabChange('welcome')}
              onAddTenant={handleAddTenant}
              onSuccess={() => {
                setHasPaidFullAccess(true);
                try {
                  localStorage.setItem('deporverso_has_paid', 'true');
                } catch (e) {}
                setActiveTab('league');
                setAdminToast('🎉 ¡Licencia CIG Pagada y Activada! Bienvenido al portal completo.');
                setTimeout(() => setAdminToast(null), 5000);
              }}
            />
          </div>
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

        {(activeTab === 'master-admin' || activeTab === 'master-admin-crm') && isSuperAdminAuth && (
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
        )}

        {activeTab === 'league' && (
          <LeagueDashboard
            tenant={activeTenant}
            sport={activeSportObj}
            matches={tenantMatches}
            teams={teams}
            players={players}
            events={events}
            publishedChronicles={publishedChronicles}
            onPlayerTransferred={handlePlayerTransferred}
            isSuperAdminAuth={isSuperAdminAuth}
            onOpenStepTour={handleOpenStepTour}
            onNavigateTab={handleTabChange}
            hasPaidFullAccess={hasPaidFullAccess}
            onOpenCheckout={() => setShowCheckoutOfferModal(true)}
            userEmail={currentUserEmail}
          />
        )}

        {activeTab === 'vocalia' && (
          <VocaliaDigital
            matches={tenantMatches}
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
          <ComputerVisionEdge match={tenantMatches[0]} isSuperAdminAuth={isSuperAdminAuth} />
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
            </div>
          )
        )}

        {activeTab === 'var' && (
          <VarModule
            tenantId={activeTenantId}
            matches={tenantMatches}
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
            tenant={activeTenant}
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

      {/* MODAL OFICIAL DE AFILIACIÓN DE LIGAS */}
      {showAffiliationModal && (
        <AffiliationModal
          isOpen={showAffiliationModal}
          onClose={() => setShowAffiliationModal(false)}
          onAffiliationSuccess={async (newTenant) => {
            await handleAddTenant(newTenant);
            setShowAffiliationModal(false);
            setUserRole('LEAGUE_ADMIN');
            setActiveTab('league');
          }}
          initialSport={activeSport}
        />
      )}

      {/* MODAL DE CHECKOUT / PAGO PARA DESBLOQUEAR PORTAL COMPLETO ($25/año) */}
      <ExclusiveOfferCheckoutModal
        isOpen={showCheckoutOfferModal}
        onClose={() => setShowCheckoutOfferModal(false)}
        onSuccess={() => {
          setHasPaidFullAccess(true);
          try {
            localStorage.setItem('deporverso_has_paid', 'true');
          } catch (e) {}
          setShowCheckoutOfferModal(false);
          setActiveTab('league');
          setAdminToast('🎉 ¡Licencia CIG Pagada y Activada! Bienvenido al portal completo.');
        }}
        onAddTenant={handleAddTenant}
      />

      {/* TOUR GUIADO MULTIVERSO PASO A PASO (8 ESTACIONES) */}
      <MultiversoStepTourModal
        isOpen={isStepTourOpen}
        onClose={() => setIsStepTourOpen(false)}
        onNavigateTab={handleTabChange}
        initialStepIndex={stepTourInitialIndex}
      />

      {/* MODAL DE REGISTRO / AUTENTICACIÓN PARA ACCEDER A LA DEMO */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <LoginGate
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
