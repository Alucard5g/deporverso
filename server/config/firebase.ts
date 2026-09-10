import { initializeApp, getApps, cert, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { getDatabase, Database, ServerValue } from 'firebase-admin/database';

/**
 * DEPORVERSO FIREBASE REAL-TIME ENGINE
 * Integrates Firebase Admin SDK for:
 * 1. Cloud Firestore (Fan Zone documents, Merch catalogs, Digital Athlete Profiles)
 * 2. Realtime Database (Sub-second live match scoreboard, VAR review indicators, live broadcast telemetry)
 * Designed with Google Cloud Run Application Default Credentials (ADC) and resilient fallback.
 */

let firebaseApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'deporverso-global-prod';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const databaseURL = process.env.FIREBASE_DATABASE_URL || `https://${projectId}-default-rtdb.firebaseio.com`;

  try {
    if (clientEmail && privateKey) {
      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL,
      });
      console.log('[DeporVerso Firebase] Initialized with Service Account Credentials.');
    } else {
      // In Google Cloud Run, default credentials are automatically populated
      firebaseApp = initializeApp({
        credential: applicationDefault(),
        projectId,
        databaseURL,
      });
      console.log('[DeporVerso Firebase] Initialized with Application Default Credentials (Cloud Run).');
    }
  } catch (error: any) {
    console.warn('[DeporVerso Firebase] Initialization warning:', error.message);
    // Create an unauthenticated mock instance to prevent crash during local build/test
    if (!getApps().length) {
      try {
        firebaseApp = initializeApp({ projectId }, 'deporverso-preview-app');
      } catch (e) {
        console.warn('[DeporVerso Firebase Fallback] Active in simulated real-time mode.');
      }
    }
  }

  return firebaseApp;
}

/**
 * Get Firestore instance
 */
export function getFirestoreDb(): Firestore | null {
  try {
    const app = getFirebaseAdmin();
    if (app) {
      return getFirestore(app);
    }
  } catch (e: any) {
    console.warn('[Firestore] Realtime store running in local memory fallback:', e.message);
  }
  return null;
}

/**
 * Get Realtime Database instance
 */
export function getRealtimeDb(): Database | null {
  try {
    const app = getFirebaseAdmin();
    if (app) {
      return getDatabase(app);
    }
  } catch (e: any) {
    console.warn('[RealtimeDB] Running in local memory fallback:', e.message);
  }
  return null;
}

/**
 * High-speed Realtime Match Broadcaster
 * Pushes live match scores and VAR alerts with sub-second latency
 */
export async function broadcastLiveMatchUpdate(
  tenantSubdomain: string,
  matchId: string,
  update: {
    homeScore: number;
    awayScore: number;
    period: string;
    minute: number;
    lastEvent?: string;
    varActive?: boolean;
    varReason?: string;
  }
) {
  // Execute async broadcast in background with short timeout so HTTP calls never block
  Promise.resolve().then(async () => {
    try {
      const rtdb = getRealtimeDb();
      if (rtdb) {
        const ref = rtdb.ref(`tenants/${tenantSubdomain}/live_matches/${matchId}`);
        await Promise.race([
          ref.update({ ...update, updatedAt: ServerValue.TIMESTAMP }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('RTDB timeout')), 800))
        ]);
      }

      const firestore = getFirestoreDb();
      if (firestore) {
        await Promise.race([
          firestore
            .collection('tenants')
            .doc(tenantSubdomain)
            .collection('active_matches')
            .doc(matchId)
            .set(
              {
                ...update,
                syncedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 800))
        ]);
      }
    } catch (err: any) {
      console.warn(`[Broadcast Live Update Note] ${tenantSubdomain}/${matchId}:`, err.message);
    }
  });
}
