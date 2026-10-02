import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, Eye, EyeOff, ArrowRight, 
  AlertCircle, UserPlus, LogIn, User, CheckCircle
} from 'lucide-react';
import { UserRole } from '../../types';
import { authService, AppUser } from '../../services/authService';

interface LoginGateProps {
  onLoginSuccess: (authData: {
    role: UserRole;
    email: string;
    isSuperAdmin: boolean;
  }) => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLoginSuccess }) => {
  // Modo de visualización:
  // 'register': Registro ágil de interesados (sin selector de rol)
  // 'login': Iniciar Sesión para usuarios registrados (con correo y contraseña guardados en navegador/dispositivo)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Formulario Usuario Registrado (Inicio de Sesión)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Formulario de Registro para Interesados en la Plataforma
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Estados de retroalimentación
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manejo de Inicio de Sesión de Usuarios Registrados
  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor ingresa tu correo y contraseña registrados.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.verifyLogin(trimmedEmail, trimmedPassword);

      if (result.success) {
        setIsLoading(false);
        onLoginSuccess({
          role: result.role,
          email: result.user?.email || trimmedEmail,
          isSuperAdmin: result.isSuperAdmin,
        });
      } else {
        setIsLoading(false);
        setError(result.message || 'Credenciales no autorizadas. Por favor verifica tus datos.');
      }
    }, 250);
  };

  // Manejo de Registro Ágil para Interesados (Sin Perfil de Acceso)
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

    // Verificar si el correo ya existe
    const existingUsers = authService.getRegisteredUsers();
    if (existingUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
      setError('Este correo ya está registrado. Por favor inicia sesión.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Todo registro de interesado se crea como usuario activo de liga
      const newUser: AppUser = {
        id: `u-${Date.now()}`,
        email: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName || trimmedEmail.split('@')[0],
        role: 'LEAGUE_ADMIN',
        status: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      };

      authService.saveUser(newUser);

      setIsLoading(false);
      setSuccessMsg('✓ Registro completado exitosamente. Ingresando a DeporVerso...');

      setTimeout(() => {
        onLoginSuccess({
          role: newUser.role,
          email: newUser.email,
          isSuperAdmin: false,
        });
      }, 600);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black overflow-hidden font-sans">
      {/* Fondo con cuadrícula cibernética y resplandores discretos */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081325_1px,transparent_1px),linear-gradient(to_bottom,#081325_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta de Acceso */}
      <div className="relative w-full max-w-md bg-[#080d1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Cabecera y Marca Oficial */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Plataforma Oficial CIG</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Depor<span className="text-cyan-400">Verso</span>
          </h1>

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Gestión Oficial de Fútbol (11, Indor 9, Indor 7 y Fútsal 5), Sistema VAR y Vocalía Digital.
          </p>
        </div>

        {/* Pestañas de Navegación de Acceso (Solo Registro de Interesados e Ingreso) */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-white/10 gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
            className={`py-2.5 px-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              authMode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Registro de Interesados</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
            className={`py-2.5 px-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              authMode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>Ingresar a Mi Cuenta</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* PESTAÑA 1: REGISTRO DE INTERESADOS EN LA APP                     */}
        {/* ================================================================ */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} autoComplete="on" className="space-y-3.5 text-xs animate-in fade-in">
            <div className="bg-amber-400/10 border border-amber-400/20 p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-amber-300">Registro de Interesados:</strong> Crea tu cuenta gratuita para acceder a la plataforma. Tus datos quedarán guardados en tu dispositivo para acceso en 1 toque.
            </div>

            {/* Nombre Completo / Organización */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nombre o Nombre de Liga / Club *</span>
              </label>
              <input
                type="text"
                id="register-name"
                name="name"
                autoComplete="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej. Carlos Mendoza (Liga Barrial)"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none text-xs"
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
                id="register-email"
                name="username"
                autoComplete="username email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none text-xs"
              />
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
                  id="register-password"
                  name="new-password"
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  required
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
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

        {/* ================================================================ */}
        {/* PESTAÑA 2: INICIAR SESIÓN (USUARIOS REGISTRADOS / GUARDADOS)    */}
        {/* ================================================================ */}
        {authMode === 'login' && (
          <form onSubmit={handleUserLoginSubmit} autoComplete="on" className="space-y-4 animate-in fade-in">
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-cyan-300">Fácil Acceso:</strong> Ingresa con tu correo y contraseña guardada en tu navegador (PC, celular o tablet).
            </div>

            {/* Campo Correo Electrónico */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Correo Electrónico Registrado</span>
              </label>
              <input
                type="email"
                id="login-email"
                name="username"
                autoComplete="username email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="current-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña guardada"
                  required
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
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

        {/* Pie de Página Minimalista */}
        <div className="text-center text-[10px] text-slate-600 font-mono pt-1">
          Corporación e Innovación Guerra (CIG) © 2026. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};
