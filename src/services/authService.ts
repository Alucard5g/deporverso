/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * SERVICIO CENTRAL DE AUTENTICACIÓN & SINCRONIZACIÓN REAL DE USUARIOS
 * ============================================================================
 */

import { UserRole } from '../types';
import { getCreatorStudioKey, setCreatorStudioKey, clearCreatorStudioKey } from './streamStudioClient';
import { syncAppUserToFirebase, deleteAppUserFromFirebase, subscribeToAppUsers } from './firebaseService';

export interface AppUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: 'ACTIVO' | 'SUSPENDIDO';
  tenantId?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface SyncStatusMeta {
  synced: boolean;
  revision: number;
  lastSyncedAt: string;
  action?: string;
}

const STORAGE_USERS_KEY = 'deporverso_registered_users';
const CREATOR_TOKEN_STORAGE = 'deporverso_creator_token';
const BROADCAST_CHANNEL_NAME = 'deporverso_users_sync';

// Contraseñas maestras para acceso directo de administrador (solo desde el perfil de administrador)
export const MASTER_ADMIN_PASSWORDS = ['1326', 'admin', 'cig2026', '0000', 'admin1326', 'deporverso2026'];
export const MASTER_ADMIN_EMAIL = 'roly3d.rg@gmail.com';

// Usuarios base pre-registrados en la plataforma: SOLO UN ADMINISTRADOR (roly3d.rg@gmail.com)
const INITIAL_USERS: AppUser[] = [
  {
    id: 'u-roly3d',
    email: 'roly3d.rg@gmail.com',
    password: '0000',
    name: 'Roly (Administrador Único CIG)',
    role: 'SUPER_ADMIN',
    status: 'ACTIVO',
    createdAt: '2026-09-29',
  },
  {
    id: 'u-operador',
    email: 'operador@deporverso.com',
    password: '0000',
    name: 'Operador de Mesa & Vocalía',
    role: 'LEAGUE_ADMIN',
    status: 'ACTIVO',
    createdAt: '2026-09-29',
  },
  {
    id: 'u-scout',
    email: 'scouting@deporverso.com',
    password: '0000',
    name: 'Ojeador Deportivo',
    role: 'SCOUT',
    status: 'ACTIVO',
    createdAt: '2026-09-29',
  },
];

export function setCreatorAuthToken(token: string): void {
  try {
    sessionStorage.setItem(CREATOR_TOKEN_STORAGE, token);
    localStorage.setItem(CREATOR_TOKEN_STORAGE, token);
  } catch {
    // Ignore storage restrictions
  }
}

export function getCreatorAuthToken(): string {
  try {
    return (
      sessionStorage.getItem(CREATOR_TOKEN_STORAGE) ||
      localStorage.getItem(CREATOR_TOKEN_STORAGE) ||
      ''
    );
  } catch {
    return '';
  }
}

export function clearCreatorAuthToken(): void {
  try {
    sessionStorage.removeItem(CREATOR_TOKEN_STORAGE);
    localStorage.removeItem(CREATOR_TOKEN_STORAGE);
  } catch {
    // Ignore
  }
  clearCreatorStudioKey();
}

function buildAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getCreatorAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const creatorKey = getCreatorStudioKey();
  if (creatorKey) {
    headers['x-creator-key'] = creatorKey;
  }
  return headers;
}

function writeLocalUsersCache(users: AppUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error guardando caché local de usuarios:', e);
  }
}

function emitBroadcastChange(action: string): void {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.postMessage({ action, timestamp: Date.now() });
      ch.close();
    }
  } catch {
    // BroadcastChannel optional
  }
}

let hasBatchSyncedInSession = false;

