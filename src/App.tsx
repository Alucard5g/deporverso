import React, { useState, useEffect, useRef } from 'react';
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
import { Database, Copy, Download, CheckCircle, Shield, Lock, Sparkles, FileText, LogOut, Users, Flame, KeyRound, X } from 'lucide-react';
import { syncMatchToFirebase, syncEventToFirebase, syncChronicleToFirebase, syncTenantToFirebase, subscribeToMatches } from './services/firebaseService';
import { AffiliationModal } from './components/Affiliation/AffiliationModal';
import { LoginGate } from './components/Auth/LoginGate';
import { AdminAuthSecurityModal } from './components/Auth/AdminAuthSecurityModal';
import { CampaignBannersGenerator } from './components/Marketing/CampaignBannersGenerator';
import { ExclusiveOfferCheckoutModal } from './components/Marketing/ExclusiveOfferCheckoutModal';
import { ClubDeporversoShowcase } from './components/ClubShowcase/ClubDeporversoShowcase';
import { MultiversoStepTourModal } from './components/Demo/MultiversoStepTourModal';
import { TerminalCameraBroadcasterModal } from './components/LeaguePortal/streaming/TerminalCameraBroadcasterModal';
import { IpShieldBadge } from './components/IpShieldBadge';
import { QuickCommandPalette } from './components/Common/QuickCommandPalette';
import { MobileBottomNav } from './components/Common/MobileBottomNav';
import { copyTextSafely } from './utils/safeClipboard';
import { setCreatorStudioKey, clearCreatorStudioKey } from './services/streamStudioClient';
import { authService, clearCreatorAuthToken } from './services/authService';
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
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string, duration = 4500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setAdminToast(msg);
    toastTimerRef.current = setTimeout(() => {
      setAdminToast(null);
      toastTimerRef.current = null;
    }, duration);
  };

  const [isPlatformUnlocked, setIsPlatformUnlocked] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isStepTourOpen, setIsStepTourOpen] = useState<boolean>(false);
  const [stepTourInitialIndex, setStepTourInitialIndex] = useState<number>(0);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  // Sincronización Remota de Cámara por Código QR (?mode=terminal-camera)
  const [isRemoteTerminalActive, setIsRemoteTerminalActive] = useState<boolean>(false);
  const [remoteTerminalMatchId, setRemoteTerminalMatchId] = useState<string>('');
  const [remoteTerminalCamId, setRemoteTerminalCamId] = useState<string>('');
  const [remoteTerminalCamLabel, setRemoteTerminalCamLabel] = useState<string>('');
  const [remoteTerminalCamAngle, setRemoteTerminalCamAngle] = useState<string>('');

  // Modal de Seguridad de Administrador para Streaming, VAR, Videos y Crónicas
  const [showAdminSecurityModal, setShowAdminSecurityModal] = useState<boolean>(false);
  const [adminSecurityTargetTab, setAdminSecurityTargetTab] = useState<string | null>(null);
  const [adminSecurityTitle, setAdminSecurityTitle] = useState<string>('Acceso Oficial de Administrador');
  const [adminSecurityDesc, setAdminSecurityDesc] = useState<string>('Streaming, VAR, clips de video y crónicas están restringidos únicamente a Administradores.');

  // Restaurar sesión persistida al recargar (TTL: 7 días)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'terminal-camera' || mode === 'camera') return;

      const raw = localStorage.getItem('deporverso_auth_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const isFresh = parsed?.loginTimestamp && (Date.now() - Number(parsed.loginTimestamp) < sevenDaysMs);
        if (parsed?.authenticated && isFresh) {
          setIsAuthenticated(true);
          setCurrentUserEmail(parsed.email || '');
          const isAdmin = Boolean(parsed.isSuperAdmin);
          setIsSuperAdminAuth(isAdmin);
          if (isAdmin) {
            setCreatorStudioKey('1326');
            void authService.syncLocalUsersToServer(false);
          } else {
            clearCreatorAuthToken();
          }
          setUserRole(parsed.role || (isAdmin ? 'SUPER_ADMIN' : 'LEAGUE_ADMIN'));
          setIsPlatformUnlocked(true);
          setActiveTab(isAdmin ? 'master-admin' : 'league');
        } else if (raw) {
          localStorage.removeItem('deporverso_auth_session');
          clearCreatorAuthToken();
        }
      }
    } catch (e) {
      console.warn('No se pudo restaurar la sesión:', e);
    }
  }, []);

  const handleAdminSecurityAuthorized = () => {
    setIsAuthenticated(true);
    setIsSuperAdminAuth(true);
    setCreatorStudioKey('1326');
    void authService.syncLocalUsersToServer(false);
    setUserRole('SUPER_ADMIN');
    setIsPlatformUnlocked(true);
    setCurrentUserEmail('roly3d.rg@gmail.com');
    setShowAdminSecurityModal(false);

    try {
      localStorage.setItem('deporverso_auth_session', JSON.stringify({
        authenticated: true,
        role: 'SUPER_ADMIN',
        email: 'roly3d.rg@gmail.com',
        isSuperAdmin: true,
        loginTimestamp: Date.now()
      }));
    } catch (e) {}

    const target = adminSecurityTargetTab || 'master-admin';
    setActiveTab(target);
    showToast('👑 Acceso Maestro Autorizado: Funciones de Administrador Desbloqueadas', 4500);
  };

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

    if (authData.isSuperAdmin) {
      setCreatorStudioKey('1326');
      void authService.syncLocalUsersToServer(false);
    }

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
      showToast('👑 Acceso Maestro: Modo Super Administrador CIG (Acceso Total Desbloqueado)', 4500);
    } else {
      setActiveTenantId('t-pichincha');
      setActiveSport('FUTBOL');
      setActiveTab('league');
      showToast(`✓ Bienvenido ${authData.email}. Acceso concedido a la demo de Liga Pichincha y Club Deporverso.`, 4500);
    }
  };

  const handleGlobalLogout = () => {
    try {
      localStorage.removeItem('deporverso_auth_session');
    } catch (e) {}
    clearCreatorAuthToken();
    setIsAuthenticated(false);
    setIsSuperAdminAuth(false);
    setIsPlatformUnlocked(false);
    setCurrentUserEmail('');
    setUserRole('LEAGUE_ADMIN');
    setActiveTab('welcome');
    showToast('🔒 Plataforma bloqueada: Sesión cerrada', 3000);
  };

  // Escucha global de teclado: Cmd/Ctrl+K para Quick Command Palette y clave maestra fuera de inputs editables
  useEffect(() => {
    let keyBuffer = '';
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleGlobalKeyStroke = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
        return;
      }

      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        (targetEl.tagName === 'INPUT' ||
          targetEl.tagName === 'TEXTAREA' ||
          targetEl.tagName === 'SELECT' ||
          targetEl.isContentEditable)
      ) {
        return;
      }

      if (e.key && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        keyBuffer += e.key;

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          keyBuffer = '';
        }, 3500);

        if (keyBuffer.endsWith('1326')) {
          keyBuffer = '';
          setIsAuthenticated(true);
          setIsSuperAdminAuth(true);
          setCreatorStudioKey('1326');
          void authService.syncLocalUsersToServer(false);
          setUserRole('SUPER_ADMIN');
          setIsPlatformUnlocked(true);
          setCurrentUserEmail('roly3d.rg@gmail.com');
          setActiveTab('master-admin');
          showToast('👑 Acceso Autorizado: Modo Administrador CIG Desbloqueado', 4500);

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
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Detección de enlace de Terminal Remoto de Cámara (?mode=terminal-camera)
  // Seguridad: el celular escaneado transmite únicamente como cámara; NO eleva a SuperAdmin.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'terminal-camera' || mode === 'camera') {
        clearCreatorStudioKey();
        setIsAuthenticated(true);
        setIsPlatformUnlocked(true);
        setIsSuperAdminAuth(false);
        setUserRole('TEAM_DELEGATE');
        const camIdParam = params.get('camId') || 'cam-1';
        const camLabelParam = params.get('camLabel') || `CAM ${camIdParam.replace(/[^0-9]/g, '') || '1'} · Celular QR`;
        const camAngleParam = params.get('angle') || 'Cancha Móvil';
        setCurrentUserEmail(`camara.${camIdParam}@deporverso.com`);
        const tId = params.get('tenantId');
        if (tId) setActiveTenantId(tId);
        const mId = params.get('matchId');
        if (mId) setRemoteTerminalMatchId(mId);
        setRemoteTerminalCamId(camIdParam);
        setRemoteTerminalCamLabel(camLabelParam);
        setRemoteTerminalCamAngle(camAngleParam);
        setIsRemoteTerminalActive(true);
        setActiveTab('league');
        showToast(`📹 ${camLabelParam} conectada al estudio multicámara en vivo`, 5000);
      }
    } catch (e) {}
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

      const evts = await apiService.getEvents();
      setEvents(evts);

      const vrs = await apiService.getVarRequests();
      setVarRequests(vrs);

      const tks = await apiService.getMigrationTickets();
      setMigrationTickets(tks);

      const sbs = await apiService.getSubscriptions();
      setSubscriptions(sbs);

      const chrs = await apiService.getChronicles();
      setPublishedChronicles(chrs);
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
    apiService.addChronicle(chronicle);
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
    apiService.transferPlayer(playerId, newTeamId, newJerseyNumber);
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

    // Verificar si el usuario ya posee sesión activa de SuperAdmin
    const isCurrentlyAdmin = isSuperAdminAuth || (() => {
      try {
        const s = localStorage.getItem('deporverso_auth_session');
        if (s) {
          const parsed = JSON.parse(s);
          return Boolean(parsed?.authenticated && parsed?.isSuperAdmin);
        }
      } catch (e) {}
      return false;
    })();

    if (isCurrentlyAdmin && !isSuperAdminAuth) {
      setIsSuperAdminAuth(true);
      setUserRole('SUPER_ADMIN');
    }

    // Regla de Seguridad: Streaming, VAR, Vocalía, Contenido de DEPORVERSO, Videos y Crónicas
    // son de manejo exclusivo para Administrador
    if (resolvedTab === 'var' && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab('var');
      setAdminSecurityTitle('Sala VAR Oficial & Dictámenes Arbitrales');
      setAdminSecurityDesc('El sistema VAR oficial, revisión de jugadas polémicas y actas periciales son de uso exclusivo del Administrador Oficial de la Liga. Ingresa con tus credenciales autorizadas.');
      setShowAdminSecurityModal(true);
      return;
    }

    if (resolvedTab === 'vocalia' && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab('vocalia');
      setAdminSecurityTitle('Vocalía Digital & Control de Mesa');
      setAdminSecurityDesc('El control de mesa técnica, actas digitales de partido y cronómetro oficial son de uso exclusivo del Administrador y Vocales acreditados.');
      setShowAdminSecurityModal(true);
      return;
    }

    if (resolvedTab === 'vision-ai' && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab('vision-ai');
      setAdminSecurityTitle('Cámaras en Cancha, Visión y Contenido 9:16');
      setAdminSecurityDesc('El tracking automatizado de jugadores, visión computacional y producción de clips verticales 9:16 de DEPORVERSO requieren autorización de Administrador.');
      setShowAdminSecurityModal(true);
      return;
    }

    if (resolvedTab === 'chronicle' && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab('chronicle');
      setAdminSecurityTitle('Generador de Crónicas Periodísticas IA');
      setAdminSecurityDesc('La generación y redacción editorial de crónicas deportivas con IA de DEPORVERSO es de uso exclusivo del Administrador Maestro.');
      setShowAdminSecurityModal(true);
      return;
    }

    if (resolvedTab === 'ingestion' && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab('ingestion');
      setAdminSecurityTitle('Ingesta Inteligente de Planillas & Datos');
      setAdminSecurityDesc('La digitalización y generación de datos mediante planillas o plantillas es exclusiva del Administrador.');
      setShowAdminSecurityModal(true);
      return;
    }

    if ((resolvedTab === 'master-admin' || resolvedTab === 'master-admin-crm' || resolvedTab === 'sql-viewer' || resolvedTab === 'campaign-banners') && !isCurrentlyAdmin) {
      setAdminSecurityTargetTab(resolvedTab);
      setAdminSecurityTitle('Panel de Control Maestro CIG');
      setAdminSecurityDesc('Ingresa con tus credenciales de administrador para acceder a las herramientas maestras de la plataforma.');
      setShowAdminSecurityModal(true);
      return;
    }

    // Regla 1: Un usuario no registrado (invitado) solo accede a Inicio ('welcome').
    // Si intenta acceder a la demo de Liga Pichincha o Club Deporverso, debe registrarse:
    if (!isAuthenticated && !isCurrentlyAdmin && resolvedTab !== 'exclusive-offer') {
      setAuthModalMode('register');
      setShowAuthModal(true);
      showToast('👋 Regístrate gratis para acceder a la demo de la Liga Pichincha y el Club Deporverso.', 4500);
      return;
    }

    // Regla 2: El usuario registrado solo accede a la demo ('league' y 'club-deporverso').
    // Los usuarios que paguen la suscripción acceden al portal de Deporverso completo:
    if (!hasPaidFullAccess && !isCurrentlyAdmin && !DEMO_ALLOWED_TABS.includes(resolvedTab)) {
      setShowCheckoutOfferModal(true);
      showToast('🔒 Acceso limitado a demo. Suscríbete ($35 mayores / $25 formativas) para desbloquear todo DeporVerso.', 5000);
      return;
    }

    setIsPlatformUnlocked(true);
    setActiveTab(resolvedTab);
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch {}
  };

  const handleLogoutSuperAdmin = () => {
    clearCreatorStudioKey();
    setIsAuthenticated(false);
    setIsSuperAdminAuth(false);
    setUserRole('LEAGUE_ADMIN');
    setIsPlatformUnlocked(false);
    setCurrentUserEmail('');
    setActiveTab('welcome');
    try {
      localStorage.removeItem('deporverso_auth_session');
    } catch (e) {}
    showToast('🔒 Panel de Administrador cerrado: Vuelto a Inicio', 3000);
  };

  const handleElevateToSuperAdmin = () => {
    setCreatorStudioKey('1326');
    setIsSuperAdminAuth(true);
    setUserRole('SUPER_ADMIN');
    setCurrentUserEmail('roly3d.rg@gmail.com');
    showToast('👑 Sesión elevada: Acceso concedido como Administrador Maestro', 3500);
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-[#e0e0e0] font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col lg:flex-row overflow-x-hidden">
      {/* TOAST FLOTANTE DE NOTIFICACIÓN */}
      {adminToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 sm:left-auto sm:right-5 z-[160] max-w-md bg-amber-400 text-slate-950 font-bold text-xs pl-4 pr-2 py-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-2.5 border border-amber-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="leading-snug">{adminToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminToast(null)}
            className="p-1 rounded-lg hover:bg-black/10 text-slate-950 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODAL DE AFILIACIÓN AL DEPORVERSO */}
      <AffiliationModal
        isOpen={showAffiliationModal}
        onClose={() => setShowAffiliationModal(false)}
        onAddTenant={handleAddTenant}
        initialSport={activeSport}
      />

      {/* Left Column Vertical Sidebar Navigation - Se oculta en inicio y se despliega en el espacio de trabajo */}
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 z-40 ${
          isPlatformUnlocked
            ? activeTab === 'welcome'
              ? 'w-full lg:w-0 lg:overflow-hidden'
              : `translate-x-0 w-full ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} opacity-100`
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
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          hideMobileHeader={activeTab === 'welcome'}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* Right Column Layout: TopHeader + Main Content Scrollable Area */}
      <div className="flex-1 flex flex-col min-h-[100dvh] lg:h-screen lg:overflow-y-auto min-w-0 bg-[#030610] relative">
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
          {/* BARRA SUPERIOR DE MODO ADMINISTRADOR GLOBAL (SOLO DESKTOP LG+ EN WORKSPACE) */}
          {isSuperAdminAuth && isPlatformUnlocked && activeTab !== 'welcome' && (
            <div className="hidden lg:flex bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/30 px-4 py-2 flex-wrap items-center justify-between gap-2 text-xs shadow-xl shrink-0">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-bold tracking-wide uppercase flex items-center gap-1.5 whitespace-nowrap">
                  Modo Administrador Global Activo
                </span>
                <span className="hidden md:inline text-slate-400 text-[11px]">
                  · Panel Maestro y CRM Confidencial desplegados
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('master-admin')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'master-admin'
                      ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                      : 'text-amber-300 hover:text-white bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  Panel Maestro
                </button>
                <button
                  onClick={() => setActiveTab('master-admin-crm')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    activeTab === 'master-admin-crm'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'text-indigo-300 hover:text-white bg-indigo-500/10 border border-indigo-500/30'
                  }`}
                >
                  <Users className="w-3 h-3 text-indigo-400" />
                  CRM Ligas
                </button>
                <button
                  onClick={handleLogoutSuperAdmin}
                  className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ml-1 whitespace-nowrap shrink-0"
                  title="Cerrar sesión de administrador y ocultar funciones"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Salir Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* TopHeader - Se oculta en inicio y se despliega en el espacio de trabajo */}
          {isPlatformUnlocked && activeTab !== 'welcome' && (
            <div className="z-30 shrink-0">
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
                onOpenCommandPalette={() => setShowCommandPalette(true)}
              />
            </div>
          )}

          {/* Main App Content View Container */}
          <main className={`flex-1 w-full max-w-none min-w-0 transition-all duration-300 ${
            isPlatformUnlocked && activeTab !== 'welcome'
              ? 'px-3 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-24 lg:py-6'
              : isPlatformUnlocked
              ? 'p-0 pb-16 lg:pb-0 w-full'
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
            onNavigateTab={handleTabChange}
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
          isSuperAdminAuth ? (
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
          ) : (
            <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Vocalía Digital en Vivo</h2>
              <p className="text-xs text-white/60">
                El control de mesa técnica, actas digitales y cronómetro oficial son de uso exclusivo del Administrador y Vocales autorizados.
              </p>
              <button
                onClick={() => {
                  setAdminSecurityTargetTab('vocalia');
                  setAdminSecurityTitle('Vocalía Digital & Control de Mesa');
                  setAdminSecurityDesc('Ingresa con tu clave de acceso o credenciales de administrador.');
                  setShowAdminSecurityModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Desbloquear como Administrador
              </button>
            </div>
          )
        )}

        {activeTab === 'vision-ai' && (
          isSuperAdminAuth ? (
            <ComputerVisionEdge match={tenantMatches[0]} isSuperAdminAuth={isSuperAdminAuth} />
          ) : (
            <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Cámaras & Visión de Cancha</h2>
              <p className="text-xs text-white/60">
                El sistema de cámaras, visión computacional y clips 9:16 de DEPORVERSO son herramientas exclusivas para el Administrador de la Liga.
              </p>
              <button
                onClick={() => {
                  setAdminSecurityTargetTab('vision-ai');
                  setAdminSecurityTitle('Cámaras en Cancha, Visión y Contenido 9:16');
                  setAdminSecurityDesc('Ingresa con tu clave de acceso o credenciales de administrador.');
                  setShowAdminSecurityModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Desbloquear como Administrador
              </button>
            </div>
          )
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
              onNavigateTab={handleTabChange}
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
                onClick={() => {
                  setAdminSecurityTargetTab('ingestion');
                  setAdminSecurityTitle('Ingesta Inteligente de Planillas & Datos');
                  setAdminSecurityDesc('Ingresa con tu clave de acceso o credenciales de administrador.');
                  setShowAdminSecurityModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Desbloquear como Administrador
              </button>
            </div>
          )
        )}

        {activeTab === 'var' && (
          isSuperAdminAuth ? (
            <VarModule
              tenantId={activeTenantId}
              matches={tenantMatches}
              varRequests={varRequests}
              onCreateVarRequest={handleCreateVarRequest}
              onUpdateVarStatus={handleUpdateVarStatus}
              isSuperAdminAuth={isSuperAdminAuth}
            />
          ) : (
            <div className="bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Sistema VAR Oficial</h2>
              <p className="text-xs text-white/60">
                La sala de video arbitraje, repetición multicámara y dictámenes periciales son de uso exclusivo del Administrador Oficial de la Liga.
              </p>
              <button
                onClick={() => {
                  setAdminSecurityTargetTab('var');
                  setAdminSecurityTitle('Sala VAR Oficial & Dictámenes Arbitrales');
                  setAdminSecurityDesc('Ingresa con tu clave de acceso o credenciales de administrador.');
                  setShowAdminSecurityModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Desbloquear como Administrador
              </button>
            </div>
          )
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
                  El generador de Crónicas IA y contenido periodístico de DEPORVERSO es una herramienta de uso exclusivo del Administrador Maestro. Todos los artículos y resúmenes generados están publicados y disponibles públicamente en el Blog Deportivo.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setAdminSecurityTargetTab('chronicle');
                    setAdminSecurityTitle('Generador de Crónicas Periodísticas IA');
                    setAdminSecurityDesc('Ingresa con tus credenciales de administrador para redactar y publicar crónicas.');
                    setShowAdminSecurityModal(true);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Ingresar como Administrador</span>
                </button>

                <button
                  onClick={() => setActiveTab('league')}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
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
                    await copyTextSafely(FULL_SUPABASE_SQL_SCRIPT);
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
        {/* FOOTER GLOBAL CON BLINDAJE DE PROPIEDAD INTELECTUAL CIG (SOLO EN WORKSPACE PARA EVITAR DOBLE FOOTER EN LANDING) */}
        {isPlatformUnlocked && (
          <footer className="mt-12 pt-6 pb-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span>© 2026 DeporVerso · Corporación e Innovación Guerra (CIG)</span>
            </div>
            <IpShieldBadge />
          </footer>
        )}
      </main>

      {/* BUSCADOR RÁPIDO COMMAND PALETTE (CMD/CTRL + K) */}
      <QuickCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateTab={handleTabChange}
        onSelectTenant={(tenantId) => setActiveTenantId(tenantId)}
        tenants={tenants}
        teams={teams}
        matches={matches}
        isSuperAdminAuth={isSuperAdminAuth}
        hasPaidFullAccess={hasPaidFullAccess}
      />

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
        <LoginGate
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
        />
      )}

      {/* MODAL DE SEGURIDAD EXCLUSIVO DE ADMINISTRADOR (CLAVE MAESTRA 1326 O CORREO/CLAVE) */}
      <AdminAuthSecurityModal
        isOpen={showAdminSecurityModal}
        onClose={() => setShowAdminSecurityModal(false)}
        onAuthorized={handleAdminSecurityAuthorized}
        featureTitle={adminSecurityTitle}
        featureDescription={adminSecurityDesc}
      />

      {/* MODAL DE TERMINAL DE CÁMARA REMOTO VÍA QR SCAN */}
      {isRemoteTerminalActive && (
        <TerminalCameraBroadcasterModal
          isOpen={isRemoteTerminalActive}
          onClose={() => {
            setIsRemoteTerminalActive(false);
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('mode');
              url.searchParams.delete('matchId');
              url.searchParams.delete('tenantId');
              url.searchParams.delete('camId');
              url.searchParams.delete('camLabel');
              url.searchParams.delete('angle');
              url.searchParams.delete('auth');
              window.history.replaceState({}, '', url.toString());
            } catch (e) {}
          }}
          match={
            matches.find(m => m.id === remoteTerminalMatchId) ||
            matches[0] ||
            ({
              id: remoteTerminalMatchId || 'match-live-qr',
              tenant_id: activeTenantId,
              sport_id: 'FUTBOL',
              sport_code: 'FUTBOL',
              home_team_id: teams[0]?.id || 'team-1',
              away_team_id: teams[1]?.id || 'team-2',
              home_score: 2,
              away_score: 1,
              status: 'IN_PROGRESS',
              field_location: 'Cancha Central',
              match_date: new Date().toISOString(),
              created_at: new Date().toISOString(),
              match_data: {}
            } as unknown as Match)
          }
          homeTeam={teams[0] || ({ id: 'h1', name: 'Atlético Juvenil', primary_color: '#00e5ff' } as unknown as Team)}
          awayTeam={teams[1] || ({ id: 'a1', name: 'Sporting San Pedro', primary_color: '#ff0055' } as unknown as Team)}
          tenant={tenants.find(t => t.id === activeTenantId) || tenants[0] || ({ id: activeTenantId, name: 'Liga Pichincha' } as unknown as Tenant)}
          camId={remoteTerminalCamId || undefined}
          camLabel={remoteTerminalCamLabel || undefined}
          camAngle={remoteTerminalCamAngle || undefined}
          isStandalone={true}
        />
      )}
        </div>
      </div>

      {/* Thumb-Zone Bottom Navigation Bar for Mobile & Small Tablets */}
      {isPlatformUnlocked && (
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onOpenMenu={() => setMobileMenuOpen(true)}
          isSuperAdminAuth={isSuperAdminAuth}
          isAuthenticated={isAuthenticated}
          hasPaidFullAccess={hasPaidFullAccess}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'register');
            setShowAuthModal(true);
          }}
          onOpenCheckout={() => setShowCheckoutOfferModal(true)}
        />
      )}
    </div>
  );
}
