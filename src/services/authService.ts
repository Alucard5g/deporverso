/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * SERVICIO CENTRAL DE AUTENTICACIÓN & GESTIÓN DE USUARIOS
 * ============================================================================
 */

import { UserRole } from '../types';

export interface AppUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: 'ACTIVO' | 'SUSPENDIDO';
  tenantId?: string;
  createdAt: string;
  lastLogin?: string;
}

const STORAGE_USERS_KEY = 'deporverso_registered_users';

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
  }
];

export const authService = {
  /**
   * Obtiene la lista completa de usuarios registrados (desde localStorage o estado inicial)
   */
  getRegisteredUsers(): AppUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Garantizar que roly3d.rg@gmail.com siempre esté presente con su clave
          const hasRoly = parsed.some(u => u.email.toLowerCase() === 'roly3d.rg@gmail.com');
          if (!hasRoly) {
            parsed.unshift(INITIAL_USERS[0]);
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error leyendo usuarios de localStorage:', e);
    }
    // Guardar los iniciales por defecto
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
    } catch (e) {}
    return INITIAL_USERS;
  },

  /**
   * Registra o actualiza un usuario en la plataforma
   */
  saveUser(user: AppUser): void {
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.unshift(user);
    }
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error guardando usuarios en localStorage:', e);
    }
  },

  /**
   * Cambia o resetea la contraseña de un usuario
   */
  updateUserPassword(email: string, newPassword: string): boolean {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password = newPassword;
      try {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      } catch (e) {}
      return true;
    }
    return false;
  },

  /**
   * Elimina un usuario de la plataforma
   */
  deleteUser(userId: string): void {
    let users = this.getRegisteredUsers();
    users = users.filter(u => u.id !== userId);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  },

  /**
   * Alterna estado ACTIVO / SUSPENDIDO
   */
  toggleUserStatus(userId: string): void {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
      try {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      } catch (e) {}
    }
  },

  /**
   * Validación exclusiva desde el perfil de administrador:
   * Solo hay un administrador: roly3d.rg@gmail.com
   * El administrador entra solo digitando su contraseña.
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
        message: 'Por favor digita tu contraseña de administrador.'
      };
    }

    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(trimmedPass.toLowerCase());
    const users = this.getRegisteredUsers();
    const adminUser = users.find(u => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase());
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
          createdAt: adminUser?.createdAt || '2026-09-29'
        }
      };
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'SUPER_ADMIN',
      message: 'Contraseña de administrador incorrecta.'
    };
  },

  /**
   * Valida credenciales de acceso para usuarios interesados y registrados:
   * Requiere correo y contraseña.
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
        message: 'Por favor ingresa tu correo y contraseña registrados.'
      };
    }

    const users = this.getRegisteredUsers();

    // Verificación si inicia sesión con el correo oficial de administración
    if (trimmedEmail === MASTER_ADMIN_EMAIL.toLowerCase() && (trimmedPass === '1326' || trimmedPass === '0000' || MASTER_ADMIN_PASSWORDS.includes(trimmedPass.toLowerCase()))) {
      return {
        success: true,
        isSuperAdmin: true,
        role: 'SUPER_ADMIN',
        user: {
          id: 'u-roly3d',
          email: MASTER_ADMIN_EMAIL,
          password: '••••',
          name: 'Roly (Administrador CIG)',
          role: 'SUPER_ADMIN',
          status: 'ACTIVO',
          createdAt: '2026-09-29'
        }
      };
    }

    // Búsqueda en la lista general de usuarios
    const matchedUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (matchedUser) {
      if (matchedUser.status === 'SUSPENDIDO') {
        return {
          success: false,
          isSuperAdmin: false,
          role: 'LEAGUE_ADMIN',
          message: 'Tu cuenta ha sido suspendida. Contacta al Administrador de la plataforma.'
        };
      }

      if (matchedUser.password === trimmedPass) {
        const isSuper = matchedUser.role === 'SUPER_ADMIN' || matchedUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
        return {
          success: true,
          isSuperAdmin: isSuper,
          role: matchedUser.role,
          user: matchedUser
        };
      } else {
        return {
          success: false,
          isSuperAdmin: false,
          role: 'LEAGUE_ADMIN',
          message: 'Contraseña incorrecta para este correo electrónico.'
        };
      }
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'LEAGUE_ADMIN',
      message: 'Usuario no registrado. Por favor crea una cuenta desde la pestaña de Registro.'
    };
  }
};