export const authService = {
  /**
   * Obtiene la lista completa de usuarios registrados desde caché local o estado inicial
   */
  getRegisteredUsers(): AppUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasRoly = parsed.some(
            (u) => u?.email && u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
          );
          if (!hasRoly) {
            parsed.unshift(INITIAL_USERS[0]);
            writeLocalUsersCache(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error leyendo usuarios de localStorage:', e);
    }
    writeLocalUsersCache(INITIAL_USERS);
    return INITIAL_USERS;
  },

  /**
   * Registra o actualiza un usuario en caché local
   */
  saveUser(user: AppUser): void {
    const users = this.getRegisteredUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.unshift(user);
    }
    writeLocalUsersCache(users);
    emitBroadcastChange('local_save');
  },

  /**
   * Cambia o resetea la contraseña de un usuario en caché local
   */
  updateUserPassword(email: string, newPassword: string): boolean {
    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password = newPassword;
      writeLocalUsersCache(users);
      emitBroadcastChange('local_password');
      return true;
    }
    return false;
  },

  /**
   * Elimina un usuario en caché local
   */
  deleteUser(userId: string): void {
    let users = this.getRegisteredUsers();
    users = users.filter((u) => u.id !== userId);
    writeLocalUsersCache(users);
    emitBroadcastChange('local_delete');
  },

  /**
   * Alterna estado ACTIVO / SUSPENDIDO en caché local
   */
  toggleUserStatus(userId: string): void {
    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.status = user.status === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
      writeLocalUsersCache(users);
      emitBroadcastChange('local_status');
    }
  },

  /**
   * Migra y sincroniza TODOS los usuarios guardados localmente (incluidos los añadidos previamente
   * en el Panel de Administrador del navegador) con el servidor real y Firestore.
   */
  async syncLocalUsersToServer(force = false): Promise<{
    success: boolean;
    users: AppUser[];
    importedCount: number;
    updatedCount: number;
    revision: number;
  }> {
    const localUsers = this.getRegisteredUsers();
    if (!force && hasBatchSyncedInSession) {
      return this.fetchUsersRealTime();
    }

    try {
      const res = await fetch('/api/auth/users/sync-batch', {
        method: 'POST',
        headers: buildAdminHeaders(),
        body: JSON.stringify({ users: localUsers }),
      });

      if (!res.ok) {
        return {
          success: false,
          users: localUsers,
          importedCount: 0,
          updatedCount: 0,
          revision: 0,
        };
      }

      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        hasBatchSyncedInSession = true;
        writeLocalUsersCache(data.users);
        emitBroadcastChange('batch_sync');

        // Respaldo paralelo en Firestore si SuperAdmin tiene sesión Google Firebase activa
        for (const u of data.users as AppUser[]) {
          void syncAppUserToFirebase(u);
        }

        return {
          success: true,
          users: data.users,
          importedCount: Number(data.importedCount || 0),
          updatedCount: Number(data.updatedCount || 0),
          revision: Number(data.revision || 1),
        };
      }
    } catch (err) {
      console.warn('[AuthService] Fallo en sincronización inicial hacia servidor:', err);
    }

    return {
      success: false,
      users: localUsers,
      importedCount: 0,
      updatedCount: 0,
      revision: 0,
    };
  },

  /**
   * Obtiene el directorio vivo actualizado desde el servidor persistente (Solo SuperAdmin)
   */
  async fetchUsersRealTime(): Promise<{
    success: boolean;
    users: AppUser[];
    importedCount: number;
    updatedCount: number;
    revision: number;
  }> {
    try {
      const res = await fetch('/api/auth/users', {
        method: 'GET',
        headers: buildAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.users)) {
          writeLocalUsersCache(data.users);
          return {
            success: true,
            users: data.users,
            importedCount: 0,
            updatedCount: 0,
            revision: Number(data.revision || 1),
          };
        }
      }
    } catch (err) {
      console.warn('[AuthService] No se pudo consultar usuarios del servidor, usando caché local:', err);
    }
    return {
      success: false,
      users: this.getRegisteredUsers(),
      importedCount: 0,
      updatedCount: 0,
      revision: 0,
    };
  },

  /**
   * Guarda un usuario nuevo o editado desde AdminUserManager directamente en servidor + Firestore
   * y dispara notificación en tiempo real.
   */
  async saveUserRealTime(user: AppUser): Promise<{
    success: boolean;
    syncedToServer: boolean;
    user: AppUser;
    users: AppUser[];
    revision: number;
    error?: string;
  }> {
    // 1. Respuesta inmediata en caché local
    this.saveUser(user);

    // 2. Persistencia real en servidor
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: buildAdminHeaders(),
        body: JSON.stringify(user),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success && Array.isArray(data.users)) {
        writeLocalUsersCache(data.users);
        emitBroadcastChange('upsert');
        void syncAppUserToFirebase(data.user || user);
        return {
          success: true,
          syncedToServer: true,
          user: data.user || user,
          users: data.users,
          revision: Number(data.revision || 1),
        };
      }

      if (!res.ok) {
        return {
          success: false,
          syncedToServer: false,
          user,
          users: this.getRegisteredUsers(),
          revision: 0,
          error: data?.error || 'Error guardando usuario en el servidor.',
        };
      }
    } catch (err) {
      console.warn('[AuthService] Servidor no disponible al guardar usuario, guardado en respaldo local:', err);
    }

    void syncAppUserToFirebase(user);
    return {
      success: true,
      syncedToServer: false,
      user,
      users: this.getRegisteredUsers(),
      revision: 0,
    };
  },

  /**
   * Actualiza la contraseña en servidor + caché local + Firestore en tiempo real
   */
  async updateUserPasswordRealTime(
    emailOrId: string,
    newPassword: string
  ): Promise<{ success: boolean; syncedToServer: boolean; users: AppUser[]; revision: number }> {
    this.updateUserPassword(emailOrId, newPassword);

    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(emailOrId)}/password`, {
        method: 'PATCH',
        headers: buildAdminHeaders(),
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && Array.isArray(data.users)) {
        writeLocalUsersCache(data.users);
        emitBroadcastChange('password_updated');
        if (data.user) void syncAppUserToFirebase(data.user);
        return {
          success: true,
          syncedToServer: true,
          users: data.users,
          revision: Number(data.revision || 1),
        };
      }
    } catch (err) {
      console.warn('[AuthService] Error sincronizando cambio de clave:', err);
    }

    return {
      success: true,
      syncedToServer: false,
      users: this.getRegisteredUsers(),
      revision: 0,
    };
  },

  /**
   * Alterna ACTIVO / SUSPENDIDO en servidor + caché local en tiempo real
   */
  async toggleUserStatusRealTime(
    userId: string
  ): Promise<{ success: boolean; syncedToServer: boolean; users: AppUser[]; revision: number }> {
    this.toggleUserStatus(userId);

    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(userId)}/status`, {
        method: 'PATCH',
        headers: buildAdminHeaders(),
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && Array.isArray(data.users)) {
        writeLocalUsersCache(data.users);
        emitBroadcastChange('status_toggled');
        if (data.user) void syncAppUserToFirebase(data.user);
        return {
          success: true,
          syncedToServer: true,
          users: data.users,
          revision: Number(data.revision || 1),
        };
      }
    } catch (err) {
      console.warn('[AuthService] Error sincronizando cambio de estado:', err);
    }

    return {
      success: true,
      syncedToServer: false,
      users: this.getRegisteredUsers(),
      revision: 0,
    };
  },

  /**
   * Elimina usuario del servidor, caché local y Firestore en tiempo real
   */
  async deleteUserRealTime(
    userId: string
  ): Promise<{ success: boolean; syncedToServer: boolean; users: AppUser[]; revision: number }> {
    this.deleteUser(userId);

    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: buildAdminHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && Array.isArray(data.users)) {
        writeLocalUsersCache(data.users);
        emitBroadcastChange('deleted');
        void deleteAppUserFromFirebase(userId);
        return {
          success: true,
          syncedToServer: true,
          users: data.users,
          revision: Number(data.revision || 1),
        };
      }
    } catch (err) {
      console.warn('[AuthService] Error eliminando usuario en servidor:', err);
    }

    void deleteAppUserFromFirebase(userId);
    return {
      success: true,
      syncedToServer: false,
      users: this.getRegisteredUsers(),
      revision: 0,
    };
  },

  /**
   * Registro público asíncrono desde LoginGate (persiste inmediatamente en servidor para todos los dispositivos)
   */
  async registerUserAsync(newUser: AppUser): Promise<{
    success: boolean;
    user?: AppUser;
    message?: string;
    revision?: number;
  }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        const persistedUser: AppUser = {
          ...(data.user || newUser),
          password: newUser.password,
        };
        this.saveUser(persistedUser);
        return {
          success: true,
          user: persistedUser,
          revision: Number(data.revision || 1),
        };
      }
      return {
        success: false,
        message: data?.message || 'No se pudo completar el registro.',
      };
    } catch {
      // Fallback local si el navegador está temporalmente sin red
      const existingUsers = this.getRegisteredUsers();
      if (existingUsers.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return {
          success: false,
          message: 'Este correo ya está registrado. Por favor inicia sesión.',
        };
      }
      this.saveUser(newUser);
      return { success: true, user: newUser };
    }
  },

  /**
   * Validación en vivo contra el servidor (funciona desde cualquier PC, iPhone o Android al instante).
   * Si detecta un usuario antiguo guardado solo en localStorage de este navegador, lo migra al servidor automáticamente.
   */
  async verifyLoginAsync(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: AppUser;
    isSuperAdmin: boolean;
    role: UserRole;
    creatorToken?: string;
    message?: string;
  }> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    if (!trimmedEmail || !trimmedPass) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message: 'Por favor ingresa tu correo y contraseña registrados.',
      };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPass }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        if (data.isSuperAdmin && data.creatorToken) {
          setCreatorAuthToken(data.creatorToken);
          setCreatorStudioKey('1326');
          // Aprovechar login del administrador para migrar cualquier usuario pendiente en localStorage
          void this.syncLocalUsersToServer(false);
        }
        return {
          success: true,
          user: data.user,
          isSuperAdmin: Boolean(data.isSuperAdmin),
          role: data.role || (data.isSuperAdmin ? 'SUPER_ADMIN' : 'LEAGUE_ADMIN'),
          creatorToken: data.creatorToken,
        };
      }

      // Compatibilidad retroactiva: si aún no se abría el Panel Admin en este navegador y el usuario
      // existía localmente en localStorage con su clave exacta, migrarlo automáticamente al servidor.
      if (data?.notFound) {
        const localCheck = this.verifyLogin(trimmedEmail, trimmedPass);
        if (localCheck.success && localCheck.user && !localCheck.isSuperAdmin) {
          await this.registerUserAsync({
            ...localCheck.user,
            password: trimmedPass,
          });
          return localCheck;
        }
      }

      return {
        success: false,
        isSuperAdmin: false,
        role: data?.role || 'LEAGUE_ADMIN',
        message: data?.message || 'Credenciales no autorizadas.',
      };
    } catch {
      // Fallback offline local
      return this.verifyLogin(trimmedEmail, trimmedPass);
    }
  },

  /**
   * Verificación asíncrona de contraseña maestra para AdminAuthSecurityModal
   */
  async verifyAdminPasswordAsync(password: string): Promise<{
    success: boolean;
    user?: AppUser;
    isSuperAdmin: boolean;
    role: UserRole;
    creatorToken?: string;
    message?: string;
  }> {
    const trimmed = (password || '').trim();
    if (!trimmed) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'SUPER_ADMIN',
        message: 'Por favor digita tu contraseña de administrador.',
      };
    }

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        if (data.creatorToken) setCreatorAuthToken(data.creatorToken);
        setCreatorStudioKey('1326');
        void this.syncLocalUsersToServer(false);
        return {
          success: true,
          user: data.user,
          isSuperAdmin: true,
          role: 'SUPER_ADMIN',
          creatorToken: data.creatorToken,
        };
      }
      return {
        success: false,
        isSuperAdmin: false,
        role: 'SUPER_ADMIN',
        message: data?.message || 'Contraseña de administrador incorrecta.',
      };
    } catch {
      return this.verifyAdminPassword(trimmed);
    }
  },

  /**
   * Suscripción en tiempo real a cambios de usuarios (SSE en vivo + BroadcastChannel + Storage + Focus + Firestore)
   * Garantiza sincronización en < 1 segundo entre paneles, pestañas y dispositivos.
   */
  subscribeToUserSync(
    onSync: (meta: { action: string; revision: number; totalUsers?: number; timestamp: string }) => void
  ): () => void {
    let closed = false;
    let lastRevision = 0;
    let eventSource: EventSource | null = null;
    let bc: BroadcastChannel | null = null;
    let fallbackPollTimer: ReturnType<typeof setInterval> | null = null;

    const triggerSync = (meta: {
      action: string;
      revision: number;
      totalUsers?: number;
      timestamp: string;
    }) => {
      if (closed) return;
      if (meta.revision > 0 && meta.revision <= lastRevision && meta.action !== 'manual') {
        return;
      }
      if (meta.revision > lastRevision) {
        lastRevision = meta.revision;
      }
      onSync(meta);
    };

    try {
      if (typeof EventSource !== 'undefined') {
        eventSource = new EventSource('/api/auth/sync-stream');
        eventSource.addEventListener('users_sync', (ev: MessageEvent) => {
          try {
            const payload = JSON.parse(ev.data);
            triggerSync({
              action: payload.action || 'sse',
              revision: Number(payload.revision || 0),
              totalUsers: payload.totalUsers,
              timestamp: payload.timestamp || new Date().toISOString(),
            });
          } catch {
            // Ignore malformed SSE frame
          }
        });
      }
    } catch {
      // Fallback below handles sync if SSE unavailable
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (ev) => {
          triggerSync({
            action: ev.data?.action || 'broadcast',
            revision: lastRevision + 1,
            timestamp: new Date().toISOString(),
          });
        };
      }
    } catch {
      // Optional
    }

    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_USERS_KEY) {
        triggerSync({
          action: 'storage',
          revision: lastRevision + 1,
          timestamp: new Date().toISOString(),
        });
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleFocus = () => {
      triggerSync({
        action: 'manual',
        revision: lastRevision,
        timestamp: new Date().toISOString(),
      });
    };
    window.addEventListener('focus', handleFocus);

    const unsubFirestore = subscribeToAppUsers(() => {
      triggerSync({
        action: 'firestore',
        revision: lastRevision + 1,
        timestamp: new Date().toISOString(),
      });
    });

    // Polling de respaldo cada 10s en caso de proxies que cierren SSE
    fallbackPollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        triggerSync({
          action: 'manual',
          revision: lastRevision,
          timestamp: new Date().toISOString(),
        });
      }
    }, 10000);

    return () => {
      closed = true;
      if (eventSource) eventSource.close();
      if (bc) bc.close();
      if (fallbackPollTimer) clearInterval(fallbackPollTimer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      unsubFirestore();
    };
  },

  /**
   * Validación síncrona local (mantiene compatibilidad y fallback offline)
   */
  verifyAdminPassword(password: string): {
    success: boolean;
    user?: AppUser;
    isSuperAdmin: boolean;
    role: UserRole;
    message?: string;
  } {
    const trimmedPass = (password || '').trim();
    if (!trimmedPass) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'SUPER_ADMIN',
        message: 'Por favor digita tu contraseña de administrador.',
      };
    }

    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(trimmedPass.toLowerCase());
    const users = this.getRegisteredUsers();
    const adminUser = users.find((u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
    const passMatches = isMasterPassword || (adminUser && adminUser.password === trimmedPass);

    if (passMatches) {
      return {
        success: true,
        isSuperAdmin: true,
        role: 'SUPER_ADMIN',
        user: {
          id: adminUser?.id || 'u-roly3d',
          email: MASTER_ADMIN_EMAIL,
          password: '••••',
          name: adminUser?.name || 'Roly (Administrador Único CIG)',
          role: 'SUPER_ADMIN',
          status: 'ACTIVO',
          createdAt: adminUser?.createdAt || '2026-09-29',
        },
      };
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'SUPER_ADMIN',
      message: 'Contraseña de administrador incorrecta.',
    };
  },

  /**
   * Valida credenciales síncronas locales (fallback offline)
   */
  verifyLogin(email: string, password: string): {
    success: boolean;
    user?: AppUser;
    isSuperAdmin: boolean;
    role: UserRole;
    message?: string;
  } {
    const trimmedPass = (password || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail || !trimmedPass) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message: 'Por favor ingresa tu correo y contraseña registrados.',
      };
    }

    const users = this.getRegisteredUsers();

    if (trimmedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
      const adminUser = users.find((u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
      const matchesMaster =
        MASTER_ADMIN_PASSWORDS.includes(trimmedPass.toLowerCase()) ||
        (adminUser && adminUser.password === trimmedPass);

      if (matchesMaster) {
        return {
          success: true,
          isSuperAdmin: true,
          role: 'SUPER_ADMIN',
          user: {
            id: adminUser?.id || 'u-roly3d',
            email: MASTER_ADMIN_EMAIL,
            password: '••••',
            name: adminUser?.name || 'Roly (Creador & Administrador CIG)',
            role: 'SUPER_ADMIN',
            status: 'ACTIVO',
            createdAt: adminUser?.createdAt || '2026-09-29',
          },
        };
      }
      return {
        success: false,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message: 'Contraseña incorrecta para la cuenta del Creador.',
      };
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (matchedUser) {
      if (matchedUser.status === 'SUSPENDIDO') {
        return {
          success: false,
          isSuperAdmin: false,
          role: 'LEAGUE_ADMIN',
          message: 'Tu cuenta ha sido suspendida. Contacta al Administrador de la plataforma.',
        };
      }

      if (matchedUser.password === trimmedPass) {
        return {
          success: true,
          isSuperAdmin: false,
          role: matchedUser.role === 'SUPER_ADMIN' ? 'LEAGUE_ADMIN' : matchedUser.role,
          user: matchedUser,
        };
      } else {
        return {
          success: false,
          isSuperAdmin: false,
          role: 'LEAGUE_ADMIN',
          message: 'Contraseña incorrecta para este correo electrónico.',
        };
      }
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'LEAGUE_ADMIN',
      message: 'Usuario no registrado. Por favor crea una cuenta desde la pestaña de Registro.',
    };
  },
};
