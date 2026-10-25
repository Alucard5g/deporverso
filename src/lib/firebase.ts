import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  setLogLevel, 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  setDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Suprimir advertencias internas del SDK de Firestore cuando opera en modo offline/caché local
try {
  setLogLevel('error');
} catch (e) {
  // Ignorar en entornos que no soporten setLogLevel
}

// Inicializar la aplicación Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore especificando la base de datos provisionada si existe
const customDbId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true
  }, customDbId && customDbId !== '(default)' ? customDbId : undefined);
} catch (e) {
  firestoreInstance = customDbId && customDbId !== '(default)'
    ? getFirestore(app, customDbId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Verificación opcional de conectividad al servidor Firestore con timeout seguro
export async function testConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 2500)
    );
    const checkPromise = getDoc(doc(db, 'tenants', 't-pichincha')).then(() => true);
    await Promise.race([checkPromise, timeoutPromise]);
    console.log('[Firebase] Conexión a Firestore verificada con éxito.');
    return true;
  } catch (error) {
    // Si la conexión directa al backend tarda o está en modo local, continuar con persistencia sin advertencias
    return false;
  }
}
