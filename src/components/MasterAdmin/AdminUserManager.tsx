import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, UserPlus, Key, Shield, Trash2, Copy, Check, Eye, EyeOff, 
  Lock, RefreshCw, AlertCircle, CheckCircle2, Share2, Search, Mail, 
  UserCheck, UserX, Sparkles, Cloud, Loader2
} from 'lucide-react';
import { authService, AppUser } from '../../services/authService';
import { UserRole } from '../../types';
import { copyTextSafely } from '../../utils/safeClipboard';

export const AdminUserManager: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>(() => authService.getRegisteredUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverSynced, setServerSynced] = useState(false);
  const [syncRevision, setSyncRevision] = useState(0);
  
  // Estados para nuevo usuario añadido personalmente por el Administrador
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('LEAGUE_ADMIN');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Edición rápida de contraseña en línea y confirmación segura de borrado
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedPassword, setEditedPassword] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const syncNowWithServer = useCallback(async (showFeedback = false) => {
    setIsSyncing(true);
    try {
      const res = await authService.syncLocalUsersToServer(true);
      setUsers([...res.users]);
      if (res.success) {
        setServerSynced(true);
        setSyncRevision(res.revision);
        if (res.importedCount > 0) {
          setSuccess(`✓ ${res.importedCount} usuario(s) previos guardados y sincronizados en el servidor.`);
          setTimeout(() => setSuccess(null), 5000);
        } else if (showFeedback) {
          setSuccess('✓ Directorio sincronizado en tiempo real con el servidor.');
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Migración automática al montar + escucha en tiempo real (< 1s via SSE & BroadcastChannel)
  useEffect(() => {
    void syncNowWithServer(false);

    const unsubscribe = authService.subscribeToUserSync(async () => {
      const latest = await authService.fetchUsersRealTime();
      if (latest.success) {
        setUsers([...latest.users]);
        setServerSynced(true);
        setSyncRevision(latest.revision);
      } else {
        setUsers([...authService.getRegisteredUsers()]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [syncNowWithServer]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = '';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedPassword = newPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('El correo y la contraseña son obligatorios.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Formato de correo electrónico inválido.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      setError(`Ya existe un usuario con el correo "${trimmedEmail}". Puedes editar su contraseña abajo.`);
      return;
    }

    setIsSubmitting(true);
    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      name: trimmedName || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      password: trimmedPassword,
      role: newRole,
      status: 'ACTIVO',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await authService.saveUserRealTime(newUser);
      if (!res.success && res.error) {
        setError(res.error);
        return;
      }

      setUsers([...res.users]);
      if (res.syncedToServer) {
        setServerSynced(true);
        setSyncRevision(res.revision);
      }

      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setSuccess(
        res.syncedToServer
          ? `✓ Usuario "${newUser.name}" guardado y sincronizado en tiempo real. Ya puede ingresar desde cualquier dispositivo.`
          : `✓ Usuario "${newUser.name}" guardado con respaldo local.`
      );
      setTimeout(() => setSuccess(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const res = await authService.toggleUserStatusRealTime(userId);
    setUsers([...res.users]);
    if (res.syncedToServer) {
      setServerSynced(true);
      setSyncRevision(res.revision);
    }
  };

  const handleDeleteUser = async (user: AppUser) => {
    setError(null);
    if (user.email.toLowerCase() === 'roly3d.rg@gmail.com') {
      setError('La cuenta principal de SuperAdmin (Roly) está blindada y no puede ser eliminada.');
      setTimeout(() => setError(null), 4000);
      return;
    }
    if (confirmDeleteId !== user.id) {
      setConfirmDeleteId(user.id);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === user.id ? null : prev));
      }, 4500);
      return;
    }
    const res = await authService.deleteUserRealTime(user.id);
    setConfirmDeleteId(null);
    setUsers([...res.users]);
    if (res.syncedToServer) {
      setServerSynced(true);
      setSyncRevision(res.revision);
    }
    setSuccess(`Usuario ${user.email} eliminado y sincronizado.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSaveEditedPassword = async (email: string) => {
    if (!editedPassword.trim()) return;
    const res = await authService.updateUserPasswordRealTime(email, editedPassword.trim());
    setUsers([...res.users]);
    if (res.syncedToServer) {
      setServerSynced(true);
      setSyncRevision(res.revision);
    }
    setEditingUserId(null);
    setEditedPassword('');
    setSuccess(`✓ Contraseña actualizada y sincronizada para ${email}`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const copyUserCredentials = (user: AppUser) => {
    const text = `🏆 *DEPORVERSO - CREDENCIALES OFICIALES*\nHola *${user.name}*, el administrador te ha otorgado acceso:\n📧 *Correo:* ${user.email}\n🔑 *Contraseña:* ${user.password}\n🛡️ *Rol:* ${user.role}\n🌐 *Plataforma:* ${window.location.origin}`;
    copyTextSafely(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner Principal de Flujo Personal */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Flujo de Registro Personal CIG</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-bold ${
                serverSynced
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                <Cloud className="w-3.5 h-3.5" />
                <span>{serverSynced ? `Guardado Real & Sync Activa${syncRevision ? ` · Rev #${syncRevision}` : ''}` : 'Respaldo Local Activo'}</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestión Personal de Usuarios & Contraseñas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Los usuarios que añades o editas aquí se guardan en el servidor y se sincronizan al instante para que puedan acceder desde cualquier PC, iPhone o Android con su correo y clave asignada.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => syncNowWithServer(true)}
              disabled={isSyncing}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              title="Sincronizar todos los usuarios con el servidor ahora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Total Registrados</div>
              <div className="text-xl font-black text-amber-400">{users.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Formulario de Adición Personal (Izquierda) + Tabla de Usuarios (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA 1: Formulario para Asignar Clave y Añadir Usuario */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Añadir Usuario Personalmente
            </h3>
          </div>

          <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Nombre Completo / Titular *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Carlos Viteri"
                required
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Correo Electrónico *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="usuario@liga.com"
                required
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Rol de Acceso */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Rol Asignado *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none cursor-pointer"
              >
                <option value="LEAGUE_ADMIN">Administrador de Liga / Operador de Mesa</option>
                <option value="SCOUT">Ojeador Deportivo / Scouting</option>
                <option value="SUPER_ADMIN">Administrador Maestro CIG</option>
              </select>
            </div>

            {/* Contraseña Asignada por el Administrador */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-semibold flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>Contraseña que Asignas *</span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Generar sugerida
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Escribe la clave que le das al usuario"
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 pr-9 text-white placeholder-slate-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Alerta */}
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Botón de Guardado */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando y Sincronizando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Añadir Usuario y Guardar Clave</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* COLUMNA 2: Lista Completa de Usuarios con Contraseñas Visibles para el Admin */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Directorio de Usuarios Registrados ({filteredUsers.length})
              </h3>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Usuario / Nombre</th>
                  <th className="py-2.5 px-3">Rol</th>
                  <th className="py-2.5 px-3">Contraseña Asignada</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredUsers.map((user) => {
                  const isVisible = visiblePasswords[user.id];
                  const isSuper = user.role === 'SUPER_ADMIN';

                  return (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Nombre y Correo */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {isSuper && <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          <span>{user.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isSuper 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : user.role === 'SCOUT'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Contraseña */}
                      <td className="py-3 px-3">
                        {editingUserId === user.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editedPassword}
                              onChange={(e) => setEditedPassword(e.target.value)}
                              placeholder="Nueva clave"
                              className="bg-slate-950 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-mono w-28 outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEditedPassword(user.email)}
                              className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[10px] hover:bg-amber-300 cursor-pointer"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] hover:text-white cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-mono text-slate-300">
                            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-amber-300 font-semibold min-w-[70px] text-center">
                              {isVisible ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title={isVisible ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setEditedPassword(user.password);
                              }}
                              className="text-[10px] text-cyan-400 hover:underline cursor-pointer ml-1"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                            user.status === 'ACTIVO'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                          title="Clic para cambiar estado"
                        >
                          {user.status === 'ACTIVO' ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>ACTIVO</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>SUSPENDIDO</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Copiar Credenciales para WhatsApp */}
                          <button
                            onClick={() => copyUserCredentials(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-all cursor-pointer"
                            title="Copiar credenciales completas para enviar por WhatsApp o Correo"
                          >
                            {copiedId === user.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Eliminar usuario */}
                          {user.email.toLowerCase() !== 'roly3d.rg@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className={`px-2 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                                confirmDeleteId === user.id
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-500/30'
                                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                              }`}
                              title={confirmDeleteId === user.id ? 'Pulsa nuevamente para confirmar eliminación' : 'Eliminar usuario'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {confirmDeleteId === user.id && <span>¿Confirmar?</span>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
