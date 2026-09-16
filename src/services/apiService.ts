import {
  INITIAL_SPORTS,
  INITIAL_TENANTS,
  INITIAL_MATCHES,
  INITIAL_MATCH_EVENTS,
  INITIAL_VAR_REQUESTS,
  INITIAL_MIGRATION_TICKETS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TEAMS,
  INITIAL_PLAYERS
} from '../data/mockData';
import {
  Sport,
  Tenant,
  Match,
  MatchEvent,
  VarRequest,
  MigrationTicket,
  Subscription,
  Team,
  Player,
  AiChronicle,
  VocaliaReportRecord
} from '../types';

// In-memory persistent state (simulating real backend / Supabase / Firebase store)
const LOCAL_STORAGE_MATCHES_KEY = 'deporverso_firebase_matches_v2';
const LOCAL_STORAGE_PLAYERS_KEY = 'deporverso_firebase_players_v2';
const LOCAL_STORAGE_VOCALIA_KEY = 'deporverso_firebase_vocalia_reports_v2';

const loadSavedMatches = (): Match[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not load matches from localStorage', e);
  }
  return [...INITIAL_MATCHES];
};

const loadSavedPlayers = (): Player[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not load players from localStorage', e);
  }
  return [...INITIAL_PLAYERS];
};

const buildInitialVocaliaReports = (): VocaliaReportRecord[] => {
  const reports: VocaliaReportRecord[] = [];
  matchesStore.forEach(m => {
    if (m.match_data?.vocal_report || m.match_data?.referee_report) {
      const tenant = tenantsStore.find(t => t.id === m.tenant_id);
      const homeTeam = teamsStore.find(t => t.id === m.home_team_id);
      const awayTeam = teamsStore.find(t => t.id === m.away_team_id);
      const matchEvts = eventsStore.filter(e => e.match_id === m.id);

      reports.push({
        id: `vocalia-${m.id}`,
        match_id: m.id,
        tenant_id: m.tenant_id,
        tenant_name: tenant?.name || 'Liga Deporverso',
        subdomain: tenant?.slug || m.tenant_id,
        domain: tenant?.domain || `${tenant?.slug || 'liga'}.deporverso.app`,
        sport_code: m.sport_code,
        home_team_name: homeTeam?.name || m.home_team_id,
        away_team_name: awayTeam?.name || m.away_team_id,
        home_score: m.home_score,
        away_score: m.away_score,
        status: m.status,
        current_period: m.match_data?.current_period || '1T',
        vocal_report: m.match_data?.vocal_report || {
          vocal_name: 'Vocal Designado',
          vocal_cedula: '1700000000',
          observations: 'Acta registrada con normalidad en el subdominio oficial.',
          status: 'CONFORME',
          start_time: '10:00',
          end_time: '12:00',
          signed: true,
          saved_at: m.created_at
        },
        referee_report: m.match_data?.referee_report || {
          main_referee: m.match_data?.referee_name || 'Árbitro Principal',
          disciplinary_notes: 'Sin novedades disciplinarias reportadas.',
          signatures_verified: true,
          saved_at: m.created_at
        },
        home_captain_approval: m.match_data?.home_captain_approval,
        away_captain_approval: m.match_data?.away_captain_approval,
        player_stats: m.match_data?.player_stats,
        events_count: matchEvts.length,
        events: matchEvts,
        firestore_path: `firestore://vocalia_reports/vocalia-${m.id}`,
        saved_at: m.match_data?.last_synced_at || m.created_at || new Date().toISOString()
      });
    }
  });
  return reports;
};

const loadSavedVocaliaReports = (): VocaliaReportRecord[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_VOCALIA_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not load vocalia reports from localStorage', e);
  }
  return buildInitialVocaliaReports();
};

let sportsStore: Sport[] = [...INITIAL_SPORTS];
let tenantsStore: Tenant[] = [...INITIAL_TENANTS];
let matchesStore: Match[] = loadSavedMatches();
let eventsStore: MatchEvent[] = [...INITIAL_MATCH_EVENTS];
let varStore: VarRequest[] = [...INITIAL_VAR_REQUESTS];
let ticketsStore: MigrationTicket[] = [...INITIAL_MIGRATION_TICKETS];
let subsStore: Subscription[] = [...INITIAL_SUBSCRIPTIONS];
let teamsStore: Team[] = [...INITIAL_TEAMS];
let playersStore: Player[] = loadSavedPlayers();
let vocaliaReportsStore: VocaliaReportRecord[] = loadSavedVocaliaReports();

const persistMatches = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matchesStore));
  } catch (e) {
    console.warn('Failed saving to localStorage', e);
  }
};

const persistPlayers = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(playersStore));
  } catch (e) {
    console.warn('Failed saving players to localStorage', e);
  }
};

const persistVocaliaReports = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_VOCALIA_KEY, JSON.stringify(vocaliaReportsStore));
  } catch (e) {
    console.warn('Failed saving vocalia reports to localStorage', e);
  }
};

