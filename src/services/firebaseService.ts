import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match, MatchEvent, Tenant, Player, PlayerTransfer } from '../types';

/**
 * SERVICIO DE PERSISTENCIA Y TIEMPO REAL CON FIREBASE FIRESTORE
 * Base de datos: thin-aloe-bbndl (Multi-tenant Deporverso)
 */

// Sincronizar un partido completo (Marcador en vivo, actas, vocalía y firmas)
export async function syncMatchToFirebase(match: Match): Promise<boolean> {
  try {
    const matchRef = doc(db, 'matches', match.id);
    const payload = {
      id: match.id,
      tenantId: match.tenant_id,
      sportId: match.sport_code,
      homeTeam: match.home_team?.name || match.home_team_id,
      awayTeam: match.away_team?.name || match.away_team_id,
      homeScore: match.home_score ?? 0,
      awayScore: match.away_score ?? 0,
      status: match.status === 'IN_PROGRESS' ? 'LIVE' : (match.status || 'SCHEDULED'),
      date: match.match_date || new Date().toISOString(),
      time: match.match_data?.current_period || '1T',
      field: match.field_location || 'Cancha Principal',
      referee: match.match_data?.referee_name || 'Árbitro Oficial',
      rawMatchData: match,
      updatedAt: new Date().toISOString()
    };

    await setDoc(matchRef, payload, { merge: true });
    console.log(`[Firebase] Partido ${match.id} sincronizado exitosamente.`);
    return true;
  } catch (error) {
    console.warn('[Firebase] Fallo al sincronizar partido en Firestore:', error);
    return false;
  }
}

// Sincronizar un evento de vocalía digital (Gol, Tarjeta, Falta, Cambio)
export async function syncEventToFirebase(event: MatchEvent): Promise<boolean> {
  try {
    const eventRef = doc(db, 'events', event.id);
    const payload = {
      id: event.id,
      matchId: event.match_id,
      tenantId: event.tenant_id,
      type: event.event_type,
      minute: Math.floor(event.timestamp_seconds / 60),
      team: event.team_name || event.team_id || '',
      player: event.player_name || event.player_id || '',
      details: JSON.stringify(event.details || {}),
      rawEvent: event,
      createdAt: event.created_at || new Date().toISOString()
    };

    await setDoc(eventRef, payload, { merge: true });
    console.log(`[Firebase] Evento ${event.id} sincronizado.`);
    return true;
  } catch (error) {
    console.warn('[Firebase] Fallo al sincronizar evento:', error);
    return false;
  }
}

// Sincronizar crónica periodística generada por IA
export async function syncChronicleToFirebase(chronicle: {
  id: string;
  tenantId?: string;
  matchId?: string;
  title: string;
  headline?: string;
  content: string;
  sport?: string;
  author?: string;
}): Promise<boolean> {
  try {
    const chronicleRef = doc(db, 'chronicles', chronicle.id);
    await setDoc(chronicleRef, {
      id: chronicle.id,
      tenantId: chronicle.tenantId || 'all',
      matchId: chronicle.matchId || '',
      title: chronicle.title,
      headline: chronicle.headline || '',
      content: chronicle.content,
      sport: chronicle.sport || 'FUTBOL',
      author: chronicle.author || 'Periodista Deporverso IA',
      createdAt: new Date().toISOString(),
      published: true
    }, { merge: true });
    console.log(`[Firebase] Crónica ${chronicle.id} guardada en Firestore.`);
    return true;
  } catch (error) {
    console.warn('[Firebase] Fallo al guardar crónica en Firestore:', error);
    return false;
  }
}

