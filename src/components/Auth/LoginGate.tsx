import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Key, 
  AlertCircle, UserPlus, LogIn, User, CheckCircle 
} from 'lucide-react';
import { UserRole } from '../../types';
import { authService, AppUser, MASTER_ADMIN_PASSWORDS } from '../../services/authService';

interface LoginGateProps {
  onLoginSuccess: (authData: {
    role: UserRole;
    email: string;
    isSuperAdmin: boolean;
  }) => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLoginSuccess }) => {
  // Modo de visualización: 'register' (Panel de Registro obligatorio al iniciar) o 'login' (Iniciar Sesión)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Estados Formulario Inicio de Sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados Formulario de Registro (Exclusivo del Inicio)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('LEAGUE_ADMIN');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Estados de retroalimentación
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================================
  // DETECCIÓN GLOBAL DE TECLADO PARA ADMINISTRADOR:
  // El administrador solo debe digitar su clave desde el teclado (ej: 0000 o 1326)
  // para acceder inmediatamente a toda la app y a su panel maestro
  // =========================================================================
  useEffect(() => {
    let keyBuffer = '';
    let timeoutId: any = null;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Registrar caracteres presionados
      if (e.key && e.key.length === 1) {
        keyBuffer += e.key;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        keyBuffer = '';
      }, 3000);

      const bufferLower = keyBuffer.toLowerCase();

      // Si la secuencia tecleada coincide con alguna clave maestra de admin (0000, 1326, admin, etc.)
      const matchedMaster = MASTER_ADMIN_PASSWORDS.some(pass => bufferLower.endsWith(pass.toLowerCase()));

      if (matchedMaster) {
        keyBuffer = '';
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess({
            role: 'SUPER_ADMIN',
            email: 'roly3d.rg@gmail.com',
            isSuperAdmin: true,
          });
        }, 200);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearTimeout(timeoutId);
    };
  }, [onLoginSuccess]);

  // Manejo de Inicio de Sesión
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedPassword = password.trim();
    const trimmedEmail = email.trim();

    if (!trimmedPassword) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    // Regla estricta:
    // Ningún usuario puede ingresar sin contraseña y correo, el administrador entra con su contraseña
    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(trimmedPassword.toLowerCase());

    if (!trimmedEmail && !isMasterPassword) {
      setError('Ningún usuario puede ingresar sin correo y contraseña. El administrador entra con su contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.verifyLogin(trimmedEmail, trimmedPassword);

      if (result.success) {
        setIsLoading(false);
        onLoginSuccess({
          role: result.role,
          email: result.user?.email || trimmedEmail || 'admin@deporverso.com',
          isSuperAdmin: result.isSuperAdmin,
        });
      } else {
        setIsLoading(false);
        setError(result.message || 'Credenciales no autorizadas. Por favor verifica tus datos.');
      }
    }, 300);
  };

  // Manejo de Registro Único en el Inicio
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();
    const trimmedPassword = regPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('El correo y la contraseña son obligatorios.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Ingresa un formato de correo electrónico válido.');
      return;
    }

    if (trimmedPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Verificar si el usuario ya existe
    const existingUsers = authService.getRegisteredUsers();
    if (existingUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
      setError('Este correo ya está registrado. Por favor inicia sesión.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isSuper = regRole === 'SUPER_ADMIN' || trimmedEmail === 'roly3d.rg@gmail.com';

      const newUser: AppUser = {
        id: `u-${Date.now()}`,
        email: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName || trimmedEmail.split('@')[0],
        role: isSuper ? 'SUPER_ADMIN' : regRole,
        status: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      };

      authService.saveUser(newUser);

      setIsLoading(false);
      setSuccessMsg('✓ Registro completado exitosamente. Ingresando a la plataforma...');

      setTimeout(() => {
        onLoginSuccess({
          role: newUser.role,
          email: newUser.email,
          isSuperAdmin: isSuper,
        });
      }, 700);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black overflow-hidden font-sans">
      {/* Fondo estético con cuadrícula y resplandores cibernéticos */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081325_1px,transparent_1px),linear-gradient(to_bottom,#081325_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta de Inicio de Sesión y Registro Único */}
      <div className="relative w-full max-w-md bg-[#080d1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Cabecera y Marca Oficial */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>CIG Enterprise Security</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Depor<span className="text-cyan-400">Verso</span>
          </h1>

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Plataforma Global Multideporte, VAR a la Carta y Vocalía Digital.
          </p>
        </div>

        {/* Pestañas de Alternancia: Registro Obligatorio al Iniciar / Iniciar Sesión */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta (Registro)</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* PESTAÑA 1: INICIAR SESIÓN */}
        {/* ================================================================ */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Campo Correo Electrónico */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Correo Electrónico</span>
                </label>
                <span className="text-[10px] font-mono text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Obligatorio (Admin entra sin correo)
                </span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@deporverso.com"
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contraseña</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  Admin: entra con su contraseña
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña o clave de acceso"
                  autoFocus
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar a DeporVerso</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 2: EL ÚNICO REGISTRO EN LA APP (AL INICIO) */}
        {/* ================================================================ */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs animate-in fade-in">
            
            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nombre Completo / Titular *</span>
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej. Roberto Guerra"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Correo Electrónico *</span>
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@deporverso.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Rol de Acceso */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Perfil de Acceso</span>
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none cursor-pointer"
              >
                <option value="LEAGUE_ADMIN">Administrador de Liga / Operador de Mesa</option>
                <option value="SCOUT">Ojeador Deportivo / Scouting</option>
                <option value="SUPER_ADMIN">Administrador Maestro CIG</option>
              </select>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Contraseña *</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  required
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 pr-9 text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Botón de Registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Mi Cuenta & Entrar</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Guía Rápida Confidencial de Teclado */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Regla de Acceso:</strong> Ningún usuario puede ingresar sin correo y contraseña. El administrador entra directamente con su contraseña.
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>Usuario titular CIG:</span>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setEmail('roly3d.rg@gmail.com');
                setPassword('0000');
                setError(null);
              }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              roly3d.rg@gmail.com
            </button>
          </div>
        </div>

        {/* Pie de Página */}
        <div className="text-center text-[10px] text-slate-600 font-mono">
          Corporación e Innovación Guerra (CIG) © 2026. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};
