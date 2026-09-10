import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, collection, getDocs, setDoc, onSnapshot, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Inicializar la aplicación Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore especificando la base de datos provisionada
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Verificación opcional de conectividad al servidor Firestore (invocable bajo demanda o en background)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Conexión a Firestore verificada con éxito.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] El cliente está en modo offline o esperando red.');
    } else {
      console.log('[Firebase] Inicialización de conexión Firestore lista.');
    }
    return false;
  }
}