export const apiService = {
  getSports: async (): Promise<Sport[]> => {
    return sportsStore;
  },

  getTenants: async (): Promise<Tenant[]> => {
    return tenantsStore;
  },

  addTenant: async (tenant: Omit<Tenant, 'id' | 'created_at'>): Promise<Tenant> => {
    const generatedKey = tenant.admin_key || `DV-${(tenant.slug || 'LIGA').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-ADM`;
    const newTenant: Tenant = {
      ...tenant,
      admin_key: generatedKey,
      id: `t-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    tenantsStore = [newTenant, ...tenantsStore];

    // Create default annual subscription
    const priceMap = { BASIC_3: 3.00, PRO_5: 5.00, ENTERPRISE_8: 8.00 };
    const tier = tenant.plan_tier || 'PRO_5';
    subsStore.push({
      id: `sub-${Date.now()}`,
      tenant_id: newTenant.id,
      plan_tier: tier,
      price_monthly: priceMap[tier],
      status: 'ACTIVE',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 365*84600*1000).toISOString()
    });

    return newTenant;
  },

  getMatches: async (tenantId?: string): Promise<Match[]> => {
    let result = matchesStore;
    if (tenantId) {
      result = result.filter(m => m.tenant_id === tenantId);
    }
    return result.map(m => ({
      ...m,
      home_team: teamsStore.find(t => t.id === m.home_team_id),
      away_team: teamsStore.find(t => t.id === m.away_team_id)
    }));
  },

  getMatchEvents: async (matchId: string): Promise<MatchEvent[]> => {
    return eventsStore.filter(e => e.match_id === matchId);
  },

  addMatchEvent: async (event: Omit<MatchEvent, 'id' | 'created_at'>): Promise<MatchEvent> => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newEvt: MatchEvent = {
      ...event,
      id: `evt-${uniqueSuffix}`,
      created_at: new Date().toISOString()
    };
    eventsStore = [...eventsStore, newEvt];
    return newEvt;
  },

  updateMatchScore: async (matchId: string, homeScore: number, awayScore: number, matchData?: any): Promise<Match> => {
    const idx = matchesStore.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      matchesStore[idx] = {
        ...matchesStore[idx],
        home_score: homeScore,
        away_score: awayScore,
        match_data: { ...matchesStore[idx].match_data, ...matchData }
      };
      persistMatches();
      return matchesStore[idx];
    }
    throw new Error('Match not found');
  },

  saveVocaliaReport: async (params: {
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
  }): Promise<Match> => {
    const idx = matchesStore.findIndex(m => m.id === params.matchId);
    if (idx !== -1) {
      const tenant = tenantsStore.find(t => t.id === params.tenantId);
      const homeTeam = teamsStore.find(t => t.id === matchesStore[idx].home_team_id);
      const awayTeam = teamsStore.find(t => t.id === matchesStore[idx].away_team_id);
      const matchEvts = eventsStore.filter(e => e.match_id === params.matchId);

      const updatedMatch: Match = {
        ...matchesStore[idx],
        tenant_id: params.tenantId,
        home_score: params.homeScore,
        away_score: params.awayScore,
        status: params.status,
        match_data: {
          ...matchesStore[idx].match_data,
          player_stats: params.playerStats,
          vocal_report: params.vocalReport,
          referee_report: params.refereeReport,
          home_captain_approval: params.homeCaptainApproval,
          away_captain_approval: params.awayCaptainApproval,
          is_public_published: true,
          firebase_doc_id: `firestore://tenants/${params.tenantId}/matches/${params.matchId}`,
          last_synced_at: new Date().toISOString()
        }
      };
      matchesStore[idx] = updatedMatch;
      persistMatches();

      // Guardar también en el almacén de Informes de Vocalía
      const reportRecord: VocaliaReportRecord = {
        id: `vocalia-${params.matchId}`,
        match_id: params.matchId,
        tenant_id: params.tenantId,
        tenant_name: tenant?.name || 'Liga Deporverso',
        subdomain: tenant?.slug || params.tenantId,
        domain: tenant?.domain || `${tenant?.slug || 'liga'}.deporverso.app`,
        sport_code: matchesStore[idx].sport_code,
        home_team_name: homeTeam?.name || matchesStore[idx].home_team_id,
        away_team_name: awayTeam?.name || matchesStore[idx].away_team_id,
        home_score: params.homeScore,
        away_score: params.awayScore,
        status: params.status,
        current_period: matchesStore[idx].match_data?.current_period || '1T',
        vocal_report: params.vocalReport,
        referee_report: params.refereeReport,
        home_captain_approval: params.homeCaptainApproval,
        away_captain_approval: params.awayCaptainApproval,
        player_stats: params.playerStats,
        events_count: matchEvts.length,
        events: matchEvts,
        firestore_path: `firestore://vocalia_reports/vocalia-${params.matchId}`,
        saved_at: new Date().toISOString()
      };

      const repIdx = vocaliaReportsStore.findIndex(r => r.match_id === params.matchId);
      if (repIdx !== -1) {
        vocaliaReportsStore[repIdx] = reportRecord;
      } else {
        vocaliaReportsStore.unshift(reportRecord);
      }
      persistVocaliaReports();

      return updatedMatch;
    }
    throw new Error('Match not found');
  },

  getVocaliaReports: async (tenantId?: string): Promise<VocaliaReportRecord[]> => {
    if (tenantId) {
      return vocaliaReportsStore.filter(r => r.tenant_id === tenantId);
    }
    return vocaliaReportsStore;
  },

  getVocaliaReportByMatchId: async (matchId: string): Promise<VocaliaReportRecord | undefined> => {
    return vocaliaReportsStore.find(r => r.match_id === matchId);
  },

  getVarRequests: async (tenantId?: string): Promise<VarRequest[]> => {
    if (tenantId) return varStore.filter(v => v.tenant_id === tenantId);
    return varStore;
  },

  createVarRequest: async (req: Omit<VarRequest, 'id' | 'created_at'>): Promise<VarRequest> => {
    const newReq: VarRequest = {
      ...req,
      id: `var-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    varStore = [newReq, ...varStore];
    return newReq;
  },

  updateVarStatus: async (varId: string, status: VarRequest['status'], resultNotes?: string): Promise<VarRequest> => {
    const idx = varStore.findIndex(v => v.id === varId);
    if (idx !== -1) {
      varStore[idx] = {
        ...varStore[idx],
        status,
        result_notes: resultNotes || varStore[idx].result_notes
      };
      return varStore[idx];
    }
    throw new Error('VAR Request not found');
  },

  getMigrationTickets: async (): Promise<MigrationTicket[]> => {
    return ticketsStore;
  },

  createMigrationTicket: async (ticket: Omit<MigrationTicket, 'id' | 'created_at'>): Promise<MigrationTicket> => {
    const newTicket: MigrationTicket = {
      ...ticket,
      id: `tk-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    ticketsStore = [newTicket, ...ticketsStore];
    return newTicket;
  },

  getSubscriptions: async (): Promise<Subscription[]> => {
    return subsStore;
  },

  getTeams: async (tenantId?: string): Promise<Team[]> => {
    if (tenantId) return teamsStore.filter(t => t.tenant_id === tenantId);
    return teamsStore;
  },

  getPlayers: async (tenantId?: string): Promise<Player[]> => {
    if (tenantId) return playersStore.filter(p => p.tenant_id === tenantId);
    return playersStore;
  },

  // Gemini AI Chronicle Generator
  generateAiChronicle: async (params: {
    matchId: string;
    sportCode: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    events: MatchEvent[];
  }): Promise<AiChronicle> => {
    try {
      const response = await fetch('/api/generate-chronicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error('Server returned error for AI chronicle');
      }
      return await response.json();
    } catch (err) {
      console.warn('Fallback to local chronicle generator:', err);
      // Fallback local chronicle
      return {
        match_id: params.matchId,
        headline: `¡Épica batalla en ${params.sportCode}! ${params.homeTeam} (${params.homeScore}) vs ${params.awayTeam} (${params.awayScore})`,
        body: `Un apasionante encuentro de ${params.sportCode} se vivió en el campo de juego. El marcador final reflejó la intensidad de ambos planteles: ${params.homeTeam} anotó ${params.homeScore} frente a ${params.awayScore} de ${params.awayTeam}. La afición vibró durante cada minuto registrado en la vocalía digital de Deporverso.`,
        key_moments: [
          `Inicio del compromiso con despliegue táctico de alto nivel.`,
          `Momentos decisivos con ${params.events.length} incidencias clave registradas en vivo.`,
          `Pitazo final y cierre de acta digital auditada en tiempo real.`
        ],
        tactical_notes: `Despliegue defensivo sólido y contraataques rápidos marcaron el ritmo del partido.`,
        generated_at: new Date().toISOString()
      };
    }
  },

  // Smart Ingestion Parser with Gemini
  parseScheduleWithAi: async (documentText: string, sportCode: string): Promise<any> => {
    try {
      const response = await fetch('/api/parse-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, sportCode })
      });
      if (!response.ok) {
        throw new Error('AI parser server error');
      }
      return await response.json();
    } catch (err) {
      console.warn('Fallback AI Parser:', err);
      return {
        success: true,
        leagueName: "Liga Detectada por IA",
        parsedMatches: [
          { homeTeam: "Deportivo Central", awayTeam: "Real Comunitario", date: "2026-08-01 10:00", field: "Cancha 1" },
          { homeTeam: "Atlético Juventud", awayTeam: "LDU Norte", date: "2026-08-01 12:00", field: "Cancha 2" }
        ],
        extractedTeams: ["Deportivo Central", "Real Comunitario", "Atlético Juventud", "LDU Norte"]
      };
    }
  }
};
