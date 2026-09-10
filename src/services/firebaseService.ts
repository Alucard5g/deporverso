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
import { Match, MatchEvent, Tenant, Player } from '../types';

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
