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

// Contraseñas maestras para acceso directo de administrador (sin requerir correo)
export const MASTER_ADMIN_PASSWORDS = ['1326', 'admin', 'cig2026', '0000', 'admin1326', 'deporverso2026'];

// Usuarios base pre-registrados en la plataforma
const INITIAL_USERS: AppUser[] = [
  {
    id: 'u-roly3d',
    email: 'roly3d.rg@gmail.com',
    password: '0000',
    name: 'Roly (Director CIG & SuperAdmin)',
    role: 'SUPER_ADMIN',
    status: 'ACTIVO',
    createdAt: '2026-09-29',
  },
  {
    id: 'u-superadmin',
    email: 'admin@cig.corp',
    password: '1326',
    name: 'Administrador Maestro CIG',
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
    name: 'Ojeador Deportivo Internacional',
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
   * Valida credenciales de acceso:
   * - Si se proporciona solo contraseña y coincide con contraseñas de admin -> Super Admin
   * - Si se proporciona correo y contraseña -> Valida contra base de datos de usuarios
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

    // 1. Validación de campos obligatorios:
    // El administrador entra con su contraseña (sin requerir correo)
    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(trimmedPass.toLowerCase());

    if (!trimmedPass) {
      return {
        success: false,
        isSuperAdmin: false,
        role: 'LEAGUE_ADMIN',
        message: 'Por favor ingresa tu contraseña para acceder.'
      };
    }

    // Si no se proporcionó correo:
    // SOLO el administrador entra con su contraseña. Ningún usuario puede ingresar sin correo y contraseña.
    if (!trimmedEmail) {
      if (isMasterPassword) {
        return {
          success: true,
          isSuperAdmin: true,
          role: 'SUPER_ADMIN',
          user: {
            id: 'admin-direct',
            email: 'admin@deporverso.com',
            password: '••••',
            name: 'Super Administrador CIG',
            role: 'SUPER_ADMIN',
            status: 'ACTIVO',
            createdAt: '2026-09-29'
          }
        };
      } else {
        return {
          success: false,
          isSuperAdmin: false,
          role: 'LEAGUE_ADMIN',
          message: 'Ningún usuario puede ingresar sin correo y contraseña. El administrador entra con su contraseña.'
        };
      }
    }

    // 2. Para todos los demás usuarios (con correo y contraseña obligatorios):
    const users = this.getRegisteredUsers();

    // Comprobación específica para roly3d.rg@gmail.com
    if (trimmedEmail === 'roly3d.rg@gmail.com' && (trimmedPass === '0000' || isMasterPassword)) {
      return {
        success: true,
        isSuperAdmin: true,
        role: 'SUPER_ADMIN',
        user: {
          id: 'u-roly3d',
          email: 'roly3d.rg@gmail.com',
          password: '••••',
          name: 'Roly (Director CIG & SuperAdmin)',
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

      if (matchedUser.password === trimmedPass || isMasterPassword) {
        const isSuper = matchedUser.role === 'SUPER_ADMIN';
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

    // 3. Si el correo no está registrado pero se ingresó una clave maestra de admin
    if (trimmedEmail && isMasterPassword) {
      return {
        success: true,
        isSuperAdmin: true,
        role: 'SUPER_ADMIN',
        user: {
          id: 'admin-guest',
          email: trimmedEmail,
          password: '••••',
          name: 'Administrador Maestro',
          role: 'SUPER_ADMIN',
          status: 'ACTIVO',
          createdAt: '2026-09-29'
        }
      };
    }

    return {
      success: false,
      isSuperAdmin: false,
      role: 'LEAGUE_ADMIN',
      message: 'Usuario no encontrado o credenciales inválidas. Verifica tu correo y contraseña.'
    };
  }
};