// Sincronizar información de Tenant/Liga
export async function syncTenantToFirebase(tenant: Tenant): Promise<boolean> {
  try {
    const tenantRef = doc(db, 'tenants', tenant.id);
    await setDoc(tenantRef, {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.slug,
      plan: tenant.plan_tier || 'pro',
      primarySport: tenant.sport_code,
      colors: { primary: tenant.country, secondary: tenant.currency },
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] Error al sincronizar tenant:', error);
    return false;
  }
}

// Suscripción en tiempo real a partidos de una liga o general
export function subscribeToMatches(
  tenantId: string | null,
  callback: (matches: any[]) => void
): () => void {
  try {
    const matchesCol = collection(db, 'matches');
    const q = tenantId
      ? query(matchesCol, where('tenantId', '==', tenantId))
      : query(matchesCol);

    return onSnapshot(q, (snapshot) => {
      const liveMatches = snapshot.docs.map(d => d.data());
      callback(liveMatches);
    }, (error) => {
      console.warn('[Firebase] Listener de partidos en tiempo real offline o no disponible:', error.message);
    });
  } catch (e) {
    console.warn('[Firebase] Fallo al inicializar listener:', e);
    return () => {};
  }
}

// Sincronizar un informe oficial de vocalía digital en vivo a Firestore
export async function syncVocaliaReportToFirebase(report: {
  id?: string;
  matchId: string;
  tenantId: string;
  tenantName?: string;
  subdomain?: string;
  domain?: string;
  sportCode?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  currentPeriod?: string;
  vocalReport?: any;
  refereeReport?: any;
  homeCaptainApproval?: any;
  awayCaptainApproval?: any;
  playerStats?: Record<string, any>;
  events?: any[];
  savedAt?: string;
}): Promise<boolean> {
  try {
    const reportId = report.id || `vocalia-${report.matchId}`;
    const reportRef = doc(db, 'vocalia_reports', reportId);

    const payload = {
      id: reportId,
      matchId: report.matchId,
      tenantId: report.tenantId,
      tenantName: report.tenantName || 'Liga Deporverso',
      subdomain: report.subdomain || 'liga',
      domain: report.domain || `${report.subdomain || 'liga'}.deporverso.app`,
      sportCode: report.sportCode || 'FUTBOL',
      homeTeam: report.homeTeam,
      awayTeam: report.awayTeam,
      homeScore: report.homeScore,
      awayScore: report.awayScore,
      status: report.status,
      currentPeriod: report.currentPeriod || '1T',
      vocalName: report.vocalReport?.vocal_name || 'Vocal de Turno',
      refereeName: report.refereeReport?.main_referee || 'Árbitro Oficial',
      vocalReport: report.vocalReport || null,
      refereeReport: report.refereeReport || null,
      homeCaptainApproval: report.homeCaptainApproval || null,
      awayCaptainApproval: report.awayCaptainApproval || null,
      playerStats: report.playerStats || {},
      eventsCount: report.events?.length || 0,
      events: report.events || [],
      firestorePath: `firestore://vocalia_reports/${reportId}`,
      savedAt: report.savedAt || new Date().toISOString()
    };

    await setDoc(reportRef, payload, { merge: true });
    console.log(`[Firebase] Informe de vocalía ${reportId} guardado con éxito para ${payload.domain}`);

    // Sincronizar también el partido asociado para mantener el marcador y el estado en vivo
    const matchRef = doc(db, 'matches', report.matchId);
    await setDoc(matchRef, {
      id: report.matchId,
      tenantId: report.tenantId,
      sportId: report.sportCode || 'FUTBOL',
      homeTeam: report.homeTeam,
      awayTeam: report.awayTeam,
      homeScore: report.homeScore,
      awayScore: report.awayScore,
      status: report.status === 'IN_PROGRESS' ? 'LIVE' : (report.status || 'SCHEDULED'),
      date: new Date().toISOString(),
      time: report.currentPeriod || '1T',
      field: 'Cancha Principal',
      referee: report.refereeReport?.main_referee || 'Árbitro Oficial',
      subdomain: report.subdomain,
      domain: report.domain,
      vocalReport: report.vocalReport,
      refereeReport: report.refereeReport,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (error) {
    console.warn('[Firebase] Error al guardar informe de vocalía en Firestore:', error);
    return false;
  }
}

// Obtener informes de vocalía desde Firestore
export async function fetchVocaliaReportsFromFirebase(tenantId?: string): Promise<any[]> {
  try {
    const vocaliaCol = collection(db, 'vocalia_reports');
    const q = tenantId
      ? query(vocaliaCol, where('tenantId', '==', tenantId))
      : query(vocaliaCol);

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn('[Firebase] Fallo al cargar informes de vocalía desde Firestore:', error);
    return [];
  }
}

// Suscripción en tiempo real a los informes de vocalía en vivo (para el Panel Administrador y Ligas)
export function subscribeToVocaliaReports(
  tenantId: string | null,
  callback: (reports: any[]) => void
): () => void {
  try {
    const vocaliaCol = collection(db, 'vocalia_reports');
    const q = tenantId
      ? query(vocaliaCol, where('tenantId', '==', tenantId))
      : query(vocaliaCol);

    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(d => d.data());
      callback(reports);
    }, (error) => {
      console.warn('[Firebase] Listener de informes de vocalía en Firestore esperando reconexión:', error.message);
    });
  } catch (e) {
    console.warn('[Firebase] Fallo al inicializar listener de vocalías:', e);
    return () => {};
  }
}

// Obtener crónicas almacenadas en Firestore
export async function fetchChroniclesFromFirebase(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'chronicles'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn('[Firebase] Error al cargar crónicas desde Firestore:', error);
    return [];
  }
}

const LOCAL_STORAGE_TRANSFERS_KEY = 'deporverso_transfers_v2';

// Sincronizar un trámite de pase / transferencia de jugador en Firestore
export async function syncTransferToFirebase(transfer: PlayerTransfer): Promise<boolean> {
  // Primero respaldamos localmente de forma síncrona
  try {
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_TRANSFERS_KEY);
    const list: PlayerTransfer[] = existingRaw ? JSON.parse(existingRaw) : [];
    const idx = list.findIndex(t => t.id === transfer.id);
    if (idx >= 0) {
      list[idx] = transfer;
    } else {
      list.unshift(transfer);
    }
    localStorage.setItem(LOCAL_STORAGE_TRANSFERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[Storage] Error al guardar pase en localStorage:', e);
  }

  // Sincronizamos en Firestore
  try {
    const transferRef = doc(db, 'transfers', transfer.id);
    const payload = {
      id: transfer.id,
      tenantId: transfer.tenant_id,
      playerId: transfer.player_id,
      playerName: transfer.player_name,
      playerCedula: transfer.player_cedula || '',
      originTeamId: transfer.origin_team_id,
      originTeamName: transfer.origin_team_name,
      destinationTeamId: transfer.destination_team_id,
      destinationTeamName: transfer.destination_team_name,
      transferType: transfer.transfer_type,
      status: transfer.status,
      transferFee: transfer.transfer_fee || 0,
      requestDate: transfer.request_date,
      approvalDate: transfer.approval_date || '',
      originApproved: transfer.origin_approval?.approved || false,
      destinationApproved: transfer.destination_approval?.approved || false,
      leagueApproved: transfer.league_approval?.approved || false,
      resolutionNumber: transfer.resolution_number || '',
      certificateCode: transfer.certificate_code || '',
      rawTransfer: transfer,
      updatedAt: new Date().toISOString()
    };

    await setDoc(transferRef, payload, { merge: true });
    console.log(`[Firebase] Pase ${transfer.id} persistido exitosamente en Firestore.`);
    return true;
  } catch (error) {
    console.warn('[Firebase] Advertencia al persistir pase en Firestore, se mantiene respaldo local:', error);
    return false;
  }
}

// Cargar pases de una liga desde Firestore (con fallback a almacenamiento local)
export async function fetchTransfersFromFirebase(tenantId?: string): Promise<PlayerTransfer[]> {
  try {
    const transfersCol = collection(db, 'transfers');
    const q = tenantId
      ? query(transfersCol, where('tenantId', '==', tenantId))
      : query(transfersCol);

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const fromCloud = snapshot.docs.map(doc => {
        const data = doc.data();
        return (data.rawTransfer || data) as PlayerTransfer;
      });
      return fromCloud;
    }
  } catch (error) {
    console.warn('[Firebase] Error al cargar pases desde Firestore, cargando caché local:', error);
  }

  // Fallback local
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_TRANSFERS_KEY);
    if (local) {
      const parsed: PlayerTransfer[] = JSON.parse(local);
      return tenantId ? parsed.filter(t => t.tenant_id === tenantId) : parsed;
    }
  } catch (e) {
    console.warn('[Storage] Fallo al leer pases locales:', e);
  }
  return [];
}

// Suscripción en tiempo real a las solicitudes de pases y transferencias
export function subscribeToTransfers(
  tenantId: string | null,
  callback: (transfers: PlayerTransfer[]) => void
): () => void {
  try {
    const transfersCol = collection(db, 'transfers');
    const q = tenantId
      ? query(transfersCol, where('tenantId', '==', tenantId))
      : query(transfersCol);

    return onSnapshot(q, (snapshot) => {
      const transfers = snapshot.docs.map(d => {
        const data = d.data();
        return (data.rawTransfer || data) as PlayerTransfer;
      });
      callback(transfers);
    }, (error) => {
      console.warn('[Firebase] Listener de transferencias Firestore offline:', error.message);
    });
  } catch (e) {
    console.warn('[Firebase] Fallo al inicializar listener de transferencias:', e);
    return () => {};
  }
}

