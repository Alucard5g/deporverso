import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { EventEmitter } from 'events';

export type ServerUserRole =
  | 'SUPER_ADMIN'
  | 'LEAGUE_ADMIN'
  | 'REFEREE'
  | 'TEAM_DELEGATE'
  | 'SCOUT';

export interface AppUserDTO {
  id: string;
  email: string;
  password: string;
  name: string;
  role: ServerUserRole;
  status: 'ACTIVO' | 'SUSPENDIDO';
  tenantId?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface SanitizedUserDTO {
  id: string;
  email: string;
  password: string; // Masked '••••'
  name: string;
  role: ServerUserRole;
  status: 'ACTIVO' | 'SUSPENDIDO';
  tenantId?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface StoredUserRecord {
  id: string;
  email: string;
  name: string;
  role: ServerUserRole;
  status: 'ACTIVO' | 'SUSPENDIDO';
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  passwordHash: string;
  passwordEncrypted: string;
}

interface PersistedStoreFile {
  version: number;
  revision: number;
  updatedAt: string;
  users: StoredUserRecord[];
}

export interface UserSyncEvent {
  type: 'users_synced';
  action: 'upsert' | 'batch_sync' | 'password_updated' | 'status_toggled' | 'deleted' | 'registered' | 'login';
  revision: number;
  totalUsers: number;
  affectedEmail?: string;
  timestamp: string;
}

export const MASTER_ADMIN_EMAIL = 'roly3d.rg@gmail.com';
export const MASTER_ADMIN_PASSWORDS = [
  '1326',
  'admin',
  'cig2026',
  '0000',
  'admin1326',
  'deporverso2026',
];

const VALID_ROLES: ServerUserRole[] = [
  'SUPER_ADMIN',
  'LEAGUE_ADMIN',
  'REFEREE',
  'TEAM_DELEGATE',
  'SCOUT',
];

const INITIAL_SEED_TIMESTAMP = '2026-09-29T00:00:00.000Z';

const SECURITY_DIR = path.join(process.cwd(), '.cig-security');
const STORE_FILE_PATH = path.join(SECURITY_DIR, 'deporverso-users.json');
const VAULT_KEY_PATH = path.join(SECURITY_DIR, '.user-vault.key');

function ensureSecurityDir(): void {
  if (!fs.existsSync(SECURITY_DIR)) {
    fs.mkdirSync(SECURITY_DIR, { recursive: true, mode: 0o700 });
  }
}

function getOrCreateVaultKey(): Buffer {
  ensureSecurityDir();
  if (fs.existsSync(VAULT_KEY_PATH)) {
    try {
      const hex = fs.readFileSync(VAULT_KEY_PATH, 'utf8').trim();
      if (hex.length === 64) {
        return Buffer.from(hex, 'hex');
      }
    } catch {
      // Regenerate below if unreadable
    }
  }
  const key = crypto.randomBytes(32);
  fs.writeFileSync(VAULT_KEY_PATH, key.toString('hex'), { encoding: 'utf8', mode: 0o600 });
  return key;
}

function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasswordHash(plain: string, storedHash: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;
    const expected = Buffer.from(keyHex, 'hex');
    const actual = crypto.scryptSync(plain, salt, 64);
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function encryptSecret(plain: string, vaultKey: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', vaultKey, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decryptSecret(payload: string, vaultKey: Buffer): string {
  try {
    const [ivHex, tagHex, dataHex] = payload.split(':');
    if (!ivHex || !tagHex || !dataHex) return '••••';
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      vaultKey,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch {
    return '••••';
  }
}

function normalizeRole(role?: string): ServerUserRole {
  if (role && VALID_ROLES.includes(role as ServerUserRole)) {
    return role as ServerUserRole;
  }
  return 'LEAGUE_ADMIN';
}

class UserStoreService extends EventEmitter {
  private vaultKey: Buffer;
  private store: PersistedStoreFile;

  constructor() {
    super();
    this.setMaxListeners(100);
    this.vaultKey = getOrCreateVaultKey();
    this.store = this.loadOrInitializeStore();
  }

  private buildInitialSeedRecords(): StoredUserRecord[] {
    const seeds: Array<{
      id: string;
      email: string;
      password: string;
      name: string;
      role: ServerUserRole;
      createdAt: string;
    }> = [
      {
        id: 'u-roly3d',
        email: MASTER_ADMIN_EMAIL,
        password: '0000',
        name: 'Roly (Administrador Único CIG)',
        role: 'SUPER_ADMIN',
        createdAt: '2026-09-29',
      },
      {
        id: 'u-operador',
        email: 'operador@deporverso.com',
        password: '0000',
        name: 'Operador de Mesa & Vocalía',
        role: 'LEAGUE_ADMIN',
        createdAt: '2026-09-29',
      },
      {
        id: 'u-scout',
        email: 'scouting@deporverso.com',
        password: '0000',
        name: 'Ojeador Deportivo',
        role: 'SCOUT',
        createdAt: '2026-09-29',
      },
    ];

    return seeds.map((s) => ({
      id: s.id,
      email: s.email.toLowerCase(),
      name: s.name,
      role: s.role,
      status: 'ACTIVO',
      createdAt: s.createdAt,
      updatedAt: INITIAL_SEED_TIMESTAMP,
      passwordHash: hashPassword(s.password),
      passwordEncrypted: encryptSecret(s.password, this.vaultKey),
    }));
  }

  private loadOrInitializeStore(): PersistedStoreFile {
    ensureSecurityDir();
    if (fs.existsSync(STORE_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_FILE_PATH, 'utf8');
        const parsed = JSON.parse(raw) as PersistedStoreFile;
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          // Ensure primary creator account always exists
          const hasCreator = parsed.users.some(
            (u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
          );
          if (!hasCreator) {
            parsed.users.unshift(this.buildInitialSeedRecords()[0]);
            this.persistToDisk(parsed);
          }
          return parsed;
        }
      } catch (err) {
        console.warn('[UserStore] Error leyendo archivo de usuarios, regenerando base:', err);
      }
    }

    const initial: PersistedStoreFile = {
      version: 1,
      revision: 1,
      updatedAt: new Date().toISOString(),
      users: this.buildInitialSeedRecords(),
    };
    this.persistToDisk(initial);
    return initial;
  }

  private persistToDisk(data: PersistedStoreFile): void {
    ensureSecurityDir();
    const tmpPath = `${STORE_FILE_PATH}.${process.pid}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(tmpPath, STORE_FILE_PATH);
  }

  private commitAndBroadcast(
    action: UserSyncEvent['action'],
    affectedEmail?: string
  ): UserSyncEvent {
    this.store.revision += 1;
    this.store.updatedAt = new Date().toISOString();
    this.persistToDisk(this.store);

    const event: UserSyncEvent = {
      type: 'users_synced',
      action,
      revision: this.store.revision,
      totalUsers: this.store.users.length,
      affectedEmail,
      timestamp: this.store.updatedAt,
    };
    this.emit('sync', event);
    return event;
  }

  private toAdminDTO(record: StoredUserRecord): AppUserDTO {
    return {
      id: record.id,
      email: record.email,
      password: decryptSecret(record.passwordEncrypted, this.vaultKey),
      name: record.name,
      role: record.role,
      status: record.status,
      tenantId: record.tenantId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      lastLogin: record.lastLogin,
    };
  }

  private toSanitizedDTO(record: StoredUserRecord): SanitizedUserDTO {
    return {
      id: record.id,
      email: record.email,
      password: '••••',
      name: record.name,
      role: record.role,
      status: record.status,
      tenantId: record.tenantId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      lastLogin: record.lastLogin,
    };
  }

  public getRevision(): number {
    return this.store.revision;
  }

  public getTotalUsers(): number {
    return this.store.users.length;
  }

  public listUsersForAdmin(): { users: AppUserDTO[]; revision: number } {
    return {
      users: this.store.users.map((r) => this.toAdminDTO(r)),
      revision: this.store.revision,
    };
  }

  public isMasterOrAdminPassword(candidate: string): boolean {
    const trimmed = (candidate || '').trim();
    if (!trimmed) return false;
    if (MASTER_ADMIN_PASSWORDS.includes(trimmed.toLowerCase())) {
      return true;
    }
    const admin = this.store.users.find(
      (u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
    );
    return Boolean(admin && verifyPasswordHash(trimmed, admin.passwordHash));
  }

  public verifyAdminPassword(password: string): {
    success: boolean;
    user?: SanitizedUserDTO;
    isSuperAdmin: boolean;
    role: ServerUserRole;
    message?: string;
  } {
    const trimmed = (password || '').trim();
    if (!trimmed) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'SUPER_ADMIN',
        message: 'Por favor digita tu contraseña de administrador.',
      };
    }

    const admin = this.store.users.find(
      (u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
    );

    if (this.isMasterOrAdminPassword(trimmed)) {
      if (admin) {
        admin.lastLogin = new Date().toISOString();
        this.commitAndBroadcast('login', admin.email);
      }
      return {
        success: true,
        isSuperAdmin: true,
        role: 'SUPER_ADMIN',
        user: admin
          ? this.toSanitizedDTO(admin)
          : {
              id: 'u-roly3d',
              email: MASTER_ADMIN_EMAIL,
              password: '••••',
              name: 'Roly (Administrador Único CIG)',
              role: 'SUPER_ADMIN',
              status: 'ACTIVO',
              createdAt: '2026-09-29',
            },
      };
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'SUPER_ADMIN',
      message: 'Contraseña de administrador incorrecta.',
    };
  }

  public verifyLogin(email: string, password: string): {
    success: boolean;
    notFound?: boolean;
    user?: SanitizedUserDTO;
    isSuperAdmin: boolean;
    role: ServerUserRole;
    message?: string;
  } {
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

    if (trimmedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
      const admin = this.store.users.find(
        (u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
      );
      if (this.isMasterOrAdminPassword(trimmedPass)) {
        if (admin) {
          admin.lastLogin = new Date().toISOString();
          this.commitAndBroadcast('login', admin.email);
        }
        return {
          success: true,
          isSuperAdmin: true,
          role: 'SUPER_ADMIN',
          user: admin
            ? this.toSanitizedDTO(admin)
            : {
                id: 'u-roly3d',
                email: MASTER_ADMIN_EMAIL,
                password: '••••',
                name: 'Roly (Creador & Administrador CIG)',
                role: 'SUPER_ADMIN',
                status: 'ACTIVO',
                createdAt: '2026-09-29',
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

    const matched = this.store.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!matched) {
      return {
        success: false,
        notFound: true,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message:
          'Usuario no registrado. Por favor crea una cuenta desde la pestaña de Registro.',
      };
    }

    if (matched.status === 'SUSPENDIDO') {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message:
          'Tu cuenta ha sido suspendida. Contacta al Administrador de la plataforma.',
      };
    }

    if (verifyPasswordHash(trimmedPass, matched.passwordHash)) {
      matched.lastLogin = new Date().toISOString();
      this.commitAndBroadcast('login', matched.email);
      return {
        success: true,
        isSuperAdmin: false,
        role: matched.role === 'SUPER_ADMIN' ? 'LEAGUE_ADMIN' : matched.role,
        user: this.toSanitizedDTO(matched),
      };
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'LEAGUE_ADMIN',
      message: 'Contraseña incorrecta para este correo electrónico.',
    };
  }

  public upsertUserByAdmin(input: Partial<AppUserDTO>): {
    user: AppUserDTO;
    revision: number;
  } {
    const email = String(input.email || '').trim().toLowerCase();
    const password = String(input.password || '').trim();
    if (!email || !email.includes('@')) {
      throw new Error('Correo electrónico inválido.');
    }

    const now = new Date().toISOString();
    const existingIndex = this.store.users.findIndex(
      (u) => u.email.toLowerCase() === email
    );

    if (existingIndex >= 0) {
      const prev = this.store.users[existingIndex];
      const nextPass = password && password !== '••••' ? password : decryptSecret(prev.passwordEncrypted, this.vaultKey);
      const updated: StoredUserRecord = {
        ...prev,
        name: (input.name || prev.name || email.split('@')[0]).trim(),
        role:
          email === MASTER_ADMIN_EMAIL.toLowerCase()
            ? 'SUPER_ADMIN'
            : normalizeRole(input.role || prev.role),
        status:
          email === MASTER_ADMIN_EMAIL.toLowerCase()
            ? 'ACTIVO'
            : input.status === 'SUSPENDIDO' || input.status === 'ACTIVO'
            ? input.status
            : prev.status,
        tenantId: input.tenantId ?? prev.tenantId,
        updatedAt: now,
        passwordHash: hashPassword(nextPass),
        passwordEncrypted: encryptSecret(nextPass, this.vaultKey),
      };
      this.store.users[existingIndex] = updated;
      const ev = this.commitAndBroadcast('upsert', email);
      return { user: this.toAdminDTO(updated), revision: ev.revision };
    }

    if (!password) {
      throw new Error('La contraseña inicial es obligatoria.');
    }

    const created: StoredUserRecord = {
      id: (input.id && String(input.id).trim()) || `u-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      email,
      name: (input.name || email.split('@')[0]).trim(),
      role:
        email === MASTER_ADMIN_EMAIL.toLowerCase()
          ? 'SUPER_ADMIN'
          : normalizeRole(input.role),
      status: input.status === 'SUSPENDIDO' ? 'SUSPENDIDO' : 'ACTIVO',
      tenantId: input.tenantId,
      createdAt: input.createdAt || now.split('T')[0],
      updatedAt: now,
      lastLogin: input.lastLogin,
      passwordHash: hashPassword(password),
      passwordEncrypted: encryptSecret(password, this.vaultKey),
    };

    this.store.users.unshift(created);
    const ev = this.commitAndBroadcast('upsert', email);
    return { user: this.toAdminDTO(created), revision: ev.revision };
  }

  /**
   * Migra y fusiona usuarios existentes desde el localStorage del navegador del Administrador
   * (por ejemplo los 2 usuarios añadidos previamente en local) hacia el almacenamiento real en servidor
   * sin sobrescribir usuarios ya editados recientemente en el servidor.
   */
  public syncBatchFromClient(incomingUsers: AppUserDTO[]): {
    importedCount: number;
    updatedCount: number;
    users: AppUserDTO[];
    revision: number;
  } {
    let importedCount = 0;
    let updatedCount = 0;
    const now = new Date().toISOString();

    for (const raw of incomingUsers) {
      if (!raw || typeof raw.email !== 'string') continue;
      const email = raw.email.trim().toLowerCase();
      if (!email || !email.includes('@')) continue;

      const rawPassword = typeof raw.password === 'string' ? raw.password.trim() : '';
      const existingIdx = this.store.users.findIndex(
        (u) => u.email.toLowerCase() === email
      );

      if (existingIdx < 0) {
        if (!rawPassword || rawPassword === '••••') continue;
        const created: StoredUserRecord = {
          id: raw.id || `u-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
          email,
          name: (raw.name || email.split('@')[0]).trim(),
          role:
            email === MASTER_ADMIN_EMAIL.toLowerCase()
              ? 'SUPER_ADMIN'
              : normalizeRole(raw.role),
          status: raw.status === 'SUSPENDIDO' ? 'SUSPENDIDO' : 'ACTIVO',
          tenantId: raw.tenantId,
          createdAt: raw.createdAt || now.split('T')[0],
          updatedAt: raw.updatedAt || now,
          lastLogin: raw.lastLogin,
          passwordHash: hashPassword(rawPassword),
          passwordEncrypted: encryptSecret(rawPassword, this.vaultKey),
        };
        this.store.users.unshift(created);
        importedCount += 1;
      } else {
        // Si el registro en servidor sigue con timestamp de semilla inicial (no editado aún en servidor)
        // y el navegador del admin trae cambios reales (por ejemplo clave o estado editados localmente), preservarlos.
        const existing = this.store.users[existingIdx];
        const isInitialSeedOnly = existing.updatedAt === INITIAL_SEED_TIMESTAMP;
        const hasRealPassword = Boolean(rawPassword && rawPassword !== '••••');
        const currentPlain = decryptSecret(existing.passwordEncrypted, this.vaultKey);
        const differsFromSeed =
          (hasRealPassword && rawPassword !== currentPlain) ||
          (raw.name && raw.name.trim() !== existing.name) ||
          (raw.status && raw.status !== existing.status);

        if (isInitialSeedOnly && differsFromSeed && email !== MASTER_ADMIN_EMAIL.toLowerCase()) {
          const finalPass = hasRealPassword ? rawPassword : currentPlain;
          this.store.users[existingIdx] = {
            ...existing,
            name: (raw.name || existing.name).trim(),
            role: normalizeRole(raw.role || existing.role),
            status: raw.status === 'SUSPENDIDO' ? 'SUSPENDIDO' : 'ACTIVO',
            tenantId: raw.tenantId ?? existing.tenantId,
            updatedAt: now,
            passwordHash: hashPassword(finalPass),
            passwordEncrypted: encryptSecret(finalPass, this.vaultKey),
          };
          updatedCount += 1;
        }
      }
    }

    if (importedCount > 0 || updatedCount > 0) {
      const ev = this.commitAndBroadcast('batch_sync');
      return {
        importedCount,
        updatedCount,
        users: this.store.users.map((r) => this.toAdminDTO(r)),
        revision: ev.revision,
      };
    }

    return {
      importedCount: 0,
      updatedCount: 0,
      users: this.store.users.map((r) => this.toAdminDTO(r)),
      revision: this.store.revision,
    };
  }

  public registerPublicUser(input: {
    id?: string;
    name?: string;
    email: string;
    password: string;
    role?: ServerUserRole;
  }): {
    success: boolean;
    status?: number;
    message?: string;
    user?: SanitizedUserDTO;
    revision?: number;
  } {
    const email = String(input.email || '').trim().toLowerCase();
    const password = String(input.password || '').trim();
    const name = String(input.name || '').trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, status: 400, message: 'Ingresa un formato de correo electrónico válido.' };
    }
    if (!password || password.length < 4) {
      return { success: false, status: 400, message: 'La contraseña debe tener al menos 4 caracteres.' };
    }
    if (email === MASTER_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        status: 409,
        message: 'Esta cuenta oficial del Creador ya existe. Ingresa tu clave de Creador en "Ingresar".',
      };
    }

    const exists = this.store.users.some((u) => u.email.toLowerCase() === email);
    if (exists) {
      return {
        success: false,
        status: 409,
        message: 'Este correo ya está registrado. Por favor inicia sesión.',
      };
    }

    const safeRole: ServerUserRole =
      input.role === 'SCOUT' || input.role === 'TEAM_DELEGATE' || input.role === 'REFEREE'
        ? input.role
        : 'LEAGUE_ADMIN';

    const now = new Date().toISOString();
    const created: StoredUserRecord = {
      id: (input.id && String(input.id).trim()) || `u-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      email,
      name: name || email.split('@')[0],
      role: safeRole,
      status: 'ACTIVO',
      createdAt: now.split('T')[0],
      updatedAt: now,
      lastLogin: now,
      passwordHash: hashPassword(password),
      passwordEncrypted: encryptSecret(password, this.vaultKey),
    };

    this.store.users.unshift(created);
    const ev = this.commitAndBroadcast('registered', email);
    return {
      success: true,
      user: this.toSanitizedDTO(created),
      revision: ev.revision,
    };
  }

  public updatePasswordByIdOrEmail(
    idOrEmail: string,
    newPassword: string
  ): { user: AppUserDTO; revision: number } | null {
    const key = String(idOrEmail || '').trim().toLowerCase();
    const pass = String(newPassword || '').trim();
    if (!key || !pass) return null;

    const record = this.store.users.find(
      (u) => u.id.toLowerCase() === key || u.email.toLowerCase() === key
    );
    if (!record) return null;

    record.passwordHash = hashPassword(pass);
    record.passwordEncrypted = encryptSecret(pass, this.vaultKey);
    record.updatedAt = new Date().toISOString();

    const ev = this.commitAndBroadcast('password_updated', record.email);
    return { user: this.toAdminDTO(record), revision: ev.revision };
  }

  public toggleStatusById(
    userId: string,
    explicitStatus?: 'ACTIVO' | 'SUSPENDIDO'
  ): { user: AppUserDTO; revision: number } | null {
    const record = this.store.users.find(
      (u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase()
    );
    if (!record) return null;

    if (record.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      record.status = 'ACTIVO';
    } else {
      record.status =
        explicitStatus || (record.status === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO');
    }
    record.updatedAt = new Date().toISOString();

    const ev = this.commitAndBroadcast('status_toggled', record.email);
    return { user: this.toAdminDTO(record), revision: ev.revision };
  }

  public deleteUserById(userId: string): { deletedEmail: string; revision: number } | null {
    const idx = this.store.users.findIndex(
      (u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase()
    );
    if (idx < 0) return null;

    const target = this.store.users[idx];
    if (target.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('La cuenta principal de SuperAdmin está blindada y no puede ser eliminada.');
    }

    this.store.users.splice(idx, 1);
    const ev = this.commitAndBroadcast('deleted', target.email);
    return { deletedEmail: target.email, revision: ev.revision };
  }
}

export const userStore = new UserStoreService();
